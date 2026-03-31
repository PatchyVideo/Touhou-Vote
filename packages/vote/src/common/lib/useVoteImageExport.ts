import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import html2canvas from 'html2canvas'
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

export function createVoteImageExportAbortError() {
  return new Error(EXPORT_ABORT_ERROR)
}

function resolveFileName(fileName: string | (() => string)) {
  return typeof fileName === 'function' ? fileName() : fileName
}

function clearObjectUrl(url: string) {
  if (url) URL.revokeObjectURL(url)
}

async function waitForImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll('img'))
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise<void>((resolve) => {
        const handler = () => resolve()
        img.onload = handler
        img.onerror = handler
      })
    })
  )
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('生成图片数据失败'))
    }, 'image/png', 0.95)
  })
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
    await new Promise((resolve) => setTimeout(resolve, 300))

    const canvas = await html2canvas(options.cardRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: options.width ?? 640,
    })

    const blob = await canvasToBlob(canvas)
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
      if (error instanceof Error && error.message === EXPORT_ABORT_ERROR) {
        exportDialogOpen.value = false
        clearPreviewImageUrl()
        imageBlob.value = null
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
