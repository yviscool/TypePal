<template>
  <!-- 设置侧边栏 - 浮动模态框 -->
  <Transition name="settings-modal" appear>
    <div v-if="show" class="fixed inset-0 z-50 flex">
      <!-- 背景遮罩 -->
      <Transition name="settings-backdrop" appear>
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="$emit('close')"></div>
      </Transition>

      <!-- 侧边栏内容 -->
      <Transition name="settings-sidebar" appear>
        <div
          class="settings-panel relative ml-auto w-full max-w-md h-full bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-800/90 backdrop-blur-xl border-l border-white/30 shadow-2xl overflow-y-auto">

          <!-- 设置标题栏 -->
          <div
            class="sticky top-0 z-10 p-6 bg-gradient-to-r from-coral-500/10 to-coral-600/10 backdrop-blur-sm border-b border-white/20">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
                  <div class="i-ph-gear text-white text-lg"></div>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">练习设置</h3>
                  <p class="text-xs text-gray-600 dark:text-white/60">个性化你的练习体验</p>
                </div>
              </div>
              <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                title="关闭设置">
                <div class="i-ph-x text-lg text-gray-600 dark:text-white/80"></div>
              </button>
            </div>
            <div class="mt-3 text-xs text-gray-500 dark:text-white/50 font-mono">
              按 <kbd class="px-1.5 py-0.5 bg-white/30 rounded text-xs">Alt + S</kbd> 或 <kbd
                class="px-1.5 py-0.5 bg-white/30 rounded text-xs">Esc</kbd> 快速切换
            </div>
          </div>

          <!-- 设置内容 -->
          <div class="p-6 space-y-8">
            <!-- 基础设置卡片 -->
            <div class="space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <div
                  class="w-6 h-6 rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
                  <div class="i-ph-speaker-high text-white text-sm"></div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">基础设置</h4>
              </div>

              <!-- 发音设置 -->
              <div class="space-y-3">
                <label class="text-sm font-medium text-gray-700 dark:text-white/80">发音语言</label>
                <div class="relative">
                  <select v-model="localSettings.pronunciation"
                    class="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 focus:outline-none text-gray-900 dark:text-white text-sm font-medium transition-all duration-300 hover:bg-white/25 appearance-none cursor-pointer">
                    <option value="us">🇺🇸 美式英语</option>
                    <option value="uk">🇬🇧 英式英语</option>
                  </select>
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div class="i-ph-caret-down text-gray-500"></div>
                  </div>
                </div>
              </div>

              <!-- 显示选项 -->
              <div class="space-y-4">
                <label class="text-sm font-medium text-gray-700 dark:text-white/80">显示选项</label>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative">
                      <input v-model="localSettings.showTranslation" type="checkbox"
                        class="w-5 h-5 rounded-lg border-2 border-white/40 bg-white/20 checked:bg-gradient-to-br checked:from-coral-500 checked:to-coral-600 checked:border-coral-500 transition-all duration-300 focus:ring-2 focus:ring-coral-500/20">
                      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                        </div>
                      </div>
                    </div>
                    <span
                      class="text-sm text-gray-800 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">显示中文释义</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative">
                      <input v-model="localSettings.dictationMode" type="checkbox"
                        class="w-5 h-5 rounded-lg border-2 border-white/40 bg-white/20 checked:bg-gradient-to-br checked:from-lemon-500 checked:to-lemon-600 checked:border-lemon-500 transition-all duration-300 focus:ring-2 focus:ring-lemon-500/20">
                      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                        </div>
                      </div>
                    </div>
                    <span
                      class="text-sm text-gray-800 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">默写模式</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative">
                      <input v-model="localSettings.soundEnabled" type="checkbox"
                        class="w-5 h-5 rounded-lg border-2 border-white/40 bg-white/20 checked:bg-gradient-to-br checked:from-electric-blue checked:to-electric-blue/80 checked:border-electric-blue transition-all duration-300 focus:ring-2 focus:ring-electric-blue/20">
                      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                        </div>
                      </div>
                    </div>
                    <span
                      class="text-sm text-gray-800 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">自动发音提示</span>
                  </label>

                  <!-- 打字音效设置 -->
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative">
                      <input v-model="localSettings.typingSound" type="checkbox"
                        class="w-5 h-5 rounded-lg border-2 border-white/40 bg-white/20 checked:bg-gradient-to-br checked:from-cyber-pink checked:to-cyber-pink/80 checked:border-cyber-pink transition-all duration-300 focus:ring-2 focus:ring-cyber-pink/20">
                      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                        </div>
                      </div>
                    </div>
                    <span
                      class="text-sm text-gray-800 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">打字音效</span>
                  </label>

                  <!-- 音效变体选择 -->
                  <div v-if="localSettings.typingSound" class="ml-8 space-y-2">
                    <label class="text-xs font-medium text-gray-600 dark:text-white/70">音效类型</label>
                    <div class="space-y-1">
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <input v-model="localSettings.typingSoundVariant" value="Default" type="radio" name="typingSoundVariant"
                          class="w-3 h-3 text-cyber-pink bg-white/20 border-white/40 focus:ring-cyber-pink/20 focus:ring-1">
                        <span class="text-xs text-gray-700 dark:text-white/80">🔊 默认音效</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <input v-model="localSettings.typingSoundVariant" value="Cherry MX Blues" type="radio" name="typingSoundVariant"
                          class="w-3 h-3 text-cyber-pink bg-white/20 border-white/40 focus:ring-cyber-pink/20 focus:ring-1">
                        <span class="text-xs text-gray-700 dark:text-white/80">⌨️ 机械键盘</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <input v-model="localSettings.typingSoundVariant" value="Topre" type="radio" name="typingSoundVariant"
                          class="w-3 h-3 text-cyber-pink bg-white/20 border-white/40 focus:ring-cyber-pink/20 focus:ring-1">
                        <span class="text-xs text-gray-700 dark:text-white/80">🎹 静电容</span>
                      </label>
                    </div>
                  </div>
                  <!-- 特效设置 -->
                  <div class="space-y-3">
                    <label class="text-sm font-medium text-gray-700 dark:text-white/80">连击特效</label>
                    <div class="space-y-2">
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="localSettings.comboEffectsLevel" value="none" type="radio" name="comboEffects"
                          class="w-4 h-4 text-gray-500 bg-white/20 border-white/40 focus:ring-gray-500/20 focus:ring-2">
                        <div class="flex-1">
                          <div class="text-sm font-medium text-gray-800 dark:text-white/90">🚫 无特效</div>
                          <div class="text-xs text-gray-600 dark:text-white/60">专注练习，不显示任何特效</div>
                        </div>
                      </label>
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="localSettings.comboEffectsLevel" value="simple" type="radio" name="comboEffects"
                          class="w-4 h-4 text-electric-blue bg-white/20 border-white/40 focus:ring-electric-blue/20 focus:ring-2">
                        <div class="flex-1">
                          <div class="text-sm font-medium text-gray-800 dark:text-white/90">✨ 简约特效</div>
                          <div class="text-xs text-gray-600 dark:text-white/60">简单的连击提示和动画</div>
                        </div>
                      </label>
                      <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="localSettings.comboEffectsLevel" value="gorgeous" type="radio"
                          name="comboEffects"
                          class="w-4 h-4 text-cyber-pink bg-white/20 border-white/40 focus:ring-cyber-pink/20 focus:ring-2">
                        <div class="flex-1">
                          <div class="text-sm font-medium text-gray-800 dark:text-white/90">🎆 华丽特效</div>
                          <div class="text-xs text-gray-600 dark:text-white/60">炫酷的粒子效果和动画</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 练习模式卡片 -->
            <div class="space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <div
                  class="w-6 h-6 rounded-lg bg-gradient-to-br from-electric-blue to-electric-blue/80 flex items-center justify-center">
                  <div class="i-ph-target text-white text-sm"></div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">练习模式</h4>
              </div>

              <!-- 练习方式 -->
              <div class="space-y-3">
                <label class="text-sm font-medium text-gray-700 dark:text-white/80">练习方式</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input v-model="localSettings.practiceMode" value="normal" type="radio" name="practiceMode"
                      class="w-4 h-4 text-electric-blue bg-white/20 border-white/40 focus:ring-electric-blue/20 focus:ring-2">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-800 dark:text-white/90">🎯 普通模式</div>
                      <div class="text-xs text-gray-600 dark:text-white/60">允许退格修正错误</div>
                    </div>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input v-model="localSettings.practiceMode" value="strict" type="radio" name="practiceMode"
                      class="w-4 h-4 text-electric-blue bg-white/20 border-white/40 focus:ring-electric-blue/20 focus:ring-2">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-800 dark:text-white/90">⚡ 严格模式</div>
                      <div class="text-xs text-gray-600 dark:text-white/60">单个字符错误重来</div>
                    </div>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input v-model="localSettings.practiceMode" value="hardcore" type="radio" name="practiceMode"
                      class="w-4 h-4 text-electric-blue bg-white/20 border-white/40 focus:ring-electric-blue/20 focus:ring-2">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-800 dark:text-white/90">🔥 硬核模式</div>
                      <div class="text-xs text-gray-600 dark:text-white/60">任何错误全部重来</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 单词循环次数 -->
              <div class="space-y-3">
                <label class="text-sm font-medium text-gray-700 dark:text-white/80">单词循环次数</label>
                <div class="relative">
                  <select v-model="localSettings.wordLoopCount"
                    class="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-cyber-pink focus:ring-2 focus:ring-cyber-pink/20 focus:outline-none text-gray-900 dark:text-white text-sm font-medium transition-all duration-300 hover:bg-white/25 appearance-none cursor-pointer">
                    <option value="1">1 次 (默认)</option>
                    <option value="3">3 次 (加强记忆)</option>
                    <option value="5">5 次 (深度练习)</option>
                    <option value="8">8 次 (强化训练)</option>
                    <option value="infinite">♾️ 无限循环</option>
                  </select>
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div class="i-ph-caret-down text-gray-500"></div>
                  </div>
                </div>
                <div class="text-xs text-gray-600 dark:text-white/60">
                  每个单词需要正确输入的次数
                </div>
              </div>
            </div>

            <!-- 快捷操作卡片 -->
            <div class="space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <div
                  class="w-6 h-6 rounded-lg bg-gradient-to-br from-cyber-pink to-cyber-pink/80 flex items-center justify-center">
                  <div class="i-ph-lightning text-white text-sm"></div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">快捷操作</h4>
              </div>

              <div class="space-y-4">
                <button @click="$emit('resetChapter')"
                  class="w-full px-4 py-3 text-sm font-medium bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 transition-all duration-300 text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white group">
                  <div class="flex items-center justify-center gap-2">
                    <div
                      class="i-ph-arrow-clockwise text-base group-hover:rotate-180 transition-transform duration-500">
                    </div>
                    重置当前章节
                  </div>
                </button>

                <button @click="$emit('startDictation')"
                  class="w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-coral-500/25 to-coral-600/25 backdrop-blur-sm border border-coral-500/40 rounded-xl hover:from-coral-500/35 hover:to-coral-600/35 hover:border-coral-500/60 hover:scale-105 transition-all duration-300 text-coral-700 dark:text-coral-200 hover:text-coral-800 dark:hover:text-white group">
                  <div class="flex items-center justify-center gap-2">
                    <div class="i-ph-pencil-simple text-base group-hover:scale-110 transition-transform duration-300">
                    </div>
                    开启默写模式
                  </div>
                </button>

                <button @click="$emit('randomizeChapter')"
                  class="w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-lemon-500/25 to-lemon-600/25 backdrop-blur-sm border border-lemon-500/40 rounded-xl hover:from-lemon-500/35 hover:to-lemon-600/35 hover:border-lemon-500/60 hover:scale-105 transition-all duration-300 text-lemon-700 dark:text-lemon-200 hover:text-lemon-800 dark:hover:text-white group">
                  <div class="flex items-center justify-center gap-2">
                    <div class="i-ph-shuffle text-base group-hover:rotate-180 transition-transform duration-300"></div>
                    随机打乱顺序
                  </div>
                </button>
              </div>

              <!-- 快捷键提示 -->
              <div class="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div class="text-xs font-medium text-gray-700 dark:text-white/70 mb-3">快捷键指南</div>
                <div class="space-y-2 text-xs text-gray-600 dark:text-white/60">
                  <div class="flex justify-between items-center">
                    <span>切换设置面板</span>
                    <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Alt + S</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>暂停/继续练习</span>
                    <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Esc</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>跳过当前单词</span>
                    <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Tab</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>切换到下一章节</span>
                    <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Alt + C</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>播放发音</span>
                    <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Alt + P</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>重置当前章节</span>
                    <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Alt + R</kbd>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-white/10">
                  <div class="text-xs text-gray-500 dark:text-white/40">
                    💡 使用 Alt + 字母键避免与浏览器快捷键冲突
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PracticeSettings } from '@/types/practice'

interface Props {
  show: boolean
  settings: PracticeSettings
}

const props = defineProps<Props>()

defineEmits<{
  close: []
  resetChapter: []
  startDictation: []
  randomizeChapter: []
}>()

// 创建本地设置副本，避免直接修改 props
const localSettings = ref<PracticeSettings>({ ...props.settings })

// 监听 props 变化，同步到本地设置
watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings }
}, { deep: true })

// 监听本地设置变化，同步回原始设置
watch(localSettings, (newSettings) => {
  Object.assign(props.settings, newSettings)
}, { deep: true })
</script>

<style scoped>
/* 设置弹出动画 */
.settings-modal-enter-active,
.settings-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.settings-modal-enter-from,
.settings-modal-leave-to {
  opacity: 0;
}

.settings-backdrop-enter-active,
.settings-backdrop-leave-active {
  transition: all 0.25s ease-out;
}

.settings-backdrop-enter-from,
.settings-backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.settings-sidebar-enter-active,
.settings-sidebar-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.settings-sidebar-enter-from,
.settings-sidebar-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.settings-sidebar-enter-active {
  transition-delay: 0.1s;
}
</style>