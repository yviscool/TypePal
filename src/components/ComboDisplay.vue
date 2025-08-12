<template>
  <!-- 全局背景特效层 -->
  <div v-if="comboCount >= 3 && effectsLevel !== 'none'" class="fixed inset-0 pointer-events-none z-10"
    :class="globalBackgroundClass">

    <!-- 背景脉冲纹理 -->
    <div class="absolute inset-0" :class="pulseTextureClass"></div>

    <!-- 能量流动层 -->
    <div v-if="stage >= 2" class="absolute inset-0" :class="energyFlowClass"></div>

    <!-- 能量薄雾层 -->
    <div v-if="stage >= 4" class="absolute inset-0" :class="energyMistClass"></div>

    <!-- 空间扭曲层 -->
    <div v-if="stage >= 5" class="absolute inset-0" :class="spaceDistortionClass"></div>

    <!-- 裂痕破碎层 -->
    <div v-if="stage >= 6" class="absolute inset-0" :class="worldBreakClass"></div>

    <!-- 神域矩阵层 -->
    <div v-if="stage >= 7" class="absolute inset-0" :class="divineMatrixClass"></div>

    <!-- 纯光形态层 -->
    <div v-if="stage >= 8" class="absolute inset-0" :class="onenessLightClass"></div>
  </div>

  <!-- 连击显示主体 -->
  <div v-if="comboCount >= 3 && effectsLevel !== 'none'"
    class="absolute top-0 left-0 transform -translate-x-4 -translate-y-16 z-20">

    <div v-if="effectsLevel === 'gorgeous'" class="relative select-none flex items-center justify-center w-64 h-64"
      :class="impactAnimationClass">

      <div class="relative flex flex-col items-center justify-center">
        <!-- 连击标签 -->
        <div class="font-black tracking-[0.3em] opacity-80 transition-all duration-300"
          :class="[stageClasses.label, idleAnimationClass.label, { 'animate-label-impact': animationState !== 'idle' }]">
          连击
        </div>

        <!-- 连击数字 -->
        <div class="relative font-black tracking-tighter leading-none my-1"
          :class="[stageClasses.number, idleAnimationClass.number, { 'animate-number-impact': animationState !== 'idle' }]">
          {{ comboCount }}
        </div>

        <!-- 阶段称号 -->
        <div class="font-bold tracking-[0.15em] transition-all duration-300"
          :class="[stageClasses.rank, idleAnimationClass.rank, { 'animate-rank-impact': animationState !== 'idle' }]">
          {{ stageTitle }}
        </div>
      </div>

      <!-- 特效粒子层 -->
      <div v-if="animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 animate-flare-burst" :class="stageClasses.flare"></div>

        <!-- 动态粒子 -->
        <div v-for="p in particleCount" :key="p" class="absolute left-1/2 top-1/2 rounded-full"
          :class="[stageClasses.particle, particleShapeClass]" :style="particleStyles[p - 1]">
        </div>
      </div>

      <!-- 阶段特殊效果 -->
      <div v-if="stage >= 6" class="absolute inset-0 pointer-events-none">
        <!-- 破碎晶体效果 -->
        <div v-for="shard in 12" :key="`shard-${shard}`"
          class="absolute w-1 h-8 bg-gradient-to-t from-transparent via-white to-transparent opacity-60"
          :class="shardAnimationClass" :style="shardStyles[shard - 1]">
        </div>
      </div>

    </div>

    <!-- 简约模式保持不变 -->
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

// --- 阶段判定函数 ---
const getStage = (count: number): Stage => {
  if (count >= 200) return 8  // 人键合一
  if (count >= 100) return 7  // 天下至尊
  if (count >= 60) return 6   // 毁天灭地
  if (count >= 35) return 5   // 神魔让道
  if (count >= 20) return 4   // 键气滔天
  if (count >= 12) return 3   // 键神附体
  if (count >= 6) return 2    // 所向披靡
  return 1                    // 小试牛刀
}

// --- 核心计算属性 ---
const stage = computed<Stage>(() => getStage(props.comboCount))

const stageTitle = computed(() => {
  switch (stage.value) {
    case 8: return '人键合一'
    case 7: return '天下至尊'
    case 6: return '毁天灭地'
    case 5: return '神魔让道'
    case 4: return '键气滔天'
    case 3: return '键神附体'
    case 2: return '所向披靡'
    default: return '小试牛刀'
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
    animationTimeout = window.setTimeout(() => animationState.value = 'idle', isStageUp ? 1500 : 800)

  } else if (props.effectsLevel === 'simple') {
    clearTimeout(simpleAnimationTimeout)
    simpleAnimationState.value = 'hit'
    simpleAnimationTimeout = window.setTimeout(() => {
      simpleAnimationState.value = 'idle'
    }, 500)
  }
})

