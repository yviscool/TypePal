/**
 * 重构后的输入处理器 - 单一职责：处理用户输入事件
 * 移除了消息管理、状态更新等职责，专注于输入验证和事件分发
 */
import { ref } from 'vue'
import { PracticeEngine, type InputResult } from '@/core/PracticeEngine'
import { MessageSystem } from '@/core/MessageSystem'
import { PRACTICE_CONFIG, type PracticeMode } from '@/core/PracticeConfig'

export interface InputHandlers {
  onComboIncrement: () => void
  onComboReset: () => void
  onStartTimer: () => void
  onWordComplete?: () => void
}

export function usePracticeInput(
  engine: PracticeEngine,
  messageSystem: MessageSystem
) {
  // 输入防抖
  let lastProcessedValue = ''
  
  const processInput = (
    event: Event,
    handlers: InputHandlers
  ): void => {
    const target = event.target as HTMLInputElement
    const newValue = target.value

    // 防抖：避免重复处理相同输入
    if (newValue === lastProcessedValue) return
    lastProcessedValue = newValue

    const result = engine.processInput(newValue)
    handleInputResult(result, handlers)
  }

  const handleInputResult = (
    result: InputResult,
    handlers: InputHandlers
  ): void => {
    switch (result.type) {
      case 'no-word':
      case 'empty-input':
        messageSystem.clear()
        break
        
      case 'char-correct':
        // 字符正确，继续输入
        break
        
      case 'char-incorrect':
        handleCharError(handlers)
        break
        
      case 'word-complete':
        handleWordComplete(handlers)
        break
        
      case 'word-incorrect':
        handleWordIncomplete(handlers)
        break
    }
  }

  const handleCharError = (handlers: InputHandlers): void => {
    const mode = engine.getSettings().practiceMode as PracticeMode
    const message = PRACTICE_CONFIG.MODE_MESSAGES[mode]
    
    messageSystem.show(message, 'error', PRACTICE_CONFIG.MESSAGE_DURATION.ERROR)
    handlers.onComboReset()
    
    // 根据模式执行相应操作
    if (mode === 'hardcore') {
      setTimeout(() => engine.resetChapter(), PRACTICE_CONFIG.RESET_DELAY)
    } else if (mode === 'strict') {
      setTimeout(() => engine.clearInput(), PRACTICE_CONFIG.RESET_DELAY)
    }
  }

  const handleWordComplete = (handlers: InputHandlers): void => {
    messageSystem.show('完美！', 'success', PRACTICE_CONFIG.MESSAGE_DURATION.SUCCESS)
    handlers.onComboIncrement()
    
    // 使用 requestAnimationFrame 优化DOM更新时机
    requestAnimationFrame(() => {
      engine.completeCurrentWord()
      if (handlers.onWordComplete) {
        setTimeout(handlers.onWordComplete, PRACTICE_CONFIG.WORD_COMPLETE_CALLBACK_DELAY)
      }
    })
  }

  const handleWordIncomplete = (handlers: InputHandlers): void => {
    const mode = engine.getSettings().practiceMode as PracticeMode
    
    if (mode === 'normal') {
      messageSystem.show('单词不完全正确，请检查并修正', 'error', PRACTICE_CONFIG.MESSAGE_DURATION.ERROR)
      handlers.onComboReset()
    } else {
      const message = PRACTICE_CONFIG.MODE_MESSAGES[mode]
      messageSystem.show(message, 'error', PRACTICE_CONFIG.MESSAGE_DURATION.ERROR)
      
      setTimeout(() => {
        if (mode === 'hardcore') {
          engine.resetChapter()
        } else {
          engine.clearInput()
        }
      }, PRACTICE_CONFIG.RESET_DELAY)
      handlers.onComboReset()
    }
  }

  const handleKeydown = (
    event: KeyboardEvent,
    isPaused: boolean,
    onSkipWord: () => void
  ): void => {
    if (isPaused) return

    // 阻止默认行为
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault()
    }

    // 退格键处理
    if (event.key === 'Backspace') {
      const settings = engine.getSettings()
      if (settings.practiceMode === 'normal' || settings.loopOnError) {
        messageSystem.clear()
      }
    }
  }

  return {
    processInput,
    handleKeydown
  }
}