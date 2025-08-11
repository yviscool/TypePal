<template>
  <div class="text-center">
    <div class="mb-8">
      <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-coral-500 to-lemon-500 rounded-full flex items-center justify-center">
        <div class="i-ph-trophy text-white text-4xl"></div>
      </div>

      <h2 class="text-3xl font-bold mb-4">
        {{ isLastChapter ? '全部完成！' : '章节完成！' }}
      </h2>
      <p class="text-lg opacity-80 mb-8">
        {{ isLastChapter
          ? '恭喜！你已经完成了所有章节的练习'
          : '太棒了！你和键盘简直是天作之合' }}
      </p>
    </div>

    <!-- 统计信息 -->
    <PracticeStats :time="practiceTime" :correct-count="correctCount" :wpm="wpm" :accuracy="accuracy" class="mb-8" />

    <!-- 操作按钮 -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button @click="$emit('startDictation')"
        class="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-medium text-lg hover:bg-white/20 transition-all duration-300">
        开启默写，检验成果！
      </button>

      <button @click="$emit('nextChapter')"
        class="px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative">
        {{ isLastChapter ? '重新开始第一章' : '再来一轮，状态正佳！' }}
        <!-- Enter键提示 -->
        <div class="absolute -top-2 -right-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-mono border border-white/30">
          Enter
        </div>
      </button>
    </div>

    <!-- 快捷键提示 -->
    <div class="mt-6 text-center">
      <p class="text-sm opacity-60">
        💡 按 <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono mx-1">Enter</kbd>
        {{ isLastChapter ? '重新开始' : '进入下一章' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PracticeStats from './PracticeStats.vue'

interface Props {
  practiceTime: number
  correctCount: number
  wpm: number
  accuracy: number
  isLastChapter: boolean
}

defineProps<Props>()

defineEmits<{
  startDictation: []
  nextChapter: []
}>()
</script>