<template>
    <div class="min-h-screen p-6" @click="handlePageClick">
        <!-- 头部导航和设置 -->
        <header class="max-w-4xl mx-auto mb-8">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                    <button @click="goBack" class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        title="返回词库">
                        <div class="i-ph-arrow-left text-xl"></div>
                    </button>
                    <div>
                        <h1 class="text-2xl font-bold">{{ dictionaryName }}</h1>
                        <p class="text-sm opacity-60">第 {{ currentChapter + 1 }} 章</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <!-- 章节选择器 -->
                    <div class="relative group">
                        <select v-model="currentChapter" @change="onChapterChange"
                            class="px-6 py-3 pr-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/8 hover:border-white/20 focus:bg-white/10 focus:border-coral-500/30 focus:ring-1 focus:ring-coral-500/10 focus:outline-none text-sm font-medium transition-all duration-300 appearance-none cursor-pointer min-w-[160px] text-gray-900 dark:text-white/90 hover:text-gray-800 dark:hover:text-white"
                            title="选择章节 (快捷键: C)">
                            <option v-for="(chapter, index) in availableChapters" :key="index" :value="index"
                                class="bg-white/95 text-gray-800 dark:bg-gray-800/95 dark:text-white/90 font-medium py-2 px-4">
                                第 {{ index + 1 }} 章 ({{ chapter.length }} 词)
                            </option>
                        </select>
                        <div
                            class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200">
                            <div
                                class="i-ph-caret-down text-sm opacity-50 group-hover:opacity-70 transition-opacity duration-200">
                            </div>
                        </div>
                    </div>
                    <!-- 设置展开按钮 -->
                    <button @click="showSettings = !showSettings"
                        class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        :class="{ 'bg-white/10': showSettings }" title="练习设置 (快捷键: Alt + S)">
                        <div class="i-ph-gear text-xl" :class="{ 'rotate-90': showSettings }"></div>
                    </button>

                    <!-- 暂停按钮 -->
                    <button @click="togglePause" class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        :class="{ 'bg-white/10': isPaused }" :title="isPaused ? '继续练习 (快捷键: Esc)' : '暂停练习 (快捷键: Esc)'">
                        <div class="i-ph-pause text-xl" v-if="!isPaused"></div>
                        <div class="i-ph-play text-xl" v-else></div>
                    </button>
                </div>
            </div>

        </header>

        <!-- 设置侧边栏 - 浮动模态框 -->
        <Transition name="settings-modal" appear>
            <div v-if="showSettings" class="fixed inset-0 z-50 flex">
                <!-- 背景遮罩 -->
                <Transition name="settings-backdrop" appear>
                    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="showSettings = false"></div>
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
                                <button @click="showSettings = false"
                                    class="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
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
                                        <select v-model="settings.pronunciation"
                                            class="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 focus:outline-none text-gray-900 dark:text-white text-sm font-medium transition-all duration-300 hover:bg-white/25 appearance-none cursor-pointer">
                                            <option value="us">🇺🇸 美式英语</option>
                                            <option value="uk">🇬🇧 英式英语</option>
                                        </select>
                                        <div
                                            class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                                                <input v-model="settings.showTranslation" type="checkbox"
                                                    class="w-5 h-5 rounded-lg border-2 border-white/40 bg-white/20 checked:bg-gradient-to-br checked:from-coral-500 checked:to-coral-600 checked:border-coral-500 transition-all duration-300 focus:ring-2 focus:ring-coral-500/20">
                                                <div
                                                    class="absolute inset-0 flex items-center justify-center pointer-events-none">
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
                                                <input v-model="settings.dictationMode" type="checkbox"
                                                    class="w-5 h-5 rounded-lg border-2 border-white/40 bg-white/20 checked:bg-gradient-to-br checked:from-lemon-500 checked:to-lemon-600 checked:border-lemon-500 transition-all duration-300 focus:ring-2 focus:ring-lemon-500/20">
                                                <div
                                                    class="absolute inset-0 flex items-center justify-center pointer-events-none">
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
                                                <input v-model="settings.soundEnabled" type="checkbox"
                                                    class="w-5 h-5 rounded-lg border-2 border-white/40 bg-white/20 checked:bg-gradient-to-br checked:from-electric-blue checked:to-electric-blue/80 checked:border-electric-blue transition-all duration-300 focus:ring-2 focus:ring-electric-blue/20">
                                                <div
                                                    class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div
                                                        class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                                    </div>
                                                </div>
                                            </div>
                                            <span
                                                class="text-sm text-gray-800 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">自动发音提示</span>
                                        </label>
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
                                            <input v-model="settings.practiceMode" value="normal" type="radio"
                                                name="practiceMode"
                                                class="w-4 h-4 text-electric-blue bg-white/20 border-white/40 focus:ring-electric-blue/20 focus:ring-2">
                                            <div class="flex-1">
                                                <div class="text-sm font-medium text-gray-800 dark:text-white/90">🎯
                                                    普通模式</div>
                                                <div class="text-xs text-gray-600 dark:text-white/60">允许退格修正错误</div>
                                            </div>
                                        </label>
                                        <label class="flex items-center gap-3 cursor-pointer group">
                                            <input v-model="settings.practiceMode" value="strict" type="radio"
                                                name="practiceMode"
                                                class="w-4 h-4 text-electric-blue bg-white/20 border-white/40 focus:ring-electric-blue/20 focus:ring-2">
                                            <div class="flex-1">
                                                <div class="text-sm font-medium text-gray-800 dark:text-white/90">⚡ 严格模式
                                                </div>
                                                <div class="text-xs text-gray-600 dark:text-white/60">单个字符错误重来</div>
                                            </div>
                                        </label>
                                        <label class="flex items-center gap-3 cursor-pointer group">
                                            <input v-model="settings.practiceMode" value="hardcore" type="radio"
                                                name="practiceMode"
                                                class="w-4 h-4 text-electric-blue bg-white/20 border-white/40 focus:ring-electric-blue/20 focus:ring-2">
                                            <div class="flex-1">
                                                <div class="text-sm font-medium text-gray-800 dark:text-white/90">🔥
                                                    硬核模式</div>
                                                <div class="text-xs text-gray-600 dark:text-white/60">任何错误全部重来</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <!-- 单词循环次数 -->
                                <div class="space-y-3">
                                    <label class="text-sm font-medium text-gray-700 dark:text-white/80">单词循环次数</label>
                                    <div class="relative">
                                        <select v-model="settings.wordLoopCount"
                                            class="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-cyber-pink focus:ring-2 focus:ring-cyber-pink/20 focus:outline-none text-gray-900 dark:text-white text-sm font-medium transition-all duration-300 hover:bg-white/25 appearance-none cursor-pointer">
                                            <option value="1">1 次 (默认)</option>
                                            <option value="3">3 次 (加强记忆)</option>
                                            <option value="5">5 次 (深度练习)</option>
                                            <option value="8">8 次 (强化训练)</option>
                                            <option value="infinite">♾️ 无限循环</option>
                                        </select>
                                        <div
                                            class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                                    <button @click="resetCurrentChapter"
                                        class="w-full px-4 py-3 text-sm font-medium bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 transition-all duration-300 text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white group">
                                        <div class="flex items-center justify-center gap-2">
                                            <div
                                                class="i-ph-arrow-clockwise text-base group-hover:rotate-180 transition-transform duration-500">
                                            </div>
                                            重置当前章节
                                        </div>
                                    </button>

                                    <button @click="startDictation"
                                        class="w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-coral-500/25 to-coral-600/25 backdrop-blur-sm border border-coral-500/40 rounded-xl hover:from-coral-500/35 hover:to-coral-600/35 hover:border-coral-500/60 hover:scale-105 transition-all duration-300 text-coral-700 dark:text-coral-200 hover:text-coral-800 dark:hover:text-white group">
                                        <div class="flex items-center justify-center gap-2">
                                            <div
                                                class="i-ph-pencil-simple text-base group-hover:scale-110 transition-transform duration-300">
                                            </div>
                                            开启默写模式
                                        </div>
                                    </button>

                                    <button @click="randomizeChapter"
                                        class="w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-lemon-500/25 to-lemon-600/25 backdrop-blur-sm border border-lemon-500/40 rounded-xl hover:from-lemon-500/35 hover:to-lemon-600/35 hover:border-lemon-500/60 hover:scale-105 transition-all duration-300 text-lemon-700 dark:text-lemon-200 hover:text-lemon-800 dark:hover:text-white group">
                                        <div class="flex items-center justify-center gap-2">
                                            <div
                                                class="i-ph-shuffle text-base group-hover:rotate-180 transition-transform duration-300">
                                            </div>
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
                                            <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Alt +
                                                S</kbd>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span>暂停/继续练习</span>
                                            <kbd
                                                class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Esc</kbd>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span>跳过当前单词</span>
                                            <kbd
                                                class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Tab</kbd>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span>切换到下一章节</span>
                                            <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Alt +
                                                C</kbd>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span>播放发音</span>
                                            <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Alt +
                                                P</kbd>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span>重置当前章节</span>
                                            <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono">Alt +
                                                R</kbd>
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

        <!-- 进度条 -->
        <div class="max-w-4xl mx-auto mb-8">
            <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-coral-500 to-lemon-500 transition-all duration-500 ease-out"
                    :style="{ width: `${progress}%` }"></div>
            </div>
        </div>



        <!-- 主练习区域 -->
        <div class="max-w-4xl mx-auto mt-35 relative">
            <div v-if="!isCompleted && currentWord" class="text-center">
                <!-- 浮动导航按钮 - 上一个单词 (左侧) -->
                <div class="fixed left-4 md:left-8 top transform -translate-y-1/2 z-10">
                    <button @click="previousWord" :disabled="currentWordIndex === 0"
                        class="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                        title="上一个单词">
                        <div class="flex items-center gap-3">
                            <div
                                class="i-ph-arrow-left text-xl text-coral-400 group-hover:text-coral-300 transition-colors duration-200">
                            </div>
                            <div v-if="currentWordIndex > 0" class="hidden md:block text-left">
                                <div class="text-sm font-bold text-black/90">{{ currentChapterWords[currentWordIndex -
                                    1]?.word }}</div>
                                <div class="text-xs text-black/60 max-w-20 truncate">{{
                                    currentChapterWords[currentWordIndex - 1]?.translation }}</div>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- 浮动导航按钮 - 下一个单词 (右侧) -->
                <div class="fixed right-4 md:right-8 top transform -translate-y-1/2 z-10">
                    <button @click="skipWord" :disabled="currentWordIndex >= currentChapterWords.length - 1"
                        class="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                        title="下一个单词">
                        <div class="flex items-center gap-3">
                            <div v-if="currentWordIndex < currentChapterWords.length - 1"
                                class="hidden md:block text-right">
                                <div class="text-sm font-bold text-black/90">{{ currentChapterWords[currentWordIndex +
                                    1]?.word }}</div>
                                <div class="text-xs text-black/60 max-w-20 truncate">{{
                                    currentChapterWords[currentWordIndex + 1]?.translation }}</div>
                            </div>
                            <div
                                class="i-ph-arrow-right text-xl text-coral-400 group-hover:text-coral-300 transition-colors duration-200">
                            </div>
                        </div>
                    </button>
                </div>

                <!-- 当前单词显示 -->
                <div class="mb-16 relative">
                    <!-- DMC风格连击显示 - 浮动在单词左上角 -->
                    <div v-if="comboCount >= 3"
                        class="absolute top-0 left-0 transform -translate-x-4 -translate-y-16 z-20">
                        <div class="relative select-none" :class="{
                            'animate-dmc-impact': showCombo
                        }">
                            <!-- COMBO 标签 -->
                            <div class="text-center mb-1">
                                <div class="text-2xl font-black tracking-[0.2em] opacity-80 transform transition-all duration-300"
                                    :class="{
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
                                    <div class="absolute inset-0 font-black tracking-tight blur-sm opacity-40 -z-10"
                                        :class="{
                                            'text-4xl text-orange-500': comboCount < 10,
                                            'text-5xl text-yellow-500': comboCount >= 10 && comboCount < 25,
                                            'text-6xl text-purple-500': comboCount >= 25
                                        }">
                                        {{ comboCount }}
                                    </div>

                                    <!-- 外发光效果 -->
                                    <div class="absolute inset-0 font-black tracking-tight blur-lg opacity-20 -z-20"
                                        :class="{
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
                                <div class="text-xl font-bold tracking-wider opacity-70 transform transition-all duration-300"
                                    :class="{
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
                    </div>

                    <!-- 单词显示区域 - 完全居中 -->
                    <div class="flex justify-center mb-8">
                        <div class="text-7xl md:text-8xl font-bold tracking-wider select-none flex items-center relative"
                            :class="{ 'animate-word-shake': errorMessage }">
                            <span v-for="(char, index) in currentWord.word" :key="index" :class="getCharClass(index)"
                                class="inline-block transition-all duration-300 ease-out transform hover:scale-110"
                                :style="getCharStyle(index)">
                                {{ char }}
                            </span>
                        </div>
                    </div>

                    <!-- 发音按钮 - 绝对定位到右上角 -->
                    <button @click="playPronunciation"
                        class="absolute top-4 right-4 md:right-8 p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 group shadow-lg"
                        title="播放发音">
                        <div class="i-ph-speaker-high text-2xl group-hover:animate-pulse text-coral-400"></div>
                    </button>
                    <!-- 音标 -->
                    <div v-if="currentWord.phonetic && !settings.dictationMode"
                        class="text-xl opacity-60 mb-6 font-mono tracking-wide">
                        {{ currentWord.phonetic }}
                    </div>

                    <!-- 释义 -->
                    <div v-if="settings.showTranslation && !settings.dictationMode"
                        class="text-2xl opacity-80 font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
                        {{ currentWord.translation }}
                    </div>
                </div>
                <!-- 隐藏的输入框用于捕获键盘输入 -->
                <input ref="inputRef" v-model="userInput" type="text" class="fixed opacity-0 pointer-events-none"
                    style="left: -9999px; top: -9999px;" @input="onInput" @keydown="onKeydown" :disabled="isPaused"
                    autocomplete="off" spellcheck="false">

                <!-- 实时统计信息 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-coral-500/30 transition-all duration-300 group">
                        <div
                            class="text-xl font-bold text-coral-500 group-hover:scale-105 transition-transform duration-200">
                            {{ formatTime(currentTime) }}</div>
                        <div class="text-sm opacity-60 font-medium">用时</div>
                    </div>

                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-lemon-500/30 transition-all duration-300 group">
                        <div
                            class="text-xl font-bold text-lemon-500 group-hover:scale-105 transition-transform duration-200">
                            {{ correctCount }}</div>
                        <div class="text-sm opacity-60 font-medium">正确数</div>
                    </div>

                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-electric-blue/30 transition-all duration-300 group">
                        <div
                            class="text-xl font-bold text-electric-blue group-hover:scale-105 transition-transform duration-200">
                            {{ currentWpm }}</div>
                        <div class="text-sm opacity-60 font-medium">WPM</div>
                    </div>

                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:border-cyber-pink/30 transition-all duration-300 group">
                        <div
                            class="text-xl font-bold text-cyber-pink group-hover:scale-105 transition-transform duration-200">
                            {{ accuracy }}%</div>
                        <div class="text-sm opacity-60 font-medium">正确率</div>
                    </div>
                </div>

                <!-- 提示信息 -->
                <div class="text-base opacity-70 mb-8 min-h-[3rem] flex items-center justify-center">
                    <div v-if="errorMessage"
                        class="text-red-800 font-semibold px-6 py-3 bg-gradient-to-r from-red-100/90 to-red-200/95 backdrop-blur-md rounded-xl border border-red-300/60 shadow-lg transition-all duration-300 ring-1 ring-red-300/40">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-sm shadow-red-500/50"></div>
                            <span class="text-sm font-medium text-red-900 drop-shadow-sm">{{ errorMessage }}</span>
                        </div>
                    </div>
                    <div v-else-if="successMessage"
                        class="text-green-800 font-semibold px-6 py-3 bg-gradient-to-r from-green-100/90 to-emerald-100/95 backdrop-blur-md rounded-xl border border-green-300/60 shadow-lg transition-all duration-300 ring-1 ring-green-300/40">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-green-600 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                            <span class="text-sm font-medium text-green-900 drop-shadow-sm">{{ successMessage }}</span>
                        </div>
                    </div>
                    <div v-else-if="!settings.dictationMode"
                        class="opacity-50 font-medium text-sm px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <div class="flex items-center gap-2">
                            <div class="w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                            <span>开始输入单词...</span>
                        </div>
                    </div>
                    <div v-else
                        class="opacity-50 font-medium text-sm px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <div class="flex items-center gap-2">
                            <div class="w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                            <span>听音输入单词...</span>
                        </div>
                    </div>
                </div>

                <!-- 单词进度指示器 -->
                <div class="flex flex-col items-center justify-center gap-4 mb-8">
                    <span
                        class="text-sm opacity-60 font-medium px-3 py-1 bg-white/10 rounded-full border border-white/20">
                        {{ currentWordIndex + 1 }} / {{ currentChapterWords.length }}
                    </span>
                    <div class="flex items-center justify-center gap-2 max-w-full overflow-x-auto px-4">
                        <div v-for="(_, index) in currentChapterWords" :key="index"
                            class="w-3 h-3 rounded-full transition-all duration-300 ease-out flex-shrink-0"
                            :class="index === currentWordIndex ? 'bg-coral-500 scale-150 shadow-lg shadow-coral-500/50 ring-2 ring-coral-500/30' :
                                index < currentWordIndex ? 'bg-green-400 shadow-sm scale-110' : 'bg-white/20 hover:bg-white/30'">
                        </div>
                    </div>
                </div>

                <!-- 快捷键提示 -->
                <div class="flex justify-center gap-4 text-xs opacity-40 font-medium flex-wrap">
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Tab</kbd>
                        跳过
                    </span>
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Esc</kbd>
                        暂停
                    </span>
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Alt+P</kbd>
                        发音
                    </span>
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Alt+S</kbd>
                        设置
                    </span>
                </div>
            </div>

            <!-- 章节完成界面 -->
            <div v-else-if="isCompleted" class="text-center">
                <div class="mb-8">
                    <div
                        class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-coral-500 to-lemon-500 rounded-full flex items-center justify-center">
                        <div class="i-ph-trophy text-white text-4xl"></div>
                    </div>

                    <h2 class="text-3xl font-bold mb-4">
                        {{ currentChapter >= availableChapters.length - 1 ? '全部完成！' : '章节完成！' }}
                    </h2>
                    <p class="text-lg opacity-80 mb-8">
                        {{ currentChapter >= availableChapters.length - 1
                            ? '恭喜！你已经完成了所有章节的练习'
                            : '太棒了！你和键盘简直是天作之合' }}
                    </p>
                </div>

                <!-- 统计信息 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div class="text-2xl font-bold text-coral-500">{{ formatTime(practiceTime) }}</div>
                        <div class="text-sm opacity-60">用时</div>
                    </div>

                    <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div class="text-2xl font-bold text-lemon-500">{{ correctCount }}</div>
                        <div class="text-sm opacity-60">正确数</div>
                    </div>

                    <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div class="text-2xl font-bold text-electric-blue">{{ wpm }}</div>
                        <div class="text-sm opacity-60">WPM</div>
                    </div>

                    <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div class="text-2xl font-bold text-cyber-pink">{{ accuracy }}%</div>
                        <div class="text-sm opacity-60">正确率</div>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button @click="startDictation"
                        class="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-medium text-lg hover:bg-white/20 transition-all duration-300">
                        开启默写，检验成果！
                    </button>

                    <button @click="nextChapter"
                        class="px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative">
                        {{ currentChapter >= availableChapters.length - 1 ? '重新开始第一章' : '再来一轮，状态正佳！' }}
                        <!-- Enter键提示 -->
                        <div
                            class="absolute -top-2 -right-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-mono border border-white/30">
                            Enter
                        </div>
                    </button>
                </div>

                <!-- 快捷键提示 -->
                <div class="mt-6 text-center">
                    <p class="text-sm opacity-60">
                        💡 按 <kbd class="px-2 py-1 bg-white/20 rounded border text-xs font-mono mx-1">Enter</kbd>
                        {{ currentChapter >= availableChapters.length - 1 ? '重新开始' : '进入下一章' }}
                    </p>
                </div>
            </div>

            <!-- 加载状态 -->
            <div v-else class="text-center py-16">
                <div
                    class="animate-spin w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4">
                </div>
                <p class="text-lg opacity-60">正在从词语的海洋里为你捞取单词...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDictionaryStore } from '@/stores/dictionary'
