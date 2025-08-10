<template>
  <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
    <!-- tsParticles 背景 -->
    <vue-particles id="tsparticles" class="absolute inset-0" @particles-loaded="particlesLoaded"
      :options="particlesOptions" />

    <!-- 渐变遮罩层 -->
    <div class="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-transparent pointer-events-none">
    </div>

    <!-- 主要内容 -->
    <div class="text-center z-10 max-w-4xl mx-auto px-6">
      <!-- Logo 和标题 -->
      <div class="mb-12">
        <div class="flex items-center justify-center mb-6">
          <div
            class="w-16 h-16 bg-gradient-to-br from-coral-500 to-lemon-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <div class="i-ph-keyboard text-white text-2xl"></div>
          </div>
          <h1 class="text-6xl font-bold bg-gradient-to-r from-coral-500 to-lemon-500 bg-clip-text text-transparent">
            TypePal
          </h1>
        </div>
        <p class="text-xl opacity-80 mb-2">你的有温度的数字打字伙伴</p>
        <p class="text-sm opacity-60">让每一次练习都充满乐趣与惊喜</p>
      </div>

      <!-- 词云动画区域 -->
      <div v-if="!isAwakened" class="mb-12 cursor-pointer" @click="awakenWords">
        <div class="relative h-64 flex items-center justify-center">
          <div class="word-cloud opacity-60 hover:opacity-80 transition-opacity duration-300">
            <span v-for="(word, index) in floatingWords" :key="index" class="floating-word absolute text-lg font-medium"
              :style="getWordStyle(index)">
              {{ word }}
            </span>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div class="i-ph-moon-stars text-4xl mb-4 opacity-60"></div>
              <p class="text-lg font-medium mb-2">嘘... 单词们还在沉睡</p>
              <p class="text-sm opacity-80">点击任意处唤醒它们</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 唤醒后的内容 -->
      <div v-else class="space-y-8">
        <!-- 快速开始按钮 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button @click="quickStart"
            class="group px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
            <div class="i-ph-play-circle group-hover:animate-spin"></div>
            快速开始练习
          </button>

          <button @click="goToLibrary"
            class="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-medium text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
            <div class="i-ph-books group-hover:animate-bounce"></div>
            浏览词库
          </button>
        </div>

        <!-- 特色功能介绍 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div
            class="feature-card p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <div class="i-ph-heart text-3xl text-coral-500 mb-4 group-hover:animate-pulse"></div>
            <h3 class="text-lg font-semibold mb-2">有温度的体验</h3>
            <p class="text-sm opacity-80">每个交互都充满人性化的关怀，让练习变得温暖有趣</p>
          </div>

          <div
            class="feature-card p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <div class="i-ph-sparkle text-3xl text-lemon-500 mb-4 group-hover:animate-spin"></div>
            <h3 class="text-lg font-semibold mb-2">智能适应</h3>
            <p class="text-sm opacity-80">根据你的练习情况智能调整，让每次练习都恰到好处</p>
          </div>

          <div
            class="feature-card p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <div class="i-ph-magic-wand text-3xl text-electric-blue mb-4 group-hover:animate-bounce"></div>
            <h3 class="text-lg font-semibold mb-2">丰富词库</h3>
            <p class="text-sm opacity-80">从编程术语到考试词汇，总有适合你的练习内容</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主题切换按钮 -->
    <button @click="themeStore.toggleTheme()"
      class="fixed top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
      <div class="i-carbon-sun dark:i-carbon-moon text-xl"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useDictionaryStore } from '@/stores/dictionary'
import { useParticles } from '@/composables/useParticles'

const router = useRouter()
const themeStore = useThemeStore()
const dictionaryStore = useDictionaryStore()

const isAwakened = ref(false)
const particlesContainer = ref<any>(null)

const floatingWords = ref([
  'algorithm', 'function', 'variable', 'array', 'object',
  'class', 'method', 'interface', 'database', 'framework',
  'abandon', 'ability', 'absolute', 'academic', 'achieve'
])

// 使用粒子系统 composable
const themeRef = computed(() => ({ isDark: themeStore.isDark }))
const { baseOptions, enhancedOptions, createBurstEffect } = useParticles(themeRef)

// 根据唤醒状态选择粒子配置
const particlesOptions = computed(() =>
  isAwakened.value ? enhancedOptions.value : baseOptions.value
)

const particlesLoaded = async (container: any) => {
  console.log('Particles container loaded', container)
  particlesContainer.value = container
}

const awakenWords = () => {
  isAwakened.value = true

  // 创建粒子爆发效果
  if (particlesContainer.value) {
    createBurstEffect(particlesContainer.value)

    // 添加多个爆发点
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createBurstEffect(particlesContainer.value)
        }, i * 200)
      }
    }, 300)
  }
}

const quickStart = () => {
  const defaultDict = dictionaryStore.dictionaries[0]
  if (defaultDict) {
    router.push({ name: 'Practice', params: { id: defaultDict.id } })
  }
}

const goToLibrary = () => {
  router.push({ name: 'Library' })
}

const getWordStyle = (index: number) => {
  const angle = (index * 360) / floatingWords.value.length
  const radius = 120 + Math.random() * 40
  const x = Math.cos(angle * Math.PI / 180) * radius
  const y = Math.sin(angle * Math.PI / 180) * radius

  return {
    transform: `translate(${x}px, ${y}px)`,
    animationDelay: `${index * 0.1}s`,
    opacity: 0.3 + Math.random() * 0.4
  }
}

onMounted(() => {
  themeStore.initTheme()
  dictionaryStore.initDictionaries()
})
</script>

<style scoped>
.floating-word {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

.feature-card {
  backdrop-filter: blur(10px);
}
</style>