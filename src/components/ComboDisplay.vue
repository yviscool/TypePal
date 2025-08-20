<template>
  <!-- 全屏背景特效层 -->
  <div v-if="comboCount >= 3 && effectsLevel !== 'none'" class="fixed inset-0 pointer-events-none z-10">
    <!-- 基础环境光 -->
    <div class="absolute inset-0" :class="ambientLightClass"></div>
    
    <!-- 阶段专属背景特效 -->
    <div v-if="stage >= 1" class="absolute inset-0 animate-fade-in" :key="`bg-${stage}`">
      <div class="absolute inset-0" :class="stageBackgroundClass"></div>
    </div>
    
    <!-- 高阶空间扭曲效果 -->
    <div v-if="stage >= 6" class="absolute inset-0 animate-fade-in" key="space-warp">
      <div class="absolute inset-0 animate-reality-warp" :class="warpIntensityClass"></div>
    </div>
    
    <!-- 终极光辉效果 -->
    <div v-if="stage >= 8" class="absolute inset-0 animate-fade-in" key="ultimate-radiance">
      <div class="absolute inset-0 animate-ultimate-radiance"></div>
    </div>
  </div>

  <!-- 连击显示主体 -->
  <div v-if="comboCount >= 3 && effectsLevel !== 'none'"
    class="absolute top-0 left-0 transform -translate-x-4 -translate-y-16 z-20">
    
    <!-- 华丽模式 -->
    <div v-if="effectsLevel === 'gorgeous'" class="relative select-none flex items-center justify-center w-80 h-80"
      :class="[impactAnimationClass, { 'animate-screen-shake': stage >= 6 && animationState !== 'idle' }]">

      <!-- 主要文字内容 -->
      <div class="relative flex flex-col items-center justify-center">
        <!-- 连击标签 -->
        <div class="font-black tracking-[0.4em] opacity-90 transition-all duration-500"
          :class="[stageClasses.label, idleAnimationClass.label, { 'animate-label-impact': animationState !== 'idle' }]">
          连击
        </div>

        <!-- 连击数字 -->
        <div class="relative font-black tracking-tighter leading-none my-2 select-none"
          :class="[stageClasses.number, idleAnimationClass.number, { 'animate-number-impact': animationState !== 'idle' }]"
          style="font-feature-settings: 'kern' 1, 'liga' 0; font-variant-numeric: tabular-nums lining-nums; text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
          {{ comboCount }}
        </div>

        <!-- 阶段称号 -->
        <div class="font-bold tracking-[0.2em] transition-all duration-500"
          :class="[stageClasses.rank, idleAnimationClass.rank, { 'animate-rank-impact': animationState !== 'idle' }]">
          {{ stageTitle }}
        </div>
      </div>

      <!-- 光环爆发效果 -->
      <div v-if="animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 animate-flare-burst" :class="stageClasses.flare"></div>
      </div>

      <!-- 粒子系统 -->
      <div v-if="animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div v-for="p in particleCount" :key="p" class="absolute left-1/2 top-1/2 rounded-full combo-particle"
          :class="[stageClasses.particle, particleShapeClass]" :style="particleStyles[p - 1]">
        </div>
      </div>

      <!-- 能量波纹 -->
      <div v-if="stage >= 4 && animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div v-for="ring in 3" :key="`ring-${ring}`"
          class="absolute left-1/2 top-1/2 border-2 rounded-full animate-energy-ring"
          :class="stageClasses.ring" :style="getRingStyle(ring)">
        </div>
      </div>

      <!-- 破碎晶体效果 -->
      <div v-if="stage >= 6 && animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div v-for="shard in 16" :key="`shard-${shard}`"
          class="absolute w-1 h-12 bg-gradient-to-t from-transparent via-white to-transparent opacity-80"
          :class="shardAnimationClass" :style="shardStyles[shard - 1]">
        </div>
      </div>

      <!-- 神圣光柱 -->
      <div v-if="stage >= 7 && animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div class="absolute left-1/2 top-0 w-2 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-60 animate-divine-beam beam-hole transform -translate-x-1/2"></div>
        <div class="absolute left-0 top-1/2 w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-divine-beam beam-hole transform -translate-y-1/2"></div>
      </div>

      <!-- 终极光环 -->
      <div v-if="stage >= 8 && animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 animate-ultimate-halo" :class="stageClasses.ultimateHalo"></div>
      </div>

    </div>

    <!-- 简约模式 -->
    <div v-else-if="effectsLevel === 'simple'" class="relative flex items-baseline justify-center w-40 h-28"
      :class="{ 'animate-echo-ripple': simpleAnimationState === 'hit' }">

      <div class="flex items-baseline gap-1" :class="{ 'animate-engrave-stamp': simpleAnimationState === 'hit' }">
        <span class="font-semibold text-lg text-gray-800/60" style="text-shadow: 1px 1px 0px rgba(0,0,0,0.1);">
          连击
        </span>
        <span class="font-sans text-lg text-gray-800/50 -translate-y-px"
          style="text-shadow: 1px 1px 0px rgba(0,0,0,0.1);">
          x
        </span>
        <span class="font-black text-4xl text-coral-500"
          style="text-shadow: 0px 2px 0px rgba(0,0,0,0.15), 0px 3px 2px rgba(0,0,0,0.1);">
          {{ comboCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

// --- Props 定义 ---
interface Props {
  comboCount: number
  effectsLevel?: 'none' | 'simple' | 'gorgeous'
}
const props = withDefaults(defineProps<Props>(), {
  effectsLevel: 'gorgeous',
})

// --- 八阶段系统定义 ---
type Stage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type AnimationState = 'idle' | 'hit' | 'stage-up'

const animationState = ref<AnimationState>('idle')
let animationTimeout: number | undefined

// --- 简约模式状态管理 ---
type SimpleAnimationState = 'idle' | 'hit'
const simpleAnimationState = ref<SimpleAnimationState>('idle')
let simpleAnimationTimeout: number | undefined

// --- 全新八阶段判定函数 ---
const getStage = (count: number): Stage => {
  if (count >= 24) return 8  // 返璞归真 - 纯净光辉，万物归一
  if (count >= 21) return 7  // 通天彻地 - 神圣白金，天地共鸣  
  if (count >= 18) return 6  // 震古烁今 - 赤红雷暴，现实破碎
  if (count >= 15) return 5  // 超凡入圣 - 紫色星云，时空裂痕
  if (count >= 12) return 4  // 登峰造极 - 电光蓝焰，空间扭曲
  if (count >= 9) return 3   // 炉火纯青 - 柠檬金辉，光环绽放
  if (count >= 6) return 2   // 渐入佳境 - 珊瑚色流光，能量涌动
  if (count >= 3) return 1   // 初露锋芒 - 温暖橙光，轻柔脉动
  return 1
}

// --- 核心计算属性 ---
const stage = computed<Stage>(() => getStage(props.comboCount))

const stageTitle = computed(() => {
  switch (stage.value) {
    case 8: return '返璞归真'
    case 7: return '通天彻地'
    case 6: return '震古烁今'
    case 5: return '超凡入圣'
    case 4: return '登峰造极'
    case 3: return '炉火纯青'
    case 2: return '渐入佳境'
    default: return '初露锋芒'
  }
})

// --- 监听连击变化 ---
watch(() => props.comboCount, (newCount, oldCount) => {
  if (newCount <= oldCount || newCount < 3 || props.effectsLevel === 'none') {
    return
  }

  if (props.effectsLevel === 'gorgeous') {
    clearTimeout(animationTimeout)
    const oldStage = getStage(oldCount)
    const newStage = getStage(newCount)

    const isStageUp = newStage !== oldStage && oldCount >= 3
    animationState.value = isStageUp ? 'stage-up' : 'hit'
    animationTimeout = window.setTimeout(() => animationState.value = 'idle', isStageUp ? 2000 : 1000)

  } else if (props.effectsLevel === 'simple') {
    clearTimeout(simpleAnimationTimeout)
    simpleAnimationState.value = 'hit'
    simpleAnimationTimeout = window.setTimeout(() => {
      simpleAnimationState.value = 'idle'
    }, 500)
  }
})

// --- 环境光效果 ---
const ambientLightClass = computed(() => {
  const base = 'transition-all duration-1000'
  if (stage.value >= 8) return `${base} opacity-40 animate-ultimate-ambient`
  if (stage.value >= 6) return `${base} opacity-60 animate-chaos-ambient`
  if (stage.value >= 4) return `${base} opacity-80 animate-energy-ambient`
  if (stage.value >= 1) return `${base} opacity-100 animate-warm-ambient`
  return ''
})

// --- 阶段背景特效 ---
const stageBackgroundClass = computed(() => {
  switch (stage.value) {
    case 8: return 'animate-pure-radiance'
    case 7: return 'animate-divine-resonance'
    case 6: return 'animate-reality-storm'
    case 5: return 'animate-cosmic-nebula'
    case 4: return 'animate-electric-vortex'
    case 3: return 'animate-golden-aura'
    case 2: return 'animate-coral-flow'
    default: return 'animate-warm-glow'
  }
})

// --- 空间扭曲强度 ---
const warpIntensityClass = computed(() => {
  if (stage.value >= 8) return 'warp-ultimate'
  if (stage.value >= 7) return 'warp-divine'
  return 'warp-chaos'
})

// --- 主体显示样式 ---
const impactAnimationClass = computed(() => {
  if (animationState.value === 'stage-up') return `animate-stage-${stage.value}-up`
  if (animationState.value === 'hit') return `animate-stage-${stage.value}-hit`
  return ''
})

const stageClasses = computed(() => {
  switch (stage.value) {
    case 8: // 返璞归真 - 太极阴阳
      return {
        label: 'text-gray-900 text-2xl font-light tracking-[0.6em] taiji-glow',
        number: 'text-9xl text-gray-900 font-black taiji-number-glow',
        rank: 'text-gray-800 text-3xl font-light tracking-[0.4em] taiji-glow',
        flare: 'taiji-flare',
        particle: 'bg-gray-900 taiji-particle',
        ring: 'border-gray-800/60',
        ultimateHalo: 'ultimate-halo-taiji'
      }
    case 7: // 通天彻地 - 神圣白金
      return {
        label: 'text-yellow-100 text-xl font-bold tracking-[0.5em] divine-glow',
        number: 'text-8xl text-yellow-300 font-black divine-number-glow',
        rank: 'text-yellow-200 text-2xl font-bold tracking-[0.3em] divine-glow',
        flare: 'divine-flare',
        particle: 'bg-yellow-200 divine-particle',
        ring: 'border-yellow-300/70',
        ultimateHalo: 'ultimate-halo-divine'
      }
    case 6: // 震古烁今 - 赤红雷暴
      return {
        label: 'text-red-200 text-lg font-black tracking-[0.4em] chaos-glow',
        number: 'text-8xl text-red-300 font-black chaos-number-glow',
        rank: 'text-red-300 text-2xl font-black tracking-[0.2em] chaos-glow',
        flare: 'chaos-flare',
        particle: 'bg-red-300 chaos-particle',
        ring: 'border-red-400/70'
      }
    case 5: // 超凡入圣 - 紫色星云
      return {
        label: 'text-purple-200 text-lg font-bold tracking-[0.4em] cosmic-glow',
        number: 'text-7xl text-purple-300 font-black cosmic-number-glow',
        rank: 'text-purple-300 text-xl font-bold tracking-[0.2em] cosmic-glow',
        flare: 'cosmic-flare',
        particle: 'bg-purple-300 cosmic-particle',
        ring: 'border-purple-400/60'
      }
    case 4: // 登峰造极 - 电光蓝焰
      return {
        label: 'text-blue-200 text-base font-bold tracking-[0.3em] electric-glow',
        number: 'text-7xl text-blue-300 font-black electric-number-glow',
        rank: 'text-blue-300 text-xl font-bold tracking-[0.2em] electric-glow',
        flare: 'electric-flare',
        particle: 'bg-blue-300 electric-particle',
        ring: 'border-blue-400/60'
      }
    case 3: // 炉火纯青 - 柠檬金辉
      return {
        label: 'text-lemon-200 text-base font-bold tracking-[0.3em] golden-glow',
        number: 'text-6xl text-lemon-400 font-black golden-number-glow',
        rank: 'text-lemon-300 text-lg font-bold tracking-[0.15em] golden-glow',
        flare: 'golden-flare',
        particle: 'bg-lemon-300 golden-particle',
        ring: 'border-lemon-400/50'
      }
    case 2: // 渐入佳境 - 珊瑚色流光
      return {
        label: 'text-coral-200 text-sm font-semibold tracking-[0.25em] coral-glow',
        number: 'text-6xl text-coral-300 font-bold coral-number-glow',
        rank: 'text-coral-300 text-lg font-semibold tracking-[0.1em] coral-glow',
        flare: 'coral-flare',
        particle: 'bg-coral-300 coral-particle',
        ring: 'border-coral-400/50'
      }
    default: // 初露锋芒 - 温暖橙光
      return {
        label: 'text-orange-200 text-sm font-medium tracking-[0.2em] warm-glow',
        number: 'text-5xl text-orange-300 font-bold warm-number-glow',
        rank: 'text-orange-300 text-base font-medium warm-glow',
        flare: 'warm-flare',
        particle: 'bg-orange-300 warm-particle',
        ring: 'border-orange-400/40'
      }
  }
})

const idleAnimationClass = computed(() => {
  if (animationState.value !== 'idle') {
    return { label: '', number: '', rank: '' }
  }
  // 高阶待机动画
  switch (stage.value) {
    case 8:
      return {
        label: 'animate-taiji-float',
        number: 'animate-taiji-pulse',
        rank: 'animate-taiji-float-delayed'
      }
    case 7:
      return {
        label: 'animate-divine-float',
        number: 'animate-divine-pulse',
        rank: 'animate-divine-float-delayed'
      }
    case 6:
      return {
        label: 'animate-chaos-shake',
        number: 'animate-chaos-pulse',
        rank: 'animate-chaos-shake-delayed'
      }
    default:
      return { label: '', number: '', rank: '' }
  }
})

// --- 粒子系统 ---
const particleCount = computed(() => {
  if (stage.value >= 7) return 20
  if (stage.value >= 5) return 16
  if (stage.value >= 3) return 12
  return 8
})

const particleShapeClass = computed(() => {
  if (stage.value >= 8) return 'w-4 h-4'
  if (stage.value >= 6) return 'w-3 h-3'
  if (stage.value >= 4) return 'w-2.5 h-2.5'
  return 'w-2 h-2'
})

const particleStyles = computed(() => {
  const baseDirections = [
    { x: 0, y: -120, delay: 0 }, { x: 85, y: -85, delay: 50 },
    { x: 120, y: 0, delay: 25 }, { x: 85, y: 85, delay: 75 },
    { x: 0, y: 120, delay: 0 }, { x: -85, y: 85, delay: 50 },
    { x: -120, y: 0, delay: 25 }, { x: -85, y: -85, delay: 75 },
  ]
  const extraDirections = [
    { x: 42, y: -140, delay: 100 }, { x: 140, y: -42, delay: 125 },
    { x: 140, y: 42, delay: 150 }, { x: 42, y: 140, delay: 175 },
    { x: -42, y: 140, delay: 200 }, { x: -140, y: 42, delay: 225 },
    { x: -140, y: -42, delay: 250 }, { x: -42, y: -140, delay: 275 },
    { x: 0, y: -160, delay: 300 }, { x: 113, y: -113, delay: 325 },
    { x: 160, y: 0, delay: 350 }, { x: 113, y: 113, delay: 375 }
  ]
  const directions = particleCount.value > 8
    ? [...baseDirections, ...extraDirections.slice(0, particleCount.value - 8)]
    : baseDirections.slice(0, particleCount.value)

  const duration = animationState.value === 'stage-up' ? '2s' : '1.2s'
  const scaleFactor = animationState.value === 'stage-up' ? 2.5 : 1.5

  return directions.map(dir => ({
    '--tx': `${dir.x * scaleFactor}px`,
    '--ty': `${dir.y * scaleFactor}px`,
    animation: `particle-burst-stage-${stage.value} ${duration} cubic-bezier(0.1, 0.8, 0.7, 1) ${dir.delay}ms`,
  }))
})

// --- 能量波纹样式 ---
const getRingStyle = (ringIndex: number) => ({
  width: `${60 + ringIndex * 40}px`,
  height: `${60 + ringIndex * 40}px`,
  marginLeft: `${-(30 + ringIndex * 20)}px`,
  marginTop: `${-(30 + ringIndex * 20)}px`,
  animationDelay: `${ringIndex * 150}ms`
})

// --- 破碎晶体效果 ---
const shardAnimationClass = computed(() => {
  if (animationState.value !== 'idle') return 'animate-shard-burst-enhanced'
  return 'opacity-0'
})

const shardStyles = computed(() => {
  const angles = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return angles.map((angle, i) => ({
    transform: `rotate(${angle}deg)`,
    left: '50%',
    top: '50%',
    transformOrigin: '0 6px',
    animationDelay: `${i * 25}ms`
  }))
})
</script>

<style scoped>
/* =================================================================== */
/* 全局特效与通用动画 */
/* =================================================================== */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 1s ease-in-out;
}

@keyframes screen-shake {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  10% { transform: translate(-3px, -4px) rotate(-0.8deg); }
  20% { transform: translate(4px, 3px) rotate(0.8deg); }
  30% { transform: translate(-2px, 3px) rotate(-0.6deg); }
  40% { transform: translate(3px, -2px) rotate(0.6deg); }
  50% { transform: translate(-3px, 2px) rotate(-0.4deg); }
  70% { transform: translate(2px, 2px) rotate(0.3deg); }
  90% { transform: translate(-1px, 0px) rotate(0.1deg); }
}
.animate-screen-shake {
  animation: screen-shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
}

/* =================================================================== */
/* 环境光效果 */
/* =================================================================== */
@keyframes warm-ambient {
  50% { opacity: 0.8; transform: scale(1.02); }
}
.animate-warm-ambient {
  background: radial-gradient(circle, rgba(255, 165, 0, 0.06) 0%, transparent 70%);
  animation: warm-ambient 6s ease-in-out infinite;
}

@keyframes energy-ambient {
  50% { opacity: 1; transform: scale(1.01); }
}
.animate-energy-ambient {
  background: repeating-linear-gradient(90deg, transparent 0, rgba(59, 130, 246, 0.04) 2px, transparent 4px);
  animation: energy-ambient 4s ease-in-out infinite;
}

@keyframes chaos-ambient {
  50% { opacity: 0.8; transform: scale(1.03) rotate(0.5deg); }
}
.animate-chaos-ambient {
  background: conic-gradient(from 0deg, rgba(239, 68, 68, 0.08), transparent, rgba(239, 68, 68, 0.08));
  animation: chaos-ambient 3s ease-in-out infinite;
}

@keyframes ultimate-ambient {
  50% { opacity: 0.6; transform: scale(1.01); }
}
.animate-ultimate-ambient {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 80%);
  animation: ultimate-ambient 8s ease-in-out infinite;
}