import { usePracticeStore } from '@/stores/practice'

// 路由
const router = useRouter()
const route = useRoute()

// 存储
const dictionaryStore = useDictionaryStore()
const practiceStore = usePracticeStore()

// 响应式数据
const inputRef = ref<HTMLInputElement>()
const showSettings = ref(false)
const isPaused = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const currentTime = ref(0)
const timeInterval = ref<number | null>(null)

// 新增功能相关状态
const comboCount = ref(0)
const showCombo = ref(false)
const comboTimeout = ref<number | null>(null)

// 新增设置相关状态
const availableChapters = computed(() => {
    if (!currentDictionary.value) return []

    const words = currentDictionary.value.words
    const chapters = []
    const wordsPerChapter = 20

    for (let i = 0; i < words.length; i += wordsPerChapter) {
        chapters.push(words.slice(i, i + wordsPerChapter))
    }

    return chapters
})

// 从 store 获取数据 (使用 storeToRefs 保持响应性)
const {
    currentDictionary,
    currentChapter,
    currentWordIndex,
    userInput,
    isCompleted,
    correctCount,
    totalCount,
    wpm,
    accuracy,
    settings,
    currentChapterWords,
    currentWord,
    progress,
    startTime,
    endTime
} = storeToRefs(practiceStore)

