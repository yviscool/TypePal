<template>
  <Transition name="settings-modal" appear>
    <div v-if="show" class="fixed inset-0 z-50 flex">
      <!-- 背景遮罩 -->
      <Transition name="settings-backdrop" appear>
        <div class="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30 backdrop-blur-md" @click="$emit('close')"></div>
      </Transition>

      <!-- 侧边栏内容 -->
      <Transition name="settings-sidebar" appear>
        <div class="settings-panel relative ml-auto w-full max-w-lg h-full bg-gradient-to-br from-white/98 via-white/95 to-white/92 dark:from-gray-900/98 dark:via-gray-900/95 dark:to-gray-800/92 backdrop-blur-2xl border-l border-white/40 dark:border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(0,0,0,0.4)] overflow-y-auto">
          <!-- 设置标题栏 -->
          <div class="sticky top-0 z-10 p-5 bg-gradient-to-r from-coral-500/15 via-coral-500/10 to-coral-600/15 backdrop-blur-xl border-b border-white/30 dark:border-white/20">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-coral-500 via-coral-500 to-coral-600 flex items-center justify-center shadow-sm shadow-coral-500/30">
                  <div class="i-ph-gear text-white text-lg"></div>
                </div>
                <div>
                  <h3 class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/90 bg-clip-text text-transparent">练习设置</h3>
                  <p class="text-sm text-gray-600 dark:text-white/70 font-medium">个性化你的练习体验</p>
                </div>
              </div>
              <button @click="$emit('close')" class="p-2 rounded-xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300 hover:scale-110 group" title="关闭设置">
                <div class="i-ph-x text-gray-600 dark:text-white/80 text-lg group-hover:rotate-90 transition-transform duration-300"></div>
              </button>
            </div>
            <div class="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 font-mono">
              <div class="flex items-center gap-1">
                <kbd class="px-2 py-1 bg-white/40 dark:bg-white/20 rounded-lg text-xs font-semibold shadow-sm">Alt+S</kbd>
                <span class="text-xs">或</span>
                <kbd class="px-2 py-1 bg-white/40 dark:bg-white/20 rounded-lg text-xs font-semibold shadow-sm">Esc</kbd>
              </div>
              <span class="text-xs opacity-80">快速切换</span>
            </div>
          </div>

          <!-- 设置内容 -->
          <div class="p-6 space-y-8">
            <!-- 基础设置卡片 -->
            <div class="space-y-5 p-5 bg-gradient-to-br from-white/20 via-white/15 to-white/10 dark:from-white/10 dark:via-white/8 dark:to-white/5 rounded-2xl border border-white/30 dark:border-white/20 shadow-sm backdrop-blur-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-6 h-6 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center shadow-md shadow-coral-500/30">
                  <div class="i-ph-speaker-high text-white text-sm"></div>
                </div>
                <h4 class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/90 bg-clip-text text-transparent">基础设置</h4>
              </div>

              <!-- 发音设置 -->
              <div class="space-y-3">
                <label class="text-sm font-semibold text-gray-700 dark:text-white/90 flex items-center gap-2">
                  <div class="i-ph-globe text-coral-500"></div>
                  发音语言
                </label>
                <div class="relative group">
                  <select v-model="localSettings.pronunciation"
                    class="w-full px-4 py-3 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/30 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/30 focus:outline-none text-gray-900 dark:text-white text-sm font-medium transition-all duration-300 hover:bg-white/40 dark:hover:bg-white/15 hover:border-white/50 appearance-none cursor-pointer shadow-sm">
                    <option value="us">🇺🇸 美式英语 (American)</option>
                    <option value="uk">🇬🇧 英式英语 (British)</option>
                  </select>
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-200">
                    <div class="i-ph-caret-down text-gray-500 dark:text-white/60"></div>
                  </div>
                </div>
              </div>

              <!-- 显示选项 -->
              <div class="space-y-3">
                <label class="text-sm font-semibold text-gray-700 dark:text-white/90 flex items-center gap-2">
                  <div class="i-ph-eye text-electric-blue"></div>
                  显示选项
                </label>
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-3">
                    <label class="flex items-center gap-3 cursor-pointer group bg-gradient-to-r from-white/20 to-white/15 dark:from-white/10 dark:to-white/8 px-3 py-3 rounded-xl border border-white/30 dark:border-white/20 hover:from-white/30 hover:to-white/25 dark:hover:from-white/15 dark:hover:to-white/12 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                      <div class="relative">
                        <input v-model="localSettings.showTranslation" type="checkbox"
                          class="w-5 h-5 rounded-lg border-2 border-white/50 dark:border-white/40 bg-white/30 dark:bg-white/20 checked:bg-gradient-to-br checked:from-coral-500 checked:to-coral-600 checked:border-coral-500 transition-all duration-300 focus:ring-2 focus:ring-coral-500/30 shadow-sm">
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div class="i-ph-check text-white text-sm opacity-0 group-has-[:checked]:opacity-100 transition-all duration-300 group-has-[:checked]:scale-110"></div>
                        </div>
                      </div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-800 dark:text-white/95">中文释义</span>
                        <div class="text-xs text-gray-600 dark:text-white/70">显示单词含义</div>
                      </div>
                    </label>
                    
                    <label class="flex items-center gap-3 cursor-pointer group bg-gradient-to-r from-white/20 to-white/15 dark:from-white/10 dark:to-white/8 px-3 py-3 rounded-xl border border-white/30 dark:border-white/20 hover:from-white/30 hover:to-white/25 dark:hover:from-white/15 dark:hover:to-white/12 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                      <div class="relative">
                        <input v-model="localSettings.dictationMode" type="checkbox"
                          class="w-5 h-5 rounded-lg border-2 border-white/50 dark:border-white/40 bg-white/30 dark:bg-white/20 checked:bg-gradient-to-br checked:from-lemon-500 checked:to-lemon-600 checked:border-lemon-500 transition-all duration-300 focus:ring-2 focus:ring-lemon-500/30 shadow-sm">
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div class="i-ph-check text-white text-sm opacity-0 group-has-[:checked]:opacity-100 transition-all duration-300 group-has-[:checked]:scale-110"></div>
                        </div>
                      </div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-800 dark:text-white/95">默写模式</span>
                        <div class="text-xs text-gray-600 dark:text-white/70">听音写词</div>
                      </div>
                    </label>
                    
                    <label class="flex items-center gap-3 cursor-pointer group bg-gradient-to-r from-white/20 to-white/15 dark:from-white/10 dark:to-white/8 px-3 py-3 rounded-xl border border-white/30 dark:border-white/20 hover:from-white/30 hover:to-white/25 dark:hover:from-white/15 dark:hover:to-white/12 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                      <div class="relative">
                        <input v-model="localSettings.soundEnabled" type="checkbox"
                          class="w-5 h-5 rounded-lg border-2 border-white/50 dark:border-white/40 bg-white/30 dark:bg-white/20 checked:bg-gradient-to-br checked:from-electric-blue checked:to-electric-blue/80 checked:border-electric-blue transition-all duration-300 focus:ring-2 focus:ring-electric-blue/30 shadow-sm">
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div class="i-ph-check text-white text-sm opacity-0 group-has-[:checked]:opacity-100 transition-all duration-300 group-has-[:checked]:scale-110"></div>
                        </div>
                      </div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-800 dark:text-white/95">自动发音</span>
                        <div class="text-xs text-gray-600 dark:text-white/70">单词朗读</div>
                      </div>
                    </label>
                    
                    <label class="flex items-center gap-3 cursor-pointer group bg-gradient-to-r from-white/20 to-white/15 dark:from-white/10 dark:to-white/8 px-3 py-3 rounded-xl border border-white/30 dark:border-white/20 hover:from-white/30 hover:to-white/25 dark:hover:from-white/15 dark:hover:to-white/12 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                      <div class="relative">
                        <input v-model="localSettings.typingSound" type="checkbox"
                          class="w-5 h-5 rounded-lg border-2 border-white/50 dark:border-white/40 bg-white/30 dark:bg-white/20 checked:bg-gradient-to-br checked:from-cyber-pink checked:to-cyber-pink/80 checked:border-cyber-pink transition-all duration-300 focus:ring-2 focus:ring-cyber-pink/30 shadow-sm">
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div class="i-ph-check text-white text-sm opacity-0 group-has-[:checked]:opacity-100 transition-all duration-300 group-has-[:checked]:scale-110"></div>
                        </div>
                      </div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-800 dark:text-white/95">打字音效</span>
                        <div class="text-xs text-gray-600 dark:text-white/70">键盘声音</div>
                      </div>
                    </label>
                  </div>

                  <!-- 音效变体选择 -->
                  <Transition name="sound-options" mode="out-in">
                    <div v-if="localSettings.typingSound" class="ml-2 p-4 bg-gradient-to-br from-cyber-pink/10 to-cyber-pink/5 rounded-xl border border-cyber-pink/20 space-y-3">
                      <label class="text-sm font-semibold text-gray-700 dark:text-white/90 flex items-center gap-2">
                        <div class="i-ph-waveform text-cyber-pink"></div>
                        音效类型
                      </label>
                      <div class="grid grid-cols-3 gap-2">
                        <label class="flex items-center gap-2 cursor-pointer group p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200">
                          <input v-model="localSettings.typingSoundVariant" value="Default" type="radio" name="typingSoundVariant"
                            class="w-4 h-4 text-cyber-pink bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-cyber-pink/30 focus:ring-2 shadow-sm">
                          <span class="text-sm text-gray-700 dark:text-white/90 font-medium">🔊 默认</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer group p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200">
                          <input v-model="localSettings.typingSoundVariant" value="Cherry MX Blues" type="radio" name="typingSoundVariant"
                            class="w-4 h-4 text-cyber-pink bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-cyber-pink/30 focus:ring-2 shadow-sm">
                          <span class="text-sm text-gray-700 dark:text-white/90 font-medium">⌨️ 机械</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer group p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200">
                          <input v-model="localSettings.typingSoundVariant" value="Topre" type="radio" name="typingSoundVariant"
                            class="w-4 h-4 text-cyber-pink bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-cyber-pink/30 focus:ring-2 shadow-sm">
                          <span class="text-sm text-gray-700 dark:text-white/90 font-medium">🎹 静电容</span>
                        </label>
                      </div>
                    </div>
                  </Transition>

                  <!-- 特效设置 -->
                  <div class="space-y-3">
                    <label class="text-sm font-semibold text-gray-700 dark:text-white/90 flex items-center gap-2">
                      <div class="i-ph-sparkle text-cyber-pink"></div>
                      连击特效
                    </label>
                    <div class="grid grid-cols-3 gap-3">
                      <label class="flex flex-col items-center p-3 bg-gradient-to-br from-white/15 to-white/10 dark:from-white/8 dark:to-white/5 rounded-xl cursor-pointer group hover:from-white/25 hover:to-white/20 dark:hover:from-white/12 dark:hover:to-white/8 transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/15">
                        <input v-model="localSettings.comboEffectsLevel" value="none" type="radio" name="comboEffects"
                          class="w-4 h-4 text-gray-500 bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-gray-500/30 focus:ring-2 shadow-sm">
                        <div class="mt-2 text-center">
                          <div class="text-sm font-semibold text-gray-800 dark:text-white/95">🚫 无特效</div>
                          <div class="text-xs text-gray-600 dark:text-white/70 mt-1">专注练习</div>
                        </div>
                      </label>
                      <label class="flex flex-col items-center p-3 bg-gradient-to-br from-white/15 to-white/10 dark:from-white/8 dark:to-white/5 rounded-xl cursor-pointer group hover:from-white/25 hover:to-white/20 dark:hover:from-white/12 dark:hover:to-white/8 transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/15">
                        <input v-model="localSettings.comboEffectsLevel" value="simple" type="radio" name="comboEffects"
                          class="w-4 h-4 text-electric-blue bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-electric-blue/30 focus:ring-2 shadow-sm">
                        <div class="mt-2 text-center">
                          <div class="text-sm font-semibold text-gray-800 dark:text-white/95">✨ 简约</div>
                          <div class="text-xs text-gray-600 dark:text-white/70 mt-1">基础动画</div>
                        </div>
                      </label>
                      <label class="flex flex-col items-center p-3 bg-gradient-to-br from-white/15 to-white/10 dark:from-white/8 dark:to-white/5 rounded-xl cursor-pointer group hover:from-white/25 hover:to-white/20 dark:hover:from-white/12 dark:hover:to-white/8 transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/15">
                        <input v-model="localSettings.comboEffectsLevel" value="gorgeous" type="radio" name="comboEffects"
                          class="w-4 h-4 text-cyber-pink bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-cyber-pink/30 focus:ring-2 shadow-sm">
                        <div class="mt-2 text-center">
                          <div class="text-sm font-semibold text-gray-800 dark:text-white/95">🎆 华丽</div>
                          <div class="text-xs text-gray-600 dark:text-white/70 mt-1">粒子特效</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 练习模式卡片 -->
            <div class="space-y-5 p-5 bg-gradient-to-br from-white/20 via-white/15 to-white/10 dark:from-white/10 dark:via-white/8 dark:to-white/5 rounded-2xl border border-white/30 dark:border-white/20 shadow-sm backdrop-blur-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-6 h-6 rounded-xl bg-gradient-to-br from-electric-blue to-electric-blue/80 flex items-center justify-center shadow-md shadow-electric-blue/30">
                  <div class="i-ph-target text-white text-sm"></div>
                </div>
                <h4 class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/90 bg-clip-text text-transparent">练习模式</h4>
              </div>

              <!-- 练习方式 -->
              <div class="space-y-3">
                <label class="text-sm font-semibold text-gray-700 dark:text-white/90 flex items-center gap-2">
                  <div class="i-ph-lightning text-electric-blue"></div>
                  练习方式
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <label class="flex flex-col items-center p-3 bg-gradient-to-br from-white/15 to-white/10 dark:from-white/8 dark:to-white/5 rounded-xl cursor-pointer group hover:from-white/25 hover:to-white/20 dark:hover:from-white/12 dark:hover:to-white/8 transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/15">
                    <input v-model="localSettings.practiceMode" value="normal" type="radio" name="practiceMode"
                      class="w-4 h-4 text-electric-blue bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-electric-blue/30 focus:ring-2 shadow-sm">
                    <div class="mt-2 text-center">
                      <div class="text-sm font-semibold text-gray-800 dark:text-white/95">🎯 普通</div>
                      <div class="text-xs text-gray-600 dark:text-white/70 mt-1">可退格修正</div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gradient-to-br from-white/15 to-white/10 dark:from-white/8 dark:to-white/5 rounded-xl cursor-pointer group hover:from-white/25 hover:to-white/20 dark:hover:from-white/12 dark:hover:to-white/8 transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/15">
                    <input v-model="localSettings.practiceMode" value="strict" type="radio" name="practiceMode"
                      class="w-4 h-4 text-electric-blue bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-electric-blue/30 focus:ring-2 shadow-sm">
                    <div class="mt-2 text-center">
                      <div class="text-sm font-semibold text-gray-800 dark:text-white/95">⚡ 严格</div>
                      <div class="text-xs text-gray-600 dark:text-white/70 mt-1">错字重来</div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gradient-to-br from-white/15 to-white/10 dark:from-white/8 dark:to-white/5 rounded-xl cursor-pointer group hover:from-white/25 hover:to-white/20 dark:hover:from-white/12 dark:hover:to-white/8 transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-white/15">
                    <input v-model="localSettings.practiceMode" value="hardcore" type="radio" name="practiceMode"
                      class="w-4 h-4 text-electric-blue bg-white/30 dark:bg-white/20 border-white/50 dark:border-white/40 focus:ring-electric-blue/30 focus:ring-2 shadow-sm">
                    <div class="mt-2 text-center">
                      <div class="text-sm font-semibold text-gray-800 dark:text-white/95">🔥 硬核</div>
                      <div class="text-xs text-gray-600 dark:text-white/70 mt-1">全部重来</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 单词循环次数 -->
              <div class="space-y-3">
                <label class="text-sm font-semibold text-gray-700 dark:text-white/90 flex items-center gap-2">
                  <div class="i-ph-repeat text-cyber-pink"></div>
                  单词循环次数
                </label>
                <div class="relative group">
                  <select v-model="localSettings.wordLoopCount"
                    class="w-full px-4 py-3 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/30 focus:border-cyber-pink focus:ring-2 focus:ring-cyber-pink/30 focus:outline-none text-gray-900 dark:text-white text-sm font-medium transition-all duration-300 hover:bg-white/40 dark:hover:bg-white/15 hover:border-white/50 appearance-none cursor-pointer shadow-sm">
                    <option value="1">1 次 (默认)</option>
                    <option value="3">3 次 (加强记忆)</option>
                    <option value="5">5 次 (深度练习)</option>
                    <option value="8">8 次 (强化训练)</option>
                    <option value="infinite">♾️ 无限循环</option>
                  </select>
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-200">
                    <div class="i-ph-caret-down text-gray-500 dark:text-white/60"></div>
                  </div>
                </div>
                <div class="text-sm text-gray-600 dark:text-white/70 bg-white/10 dark:bg-white/5 rounded-lg p-2 border border-white/20">
                  💡 每个单词需要正确输入的次数
                </div>
              </div>
            </div>

            <!-- 快捷操作卡片 -->
            <div class="space-y-5 p-5 bg-gradient-to-br from-white/20 via-white/15 to-white/10 dark:from-white/10 dark:via-white/8 dark:to-white/5 rounded-2xl border border-white/30 dark:border-white/20 shadow-sm backdrop-blur-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-6 h-6 rounded-xl bg-gradient-to-br from-cyber-pink to-cyber-pink/80 flex items-center justify-center shadow-md shadow-cyber-pink/30">
                  <div class="i-ph-lightning text-white text-sm"></div>
                </div>
                <h4 class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/90 bg-clip-text text-transparent">快捷操作</h4>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <button @click="$emit('resetChapter')"
                  class="px-3 py-4 text-sm font-semibold bg-gradient-to-br from-white/20 to-white/15 dark:from-white/10 dark:to-white/8 backdrop-blur-sm border border-white/30 dark:border-white/20 rounded-xl hover:from-white/30 hover:to-white/25 dark:hover:from-white/15 dark:hover:to-white/12 hover:scale-105 transition-all duration-300 text-gray-800 dark:text-white/95 hover:text-gray-900 dark:hover:text-white group shadow-sm">
                  <div class="flex flex-col items-center gap-2">
                    <div class="i-ph-arrow-clockwise text-xl group-hover:rotate-180 transition-transform duration-500"></div>
                    <span>重置章节</span>
                  </div>
                </button>

                <button @click="$emit('startDictation')"
                  class="px-3 py-4 text-sm font-semibold bg-gradient-to-br from-coral-500/30 to-coral-600/25 backdrop-blur-sm border border-coral-500/40 rounded-xl hover:from-coral-500/40 hover:to-coral-600/35 hover:border-coral-500/60 hover:scale-105 transition-all duration-300 text-coral-700 dark:text-coral-200 hover:text-coral-800 dark:hover:text-white group shadow-sm">
                  <div class="flex flex-col items-center gap-2">
                    <div class="i-ph-pencil-simple text-xl group-hover:scale-110 transition-transform duration-300"></div>
                    <span>默写模式</span>
                  </div>
                </button>

                <button @click="$emit('randomizeChapter')"
                  class="px-3 py-4 text-sm font-semibold bg-gradient-to-br from-lemon-500/30 to-lemon-600/25 backdrop-blur-sm border border-lemon-500/40 rounded-xl hover:from-lemon-500/40 hover:to-lemon-600/35 hover:border-lemon-500/60 hover:scale-105 transition-all duration-300 text-lemon-700 dark:text-lemon-200 hover:text-lemon-800 dark:hover:text-white group shadow-sm">
                  <div class="flex flex-col items-center gap-2">
                    <div class="i-ph-shuffle text-xl group-hover:rotate-180 transition-transform duration-300"></div>
                    <span>随机顺序</span>
                  </div>
                </button>
              </div>

              <!-- 快捷键提示 -->
              <div class="mt-4 p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/10 dark:from-white/8 dark:to-white/5 backdrop-blur-sm border border-white/20 dark:border-white/15">
                <div class="text-sm font-semibold text-gray-700 dark:text-white/90 mb-3 flex items-center gap-2">
                  <div class="i-ph-keyboard text-electric-blue"></div>
                  快捷键指南
                </div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-white/70">
                  <div class="flex justify-between items-center">
                    <span>设置面板</span>
                    <kbd class="px-2 py-1 bg-white/30 dark:bg-white/20 rounded-lg text-xs font-mono shadow-sm">Alt+S</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>暂停/继续</span>
                    <kbd class="px-2 py-1 bg-white/30 dark:bg-white/20 rounded-lg text-xs font-mono shadow-sm">Esc</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>跳过单词</span>
                    <kbd class="px-2 py-1 bg-white/30 dark:bg-white/20 rounded-lg text-xs font-mono shadow-sm">Tab</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>下一章节</span>
                    <kbd class="px-2 py-1 bg-white/30 dark:bg-white/20 rounded-lg text-xs font-mono shadow-sm">Alt+C</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>播放发音</span>
                    <kbd class="px-2 py-1 bg-white/30 dark:bg-white/20 rounded-lg text-xs font-mono shadow-sm">Alt+P</kbd>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>重置章节</span>
                    <kbd class="px-2 py-1 bg-white/30 dark:bg-white/20 rounded-lg text-xs font-mono shadow-sm">Alt+R</kbd>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-white/20 dark:border-white/15">
                  <div class="text-xs text-gray-500 dark:text-white/50 flex items-center gap-2">
                    <div class="i-ph-lightbulb text-lemon-500"></div>
                    使用 Alt+字母键避免与浏览器快捷键冲突
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
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.settings-modal-enter-from,
.settings-modal-leave-to {
  opacity: 0;
}

.settings-backdrop-enter-active,
.settings-backdrop-leave-active {
  transition: all 0.3s ease-out;
}

.settings-backdrop-enter-from,
.settings-backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.settings-sidebar-enter-active,
.settings-sidebar-leave-active {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.settings-sidebar-enter-from,
.settings-sidebar-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.settings-sidebar-enter-active {
  transition-delay: 0.1s;
}

/* 音效选项动画 */
.sound-options-enter-active,
.sound-options-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.sound-options-enter-from,
.sound-options-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* 自定义滚动条 */
.settings-panel::-webkit-scrollbar {
  width: 6px;
}

.settings-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.settings-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.settings-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 深色模式滚动条 */
.dark .settings-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark .settings-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark .settings-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
