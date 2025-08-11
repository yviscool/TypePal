<template>
  <div v-if="comboCount >= 3" class="absolute top-0 left-0 transform -translate-x-4 -translate-y-16 z-20">
    <div v-if="enableEffects" class="relative select-none" :class="impactAnimationClass">
      <div class="text-center mb-1">
        <div
          class="text-2xl font-black tracking-[0.2em] opacity-80 transform transition-all duration-300"
          :class="[tierClasses.label, idleAnimationClass.label]"
        >
          COMBO
        </div>
      </div>

      <div class="relative flex justify-center">
        <div :class="{ 'animate-hit-shake': animationState !== 'idle' }">
          <div class="relative">
            <div
              class="font-black tracking-tight transform transition-all duration-200"
              :class="[tierClasses.number, idleAnimationClass.number]"
            >
              {{ comboCount }}
            </div>
            <div
              class="absolute inset-0 font-black tracking-tight blur-sm opacity-40 -z-10"
              :class="tierClasses.number"
            >
              {{ comboCount }}
            </div>
            <div
              class="absolute inset-0 font-black tracking-tight blur-lg -z-20"
              :class="[tierClasses.glow, { 'opacity-30': comboCount < 25, 'opacity-50': comboCount >= 25 }]"
            >
              {{ comboCount }}
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-1">
        <div
          class="text-xl font-bold tracking-wider transform transition-all duration-300"
          :class="[tierClasses.rank, idleAnimationClass.rank, { 'opacity-70': animationState === 'idle', 'opacity-100': animationState !== 'idle' }]"
        >
          {{ rankText }}
        </div>
      </div>

      <div v-if="animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 rounded-full animate-shockwave" :class="tierClasses.shockwave"></div>
        <div class="absolute inset-0 rounded-full animate-shockwave-delayed" :class="tierClasses.shockwave"></div>
        <div v-if="animationState === 'rank-up'" class="absolute inset-0 rounded-full animate-shockwave-intense" :class="tierClasses.shockwave"></div>
      </div>
    </div>
    
    <div v-else 
         class="relative flex items-baseline justify-center w-40 h-28"
         :class="{ 'animate-echo-ripple': simpleAnimationState === 'hit' }">
      
      <div class="flex items-baseline gap-1" 
           :class="{ 'animate-engrave-stamp': simpleAnimationState === 'hit' }">
        
        <span class="font-semibold text-lg text-gray-800/60"
              style="text-shadow: 1px 1px 0px rgba(0,0,0,0.1);">
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

// 定义 Props 接口
interface Props {
  comboCount: number
  enableEffects?: boolean
}

// 定义带默认值的 Props
const props = withDefaults(defineProps<Props>(), {
  enableEffects: true,
})

// --- 华丽模式状态管理 ---
type Tier = 'good' | 'stylish' | 'legendary'
type AnimationState = 'idle' | 'hit' | 'rank-up'
const animationState = ref<AnimationState>('idle')
let animationTimeout: number | undefined

// --- 全新：简约模式状态管理 ---
type SimpleAnimationState = 'idle' | 'hit'
const simpleAnimationState = ref<SimpleAnimationState>('idle')
let simpleAnimationTimeout: number | undefined

// --- 统一的逻辑大脑：侦听 comboCount 变化 ---
watch(() => props.comboCount, (newCount, oldCount) => {
  // 过滤无效变化
  if (newCount <= oldCount || newCount < 3) {
    return
  }

  // 根据 enableEffects 决定触发哪种模式的动画
  if (props.enableEffects) {
    // --- 触发【华丽模式】动画 ---
    clearTimeout(animationTimeout)
    const oldTier = getTier(oldCount)
    const newTier = getTier(newCount)

    if (newTier !== oldTier) {
      animationState.value = 'rank-up'
      animationTimeout = window.setTimeout(() => animationState.value = 'idle', 600)
    } else {
      animationState.value = 'hit'
      animationTimeout = window.setTimeout(() => animationState.value = 'idle', 400)
    }
  } else {
    // --- 触发【简约模式】动画 ---
    clearTimeout(simpleAnimationTimeout)
    simpleAnimationState.value = 'hit'
    // 动画结束后，状态恢复为 'idle'
    simpleAnimationTimeout = window.setTimeout(() => {
      simpleAnimationState.value = 'idle'
    }, 500) // 动画持续时间为 500ms
  }
})