/* =================================================================== */
/* 阶段背景特效 */
/* =================================================================== */
@keyframes warm-glow {
  from { transform: translateY(-100%); opacity: 0; }
  20% { opacity: 0.8; }
  to { transform: translateY(100vh); opacity: 0; }
}
.animate-warm-glow {
  background: linear-gradient(180deg, transparent, rgba(255, 165, 0, 0.12) 50%, transparent);
  animation: warm-glow 12s linear infinite;
}

@keyframes coral-flow {
  from { transform: translateX(-100%); opacity: 0; }
  20% { opacity: 1; }
  to { transform: translateX(100vw); opacity: 0; }
}
.animate-coral-flow {
  background: linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.15) 50%, transparent);
  animation: coral-flow 10s linear infinite;
}

@keyframes golden-aura {
  from { transform: rotate(0deg) scale(1.1); }
  to { transform: rotate(360deg) scale(1.1); }
}
.animate-golden-aura {
  background: conic-gradient(from 0deg, rgba(255, 209, 102, 0.0), rgba(255, 209, 102, 0.18), rgba(255, 209, 102, 0.0));
  animation: golden-aura 15s linear infinite;
  opacity: 0.7;
}

@keyframes electric-vortex {
  0%, 100% { transform: scale(1) skew(0); }
  25% { transform: scale(1.03) skew(1deg, -0.5deg); }
  75% { transform: scale(0.97) skew(-1deg, 0.5deg); }
}
.animate-electric-vortex {
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.15) 20%, transparent 70%);
  animation: electric-vortex 5s ease-in-out infinite;
}

