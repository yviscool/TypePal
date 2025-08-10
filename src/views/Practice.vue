<template>
    <div class="min-h-screen p-6" @click="focusInput">
        <!-- 头部导航和设置 -->
        <header class="max-w-4xl mx-auto mb-8">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                    <button @click="goBack" class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        title="返回词库">
                        <div class="i-ph-arrow-left text-xl"></div>
                    </button>
                    <div>
                        <h1 class="text-2xl font-bold">{{ dictionaryName }}</h1>
                        <p class="text-sm opacity-60">第 {{ currentChapter + 1 }} 章</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <!-- 设置展开按钮 -->
                    <button @click="showSettings = !showSettings"
                        class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        :class="{ 'bg-white/10': showSettings }" title="练习设置">
                        <div class="i-ph-gear text-xl" :class="{ 'rotate-90': showSettings }"></div>
                    </button>

                    <!-- 暂停按钮 -->
                    <button @click="togglePause"
                        class="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
                        {{ isPaused ? '继续' : '暂停' }}
                    </button>
                </div>
            </div>

            <!-- 设置区域 - 展开式 -->
            <div v-if="showSettings"
                class="mb-6 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- 发音设置 -->
                    <div class="space-y-3">
                        <label class="flex items-center gap-2 text-sm font-semibold">
                            <div class="i-ph-speaker-high text-lg text-coral-500"></div>
                            发音设置
                        </label>
                        <select v-model="settings.pronunciation"
                            class="w-full px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 focus:outline-none text-black text-sm font-medium transition-all duration-300 hover:bg-white/20 ">
                            <option value="us" class=" py-2">🇺🇸 美式英语</option>
                            <option value="uk" class=" py-2">🇬🇧 英式英语</option>
                        </select>
                    </div>
                    <!-- 显示设置 -->
                    <div class="space-y-3">
                        <label class="flex items-center gap-2 text-sm font-semibold">
                            <div class="i-ph-eye text-lg text-lemon-500"></div>
                            显示选项
                        </label>
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 text-sm cursor-pointer group">
                                <div class="relative">
                                    <input v-model="settings.showTranslation" type="checkbox"
                                        class="w-5 h-5 rounded-lg border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-coral-500 checked:to-coral-600 checked:border-coral-500 transition-all duration-300 focus:ring-2 focus:ring-coral-500/20">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                        </div>
                                    </div>
                                </div>
                                <span
                                    class="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">显示释义</span>
                            </label>
                            <label class="flex items-center gap-3 text-sm cursor-pointer group">
                                <div class="relative">
                                    <input v-model="settings.dictationMode" type="checkbox"
                                        class="w-5 h-5 rounded-lg border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-coral-500 checked:to-coral-600 checked:border-coral-500 transition-all duration-300 focus:ring-2 focus:ring-coral-500/20">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                        </div>
                                    </div>
                                </div>
                                <span
                                    class="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">默写模式</span>
                            </label>
                        </div>
                    </div>

                    <!-- 练习设置 -->
                    <div class="space-y-3">
                        <label class="flex items-center gap-2 text-sm font-semibold">
                            <div class="i-ph-gear text-lg text-electric-blue"></div>
                            练习选项
                        </label>
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 text-sm cursor-pointer group">
                                <div class="relative">
                                    <input v-model="settings.loopOnError" type="checkbox"
                                        class="w-5 h-5 rounded-lg border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-electric-blue checked:to-electric-blue/80 checked:border-electric-blue transition-all duration-300 focus:ring-2 focus:ring-electric-blue/20">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                        </div>
                                    </div>
                                </div>
                                <span
                                    class="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">错误时循环</span>
                            </label>
                            <label class="flex items-center gap-3 text-sm cursor-pointer group">
                                <div class="relative">
                                    <input v-model="settings.soundEnabled" type="checkbox"
                                        class="w-5 h-5 rounded-lg border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-electric-blue checked:to-electric-blue/80 checked:border-electric-blue transition-all duration-300 focus:ring-2 focus:ring-electric-blue/20">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                        </div>
                                    </div>
                                </div>
                                <span
                                    class="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">发音提示</span>
                            </label>
                        </div>
                    </div>

                    <!-- 快捷操作 -->
                    <div class="space-y-3">
                        <label class="flex items-center gap-2 text-sm font-semibold">
                            <div class="i-ph-lightning text-lg text-cyber-pink"></div>
                            快捷操作
                        </label>
                        <div class="space-y-3">
                            <button @click="resetCurrentChapter"
                                class="w-full px-4 py-3 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-gray-800 dark:text-white/80 hover:text-gray-900 dark:hover:text-white group">
                                <div class="flex items-center justify-center gap-2">
                                    <div
                                        class="i-ph-arrow-clockwise text-base group-hover:rotate-180 transition-transform duration-500">
                                    </div>
                                    重置章节
                                </div>
                            </button>
                            <button @click="startDictation"
                                class="w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-coral-500/20 to-coral-600/20 backdrop-blur-sm border border-coral-500/40 rounded-xl hover:from-coral-500/30 hover:to-coral-600/30 hover:border-coral-500/60 transition-all duration-300 text-coral-600 dark:text-coral-200 hover:text-coral-700 dark:hover:text-white group">
                                <div class="flex items-center justify-center gap-2">
                                    <div
                                        class="i-ph-pencil-simple text-base group-hover:scale-110 transition-transform duration-300">
                                    </div>
                                    开启默写
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 进度条 -->
            <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-coral-500 to-lemon-500 transition-all duration-500 ease-out"
                    :style="{ width: `${progress}%` }"></div>
            </div>
        </header>



        <!-- 主练习区域 -->
        <div class="max-w-4xl mx-auto mt-20 relative">
            <div v-if="!isCompleted && currentWord" class="text-center">
                <!-- 浮动导航按钮 - 上一个单词 (左侧) -->
                <div class="fixed left-4 md:left-8 top transform -translate-y-1/2 z-10">
                    <button @click="previousWord" :disabled="currentWordIndex === 0"
                        class="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                        title="上一个单词">
                        <div class="flex items-center gap-3">
                            <div
                                class="i-ph-arrow-left text-xl text-coral-400 group-hover:text-coral-300 transition-colors duration-200">
                            </div>
                            <div v-if="currentWordIndex > 0" class="hidden md:block text-left">
                                <div class="text-sm font-bold text-black/90">{{ currentChapterWords[currentWordIndex -
                                    1]?.word }}</div>
                                <div class="text-xs text-black/60 max-w-20 truncate">{{
                                    currentChapterWords[currentWordIndex - 1]?.translation }}</div>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- 浮动导航按钮 - 下一个单词 (右侧) -->
                <div class="fixed right-4 md:right-8 top transform -translate-y-1/2 z-10">
                    <button @click="skipWord" :disabled="currentWordIndex >= currentChapterWords.length - 1"
                        class="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                        title="下一个单词">
                        <div class="flex items-center gap-3">
                            <div v-if="currentWordIndex < currentChapterWords.length - 1"
                                class="hidden md:block text-right">
                                <div class="text-sm font-bold text-black/90">{{ currentChapterWords[currentWordIndex +
                                    1]?.word }}</div>
                                <div class="text-xs text-black/60 max-w-20 truncate">{{
                                    currentChapterWords[currentWordIndex + 1]?.translation }}</div>
                            </div>
                            <div
                                class="i-ph-arrow-right text-xl text-coral-400 group-hover:text-coral-300 transition-colors duration-200">
                            </div>
                        </div>
                    </button>
                </div>

                <!-- 当前单词显示 -->
                <div class="mb-16 relative">
                    <!-- 单词显示区域 - 完全居中 -->
                    <div class="flex justify-center mb-8">
                        <div
                            class="text-7xl md:text-8xl font-bold tracking-wider select-none flex items-center relative">
                            <span v-for="(char, index) in currentWord.word" :key="index" :class="getCharClass(index)"
                                class="inline-block transition-all duration-300 ease-out transform hover:scale-110"
                                :style="getCharStyle(index)">
                                {{ char }}
                            </span>
                        </div>
                    </div>

                    <!-- 发音按钮 - 绝对定位到右上角 -->
                    <button @click="playPronunciation"
                        class="absolute top-4 right-4 md:right-8 p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 group shadow-lg"
                        title="播放发音">
                        <div class="i-ph-speaker-high text-2xl group-hover:animate-pulse text-coral-400"></div>
                    </button>
                    <!-- 音标 -->
                    <div v-if="currentWord.phonetic && !settings.dictationMode"
                        class="text-xl opacity-60 mb-6 font-mono tracking-wide">
                        {{ currentWord.phonetic }}
                    </div>

                    <!-- 释义 -->
                    <div v-if="settings.showTranslation && !settings.dictationMode"
                        class="text-2xl opacity-80 font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
                        {{ currentWord.translation }}
                    </div>
                </div>
                <!-- 隐藏的输入框用于捕获键盘输入 -->
                <input ref="inputRef" v-model="userInput" type="text" class="fixed opacity-0 pointer-events-none"
                    style="left: -9999px; top: -9999px;" @input="onInput" @keydown="onKeydown" :disabled="isPaused"
                    autocomplete="off" spellcheck="false">

                <!-- 实时统计信息 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-coral-500/30 transition-all duration-300 group">
                        <div
                            class="text-xl font-bold text-coral-500 group-hover:scale-105 transition-transform duration-200">
                            {{ formatTime(currentTime) }}</div>
                        <div class="text-sm opacity-60 font-medium">用时</div>
                    </div>

                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-lemon-500/30 transition-all duration-300 group">
                        <div
                            class="text-xl font-bold text-lemon-500 group-hover:scale-105 transition-transform duration-200">
                            {{ correctCount }}</div>
                        <div class="text-sm opacity-60 font-medium">正确数</div>
                    </div>

                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-electric-blue/30 transition-all duration-300 group">
                        <div
                            class="text-xl font-bold text-electric-blue group-hover:scale-105 transition-transform duration-200">
                            {{ currentWpm }}</div>
                        <div class="text-sm opacity-60 font-medium">WPM</div>
                    </div>

                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-cyber-pink/30 transition-all duration-300 group">
                        <div
                            class="text-xl font-bold text-cyber-pink group-hover:scale-105 transition-transform duration-200">
                            {{ accuracy }}%</div>
                        <div class="text-sm opacity-60 font-medium">正确率</div>
                    </div>
                </div>

                <!-- 提示信息 -->
                <div class="text-lg opacity-60 mb-8 min-h-[3rem] flex items-center justify-center">
                    <div v-if="errorMessage"
                        class="text-red-400 animate-bounce font-medium px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                        {{ errorMessage }}
                    </div>
                    <div v-else-if="successMessage"
                        class="text-green-400 animate-pulse font-medium px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                        {{ successMessage }}
                    </div>
                    <div v-else-if="!settings.dictationMode" class="opacity-40 font-medium">
                        开始输入单词...
                    </div>
                    <div v-else class="opacity-40 font-medium">
                        听音输入单词...
                    </div>
                </div>

                <!-- 单词进度指示器 -->
                <div class="flex flex-col items-center justify-center gap-4 mb-8">
                    <span
                        class="text-sm opacity-60 font-medium px-3 py-1 bg-white/10 rounded-full border border-white/20">
                        {{ currentWordIndex + 1 }} / {{ currentChapterWords.length }}
                    </span>
                    <div class="flex items-center justify-center gap-2 max-w-full overflow-x-auto px-4">
                        <div v-for="(_, index) in currentChapterWords" :key="index"
                            class="w-3 h-3 rounded-full transition-all duration-300 ease-out flex-shrink-0"
                            :class="index === currentWordIndex ? 'bg-coral-500 scale-150 shadow-lg shadow-coral-500/50 ring-2 ring-coral-500/30' :
                                index < currentWordIndex ? 'bg-green-400 shadow-sm scale-110' : 'bg-white/20 hover:bg-white/30'">
                        </div>
                    </div>
                </div>

                <!-- 快捷键提示 -->
                <div class="flex justify-center gap-6 text-xs opacity-40 font-medium">
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20">Space</kbd>
                        跳过
                    </span>
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20">Esc</kbd>
                        暂停
                    </span>
                </div>
            </div>

            <!-- 章节完成界面 -->
            <div v-else-if="isCompleted" class="text-center">
                <div class="mb-8">
                    <div
                        class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-coral-500 to-lemon-500 rounded-full flex items-center justify-center">
                        <div class="i-ph-trophy text-white text-4xl"></div>
                    </div>

                    <h2 class="text-3xl font-bold mb-4">章节完成！</h2>
                    <p class="text-lg opacity-80 mb-8">太棒了！你和键盘简直是天作之合</p>
                </div>

                <!-- 统计信息 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div class="text-2xl font-bold text-coral-500">{{ formatTime(practiceTime) }}</div>
                        <div class="text-sm opacity-60">用时</div>
                    </div>

                    <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div class="text-2xl font-bold text-lemon-500">{{ correctCount }}</div>
                        <div class="text-sm opacity-60">正确数</div>
                    </div>

                    <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div class="text-2xl font-bold text-electric-blue">{{ wpm }}</div>
                        <div class="text-sm opacity-60">WPM</div>
                    </div>

                    <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div class="text-2xl font-bold text-cyber-pink">{{ accuracy }}%</div>
                        <div class="text-sm opacity-60">正确率</div>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button @click="nextChapter"
                        class="px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        再来一轮，状态正佳！
                    </button>

                    <button @click="startDictation"
                        class="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-medium text-lg hover:bg-white/20 transition-all duration-300">
                        开启默写，检验成果！
                    </button>
                </div>
            </div>

            <!-- 加载状态 -->
            <div v-else class="text-center py-16">
                <div
                    class="animate-spin w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4">
                </div>
                <p class="text-lg opacity-60">正在从词语的海洋里为你捞取单词...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDictionaryStore } from '@/stores/dictionary'
