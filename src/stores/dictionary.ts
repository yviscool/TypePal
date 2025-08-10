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
        { word: 'algorithm', translation: '算法', phonetic: '/ˈælɡərɪðəm/', category: '编程', tags: ['algorithm'] },
        { word: 'function', translation: '函数', phonetic: '/ˈfʌŋkʃən/', category: '编程', tags: ['function'] },
        { word: 'variable', translation: '变量', phonetic: '/ˈvɛriəbəl/', category: '编程', tags: ['variable'] },
        { word: 'array', translation: '数组', phonetic: '/əˈreɪ/', category: '编程', tags: ['data-structure'] },
        { word: 'object', translation: '对象', phonetic: '/ˈɒbdʒɪkt/', category: '编程', tags: ['oop'] },
        { word: 'class', translation: '类', phonetic: '/klæs/', category: '编程', tags: ['oop'] },
        { word: 'method', translation: '方法', phonetic: '/ˈmeθəd/', category: '编程', tags: ['oop'] },
        { word: 'interface', translation: '接口', phonetic: '/ˈɪntəfeɪs/', category: '编程', tags: ['oop'] },
        { word: 'inheritance', translation: '继承', phonetic: '/ɪnˈherɪtəns/', category: '编程', tags: ['oop'] },
        { word: 'polymorphism', translation: '多态', phonetic: '/ˌpɒlɪˈmɔːfɪzəm/', category: '编程', tags: ['oop'] },
        { word: 'encapsulation', translation: '封装', phonetic: '/ɪnˌkæpsjʊˈleɪʃən/', category: '编程', tags: ['oop'] },
        { word: 'abstraction', translation: '抽象', phonetic: '/æbˈstrækʃən/', category: '编程', tags: ['oop'] },
        { word: 'database', translation: '数据库', phonetic: '/ˈdeɪtəbeɪs/', category: '编程', tags: ['database'] },
        { word: 'query', translation: '查询', phonetic: '/ˈkwɪəri/', category: '编程', tags: ['database'] },
        { word: 'index', translation: '索引', phonetic: '/ˈɪndeks/', category: '编程', tags: ['database'] },
        { word: 'framework', translation: '框架', phonetic: '/ˈfreɪmwɜːk/', category: '编程', tags: ['framework'] },
        { word: 'library', translation: '库', phonetic: '/ˈlaɪbrəri/', category: '编程', tags: ['library'] },
        { word: 'module', translation: '模块', phonetic: '/ˈmɒdjuːl/', category: '编程', tags: ['module'] },
        { word: 'component', translation: '组件', phonetic: '/kəmˈpoʊnənt/', category: '编程', tags: ['component'] },
        { word: 'repository', translation: '仓库', phonetic: '/rɪˈpɒzɪtəri/', category: '编程', tags: ['git'] }
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