// --- 华丽模式的辅助函数和计算属性 (保留) ---
const getTier = (count: number): Tier => {
  if (count >= 25) return 'legendary'
  if (count >= 10) return 'stylish'
  return 'good'
}
const comboTier = computed<Tier>(() => getTier(props.comboCount))
const rankText = computed(() => {
  switch (comboTier.value) {
    case 'legendary': return 'LEGENDARY'
    case 'stylish': return 'STYLISH'
    default: return 'GOOD'
  }
})
const impactAnimationClass = computed(() => {
  if (animationState.value === 'rank-up') return 'animate-rank-up-impact'
  if (animationState.value === 'hit') return 'animate-hit-impact'
  return ''
})
const tierClasses = computed(() => {
  // ... (此部分代码未改变，为简洁省略，实际使用时请保留原样)
  switch (comboTier.value) {
    case 'legendary': return { label: 'text-purple-400', number: 'text-6xl text-purple-300', glow: 'text-purple-400', rank: 'text-purple-300', shockwave: 'border-purple-400', };
    case 'stylish': return { label: 'text-yellow-400', number: 'text-5xl text-yellow-300', glow: 'text-yellow-400', rank: 'text-yellow-300', shockwave: 'border-yellow-400', };
    default: return { label: 'text-orange-400', number: 'text-4xl text-orange-300', glow: 'text-orange-400', rank: 'text-orange-300', shockwave: 'border-orange-400', };
  }
})
const idleAnimationClass = computed(() => {
  // ... (此部分代码未改变，为简洁省略，实际使用时请保留原样)
  if (animationState.value !== 'idle') { return { label: '', number: '', rank: '' } }
  switch (comboTier.value) {
    case 'legendary': return { label: 'animate-legendary-idle-label', number: 'animate-legendary-idle-number', rank: 'animate-legendary-idle-rank', };
    case 'stylish': return { label: 'animate-stylish-idle-label', number: 'animate-stylish-idle-number', rank: 'animate-pulse', };
    default: return { label: '', number: '', rank: '' };
  }
})

</script>