// --- 全局背景特效类 ---
const globalBackgroundClass = computed(() => {
  const baseClass = 'transition-all duration-1000'
  switch (stage.value) {
    case 8: return `${baseClass} oneness-background`
    case 7: return `${baseClass} divine-background`
    case 6: return `${baseClass} worldbreak-background`
    case 5: return `${baseClass} godlike-background`
    case 4: return `${baseClass} aura-background`
    case 3: return `${baseClass} keystroke-background`
    case 2: return `${baseClass} flowing-background`
    default: return `${baseClass} spark-background`
  }
})

const pulseTextureClass = computed(() => {
  if (stage.value === 1) return 'animate-subtle-pulse'
  if (stage.value >= 2) return 'animate-energy-pulse'
  return ''
})

const energyFlowClass = computed(() => {
  if (stage.value >= 2) return 'animate-energy-flow'
  return ''
})

const energyMistClass = computed(() => {
  if (stage.value >= 4) return 'animate-energy-mist'
  return ''
})

const spaceDistortionClass = computed(() => {
  if (stage.value >= 5) return 'animate-space-distortion'
  return ''
})

const worldBreakClass = computed(() => {
  if (stage.value >= 6) return 'animate-world-break'
  return ''
})

const divineMatrixClass = computed(() => {
  if (stage.value >= 7) return 'animate-divine-matrix'
  return ''
})

const onenessLightClass = computed(() => {
  if (stage.value >= 8) return 'animate-oneness-light'
  return ''
})

// --- 主体显示样式 ---
const impactAnimationClass = computed(() => {
  if (animationState.value === 'stage-up') return `animate-stage-${stage.value}-up`
  if (animationState.value === 'hit') return `animate-stage-${stage.value}-hit`
  return ''
})

const stageClasses = computed(() => {
  switch (stage.value) {
    case 8: // 人键合一
      return {
        label: 'text-white/90 text-xl font-light tracking-[0.5em]',
        number: 'text-9xl text-white font-thin',
        rank: 'text-white/80 text-3xl font-light tracking-[0.3em]',
        flare: 'oneness-flare',
        particle: 'bg-white/80'
      }
    case 7: // 天下至尊
      return {
        label: 'text-yellow-200 text-lg font-bold tracking-[0.4em]',
        number: 'text-8xl text-yellow-100 font-black',
        rank: 'text-yellow-300 text-2xl font-bold tracking-[0.2em]',
        flare: 'divine-flare',
        particle: 'bg-yellow-300'
      }
    case 6: // 毁天灭地
      return {
        label: 'text-red-300 text-lg font-black tracking-[0.3em]',
        number: 'text-8xl text-red-100 font-black',
        rank: 'text-red-400 text-2xl font-black tracking-[0.15em]',
        flare: 'worldbreak-flare',
        particle: 'bg-red-400'
      }
    case 5: // 神魔让道
      return {
        label: 'text-purple-300 text-lg font-bold tracking-[0.3em]',
        number: 'text-8xl text-purple-100 font-black',
        rank: 'text-purple-400 text-2xl font-bold tracking-[0.15em]',
        flare: 'godlike-flare',
        particle: 'bg-purple-400'
      }
    case 4: // 键气滔天
      return {
        label: 'text-blue-300 text-base font-bold tracking-[0.3em]',
        number: 'text-7xl text-blue-100 font-black',
        rank: 'text-blue-400 text-xl font-bold tracking-[0.15em]',
        flare: 'aura-flare',
        particle: 'bg-blue-400'
      }
    case 3: // 键神附体
      return {
        label: 'text-cyan-300 text-base font-bold tracking-[0.3em]',
        number: 'text-7xl text-cyan-100 font-black',
        rank: 'text-cyan-400 text-xl font-bold tracking-[0.15em]',
        flare: 'keystroke-flare',
        particle: 'bg-cyan-400'
      }
    case 2: // 所向披靡
      return {
        label: 'text-green-400 text-sm font-semibold tracking-[0.25em]',
        number: 'text-6xl text-green-300 font-bold',
        rank: 'text-green-500 text-lg font-semibold tracking-[0.1em]',
        flare: 'flowing-flare',
        particle: 'bg-green-400'
      }
    default: // 小试牛刀
      return {
        label: 'text-orange-400 text-sm font-medium tracking-[0.2em]',
        number: 'text-6xl text-orange-300 font-bold',
        rank: 'text-orange-500 text-lg font-medium',
        flare: 'spark-flare',
        particle: 'bg-orange-400'
      }
  }
})