// 计算属性
const dictionaryName = computed(() => currentDictionary.value?.name || '词库加载中...')

const practiceTime = computed(() => {
    if (!startTime.value || !endTime.value) return 0
    return endTime.value - startTime.value
})

const currentWpm = computed(() => {
    if (!startTime.value || currentTime.value === 0 || totalCount.value === 0) return 0
    const minutes = currentTime.value / 60000
    return Math.round(totalCount.value / minutes)
})

// 字符样式函数
const getCharClass = (index: number) => {
    if (!userInput.value || index >= userInput.value.length) {
        return 'text-gray-400 dark:text-gray-500'
    }

    const userChar = userInput.value[index]
    const correctChar = currentWord.value?.word[index]

    if (userChar === correctChar) {
        return 'text-white bg-green-500 rounded-md px-1 shadow-lg'
    } else {
        return 'text-white bg-red-500 rounded-md px-1 animate-shake'
    }
}

const getCharStyle = (index: number) => {
    if (!userInput.value || index >= userInput.value.length) {
        return {}
    }

    const userChar = userInput.value[index]
    const correctChar = currentWord.value?.word[index]

    if (userChar === correctChar) {
        return {
            transform: 'scale(1.05)',
            textShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
        }
    } else {
        return {
            transform: 'scale(1.1)',
            textShadow: '0 0 10px rgba(248, 113, 113, 0.5)'
        }
    }
}

