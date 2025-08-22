<template>
    <div class="min-h-screen p-6" @click="handlePageClick">
        <!-- 头部导航和设置 -->
        <PracticeHeader :dictionary-name="dictionaryName" :current-chapter="practiceStore.currentChapter"
            :available-chapters="availableChapters" :show-settings="showSettings" :is-paused="isPaused"
            @go-back="goBack" @chapter-change="onChapterChange" @toggle-settings="toggleSettings"
            @toggle-pause="togglePause" />

        <!-- 设置面板 -->
        <SettingsPanel :show="showSettings" :settings="settings" @close="showSettings = false"
            @reset-chapter="practiceStore.resetPractice" @start-dictation="startDictation"
            @randomize-chapter="practiceStore.shuffleCurrentChapter" />

        <!-- 进度条 -->
        <div class="max-w-4xl mx-auto mb-8">
            <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-coral-500 to-lemon-500 transition-all duration-500 ease-out"
                    :style="{ width: `${progress}%` }"></div>
            </div>
        </div>

        <!-- 主练习区域 -->
        <PracticeView v-if="currentDictionary && !isCompleted" ref="practiceViewRef" />

        <!-- 章节完成界面 -->
        <CompletionReport v-else-if="isCompleted" :practice-time="practiceTime" :correct-count="correctCount" :wpm="wpm"
            :accuracy="accuracy" :is-last-chapter="currentChapter >= availableChapters.length - 1"
            @start-dictation="startDictation" @next-chapter="practiceStore.nextChapter" />

        <!-- 加载状态 -->
        <div v-else class="text-center py-16">
            <div class="animate-spin w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4">
            </div>
            <p class="text-lg opacity-60">正在从词语的海洋里为你捞取单词...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDictionaryStore } from '@/stores/dictionary'
import { usePracticeStore } from '@/stores/practice'
import { PRACTICE_CONFIG } from '@/core/PracticeConfig'

// Import components
import PracticeHeader from '@/components/PracticeHeader.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import PracticeView from '@/components/PracticeView.vue'
import CompletionReport from '@/components/CompletionReport.vue'

// Import composables
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useFocusManager } from '@/composables/useFocusManager'

// --- 核心初始化 ---
const router = useRouter()
const route = useRoute()
const dictionaryStore = useDictionaryStore()
const practiceStore = usePracticeStore()

// --- 响应式状态 ---
const {
    currentDictionary,
    isCompleted,
    progress,
    settings,
    startTime,
    endTime,
    correctCount,
    wpm,
    accuracy,
    currentChapter,
    availableChapters
} = storeToRefs(practiceStore)

const practiceViewRef = ref<InstanceType<typeof PracticeView> | null>(null)
const showSettings = ref(false)
const isPaused = ref(false)

// --- 焦点管理 ---
const { focusInput, handlePageClick } = useFocusManager(practiceViewRef, isPaused, showSettings)

// --- 计算属性 ---
const dictionaryName = computed(() => currentDictionary.value?.id || '词库加载中...')
const practiceTime = computed(() => (startTime.value && endTime.value) ? endTime.value - startTime.value : 0)

// --- 事件处理 ---
const goBack = () => router.push('/')
const toggleSettings = () => { showSettings.value = !showSettings.value }
const togglePause = () => {
    isPaused.value = !isPaused.value
    if (!isPaused.value) focusInput()
}
const onChapterChange = (chapter: string) => {
    practiceStore.currentChapter = parseInt(chapter, 10)
    practiceStore.resetPractice()
    nextTick(focusInput)
}
const startDictation = () => {
    settings.value.dictationMode = true
    settings.value.showTranslation = false
    practiceStore.nextChapter()
}

// --- 键盘快捷键 ---
useKeyboardShortcuts({
    onToggleSettings: toggleSettings,
    onTogglePause: togglePause,
    onSkipWord: () => practiceStore.skipWord(),
    onPlayPronunciation: () => practiceStore.playPronunciation(),
    onResetChapter: () => practiceStore.resetPractice(),
    onFocusInput: focusInput,
    onNextChapter: () => practiceStore.nextChapter(),
    onToggleDictation: () => { settings.value.dictationMode = !settings.value.dictationMode },
    onToggleTranslation: () => { settings.value.showTranslation = !settings.value.showTranslation }
}, () => ({
    isPaused: isPaused.value,
    isCompleted: isCompleted.value,
    showSettings: showSettings.value,
    availableChaptersLength: practiceStore.availableChapters.length,
    currentChapter: practiceStore.currentChapter
}))

// --- 生命周期钩子 ---
onMounted(async () => {
    await dictionaryStore.initDictionaries()
    const dictionaryId = route.params.id as string
    if (!dictionaryId) {
        router.push('/')
        return
    }
    const dict = await dictionaryStore.ensureDictionaryLoadedById(dictionaryId)
    if (dict) {
        practiceStore.setDictionary(dict)
        nextTick(() => {
            practiceStore.playPronunciation()
            focusInput()
        })
    } else {
        router.push('/')
    }
})
</script>