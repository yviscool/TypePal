<template>
    <div v-if="comboCount >= 3 && effectsLevel !== 'none'" class="fixed inset-0 pointer-events-none z-10">
      <div class="absolute inset-0" :class="pulseTextureClass"></div>
  
      <div v-if="stage === 2" class="absolute inset-0 animate-fade-in" key="bg-2">
        <div class="absolute inset-0 animate-energy-flow"></div>
      </div>
      <div v-if="stage === 3" class="absolute inset-0 animate-fade-in" key="bg-3">
        <div class="absolute inset-0 keystroke-aura-background"></div>
      </div>
      <div v-if="stage === 4" class="absolute inset-0 animate-fade-in" key="bg-4">
        <div class="absolute inset-0 animate-energy-mist"></div>
      </div>
      <div v-if="stage === 5" class="absolute inset-0 animate-fade-in" key="bg-5">
        <div class="absolute inset-0 animate-space-distortion"></div>
      </div>
      <div v-if="stage === 6" class="absolute inset-0 animate-fade-in" key="bg-6">
        <div class="absolute inset-0 animate-world-break"></div>
      </div>
      <div v-if="stage === 7" class="absolute inset-0 animate-fade-in" key="bg-7">
        <div class="absolute inset-0 animate-divine-matrix"></div>
      </div>
      <div v-if="stage === 8" class="absolute inset-0 animate-fade-in" key="bg-8">
        <div class="absolute inset-0 animate-oneness-light"></div>
      </div>
    </div>
  
    <div v-if="comboCount >= 3 && effectsLevel !== 'none'"
      class="absolute top-0 left-0 transform -translate-x-4 -translate-y-16 z-20">
      
      <div v-if="effectsLevel === 'gorgeous'" class="relative select-none flex items-center justify-center w-64 h-64"
        :class="[impactAnimationClass, { 'animate-screen-shake': stage >= 6 && animationState !== 'idle' }]">
  
        <div class="relative flex flex-col items-center justify-center">
          <div class="font-black tracking-[0.3em] opacity-80 transition-all duration-300"
            :class="[stageClasses.label, idleAnimationClass.label, { 'animate-label-impact': animationState !== 'idle' }]">
            连击
          </div>
  
          <div class="relative font-black tracking-tighter leading-none my-1"
            :class="[stageClasses.number, idleAnimationClass.number, { 'animate-number-impact': animationState !== 'idle' }]">
            {{ comboCount }}
          </div>
  
          <div class="font-bold tracking-[0.15em] transition-all duration-300"
            :class="[stageClasses.rank, idleAnimationClass.rank, { 'animate-rank-impact': animationState !== 'idle' }]">
            {{ stageTitle }}
          </div>
        </div>
  
        <div v-if="animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0 animate-flare-burst" :class="stageClasses.flare"></div>
  
          <div v-for="p in particleCount" :key="p" class="absolute left-1/2 top-1/2 rounded-full"
            :class="[stageClasses.particle, particleShapeClass]" :style="particleStyles[p - 1]">
          </div>
        </div>
  
        <div v-if="stage >= 6 && animationState !== 'idle'" class="absolute inset-0 pointer-events-none">
          <div v-for="shard in 12" :key="`shard-${shard}`"
            class="absolute w-1 h-8 bg-gradient-to-t from-transparent via-white to-transparent opacity-60"
            :class="shardAnimationClass" :style="shardStyles[shard - 1]">
          </div>
        </div>
  
      </div>
  
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
    if (count >= 21) return 8  // 人键合一
  if (count >= 18) return 7  // 天下至尊
  if (count >= 15) return 6   // 毁天灭地
  if (count >= 12) return 5   // 神魔让道
  if (count >= 9) return 4   // 键气滔天
  if (count >= 6) return 3   // 键神附体
  if (count >= 3) return 2    // 所向披靡
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
  const pulseTextureClass = computed(() => {
    const base = 'transition-opacity duration-1000'
    if (stage.value >= 7) return `${base} opacity-50 animate-energy-pulse-fast`
    if (stage.value >= 4) return `${base} opacity-80 animate-energy-pulse`
    if (stage.value >= 1) return `${base} opacity-100 animate-subtle-pulse`
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
      case 8: // 人键合一 - 返璞归真，黑字白光
        return {
          label: 'text-gray-800 text-xl font-light tracking-[0.5em]',
          number: 'text-9xl text-gray-900 font-thin oneness-text-glow',
          rank: 'text-gray-700 text-3xl font-light tracking-[0.3em]',
          flare: 'oneness-flare',
          particle: 'bg-white'
        }
      case 7: // 天下至尊 - 神圣金色
        return {
          label: 'text-yellow-200/80 text-lg font-bold tracking-[0.4em]',
          number: 'text-8xl text-yellow-100 font-black divine-text-glow',
          rank: 'text-yellow-300/90 text-2xl font-bold tracking-[0.2em]',
          flare: 'divine-flare',
          particle: 'bg-yellow-300'
        }
      case 6: // 毁天灭地 - 毁灭赤红
        return {
          label: 'text-red-300/80 text-lg font-black tracking-[0.3em]',
          number: 'text-8xl text-red-100 font-black worldbreak-text-glow',
          rank: 'text-red-400/90 text-2xl font-black tracking-[0.15em]',
          flare: 'worldbreak-flare',
          particle: 'bg-red-400'
        }
      case 5: // 神魔让道 - 诡秘紫色
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
    // 简化待机动画，避免喧宾夺主，只在高阶保留
    switch (stage.value) {
      case 8:
        return {
          label: 'animate-oneness-float',
          number: '', // 文字光晕已在 stageClasses 中定义
          rank: 'animate-oneness-float-delayed'
        }
      case 7:
        return {
          label: 'animate-divine-float',
          number: '',
          rank: 'animate-divine-float-delayed'
        }
      case 6:
        return {
          label: 'animate-chaos-shake-subtle',
          number: '',
          rank: 'animate-chaos-shake-subtle-delayed'
        }
      default:
        return { label: '', number: '', rank: '' }
    }
  })
  
  // --- 粒子系统 ---
  const particleCount = computed(() => {
    if (stage.value >= 6) return 16
    if (stage.value >= 4) return 12
    return 8
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
    // 只在冲击时出现，待机时消失
    if (animationState.value !== 'idle') return 'animate-shard-burst-enhanced'
    return 'opacity-0'
  })
  
  const shardStyles = computed(() => {
    const angles = Array.from({ length: 12 }, (_, i) => i * 30);
    return angles.map((angle, i) => ({
      transform: `rotate(${angle}deg)`,
      left: '50%',
      top: '50%',
      transformOrigin: '0 4px',
      animationDelay: `${i * 30}ms` //错开爆发时间
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
    10% { transform: translate(-2px, -3px) rotate(-0.5deg); }
    20% { transform: translate(3px, 2px) rotate(0.5deg); }
    30% { transform: translate(-1px, 2px) rotate(-0.5deg); }
    40% { transform: translate(2px, -1px) rotate(0.5deg); }
    50% { transform: translate(-2px, 1px) rotate(-0.5deg); }
    /* 逐渐减弱 */
    70% { transform: translate(1px, 1px) rotate(0.2deg); }
    90% { transform: translate(-1px, 0px) rotate(0.2deg); }
  }
  .animate-screen-shake {
    animation: screen-shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
  
  
  /* =================================================================== */
  /* 基础脉冲背景 */
  /* =================================================================== */
  @keyframes subtle-pulse {
    50% { opacity: 0.8; transform: scale(1.02); }
  }
  .animate-subtle-pulse {
    background: radial-gradient(circle, rgba(251, 146, 60, 0.04) 0%, transparent 60%);
    animation: subtle-pulse 5s ease-in-out infinite;
  }
  
  @keyframes energy-pulse {
    50% { opacity: 1; }
  }
  .animate-energy-pulse {
    background: repeating-linear-gradient(90deg, transparent 0, rgba(255, 255, 255, 0.03) 2px, transparent 4px);
    animation: energy-pulse 3.5s ease-in-out infinite;
  }
  @keyframes energy-pulse-fast {
    50% { opacity: 1; transform: scale(1.01); }
  }
  .animate-energy-pulse-fast {
      background: repeating-linear-gradient(90deg, transparent 0, rgba(255, 255, 255, 0.05) 1px, transparent 2px);
    animation: energy-pulse-fast 2s ease-in-out infinite;
  }
  
  /* =================================================================== */
  /* 各阶段专属背景特效 */
  /* =================================================================== */
  
  /* --- 第二阶段：所向披靡 --- */
  @keyframes energy-flow {
    from { transform: translateY(-100%); opacity: 0; }
    20% { opacity: 1; }
    to { transform: translateY(100vh); opacity: 0; }
  }
  .animate-energy-flow {
    background: linear-gradient(180deg, transparent, rgba(34, 197, 94, 0.15) 50%, transparent);
    animation: energy-flow 10s linear infinite;
  }
  
  /* --- 第三阶段：键神附体 --- */
  .keystroke-aura-background {
    background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
  }
  
  /* --- 第四阶段：键气滔天 --- */
  @keyframes energy-mist {
    from { transform: rotate(0deg) scale(1.2); }
    to { transform: rotate(360deg) scale(1.2); }
  }
  .animate-energy-mist {
    background: conic-gradient(from 0deg, rgba(59, 130, 246, 0.0), rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.0));
    animation: energy-mist 20s linear infinite;
    opacity: 0.5;
  }
  
  /* --- 第五阶段：神魔让道 --- */
  @keyframes space-distortion {
    0%, 100% { transform: scale(1) skew(0); }
    25% { transform: scale(1.02) skew(0.5deg, -0.2deg); }
    75% { transform: scale(0.98) skew(-0.5deg, 0.2deg); }
  }
  .animate-space-distortion {
    background: radial-gradient(circle, rgba(147, 51, 234, 0.1) 30%, transparent 60%);
    animation: space-distortion 6s ease-in-out infinite;
    opacity: 0.8;
  }
  
  /* --- 第六阶段：毁天灭地 (重制) --- */
  @keyframes world-break {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
  .animate-world-break {
    background: linear-gradient(270deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0), rgba(239, 68, 68, 0.2));
    background-size: 200% 200%;
    animation: world-break 8s linear infinite;
    opacity: 0.6;
  }
  
  /* --- 第七阶段：天下至尊 (重制) --- */
  @keyframes divine-matrix-scan {
    from { background-position: 0 0, 0 0; }
    to { background-position: -200px 0, 0 -200px; }
  }
  .animate-divine-matrix {
    --grid-color: rgba(250, 204, 21, 0.2);
    background:
      repeating-linear-gradient(90deg, var(--grid-color) 0, var(--grid-color) 1px, transparent 1px, transparent 40px),
      repeating-linear-gradient(0deg, var(--grid-color) 0, var(--grid-color) 1px, transparent 1px, transparent 40px);
    animation: divine-matrix-scan 5s linear infinite;
    opacity: 0.5;
  }
  
  /* --- 第八阶段：人键合一 (重制) --- */
  @keyframes oneness-light {
    50% { opacity: 0.6; }
  }
  .animate-oneness-light {
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
    animation: oneness-light 6s ease-in-out infinite;
    opacity: 0.3;
  }
  
  
  /* =================================================================== */
  /* 高阶待机动画 (Idle Animations) */
  /* =================================================================== */
  
  .oneness-text-glow {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.9), 0 0 25px rgba(255, 255, 255, 0.7);
  }
  .divine-text-glow {
    text-shadow: 0 0 20px rgba(250, 204, 21, 0.6), 0 0 40px rgba(250, 204, 21, 0.4);
  }
  .worldbreak-text-glow {
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5);
  }
  
  
  @keyframes chaos-shake-subtle {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-1px); }
    75% { transform: translateX(1px); }
  }
  .animate-chaos-shake-subtle { animation: chaos-shake-subtle 1.5s ease-in-out infinite; }
  .animate-chaos-shake-subtle-delayed { animation: chaos-shake-subtle 1.5s ease-in-out infinite 0.3s; }
  
  @keyframes divine-float {
    50% { transform: translateY(-8px) scale(1.02); }
  }
  .animate-divine-float { animation: divine-float 4s ease-in-out infinite; }
  .animate-divine-float-delayed { animation: divine-float 4s ease-in-out infinite 0.5s; }
  
  @keyframes oneness-float {
    50% { transform: translateY(-5px); }
  }
  .animate-oneness-float { animation: oneness-float 5s ease-in-out infinite; }
  .animate-oneness-float-delayed { animation: oneness-float 5s ease-in-out infinite 0.8s; }
  
  
  /* =================================================================== */
  /* 破碎晶体特效 (重制) */
  /* =================================================================== */
  @keyframes shard-burst-enhanced {
    from {
      transform: rotate(var(--start-rot, 0deg)) scale(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    to {
      transform: rotate(var(--end-rot, 180deg)) scale(1.5) translateX(80px);
      opacity: 0;
    }
  }
  .animate-shard-burst-enhanced {
    --start-rot: calc(var(--i, 0) * 30deg);
    --end-rot: calc(var(--i, 0) * 30deg + 90deg);
    animation: shard-burst-enhanced 0.8s ease-out;
  }
  
  /* =================================================================== */
  /* 阶段冲击动画系统 (大部分保留, 调整高阶强度) */
  /* =================================================================== */
  
  /* Hit 动画 */
  .animate-stage-1-hit { animation: stage-hit-base 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.15; --rot: -2deg; }
  .animate-stage-2-hit { animation: stage-hit-base 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.25; --rot: -3deg; }
  .animate-stage-3-hit { animation: stage-hit-base 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.35; --rot: -4deg; }
  .animate-stage-4-hit { animation: stage-hit-base 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.4; --rot: -5deg; }
  .animate-stage-5-hit { animation: stage-hit-base 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); --scale: 1.5; --rot: -6deg; }
  @keyframes stage-hit-base {
    30% { transform: scale(var(--scale)) rotate(var(--rot)); }
  }
  
  @keyframes stage-6-hit { /* 强化 */
    15% { transform: scale(1.6) rotate(-8deg); filter: brightness(2.5) contrast(1.5); }
    45% { transform: scale(0.9) rotate(4deg); }
  }
  .animate-stage-6-hit { animation: stage-6-hit 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
  
  @keyframes stage-7-hit { /* 强化 */
    20% { transform: scale(1.7) rotate(-10deg); filter: brightness(3) saturate(1.5) blur(1px); }
    50% { transform: scale(0.95) rotate(5deg); }
  }
  .animate-stage-7-hit { animation: stage-7-hit 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
  
  @keyframes stage-8-hit { /* 强化 */
    25% { transform: scale(1.8) rotate(-12deg); filter: brightness(4) opacity(0.8); }
    60% { transform: scale(0.95) rotate(6deg); }
  }
  .animate-stage-8-hit { animation: stage-8-hit 1.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  
  
  /* Stage-Up 动画 */
  .animate-stage-2-up, .animate-stage-3-up, .animate-stage-4-up, .animate-stage-5-up {
    animation: stage-up-mid 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes stage-up-mid {
    25% { transform: scale(2) rotate(15deg); filter: brightness(3); }
    60% { transform: scale(0.8) rotate(-8deg); }
  }
  
  @keyframes stage-6-up { /* 强化 */
    15% { transform: scale(3) rotate(20deg); filter: brightness(5) contrast(2) saturate(2); }
    40% { transform: scale(0.7) rotate(-10deg); }
    70% { transform: scale(1.1) rotate(5deg); }
  }
  .animate-stage-6-up { animation: stage-6-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  
  @keyframes stage-7-up { /* 强化 */
    20% { transform: scale(3.5) rotate(25deg); filter: brightness(6) saturate(2.5) blur(2px); }
    50% { transform: scale(0.6) rotate(-12deg); }
    80% { transform: scale(1.2) rotate(8deg); }
  }
  .animate-stage-7-up { animation: stage-7-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  
  @keyframes stage-8-up { /* 强化 */
    15% { transform: scale(4) rotate(30deg); filter: brightness(8) blur(1px) opacity(0.7); }
    35% { transform: scale(0.5) rotate(-15deg); }
    60% { transform: scale(1.3) rotate(10deg); }
  }
  .animate-stage-8-up { animation: stage-8-up 1.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  
  
  /* =================================================================== */
  /* 粒子爆发与光环系统 (根据阶段调整行为) */
  /* =================================================================== */
  
  .spark-flare { --glow-color: #fb923c55; --glow-color-soft: #fb923c22; }
  .flowing-flare { --glow-color: #22c55e55; --glow-color-soft: #22c55e22; }
  .keystroke-flare { --glow-color: #06b6d455; --glow-color-soft: #06b6d422; }
  .aura-flare { --glow-color: #3b82f655; --glow-color-soft: #3b82f622; }
  .godlike-flare { --glow-color: #9333ea55; --glow-color-soft: #9333ea22; }
  .worldbreak-flare { --glow-color: #ef444455; --glow-color-soft: #ef444422; }
  .divine-flare { --glow-color: #facc1555; --glow-color-soft: #facc1522; }
  .oneness-flare { --glow-color: #ffffff99; --glow-color-soft: #ffffff33; }
  
  @keyframes flare-burst {
    0% { transform: scale(0); opacity: 0; }
    25% { transform: scale(1.5); opacity: 1; }
    100% { transform: scale(1.2); opacity: 0; }
  }
  .animate-flare-burst {
    animation: flare-burst 1s ease-out;
    border-radius: 50%;
    box-shadow: 0 0 60px 30px var(--glow-color), 0 0 100px 60px var(--glow-color-soft);
  }
  
  @keyframes particle-burst-base {
    to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }
  @keyframes particle-burst-rotate {
    30% { transform: translate(calc(var(--tx)*0.3), calc(var(--ty)*0.3)) scale(1.5) rotate(90deg); }
    to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(180deg); opacity: 0; }
  }
  @keyframes particle-burst-complex {
    15% { transform: translate(calc(var(--tx)*0.15), calc(var(--ty)*0.15)) scale(2.5) rotate(30deg); filter: brightness(2); }
    to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(270deg); opacity: 0; }
  }
  @keyframes particle-burst-final {
    10% { transform: translate(calc(var(--tx)*0.1), calc(var(--ty)*0.1)) scale(3.5) rotate(20deg); filter: brightness(3) blur(1px); }
    to { transform: translate(var(--tx), var(--ty)) scale(0) rotate(720deg); opacity: 0; }
  }
  /* 分配动画 */
  [class*="particle-burst-stage-1"], [class*="particle-burst-stage-2"] { animation-name: particle-burst-base; }
  [class*="particle-burst-stage-3"], [class*="particle-burst-stage-4"], [class*="particle-burst-stage-5"] { animation-name: particle-burst-rotate; }
  [class*="particle-burst-stage-6"], [class*="particle-burst-stage-7"] { animation-name: particle-burst-complex; }
  [class*="particle-burst-stage-8"] { animation-name: particle-burst-final; }
  
  
  /* =================================================================== */
  /* 文字冲击动画 (基本保留) */
  /* =================================================================== */
  @keyframes label-impact {
    25% { transform: translateY(-8px) scale(1.2); opacity: 1; }
  }
  .animate-label-impact { animation: label-impact 0.8s ease; }
  
  @keyframes number-impact {
    25% { color: white; text-shadow: 0 0 20px #fff, 0 0 40px var(--glow-color); }
  }
  .animate-number-impact { animation: number-impact 1s ease-out; }
  
  @keyframes rank-impact {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    20% { opacity: 0; }
    50% { transform: translateY(10px) scale(1.3); opacity: 1; }
  }
  .animate-rank-impact { animation: rank-impact 1.2s ease; }
  
  /* =================================================================== */
  /* 简约模式动画 (无改动) */
  /* =================================================================== */
  @keyframes engrave-stamp {
    from { transform: translateY(-20px) scale(1.3); opacity: 0; }
    60% { transform: translateY(2px) scale(0.95); opacity: 1; }
    to { transform: translateY(0) scale(1); }
  }
  .animate-engrave-stamp { animation: engrave-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  
  @keyframes echo-ripple {
    from { box-shadow: inset 0 0 0 2px rgba(239, 108, 91, 0.5); transform: scale(0.5); opacity: 1; }
    to { box-shadow: inset 0 0 0 0px rgba(239, 108, 91, 0); transform: scale(2.5); opacity: 0; }
  }
  .animate-echo-ripple::after {
    content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: 50%;
    animation: echo-ripple 0.5s ease-out;
  }
  </style>