@keyframes cosmic-nebula {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
.animate-cosmic-nebula {
  background: linear-gradient(270deg, rgba(147, 51, 234, 0.2), rgba(147, 51, 234, 0), rgba(147, 51, 234, 0.2));
  background-size: 200% 200%;
  animation: cosmic-nebula 8s linear infinite;
  opacity: 0.8;
}

@keyframes reality-storm {
  0% { background-position: 0 0, 0 0; }
  100% { background-position: -300px 0, 0 -300px; }
}
.animate-reality-storm {
  background: 
    repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.15) 0, rgba(239, 68, 68, 0.15) 2px, transparent 2px, transparent 20px),
    repeating-linear-gradient(-45deg, rgba(239, 68, 68, 0.1) 0, rgba(239, 68, 68, 0.1) 2px, transparent 2px, transparent 20px);
  animation: reality-storm 4s linear infinite;
}

@keyframes divine-resonance {
  from { background-position: 0 0, 0 0; }
  to { background-position: -250px 0, 0 -250px; }
}
.animate-divine-resonance {
  --grid-color: rgba(250, 204, 21, 0.25);
  background:
    repeating-linear-gradient(90deg, var(--grid-color) 0, var(--grid-color) 1px, transparent 1px, transparent 50px),
    repeating-linear-gradient(0deg, var(--grid-color) 0, var(--grid-color) 1px, transparent 1px, transparent 50px);
  animation: divine-resonance 6s linear infinite;
  opacity: 0.6;
}

