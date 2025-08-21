<template>
    <div class="min-h-screen p-6" @click="handlePageClick">
        <!-- 头部导航和设置 -->
        <PracticeHeader :dictionary-name="dictionaryName" :current-chapter="currentChapter"
            :available-chapters="availableChapters" :show-settings="showSettings" :is-paused="isPaused"
            @go-back="goBack" @chapter-change="onChapterChange" @toggle-settings="toggleSettings"
            @toggle-pause="togglePause" />

        <!-- 设置面板 -->
        <SettingsPanel :show="showSettings" :settings="settings" @close="showSettings = false"
            @reset-chapter="resetCurrentChapter" @start-dictation="startDictation"
            @randomize-chapter="randomizeChapter" />

        <!-- 进度条 -->
        <div class="max-w-4xl mx-auto mb-8">
            <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-coral-500 to-lemon-500 transition-all duration-500 ease-out"
                    :style="{ width: `${progress}%` }"></div>
            </div>
        </div>

        <!-- 主练习区域 -->
        <PracticeView v-if="currentDictionary && !isCompleted" :current-word="currentWord" :current-word-index="currentWordIndex"
            :current-chapter-words="currentChapterWords" :user-input="userInput" :settings="settings"
            :current-word-loop-progress="currentWordLoopProgress" :get-word-status="getWordStatus" :is-paused="isPaused"
            :is-completed="isCompleted" :current-time="timer.currentTime.value" :correct-count="correctCount"
            :current-wpm="currentWpm" :accuracy="accuracy" :error-message="errorMessage"
            :success-message="successMessage" :combo-count="comboSystem.comboCount.value"
            :show-combo="comboSystem.showCombo.value" @previous-word="previousWord" @skip-word="skipWord"
            @play-pronunciation="playPronunciation" @input="handleInput" @keydown="handleKeydown"
            ref="practiceViewRef" />

        <!-- 章节完成界面 -->
        <CompletionReport v-else-if="isCompleted" :practice-time="practiceTime" :correct-count="correctCount" :wpm="wpm"
            :accuracy="accuracy" :is-last-chapter="currentChapter >= availableChapters.length - 1"
            @start-dictation="startDictation" @next-chapter="nextChapter" />

        <!-- 加载状态 -->
        <div v-else class="text-center py-16">
            <div
                class="animate-spin w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4">
            </div>
            <p class="text-lg opacity-60">正在从词语的海洋里为你捞取单词...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDictionaryStore } from '@/stores/dictionary'
import { usePracticeStore } from '@/stores/practice'

// Import components
import PracticeHeader from '@/components/PracticeHeader.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import PracticeView from '@/components/PracticeView.vue'
import CompletionReport from '@/components/CompletionReport.vue'

// Import composables
import { useComboSystem } from '@/composables/useComboSystem'
import { usePracticeTimer } from '@/composables/usePracticeTimer'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

// 路由
const router = useRouter()
const route = useRoute()

// 存储
const dictionaryStore = useDictionaryStore()
const practiceStore = usePracticeStore()

// 响应式数据
const practiceViewRef = ref()
const showSettings = ref(false)
const isPaused = ref(false)

// 消息状态
const errorMessage = ref('')
const successMessage = ref('')

// 使用组合式函数
const comboSystem = useComboSystem(() => settings.value)
const timer = usePracticeTimer()

// 从 store 获取数据 (使用 storeToRefs 保持响应性)
const {
    currentDictionary,
    currentChapter,
    currentWordIndex,
    userInput,
    isCompleted,
    correctCount,
    totalCount,
    wpm,
    accuracy,
    settings,
    currentChapterWords,
    currentWord,
    progress,
    startTime,
    endTime,
    currentWordLoopProgress
} = storeToRefs(practiceStore)

// 重要：getWordStatus 是普通函数，不能通过 storeToRefs 解构
const getWordStatus = practiceStore.getWordStatus

