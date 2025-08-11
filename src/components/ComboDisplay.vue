<template>
  <div v-if="comboCount >= 3" class="absolute top-0 left-0 transform -translate-x-4 -translate-y-16 z-20">
    <!-- 华丽版本的连击显示 -->
    <div v-if="enableEffects" class="relative select-none" :class="{ 'animate-dmc-impact': showCombo }">
      <!-- COMBO 标签 -->
      <div class="text-center mb-1">
        <div class="text-2xl font-black tracking-[0.2em] opacity-80 transform transition-all duration-300" :class="{
          'text-orange-400 animate-dmc-label': comboCount < 10,
          'text-yellow-400 animate-dmc-label-gold': comboCount >= 10 && comboCount < 25,
          'text-purple-400 animate-dmc-label-legendary': comboCount >= 25
        }">
          COMBO
        </div>
      </div>

      <!-- 连击数字 - 核心显示 -->
      <div class="relative flex justify-center">
        <!-- 主数字 -->
        <div class="relative">
          <div class="font-black tracking-tight transform transition-all duration-200" :class="{
            'text-4xl text-orange-300 animate-dmc-number': comboCount < 10,
            'text-5xl text-yellow-300 animate-dmc-number-gold': comboCount >= 10 && comboCount < 25,
            'text-6xl text-purple-300 animate-dmc-number-legendary': comboCount >= 25,
            'animate-dmc-shake': showCombo
          }">
            {{ comboCount }}
          </div>

          <!-- 数字阴影层 -->
          <div class="absolute inset-0 font-black tracking-tight blur-sm opacity-40 -z-10" :class="{
            'text-4xl text-orange-500': comboCount < 10,
            'text-5xl text-yellow-500': comboCount >= 10 && comboCount < 25,
            'text-6xl text-purple-500': comboCount >= 25
          }">
            {{ comboCount }}
          </div>

          <!-- 外发光效果 -->
          <div class="absolute inset-0 font-black tracking-tight blur-lg opacity-20 -z-20" :class="{
            'text-4xl text-orange-400': comboCount < 10,
            'text-5xl text-yellow-400': comboCount >= 10 && comboCount < 25,
            'text-6xl text-purple-400': comboCount >= 25
          }">
            {{ comboCount }}
          </div>
        </div>
      </div>

      <!-- 等级指示器 -->
      <div class="text-center mt-1">
        <div class="text-xl font-bold tracking-wider opacity-70 transform transition-all duration-300" :class="{
          'text-orange-300': comboCount < 10,
          'text-yellow-300 animate-pulse': comboCount >= 10 && comboCount < 25,
          'text-purple-300 animate-dmc-legendary-text': comboCount >= 25
        }">
          {{ comboCount >= 25 ? 'LEGENDARY' : comboCount >= 10 ? 'STYLISH' : 'GOOD' }}
        </div>
      </div>

      <!-- 冲击波效果 -->
      <div v-if="showCombo" class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 rounded-full border-2 animate-dmc-shockwave" :class="{
          'border-orange-400/30': comboCount < 10,
          'border-yellow-400/30': comboCount >= 10 && comboCount < 25,
          'border-purple-400/30': comboCount >= 25
        }"></div>
        <div class="absolute inset-0 rounded-full border animate-dmc-shockwave-delayed" :class="{
          'border-orange-300/20': comboCount < 10,
          'border-yellow-300/20': comboCount >= 10 && comboCount < 25,
          'border-purple-300/20': comboCount >= 25
        }"></div>
      </div>
    </div>

    <!-- 简化版本的连击显示 -->
    <div v-else class="relative select-none">
      <div class="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
        <div class="flex items-center gap-2">
          <div class="text-sm opacity-60 font-medium">连击</div>
          <div class="text-lg font-bold text-coral-400">x{{ comboCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  comboCount: number
  showCombo: boolean
  enableEffects?: boolean
}

withDefaults(defineProps<Props>(), {
  enableEffects: true
})
</script>

<style scoped>
/* DMC风格连击动画 */
@keyframes dmc-impact {
  0% { transform: scale(1) rotate(0deg); }
  15% { transform: scale(1.3) rotate(-2deg); }
  30% { transform: scale(0.9) rotate(1deg); }
  45% { transform: scale(1.15) rotate(-1deg); }
  60% { transform: scale(0.95) rotate(0.5deg); }
  80% { transform: scale(1.05) rotate(-0.5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes dmc-label {
  0%, 100% {
    opacity: 0.8;
    transform: translateY(0) scale(1);
    text-shadow: 0 0 15px rgba(255, 165, 0, 0.4);
  }
  50% {
    opacity: 1;
    transform: translateY(-4px) scale(1.1);
    text-shadow: 0 0 25px rgba(255, 165, 0, 0.8);
  }
}

@keyframes dmc-label-gold {
  0%, 100% {
    opacity: 0.9;
    transform: translateY(0) scale(1) rotateX(0deg);
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  25% {
    opacity: 1;
    transform: translateY(-3px) scale(1.08) rotateX(10deg);
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  }
  75% {
    opacity: 1;
    transform: translateY(-6px) scale(1.12) rotateX(-5deg);
    text-shadow: 0 0 35px rgba(255, 215, 0, 0.9);
  }
}

@keyframes dmc-label-legendary {
  0%, 100% {
    opacity: 0.9;
    transform: translateY(0) scale(1) rotateY(0deg);
    text-shadow: 0 0 25px rgba(147, 51, 234, 0.6), 0 0 40px rgba(236, 72, 153, 0.3);
  }
  20% {
    opacity: 1;
    transform: translateY(-4px) scale(1.1) rotateY(15deg);
    text-shadow: 0 0 35px rgba(147, 51, 234, 0.9), 0 0 50px rgba(236, 72, 153, 0.5);
  }
  40% {
    opacity: 1;
    transform: translateY(-8px) scale(1.15) rotateY(-10deg);
    text-shadow: 0 0 40px rgba(236, 72, 153, 0.8), 0 0 60px rgba(147, 51, 234, 0.6);
  }
  60% {
    opacity: 1;
    transform: translateY(-6px) scale(1.12) rotateY(8deg);
    text-shadow: 0 0 45px rgba(147, 51, 234, 1), 0 0 70px rgba(236, 72, 153, 0.7);
  }
  80% {
    opacity: 1;
    transform: translateY(-3px) scale(1.08) rotateY(-5deg);
    text-shadow: 0 0 35px rgba(236, 72, 153, 0.9), 0 0 55px rgba(147, 51, 234, 0.8);
  }
}

@keyframes dmc-number {
  0%, 100% {
    transform: scale(1) rotateZ(0deg);
    text-shadow: 0 0 30px rgba(255, 165, 0, 0.6), 0 0 50px rgba(255, 165, 0, 0.3);
  }
  25% {
    transform: scale(1.08) rotateZ(2deg);
    text-shadow: 0 0 40px rgba(255, 165, 0, 0.8), 0 0 60px rgba(255, 165, 0, 0.4);
  }
  75% {
    transform: scale(1.05) rotateZ(-1deg);
    text-shadow: 0 0 35px rgba(255, 165, 0, 0.7), 0 0 55px rgba(255, 165, 0, 0.35);
  }
}

@keyframes dmc-number-gold {
  0%, 100% {
    transform: scale(1) rotateX(0deg) rotateY(0deg);
    text-shadow: 0 0 35px rgba(255, 215, 0, 0.7), 0 0 60px rgba(255, 215, 0, 0.4);
  }
  20% {
    transform: scale(1.1) rotateX(10deg) rotateY(5deg);
    text-shadow: 0 0 45px rgba(255, 215, 0, 0.9), 0 0 70px rgba(255, 215, 0, 0.5);
  }
  40% {
    transform: scale(1.15) rotateX(-5deg) rotateY(-8deg);
    text-shadow: 0 0 50px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.6);
  }
  60% {
    transform: scale(1.12) rotateX(8deg) rotateY(3deg);
    text-shadow: 0 0 48px rgba(255, 215, 0, 0.95), 0 0 75px rgba(255, 215, 0, 0.55);
  }
  80% {
    transform: scale(1.06) rotateX(-3deg) rotateY(-2deg);
    text-shadow: 0 0 42px rgba(255, 215, 0, 0.85), 0 0 65px rgba(255, 215, 0, 0.45);
  }
}

@keyframes dmc-number-legendary {
  0%, 100% {
    transform: scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    text-shadow: 0 0 40px rgba(147, 51, 234, 0.8), 0 0 70px rgba(236, 72, 153, 0.5), 0 0 100px rgba(147, 51, 234, 0.3);
  }
  16% {
    transform: scale(1.12) rotateX(15deg) rotateY(10deg) rotateZ(3deg);
    text-shadow: 0 0 50px rgba(147, 51, 234, 1), 0 0 80px rgba(236, 72, 153, 0.7), 0 0 120px rgba(147, 51, 234, 0.4);
  }
  33% {
    transform: scale(1.2) rotateX(-10deg) rotateY(-15deg) rotateZ(-2deg);
    text-shadow: 0 0 60px rgba(236, 72, 153, 0.9), 0 0 90px rgba(147, 51, 234, 0.8), 0 0 130px rgba(236, 72, 153, 0.5);
  }
  50% {
    transform: scale(1.25) rotateX(12deg) rotateY(8deg) rotateZ(4deg);
    text-shadow: 0 0 70px rgba(147, 51, 234, 1), 0 0 100px rgba(236, 72, 153, 0.9), 0 0 140px rgba(147, 51, 234, 0.6);
  }
  66% {
    transform: scale(1.18) rotateX(-8deg) rotateY(-12deg) rotateZ(-3deg);
    text-shadow: 0 0 65px rgba(236, 72, 153, 1), 0 0 95px rgba(147, 51, 234, 0.85), 0 0 135px rgba(236, 72, 153, 0.55);
  }
  83% {
    transform: scale(1.1) rotateX(6deg) rotateY(4deg) rotateZ(1deg);
    text-shadow: 0 0 55px rgba(147, 51, 234, 0.95), 0 0 85px rgba(236, 72, 153, 0.75), 0 0 125px rgba(147, 51, 234, 0.45);
  }
}

@keyframes dmc-shake {
  0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
  10% { transform: translateX(-3px) translateY(-2px) rotate(-1deg); }
  20% { transform: translateX(3px) translateY(2px) rotate(1deg); }
  30% { transform: translateX(-2px) translateY(-3px) rotate(-0.5deg); }
  40% { transform: translateX(2px) translateY(3px) rotate(0.5deg); }
  50% { transform: translateX(-1px) translateY(-1px) rotate(-0.3deg); }
  60% { transform: translateX(1px) translateY(1px) rotate(0.3deg); }
  70% { transform: translateX(-1px) translateY(0px) rotate(-0.2deg); }
  80% { transform: translateX(1px) translateY(0px) rotate(0.2deg); }
  90% { transform: translateX(0px) translateY(-1px) rotate(-0.1deg); }
}

@keyframes dmc-legendary-text {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
    text-shadow: 0 0 15px rgba(147, 51, 234, 0.4), 0 0 30px rgba(236, 72, 153, 0.2);
  }
  25% {
    opacity: 0.9;
    transform: scale(1.05);
    text-shadow: 0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(147, 51, 234, 0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
    text-shadow: 0 0 25px rgba(147, 51, 234, 0.8), 0 0 50px rgba(236, 72, 153, 0.5);
  }
  75% {
    opacity: 0.95;
    transform: scale(1.08);
    text-shadow: 0 0 22px rgba(236, 72, 153, 0.7), 0 0 45px rgba(147, 51, 234, 0.4);
  }
}

@keyframes dmc-shockwave {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
    border-width: 3px;
  }
  50% {
    transform: scale(2);
    opacity: 0.4;
    border-width: 2px;
  }
  100% {
    transform: scale(4);
    opacity: 0;
    border-width: 1px;
  }
}

@keyframes dmc-shockwave-delayed {
  0% {
    transform: scale(0.9);
    opacity: 0.6;
    border-width: 2px;
  }
  50% {
    transform: scale(2.5);
    opacity: 0.3;
    border-width: 1px;
  }
  100% {
    transform: scale(5);
    opacity: 0;
    border-width: 0px;
  }
}

.animate-dmc-impact { animation: dmc-impact 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.animate-dmc-label { animation: dmc-label 2s ease-in-out infinite; }
.animate-dmc-label-gold { animation: dmc-label-gold 1.8s ease-in-out infinite; }
.animate-dmc-label-legendary { animation: dmc-label-legendary 2.5s ease-in-out infinite; }
.animate-dmc-number { animation: dmc-number 2s ease-in-out infinite; }
.animate-dmc-number-gold { animation: dmc-number-gold 1.8s ease-in-out infinite; }
.animate-dmc-number-legendary { animation: dmc-number-legendary 2.2s ease-in-out infinite; }
.animate-dmc-shake { animation: dmc-shake 0.2s ease-in-out; }
.animate-dmc-legendary-text { animation: dmc-legendary-text 1.5s ease-in-out infinite; }
.animate-dmc-shockwave { animation: dmc-shockwave 0.6s ease-out; }
.animate-dmc-shockwave-delayed { animation: dmc-shockwave-delayed 0.8s ease-out 0.1s; }
</style>