import { usePracticeStore } from '@/stores/practice'

// 路由
const router = useRouter()
const route = useRoute()

// 存储
const dictionaryStore = useDictionaryStore()
const practiceStore = usePracticeStore()

// 响应式数据
const inputRef = ref<HTMLInputElement>()
const showSettings = ref(false)
const isPaused = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const currentTime = ref(0)
const timeInterval = ref<number | null>(null)

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
    endTime
} = storeToRefs(practiceStore)

// 计算属性
const dictionaryName = computed(() => currentDictionary.value?.name || '词库加载中...')

const practiceTime = computed(() => {
    if (!startTime.value || !endTime.value) return 0
    return endTime.value - startTime.value
})

const currentWpm = computed(() => {
    if (!startTime.value || currentTime.value === 0 || totalCount.value === 0) return 0
    const minutes = currentTime.value / 60000
    return Math.round(totalCount.value / minutes)
})

// 字符样式函数
const getCharClass = (index: number) => {
    if (!userInput.value || index >= userInput.value.length) {
        return 'text-gray-400 dark:text-gray-500'
    }

    const userChar = userInput.value[index]
    const correctChar = currentWord.value?.word[index]

    if (userChar === correctChar) {
        return 'text-white bg-green-500 rounded-md px-1 shadow-lg'
    } else {
        return 'text-white bg-red-500 rounded-md px-1 animate-shake'
    }
}