// 计算属性
const availableChapters = computed(() => {
    if (!currentDictionary.value) return []
    const words = currentDictionary.value.words
    const chapters = []
    const wordsPerChapter = 20
    for (let i = 0; i < words.length; i += wordsPerChapter) {
        chapters.push(words.slice(i, i + wordsPerChapter))
    }
    return chapters
})

const dictionaryName = computed(() => currentDictionary.value?.name || '词库加载中...')

const practiceTime = computed(() => {
    if (!startTime.value || !endTime.value) return 0
    return endTime.value - startTime.value
})

// 修复 WPM 计算 - 基于正确输入的字符数
const currentWpm = computed(() => {
    if (!startTime.value || timer.currentTime.value === 0 || correctCount.value === 0) return 0
    const minutes = timer.currentTime.value / 60000
    // WPM = 正确字符数 / 5 / 分钟数 (标准WPM计算方式)
    const totalChars = correctCount.value * (currentWord.value?.word.length || 5)
    return Math.round((totalChars / 5) / minutes)
})

// 消息管理函数
const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
}

const setMessage = (message: string, isError: boolean, duration: number) => {
    clearMessages()
    if (isError) {
        errorMessage.value = message
    } else {
        successMessage.value = message
    }
    setTimeout(clearMessages, duration)
}

// 事件处理函数 - 修复统计逻辑
const handleInput = (event: Event) => {
    if (!currentWord.value) return

    const target = event.target as HTMLInputElement
    const newValue = target.value

    // 更新 store 中的 userInput
    userInput.value = newValue

    // 开始计时（仅在首次输入时）
    if (!startTime.value) {
        practiceStore.startPractice()
        timer.initializeTimer()
        timer.startTimer(() => isPaused.value || showSettings.value)
    }

    // 快速路径：空输入直接返回
    if (newValue.length === 0) {
        clearMessages()
        return
    }

    // 字符验证
    const currentWordValue = currentWord.value
    const currentWordLength = currentWordValue.word.length

    // 限制输入长度
    if (newValue.length > currentWordLength) {
        const trimmedValue = newValue.slice(0, currentWordLength)
        target.value = trimmedValue
        userInput.value = trimmedValue
        return
    }

    // 检查字符正确性
    const currentIndex = newValue.length - 1
    const currentChar = newValue[currentIndex].toLowerCase()
    const expectedChar = currentWordValue.word[currentIndex].toLowerCase()

    if (currentChar !== expectedChar) {
        // 错误处理
        practiceStore.markWordError(currentWordIndex.value)
        handleInputError()
    } else if (newValue.length === currentWordLength) {
        // 单词完成检查
        const isWordComplete = newValue.toLowerCase() === currentWordValue.word.toLowerCase()
        
        if (isWordComplete) {
            handleWordComplete()
        } else {
            handleWordIncomplete()
        }
    }
}

const handleInputError = () => {
    const mode = settings.value.practiceMode
    
    if (mode === 'hardcore') {
        setMessage('💥 硬核模式：全部重来！', true, 800)
        setTimeout(() => {
            practiceStore.resetChapter()
            timer.resetTimer()
        }, 50)
        comboSystem.resetCombo()
    } else if (mode === 'strict') {
        setMessage('⚡ 严格模式：从头开始！', true, 800)
        setTimeout(() => { userInput.value = '' }, 50)
        comboSystem.resetCombo()
    } else {
        setMessage('输入错误，请使用退格键修正', true, 1500)
        comboSystem.resetCombo()
    }
}

const handleWordComplete = () => {
    // 立即更新统计 - 这是关键修复点！
    correctCount.value++
    totalCount.value++
    
    setMessage('完美！', false, 250)
    comboSystem.incrementCombo((_count, message) => {
        successMessage.value = message
        setTimeout(() => clearMessages(), 1500)
    })

    // 使用 requestAnimationFrame 优化DOM更新时机
    requestAnimationFrame(() => {
        completeCurrentWord()
    })
}

