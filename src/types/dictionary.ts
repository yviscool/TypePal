/**
 * 词库清单与按需加载的统一类型定义
 * 注意：此文件仅定义类型，不依赖具体 Store，避免循环依赖。
 */

/** 支持的语言 */
export type SupportedLanguage = 'en' | 'zh' | 'ja' | 'de' | 'id' | 'hapin' | 'kk'

/** 大分类（示例：编程、英语等）。不做枚举以便后续扩展与从数据驱动。 */
export type Category = string

/** 小分类（示例：通用、Python、小学、中学、大学、考研 等） */
export type Subcategory = string

/** 版本/教材（示例：人教版、苏教版、译林版 等） */
export type Edition = string

/** 单词结构（用于数据文件 payload 的基础结构）。为避免与现有 store 类型冲突，这里单独给出定义。 */
export interface DictWord {
  word: string
  translation: string
  phonetic?: string
  /** 可选：细分词内分类 */
  category?: string
  /** 可选：标签 */
  tags?: string[]
}

/**
 * 词库元数据（仅用于列表/搜索/筛选与延迟加载的入口）
 * 注意：不包含具体 words，避免首屏加载过大。
 */
export interface DictionaryMeta {
  id: string                // 唯一ID
  name: string              // 词库名称
  description: string       // 词库描述
  category: Category        // 大分类（UI仅显式此层）
  subcategory?: Subcategory // 小分类
  edition?: Edition         // 版本/教材（可选）
  tags: string[]            // 标签
  language: SupportedLanguage
  wordCount: number         // 词数（用于卡片展示，避免读取 words.length）
  dataPath: string          // 数据文件路径（public 下），例如：/dictionaries/english/primary/ryb.json
}

/**
 * 词库数据载荷（进入 Practice 时再按需拉取）
 * 可按需扩展，如未来做分块加载：blocks?: string[]
 */
export interface DictionaryPayload {
  id: string
  language: SupportedLanguage
  words: DictWord[]
}

/** manifest 根结构 */
export interface DictionaryManifest {
  schemaVersion: number
  generatedAt?: string
  dictionaries: DictionaryMeta[]
}