<style scoped>
/* =================================================================== */
/* 华丽模式动画 (保留，未作修改) */
/* =================================================================== */
@keyframes hit-impact { 0% { transform: scale(1) rotate(0deg); } 20% { transform: scale(1.3) rotate(-3deg); } 40% { transform: scale(0.9) rotate(2deg); } 60% { transform: scale(1.15) rotate(-1deg); } 100% { transform: scale(1) rotate(0deg); } }
.animate-hit-impact { animation: hit-impact 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes rank-up-impact { 0% { transform: scale(1) rotate(0deg); } 20% { transform: scale(1.5) rotate(5deg); filter: brightness(1.5); } 40% { transform: scale(0.8) rotate(-3deg); filter: brightness(1); } 60% { transform: scale(1.2) rotate(2deg); filter: brightness(1.2); } 100% { transform: scale(1) rotate(0deg); filter: brightness(1); } }
.animate-rank-up-impact { animation: rank-up-impact 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes hit-shake { 0%, 100% { transform: translateX(0) } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px) } 20%, 40%, 60%, 80% { transform: translateX(4px) } }
.animate-hit-shake { animation: hit-shake 0.25s linear; }
@keyframes shockwave { 0% { transform: scale(0.8); opacity: 0.8; border-width: 4px; } 100% { transform: scale(3); opacity: 0; border-width: 1px; } }
.animate-shockwave { animation: shockwave 0.5s ease-out; }
@keyframes shockwave-delayed { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(3.5); opacity: 0; } }
.animate-shockwave-delayed { animation: shockwave-delayed 0.5s ease-out 0.1s; }
@keyframes shockwave-intense { 0% { transform: scale(0.7); opacity: 1; border-width: 2px; box-shadow: 0 0 20px, inset 0 0 20px; } 100% { transform: scale(4); opacity: 0; border-width: 6px; box-shadow: 0 0 50px, inset 0 0 40px; } }
.animate-shockwave-intense { animation: shockwave-intense 0.6s ease-out; }
@keyframes stylish-idle-label { 0%, 100% { text-shadow: 0 0 10px rgba(251, 191, 36, 0.4); } 50% { text-shadow: 0 0 20px rgba(251, 191, 36, 0.7); } }
.animate-stylish-idle-label { animation: stylish-idle-label 2.5s ease-in-out infinite; }
@keyframes stylish-idle-number { 0%, 100% { transform: scale(1); text-shadow: 0 0 15px rgba(252, 211, 77, 0.5); } 50% { transform: scale(1.03); text-shadow: 0 0 25px rgba(252, 211, 77, 0.8); } }
.animate-stylish-idle-number { animation: stylish-idle-number 2.5s ease-in-out infinite; }
@keyframes legendary-idle-label { 0%, 100% { transform: translateY(0); text-shadow: 0 0 20px rgba(167, 139, 250, 0.6); } 50% { transform: translateY(-3px); text-shadow: 0 0 30px rgba(192, 132, 252, 0.9); } }
.animate-legendary-idle-label { animation: legendary-idle-label 2s ease-in-out infinite; }
@keyframes legendary-idle-number { 0%, 100% { transform: scale(1) rotateY(0); text-shadow: 0 0 25px rgba(192, 132, 252, 0.7), 0 0 40px rgba(236, 72, 153, 0.3); } 50% { transform: scale(1.05) rotateY(5deg); text-shadow: 0 0 40px rgba(192, 132, 252, 1), 0 0 60px rgba(236, 72, 153, 0.5); } }
.animate-legendary-idle-number { animation: legendary-idle-number 2.2s ease-in-out infinite; }
@keyframes legendary-idle-rank { 0%, 100% { opacity: 0.8; text-shadow: 0 0 15px rgba(236, 72, 153, 0.4); } 50% { opacity: 1; text-shadow: 0 0 25px rgba(236, 72, 153, 0.8); } }
.animate-legendary-idle-rank { animation: legendary-idle-rank 2.2s ease-in-out infinite; }

/* =================================================================== */
/* 全新简约模式动画 (铭刻与回响) */
/* =================================================================== */

/**
 * 1. “铭刻”动画
 * 应用于文字和数字容器，模拟强力盖章的顿挫感。
 */
@keyframes engrave-stamp {
  0% {
    transform: translateY(-20px) scale(1.3);
    opacity: 0;
  }
  60% {
    /* 超调：猛地“压”入屏幕，比最终位置更深、更小 */
    transform: translateY(2px) scale(0.95);
    opacity: 1;
  }
  100% {
    /* 回弹到最终的静止状态 */
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.animate-engrave-stamp {
  /* 使用一个有力的、带回弹效果的 cubic-bezier 曲线 */
  animation: engrave-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}


/**
 * 2. “回响”动画
 * 应用于父容器的 ::after 伪元素，创造一个凹陷的、向外扩散的涟漪。
 * 这是设计的灵魂所在。
 */
@keyframes echo-ripple {
  0% {
    /* 涟漪出现：初始大小，完全不透明，有2px的“雕刻”深度 */
    transform: scale(0.5);
    opacity: 1;
    box-shadow: inset 0 0 0 2px rgba(239, 108, 91, 0.5);
  }
  100% {
    /* 涟漪消失：扩散到很大，完全透明，“雕刻”深度变为0 */
    transform: scale(2.5);
    opacity: 0;
    box-shadow: inset 0 0 0 0px rgba(239, 108, 91, 0);
  }
}

.animate-echo-ripple::after {
  content: '';
  position: absolute;
  /* 居中并覆盖整个区域 */
  inset: 0; 
  /* 保证伪元素不会干扰鼠标事件 */
  pointer-events: none; 
  /* 涟漪是圆形的 */
  border-radius: 50%; 
  /* 执行动画 */
  animation: echo-ripple 0.5s ease-out;
}
</style>