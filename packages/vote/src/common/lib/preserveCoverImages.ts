/** html2canvas supports background cover, but ignores object-fit on images. */
export function preserveCoverImages(element: HTMLElement) {
  for (const image of Array.from(element.querySelectorAll<HTMLImageElement>('img.object-cover'))) {
    const background = image.ownerDocument.createElement('div')
    background.className = image.className
    background.style.cssText = image.style.cssText
    background.style.backgroundImage = `url(${JSON.stringify(image.currentSrc || image.src)})`
    background.style.backgroundSize = 'cover'
    background.style.backgroundPosition = 'center'
    background.style.backgroundRepeat = 'no-repeat'
    if (image.alt) {
      background.setAttribute('role', 'img')
      background.setAttribute('aria-label', image.alt)
    }
    image.replaceWith(background)
  }
}
