<template>
  <div class="max-w-4xl mx-auto mt-30 relative">
    <div v-if="!isCompleted && currentWord" class="text-center">
      <!-- 浮动导航按钮 - 上一个单词 (左侧) -->
      <div class="fixed left-4 md:left-8 top transform -translate-y-1/2 z-10">
        <button @click="$emit('previousWord')" :disabled="currentWordIndex === 0"
          class="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          title="上一个单词">
          <div class="flex items-center gap-3">
            <div class="i-ph-arrow-left text-xl text-coral-400 group-hover:text-coral-300 transition-colors duration-200"></div>
            <div v-if="currentWordIndex > 0" class="hidden md:block text-left">
              <div class="text-sm font-bold text-black/90">{{ currentChapterWords[currentWordIndex - 1]?.word }}</div>
              <div class="text-xs text-black/60 max-w-20 truncate">{{ currentChapterWords[currentWordIndex - 1]?.translation }}</div>
            </div>
          </div>
        </button>
      </div>

      <!-- 浮动导航按钮 - 下一个单词 (右侧) -->
      <div class="fixed right-4 md:right-8 top transform -translate-y-1/2 z-10">
        <button @click="$emit('skipWord')" :disabled="currentWordIndex >= currentChapterWords.length - 1"
          class="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          title="下一个单词">
          <div class="flex items-center gap-3">
            <div v-if="currentWordIndex < currentChapterWords.length - 1" class="hidden md:block text-right">
              <div class="text-sm font-bold text-black/90">{{ currentChapterWords[currentWordIndex + 1]?.word }}</div>
              <div class="text-xs text-black/60 max-w-20 truncate">{{ currentChapterWords[currentWordIndex + 1]?.translation }}</div>
            </div>
            <div class="i-ph-arrow-right text-xl text-coral-400 group-hover:text-coral-300 transition-colors duration-200"></div>
          </div>
        </button>
      </div>

      <!-- 当前单词显示 -->
      <div class="mb-16 relative">
        <!-- DMC风格连击显示 - 使用 ComboDisplay 组件 -->
        <ComboDisplay :combo-count="comboCount" :show-combo="showCombo" :effects-level="settings.comboEffectsLevel" />

        <!-- 单词显示区域 - 完全居中 -->
        <div class="flex justify-center mb-8">
          <div class="relative inline-block">
            <div class="text-7xl md:text-8xl font-bold tracking-wider select-none flex items-center"
              :class="{ 'animate-word-shake': errorMessage }">
              <span v-for="(char, index) in currentWord.word" :key="index" :class="getCharClass(index)"
                class="inline-block transition-all duration-300 ease-out transform hover:scale-110"
                :style="getCharStyle(index)">
                {{ char === ' ' ? '␣' : char }}
              </span>
            </div>
            <!-- 发音按钮：始终在单词容器右侧 -->
            <button @click="$emit('playPronunciation')"
              class="absolute top-1/2 -translate-y-1/2 left-full ml-4 p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 group shadow-lg"
              title="播放发音">
              <div class="i-ph-speaker-high text-2xl group-hover:animate-pulse text-coral-400"></div>
            </button>
          </div>
        </div>

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

        <!-- 单词循环进度指示器 -->
        <div v-if="settings.wordLoopCount !== '1'" class="mb-6 flex justify-center">
          <div class="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="text-sm opacity-60 font-medium">循环进度</div>
              <div class="flex items-center gap-2">
                <div v-if="!currentWordLoopProgress.isInfinite" class="flex items-center gap-1">
                  <div v-for="i in currentWordLoopProgress.required" :key="i"
                    class="w-2 h-2 rounded-full transition-all duration-300"
                    :class="i <= currentWordLoopProgress.current ? 'bg-coral-500 shadow-sm' : 'bg-white/30'">
                  </div>
                </div>
                <div class="text-sm font-mono" :class="{
                  'text-coral-400': currentWordLoopProgress.current > 0,
                  'text-white/60': currentWordLoopProgress.current === 0
                }">
                  {{ currentWordLoopProgress.isInfinite ?
                    `${currentWordLoopProgress.current} / ∞` :
                    `${currentWordLoopProgress.current} / ${currentWordLoopProgress.required}` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐藏的输入框用于捕获键盘输入 -->
      <input ref="inputRef" :value="userInput" type="text" class="fixed opacity-0 pointer-events-none"
        style="left: -9999px; top: -9999px;" @input="$emit('input', $event)" @keydown="$emit('keydown', $event)" :disabled="isPaused"
        autocomplete="off" spellcheck="false">

      <!-- 实时统计信息 -->
      <PracticeStats :time="currentTime" :correct-count="correctCount" :wpm="currentWpm" :accuracy="accuracy" class="mb-8" />

      <!-- 提示信息 -->
      <div class="text-base opacity-70 mb-8 min-h-[3rem] flex items-center justify-center">
        <div v-if="errorMessage"
          class="text-red-800 font-semibold px-6 py-3 bg-gradient-to-r from-red-100/90 to-red-200/95 backdrop-blur-md rounded-xl border border-red-300/60 shadow-lg transition-all duration-300 ring-1 ring-red-300/40">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-sm shadow-red-500/50"></div>
            <span class="text-sm font-medium text-red-900 drop-shadow-sm">{{ errorMessage }}</span>
          </div>
        </div>
        <div v-else-if="successMessage"
          class="text-green-800 font-semibold px-6 py-3 bg-gradient-to-r from-green-100/90 to-emerald-100/95 backdrop-blur-md rounded-xl border border-green-300/60 shadow-lg transition-all duration-300 ring-1 ring-green-300/40">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-600 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
            <span class="text-sm font-medium text-green-900 drop-shadow-sm">{{ successMessage }}</span>
          </div>
        </div>
        <div v-else-if="!settings.dictationMode"
          class="opacity-50 font-medium text-sm px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <div class="flex items-center gap-2">
            <div class="w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
            <span>开始输入单词...</span>
          </div>
        </div>
        <div v-else
          class="opacity-50 font-medium text-sm px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <div class="flex items-center gap-2">
            <div class="w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
            <span>听音输入单词...</span>
          </div>
        </div>
      </div>

      <!-- 单词进度指示器 -->
      <div class="flex flex-col items-center justify-center gap-4 mb-8">
        <span class="text-sm opacity-60 font-medium px-3 py-1 bg-white/10 rounded-full border border-white/20">
          {{ currentWordIndex + 1 }} / {{ currentChapterWords.length }}
        </span>
        <div class="flex items-center justify-center gap-2 max-w-full overflow-x-auto px-4">
          <div v-for="(_, index) in currentChapterWords" :key="index"
            class="w-3 h-3 rounded-full transition-all duration-300 ease-out flex-shrink-0 relative group"
            :class="getWordProgressClass(index)" :title="getWordStatusTooltip(index)">
          </div>
        </div>

        <!-- 状态图例 -->
        <div class="flex items-center justify-center gap-4 text-xs opacity-60 mt-2">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-green-400"></div>
            <span>已完成</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-coral-500"></div>
            <span>当前</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span>已跳过</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-red-400"></div>
            <span>有错误</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-white/20"></div>
            <span>未练习</span>
          </div>
        </div>
      </div>

      <!-- 快捷键提示 -->
      <div class="flex justify-center gap-4 text-xs opacity-40 font-medium flex-wrap">
        <span class="flex items-center gap-1">
          <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Tab</kbd>
          跳过
        </span>
        <span class="flex items-center gap-1">
          <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Esc</kbd>
          暂停
        </span>
        <span class="flex items-center gap-1">
          <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Alt+P</kbd>
          发音
        </span>
        <span class="flex items-center gap-1">
          <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Alt+S</kbd>
          设置
        </span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else-if="!isCompleted" class="text-center py-16">
      <div class="animate-spin w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-lg opacity-60">正在从词语的海洋里为你捞取单词...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComboDisplay from './ComboDisplay.vue'
import PracticeStats from './PracticeStats.vue'
import type { Word, PracticeSettings } from '@/stores/practice'

interface Props {
  currentWord: Word | null
  currentWordIndex: number
  currentChapterWords: Word[]
  userInput: string
  settings: PracticeSettings
  currentWordLoopProgress: {
    current: number
    required: number
    isInfinite: boolean
  }
  getWordStatus: (index: number) => string
  isPaused: boolean
  isCompleted: boolean
  currentTime: number
  correctCount: number
  currentWpm: number
  accuracy: number
  errorMessage: string
  successMessage: string
  comboCount: number
  showCombo: boolean
}

const props = defineProps<Props>()

defineEmits<{
  previousWord: []
  skipWord: []
  playPronunciation: []
  input: [event: Event]
  keydown: [event: KeyboardEvent]
}>()

const inputRef = ref<HTMLInputElement>()

// 字符样式函数
const getCharClass = (index: number) => {
  if (!props.userInput || index >= props.userInput.length) {
    return 'text-gray-400 dark:text-gray-500'
  }

  const userChar = props.userInput[index].toLowerCase()
  const correctChar = props.currentWord?.word[index].toLowerCase()

  if (userChar === correctChar) {
    return 'text-white bg-green-500 rounded-md px-1 shadow-lg'
  } else {
    return 'text-white bg-red-500 rounded-md px-1 animate-shake'
  }
}

const getCharStyle = (index: number) => {
  if (!props.userInput || index >= props.userInput.length) {
    return {}
  }

  const userChar = props.userInput[index].toLowerCase()
  const correctChar = props.currentWord?.word[index].toLowerCase()

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

// 获取单词进度指示器的样式类
const getWordProgressClass = (index: number) => {
  const status = props.getWordStatus(index)

  switch (status) {
    case 'current':
      return 'bg-coral-500 scale-150 shadow-lg shadow-coral-500/50 ring-2 ring-coral-500/30'
    case 'completed':
      return 'bg-green-400 shadow-sm scale-110 hover:scale-125'
    case 'skipped':
      return 'bg-yellow-400 shadow-sm scale-110 hover:scale-125'
    case 'error':
      return 'bg-red-400 shadow-sm scale-110 hover:scale-125'
    case 'untouched':
    default:
      return 'bg-white/20 hover:bg-white/30'
  }
}

// 获取单词状态的工具提示
const getWordStatusTooltip = (index: number) => {
  const status = props.getWordStatus(index)
  const word = props.currentChapterWords[index]

  if (!word) return ''

  const baseInfo = `${word.word} - ${word.translation}`

  switch (status) {
    case 'current':
      return `正在练习: ${baseInfo}`
    case 'completed':
      return `已完成: ${baseInfo}`
    case 'skipped':
      return `已跳过: ${baseInfo}`
    case 'error':
      return `有错误: ${baseInfo}`
    case 'untouched':
    default:
      return `未练习: ${baseInfo}`
  }
}

defineExpose({
  inputRef
})
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes word-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-word-shake {
  animation: word-shake 0.6s ease-in-out;
  color: #ef4444 !important;
  text-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
}
</style>