@keyframes taiji-radiance {
  0%, 100% { 
    opacity: 0.6; 
    transform: rotate(0deg) scale(1);
  }
  50% { 
    opacity: 0.8; 
    transform: rotate(180deg) scale(1.02);
  }
}
.animate-pure-radiance {
  background: 
    radial-gradient(circle at 30% 50%, rgba(0, 0, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  animation: taiji-radiance 12s ease-in-out infinite;
  opacity: 0.5;
}

/* =================================================================== */
/* 空间扭曲效果 */
/* =================================================================== */
@keyframes reality-warp {
  0%, 100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
  25% { transform: perspective(1000px) rotateX(2deg) rotateY(-1deg); }
  75% { transform: perspective(1000px) rotateX(-2deg) rotateY(1deg); }
}
.animate-reality-warp {
  animation: reality-warp 4s ease-in-out infinite;
}
.warp-chaos { filter: blur(0.5px) hue-rotate(10deg); }
.warp-divine { filter: blur(1px) hue-rotate(20deg) brightness(1.2); }
.warp-ultimate { filter: blur(2px) hue-rotate(30deg) brightness(1.5) contrast(1.2); }

@keyframes ultimate-radiance {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}
.animate-ultimate-radiance {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  animation: ultimate-radiance 12s ease-in-out infinite;
}

/* =================================================================== */
/* 文字光效 */
/* =================================================================== */
.warm-glow { text-shadow: 0 0 10px rgba(255, 165, 0, 0.6); }
.warm-number-glow { text-shadow: 0 0 15px rgba(255, 165, 0, 0.8), 0 0 30px rgba(255, 165, 0, 0.4); }

.coral-glow { text-shadow: 0 0 12px rgba(255, 107, 107, 0.7); }
.coral-number-glow { text-shadow: 0 0 18px rgba(255, 107, 107, 0.9), 0 0 35px rgba(255, 107, 107, 0.5); }

.golden-glow { text-shadow: 0 0 15px rgba(255, 209, 102, 0.8); }
.golden-number-glow { text-shadow: 0 0 20px rgba(255, 209, 102, 1), 0 0 40px rgba(255, 209, 102, 0.6); }

.electric-glow { text-shadow: 0 0 18px rgba(59, 130, 246, 0.9); }
.electric-number-glow { text-shadow: 0 0 25px rgba(59, 130, 246, 1), 0 0 50px rgba(59, 130, 246, 0.7); }

.cosmic-glow { text-shadow: 0 0 20px rgba(147, 51, 234, 1); }
.cosmic-number-glow { text-shadow: 0 0 30px rgba(147, 51, 234, 1), 0 0 60px rgba(147, 51, 234, 0.8); }

.chaos-glow { text-shadow: 0 0 25px rgba(239, 68, 68, 1.2); }
.chaos-number-glow { text-shadow: 0 0 35px rgba(239, 68, 68, 1.5), 0 0 70px rgba(239, 68, 68, 1); }

.divine-glow { text-shadow: 0 0 30px rgba(250, 204, 21, 1.3); }
.divine-number-glow { text-shadow: 0 0 40px rgba(250, 204, 21, 1.6), 0 0 80px rgba(250, 204, 21, 1.2); }

/* 太极阴阳风格 */
.taiji-glow { 
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(2px 2px 4px rgba(255, 255, 255, 0.5));
}
.taiji-number-glow { 
  text-shadow: 0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(0, 0, 0, 0.4);
  filter: drop-shadow(3px 3px 6px rgba(255, 255, 255, 0.7));
}

/* 优化其他阶段的文字阴影，减少模糊 */
.warm-glow { text-shadow: 0 0 4px rgba(255, 165, 0, 0.5); }
.warm-number-glow { text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35), 0 0 10px rgba(255, 165, 0, 0.55); }

.coral-glow { text-shadow: 0 0 5px rgba(255, 107, 107, 0.5); }
.coral-number-glow { text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35), 0 0 12px rgba(255, 107, 107, 0.6); }

