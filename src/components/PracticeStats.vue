<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-coral-500/30 transition-all duration-300 group">
      <div class="text-xl font-bold text-coral-500 group-hover:scale-105 transition-transform duration-200">
        {{ formatTime(time) }}
      </div>
      <div class="text-sm opacity-60 font-medium">用时</div>
    </div>

    <div class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-lemon-500/30 transition-all duration-300 group">
      <div class="text-xl font-bold text-lemon-500 group-hover:scale-105 transition-transform duration-200">
        {{ correctCount }}
      </div>
      <div class="text-sm opacity-60 font-medium">正确数</div>
    </div>

    <div class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-electric-blue/30 transition-all duration-300 group">
      <div class="text-xl font-bold text-electric-blue group-hover:scale-105 transition-transform duration-200">
        {{ wpm }}
      </div>
      <div class="text-sm opacity-60 font-medium">WPM</div>
    </div>

    <div class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-cyber-pink/30 transition-all duration-300 group">
      <div class="text-xl font-bold text-cyber-pink group-hover:scale-105 transition-transform duration-200">
        {{ accuracy }}%
      </div>
      <div class="text-sm opacity-60 font-medium">正确率</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  time: number
  correctCount: number
  wpm: number
  accuracy: number
}

defineProps<Props>()

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>