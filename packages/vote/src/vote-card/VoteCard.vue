<template>
  <main class="card-editor">
    <header>
      <h1>投票卡片</h1>
      <RouterLink to="/?tab=1&openList=vote&open=1" style="-webkit-tap-highlight-color: transparent"
        >返回投票首页</RouterLink
      >
    </header>
    <template v-if="access.status !== 'allowed'"
      ><p>{{ access.message || '正在验证投票凭证…' }}</p>
      <button v-if="access.status === 'error'" @click="retry">重试</button></template
    >
    <template v-else>
      <p v-if="notice" role="status">{{ notice }}</p>
      <div class="editor-layout">
        <section class="editor-form">
          <label
            >展示部门<select :value="selected || ''" @change="chooseDepartment">
              <option
                v-for="department in departments"
                :key="department"
                :value="department"
                :disabled="states[department].status !== 'ready'"
              >
                {{ labels[department] }}
              </option>
            </select></label
          >
          <div class="username-field">
            <div class="field-label-row">
              <label for="card-username">卡片用户名</label>
              <span id="card-username-hint" class="field-hint">最多 20 个字符</span>
            </div>
            <input
              id="card-username"
              aria-describedby="card-username-hint"
              :value="inputName"
              @input="onInput"
              @compositionstart="startComposition"
              @compositionend="finishComposition"
            />
          </div>
          <div class="field-label-row">
            <label class="toggle"
              ><input
                type="checkbox"
                :aria-describedby="!reasonAvailable ? 'card-reason-hint' : undefined"
                :checked="preferences.showReason"
                :disabled="!reasonAvailable"
                @change="setBoolean('showReason', $event)"
              />展示本命理由</label
            >
            <span v-if="!reasonAvailable" id="card-reason-hint" class="field-hint">
              {{ honmei ? '本命理由为空' : '当前部门没有本命票' }}
            </span>
          </div>
          <div class="field-label-row">
            <label class="toggle"
              ><input
                type="checkbox"
                aria-describedby="card-qr-hint"
                :checked="preferences.showQr"
                @change="setBoolean('showQr', $event)"
              />展示二维码</label
            >
            <span id="card-qr-hint" class="field-hint">隐藏二维码可避免分享时图片被拦截</span>
          </div>
          <p v-if="storageFailed" role="status">当前浏览器无法保存卡片设置</p>
          <div class="export-actions">
            <template v-if="selected && states[selected].status === 'ready'">
              <p v-for="skip in states[selected].skipped" :key="skip.slotIndex">
                第 {{ skip.slotIndex + 1 }} 票位：{{ skip.reason }}
              </p>
              <button v-if="desktop" :disabled="!canSave" @click="downloadImage">
                {{ generating ? '正在生成图片…' : '保存图片' }}
              </button>
              <button v-else style="-webkit-tap-highlight-color: transparent" @click="openPreview">预览图片</button>
              <button v-if="showRetry" :disabled="generating" @click="retryGeneration">重试</button>
              <p v-if="failureMessage" class="field-hint generation-error" role="alert">{{ failureMessage }}</p>
              <p v-if="reducedResolution" role="status">已降低图片分辨率以保留完整内容</p>
            </template>
            <template v-else
              ><p>{{ dataMessage }}</p>
              <button v-if="hasError" @click="retry">重试读取</button
              ><RouterLink v-if="selected" :to="editUrls[selected]">返回该投票部门编辑</RouterLink></template
            >
          </div>
        </section>
        <section v-if="current" v-show="desktop" class="editor-preview" aria-labelledby="card-preview-heading">
          <h2 id="card-preview-heading">投票卡片预览</h2>
          <div ref="previewArea">
            <CardPreview :available-height="previewHeight" :version="version"
              ><component :is="templates[visibleCard.department]" v-bind="visibleCard"
            /></CardPreview>
          </div>
        </section>
      </div>
      <div class="export-node">
        <div ref="cardRef"><component :is="templates[drawing.department]" v-if="drawing" v-bind="drawing" /></div>
      </div>
    </template>
    <VoteCardPreviewDialog
      v-if="exportDialogOpen"
      :url="previewImageUrl"
      :status="status"
      :can-save="canSave"
      :version="version"
      :error-message="failureMessage"
      :can-retry="showRetry"
      :can-share="canShare"
      :sharing="sharing"
      @share="shareImage"
      @close="closePreview"
      @save="downloadImage"
      @retry="retryGeneration"
    />
  </main>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { user } from '@/home/lib/user'