const idleAnimationClass = computed(() => {
  if (animationState.value !== 'idle') {
    return { label: '', number: '', rank: '' }
  }

  switch (stage.value) {
    case 8:
      return {
        label: 'animate-oneness-float',
        number: 'animate-oneness-glow',
        rank: 'animate-oneness-float-delayed'
      }
    case 7:
      return {
        label: 'animate-divine-float',
        number: 'animate-divine-glow',
        rank: 'animate-divine-float-delayed'
      }
    case 6:
      return {
        label: 'animate-chaos-shake',
        number: 'animate-worldbreak-glow',
        rank: 'animate-chaos-shake-delayed'
      }
    case 5:
      return {
        label: 'animate-godlike-float',
        number: 'animate-godlike-glow',
        rank: 'animate-godlike-float-delayed'
      }
    case 4:
      return {
        label: 'animate-aura-float',
        number: 'animate-aura-glow',
        rank: 'animate-aura-float-delayed'
      }
    case 3:
      return {
        label: 'animate-keystroke-float',
        number: 'animate-keystroke-glow',
        rank: 'animate-keystroke-float-delayed'
      }
    default:
      return { label: '', number: '', rank: '' }
  }
})

// --- 粒子系统 ---
const particleCount = computed(() => {
  if (stage.value >= 6) return 16
  if (stage.value >= 4) return 12
  if (stage.value >= 2) return 8
  return 6
})

const particleShapeClass = computed(() => {
  if (stage.value >= 7) return 'w-3 h-3'
  if (stage.value >= 5) return 'w-2.5 h-2.5'
  return 'w-2 h-2'
})

const particleStyles = computed(() => {
  const baseDirections = [
    { x: 0, y: -110, delay: 0 }, { x: 80, y: -80, delay: 50 },
    { x: 110, y: 0, delay: 25 }, { x: 80, y: 80, delay: 75 },
    { x: 0, y: 110, delay: 0 }, { x: -80, y: 80, delay: 50 },
    { x: -110, y: 0, delay: 25 }, { x: -80, y: -80, delay: 75 },
  ]

  // 为高阶段添加更多粒子方向
  const extraDirections = [
    { x: 40, y: -130, delay: 100 }, { x: 130, y: -40, delay: 125 },
    { x: 130, y: 40, delay: 150 }, { x: 40, y: 130, delay: 175 },
    { x: -40, y: 130, delay: 200 }, { x: -130, y: 40, delay: 225 },
    { x: -130, y: -40, delay: 250 }, { x: -40, y: -130, delay: 275 },
  ]

  const directions = particleCount.value > 8
    ? [...baseDirections, ...extraDirections.slice(0, particleCount.value - 8)]
    : baseDirections.slice(0, particleCount.value)

  const duration = animationState.value === 'stage-up' ? '1.5s' : '0.8s'
  const scaleFactor = animationState.value === 'stage-up' ? 2 : 1.2

  return directions.map(dir => ({
    '--tx': `${dir.x * scaleFactor}px`,
    '--ty': `${dir.y * scaleFactor}px`,
    animation: `particle-burst-stage-${stage.value} ${duration} cubic-bezier(0.1, 0.8, 0.7, 1) ${dir.delay}ms`,
  }))
})

// --- 破碎晶体效果 ---
const shardAnimationClass = computed(() => {
  if (animationState.value !== 'idle') return 'animate-shard-burst'
  return 'animate-shard-idle'
})

const shardStyles = computed(() => {
  const angles = Array.from({ length: 12 }, (_, i) => i * 30)
  return angles.map((angle, i) => ({
    transform: `rotate(${angle}deg)`,
    left: '50%',
    top: '50%',
    transformOrigin: '0 4px',
    animationDelay: `${i * 50}ms`
  }))
})

</script>

<style scoped>
/* =================================================================== */
/* 全局沉浸式连击特效系统 - 八阶段递进 */
/* =================================================================== */

/* --- 第一阶段：小试牛刀 (Initial Spark) --- */
.spark-background {
  background: radial-gradient(circle at center, rgba(251, 146, 60, 0.02) 0%, transparent 70%);
}

@keyframes subtle-pulse {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.01);
  }
}

.animate-subtle-pulse {
  background: radial-gradient(circle, rgba(251, 146, 60, 0.05) 0%, transparent 50%);
  animation: subtle-pulse 4s ease-in-out infinite;
}

/* --- 第二阶段：所向披靡 (Flowing Edge) --- */
.flowing-background {
  background: linear-gradient(45deg, rgba(34, 197, 94, 0.03) 0%, rgba(34, 197, 94, 0.01) 50%, transparent 100%);
}

@keyframes energy-pulse {

  0%,
  100% {
    opacity: 0.4;
  }

  50% {
    opacity: 0.7;
  }
}

.animate-energy-pulse {
  background: repeating-linear-gradient(90deg,
      transparent 0px,
      rgba(34, 197, 94, 0.1) 2px,
      transparent 4px);
  animation: energy-pulse 3s ease-in-out infinite;
}

@keyframes energy-flow {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100vw);
  }
}