const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 事件处理函数
const onInput = () => {
    if (isPaused.value || !currentWord.value) return

    clearMessages()

    // 开始计时
    if (!startTime.value) {
        practiceStore.startPractice()
        startTimer()
    }

    // 限制输入长度不超过当前单词长度
    if (userInput.value.length > currentWord.value.word.length) {
        userInput.value = userInput.value.slice(0, currentWord.value.word.length)
        return
    }

    // 检查当前输入的字符是否正确
    if (userInput.value.length > 0) {
        const currentIndex = userInput.value.length - 1
        const currentChar = userInput.value[currentIndex]
        const expectedChar = currentWord.value.word[currentIndex]

        if (currentChar !== expectedChar) {
            // 根据练习模式处理错误
            if (settings.value.practiceMode === 'hardcore') {
                // 硬核模式：任何错误全部重来
                errorMessage.value = '💥 硬核模式：全部重来！'
                setTimeout(clearMessages, 800)
                practiceStore.resetChapter()
                resetCombo()
            } else if (settings.value.practiceMode === 'strict') {
                // 严格模式：单个字符错误重来
                errorMessage.value = '⚡ 严格模式：从头开始！'
                setTimeout(clearMessages, 800)
                userInput.value = ''
                resetCombo()
            } else {
                // 普通模式：允许退格修正，但标红错误字符
                errorMessage.value = '输入错误，请使用退格键修正'
                setTimeout(clearMessages, 1500)
                resetCombo()
            }
        } else {
            // 正确输入，检查是否完成单词
            if (userInput.value.length === currentWord.value.word.length) {
                // 单词完成，显示成功消息并自动跳转
                successMessage.value = '完美！'

                // 增加连击
                incrementCombo()

                setTimeout(() => {
                    clearMessages()
                    completeCurrentWord()
                }, 250)
            }
        }
    }
}

