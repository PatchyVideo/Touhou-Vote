<template>
  <div ref="container" class="card-preview" :class="{ zoomed }" :style="{ height: `${availableHeight}px` }">
    <div class="card-stage" :style="{ height: `${zoomed ? height * scale : availableHeight}px` }">
      <div
        ref="card"
        class="scaled-card"
        role="button"
        tabindex="0"
        :aria-label="zoomed ? '缩略显示整张投票卡片' : '放大投票卡片'"
        :aria-pressed="zoomed"
        :style="{
          transform: `scale(${scale})`,
          left: `${(width - 640 * scale) / 2}px`,
          top: '0px',
        }"
        @click="click"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
        @pointerdown="pointerDown"
        @pointermove="pointerMove"
        @pointerup="pointerEnd"
        @pointercancel="pointerCancel"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePreviewMode } from '../lib/usePreviewMode'
const props = defineProps<{ availableHeight: number; version: string }>()
const container = ref<HTMLElement>(),
  card = ref<HTMLElement>()
const width = ref(0),
  height = ref(1100)
const { zoomed, reset, toggle, click, pointerDown, pointerMove, pointerEnd, pointerCancel } = usePreviewMode(() => {
  if (container.value) container.value.scrollTop = 0
})
const scale = computed(() =>
  Math.max(0, Math.min(1, width.value / 640, zoomed.value ? 1 : props.availableHeight / height.value))
)
let observer: ResizeObserver
onMounted(() => {
  observer = new ResizeObserver(() => {
    width.value = container.value?.clientWidth || 0
    height.value = card.value?.scrollHeight || 1100
  })
  observer.observe(container.value!)
  observer.observe(card.value!)
})
watch(() => props.version, reset)
onBeforeUnmount(() => observer?.disconnect())
</script>
<style scoped>
.card-preview {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.card-preview.zoomed {
  overflow-y: auto;
}
.card-stage {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.scaled-card {
  position: absolute;
  width: 640px;
  transform-origin: top left;
  cursor: zoom-in;
}
.zoomed .scaled-card {
  cursor: zoom-out;
}
.scaled-card:focus-visible {
  outline: 3px solid #a78bfa;
  outline-offset: 3px;
}
</style>
