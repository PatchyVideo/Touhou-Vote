<!--
  导出投票卡片的通用外壳：触发按钮、预览弹层、离屏卡片容器和卡片的固定部分（标题栏 + 页脚）。
  角色 / 音乐 / CP 三个部门只有卡片正文不同，正文通过默认插槽传进来。
-->
<template>
  <div>
    <button class="px-4 py-2 text-white rounded-xl transition" :class="accentStyle.button" @click="openExport">
      <icon-uil-image-download class="inline-block mr-2" />
      {{ buttonLabel }}
    </button>

    <!-- 预览对话框 -->
    <VoteMessageBox v-model:open="exportDialogOpen" :title="`第${voteYear}回 投票卡片`" close-button>
      <div class="space-y-4 p-2 flex flex-col items-center">
        <div v-if="generating" class="py-20 flex flex-col items-center">
          <icon-uil-spinner-alt class="text-4xl animate-spin mb-4" :class="accentStyle.spinner" />
          <p class="text-gray-500">{{ generatingText }}</p>
        </div>

        <div v-else-if="previewImageUrl" class="w-full flex flex-col items-center">
          <div class="border rounded-lg shadow-inner bg-gray-50 overflow-hidden">
            <img :src="previewImageUrl" class="max-w-full max-h-[50vh] object-contain" />
          </div>
          <p class="text-xs text-gray-400 mt-2">提示：长按图片或点击下方按钮保存</p>
        </div>

        <div v-if="!generating && previewImageUrl" class="flex w-[30vh] gap-2">
          <button
            class="flex-1 py-1 text-sm text-white rounded-lg font-semibold"
            :class="accentStyle.save"
            @click="downloadImage"
          >
            保存图片
          </button>
          <button
            v-if="canShare"
            class="flex-1 py-1 text-sm bg-pink-500 text-white rounded-lg font-semibold"
            @click="shareImage"
          >
            分享
          </button>
        </div>
      </div>

      <!-- 离屏渲染区域（真正被截图的内容） -->
      <div style="position: absolute; left: -9999px; top: 0;">
        <div ref="cardRef" class="w-[640px] bg-white p-10 flex flex-col font-sans" style="min-height: 1100px;">
          <!-- 顶部标题 -->
          <div class="flex justify-between items-end mb-10">
            <h1 class="text-3xl font-black text-black">{{ cardTitle }}</h1>
            <span class="text-gray-400 text-lg font-bold">第{{ voteYear }}回中文东方人气投票</span>
          </div>

          <slot />

          <ExportCardFooter />
        </div>
      </div>
    </VoteMessageBox>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import VoteMessageBox from './VoteMessageBox.vue'
import ExportCardFooter from './ExportCardFooter.vue'
import { voteYear } from '@/common/lib/voteYear'
import { useVoteImageExport } from '@/common/lib/useVoteImageExport'

// 各部门的配色。写成完整类名的字面量，WindiCSS 才扫得到（拼接出来的类名不会被生成）。
const ACCENT_STYLES = {
  purple: { button: 'bg-purple-600 hover:bg-purple-700', save: 'bg-purple-600', spinner: 'text-purple-500' },
  blue: { button: 'bg-blue-600 hover:bg-blue-700', save: 'bg-blue-600', spinner: 'text-blue-500' },
  pink: { button: 'bg-pink-600 hover:bg-pink-700', save: 'bg-pink-600', spinner: 'text-pink-500' },
} as const

export type ExportAccent = keyof typeof ACCENT_STYLES

const props = defineProps<{
  accent: ExportAccent
  /** 触发按钮上的文案，例如「导出角色投票为图片」。 */
  buttonLabel: string
  /** 卡片左上角的大标题，例如「XXX的角色部门投票」。 */
  cardTitle: string
  /** 下载文件名前缀，最终为 `<前缀>-<时间戳>.png`。 */
  fileNamePrefix: string
  shareTitle: string
  /** 生成前的准备工作（拉候选表、拉本人投票）；抛出中止错误即取消本次导出。 */
  prepare: () => Promise<void>
  generatingText: string
}>()

const accentStyle = computed(() => ACCENT_STYLES[props.accent])

const cardRef = ref<HTMLElement>()

const { canShare, downloadImage, exportDialogOpen, generating, openExport, previewImageUrl, shareImage } =
  useVoteImageExport({
    cardRef,
    fileName: () => `${props.fileNamePrefix}-${Date.now()}.png`,
    shareTitle: props.shareTitle,
    prepare: () => props.prepare(),
  })

</script>