const completeCurrentWord = () => {
    if (!currentWord.value) return

    // 直接增加正确计数和总计数
    totalCount.value++
    correctCount.value++

    // 移动到下一个单词
    practiceStore.nextWord()

    // 自动播放下一个单词的发音
    if (settings.value.soundEnabled && currentWord.value) {
        setTimeout(() => {
            playPronunciation()
        }, 300)
    }
}

const onKeydown = (event: KeyboardEvent) => {
    if (isPaused.value) return

    // 阻止某些默认行为
    if (event.key === 'Tab' || event.key === 'Enter') {
        event.preventDefault()
    }

    // 处理回车键 - 章节完成时自动进入下一轮
    if (event.key === 'Enter' && isCompleted.value) {
        const isLastChapter = currentChapter.value >= availableChapters.value.length - 1
        if (isLastChapter) {
            // 最终章完成，可以选择重新开始或进入默写模式
            // 默认行为：重新开始第一章
            currentChapter.value = 0
            practiceStore.resetChapter()

            // 播放第一章第一个单词的发音
            nextTick(() => {
                setTimeout(() => {
                    if (settings.value.soundEnabled && currentWord.value) {
                        playPronunciation()
                    }
                }, 300)
            })
        } else {
            // 自动进入下一章
            nextChapter()
        }
        return
    }

    // 处理退格键
    if (event.key === 'Backspace') {
        if (settings.value.practiceMode === 'normal') {
            // 普通模式：允许退格修正
            clearMessages()
        } else if (settings.value.loopOnError && errorMessage.value) {
            // 严格模式下，在循环模式下，如果有错误，允许退格
            clearMessages()
        }
    }

    // 处理空格键 - 跳过当前单词
    if (event.key === ' ') {
        event.preventDefault()
        skipWord()
    }
}