const getCharStyle = (index: number) => {
    if (!userInput.value || index >= userInput.value.length) {
        return {}
    }

    const userChar = userInput.value[index]
    const correctChar = currentWord.value?.word[index]

    if (userChar === correctChar) {
        return {
            transform: 'scale(1.05)',
            textShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
        }
    } else {
        return {
            transform: 'scale(1.1)',
            textShadow: '0 0 10px rgba(248, 113, 113, 0.5)'
        }
    }
}

const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 事件处理函数
const onInput = () => {
    if (isPaused.value || !currentWord.value) return

    clearMessages()

    // 开始计时
    if (!startTime.value) {
        practiceStore.startPractice()
        startTimer()
    }

    // 限制输入长度不超过当前单词长度
    if (userInput.value.length > currentWord.value.word.length) {
        userInput.value = userInput.value.slice(0, currentWord.value.word.length)
        return
    }

    // 检查当前输入的字符是否正确
    if (userInput.value.length > 0) {
        const currentIndex = userInput.value.length - 1
        const currentChar = userInput.value[currentIndex]
        const expectedChar = currentWord.value.word[currentIndex]

        if (currentChar !== expectedChar) {
            // 错误输入，显示错误提示并从头开始
            errorMessage.value = '哎呀，手指打滑了~ 从头开始！'
            setTimeout(clearMessages, 800)

            // 打错需要从头开始
            userInput.value = ''
            // 错误时不增加计数，让用户重新输入同一个单词
        } else {
            // 正确输入，检查是否完成单词
            if (userInput.value.length === currentWord.value.word.length) {
                // 单词完成，显示成功消息并自动跳转
                successMessage.value = '完美！'

                setTimeout(() => {
                    clearMessages()
                    completeCurrentWord()
                }, 200)
            }
        }
    }
}