.animate-energy-flow {
  background: linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.2) 50%, transparent 100%);
  width: 200px;
  height: 2px;
  animation: energy-flow 8s linear infinite;
}

/* --- 第三阶段：键神附体 (Keystroke God) --- */
.keystroke-background {
  background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.05) 0%, rgba(6, 182, 212, 0.02) 40%, transparent 70%);
}

@keyframes keystroke-float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

.animate-keystroke-float {
  animation: keystroke-float 2.5s ease-in-out infinite;
}

@keyframes keystroke-glow {

  0%,
  100% {
    text-shadow: 0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3);
    transform: scale(1);
  }

  50% {
    text-shadow: 0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(6, 182, 212, 0.5);
    transform: scale(1.02);
  }
}

.animate-keystroke-glow {
  animation: keystroke-glow 2s ease-in-out infinite;
}

.animate-keystroke-float-delayed {
  animation: keystroke-float 2.5s ease-in-out infinite 0.3s;
}

/* --- 第四阶段：键气滔天 (Aura Overflow) --- */
.aura-background {
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 50%, transparent 80%);
}

@keyframes energy-mist {
  0% {
    opacity: 0.3;
    transform: rotate(0deg) scale(1);
  }

  50% {
    opacity: 0.6;
    transform: rotate(180deg) scale(1.1);
  }

  100% {
    opacity: 0.3;
    transform: rotate(360deg) scale(1);
  }
}

.animate-energy-mist {
  background: conic-gradient(from 0deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1));
  animation: energy-mist 12s linear infinite;
}

@keyframes aura-float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  33% {
    transform: translateY(-8px) rotate(1deg);
  }

  66% {
    transform: translateY(-4px) rotate(-1deg);
  }
}

.animate-aura-float {
  animation: aura-float 3s ease-in-out infinite;
}

@keyframes aura-glow {

  0%,
  100% {
    text-shadow: 0 0 25px rgba(59, 130, 246, 0.7), 0 0 50px rgba(59, 130, 246, 0.4);
    filter: brightness(1);
  }

  50% {
    text-shadow: 0 0 40px rgba(59, 130, 246, 0.9), 0 0 80px rgba(59, 130, 246, 0.6);
    filter: brightness(1.2);
  }
}

.animate-aura-glow {
  animation: aura-glow 2.2s ease-in-out infinite;
}

.animate-aura-float-delayed {
  animation: aura-float 3s ease-in-out infinite 0.4s;
}

/* --- 第五阶段：神魔让道 (Divine Dominion) --- */
.godlike-background {
  background: radial-gradient(ellipse at center, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0.05) 40%, transparent 70%);
}

@keyframes space-distortion {

  0%,
  100% {
    transform: scale(1) skew(0deg);
    filter: blur(0px);
  }

  25% {
    transform: scale(1.02) skew(0.5deg);
    filter: blur(0.5px);
  }

  75% {
    transform: scale(0.98) skew(-0.5deg);
    filter: blur(0.3px);
  }
}

.animate-space-distortion {
  background: radial-gradient(circle, rgba(147, 51, 234, 0.15) 30%, transparent 70%);
  animation: space-distortion 4s ease-in-out infinite;
}

@keyframes godlike-float {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-12px) scale(1.01);
  }
}

.animate-godlike-float {
  animation: godlike-float 3.5s ease-in-out infinite;
}

@keyframes godlike-glow {

  0%,
  100% {
    text-shadow: 0 0 30px rgba(147, 51, 234, 0.8), 0 0 60px rgba(147, 51, 234, 0.5), 0 0 90px rgba(147, 51, 234, 0.3);
    filter: brightness(1) saturate(1);
  }

  50% {
    text-shadow: 0 0 50px rgba(147, 51, 234, 1), 0 0 100px rgba(147, 51, 234, 0.7), 0 0 150px rgba(147, 51, 234, 0.5);
    filter: brightness(1.3) saturate(1.2);
  }
}

.animate-godlike-glow {
  animation: godlike-glow 2.5s ease-in-out infinite;
}

.animate-godlike-float-delayed {
  animation: godlike-float 3.5s ease-in-out infinite 0.5s;
}

/* --- 第六阶段：毁天灭地 (World Breaker) --- */
.worldbreak-background {
  background:
    linear-gradient(45deg, rgba(239, 68, 68, 0.1) 0%, transparent 30%),
    linear-gradient(-45deg, transparent 70%, rgba(239, 68, 68, 0.08) 100%);
}

@keyframes world-break {

  0%,
  100% {
    opacity: 0.6;
    transform: scale(1) rotate(0deg);
    filter: contrast(1);
  }

  25% {
    opacity: 0.9;
    transform: scale(1.05) rotate(1deg);
    filter: contrast(1.2);
  }

  75% {
    opacity: 0.7;
    transform: scale(0.95) rotate(-1deg);
    filter: contrast(1.1);
  }
}

