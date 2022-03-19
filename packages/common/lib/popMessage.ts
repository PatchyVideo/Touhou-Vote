import type { Ref } from 'vue';
import { ref } from 'vue'

export interface MessageInfo {
  text: string
  open: Ref<boolean>
}
export const messages: MessageInfo[] = []

export function popMessageText(text: string, open?: Ref<boolean>): void {
  messages.push({ text, open: open || ref(true) })
}
