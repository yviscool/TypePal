<template>
  <div class="min-h-screen p-6">
    <!-- 头部导航 -->
    <header class="max-w-6xl mx-auto mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="$router.push('/')" class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200">
            <div class="i-ph-arrow-left text-xl"></div>
          </button>
          <h1 class="text-3xl font-bold">词语宇宙</h1>
        </div>

        <button @click="themeStore.toggleTheme()"
          class="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
          <div class="i-carbon-sun dark:i-carbon-moon text-xl"></div>
        </button>
      </div>

      <p class="text-lg opacity-80 mt-2">发现适合你的练习词库，开启打字之旅</p>
    </header>

    <!-- 搜索和筛选 -->
    <div class="max-w-6xl mx-auto mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <div class="absolute z-[100] left-3 top-1/2 transform -translate-y-1/2 i-ph-magnifying-glass text-xl opacity-50">
          </div>
          <input v-model="searchQuery" type="text" placeholder="搜索词库名称、描述或标签..."
            class="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 focus:border-coral-500 focus:outline-none transition-colors duration-200">
        </div>

      </div>
    </div>

    <!-- 分类与标签筛选 -->
    <div class="max-w-6xl mx-auto mb-6">
      <!-- 大分类 Tab -->
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <button
          :class="['px-3 py-1.5 rounded-full text-sm border', activeCategory === '' ? 'bg-coral-500 text-white border-coral-500 shadow-md' : 'bg-white/10 border-white/20 hover:bg-white/20']"
          @click="setActiveCategory('')">
          <span class="inline-flex items-center gap-1">
            <div :class="getCategoryTabIcon('全部')" class="text-base"></div>
            <span>全部</span>
          </span>
        </button>
        <button v-for="cat in categories" :key="cat"
          :class="['px-3 py-1.5 rounded-full text-sm border', activeCategory === cat ? 'bg-coral-500 text-white border-coral-500 shadow-md' : 'bg-white/10 border-white/20 hover:bg-white/20']"
          @click="setActiveCategory(cat)">
          <span class="inline-flex items-center gap-1">
            <div :class="getCategoryTabIcon(cat)" class="text-base"></div>
            <span>{{ cat }}</span>
          </span>
        </button>
      </div>

      <!-- 小分类与标签 Chips（选择具体大分类后展示） -->
      <div v-if="activeCategory" class="flex flex-wrap items-center gap-2">
        <button
          :class="['px-3 py-1.5 rounded-full text-xs border', selectedSubcategory === '' ? 'bg-coral-500 text-white border-coral-500 shadow' : 'bg-white/10 border-white/20 hover:bg-white/20']"
          @click="selectedSubcategory = ''">
          全部{{ activeCategory }}
        </button>
        <button v-for="sub in subcategories" :key="sub"
          :class="['px-3 py-1.5 rounded-full text-xs border', selectedSubcategory === sub ? 'bg-coral-500 text-white border-coral-500 shadow' : 'bg-white/10 border-white/20 hover:bg-white/20']"
          @click="toggleSubcategory(sub)">
          {{ sub }}
        </button>

        <span class="opacity-50 mx-2">|</span>

        <button v-for="tag in availableTags" :key="tag"
          :class="['px-3 py-1.5 rounded-full text-xs border', selectedTags.includes(tag) ? 'bg-coral-500 text-white border-coral-500 shadow' : 'bg-white/10 border-white/20 hover:bg-white/20']"
          @click="toggleTag(tag)">
          #{{ tag }}
        </button>
      </div>
      <div v-if="activeCategory && (selectedSubcategory || selectedTags.length)" class="mt-2 text-xs opacity-80 flex flex-wrap items-center gap-2">
        <span v-if="selectedSubcategory">已选小分类：<span class="font-medium text-coral-500">{{ selectedSubcategory }}</span></span>
        <span v-if="selectedTags.length">已选标签：<span class="font-medium text-coral-500">{{ selectedTags.join('、') }}</span></span>
        <button class="px-2 py-1 rounded bg-white/10 border border-white/20 hover:bg-white/20" @click="clearFilters">清除筛选</button>
      </div>
    </div>

    <!-- 词库网格 -->
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 词库卡片 -->
        <div v-for="dictionary in filteredDictionaries" :key="dictionary.id"
          class="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-coral-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
          @click="startPractice(dictionary)">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-500 to-lemon-500 flex items-center justify-center">
                <div :class="getCategoryIcon(dictionary.category)" class="text-white text-xl"></div>
              </div>
              <div>
                <h3 class="text-lg font-semibold group-hover:text-coral-500 transition-colors duration-200">
                  {{ dictionary.name }}
                </h3>
                <span class="text-sm opacity-60">
                  {{ dictionary.category }}<template v-if="dictionary.subcategory"> · {{ dictionary.subcategory }}</template><template v-if="dictionary.edition"> · {{ dictionary.edition }}</template>
                </span>
              </div>
            </div>

            <div class="text-sm opacity-60">
              {{ dictionary.wordCount }} 词
            </div>
          </div>

          <p class="text-sm opacity-80 mb-4 line-clamp-2">
            {{ dictionary.description }}
          </p>

          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in dictionary.tags.slice(0, 3)" :key="tag"
              class="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/20">
              {{ tag }}
            </span>
            <span v-if="dictionary.tags.length > 3"
              class="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/20">
              +{{ dictionary.tags.length - 3 }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm opacity-60">
              <div class="i-ph-globe"></div>
              {{ getLanguageName(dictionary.language) }}
            </div>

            <button
              class="px-4 py-2 bg-coral-500 text-white rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              开始练习
            </button>
          </div>
        </div>

        <!-- 贡献新词库卡片 -->
        <div
          class="group p-6 rounded-2xl bg-gradient-to-br from-coral-500/20 to-lemon-500/20 border-2 border-dashed border-coral-500/50 hover:border-coral-500 transition-all duration-300 cursor-pointer transform hover:scale-105 flex flex-col items-center justify-center text-center min-h-[280px]">
          <div
            class="w-16 h-16 rounded-full bg-gradient-to-br from-coral-500 to-lemon-500 flex items-center justify-center mb-4 group-hover:animate-pulse">
            <div class="i-ph-plus text-white text-2xl"></div>
          </div>

          <h3 class="text-lg font-semibold mb-2">共建词语宇宙</h3>
          <p class="text-sm opacity-80 mb-4">
            有好的词库想要分享？<br>
            欢迎投喂新词库！
          </p>

          <button
            class="px-4 py-2 bg-gradient-to-r from-coral-500 to-lemon-500 text-white rounded-lg text-sm font-medium">
            贡献词库
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredDictionaries.length === 0" class="text-center py-16">
        <div class="i-ph-magnifying-glass text-6xl opacity-30 mb-4"></div>
        <h3 class="text-xl font-semibold mb-2">没有找到匹配的词库</h3>
        <p class="text-sm opacity-60">试试调整搜索条件或选择其他分类</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useDictionaryStore } from '@/stores/dictionary'
