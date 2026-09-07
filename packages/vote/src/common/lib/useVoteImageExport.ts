import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { domToBlob } from 'modern-screenshot'
import { popMessageText } from '@/common/lib/popMessage'

type ElementRef = { value?: HTMLElement | null }

type UseVoteImageExportOptions = {
  cardRef: ElementRef
  fileName: string | (() => string)
  shareTitle: string
  width?: number
  prepare?: () => Promise<void> | void
}

const EXPORT_ABORT_ERROR = 'VOTE_IMAGE_EXPORT_ABORT'
const EXPORT_TIMEOUT_ERROR = 'VOTE_IMAGE_EXPORT_TIMEOUT'

// 素材加载的兜底时限：图片既不 load 也不 error（请求被挂住）时，
// 没有这个上限就会永远卡在「正在生成图片…」，用户只能关掉弹窗。
const IMAGE_LOAD_TIMEOUT_MS = 10_000

const CARD_WIDTH_PX = 640

export function createVoteImageExportAbortError() {
  return new Error(EXPORT_ABORT_ERROR)
}

function resolveFileName(fileName: string | (() => string)) {
  return typeof fileName === 'function' ? fileName() : fileName
}

function clearObjectUrl(url: string) {
  if (url) URL.revokeObjectURL(url)
}

/** 等浏览器实际画完一帧，确保离屏卡片的布局已经定下来再截图。 */
function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
}

/** 等到所有图片有结果（成功或失败都算），超过 IMAGE_LOAD_TIMEOUT_MS 则抛超时错误。 */
async function waitForImages(element: HTMLElement) {
  const pending = Array.from(element.querySelectorAll('img')).filter((img) => !img.complete)
  if (!pending.length) return

  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      Promise.all(
        pending.map(
          (img) =>
            new Promise<void>((resolve) => {
              // 用 addEventListener 而不是赋值 onload/onerror，避免覆盖调用方已挂的处理函数。
              const settle = () => {
                img.removeEventListener('load', settle)
                img.removeEventListener('error', settle)
                resolve()
              }
              img.addEventListener('load', settle)
              img.addEventListener('error', settle)
            })
        )
      ),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(EXPORT_TIMEOUT_ERROR)), IMAGE_LOAD_TIMEOUT_MS)
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export function useVoteImageExport(options: UseVoteImageExportOptions) {
  const exportDialogOpen = ref(false)
  const generating = ref(false)
  const previewImageUrl = ref('')
  const imageBlob = ref<Blob | null>(null)

  function clearPreviewImageUrl() {
    clearObjectUrl(previewImageUrl.value)
    previewImageUrl.value = ''
  }

  const canShare = computed(() => {
    if (!imageBlob.value || typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false
    const file = new File([imageBlob.value], resolveFileName(options.fileName), { type: 'image/png' })
    if (typeof navigator.canShare === 'function') {
      return navigator.canShare({ files: [file] })
    }
    return true
  })

  watch(exportDialogOpen, (isOpen) => {
    if (!isOpen) {
      clearPreviewImageUrl()
      imageBlob.value = null
    }
  })

  onBeforeUnmount(() => {
    clearPreviewImageUrl()
  })

  async function generatePreview() {
    if (!options.cardRef.value) throw new Error('导图节点不存在')
    await waitForImages(options.cardRef.value)
    await nextTick()
    await nextFrame()

    // modern-screenshot 走 SVG foreignObject，由浏览器真正做一遍 CSS 布局，
    // 所以 object-fit / clip-path / 渐变这些都能正确落到图上（html2canvas 自己实现布局，做不到）。
    // 代价是远程图片要被 fetch 成 data URL，同样受 CORS 约束 —— 见 exportAssetUrl.ts 的同源代理。
    const blob = await domToBlob(options.cardRef.value, {
      scale: 2,
      backgroundColor: '#ffffff',
      width: options.width ?? CARD_WIDTH_PX,
      type: 'image/png',
      timeout: IMAGE_LOAD_TIMEOUT_MS,
    })

    imageBlob.value = blob
    clearPreviewImageUrl()
    previewImageUrl.value = URL.createObjectURL(blob)
  }

  async function openExport() {
    exportDialogOpen.value = true
    generating.value = true
    clearPreviewImageUrl()
    imageBlob.value = null

    try {
      await options.prepare?.()
      await nextTick()
      await generatePreview()
    } catch (error) {
      const reason = error instanceof Error ? error.message : ''
      if (reason === EXPORT_ABORT_ERROR || reason === EXPORT_TIMEOUT_ERROR) {
        // 中止和超时都不留半成品弹窗：直接关闭，让用户重来一次。
        exportDialogOpen.value = false
        clearPreviewImageUrl()
        imageBlob.value = null
        if (reason === EXPORT_TIMEOUT_ERROR) popMessageText('图片素材加载超时，请稍后重试')
        return
      }
      console.error('生成图片失败:', error)
      popMessageText('生成预览失败')
    } finally {
      generating.value = false
    }
  }

  function downloadImage() {
    if (!previewImageUrl.value) return
    const link = document.createElement('a')
    link.href = previewImageUrl.value
    link.download = resolveFileName(options.fileName)
    link.click()
  }

  async function shareImage() {
    if (!imageBlob.value) return
    const file = new File([imageBlob.value], resolveFileName(options.fileName), { type: 'image/png' })
    if (typeof navigator.canShare === 'function' && !navigator.canShare({ files: [file] })) {
      popMessageText('当前浏览器不支持分享该图片文件')
      return
    }
    try {
      await navigator.share({
        files: [file],
        title: options.shareTitle,
      })
    } catch {}
  }

  return {
    canShare,
    downloadImage,
    exportDialogOpen,
    generating,
    openExport,
    previewImageUrl,
    shareImage,
  }
}
