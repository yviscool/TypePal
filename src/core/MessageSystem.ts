/**
 * 消息系统 - 单一职责：管理用户反馈消息
 * 支持消息队列、优先级和自动清理
 */
export interface Message {
  id: string
  content: string
  type: 'success' | 'error' | 'info'
  duration: number
  priority: number
}

export class MessageSystem {
  private messages = new Map<string, Message>()
  private timers = new Map<string, number>()
  private listeners = new Set<(messages: Message[]) => void>()

  public show(content: string, type: Message['type'], duration = 1500, priority = 0): string {
    const id = this.generateId()
    const message: Message = { id, content, type, duration, priority }
    
    this.clearExistingTimer(id)
    this.messages.set(id, message)
    this.scheduleRemoval(id, duration)
    this.notifyListeners()
    
    return id
  }

  public clear(id?: string): void {
    if (id) {
      this.removeMessage(id)
    } else {
      this.clearAll()
    }
  }

  public subscribe(listener: (messages: Message[]) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  public getMessages(): Message[] {
    return Array.from(this.messages.values())
      .sort((a, b) => b.priority - a.priority)
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private clearExistingTimer(id: string): void {
    const existingTimer = this.timers.get(id)
    if (existingTimer) {
      clearTimeout(existingTimer)
      this.timers.delete(id)
    }
  }

  private scheduleRemoval(id: string, duration: number): void {
    const timer = window.setTimeout(() => {
      this.removeMessage(id)
    }, duration)
    this.timers.set(id, timer)
  }

  private removeMessage(id: string): void {
    this.messages.delete(id)
    this.clearExistingTimer(id)
    this.notifyListeners()
  }

  private clearAll(): void {
    this.messages.clear()
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
    this.notifyListeners()
  }

  private notifyListeners(): void {
    const messages = this.getMessages()
    this.listeners.forEach(listener => listener(messages))
  }
}