import type { DictionaryMeta } from '@/types/dictionary'

const router = useRouter()
const themeStore = useThemeStore()
const dictionaryStore = useDictionaryStore()

const searchQuery = ref('')
const activeCategory = ref('')
const selectedSubcategory = ref('')
const selectedTags = ref<string[]>([])

const subcategories = computed(() => {
  if (!activeCategory.value) return []
  const set = new Set<string>()
  dictionaryStore.dictionaries.forEach(d => {
    if (d.category === activeCategory.value && d.subcategory) {
      set.add(d.subcategory)
    }
  })
  return Array.from(set)
})

const availableTags = computed(() => {
  if (!activeCategory.value) return []
  const set = new Set<string>()
  dictionaryStore.dictionaries.forEach(d => {
    if (d.category === activeCategory.value && d.tags) {
      d.tags.forEach(t => set.add(t))
    }
  })
  return Array.from(set).slice(0, 12)
})

const setActiveCategory = (cat: string) => {
  activeCategory.value = cat
  selectedSubcategory.value = ''
  selectedTags.value = []
}
const toggleSubcategory = (sub: string) => {
  selectedSubcategory.value = selectedSubcategory.value === sub ? '' : sub
}
const toggleTag = (tag: string) => {
  const i = selectedTags.value.indexOf(tag)
  if (i === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(i, 1)
}

const clearFilters = () => {
  selectedSubcategory.value = ''
  selectedTags.value = []
}

const categories = computed(() => {
  const cats = new Set(dictionaryStore.dictionaries.map(dict => dict.category))
  return Array.from(cats)
})

const filteredDictionaries = computed(() => {
  let list = dictionaryStore.dictionaries

  if (searchQuery.value) {
    list = dictionaryStore.searchDictionaries(searchQuery.value)
  }

  if (activeCategory.value) {
    list = list.filter(d => d.category === activeCategory.value)
  }

  if (selectedSubcategory.value) {
    list = list.filter(d => d.subcategory === selectedSubcategory.value)
  }

  if (selectedTags.value.length > 0) {
    list = list.filter(d => {
      const tags = d.tags || []
      return selectedTags.value.some(t => tags.includes(t))
    })
  }

  return list
})

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    '编程': 'i-ph-code',
    '英语': 'i-ph-translate',
    '英语考试': 'i-ph-graduation-cap',
    '生活常用': 'i-ph-house',
    '商务英语': 'i-ph-briefcase',
    '旅行': 'i-ph-airplane'
  }
  return iconMap[category] || 'i-ph-book'
}

const getCategoryTabIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    '全部': 'i-ph-books',
    '编程': 'i-ph-code',
    '英语': 'i-ph-translate',
    '日语': 'i-ph-flag',
    '德语': 'i-ph-flag',
    '印尼语': 'i-ph-flag',
    '哈萨克语': 'i-ph-flag',
    '法语': 'i-ph-flag',
    '西班牙语': 'i-ph-flag',
    '俄语': 'i-ph-flag',
    '阿拉伯语': 'i-ph-flag',
    '韩语': 'i-ph-flag'
  }
  return iconMap[category] || 'i-ph-book'
}

const getLanguageName = (lang: string) => {
  const langMap: Record<string, string> = {
    'en': '英语',
    'zh': '中文',
    'ja': '日语',
    'de': '德语',
    'fr': '法语',
    'es': '西班牙语',
    'ru': '俄语',
    'ar': '阿拉伯语',
    'ko': '韩语',
    'id': '印尼语',
    'kk': '哈萨克语'
  }
  return langMap[lang] || lang
}

const startPractice = (dictionary: DictionaryMeta) => {
  router.push({ name: 'Practice', params: { id: dictionary.id } })
}

onMounted(() => {
  themeStore.initTheme()
  dictionaryStore.initDictionaries()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>