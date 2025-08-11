import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Dictionary } from './practice'

export const useDictionaryStore = defineStore('dictionary', () => {
  const dictionaries = ref<Dictionary[]>([])
  const loading = ref(false)

  // 示例词库数据
  const sampleDictionaries: Dictionary[] = [
    {
      id: 'coder-dict',
      name: 'Coder Dict',
      description: '程序员必备英语词汇，涵盖编程、算法、数据结构等核心概念',
      category: '编程',
      tags: ['code', 'programming', 'tech'],
      language: 'en',
      words: [
        { word: 'cat', translation: '猫', phonetic: '/kæt/', category: '动物', tags: ['animal'] },
        { word: 'dog', translation: '狗', phonetic: '/dɔːɡ/', category: '动物', tags: ['animal'] },
        { word: 'book', translation: '书', phonetic: '/bʊk/', category: '物品', tags: ['object'] },
        { word: 'pen', translation: '笔', phonetic: '/pen/', category: '物品', tags: ['object'] },
        { word: 'car', translation: '汽车', phonetic: '/kɑːr/', category: '交通', tags: ['transport'] },
        { word: 'house', translation: '房子', phonetic: '/haʊs/', category: '建筑', tags: ['building'] },
        { word: 'water', translation: '水', phonetic: '/ˈwɔːtər/', category: '自然', tags: ['nature'] },
        { word: 'food', translation: '食物', phonetic: '/fuːd/', category: '食物', tags: ['food'] },
        { word: 'apple', translation: '苹果', phonetic: '/ˈæpəl/', category: '食物', tags: ['fruit'] },
        { word: 'tree', translation: '树', phonetic: '/triː/', category: '自然', tags: ['nature'] },
        { word: 'sun', translation: '太阳', phonetic: '/sʌn/', category: '自然', tags: ['nature'] },
        { word: 'moon', translation: '月亮', phonetic: '/muːn/', category: '自然', tags: ['nature'] },
        { word: 'red', translation: '红色', phonetic: '/red/', category: '颜色', tags: ['color'] },
        { word: 'blue', translation: '蓝色', phonetic: '/bluː/', category: '颜色', tags: ['color'] },
        { word: 'green', translation: '绿色', phonetic: '/ɡriːn/', category: '颜色', tags: ['color'] },
        { word: 'big', translation: '大的', phonetic: '/bɪɡ/', category: '形容词', tags: ['adjective'] },
        { word: 'small', translation: '小的', phonetic: '/smɔːl/', category: '形容词', tags: ['adjective'] },
        { word: 'good', translation: '好的', phonetic: '/ɡʊd/', category: '形容词', tags: ['adjective'] },
        { word: 'bad', translation: '坏的', phonetic: '/bæd/', category: '形容词', tags: ['adjective'] },
        { word: 'happy', translation: '快乐的', phonetic: '/ˈhæpi/', category: '形容词', tags: ['emotion'] },
        { word: 'sad', translation: '悲伤的', phonetic: '/sæd/', category: '形容词', tags: ['emotion'] },
        { word: 'run', translation: '跑', phonetic: '/rʌn/', category: '动词', tags: ['verb'] },
        { word: 'walk', translation: '走', phonetic: '/wɔːk/', category: '动词', tags: ['verb'] },
        { word: 'eat', translation: '吃', phonetic: '/iːt/', category: '动词', tags: ['verb'] },
        { word: 'drink', translation: '喝', phonetic: '/drɪŋk/', category: '动词', tags: ['verb'] },
        { word: 'sleep', translation: '睡觉', phonetic: '/sliːp/', category: '动词', tags: ['verb'] },
        { word: 'work', translation: '工作', phonetic: '/wɜːrk/', category: '动词', tags: ['verb'] },
        { word: 'play', translation: '玩', phonetic: '/pleɪ/', category: '动词', tags: ['verb'] },
        { word: 'love', translation: '爱', phonetic: '/lʌv/', category: '动词', tags: ['emotion'] },
        { word: 'like', translation: '喜欢', phonetic: '/laɪk/', category: '动词', tags: ['emotion'] },
        { word: 'one', translation: '一', phonetic: '/wʌn/', category: '数字', tags: ['number'] },
        { word: 'two', translation: '二', phonetic: '/tuː/', category: '数字', tags: ['number'] },
        { word: 'three', translation: '三', phonetic: '/θriː/', category: '数字', tags: ['number'] },
        { word: 'four', translation: '四', phonetic: '/fɔːr/', category: '数字', tags: ['number'] },
        { word: 'five', translation: '五', phonetic: '/faɪv/', category: '数字', tags: ['number'] },
        { word: 'yes', translation: '是的', phonetic: '/jes/', category: '常用词', tags: ['common'] },
        { word: 'no', translation: '不', phonetic: '/noʊ/', category: '常用词', tags: ['common'] },
        { word: 'hello', translation: '你好', phonetic: '/həˈloʊ/', category: '问候', tags: ['greeting'] },
        { word: 'goodbye', translation: '再见', phonetic: '/ɡʊdˈbaɪ/', category: '问候', tags: ['greeting'] },
        { word: 'thank', translation: '谢谢', phonetic: '/θæŋk/', category: '礼貌', tags: ['polite'] }
      ]
    },
    {
      id: 'exam-words',
      name: '考研核心词汇',
      description: '考研英语高频词汇，助你轻松应对考试',
      category: '英语考试',
      tags: ['考研', 'exam', 'academic'],
      language: 'en',
      words: [
        { word: 'abandon', translation: '放弃，抛弃', phonetic: '/əˈbændən/', category: '考研', tags: ['verb'] },
        { word: 'ability', translation: '能力，才能', phonetic: '/əˈbɪləti/', category: '考研', tags: ['noun'] },
        { word: 'absolute', translation: '绝对的，完全的', phonetic: '/ˈæbsəluːt/', category: '考研', tags: ['adjective'] },
        { word: 'abstract', translation: '抽象的，摘要', phonetic: '/ˈæbstrækt/', category: '考研', tags: ['adjective'] },
        { word: 'academic', translation: '学术的，理论的', phonetic: '/ˌækəˈdemɪk/', category: '考研', tags: ['adjective'] },
        { word: 'accept', translation: '接受，承认', phonetic: '/əkˈsept/', category: '考研', tags: ['verb'] },
        { word: 'access', translation: '接近，通道', phonetic: '/ˈækses/', category: '考研', tags: ['noun'] },
        { word: 'accident', translation: '事故，意外', phonetic: '/ˈæksɪdənt/', category: '考研', tags: ['noun'] },
        { word: 'accompany', translation: '陪伴，伴随', phonetic: '/əˈkʌmpəni/', category: '考研', tags: ['verb'] },
        { word: 'accomplish', translation: '完成，实现', phonetic: '/əˈkʌmplɪʃ/', category: '考研', tags: ['verb'] },
        { word: 'account', translation: '账户，解释', phonetic: '/əˈkaʊnt/', category: '考研', tags: ['noun'] },
        { word: 'accurate', translation: '准确的，精确的', phonetic: '/ˈækjərət/', category: '考研', tags: ['adjective'] },
        { word: 'achieve', translation: '达到，完成', phonetic: '/əˈtʃiːv/', category: '考研', tags: ['verb'] },
        { word: 'acquire', translation: '获得，学到', phonetic: '/əˈkwaɪər/', category: '考研', tags: ['verb'] },
        { word: 'action', translation: '行动，作用', phonetic: '/ˈækʃən/', category: '考研', tags: ['noun'] },
        { word: 'active', translation: '积极的，主动的', phonetic: '/ˈæktɪv/', category: '考研', tags: ['adjective'] },
        { word: 'actual', translation: '实际的，真实的', phonetic: '/ˈæktʃuəl/', category: '考研', tags: ['adjective'] },
        { word: 'adapt', translation: '适应，改编', phonetic: '/əˈdæpt/', category: '考研', tags: ['verb'] },
        { word: 'addition', translation: '加法，增加', phonetic: '/əˈdɪʃən/', category: '考研', tags: ['noun'] },
        { word: 'adequate', translation: '充足的，适当的', phonetic: '/ˈædɪkwət/', category: '考研', tags: ['adjective'] }
      ]
    }
  ]

  const initDictionaries = () => {
    dictionaries.value = sampleDictionaries
  }

  const getDictionaryById = (id: string) => {
    return dictionaries.value.find(dict => dict.id === id)
  }

  const getDictionariesByCategory = (category: string) => {
    return dictionaries.value.filter(dict => dict.category === category)
  }

  const searchDictionaries = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return dictionaries.value.filter(dict => 
      dict.name.toLowerCase().includes(lowerQuery) ||
      dict.description.toLowerCase().includes(lowerQuery) ||
      dict.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  return {
    dictionaries,
    loading,
    initDictionaries,
    getDictionaryById,
    getDictionariesByCategory,
    searchDictionaries
  }
})