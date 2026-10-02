/** Check pixels, not merely <img>.complete: display permission is not export permission. */
export function checkExportImage(url: string, timeout = 10_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    let settled = false
    const finish = (error?: unknown) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      image.onload = image.onerror = null
      // Stop a hanging request; never retain resource images after inspection.
      image.removeAttribute('src')
      if (error) reject(error)
      else resolve()
    }
    const timer = setTimeout(() => finish(new Error('图片加载超时')), timeout)
    image.crossOrigin = 'anonymous'
    image.onerror = () => finish(new Error('图片加载失败'))
    image.onload = async () => {
      let canvas: HTMLCanvasElement | undefined
      try {
        await image.decode()
        if (settled) return
        if (!image.naturalWidth || !image.naturalHeight) throw new Error('图片尺寸无效')
        canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas 不可用')
        context.drawImage(image, 0, 0, 1, 1)
        context.getImageData(0, 0, 1, 1)
        finish()
      } catch (error) {
        finish(error)
      } finally {
        if (canvas) canvas.width = canvas.height = 0
      }
    }
    if (!url) finish(new Error('图片地址缺失'))
    else image.src = url
  })
}

export async function mapExportResources<T>(items: T[], work: (item: T) => Promise<void>) {
  let index = 0
  const results = await Promise.allSettled(
    Array.from({ length: Math.min(4, items.length) }, async () => {
      while (index < items.length) await work(items[index++])
    })
  )
  const failure = results.find((result) => result.status === 'rejected')
  if (failure?.status === 'rejected') throw failure.reason
}