const nextWord = () => {
    // Use store method to handle word progression
    practiceStore.nextWord()
}

const skipWord = () => {
    if (!currentWord.value) return

    // 使用 store 的 skipWord 方法来处理跳过逻辑
    practiceStore.skipWord()

    // 自动播放下一个单词的发音
    if (settings.value.soundEnabled && currentWord.value) {
        setTimeout(() => {
            playPronunciation()
        }, 300)
    }
}

const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
}

const togglePause = () => {
    isPaused.value = !isPaused.value
    if (!isPaused.value) {
        nextTick(() => {
            inputRef.value?.focus()
        })
    }
}

const playPronunciation = async () => {
    if (!currentWord.value || !settings.value.soundEnabled) return

    try {
        // 确保有足够的延迟让组件完全渲染
        await new Promise(resolve => setTimeout(resolve, 100))

        const url = practiceStore.getPronunciationUrl(currentWord.value.word)
        if (url) {
            const audio = new Audio(url)

            // 设置音频属性
            audio.preload = 'auto'
            audio.volume = 0.8

            // 等待音频加载完成
            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve, { once: true })
                audio.addEventListener('error', reject, { once: true })

                // 设置超时，避免无限等待
                setTimeout(() => reject(new Error('Audio load timeout')), 3000)
            })

            // 播放音频
            await audio.play()
        }
    } catch (error) {
        console.warn('发音播放失败:', error)
        // 可以在这里添加用户提示，但不要阻塞练习流程
    }
}

const nextChapter = () => {
    // 使用 store 的方法来处理章节切换
    practiceStore.nextChapter()

    nextTick(() => {
        inputRef.value?.focus()

        // 播放新章节第一个单词的发音
        setTimeout(() => {
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }, 300)
    })
}

const startDictation = () => {
    settings.value.dictationMode = true
    settings.value.showTranslation = false
    nextChapter()
}

const resetCurrentChapter = () => {
    // 重置当前章节的练习状态
    practiceStore.resetChapter()

    nextTick(() => {
        inputRef.value?.focus()

        // 播放重置后第一个单词的发音
        setTimeout(() => {
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }, 300)
    })
}

const randomizeChapter = () => {
    // 随机打乱当前章节的单词顺序
    practiceStore.shuffleCurrentChapter()

    nextTick(() => {
        inputRef.value?.focus()

        // 播放打乱后第一个单词的发音
        setTimeout(() => {
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }, 300)
    })
}

const onChapterChange = () => {
    // 章节切换时重置练习状态
    practiceStore.resetChapter()

    nextTick(() => {
        inputRef.value?.focus()

        // 播放新章节第一个单词的发音
        setTimeout(() => {
            if (settings.value.soundEnabled && currentWord.value) {
                playPronunciation()
            }
        }, 300)
    })
}

