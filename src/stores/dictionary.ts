import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Dictionary as PracticeDictionary, Word as PracticeWord } from './practice'
import type { DictionaryMeta, DictionaryManifest, DictionaryPayload } from '@/types/dictionary'

export const useDictionaryStore = defineStore('dictionary', () => {
  // 词库清单（仅元数据）
  const dictionaries = ref<DictionaryMeta[]>([])
  // 加载状态与错误
  const loading = ref(false)
  const error = ref<string | null>(null)
  // 已加载词表缓存（避免重复请求）
  const cache = ref<Map<string, PracticeDictionary>>(new Map())

  // 初始化：拉取 manifest 清单（首屏仅加载元数据，不加载词表）
  const initDictionaries = async () => {
    if (dictionaries.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/dictionaries/manifest.json', { cache: 'no-cache' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const manifest = (await res.json()) as DictionaryManifest
      dictionaries.value = manifest.dictionaries || []
    } catch (e: any) {
      error.value = e?.message || '加载清单失败'
      console.error('initDictionaries error:', e)
    } finally {
      loading.value = false
    }
  }

  // 获取已加载的完整词库（若未加载则返回 undefined）
  const getDictionaryById = (id: string) => cache.value.get(id)

  // 获取元数据
  const getMetaById = (id: string) => dictionaries.value.find(m => m.id === id)

  // 按大分类筛选（基于元数据）
  const getDictionariesByCategory = (category: string) =>
    dictionaries.value.filter(m => m.category === category)

  // 搜索（基于元数据，不触发词表加载）
  const searchDictionaries = (query: string) => {
    const q = query.trim().toLowerCase()
    if (!q) return dictionaries.value
    return dictionaries.value.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      (m.subcategory?.toLowerCase().includes(q) ?? false) ||
      (m.edition?.toLowerCase().includes(q) ?? false) ||
      m.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  // 确保词库已加载：若未加载则按 dataPath 拉取词表并转换为 PracticeDictionary
  const ensureDictionaryLoadedById = async (id: string): Promise<PracticeDictionary | null> => {
    const cached = cache.value.get(id)
    if (cached) return cached

    const meta = getMetaById(id)
    if (!meta) return null

    loading.value = true
    error.value = null
    try {
      const res = await fetch(meta.dataPath, { cache: 'force-cache' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload = (await res.json()) as DictionaryPayload

      const words: PracticeWord[] = (payload.words || []).map(w => ({
        word: w.word,
        translation: w.translation,
        phonetic: w.phonetic,
        // 优先使用词内分类，其次使用小分类/大分类作为回退
        category: w.category ?? meta.subcategory ?? meta.category,
        tags: w.tags ?? meta.tags ?? []
      }))

      const dict: PracticeDictionary = {
        id: meta.id,
        name: meta.name,
        description: meta.description,
        category: meta.category,
        tags: meta.tags,
        language: meta.language,
        words
      }

      cache.value.set(id, dict)
      return dict
    } catch (e: any) {
      error.value = e?.message || '加载词表失败'
      console.error('ensureDictionaryLoadedById error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // 列表（元数据）
    dictionaries,
    loading,
    error,
    // 初始化与查询
    initDictionaries,
    getMetaById,
    getDictionariesByCategory,
    searchDictionaries,
    // 词表加载与获取
    ensureDictionaryLoadedById,
    getDictionaryById
  }
})