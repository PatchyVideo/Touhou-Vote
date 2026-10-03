<template>
  <Teleport to="body"
    ><div class="preview-mask" @keydown.esc="$emit('close')" @keydown.tab="trapFocus">
      <section
        ref="dialog"
        :style="{ height: `${shellHeight}px` }"
        role="dialog"
        aria-modal="true"
        aria-label="投票卡片预览"
        tabindex="-1"
      >
        <header ref="header">
          <h2>投票卡片预览</h2>
          <button @click="$emit('close')">返回编辑</button>
        </header>
        <div ref="imageArea" class="image-scroll" :class="{ zoomed }">
          <div v-if="url" class="image-stage" :style="{ height: `${zoomed ? imageHeight * scale : areaHeight}px` }">
            <img
              :src="url"
              alt="投票卡片 PNG 预览"
              role="button"
              tabindex="0"
              :aria-label="zoomed ? '缩略显示整张投票卡片' : '放大投票卡片'"
              :aria-pressed="zoomed"
              :style="{
                width: `${imageWidth * scale}px`,
                height: `${imageHeight * scale}px`,
                left: `${Math.max(0, (areaWidth - imageWidth * scale) / 2)}px`,
                top: `${zoomed ? 0 : Math.max(0, (areaHeight - imageHeight * scale) / 2)}px`,
              }"
              @load="loaded"
              @click="click"
              @keydown.enter.prevent="toggle"
              @keydown.space.prevent="toggle"
              @pointerdown="pointerDown"
              @pointermove="pointerMove"
              @pointerup="pointerEnd"
              @pointercancel="pointerCancel"
            />
          </div>
          <div v-else-if="status === 'error'" />
          <div v-else class="image-loading" role="status" aria-live="polite">
            <icon-uil-spinner-alt class="loading-spinner animate-spin" aria-hidden="true" />
            <p>正在生成图片…</p>
          </div>
        </div>
        <footer ref="footer">
          <div v-if="canRetry || errorMessage" class="retry-feedback">
            <button v-if="canRetry" :disabled="status === 'generating'" @click="$emit('retry')">重试</button>
            <p v-if="errorMessage" class="failure-message" role="alert">{{ errorMessage }}</p>
          </div>
          <div class="save-actions">
            <button :disabled="!canSave" @click="$emit('save')">保存图片</button>
            <button v-if="canShare" :disabled="!canSave || sharing" @click="$emit('share')">
              {{ sharing ? '正在分享…' : '分享图片' }}
            </button>
          </div>
        </footer>
      </section>
    </div></Teleport
  >
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePreviewMode } from '../lib/usePreviewMode'
const props = defineProps<{
  url: string
  status: string
  canSave: boolean
  version: string
  errorMessage?: string
  canRetry?: boolean
  canShare?: boolean
  sharing?: boolean
}>()
const header = ref<HTMLElement>(),
  footer = ref<HTMLElement>(),
  imageArea = ref<HTMLElement>()
const imageWidth = ref(1280),
  imageHeight = ref(2200)
const viewportWidth = ref(window.innerWidth),
  viewportHeight = ref(window.innerHeight)
const controlsHeight = ref(160),
  areaWidth = ref(0),
  areaHeight = ref(0)
// Preserve the previous width-first shell size independently of the viewing mode.
const shellHeight = computed(() =>
  Math.min(
    viewportHeight.value * 0.94,
    viewportHeight.value - 24,
    (Math.min(760, viewportWidth.value - 24) * imageHeight.value) / imageWidth.value + controlsHeight.value
  )
)
const { zoomed, reset, toggle, click, pointerDown, pointerMove, pointerEnd, pointerCancel } = usePreviewMode(() => {
  if (imageArea.value) imageArea.value.scrollTop = 0
})
const scale = computed(() =>
  Math.max(0, Math.min(1, areaWidth.value / imageWidth.value, zoomed.value ? 1 : areaHeight.value / imageHeight.value))
)
function loaded(event: Event) {
  const image = event.target as HTMLImageElement
  imageWidth.value = image.naturalWidth
  imageHeight.value = image.naturalHeight
}
function resize() {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}
let observer: ResizeObserver
watch(() => props.version, reset)
defineEmits(['close', 'save', 'retry', 'share'])
const dialog = ref<HTMLElement>()
let previous: HTMLElement | null, overflow: string
function trapFocus(event: KeyboardEvent) {
  const controls = Array.from(dialog.value?.querySelectorAll<HTMLElement>('button:not(:disabled), img[tabindex]') || [])
  const first = controls[0],
    last = controls[controls.length - 1]
  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.value)) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}
onMounted(() => {
  observer = new ResizeObserver(() => {
    controlsHeight.value = (header.value?.offsetHeight || 0) + (footer.value?.offsetHeight || 0)
    areaWidth.value = imageArea.value?.clientWidth || 0
    areaHeight.value = imageArea.value?.clientHeight || 0
  })
  for (const el of [header.value, footer.value, imageArea.value]) if (el) observer.observe(el)
  window.addEventListener('resize', resize)
  previous = document.activeElement as HTMLElement
  overflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value?.focus()
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', resize)
  document.body.style.overflow = overflow
  previous?.focus()
})
</script>
<style scoped>
.preview-mask {
  -webkit-tap-highlight-color: transparent;
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #0009;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: #111;
}
section {
  width: 100%;
  max-width: 760px;
  max-height: 94vh;
  max-height: 94dvh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
header,
footer {
  flex-shrink: 0;
  padding: 12px;
}
header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
header {
  align-items: center;
  margin: 0 12px;
  padding-right: 0;
  padding-left: 0;
  border-bottom: 1px solid #ede9fe;
}
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.retry-feedback {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}
.retry-feedback button {
  flex-shrink: 0;
}
.failure-message {
  margin: 0;
  color: #4c1d95;
  font-size: 12px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.save-actions {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  gap: 12px;
  margin-left: auto;
}
.image-scroll {
  min-height: 0;
  flex: 1;
  overflow: hidden;
}
.image-scroll.zoomed {
  overflow-y: auto;
}
.image-loading {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.image-loading p {
  margin: 0;
}
.loading-spinner {
  width: 36px;
  height: 36px;
  color: #7c3aed;
}
.image-stage {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.image-scroll img {
  position: absolute;
  display: block;
  cursor: zoom-in;
  max-width: none;
}
.zoomed img {
  cursor: zoom-out;
}
.image-scroll img:focus-visible {
  outline: 3px solid #a78bfa;
  outline-offset: -3px;
}
button {
  border-radius: 8px;
  padding: 8px 12px;
  background: #ede9fe;
}
header button {
  background: transparent;
  box-shadow: none;
}
button:disabled {
  opacity: 0.4;
}
</style>
<style scoped>
header h2,
.image-scroll p {
  color: #111827;
}
button {
  color: #4c1d95;
}
.save-actions button:last-child {
  background: #7c3aed;
  color: #fff;
}
</style>