.animate-world-break {
  background:
    repeating-conic-gradient(from 0deg at 20% 30%, rgba(239, 68, 68, 0.1) 0deg, transparent 60deg),
    repeating-conic-gradient(from 90deg at 80% 70%, rgba(239, 68, 68, 0.08) 0deg, transparent 45deg);
  animation: world-break 3s ease-in-out infinite;
}

@keyframes chaos-shake {

  0%,
  100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }

  10% {
    transform: translateX(-1px) translateY(-1px) rotate(0.2deg);
  }

  20% {
    transform: translateX(1px) translateY(1px) rotate(-0.2deg);
  }

  30% {
    transform: translateX(-1px) translateY(1px) rotate(0.1deg);
  }

  40% {
    transform: translateX(1px) translateY(-1px) rotate(-0.1deg);
  }

  50% {
    transform: translateX(-1px) translateY(-1px) rotate(0.2deg);
  }

  60% {
    transform: translateX(1px) translateY(1px) rotate(-0.2deg);
  }

  70% {
    transform: translateX(-1px) translateY(1px) rotate(0.1deg);
  }

  80% {
    transform: translateX(1px) translateY(-1px) rotate(-0.1deg);
  }

  90% {
    transform: translateX(-1px) translateY(-1px) rotate(0.2deg);
  }
}

.animate-chaos-shake {
  animation: chaos-shake 0.8s ease-in-out infinite;
}

.animate-chaos-shake-delayed {
  animation: chaos-shake 0.8s ease-in-out infinite 0.2s;
}

@keyframes worldbreak-glow {

  0%,
  100% {
    text-shadow:
      0 0 20px rgba(239, 68, 68, 0.8),
      0 0 40px rgba(239, 68, 68, 0.6),
      0 0 60px rgba(239, 68, 68, 0.4);
    filter: brightness(1) contrast(1);
  }

  50% {
    text-shadow:
      0 0 40px rgba(239, 68, 68, 1),
      0 0 80px rgba(239, 68, 68, 0.8),
      0 0 120px rgba(239, 68, 68, 0.6);
    filter: brightness(1.4) contrast(1.3);
  }
}

.animate-worldbreak-glow {
  animation: worldbreak-glow 1.8s ease-in-out infinite;
}

@keyframes shard-burst {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }

  20% {
    transform: scale(1.2) rotate(90deg);
    opacity: 1;
  }

  100% {
    transform: scale(0.8) rotate(180deg);
    opacity: 0;
  }
}

.animate-shard-burst {
  animation: shard-burst 1s ease-out;
}

@keyframes shard-idle {

  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.3;
  }

  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.6;
  }
}

.animate-shard-idle {
  animation: shard-idle 3s linear infinite;
}

/* --- 第七阶段：天下至尊 (Supreme Sovereign) --- */
.divine-background {
  background:
    radial-gradient(circle at 30% 20%, rgba(250, 204, 21, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(250, 204, 21, 0.06) 0%, transparent 50%);
}

@keyframes divine-matrix {

  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
    filter: brightness(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.02);
    filter: brightness(1.2);
  }
}

.animate-divine-matrix {
  background:
    repeating-linear-gradient(0deg, rgba(250, 204, 21, 0.1) 0px, transparent 2px, transparent 20px),
    repeating-linear-gradient(90deg, rgba(250, 204, 21, 0.08) 0px, transparent 2px, transparent 25px),
    repeating-linear-gradient(45deg, rgba(250, 204, 21, 0.05) 0px, transparent 1px, transparent 30px);
  animation: divine-matrix 5s ease-in-out infinite;
}

@keyframes divine-float {

  0%,
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }

  33% {
    transform: translateY(-10px) scale(1.01) rotate(0.5deg);
  }

  66% {
    transform: translateY(-5px) scale(1.005) rotate(-0.5deg);
  }
}

.animate-divine-float {
  animation: divine-float 4s ease-in-out infinite;
}

@keyframes divine-glow {

  0%,
  100% {
    text-shadow:
      0 0 25px rgba(250, 204, 21, 0.9),
      0 0 50px rgba(250, 204, 21, 0.7),
      0 0 75px rgba(250, 204, 21, 0.5),
      0 0 100px rgba(250, 204, 21, 0.3);
    filter: brightness(1) saturate(1);
  }

  50% {
    text-shadow:
      0 0 40px rgba(250, 204, 21, 1),
      0 0 80px rgba(250, 204, 21, 0.9),
      0 0 120px rgba(250, 204, 21, 0.7),
      0 0 160px rgba(250, 204, 21, 0.5);
    filter: brightness(1.3) saturate(1.2);
  }
}

.animate-divine-glow {
  animation: divine-glow 3s ease-in-out infinite;
}