const handleWordIncomplete = () => {
    const mode = settings.value.practiceMode
    
    // 错误时也要统计（用于准确率计算）
    totalCount.value++
    
    if (mode === 'normal') {
        setMessage('单词不完全正确，请检查并修正', true, 1500)
        comboSystem.resetCombo()
    } else {
        const message = mode === 'hardcore' ? '💥 硬核模式：全部重来！' : '⚡ 严格模式：从头开始！'
        setMessage(message, true, 800)
        
        setTimeout(() => {
            if (mode === 'hardcore') {
                practiceStore.resetChapter()
                timer.resetTimer()
            } else {
                userInput.value = ''
            }
        }, 50)
        comboSystem.resetCombo()
    }
}

// 修复统计更新逻辑
const completeCurrentWord = () => {
    if (!currentWord.value) return

    // 清除错误状态
    practiceStore.clearWordError(currentWordIndex.value)
    
    // 直接调用 nextWord，不通过 submitWord（避免重复统计）
    practiceStore.nextWord()
    
    // 延迟执行回调，避免阻塞主线程
    setTimeout(() => {
        if (settings.value.soundEnabled && currentWord.value && !isCompleted.value) {
            playPronunciation()
        }
    }, 100)
}

// 处理输入框相关的键盘事件（Enter, Backspace等）
const handleKeydown = (event: KeyboardEvent) => {
    if (isPaused.value) return

    if (event.key === 'Tab' || event.key === 'Enter') {
        event.preventDefault()
    }

    if (event.key === 'Backspace') {
        if (settings.value.practiceMode === 'normal') {
            clearMessages()
        } else if (settings.value.loopOnError && errorMessage.value) {
            clearMessages()
        }
    }
}

const toggleSettings = () => {
    showSettings.value = !showSettings.value
}

const togglePause = () => {
    isPaused.value = !isPaused.value
    if (!isPaused.value) {
        focusInput()
    }
}

const skipWord = () => {
    if (!currentWord.value) return
    
    // 跳过时也要统计
    totalCount.value++
    
    practiceStore.skipWord()
    // 立即播放下一个单词的发音（仅在章节未完成时）
    if (settings.value.soundEnabled && currentWord.value && !isCompleted.value) {
        playPronunciation()
    }
}

const playPronunciation = () => {
    if (!currentWord.value || !settings.value.soundEnabled) return
    practiceStore.playPronunciation(currentWord.value.word)
}

const nextChapter = () => {
    practiceStore.nextChapter()
    timer.resetTimer()
    nextTick(() => {
        focusInput()
        if (settings.value.soundEnabled && currentWord.value) {
            playPronunciation()
        }
    })
}

const startDictation = () => {
    settings.value.dictationMode = true
    settings.value.showTranslation = false
    nextChapter()
}

const resetCurrentChapter = () => {
    practiceStore.resetChapter()
    timer.resetTimer()
    nextTick(() => {
        focusInput()
        if (settings.value.soundEnabled && currentWord.value) {
            playPronunciation()
        }
    })
}

const randomizeChapter = () => {
    practiceStore.shuffleCurrentChapter()
    timer.resetTimer()
    nextTick(() => {
        focusInput()
        if (settings.value.soundEnabled && currentWord.value) {
            playPronunciation()
        }
    })
}

const onChapterChange = (value: string) => {
    currentChapter.value = parseInt(value)
    practiceStore.resetChapter()
    timer.resetTimer()
    nextTick(() => {
        focusInput()
        if (settings.value.soundEnabled && currentWord.value) {
            playPronunciation()
        }
    })
}

// 优化焦点管理：减少不必要的DOM操作
let focusTimeoutId: number | null = null