import { voteYear } from '@/common/lib/voteYear'
import { useVoteImageExport } from '@/common/lib/useVoteImageExport'
import CharacterVoteCard from './components/CharacterVoteCard.vue'
import MusicVoteCard from './components/MusicVoteCard.vue'
import CoupleVoteCard from './components/CoupleVoteCard.vue'
import CardPreview from './components/CardPreview.vue'
import VoteCardPreviewDialog from './components/VoteCardPreviewDialog.vue'
import { type CardEntry, type Department, departments } from './lib/types'
import { prepareVoteCardImages } from './lib/voteCardImageResources'
import { selectDepartment } from './lib/selectDepartment'
import { cardDepartmentVersions, useVoteCardSession } from './lib/voteCardSession'
import { checkCardTime } from './lib/voteCardAccess'
import { customUsername, defaultUsername } from './lib/cardUsername'
import {
  type CardPreferences,
  parsePreferences,
  preferenceKey,
  readPreferences,
  syncPreferences,
  writePreferences,
} from './lib/voteCardPreferences'
const previewHeight = ref(0)
const previewArea = ref<HTMLElement>()
let previewSizeObserver: ResizeObserver | undefined
let previewFrame = 0
function previewClippingParents(area: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = []
  for (let parent = area.parentElement; parent; parent = parent.parentElement) {
    if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(parent).overflowY)) parents.push(parent)
  }
  return parents
}
function measurePreview() {
  cancelAnimationFrame(previewFrame)
  previewFrame = requestAnimationFrame(() => {
    if (!previewArea.value || !media.matches) return
    let visibleBottom = window.innerHeight
    for (const parent of previewClippingParents(previewArea.value)) {
      visibleBottom = Math.min(visibleBottom, parent.getBoundingClientRect().bottom)
    }
    previewHeight.value = Math.max(0, Math.floor(visibleBottom - previewArea.value.getBoundingClientRect().top - 16))
  })
}
watch(
  previewArea,
  (area) => {
    previewSizeObserver?.disconnect()
    if (!area) return
    previewSizeObserver = new ResizeObserver(measurePreview)
    previewSizeObserver.observe(area)
    for (const parent of previewClippingParents(area)) previewSizeObserver.observe(parent)
    const header = area.closest('.card-editor')?.querySelector('header')
    if (header) previewSizeObserver.observe(header)
    measurePreview()
  },
  { flush: 'post' }
)
const { states, access, retry } = useVoteCardSession()
const route = useRoute(),
  router = useRouter()
const labels = { role: '角色部门', music: '音乐部门', cp: 'CP部门' }
const editUrls = { role: '/vote/character', music: '/vote/music', cp: '/vote/couple' }
const templates = { role: CharacterVoteCard, music: MusicVoteCard, cp: CoupleVoteCard }
const selected = computed(() => selectDepartment(route.query.department, states))
const hasError = computed(() => departments.some((d) => states[d].status === 'error'))
const dataMessage = computed(() =>
  departments.some((d) => states[d].status === 'loading')
    ? '正在读取投票内容…'
    : hasError.value
    ? departments
        .map((d) => states[d].error)
        .filter(Boolean)
        .join('；')
    : '暂无可导出的完整投票条目'
)
const preferences = ref<CardPreferences>(parsePreferences(null)),
  storageFailed = ref(false),
  inputName = ref(''),
  composing = ref(false),
  notice = ref('')
