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
        <PracticeView v-if="!isCompleted" :current-word="currentWord" :current-word-index="currentWordIndex"
            :current-chapter-words="currentChapterWords" :user-input="userInput" :settings="settings"
            :current-word-loop-progress="currentWordLoopProgress" :get-word-status="getWordStatus" :is-paused="isPaused"
            :is-completed="isCompleted" :current-time="timer.currentTime.value" :correct-count="correctCount"
            :current-wpm="timer.currentWpm.value" :accuracy="accuracy" :error-message="inputHandler.errorMessage.value"
            :success-message="inputHandler.successMessage.value" :combo-count="comboSystem.comboCount.value"
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
import { usePracticeInput } from '@/composables/usePracticeInput'
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

// 使用组合式函数
const inputHandler = usePracticeInput()
const comboSystem = useComboSystem()
const timer = usePracticeTimer()

// 从 store 获取数据 (使用 storeToRefs 保持响应性)
const {
    currentDictionary,
    currentChapter,
    currentWordIndex,
    userInput,
    isCompleted,
    correctCount,
    wpm,
    accuracy,
    settings,
    currentChapterWords,
    currentWord,
    progress,
    startTime,
    endTime,
    currentWordLoopProgress,
    getWordStatus
} = storeToRefs(practiceStore)

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

// 事件处理函数
const handleInput = (event: Event) => {
    inputHandler.onInput(
        event,
        () => comboSystem.incrementCombo((_count, message) => {
            inputHandler.successMessage.value = message
            setTimeout(() => inputHandler.clearMessages(), 1500)
        }),
        () => {
            const previousCount = comboSystem.resetCombo()
            if (previousCount >= 3) {
                inputHandler.errorMessage.value = `💔 连击中断！之前连击 x${previousCount}`
            }
        },
        timer.startTimer,
        () => {
            // 单词完成后播放下一个单词的发音
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }
    )
}

const handleKeydown = (event: KeyboardEvent) => {
    inputHandler.onKeydown(event, isPaused.value, skipWord)
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
    practiceStore.skipWord()
    if (settings.value.soundEnabled && currentWord.value) {
        setTimeout(() => playPronunciation(), 100)
    }
}

const playPronunciation = async () => {
    if (!currentWord.value || !settings.value.soundEnabled) return

    try {
        const url = practiceStore.getPronunciationUrl(currentWord.value.word)
        if (url) {
            const audio = new Audio(url)
            audio.preload = 'auto'
            audio.volume = 0.8

            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve, { once: true })
                audio.addEventListener('error', reject, { once: true })
                setTimeout(() => reject(new Error('Audio load timeout')), 3000)
            })

            await audio.play()
        }
    } catch (error) {
        console.warn('发音播放失败:', error)
    }
}

const nextChapter = () => {
    practiceStore.nextChapter()
    nextTick(() => {
        focusInput()
        setTimeout(() => {
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }, 300)
    })
}

const startDictation = () => {
    settings.value.dictationMode = true
    settings.value.showTranslation = false
    nextChapter()
}

const resetCurrentChapter = () => {
    practiceStore.resetChapter()
    nextTick(() => {
        focusInput()
        setTimeout(() => {
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }, 300)
    })
}

const randomizeChapter = () => {
    practiceStore.shuffleCurrentChapter()
    nextTick(() => {
        focusInput()
        setTimeout(() => {
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }, 300)
    })
}

const onChapterChange = (value: string) => {
    currentChapter.value = parseInt(value)
    practiceStore.resetChapter()
    nextTick(() => {
        focusInput()
        setTimeout(() => {
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }, 300)
    })
}

const focusInput = () => {
    if (practiceViewRef.value?.inputRef && !isPaused.value && !showSettings.value) {
        practiceViewRef.value.inputRef.focus()
    }
}

const handlePageClick = (event: Event) => {
    const target = event.target as HTMLElement
    if (target.tagName === 'SELECT' || target.closest('select')) {
        return
    }
    if (target.closest('.settings-panel') || showSettings.value) {
        return
    }
    focusInput()
}

const goBack = () => {
    router.push('/')
}

const previousWord = () => {
    if (currentWordIndex.value > 0) {
        currentWordIndex.value--
        userInput.value = ''
        inputHandler.clearMessages()
        nextTick(() => focusInput())
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
}))

onMounted(async () => {
    // 初始化词库数据
    dictionaryStore.initDictionaries()

    // 从路由参数获取词库ID
    const dictionaryId = route.params.id as string
    if (dictionaryId) {
        const dictionary = dictionaryStore.getDictionaryById(dictionaryId)
        if (dictionary) {
            practiceStore.setDictionary(dictionary)

            // 等待组件完全渲染后再播放第一个单词的发音
            await nextTick()
            setTimeout(() => {
                if (settings.value.soundEnabled && currentWord.value) {
                    playPronunciation()
                }
            }, 200)
        } else {
            router.push('/')
            return
        }
    } else {
        router.push('/')
        return
    }

    // 自动聚焦输入框
    nextTick(() => focusInput())
})
</script>

<style scoped></style>