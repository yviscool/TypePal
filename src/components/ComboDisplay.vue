<template>
  <div v-if="comboCount >= 3 && effectsLevel !== 'none'" class="absolute top-0 left-0 transform -translate-x-4 -translate-y-16 z-20">

    <div v-if="effectsLevel === 'gorgeous'"
         class="relative select-none flex items-center justify-center w-64 h-64"
         :class="impactAnimationClass">

      <div class="relative flex flex-col items-center justify-center">

        <div class="font-black tracking-[0.3em] opacity-80 transition-all duration-300"
             :class="[tierClasses.label, idleAnimationClass.label, { 'animate-label-impact': animationState !== 'idle' }]">
          连击
        </div>

        <div class="relative font-black tracking-tighter leading-none my-1"
             :class="[tierClasses.number, idleAnimationClass.number, { 'animate-number-impact': animationState !== 'idle' }]">
          {{ comboCount }}
        </div>

        <div class="font-bold tracking-[0.15em] transition-all duration-300"
             :class="[tierClasses.rank, idleAnimationClass.rank, { 'animate-rank-impact': animationState !== 'idle' }]">
          {{ rankText }}
        </div>
      </div>

      <div v-if="animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 animate-flare-burst" :class="tierClasses.flare"></div>

        <div v-for="p in 8" :key="p" class="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
             :class="tierClasses.particle"
             :style="particleStyles[p-1]">
        </div>
      </div>

    </div>

    <div v-else-if="effectsLevel === 'simple'"
         class="relative flex items-baseline justify-center w-40 h-28"
         :class="{ 'animate-echo-ripple': simpleAnimationState === 'hit' }">

      <div class="flex items-baseline gap-1"
           :class="{ 'animate-engrave-stamp': simpleAnimationState === 'hit' }">
        <span class="font-semibold text-lg text-gray-800/60" style="text-shadow: 1px 1px 0px rgba(0,0,0,0.1);">
          连击
        </span>
        <span class="font-sans text-lg text-gray-800/50 -translate-y-px" style="text-shadow: 1px 1px 0px rgba(0,0,0,0.1);">
          x
        </span>
        <span class="font-black text-4xl text-coral-500" style="text-shadow: 0px 2px 0px rgba(0,0,0,0.15), 0px 3px 2px rgba(0,0,0,0.1);">
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
  effectsLevel: 'gorgeous', // 默认设为华丽模式以便调试
})

// --- 华丽模式状态管理 ---
type Tier = 'good' | 'awesome' | 'unstoppable'
type AnimationState = 'idle' | 'hit' | 'rank-up'
const animationState = ref<AnimationState>('idle')
let animationTimeout: number | undefined

// --- 简约模式状态管理 ---
type SimpleAnimationState = 'idle' | 'hit'
const simpleAnimationState = ref<SimpleAnimationState>('idle')
let simpleAnimationTimeout: number | undefined

// --- 统一逻辑: 监听 comboCount 变化 ---
watch(() => props.comboCount, (newCount, oldCount) => {
  if (newCount <= oldCount || newCount < 3 || props.effectsLevel === 'none') {
    return
  }

  if (props.effectsLevel === 'gorgeous') {
    clearTimeout(animationTimeout)
    const oldTier = getTier(oldCount)
    const newTier = getTier(newCount)

    const isRankUp = newTier !== oldTier && oldTier !== undefined
    animationState.value = isRankUp ? 'rank-up' : 'hit'
    animationTimeout = window.setTimeout(() => animationState.value = 'idle', isRankUp ? 1000 : 700)

  } else if (props.effectsLevel === 'simple') {
    clearTimeout(simpleAnimationTimeout)
    simpleAnimationState.value = 'hit'
    simpleAnimationTimeout = window.setTimeout(() => {
      simpleAnimationState.value = 'idle'
    }, 500)
  }
})

// --- 华丽模式: 辅助函数 & 计算属性 ---
const getTier = (count: number): Tier | undefined => {
  if (count < 3) return undefined
  if (count >= 50) return 'unstoppable'
  if (count >= 15) return 'awesome'
  return 'good'
}

const comboTier = computed<Tier>(() => getTier(props.comboCount) || 'good')

const rankText = computed(() => {
  switch (comboTier.value) {
    case 'unstoppable': return '势不可挡'
    case 'awesome': return '超神发挥'
    default: return '干得漂亮'
  }
})

const impactAnimationClass = computed(() => {
  if (animationState.value === 'rank-up') return 'animate-rank-up-impact'
  if (animationState.value === 'hit') return 'animate-hit-impact'
  return ''
})

const tierClasses = computed(() => {
  switch (comboTier.value) {
    case 'unstoppable':
      return {
        label: 'text-cyan-300 text-lg',
        number: 'text-8xl text-white',
        rank: 'text-cyan-300 text-2xl',
        flare: 'unstoppable-flare',
        particle: 'bg-cyan-200'
      }
    case 'awesome':
      return {
        label: 'text-red-400 text-base',
        number: 'text-7xl text-red-200',
        rank: 'text-red-400 text-xl',
        flare: 'awesome-flare',
        particle: 'bg-red-400'
      }
    default: // good
      return {
        label: 'text-orange-400 text-sm',
        number: 'text-6xl text-orange-300',
        rank: 'text-orange-400 text-lg',
        flare: 'good-flare',
        particle: 'bg-orange-400'
      }
  }
})

