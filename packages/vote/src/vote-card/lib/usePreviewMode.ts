import { ref } from 'vue'

// A tap toggles the view. Dragging/scrolling and native image long presses do not.
export function usePreviewMode(resetScroll: () => void) {
  const zoomed = ref(false)
  let gesture: { x: number; y: number; time: number; moved: boolean } | undefined
  let suppressClick = false
  function reset() {
    zoomed.value = false
    resetScroll()
  }
  function toggle() {
    zoomed.value = !zoomed.value
    resetScroll()
  }
  function pointerDown(event: PointerEvent) {
    suppressClick = false
    gesture = { x: event.clientX, y: event.clientY, time: performance.now(), moved: false }
  }
  function pointerMove(event: PointerEvent) {
    if (gesture && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 8) gesture.moved = true
  }
  function pointerEnd() {
    if (gesture) suppressClick = gesture.moved || performance.now() - gesture.time >= 500
    gesture = undefined
  }
  function pointerCancel() {
    gesture = undefined
    suppressClick = true
  }
  function click(event: MouseEvent) {
    if (event.detail === 0 || !suppressClick) toggle()
    suppressClick = false
  }
  return { zoomed, reset, toggle, pointerDown, pointerMove, pointerEnd, pointerCancel, click }
}