const focusInput = () => {
    if (inputRef.value && !isPaused.value && !showSettings.value) {
        inputRef.value.focus()
    }
}

const handlePageClick = (event: Event) => {
    // 检查点击的目标是否是选择器或其子元素
    const target = event.target as HTMLElement
    if (target.tagName === 'SELECT' || target.closest('select')) {
        return // 不处理选择器的点击事件
    }

    // 检查是否点击了设置面板或其子元素
    if (target.closest('.settings-panel') || showSettings.value) {
        return // 不处理设置面板内的点击事件
    }

    // 其他情况下聚焦输入框
    focusInput()
}

const goBack = () => {
    router.push('/')
}

const previousWord = () => {
    if (currentWordIndex.value > 0) {
        // 直接操作索引，但清空用户输入
        currentWordIndex.value--
        userInput.value = ''
        clearMessages()

        nextTick(() => {
            inputRef.value?.focus()
        })
    }
}

// 连击系统相关函数
const incrementCombo = () => {
    comboCount.value++
    showCombo.value = true

    // 清除之前的超时
    if (comboTimeout.value) {
        clearTimeout(comboTimeout.value)
    }

    // 设置动画效果
    setTimeout(() => {
        showCombo.value = false
    }, 500)

    // 特殊连击里程碑提示
    if (comboCount.value === 10) {
        successMessage.value = '🎉 连击 x10！状态火热！'
        setTimeout(clearMessages, 1500)
    } else if (comboCount.value === 25) {
        successMessage.value = '🔥 连击 x25！无人能挡！'
        setTimeout(clearMessages, 1500)
    } else if (comboCount.value === 50) {
        successMessage.value = '⚡ 连击 x50！键盘之神！'
        setTimeout(clearMessages, 1500)
    }
}

const resetCombo = () => {
    if (comboCount.value >= 3) {
        // 只有在有连击的情况下才显示中断消息
        errorMessage.value = `💔 连击中断！之前连击 x${comboCount.value}`
    }
    comboCount.value = 0
    showCombo.value = false

    if (comboTimeout.value) {
        clearTimeout(comboTimeout.value)
        comboTimeout.value = null
    }
}

// 启动实时计时器
const startTimer = () => {
    if (timeInterval.value) return

    timeInterval.value = setInterval(() => {
        if (startTime.value && !isPaused.value) {
            currentTime.value = Date.now() - startTime.value
        }
    }, 100) as unknown as number
}

// 停止计时器
const stopTimer = () => {
    if (timeInterval.value) {
        clearInterval(timeInterval.value)
        timeInterval.value = null
    }
}

// 键盘事件处理 - 重新设计的科学快捷键系统
const handleKeydown = (event: KeyboardEvent) => {
    // 防止在输入时触发快捷键（除了特殊键）
    const isInputFocused = event.target === inputRef.value
    const isSpecialKey = ['Escape', 'Tab'].includes(event.key)

    // 如果正在输入且不是特殊键，不处理快捷键
    if (isInputFocused && !isSpecialKey && !event.altKey) {
        return
    }

    // Esc键 - 暂停/继续或关闭设置
    if (event.key === 'Escape') {
        if (showSettings.value) {
            showSettings.value = false
        } else {
            togglePause()
        }
        event.preventDefault()
        return
    }

    // ==================== 新增代码段 开始 ====================
    // Enter键 - 在章节完成时进入下一章
    if (event.key === 'Enter' && isCompleted.value) {
        event.preventDefault(); // 阻止默认行为

        const isLastChapter = currentChapter.value >= availableChapters.value.length - 1;
        if (isLastChapter) {
            // 如果是最后一章，则重置到第一章
            currentChapter.value = 0;
            practiceStore.resetChapter();
        } else {
            // 否则，进入下一章
            nextChapter();
        }
        return; // 处理完毕，直接返回
    }
    // Tab键 - 跳过当前单词（替代空格键，避免与浏览器冲突）
    if (event.key === 'Tab' && !showSettings.value && !isPaused.value) {
        skipWord()
        event.preventDefault()
        return
    }

    // Alt + 字母键组合 - 避免与浏览器快捷键冲突
    if (event.altKey && !event.ctrlKey && !event.metaKey) {
        const key = event.key.toLowerCase()

        switch (key) {
            case 's':
                // Alt + S - 切换设置面板
                showSettings.value = !showSettings.value
                event.preventDefault()
                break

            case 'c':
                // Alt + C - 切换到下一章节
                if (!showSettings.value && availableChapters.value.length > 1) {
                    const nextChapterIndex = (currentChapter.value + 1) % availableChapters.value.length
                    currentChapter.value = nextChapterIndex
                    onChapterChange()
                }
                event.preventDefault()
                break

            case 'p':
                // Alt + P - 播放发音
                if (!showSettings.value && currentWord.value) {
                    playPronunciation()
                }
                event.preventDefault()
                break

            case 'r':
                // Alt + R - 重置当前章节
                if (!showSettings.value) {
                    resetCurrentChapter()
                }
                event.preventDefault()
                break

            case 'd':
                // Alt + D - 切换默写模式
                if (!showSettings.value) {
                    settings.value.dictationMode = !settings.value.dictationMode
                }
                event.preventDefault()
                break

            case 't':
                // Alt + T - 切换释义显示
                if (!showSettings.value) {
                    settings.value.showTranslation = !settings.value.showTranslation
                }
                event.preventDefault()
                break
        }
        return
    }

    // 确保输入框始终聚焦（仅在练习状态下）
    if (!isPaused.value && !showSettings.value && inputRef.value && document.activeElement !== inputRef.value) {
        // 延迟聚焦，避免干扰其他操作
        setTimeout(() => {
            if (!isPaused.value && !showSettings.value && inputRef.value) {
                inputRef.value.focus()
            }
        }, 50)
    }
}