.golden-glow { text-shadow: 0 0 6px rgba(255, 209, 102, 0.55); }
.golden-number-glow { text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35), 0 0 12px rgba(255, 209, 102, 0.6); }

.electric-glow { text-shadow: 0 0 7px rgba(59, 130, 246, 0.55); }
.electric-number-glow { text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35), 0 0 14px rgba(59, 130, 246, 0.6); }

.cosmic-glow { text-shadow: 0 0 8px rgba(147, 51, 234, 0.55); }
.cosmic-number-glow { text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35), 0 0 14px rgba(147, 51, 234, 0.6); }

.chaos-glow { text-shadow: 0 0 9px rgba(239, 68, 68, 0.55); }
.chaos-number-glow { text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35), 0 0 16px rgba(239, 68, 68, 0.6); }

.divine-glow { text-shadow: 0 0 10px rgba(250, 204, 21, 0.55); }
.divine-number-glow { text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35), 0 0 18px rgba(250, 204, 21, 0.6); }

/* 全局数字清晰度提升（仅作用于数字光效类） */
[class*="number-glow"] {
  -webkit-text-stroke: 0.6px rgba(0, 0, 0, 0.35);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* 标签清晰度提升（非数字） */
[class*="glow"]:not([class*="number-glow"]) {
  -webkit-text-stroke: 0.4px rgba(0, 0, 0, 0.25);
}

/* =================================================================== */
/* 待机动画 */
/* =================================================================== */
@keyframes pure-float {
  50% { transform: translateY(-6px); }
}
.animate-pure-float { animation: pure-float 6s ease-in-out infinite; }
.animate-pure-float-delayed { animation: pure-float 6s ease-in-out infinite 1s; }

@keyframes pure-pulse {
  50% { transform: scale(1.02); }
}
.animate-pure-pulse { animation: pure-pulse 4s ease-in-out infinite; }

@keyframes divine-float {
  50% { transform: translateY(-8px) scale(1.01); }
}
.animate-divine-float { animation: divine-float 5s ease-in-out infinite; }
.animate-divine-float-delayed { animation: divine-float 5s ease-in-out infinite 0.8s; }

@keyframes divine-pulse {
  50% { transform: scale(1.03); }
}
.animate-divine-pulse { animation: divine-pulse 3.5s ease-in-out infinite; }

@keyframes chaos-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
.animate-chaos-shake { animation: chaos-shake 2s ease-in-out infinite; }
.animate-chaos-shake-delayed { animation: chaos-shake 2s ease-in-out infinite 0.5s; }

@keyframes chaos-pulse {
  50% { transform: scale(1.05) rotate(1deg); }
}
.animate-chaos-pulse { animation: chaos-pulse 2.5s ease-in-out infinite; }

/* =================================================================== */
/* 冲击动画系统 */
/* =================================================================== */
@keyframes stage-hit-base {
  30% { transform: scale(var(--scale, 1.2)) rotate(var(--rot, -3deg)); }
}

.animate-stage-1-hit { animation: stage-hit-base 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.2; --rot: -2deg; }
.animate-stage-2-hit { animation: stage-hit-base 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.3; --rot: -3deg; }
.animate-stage-3-hit { animation: stage-hit-base 1s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.4; --rot: -4deg; }
.animate-stage-4-hit { animation: stage-hit-base 1s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.5; --rot: -5deg; }
.animate-stage-5-hit { animation: stage-hit-base 1.1s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.6; --rot: -6deg; }

@keyframes stage-6-hit {
  20% { transform: scale(1.8) rotate(-8deg); filter: brightness(3) contrast(1.8); }
  50% { transform: scale(0.9) rotate(4deg); }
}
.animate-stage-6-hit { animation: stage-6-hit 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes stage-7-hit {
  25% { transform: scale(2) rotate(-10deg); filter: brightness(4) saturate(2); }
  55% { transform: scale(0.95) rotate(5deg); }
}
.animate-stage-7-hit { animation: stage-7-hit 1.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes stage-8-hit {
  30% { transform: scale(2.2) rotate(-12deg); filter: brightness(5) contrast(1.4); }
  60% { transform: scale(0.98) rotate(6deg); }
}
.animate-stage-8-hit { animation: stage-8-hit 1.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Stage-Up 动画 */
@keyframes stage-up-base {
  30% { transform: scale(var(--scale, 2.5)) rotate(var(--rot, 20deg)); filter: brightness(var(--brightness, 4)); }
  70% { transform: scale(0.8) rotate(-10deg); }
}

.animate-stage-1-up, .animate-stage-2-up { animation: stage-up-base 1.8s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 2.2; --rot: 15deg; --brightness: 3; }
.animate-stage-3-up, .animate-stage-4-up { animation: stage-up-base 1.8s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 2.5; --rot: 18deg; --brightness: 4; }
.animate-stage-5-up { animation: stage-up-base 1.8s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 2.8; --rot: 22deg; --brightness: 5; }

@keyframes stage-6-up {
  20% { transform: scale(3.5) rotate(25deg); filter: brightness(6) contrast(2.5) saturate(3); }
  45% { transform: scale(0.7) rotate(-12deg); }
  75% { transform: scale(1.1) rotate(8deg); }
}
.animate-stage-6-up { animation: stage-6-up 1.8s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes stage-7-up {
  25% { transform: scale(4) rotate(30deg); filter: brightness(8) saturate(3.5); }
  50% { transform: scale(0.6) rotate(-15deg); }
  80% { transform: scale(1.2) rotate(10deg); }
}
.animate-stage-7-up { animation: stage-7-up 1.8s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes stage-8-up {
  20% { transform: scale(5) rotate(40deg); filter: brightness(6) contrast(1.4); }
  40% { transform: scale(0.5) rotate(-20deg); }
  70% { transform: scale(1.3) rotate(15deg); }
}
.animate-stage-8-up { animation: stage-8-up 1.8s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* =================================================================== */
/* 光环与粒子系统 */
/* =================================================================== */
.warm-flare { --glow-color: #ffa50088; --glow-color-soft: #ffa50033; }
.coral-flare { --glow-color: #ff6b6b88; --glow-color-soft: #ff6b6b33; }
.golden-flare { --glow-color: #ffd16688; --glow-color-soft: #ffd16633; }
.electric-flare { --glow-color: #3b82f688; --glow-color-soft: #3b82f633; }
.cosmic-flare { --glow-color: #9333ea88; --glow-color-soft: #9333ea33; }
.chaos-flare { --glow-color: #ef444488; --glow-color-soft: #ef444433; }
.divine-flare { --glow-color: #facc1588; --glow-color-soft: #facc1533; }
.pure-flare { --glow-color: #ffffffaa; --glow-color-soft: #ffffff44; }

@keyframes flare-burst {
  0% { transform: scale(0); opacity: 0; box-shadow: none; }
  30% { transform: scale(2); opacity: 1; box-shadow: 0 0 80px 40px var(--glow-color), 0 0 120px 80px var(--glow-color-soft); }
  100% { transform: scale(1.5); opacity: 0; box-shadow: 0 0 60px 30px var(--glow-color-soft); }
}
.animate-flare-burst {
  animation: flare-burst 1.2s ease-out both;
  border-radius: 50%;
}

/* 粒子动画 */
/* 粒子初始态，避免中心闪点 */
.combo-particle { opacity: 0; transform: scale(0); animation-fill-mode: both; backface-visibility: hidden; }
.taiji-particle,
.divine-particle,
.chaos-particle,
.cosmic-particle,
.electric-particle,
.golden-particle,
.coral-particle,
.warm-particle {
  opacity: 0;
  will-change: transform, opacity;
  animation-fill-mode: both;
}
@keyframes particle-burst-stage-1 {
  0% { transform: translate(0, 0) scale(0.2); opacity: 0; }
  8% { transform: translate(calc(var(--tx)*0.05), calc(var(--ty)*0.05)) scale(1); opacity: 1; }
  to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

@keyframes particle-burst-stage-2 {
  0% { transform: translate(0, 0) scale(0.2); opacity: 0; }
  8% { transform: translate(calc(var(--tx)*0.05), calc(var(--ty)*0.05)) scale(1); opacity: 1; }
  to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

@keyframes particle-burst-stage-3 {
  0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
  10% { transform: translate(calc(var(--tx)*0.05), calc(var(--ty)*0.05)) scale(1) rotate(45deg); opacity: 1; }
  40% { transform: translate(calc(var(--tx)*0.4), calc(var(--ty)*0.4)) scale(2) rotate(180deg); }
  to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg); opacity: 0; }
}

@keyframes particle-burst-stage-4 {
  0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
  10% { transform: translate(calc(var(--tx)*0.05), calc(var(--ty)*0.05)) scale(1) rotate(45deg); opacity: 1; }
  40% { transform: translate(calc(var(--tx)*0.4), calc(var(--ty)*0.4)) scale(2) rotate(180deg); }
  to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg); opacity: 0; }
}

@keyframes particle-burst-stage-5 {
  0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
  8% { transform: translate(calc(var(--tx)*0.04), calc(var(--ty)*0.04)) scale(1) rotate(30deg); opacity: 1; }
  20% { transform: translate(calc(var(--tx)*0.2), calc(var(--ty)*0.2)) scale(3) rotate(90deg); filter: brightness(2.5); }
  to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(540deg); opacity: 0; }
}

@keyframes particle-burst-stage-6 {
  0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
  8% { transform: translate(calc(var(--tx)*0.04), calc(var(--ty)*0.04)) scale(1) rotate(30deg); opacity: 1; }
  20% { transform: translate(calc(var(--tx)*0.2), calc(var(--ty)*0.2)) scale(3) rotate(90deg); filter: brightness(2.5); }
  to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(540deg); opacity: 0; }
}

@keyframes particle-burst-stage-7 {
  0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
  8% { transform: translate(calc(var(--tx)*0.04), calc(var(--ty)*0.04)) scale(1) rotate(30deg); opacity: 1; }
  15% { transform: translate(calc(var(--tx)*0.15), calc(var(--ty)*0.15)) scale(4) rotate(60deg); filter: brightness(3.5) blur(1px); }
  to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(720deg); opacity: 0; }
}

@keyframes particle-burst-stage-8 {
  0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
  6% { transform: translate(calc(var(--tx)*0.03), calc(var(--ty)*0.03)) scale(1) rotate(20deg); opacity: 1; }
  10% { transform: translate(calc(var(--tx)*0.1), calc(var(--ty)*0.1)) scale(5) rotate(45deg); filter: brightness(5) blur(2px); }
  to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(1080deg); opacity: 0; }
}

/* 能量波纹 */
@keyframes energy-ring {
  0% { transform: scale(0.2); opacity: 0; border-width: 0px; }
  10% { opacity: 1; border-width: 2px; }
  100% { transform: scale(3); opacity: 0; border-width: 2px; }
}
.animate-energy-ring {
  animation: energy-ring 1.5s ease-out both;
  will-change: transform, opacity, border-width;
}

/* 破碎晶体 */
@keyframes shard-burst-enhanced {
  from { transform: rotate(var(--start-rot, 0deg)) scale(0); opacity: 0; }
  25% { opacity: 1; }
  to { transform: rotate(var(--end-rot, 360deg)) scale(2) translateX(120px); opacity: 0; }
}
.animate-shard-burst-enhanced {
  animation: shard-burst-enhanced 1s ease-out;
}

/* 神圣光柱 */
@keyframes divine-beam {
  0%, 100% { opacity: 0; transform: scaleY(0); }
  50% { opacity: 1; transform: scaleY(1); }
}
.animate-divine-beam {
  animation: divine-beam 1.5s ease-in-out;
}

/* 终极光环 */
@keyframes ultimate-halo {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  30% { transform: scale(1.5) rotate(180deg); opacity: 1; }
  100% { transform: scale(3) rotate(720deg); opacity: 0; }
}
.animate-ultimate-halo {
  animation: ultimate-halo 2s ease-out;
}

.ultimate-halo-taiji {
  border: 4px solid transparent;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.8) 0%, transparent 40%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.8) 0%, transparent 40%),
    conic-gradient(from 0deg, rgba(0, 0, 0, 0.6), rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0.6));
  box-shadow: 
    0 0 80px 40px rgba(128, 128, 128, 0.5), 
    inset 0 0 40px rgba(128, 128, 128, 0.3);
}

.taiji-flare { 
  --glow-color: rgba(128, 128, 128, 0.7); 
  --glow-color-soft: rgba(128, 128, 128, 0.3); 
}

.ultimate-halo-divine {
  border: 4px solid rgba(250, 204, 21, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 120px 60px rgba(250, 204, 21, 0.7), inset 0 0 60px rgba(250, 204, 21, 0.5);
}

/* 文字冲击动画 */
@keyframes label-impact {
  30% { transform: translateY(-10px) scale(1.3); opacity: 1; }
}
.animate-label-impact { animation: label-impact 1s ease; }

@keyframes number-impact {
  30% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px var(--glow-color, rgba(255, 255, 255, 0.4)); }
}
.animate-number-impact { animation: number-impact 1.2s ease-out both; will-change: text-shadow; }

@keyframes rank-impact {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  25% { opacity: 0; }
  60% { transform: translateY(15px) scale(1.4); opacity: 1; }
}
.animate-rank-impact { animation: rank-impact 1.4s ease; }

/* =================================================================== */
/* 简约模式动画 */
/* =================================================================== */
@keyframes engrave-stamp {
  from { transform: translateY(-25px) scale(1.4); opacity: 0; }
  60% { transform: translateY(3px) scale(0.95); opacity: 1; }
  to { transform: translateY(0) scale(1); }
}
.animate-engrave-stamp { animation: engrave-stamp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes echo-ripple {
  from { box-shadow: inset 0 0 0 3px rgba(255, 107, 107, 0.6); transform: scale(0.6); opacity: 1; }
  to { box-shadow: inset 0 0 0 0px rgba(255, 107, 107, 0); transform: scale(3); opacity: 0; }
}
.animate-echo-ripple::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: 50%;
  animation: echo-ripple 0.6s ease-out;
}
</style>