.animate-divine-float-delayed {
  animation: divine-float 4s ease-in-out infinite 0.6s;
}

/* --- 第八阶段：人键合一 (Oneness) --- */
.oneness-background {
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%);
}

@keyframes oneness-light {

  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
    filter: brightness(1) blur(0px);
  }

  50% {
    opacity: 1;
    transform: scale(1.01);
    filter: brightness(1.1) blur(0.5px);
  }
}

.animate-oneness-light {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%);
  animation: oneness-light 6s ease-in-out infinite;
}

@keyframes oneness-float {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-8px) scale(1.005);
  }
}

.animate-oneness-float {
  animation: oneness-float 5s ease-in-out infinite;
}

@keyframes oneness-glow {

  0%,
  100% {
    text-shadow:
      0 0 30px rgba(255, 255, 255, 0.8),
      0 0 60px rgba(255, 255, 255, 0.6),
      0 0 90px rgba(255, 255, 255, 0.4),
      0 0 120px rgba(255, 255, 255, 0.2);
    filter: brightness(1) saturate(0.9);
  }

  50% {
    text-shadow:
      0 0 50px rgba(255, 255, 255, 1),
      0 0 100px rgba(255, 255, 255, 0.8),
      0 0 150px rgba(255, 255, 255, 0.6),
      0 0 200px rgba(255, 255, 255, 0.4);
    filter: brightness(1.2) saturate(1);
  }
}

.animate-oneness-glow {
  animation: oneness-glow 4s ease-in-out infinite;
}

.animate-oneness-float-delayed {
  animation: oneness-float 5s ease-in-out infinite 0.8s;
}

/* =================================================================== */
/* 阶段冲击动画系统 */
/* =================================================================== */