const completeCurrentWord = () => {
    if (!currentWord.value) return

    // 直接增加正确计数和总计数
    totalCount.value++
    correctCount.value++

    // 移动到下一个单词
    practiceStore.nextWord()

    // 自动播放下一个单词的发音
    if (settings.value.soundEnabled && currentWord.value) {
        setTimeout(() => {
            playPronunciation()
        }, 300)
    }
}

const onKeydown = (event: KeyboardEvent) => {
    if (isPaused.value) return

    // 阻止某些默认行为
    if (event.key === 'Tab' || event.key === 'Enter') {
        event.preventDefault()
    }

    // 处理退格键
    if (event.key === 'Backspace') {
        if (settings.value.loopOnError && errorMessage.value) {
            // 在循环模式下，如果有错误，允许退格
            clearMessages()
        }
    }

    // 处理空格键 - 跳过当前单词
    if (event.key === ' ') {
        event.preventDefault()
        skipWord()
    }
}

const nextWord = () => {
    // Use store method to handle word progression
    practiceStore.nextWord()
}

const skipWord = () => {
    if (!currentWord.value) return

    // 使用 store 的 skipWord 方法来处理跳过逻辑
    practiceStore.skipWord()

    // 自动播放下一个单词的发音
    if (settings.value.soundEnabled && currentWord.value) {
        setTimeout(() => {
            playPronunciation()
        }, 300)
    }
}

