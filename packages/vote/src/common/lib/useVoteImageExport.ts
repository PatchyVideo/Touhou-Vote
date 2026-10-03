import { computed, nextTick, onBeforeUnmount, ref, shallowRef } from 'vue'
import html2canvas from 'html2canvas'
import { popMessageText } from '@/common/lib/popMessage'
import { checkExportImage, mapExportResources } from './checkExportImage'
import { preserveCoverImages } from './preserveCoverImages'
type ElementRef = { value?: HTMLElement | null }
type Options = {
  cardRef: ElementRef
  fileName: string | (() => string)
  shareTitle: string
  width?: number
  validate?: () => boolean
  version?: () => unknown
  prepare?: (isCurrent: () => boolean) => Promise<void> | void
  /** The card page validates originals, fallbacks and QR in its prepare callback. */
  resourcesPrepared?: boolean
}
export interface ImageResult {
  version: unknown
  blob: Blob
  url: string
  fileName: string
  width: number
  height: number
  scale: number
}
let canvasQueue: Promise<unknown> = Promise.resolve()
const DRAW_TIMEOUT = 30_000
const TIMEOUT_MESSAGE = '图片生成超时请刷新页面重试'
export function createVoteImageExportAbortError() {
  return new Error('VOTE_IMAGE_EXPORT_ABORT')
}
const resolveName = (name: Options['fileName']) => (typeof name === 'function' ? name() : name)
async function inspectPng(blob: Blob, width: number, height: number) {
  if (!blob.size) throw new Error('PNG 数据为空')
  const url = URL.createObjectURL(blob)
  const image = new Image()
  try {
    image.src = url
    await image.decode()
    if (image.naturalWidth !== width || image.naturalHeight !== height) throw new Error('PNG 尺寸不完整')
  } finally {
    image.removeAttribute('src')
    URL.revokeObjectURL(url)
  }
}
export function useVoteImageExport(options: Options) {
  const exportDialogOpen = ref(false)
  const status = ref<'idle' | 'generating' | 'ready' | 'error'>('idle')
  const errorMessage = ref('')
  const timedOut = ref(false)
  const sharing = ref(false)
  const result = shallowRef<ImageResult | null>(null)
  let revision = 0
  let disposed = false
  let pending:
    | { revision: number; version: unknown; prepare?: (isCurrent: () => boolean) => Promise<void> | void }
    | undefined
  let running = false
  let activeRevision = -1
  const permitted = () => !disposed && options.validate?.() !== false
  const canSave = computed(
    () => status.value === 'ready' && !!result.value && result.value.version === options.version?.() && permitted()
  )
  const canRetry = computed(() => !timedOut.value)
  const generating = computed(() => status.value === 'generating')
  const previewImageUrl = computed(() => result.value?.url || '')
  const reducedResolution = computed(() => !!result.value && result.value.scale < 2)
  function invalidate() {
    revision++
    pending = undefined
    if (result.value) URL.revokeObjectURL(result.value.url)
    result.value = null
    // A timed-out page is latched until reload, including edits and department changes.
    status.value = timedOut.value ? 'error' : 'idle'
    if (!timedOut.value) errorMessage.value = ''
  }
  function markGenerating() {
    if (permitted() && !timedOut.value) status.value = 'generating'
  }
  function timeout() {
    if (disposed) return
    timedOut.value = true
    pending = undefined
    if (result.value) URL.revokeObjectURL(result.value.url)
    result.value = null
    errorMessage.value = TIMEOUT_MESSAGE
    status.value = 'error'
  }
  async function drain() {
    if (running) return
    running = true
    while (pending && !disposed && !timedOut.value) {
      const task = pending
      activeRevision = task.revision
      pending = undefined
      const valid = () =>
        !timedOut.value && task.revision === revision && task.version === options.version?.() && permitted()
      const operation = async () => {
        if (!valid()) return
        await task.prepare?.(valid)
        await nextTick()
        if (!valid()) return
        const element = options.cardRef.value
        if (!element) throw new Error('导图节点不存在')
        if (!options.resourcesPrepared) {
          await mapExportResources(Array.from(element.querySelectorAll('img')), (image) => checkExportImage(image.src))
        }
        if (!valid()) return
        const cssWidth = options.width ?? 640
        const cssHeight = element.scrollHeight
        let lastError: unknown = new Error('图片尺寸超出浏览器保护范围，请换设备重试')
        for (const scale of [2, 1, 0.5]) {
          if (!valid()) return
          const width = Math.floor(cssWidth * scale),
            height = Math.floor(cssHeight * scale)
          if (!width || !height || width > 16384 || height > 16384 || width * height > 16_000_000) continue
          const ownedCanvas = document.createElement('canvas')
          ownedCanvas.width = width
          ownedCanvas.height = height
          let canvas: HTMLCanvasElement | undefined
          const cloneFrames = new Set<Element>()
          let expired = false
          const started = performance.now()
          const expire = () => {
            expired = true
            timeout()
          }
          const timer = setTimeout(expire, DRAW_TIMEOUT)
          try {
            // Await the physical operation even after the UI deadline: never free the queue early.
            const existingFrames = new Set(Array.from(document.querySelectorAll('.html2canvas-container')))
            const rendering = html2canvas(element, {
              canvas: ownedCanvas,
              onclone: (clonedDocument, clonedElement) => {
                preserveCoverImages(clonedElement)
                const frame = clonedDocument.defaultView?.frameElement
                if (frame) cloneFrames.add(frame)
              },
              scale,
              useCORS: true,
              backgroundColor: '#fff',
              logging: false,
              width: cssWidth,
              height: cssHeight,
              windowWidth: Math.max(document.documentElement.clientWidth, cssWidth),
              windowHeight: Math.max(document.documentElement.clientHeight, cssHeight),
            })
            // 1.4.1 creates the clone iframe synchronously, before awaiting its load.
            // Capture it even if clone loading rejects before onclone is invoked.
            for (const frame of Array.from(document.querySelectorAll('.html2canvas-container'))) {
              if (!existingFrames.has(frame)) cloneFrames.add(frame)
            }
            canvas = await rendering
            if (performance.now() - started >= DRAW_TIMEOUT) expire()
            if (expired || !valid()) return
            if (canvas.width !== width || canvas.height !== height) throw new Error('Canvas 尺寸不完整')
            const blob = await new Promise<Blob>((resolve, reject) =>
              canvas!.toBlob((value) => (value ? resolve(value) : reject(new Error('生成图片数据失败'))), 'image/png')
            )
            await inspectPng(blob, width, height)
            if (performance.now() - started >= DRAW_TIMEOUT) expire()
            if (expired || !valid()) return
            result.value = {
              version: task.version,
              blob,
              url: URL.createObjectURL(blob),
              fileName: resolveName(options.fileName),
              width,
              height,
              scale,
            }
            status.value = 'ready'
            return
          } catch (error) {
            if (performance.now() - started >= DRAW_TIMEOUT) expire()
            if (expired || !valid()) return
            lastError = error
          } finally {
            clearTimeout(timer)
            if (canvas) canvas.width = canvas.height = 0
            ownedCanvas.width = ownedCanvas.height = 0
            for (const frame of cloneFrames) frame.remove()
          }
        }
        throw lastError
      }
      const work = canvasQueue.then(operation)
      canvasQueue = work.catch(() => undefined)
      try {
        await work
      } catch (error) {
        if (valid()) {
          console.error('生成图片失败:', error)
          status.value = 'error'
          errorMessage.value = '生成图片失败，请点击重试或刷新页面'
        }
      }
    }
    running = false
  }
  function ensureReady(prepare = options.prepare) {
    if (!permitted() || timedOut.value || canSave.value) return
    if (pending?.revision === revision || (running && activeRevision === revision && !pending)) return
    pending = { revision, version: options.version?.(), prepare }
    status.value = 'generating'
    errorMessage.value = ''
    void drain()
  }
  function closePreview() {
    exportDialogOpen.value = false
  }
  function openExport() {
    if (!permitted()) return
    exportDialogOpen.value = true
    ensureReady()
  }
  function downloadImage() {
    if (!canSave.value || !result.value || !permitted() || result.value.version !== options.version?.()) return
    const link = document.createElement('a')
    link.href = result.value.url
    link.download = result.value.fileName
    link.click()
  }
  const shareFile = computed(() =>
    result.value ? new File([result.value.blob], result.value.fileName, { type: 'image/png' }) : null
  )
  const canShare = computed(() => {
    if (
      !canSave.value ||
      !shareFile.value ||
      typeof navigator === 'undefined' ||
      typeof navigator.share !== 'function' ||
      typeof navigator.canShare !== 'function'
    )
      return false
    try {
      return navigator.canShare({ files: [shareFile.value] }) === true
    } catch {
      return false
    }
  })
  async function shareImage() {
    if (
      !canSave.value ||
      !canShare.value ||
      !shareFile.value ||
      sharing.value ||
      !permitted() ||
      result.value?.version !== options.version?.()
    )
      return
    const sharedResult = result.value
    sharing.value = true
    try {
      // No preceding await: keep this call inside the click's user activation.
      await navigator.share({ files: [shareFile.value], title: options.shareTitle })
    } catch (error) {
      if (result.value === sharedResult && canSave.value && (error as { name?: string })?.name !== 'AbortError')
        popMessageText('分享失败，可保存图片后分享')
    } finally {
      sharing.value = false
    }
  }
  onBeforeUnmount(() => {
    disposed = true
    invalidate()
    closePreview()
  })
  return {
    status,
    result,
    errorMessage,
    timedOut,
    canRetry,
    reducedResolution,
    sharing,
    canSave,
    generating,
    previewImageUrl,
    exportDialogOpen,
    invalidate,
    ensureReady,
    markGenerating,
    closePreview,
    openExport,
    downloadImage,
    canShare,
    shareImage,
  }
}