/* --- 各阶段Hit动画 --- */
@keyframes stage-1-hit {
  0% {
    transform: scale(1);
  }

  30% {
    transform: scale(1.15) rotate(-2deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
  }
}

.animate-stage-1-hit {
  animation: stage-1-hit 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-2-hit {
  0% {
    transform: scale(1);
  }

  30% {
    transform: scale(1.25) rotate(-3deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
  }
}

.animate-stage-2-hit {
  animation: stage-2-hit 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-3-hit {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }

  30% {
    transform: scale(1.35) rotate(-4deg);
    filter: brightness(1.5);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
}

.animate-stage-3-hit {
  animation: stage-3-hit 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-4-hit {
  0% {
    transform: scale(1);
    filter: brightness(1) saturate(1);
  }

  30% {
    transform: scale(1.4) rotate(-5deg);
    filter: brightness(1.8) saturate(1.3);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) saturate(1);
  }
}

.animate-stage-4-hit {
  animation: stage-4-hit 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-5-hit {
  0% {
    transform: scale(1);
    filter: brightness(1) contrast(1);
  }

  30% {
    transform: scale(1.5) rotate(-6deg);
    filter: brightness(2) contrast(1.2);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) contrast(1);
  }
}

.animate-stage-5-hit {
  animation: stage-5-hit 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-6-hit {
  0% {
    transform: scale(1);
    filter: brightness(1) contrast(1) hue-rotate(0deg);
  }

  15% {
    transform: scale(1.6) rotate(-8deg);
    filter: brightness(2.5) contrast(1.5) hue-rotate(10deg);
  }

  45% {
    transform: scale(0.8) rotate(4deg);
    filter: brightness(1.2) contrast(1.1) hue-rotate(-5deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) contrast(1) hue-rotate(0deg);
  }
}

.animate-stage-6-hit {
  animation: stage-6-hit 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-7-hit {
  0% {
    transform: scale(1);
    filter: brightness(1) saturate(1) blur(0px);
  }

  20% {
    transform: scale(1.7) rotate(-10deg);
    filter: brightness(3) saturate(1.5) blur(1px);
  }

  50% {
    transform: scale(0.9) rotate(5deg);
    filter: brightness(1.5) saturate(1.2) blur(0.5px);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) saturate(1) blur(0px);
  }
}

.animate-stage-7-hit {
  animation: stage-7-hit 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-8-hit {
  0% {
    transform: scale(1);
    filter: brightness(1) blur(0px) opacity(1);
  }

  25% {
    transform: scale(1.8) rotate(-12deg);
    filter: brightness(4) blur(2px) opacity(0.9);
  }

  60% {
    transform: scale(0.95) rotate(6deg);
    filter: brightness(2) blur(1px) opacity(0.95);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) blur(0px) opacity(1);
  }
}

.animate-stage-8-hit {
  animation: stage-8-hit 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* --- 各阶段升级动画 --- */
@keyframes stage-2-up {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }

  25% {
    transform: scale(1.8) rotate(10deg);
    filter: brightness(2.5);
  }

  60% {
    transform: scale(0.8) rotate(-5deg);
    filter: brightness(1.2);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
}

.animate-stage-2-up {
  animation: stage-2-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-3-up {
  0% {
    transform: scale(1);
    filter: brightness(1) saturate(1);
  }

  25% {
    transform: scale(2) rotate(15deg);
    filter: brightness(3) saturate(1.5);
  }

  60% {
    transform: scale(0.85) rotate(-8deg);
    filter: brightness(1.5) saturate(1.2);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) saturate(1);
  }
}

.animate-stage-3-up {
  animation: stage-3-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-4-up {
  0% {
    transform: scale(1);
    filter: brightness(1) saturate(1) contrast(1);
  }

  25% {
    transform: scale(2.2) rotate(20deg);
    filter: brightness(3.5) saturate(1.8) contrast(1.3);
  }

  60% {
    transform: scale(0.8) rotate(-10deg);
    filter: brightness(1.8) saturate(1.3) contrast(1.1);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) saturate(1) contrast(1);
  }
}

.animate-stage-4-up {
  animation: stage-4-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-5-up {
  0% {
    transform: scale(1);
    filter: brightness(1) contrast(1) hue-rotate(0deg);
  }

  25% {
    transform: scale(2.5) rotate(25deg);
    filter: brightness(4) contrast(1.5) hue-rotate(15deg);
  }

  60% {
    transform: scale(0.75) rotate(-12deg);
    filter: brightness(2) contrast(1.2) hue-rotate(-8deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) contrast(1) hue-rotate(0deg);
  }
}

.animate-stage-5-up {
  animation: stage-5-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-6-up {
  0% {
    transform: scale(1);
    filter: brightness(1) contrast(1) saturate(1) blur(0px);
  }

  15% {
    transform: scale(3) rotate(30deg);
    filter: brightness(5) contrast(2) saturate(2) blur(2px);
  }

  40% {
    transform: scale(0.7) rotate(-15deg);
    filter: brightness(2.5) contrast(1.3) saturate(1.5) blur(1px);
  }

  70% {
    transform: scale(1.1) rotate(8deg);
    filter: brightness(1.5) contrast(1.1) saturate(1.2) blur(0.5px);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) contrast(1) saturate(1) blur(0px);
  }
}

.animate-stage-6-up {
  animation: stage-6-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-7-up {
  0% {
    transform: scale(1);
    filter: brightness(1) saturate(1) blur(0px) hue-rotate(0deg);
  }

  20% {
    transform: scale(3.5) rotate(40deg);
    filter: brightness(6) saturate(2.5) blur(3px) hue-rotate(30deg);
  }

  50% {
    transform: scale(0.6) rotate(-20deg);
    filter: brightness(3) saturate(1.8) blur(1.5px) hue-rotate(-15deg);
  }

  80% {
    transform: scale(1.2) rotate(10deg);
    filter: brightness(1.8) saturate(1.3) blur(0.8px) hue-rotate(5deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) saturate(1) blur(0px) hue-rotate(0deg);
  }
}

.animate-stage-7-up {
  animation: stage-7-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stage-8-up {
  0% {
    transform: scale(1);
    filter: brightness(1) blur(0px) opacity(1) saturate(1);
  }

  15% {
    transform: scale(4) rotate(50deg);
    filter: brightness(8) blur(4px) opacity(0.8) saturate(3);
  }

  35% {
    transform: scale(0.5) rotate(-25deg);
    filter: brightness(4) blur(2px) opacity(0.9) saturate(2);
  }

  60% {
    transform: scale(1.3) rotate(15deg);
    filter: brightness(2.5) blur(1px) opacity(0.95) saturate(1.5);
  }

  85% {
    transform: scale(0.9) rotate(-8deg);
    filter: brightness(1.5) blur(0.5px) opacity(0.98) saturate(1.2);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) blur(0px) opacity(1) saturate(1);
  }
}

.animate-stage-8-up {
  animation: stage-8-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* =================================================================== */
/* 粒子爆发动画系统 */
/* =================================================================== */

@keyframes particle-burst-stage-1 {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}

@keyframes particle-burst-stage-2 {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }

  50% {
    transform: translate(calc(var(--tx) * 0.6), calc(var(--ty) * 0.6)) scale(1.2);
    opacity: 0.8;
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}

@keyframes particle-burst-stage-3 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }

  30% {
    transform: translate(calc(var(--tx) * 0.3), calc(var(--ty) * 0.3)) scale(1.5) rotate(90deg);
    opacity: 1;
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(180deg);
    opacity: 0;
  }
}

@keyframes particle-burst-stage-4 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1);
  }

  25% {
    transform: translate(calc(var(--tx) * 0.25), calc(var(--ty) * 0.25)) scale(1.8) rotate(45deg);
    opacity: 1;
    filter: brightness(1.5);
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(180deg);
    opacity: 0;
    filter: brightness(1);
  }
}

@keyframes particle-burst-stage-5 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1) blur(0px);
  }

  20% {
    transform: translate(calc(var(--tx) * 0.2), calc(var(--ty) * 0.2)) scale(2) rotate(36deg);
    opacity: 1;
    filter: brightness(2) blur(1px);
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(180deg);
    opacity: 0;
    filter: brightness(1) blur(0px);
  }
}

@keyframes particle-burst-stage-6 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1) contrast(1);
  }

  15% {
    transform: translate(calc(var(--tx) * 0.15), calc(var(--ty) * 0.15)) scale(2.5) rotate(30deg);
    opacity: 1;
    filter: brightness(2.5) contrast(1.3);
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(270deg);
    opacity: 0;
    filter: brightness(1) contrast(1);
  }
}