const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
}

const togglePause = () => {
    isPaused.value = !isPaused.value
    if (!isPaused.value) {
        nextTick(() => {
            inputRef.value?.focus()
        })
    }
}

const toggleTheme = () => {
    // 简单的主题切换逻辑
    document.documentElement.classList.toggle('dark')
}

const playPronunciation = () => {
    if (currentWord.value) {
        practiceStore.playPronunciation(currentWord.value.word)
    }
}

const nextChapter = () => {
    // 使用 store 的方法来处理章节切换
    practiceStore.nextChapter()

    nextTick(() => {
        inputRef.value?.focus()
    })
}

const startDictation = () => {
    settings.value.dictationMode = true
    settings.value.showTranslation = false
    nextChapter()
}

const resetCurrentChapter = () => {
    // 重置当前章节的练习状态
    practiceStore.resetChapter()

    nextTick(() => {
        inputRef.value?.focus()
    })
}

const focusInput = () => {
    if (inputRef.value && !isPaused.value && !showSettings.value) {
        inputRef.value.focus()
    }
}

const goBack = () => {
    router.push('/')
}

const previousWord = () => {
    if (currentWordIndex.value > 0) {
        // 直接操作索引，但清空用户输入
        currentWordIndex.value--
        userInput.value = ''
        clearMessages()

        nextTick(() => {
            inputRef.value?.focus()
        })
    }
}

// 启动实时计时器
const startTimer = () => {
    if (timeInterval.value) return

    timeInterval.value = setInterval(() => {
        if (startTime.value && !isPaused.value) {
            currentTime.value = Date.now() - startTime.value
        }
    }, 100) as unknown as number
}

// 停止计时器
const stopTimer = () => {
    if (timeInterval.value) {
        clearInterval(timeInterval.value)
        timeInterval.value = null
    }
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        if (showSettings.value) {
            showSettings.value = false
        } else {
            togglePause()
        }
    }

    // 确保输入框始终聚焦
    if (!isPaused.value && !showSettings.value && inputRef.value && document.activeElement !== inputRef.value) {
        inputRef.value.focus()
    }
}

onMounted(async () => {
    // 初始化词库数据
    dictionaryStore.initDictionaries()

    // 从路由参数获取词库ID
    const dictionaryId = route.params.id as string
    if (dictionaryId) {
        const dictionary = dictionaryStore.getDictionaryById(dictionaryId)
        if (dictionary) {
            practiceStore.setDictionary(dictionary)
        } else {
            // 如果找不到词库，返回首页
            router.push('/')
            return
        }
    } else {
        // 如果没有词库ID，返回首页
        router.push('/')
        return
    }

    // 自动聚焦输入框
    nextTick(() => {
        inputRef.value?.focus()
    })

    // 添加键盘事件监听
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

.animate-shake {
    animation: shake 0.5s ease-in-out;
}

input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.rotate-90 {
    transform: rotate(90deg);
    transition: transform 0.3s ease;
}
</style>