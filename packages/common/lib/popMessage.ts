import { shallowRef, triggerRef } from 'vue'

export interface MessageInfo {
  text: string
}
export const messages = shallowRef<MessageInfo[]>([])

export function popMessageText(text: string): void {
  messages.value.push({ text })
  triggerRef(messages)
}

export interface ConfirmMessageInfo {
  text: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}
export const confirmMessages = shallowRef<ConfirmMessageInfo[]>([])

export function popConfirmText(text: string, confirmText?: string, cancelText?: string): Promise<boolean> {
  return new Promise((resolve) => {
    confirmMessages.value.push({
      text,
      confirmText,
      cancelText,
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    })
    triggerRef(confirmMessages)
  })
}