@keyframes particle-burst-stage-7 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1) saturate(1) blur(0px);
  }

  12% {
    transform: translate(calc(var(--tx) * 0.12), calc(var(--ty) * 0.12)) scale(3) rotate(25deg);
    opacity: 1;
    filter: brightness(3) saturate(1.5) blur(1.5px);
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg);
    opacity: 0;
    filter: brightness(1) saturate(1) blur(0px);
  }
}

@keyframes particle-burst-stage-8 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1) blur(0px) hue-rotate(0deg);
  }

  10% {
    transform: translate(calc(var(--tx) * 0.1), calc(var(--ty) * 0.1)) scale(3.5) rotate(20deg);
    opacity: 1;
    filter: brightness(4) blur(2px) hue-rotate(30deg);
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(720deg);
    opacity: 0;
    filter: brightness(1) blur(0px) hue-rotate(0deg);
  }
}

/* =================================================================== */
/* 特效光环系统 */
/* =================================================================== */

.spark-flare {
  --glow-color: #fb923c55;
  --glow-color-soft: #fb923c22;
}

.flowing-flare {
  --glow-color: #22c55e55;
  --glow-color-soft: #22c55e22;
}

.keystroke-flare {
  --glow-color: #06b6d455;
  --glow-color-soft: #06b6d422;
}

.aura-flare {
  --glow-color: #3b82f655;
  --glow-color-soft: #3b82f622;
}

.godlike-flare {
  --glow-color: #9333ea55;
  --glow-color-soft: #9333ea22;
}

.worldbreak-flare {
  --glow-color: #ef444455;
  --glow-color-soft: #ef444422;
}

.divine-flare {
  --glow-color: #facc1555;
  --glow-color-soft: #facc1522;
}

.oneness-flare {
  --glow-color: #ffffff55;
  --glow-color-soft: #ffffff22;
}

@keyframes flare-burst {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  25% {
    transform: scale(1.5);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.animate-flare-burst {
  animation: flare-burst 1s ease-out;
  border-radius: 50%;
  box-shadow:
    0 0 60px 30px var(--glow-color, #fff),
    0 0 100px 60px var(--glow-color-soft, #fff),
    0 0 140px 90px var(--glow-color-soft, #fff);
}

/* =================================================================== */
/* 文字冲击动画 */
/* =================================================================== */

@keyframes label-impact {

  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }

  25% {
    transform: translateY(-8px) scale(1.2);
    opacity: 1;
  }
}

.animate-label-impact {
  animation: label-impact 0.8s ease;
}

@keyframes number-impact {

  0%,
  100% {
    text-shadow: none;
    color: inherit;
  }

  25% {
    color: white;
    text-shadow: 0 0 20px #fff, 0 0 40px #fff, 0 0 80px var(--glow-color, #fff);
  }
}

.animate-number-impact {
  animation: number-impact 1s ease-out;
}

@keyframes rank-impact {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }

  20% {
    opacity: 0;
  }

  50% {
    transform: translateY(10px) scale(1.3);
    opacity: 1;
  }

  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.animate-rank-impact {
  animation: rank-impact 1.2s ease;
}

/* =================================================================== */
/* 简约模式动画 (保留) */
/* =================================================================== */
@keyframes engrave-stamp {
  0% {
    transform: translateY(-20px) scale(1.3);
    opacity: 0;
  }

  60% {
    transform: translateY(2px) scale(0.95);
    opacity: 1;
  }

  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.animate-engrave-stamp {
  animation: engrave-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes echo-ripple {
  0% {
    transform: scale(0.5);
    opacity: 1;
    box-shadow: inset 0 0 0 2px rgba(239, 108, 91, 0.5);
  }

  100% {
    transform: scale(2.5);
    opacity: 0;
    box-shadow: inset 0 0 0 0px rgba(239, 108, 91, 0);
  }
}

.animate-echo-ripple::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 50%;
  animation: echo-ripple 0.5s ease-out;
}
</style>