const name = computed(() => preferences.value.customUsername ?? defaultUsername(user.value))
const honmei = computed(() => (selected.value ? states[selected.value].entries.find((e) => e.isHonmei) : undefined))
const reasonAvailable = computed(() => !!honmei.value?.reason.trim())
let compositionStartValue = ''
let cancelledCompositionValue: string | undefined
watch(
  () => (access.value.status === 'allowed' ? access.value.account : ''),
  (account) => {
    composing.value = false
    compositionStartValue = ''
    cancelledCompositionValue = undefined
    inputName.value = ''
    preferences.value = parsePreferences(null)
    if (account && access.value.status === 'allowed') {
      const restored = readPreferences(account, localStorage)
      preferences.value = restored.value
      storageFailed.value = restored.failed
      inputName.value = name.value
    }
  },
  { immediate: true }
)
watch(
  name,
  (value) => {
    if (!composing.value) inputName.value = value
  },
  { immediate: true }
)
function save(patch: Partial<CardPreferences>) {
  if (access.value.status !== 'allowed' || !access.value.account) return
  const saved = writePreferences(access.value.account, patch, localStorage)
  preferences.value = saved.value
  storageFailed.value ||= saved.failed
}
function commit(value: string) {
  save({ customUsername: customUsername(value) })
  inputName.value = name.value
}
function startComposition() {
  composing.value = true
  compositionStartValue = inputName.value
}
function onInput(event: Event) {
  inputName.value = (event.target as HTMLInputElement).value
  if (cancelledCompositionValue === inputName.value) {
    cancelledCompositionValue = undefined
    inputName.value = name.value
    return
  }
  cancelledCompositionValue = undefined
  if (!composing.value) commit(inputName.value)
}
function finishComposition(event: CompositionEvent) {
  composing.value = false
  const value = (event.target as HTMLInputElement).value
  if (!event.data && value === compositionStartValue) {
    cancelledCompositionValue = value
    inputName.value = name.value
    return
  }
  commit(value)
}
function setBoolean(field: 'showReason' | 'showQr', event: Event) {
  save({ [field]: (event.target as HTMLInputElement).checked })
}
function storageChange(event: StorageEvent) {
  if (access.value.status === 'allowed' && (event.key === preferenceKey(access.value.account) || event.key === null))
    preferences.value = syncPreferences(access.value.account, event.newValue)
}
onMounted(() => window.addEventListener('storage', storageChange))
onBeforeUnmount(() => window.removeEventListener('storage', storageChange))
function chooseDepartment(event: Event) {
  void router.replace({ path: '/vote-card', query: { department: (event.target as HTMLSelectElement).value } })
}
interface Snapshot {
  department: Department
  entries: CardEntry[]
  title: string
  year: number
  showReason: boolean
  showQr: boolean
}
const current = computed<Snapshot | null>(() =>
  selected.value && access.value.status === 'allowed' && states[selected.value].status === 'ready'
    ? {
        department: selected.value,
        entries: states[selected.value].entries,
        title: `${name.value}的${labels[selected.value]}投票`,
        year: voteYear,
        showReason: preferences.value.showReason,
        showQr: preferences.value.showQr,
      }
    : null
)
const version = computed(() =>
  JSON.stringify([
    access.value.account,
    access.value.scope,
    selected.value && cardDepartmentVersions[selected.value],
    current.value,
  ])
)
const prepared = shallowRef<{ version: string; snapshot: Snapshot; fallback: boolean } | null>(null)
const visibleCard = computed(() =>
  prepared.value?.version === version.value ? prepared.value.snapshot : current.value!
)
const imageFallback = computed(() => prepared.value?.version === version.value && prepared.value.fallback)
const imageNotice = ref('')
const generationError = ref('')
function showImageFailure() {
  generationError.value = ''
  imageNotice.value = '图片加载失败'
}
const drawing = shallowRef<Snapshot | null>(null),
  cardRef = ref<HTMLElement>()