const focusInput = () => {
    // 清除之前的定时器，避免重复执行
    if (focusTimeoutId) {
        clearTimeout(focusTimeoutId)
        focusTimeoutId = null
    }
    
    if (practiceViewRef.value?.inputRef && !isPaused.value && !showSettings.value) {
        const inputElement = practiceViewRef.value.inputRef
        
        // 检查是否已经聚焦，避免不必要的操作
        if (document.activeElement === inputElement) {
            return
        }
        
        // 使用 requestAnimationFrame 优化DOM操作时机
        requestAnimationFrame(() => {
            if (!isPaused.value && !showSettings.value) {
                inputElement.focus()
                inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length)
            }
        })
    }
}

const handlePageClick = (event: Event) => {
    const target = event.target as HTMLElement

    // 如果点击的是 select 元素或其子元素，不处理
    if (target.tagName === 'SELECT' || target.closest('select')) {
        return
    }

    // 如果设置面板打开，或点击的是设置面板内的元素，不处理
    if (showSettings.value || target.closest('.settings-panel')) {
        return
    }

    // 如果当前处于暂停状态，不处理
    if (isPaused.value) {
        return
    }

    // 其他情况下聚焦输入框
    focusInput()
}

const goBack = () => {
    router.push('/')
}

// 优化：previousWord 改为"仅查看"模式，不影响练习状态
const previousWord = () => {
    if (currentWordIndex.value > 0) {
        // 显示一个非模态的预览窗口，而不是直接切换单词
        const prevWord = currentChapterWords.value[currentWordIndex.value - 1]
        if (prevWord) {
            // 可以在这里实现一个小的预览提示
            successMessage.value = `上一个单词: ${prevWord.word} - ${prevWord.translation}`
            setTimeout(() => clearMessages(), 2000)
        }
    }
}

// 设置键盘快捷键
useKeyboardShortcuts({
    onToggleSettings: toggleSettings,
    onTogglePause: togglePause,
    onSkipWord: skipWord,
    onNextChapter: () => {
        if (availableChapters.value.length > 1) {
            const nextChapterIndex = (currentChapter.value + 1) % availableChapters.value.length
            currentChapter.value = nextChapterIndex
            onChapterChange(nextChapterIndex.toString())
        }
    },
    onPlayPronunciation: playPronunciation,
    onResetChapter: resetCurrentChapter,
    onToggleDictation: () => {
        settings.value.dictationMode = !settings.value.dictationMode
    },
    onToggleTranslation: () => {
        settings.value.showTranslation = !settings.value.showTranslation
    },
    onNextChapterOnComplete: () => {
        const isLastChapter = currentChapter.value >= availableChapters.value.length - 1
        if (isLastChapter) {
            currentChapter.value = 0
            practiceStore.resetChapter()
            timer.resetTimer()
            nextTick(() => {
                focusInput()
                if (settings.value.soundEnabled && currentWord.value) {
                    playPronunciation()
                }
            })
        } else {
            nextChapter()
        }
    },
    onFocusInput: focusInput
}, () => ({
    showSettings: showSettings.value,
    isPaused: isPaused.value,
    isCompleted: isCompleted.value,
    availableChaptersLength: availableChapters.value.length,
    currentChapter: currentChapter.value
}), () => ({
    currentWord: currentWord.value,
    userInput: userInput.value
}))

onMounted(async () => {
    // 初始化词库数据
    await dictionaryStore.initDictionaries()

    // 从路由参数获取词库ID
    const dictionaryId = route.params.id as string
    if (!dictionaryId) {
        router.push('/')
        return
    }

    const dict = await dictionaryStore.ensureDictionaryLoadedById(dictionaryId)
    if (!dict) {
        router.push('/')
        return
    }

    practiceStore.setDictionary(dict)

    // 等待组件完全渲染后立即播放
    await nextTick()
    if (settings.value.soundEnabled && currentWord.value) {
        playPronunciation()
    }

    // 自动聚焦输入框
    nextTick(() => focusInput())
})
</script>

<style scoped></style>