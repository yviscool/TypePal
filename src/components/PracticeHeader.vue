<template>
  <header class="max-w-4xl mx-auto mb-8">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <button @click="$emit('goBack')" class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200" title="返回词库">
          <div class="i-ph-arrow-left text-xl"></div>
        </button>
        <div>
          <h1 class="text-2xl font-bold">{{ dictionaryName }}</h1>
          <p class="text-sm opacity-60">第 {{ currentChapter + 1 }} 章</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- 章节选择器 -->
        <div class="relative group">
          <select :value="currentChapter" @change="$emit('chapterChange', ($event.target as HTMLSelectElement).value)"
            class="px-6 py-3 pr-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/8 hover:border-white/20 focus:bg-white/10 focus:border-coral-500/30 focus:ring-1 focus:ring-coral-500/10 focus:outline-none text-sm font-medium transition-all duration-300 appearance-none cursor-pointer min-w-[160px] text-gray-900 dark:text-white/90 hover:text-gray-800 dark:hover:text-white"
            title="选择章节 (快捷键: C)">
            <option v-for="(chapter, index) in availableChapters" :key="index" :value="index"
              class="bg-white/95 text-gray-800 dark:bg-gray-800/95 dark:text-white/90 font-medium py-2 px-4">
              第 {{ index + 1 }} 章 ({{ chapter.length }} 词)
            </option>
          </select>
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200">
            <div class="i-ph-caret-down text-sm opacity-50 group-hover:opacity-70 transition-opacity duration-200"></div>
          </div>
        </div>

        <!-- 设置展开按钮 -->
        <button @click="$emit('toggleSettings')" class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          :class="{ 'bg-white/10': showSettings }" title="练习设置 (快捷键: Alt + S)">
          <div class="i-ph-gear text-xl" :class="{ 'rotate-90': showSettings }"></div>
        </button>

        <!-- 暂停按钮 -->
        <button @click="$emit('togglePause')" class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          :class="{ 'bg-white/10': isPaused }" :title="isPaused ? '继续练习 (快捷键: Esc)' : '暂停练习 (快捷键: Esc)'">
          <div class="i-ph-pause text-xl" v-if="!isPaused"></div>
          <div class="i-ph-play text-xl" v-else></div>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  dictionaryName: string
  currentChapter: number
  availableChapters: any[]
  showSettings: boolean
  isPaused: boolean
}

defineProps<Props>()

defineEmits<{
  goBack: []
  chapterChange: [value: string]
  toggleSettings: []
  togglePause: []
}>()
</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}
</style>