<template>
    <div class="min-h-screen p-6" @click="focusInput">
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

                <div class="flex items-center gap-2">
                    <!-- 设置展开按钮 -->
                    <button @click="showSettings = !showSettings"
                        class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        :class="{ 'bg-white/10': showSettings }" title="练习设置">
                        <div class="i-ph-gear text-xl" :class="{ 'rotate-90': showSettings }"></div>
                    </button>

                    <!-- 暂停按钮 -->
                    <button @click="togglePause"
                        class="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
                        {{ isPaused ? '继续' : '暂停' }}
                    </button>
                </div>
            </div>

            <!-- 设置区域 - 展开式 -->
            <div v-if="showSettings"
                class="mb-6 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- 发音设置 -->
                    <div class="space-y-3">
                        <label class="flex items-center gap-2 text-sm font-semibold">
                            <div class="i-ph-speaker-high text-lg text-coral-500"></div>
                            发音设置
                        </label>
                        <select v-model="settings.pronunciation"
                            class="w-full px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 focus:outline-none text-black text-sm font-medium transition-all duration-300 hover:bg-white/20 ">
                            <option value="us" class=" py-2">🇺🇸 美式英语</option>
                            <option value="uk" class=" py-2">🇬🇧 英式英语</option>
                        </select>
                    </div>
                    <!-- 显示设置 -->
                    <div class="space-y-3">
                        <label class="flex items-center gap-2 text-sm font-semibold">
                            <div class="i-ph-eye text-lg text-lemon-500"></div>
                            显示选项
                        </label>
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 text-sm cursor-pointer group">
                                <div class="relative">
                                    <input v-model="settings.showTranslation" type="checkbox"
                                        class="w-5 h-5 rounded-lg border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-coral-500 checked:to-coral-600 checked:border-coral-500 transition-all duration-300 focus:ring-2 focus:ring-coral-500/20">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                        </div>
                                    </div>
                                </div>
                                <span
                                    class="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">显示释义</span>
                            </label>
                            <label class="flex items-center gap-3 text-sm cursor-pointer group">
                                <div class="relative">
                                    <input v-model="settings.dictationMode" type="checkbox"
                                        class="w-5 h-5 rounded-lg border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-coral-500 checked:to-coral-600 checked:border-coral-500 transition-all duration-300 focus:ring-2 focus:ring-coral-500/20">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                        </div>
                                    </div>
                                </div>
                                <span
                                    class="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">默写模式</span>
                            </label>
                        </div>
                    </div>

                    <!-- 练习设置 -->
                    <div class="space-y-3">
                        <label class="flex items-center gap-2 text-sm font-semibold">
                            <div class="i-ph-gear text-lg text-electric-blue"></div>
                            练习选项
                        </label>
                        <div class="space-y-3">
                            <!-- 难度模式选择 -->
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-gray-700 dark:text-white/70">练习模式</label>
                                <select v-model="settings.practiceMode"
                                    class="w-full px-3 py-2 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:outline-none text-black text-xs font-medium transition-all duration-300 hover:bg-white/20">
                                    <option value="normal">🎯 普通模式 (允许退格修正)</option>
                                    <option value="strict">⚡ 严格模式 (一错重来)</option>
                                </select>
                            </div>

                            <label class="flex items-center gap-3 text-sm cursor-pointer group relative">
                                <div class="relative">
                                    <input v-model="settings.loopOnError" type="checkbox"
                                        class="w-5 h-5 rounded-lg border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-electric-blue checked:to-electric-blue/80 checked:border-electric-blue transition-all duration-300 focus:ring-2 focus:ring-electric-blue/20">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                        </div>
                                    </div>
                                </div>
                                <span
                                    class="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">错误时循环</span>
                                <button @click="showTooltip('loopOnError')" @mouseleave="hideTooltip"
                                    class="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
                                    <div class="i-ph-question text-sm text-white/60 hover:text-white/80"></div>
                                </button>
                                <!-- 工具提示 -->
                                <div v-if="tooltipVisible === 'loopOnError'"
                                    class="absolute left-0 top-8 z-20 w-64 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20 shadow-xl">
                                    开启后，若单词拼写错误，需重新完整输入该单词方可进入下一个
                                </div>
                            </label>

                            <label class="flex items-center gap-3 text-sm cursor-pointer group relative">
                                <div class="relative">
                                    <input v-model="settings.soundEnabled" type="checkbox"
                                        class="w-5 h-5 rounded-lg border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-electric-blue checked:to-electric-blue/80 checked:border-electric-blue transition-all duration-300 focus:ring-2 focus:ring-electric-blue/20">
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div
                                            class="i-ph-check text-white text-xs opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200">
                                        </div>
                                    </div>
                                </div>
                                <span
                                    class="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">发音提示</span>
                                <button @click="showTooltip('soundEnabled')" @mouseleave="hideTooltip"
                                    class="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
                                    <div class="i-ph-question text-sm text-white/60 hover:text-white/80"></div>
                                </button>
                                <!-- 工具提示 -->
                                <div v-if="tooltipVisible === 'soundEnabled'"
                                    class="absolute left-0 top-8 z-20 w-64 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg border border-white/20 shadow-xl">
                                    开启后，每个单词会自动播放发音，帮助学习正确读音
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- 快捷操作 -->
                    <div class="space-y-3">
                        <label class="flex items-center gap-2 text-sm font-semibold">
                            <div class="i-ph-lightning text-lg text-cyber-pink"></div>
                            快捷操作
                        </label>
                        <div class="space-y-3">
                            <button @click="resetCurrentChapter"
                                class="w-full px-4 py-3 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-gray-800 dark:text-white/80 hover:text-gray-900 dark:hover:text-white group">
                                <div class="flex items-center justify-center gap-2">
                                    <div
                                        class="i-ph-arrow-clockwise text-base group-hover:rotate-180 transition-transform duration-500">
                                    </div>
                                    重置章节
                                </div>
                            </button>
                            <button @click="startDictation"
                                class="w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-coral-500/20 to-coral-600/20 backdrop-blur-sm border border-coral-500/40 rounded-xl hover:from-coral-500/30 hover:to-coral-600/30 hover:border-coral-500/60 transition-all duration-300 text-coral-600 dark:text-coral-200 hover:text-coral-700 dark:hover:text-white group">
                                <div class="flex items-center justify-center gap-2">
                                    <div
                                        class="i-ph-pencil-simple text-base group-hover:scale-110 transition-transform duration-300">
                                    </div>
                                    开启默写
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 进度条 -->
            <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-coral-500 to-lemon-500 transition-all duration-500 ease-out"
                    :style="{ width: `${progress}%` }"></div>
            </div>
        </header>



        <!-- 主练习区域 -->
        <div class="max-w-4xl mx-auto mt-20 relative">
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
                    <div v-if="comboCount >= 3" class="absolute top-0 left-0 transform -translate-x-4 -translate-y-16 z-20">
                        <div class="relative select-none" :class="{
                            'animate-dmc-impact': showCombo
                        }">
                            <!-- COMBO 标签 -->
                            <div class="text-center mb-1">
                                <div class="text-sm font-black tracking-[0.2em] opacity-80 transform transition-all duration-300"
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
                                    <div class="font-black tracking-tight transform transition-all duration-200"
                                        :class="{
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
                                <div class="text-xs font-bold tracking-wider opacity-70 transform transition-all duration-300"
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
                                <div class="absolute inset-0 rounded-full border-2 animate-dmc-shockwave"
                                    :class="{
                                        'border-orange-400/30': comboCount < 10,
                                        'border-yellow-400/30': comboCount >= 10 && comboCount < 25,
                                        'border-purple-400/30': comboCount >= 25
                                    }"></div>
                                <div class="absolute inset-0 rounded-full border animate-dmc-shockwave-delayed"
                                    :class="{
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
                <div class="text-lg opacity-60 mb-8 min-h-[3rem] flex items-center justify-center">
                    <div v-if="errorMessage"
                        class="text-red-400 animate-bounce font-medium px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                        {{ errorMessage }}
                    </div>
                    <div v-else-if="successMessage"
                        class="text-green-400 animate-pulse font-medium px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                        {{ successMessage }}
                    </div>
                    <div v-else-if="!settings.dictationMode" class="opacity-40 font-medium">
                        开始输入单词...
                    </div>
                    <div v-else class="opacity-40 font-medium">
                        听音输入单词...
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
                <div class="flex justify-center gap-6 text-xs opacity-40 font-medium">
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20">Space</kbd>
                        跳过
                    </span>
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-white/10 rounded border border-white/20">Esc</kbd>
                        暂停
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

                    <h2 class="text-3xl font-bold mb-4">章节完成！</h2>
                    <p class="text-lg opacity-80 mb-8">太棒了！你和键盘简直是天作之合</p>
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
                    <button @click="nextChapter"
                        class="px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        再来一轮，状态正佳！
                    </button>

                    <button @click="startDictation"
                        class="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-medium text-lg hover:bg-white/20 transition-all duration-300">
                        开启默写，检验成果！
                    </button>
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
const tooltipVisible = ref<string>('')

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
            if (settings.value.practiceMode === 'strict') {
                // 严格模式：一错重来
                errorMessage.value = '哎呀，手指打滑了~ 从头开始！'
                setTimeout(clearMessages, 800)
                userInput.value = ''
                // 重置连击
                resetCombo()
            } else {
                // 普通模式：允许退格修正，但标红错误字符
                errorMessage.value = '输入错误，请使用退格键修正'
                setTimeout(clearMessages, 1500)
                // 重置连击
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
                }, 200)
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

const toggleTheme = () => {
    // 简单的主题切换逻辑
    document.documentElement.classList.toggle('dark')
}

const playPronunciation = () => {
    if (currentWord.value) {
        practiceStore.playPronunciation(currentWord.value.word)
    }
}

const nextChapter = () => {
    // 使用 store 的方法来处理章节切换
    practiceStore.nextChapter()

    nextTick(() => {
        inputRef.value?.focus()
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
    })
}

const focusInput = () => {
    if (inputRef.value && !isPaused.value && !showSettings.value) {
        inputRef.value.focus()
    }
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

// 工具提示相关函数
const showTooltip = (key: string) => {
    tooltipVisible.value = key
}

const hideTooltip = () => {
    tooltipVisible.value = ''
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

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        if (showSettings.value) {
            showSettings.value = false
        } else {
            togglePause()
        }
    }

    // 确保输入框始终聚焦
    if (!isPaused.value && !showSettings.value && inputRef.value && document.activeElement !== inputRef.value) {
        inputRef.value.focus()
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
    0%, 100% {
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
</style>