const idleAnimationClass = computed(() => {
  if (animationState.value !== 'idle') {
    return { label: '', number: '', rank: '' }
  }
  switch (comboTier.value) {
    case 'unstoppable':
      return {
        label: 'animate-idle-float-subtle',
        number: 'animate-idle-unstoppable-glow',
        rank: 'animate-idle-float'
      }
    case 'awesome':
      return {
        label: '',
        number: 'animate-idle-awesome-glow',
        rank: ''
      }
    default:
      return { label: '', number: '', rank: '' }
  }
})

// 为8个粒子预设计飞行轨迹和延迟
const particleStyles = computed(() => {
  const directions = [
    { x: 0, y: -110, delay: 0 }, { x: 80, y: -80, delay: 50 },
    { x: 110, y: 0, delay: 25 }, { x: 80, y: 80, delay: 75 },
    { x: 0, y: 110, delay: 0 }, { x: -80, y: 80, delay: 50 },
    { x: -110, y: 0, delay: 25 }, { x: -80, y: -80, delay: 75 },
  ];
  const duration = animationState.value === 'rank-up' ? '1s' : '0.7s';
  const scaleFactor = animationState.value === 'rank-up' ? 1.5 : 1;

  return directions.map(dir => ({
    '--tx': `${dir.x * scaleFactor}px`,
    '--ty': `${dir.y * scaleFactor}px`,
    animation: `particle-burst ${duration} cubic-bezier(0.1, 0.8, 0.7, 1) ${dir.delay}ms`,
  }));
});

</script>

<style scoped>
/* =================================================================== */
/* 华丽模式 · 「天星冲击」 动画 */
/* =================================================================== */

/* --- 整体冲击动画 --- */
@keyframes hit-impact {
  0% { transform: scale(1); }
  20% { transform: scale(1.35) rotate(-4deg); }
  50% { transform: scale(0.9) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); }
}
.animate-hit-impact {
  animation: hit-impact 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes rank-up-impact {
  0% { transform: scale(1); filter: brightness(1); }
  25% { transform: scale(1.6) rotate(6deg); filter: brightness(2.5); }
  55% { transform: scale(0.8) rotate(-3deg); filter: brightness(1); }
  100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
}
.animate-rank-up-impact {
  animation: rank-up-impact 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}


/* --- 组件冲击动画 --- */
@keyframes number-impact {
  0%, 100% { text-shadow: none; color: inherit; }
  25% {
    color: white;
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 40px var(--glow-color, #fff), 0 0 80px var(--glow-color, #fff);
  }
}
.animate-number-impact { animation: number-impact 1s ease-out; }
.good-flare { --glow-color: #fb923c; } /* orange-400 */
.awesome-flare { --glow-color: #f87171; } /* red-400 */
.unstoppable-flare { --glow-color: #67e8f9; } /* cyan-300 */

@keyframes label-impact {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
  25% { transform: translateY(-8px) scale(1.2); opacity: 1; }
}
.animate-label-impact { animation: label-impact 0.7s ease; }

@keyframes rank-impact {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  20% { opacity: 0; }
  50% { transform: translateY(10px) scale(1.3); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.animate-rank-impact { animation: rank-impact 1s ease; }


/* --- 特效动画 --- */
@keyframes flare-burst {
  0% { transform: scale(0); opacity: 0; }
  25% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0; }
}
.animate-flare-burst {
  animation: flare-burst 0.8s ease-out;
  border-radius: 50%;
  box-shadow: 0 0 60px 30px #fff, 0 0 100px 60px var(--glow-color, #fff), 0 0 140px 90px var(--glow-color-soft, #fff);
}
.good-flare { --glow-color: #fb923c55; --glow-color-soft: #fb923c22; }
.awesome-flare { --glow-color: #f8717177; --glow-color-soft: #f8717133; }
.unstoppable-flare { --glow-color: #67e8f988; --glow-color-soft: #67e8f944; }


@keyframes particle-burst {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}


/* --- Idle (静止) 动画 --- */
@keyframes idle-awesome-glow {
  0%, 100% { text-shadow: 0 0 15px #f8717155; transform: scale(1); }
  50% { text-shadow: 0 0 25px #f8717199; transform: scale(1.02); }
}
.animate-idle-awesome-glow { animation: idle-awesome-glow 2.5s ease-in-out infinite; }

@keyframes idle-unstoppable-glow {
  0%, 100% {
    text-shadow: 0 0 20px #fff, 0 0 35px #67e8f9, 0 0 50px #67e8f9;
    transform: scale(1) translateY(0);
  }
  50% {
    text-shadow: 0 0 30px #fff, 0 0 50px #67e8f9, 0 0 75px #67e8f9;
    transform: scale(1.03) translateY(-5px);
  }
}
.animate-idle-unstoppable-glow { animation: idle-unstoppable-glow 3s ease-in-out infinite; }

@keyframes idle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-idle-float { animation: idle-float 3s ease-in-out infinite; }

@keyframes idle-float-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-idle-float-subtle { animation: idle-float-subtle 3s ease-in-out infinite 0.5s; } /* delayed */


/* =================================================================== */
/* 简约模式动画 (保留) */
/* =================================================================== */
@keyframes engrave-stamp {
  0% { transform: translateY(-20px) scale(1.3); opacity: 0; }
  60% { transform: translateY(2px) scale(0.95); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.animate-engrave-stamp {
  animation: engrave-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes echo-ripple {
  0% { transform: scale(0.5); opacity: 1; box-shadow: inset 0 0 0 2px rgba(239, 108, 91, 0.5); }
  100% { transform: scale(2.5); opacity: 0; box-shadow: inset 0 0 0 0px rgba(239, 108, 91, 0); }
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