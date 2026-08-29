import { nextTick, ref } from 'vue'

export const isBootstrapping = ref(Boolean(localStorage.getItem('voteToken')))

export async function reloadWithBootstrap(beforeReload?: () => void): Promise<void> {
  isBootstrapping.value = true
  await nextTick()
  beforeReload?.()
  location.reload()
}