const desktop = ref(window.innerWidth >= 1024)
const media = window.matchMedia('(min-width: 1024px)')
function resize() {
  desktop.value = media.matches
  measurePreview()
}
onMounted(() => {
  media.addEventListener('change', resize)
  window.addEventListener('resize', measurePreview)
  window.visualViewport?.addEventListener('resize', measurePreview)
  measurePreview()
})
onBeforeUnmount(() => {
  media.removeEventListener('change', resize)
  window.removeEventListener('resize', measurePreview)
  window.visualViewport?.removeEventListener('resize', measurePreview)
  previewSizeObserver?.disconnect()
  cancelAnimationFrame(previewFrame)
})
const {
  status,
  errorMessage,
  canRetry,
  reducedResolution,
  canShare,
  shareImage,
  sharing,
  canSave,
  generating,
  previewImageUrl,
  exportDialogOpen,
  invalidate,
  ensureReady,
  markGenerating,
  closePreview,
  downloadImage,
} = useVoteImageExport({
  cardRef,
  width: 640,
  resourcesPrepared: true,
  shareTitle: '我的东方人气投票',
  version: () => version.value,
  validate: () => checkCardTime() && !!current.value,
  fileName: () => {
    const time = new Date().toLocaleString('sv')
    const [date, clock] = time.split(' ')
    return `thvote-${voteYear}-${selected.value}-${date.replace(/-/g, '')}-${clock.replace(/:/g, '')}.png`
  },
})
const failureMessage = computed(() => generationError.value || imageNotice.value)
const showRetry = computed(() => canRetry.value && !!failureMessage.value)
watch(errorMessage, (message) => {
  if (message) generationError.value = message
})
watch([status, imageFallback], ([state, fallback]) => {
  if (state === 'ready' && !fallback) {
    generationError.value = ''
    imageNotice.value = ''
  }
})
let timer: ReturnType<typeof setTimeout> | undefined
function generate() {
  if (!current.value) return
  const snapshot: Snapshot = JSON.parse(JSON.stringify(current.value))
  const sourceVersion = version.value
  ensureReady(async (isCurrent) => {
    const fallback = await prepareVoteCardImages(snapshot, () => {
      if (isCurrent() && sourceVersion === version.value && checkCardTime()) showImageFailure()
    })
    if (!isCurrent() || sourceVersion !== version.value || !checkCardTime()) return
    prepared.value = { version: sourceVersion, snapshot, fallback }
    drawing.value = snapshot
  })
}
function retryGeneration() {
  if (!canRetry.value || generating.value) return
  invalidate()
  prepared.value = null
  generate()
}
function openPreview() {
  if (!checkCardTime()) return
  exportDialogOpen.value = true
  generate()
}
function schedule() {
  clearTimeout(timer)
  if (!current.value || canSave.value) return
  if (exportDialogOpen.value) generate()
  else if (desktop.value) {
    markGenerating()
    timer = setTimeout(generate, 300)
  }
}
watch(
  [version, () => access.value.status],
  () => {
    invalidate()
    prepared.value = null
    if (access.value.status !== 'allowed') {
      imageNotice.value = ''
      generationError.value = ''
      closePreview()
    }
    schedule()
  },
  { immediate: true }
)
watch(desktop, schedule)
watch(
  () => access.value.status,
  (status) => {
    if (status === 'ended' || (!localStorage.getItem('voteToken') && status !== 'checking')) void router.replace('/')
  }
)
watch(
  selected,
  (department, previous) => {
    if (department && states[department].status === 'ready' && route.query.department !== department) {
      if (previous) {
        closePreview()
        notice.value = '原部门已不可用，已切换到可用部门'
      }
      void router.replace({ path: '/vote-card', query: { department } })
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => clearTimeout(timer))
</script>
<style scoped>
.card-editor {
  -webkit-tap-highlight-color: transparent;
  --editor-section-spacing: 20px;
  padding: 16px;
  min-width: 0;
}
header {
  position: relative;
  padding-bottom: 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: var(--editor-section-spacing);
}
h1 {
  font-size: 24px;
}
.editor-layout {
  display: grid;
  gap: 24px;
}
.editor-form {
  display: flex;
  flex-direction: column;
  gap: var(--editor-section-spacing);
  align-self: start;
  min-width: 0;
}
header::after,
.editor-form > label::after,
.editor-form > .username-field::after,
.editor-form > .field-label-row::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  border-bottom: 1px solid currentColor;
  opacity: 0.3;
}
.editor-form > label,
.editor-form > .username-field,
.editor-form > .field-label-row {
  position: relative;
  padding-bottom: calc(var(--editor-section-spacing) + 1px);
}
.export-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.export-actions > button + button {
  margin-top: 14px;
}
.editor-form .generation-error {
  margin: 0;
  font-size: 12px;
  text-align: center;
}
.editor-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.username-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-label-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
.field-label-row > label {
  flex-shrink: 0;
}
.field-hint {
  min-width: 0;
  font-size: 12px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.editor-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.editor-preview h2 {
  margin: 0;
  font: inherit;
  text-align: center;
}
.editor-form .toggle {
  flex-direction: row;
  align-items: center;
}
.editor-form p {
  font-size: 14px;
}
input:not([type='checkbox']),
select {
  width: 100%;
  border: 1px solid #a78bfa;
  border-radius: 8px;
  padding: 10px;
  background: white;
  color: #111;
}
.editor-form button {
  padding: 12px;
  border-radius: 12px;
  background: #7c3aed;
  color: white;
}
button:disabled {
  opacity: 0.4;
}
.export-node {
  position: fixed;
  left: -10000px;
  top: 0;
  width: 640px;
}
@media (min-width: 1024px) {
  .editor-layout {
    grid-template-columns: clamp(220px, calc(100% - 424px), 320px) minmax(0, 400px);
  }
}
</style>
