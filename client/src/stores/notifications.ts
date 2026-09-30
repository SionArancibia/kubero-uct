import { defineStore } from 'pinia'

export type NotificationKind = 'success' | 'error'

export interface AppNotification {
  id: number
  kind: NotificationKind
  title: string
  message: string
  duration: number
}

interface NotificationInput {
  kind: NotificationKind
  title: string
  message: string
  duration?: number
}

const timers = new Map<number, ReturnType<typeof setTimeout>>()
let nextId = 1

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    items: [] as AppNotification[],
  }),

  actions: {
    show(input: NotificationInput) {
      const duplicate = this.items.find((item) => (
        item.kind === input.kind &&
        item.title === input.title &&
        item.message === input.message
      ))

      if (duplicate) return duplicate.id

      const id = nextId++
      const notification: AppNotification = {
        ...input,
        id,
        duration: input.duration ?? (input.kind === 'error' ? 7000 : 4500),
      }

      this.items.push(notification)

      if (this.items.length > 4) {
        this.dismiss(this.items[0].id)
      }

      timers.set(id, setTimeout(() => this.dismiss(id), notification.duration))
      return id
    },

    success(title: string, message: string) {
      return this.show({ kind: 'success', title, message })
    },

    error(title: string, message: string) {
      return this.show({ kind: 'error', title, message })
    },

    dismiss(id: number) {
      const timer = timers.get(id)
      if (timer) {
        clearTimeout(timer)
        timers.delete(id)
      }
      this.items = this.items.filter((item) => item.id !== id)
    },
  },
})