onMounted(async () => {
    // 初始化词库数据
    dictionaryStore.initDictionaries()

    // 从路由参数获取词库ID
    const dictionaryId = route.params.id as string
    if (dictionaryId) {
        const dictionary = dictionaryStore.getDictionaryById(dictionaryId)
        if (dictionary) {
            practiceStore.setDictionary(dictionary)

            // 等待组件完全渲染后再播放第一个单词的发音
            await nextTick()
            setTimeout(() => {
                if (settings.value.soundEnabled && currentWord.value) {
                    playPronunciation()
                }
            }, 500) // 给足够的时间让组件完全加载
        } else {
            // 如果找不到词库，返回首页
            router.push('/')
            return
        }
    } else {
        // 如果没有词库ID，返回首页
        router.push('/')
        return
    }

    // 自动聚焦输入框
    nextTick(() => {
        inputRef.value?.focus()
    })

    // 添加键盘事件监听
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

@keyframes word-shake {

    0%,
    100% {
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-3px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(3px);
    }
}

@keyframes combo-pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

/* DMC风格连击动画 - 增强震撼感 */
@keyframes dmc-impact {
    0% {
        transform: scale(1) rotate(0deg);
    }

    15% {
        transform: scale(1.3) rotate(-2deg);
    }

    30% {
        transform: scale(0.9) rotate(1deg);
    }

    45% {
        transform: scale(1.15) rotate(-1deg);
    }

    60% {
        transform: scale(0.95) rotate(0.5deg);
    }

    80% {
        transform: scale(1.05) rotate(-0.5deg);
    }

    100% {
        transform: scale(1) rotate(0deg);
    }
}

@keyframes dmc-label {

    0%,
    100% {
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

    0%,
    100% {
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

    0%,
    100% {
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

    0%,
    100% {
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

    0%,
    100% {
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

    0%,
    100% {
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

    0%,
    100% {
        transform: translateX(0) translateY(0) rotate(0deg);
    }

    10% {
        transform: translateX(-3px) translateY(-2px) rotate(-1deg);
    }

    20% {
        transform: translateX(3px) translateY(2px) rotate(1deg);
    }

    30% {
        transform: translateX(-2px) translateY(-3px) rotate(-0.5deg);
    }

    40% {
        transform: translateX(2px) translateY(3px) rotate(0.5deg);
    }

    50% {
        transform: translateX(-1px) translateY(-1px) rotate(-0.3deg);
    }

    60% {
        transform: translateX(1px) translateY(1px) rotate(0.3deg);
    }

    70% {
        transform: translateX(-1px) translateY(0px) rotate(-0.2deg);
    }

    80% {
        transform: translateX(1px) translateY(0px) rotate(0.2deg);
    }

    90% {
        transform: translateX(0px) translateY(-1px) rotate(-0.1deg);
    }
}

@keyframes dmc-legendary-text {

    0%,
    100% {
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

.animate-shake {
    animation: shake 0.5s ease-in-out;
}

.animate-word-shake {
    animation: word-shake 0.6s ease-in-out;
    color: #ef4444 !important;
    text-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
}

.animate-dmc-impact {
    animation: dmc-impact 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-dmc-label {
    animation: dmc-label 2s ease-in-out infinite;
}

.animate-dmc-label-gold {
    animation: dmc-label-gold 1.8s ease-in-out infinite;
}

.animate-dmc-label-legendary {
    animation: dmc-label-legendary 2.5s ease-in-out infinite;
}

.animate-dmc-number {
    animation: dmc-number 2s ease-in-out infinite;
}

.animate-dmc-number-gold {
    animation: dmc-number-gold 1.8s ease-in-out infinite;
}

.animate-dmc-number-legendary {
    animation: dmc-number-legendary 2.2s ease-in-out infinite;
}

.animate-dmc-shake {
    animation: dmc-shake 0.2s ease-in-out;
}

.animate-dmc-legendary-text {
    animation: dmc-legendary-text 1.5s ease-in-out infinite;
}

.animate-dmc-shockwave {
    animation: dmc-shockwave 0.6s ease-out;
}

.animate-dmc-shockwave-delayed {
    animation: dmc-shockwave-delayed 0.8s ease-out 0.1s;
}

input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.rotate-90 {
    transform: rotate(90deg);
    transition: transform 0.3s ease;
}

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