<template>
  <div class="w-full">
    <button
      class="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
      @click="handleOpenExport"
    >
      <icon-uil-image-download class="inline-block mr-2" />
      导出角色投票为图片
    </button>

    <!-- 预览对话框 -->
    <VoteMessageBox v-model:open="exportDialogOpen" :title="`第${voteYear}回 投票卡片`" close-button>
      <div class="space-y-4 p-2 flex flex-col items-center">
        <div v-if="generating" class="py-20 flex flex-col items-center">
          <icon-uil-spinner-alt class="text-4xl animate-spin text-purple-500 mb-4" />
          <p class="text-gray-500">{{ generatingText }}</p>
        </div>

         <div v-else-if="previewImageUrl" class="w-full flex flex-col items-center">
          <div class="border rounded-lg shadow-inner bg-gray-50 overflow-hidden">
            <img :src="previewImageUrl" class="max-w-full max-h-[50vh] object-contain" />
          </div>
          <p class="text-xs text-gray-400 mt-2">提示：长按图片或点击下方按钮保存</p>
        </div>

        <div v-if="!generating && previewImageUrl" class="flex w-[30vh] gap-2">
          <button class="flex-1 py-1 text-sm bg-purple-600 text-white rounded-lg font-semibold" @click="downloadImage">
            保存图片
          </button>
          <button v-if="canShare" class="flex-1 py-1 text-sm bg-pink-500 text-white rounded-lg font-semibold" @click="shareImage">
            分享
          </button>
        </div>
      </div>

      <!-- 离屏渲染区域 (真正生成的图片内容) -->
      <div style="position: absolute; left: -9999px; top: 0;">
        <div 
          ref="cardRef" 
          class="w-[640px] bg-white p-10 flex flex-col font-sans"
          style="min-height: 1100px;"
        >
          <!-- 顶部标题 -->
          <div class="flex justify-between items-end mb-10">
            <h1 class="text-3xl font-black text-black">
              {{ userName }}的角色部门投票
            </h1>
            <span class="text-gray-400 text-lg font-bold">
              第{{ voteYear }}回中文东方人气投票
            </span>
          </div>

          <!-- 本命角色卡片 -->
          <div v-if="honmeiCharacter" class="mb-12">
            <div 
              class="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-lg"
              :style="{ background: darkenColor(honmeiCharacter.color || '#C00000', 0.2) }"
            >
              <!-- 本命斜角标签 -->
              <div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
              <!-- 
                外层 Strip (色块): 
                1. shadow-sm: 增加层次
                2. top/right: 保持色块本身的几何对齐（基于 w-40 计算）
              -->
              <div class="absolute top-5 -right-12 w-40 h-9 bg-black bg-opacity-30 flex items-center justify-center transform rotate-45 shadow-sm">
                
                <!-- 
                  内层 Text (文字修正):
                  1. -mt-1 或 -mt-1.5: 这是关键！利用负外边距抵消字体的上方留白。
                  2. relative: 确保定位生效。
                  3. 如果字体留白非常大，试着把 -mt-1 改成 -mt-2 甚至更大，直到视觉居中。
                -->
                <span class="text-white text-xl font-black tracking-[0.2em] uppercase leading-none -mt-1.5 select-none">
                  本命票
                </span>
                
              </div>
            </div>
              <div class="flex items-center gap-8">
                <!-- 头像 -->
                <div class="w-36 h-36 rounded-full border-4 border-white border-opacity-60 overflow-hidden flex-shrink-0 bg-white">
                  <img :src="honmeiCharacter.image" class="w-full h-full object-cover" />
                </div>
                <!-- 名字信息 -->
                <div class="flex-1 min-w-0">
                  <h2 class="text-5xl font-black mb-3 break-words whitespace-normal text-white">{{ honmeiCharacter.name }}</h2>
                  <p class="text-xl font-bold opacity-90 break-words whitespace-normal text-white">
                    {{ honmeiCharacter.works.join(' / ') }}
                  </p>
                </div>
              </div>
              
              <!-- 理由区域 -->
              <div v-if="honmeiCharacter.reason" class="mt-8 pt-5 border-t border-white border-opacity-30">
                <p class="text-xl leading-relaxed opacity-95 break-words whitespace-normal text-white text-left -mt-1">
                  "{{ honmeiCharacter.reason }}"
                </p>
              </div>
            </div>
          </div>

          <!-- 其他角色网格 -->
          <div class="grid grid-cols-3 gap-y-12 gap-x-6 mb-16">
            <div 
              v-for="(char, index) in otherCharacters" 
              :key="char.id" 
              class="flex flex-col items-center text-center"
            >
              <!-- 圆形头像外框 -->
              <div 
                class="w-32 h-32 rounded-full p-1 border-4 mb-4 shadow-sm"
                :style="{ borderColor: char.color }"
              >
                <div class="w-full h-full rounded-full overflow-hidden bg-gray-100">
                  <img :src="char.image" class="w-full h-full object-cover" />
                </div>
              </div>
              <!-- 名字 -->
              <div class="text-2xl font-black text-black break-words whitespace-normal w-full px-2">
                {{ char.name }}
              </div>
            </div>
          </div>

          <!-- 底部装饰信息 -->
          <div class="mt-auto pt-10 border-t-2 border-gray-50 flex flex-col items-center text-gray-400">
            <div class="w-36 h-36 mb-3 rounded-lg border-2 border-gray-100 bg-[linear-gradient(90deg,#f3f4f6_50%,transparent_50%),linear-gradient(#f3f4f6_50%,transparent_50%)] bg-[length:16px_16px] bg-[position:0_0,0_0] flex items-center justify-center">
              <div class="w-24 h-24 border-4 border-gray-500 bg-white flex items-center justify-center text-center text-xs leading-5 font-bold text-gray-500">
                TOUHOU
                <br />
                VOTE
              </div>
            </div>
            <p class="text-sm mb-4">打开 touhou.vote 参与投票</p>
            
            <div class="text-center space-y-1 font-medium">
              <p>
              投票链接：
              <span class="underline">https://touhou.vote</span>
              </p>
              <p>投票时间： xxxx年xx月xx日-xxxx年xx月xx日</p>
            </div>
          </div>
        </div>
      </div>
    </VoteMessageBox>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import VoteMessageBox from './VoteMessageBox.vue'
import { getExportCharacterData, getExportCharacterDataFromDataSource } from '@/common/lib/exportVoteData'
import { getDataSourceMode, type DataSourceMode } from '@/common/lib/voteDataSource'
import { characterList } from '@/vote-character/lib/characterList'
import { voteYear } from '@/common/lib/voteYear'
import { popMessageText } from '@/common/lib/popMessage'
import { username } from '@/home/lib/user'
import { getExportAssetUrl } from '@/common/lib/exportAssetUrl'
import { createVoteImageExportAbortError, useVoteImageExport } from '@/common/lib/useVoteImageExport'
import { loadVoteObjects, voteObjectsError } from '@/common/lib/voteObjectsDataSource'

const userName = computed(() => username.value || '匿名用户')

const cardRef = ref<HTMLElement>()
const fetchingVoteData = ref(false)

const voteCharacterData = ref(getExportCharacterData())

function normalizeColor(input: string | undefined) {
  const fallback = '#FC4328'
  if (!input) return fallback
  const color = input.trim()
  const hexMatch = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(color)
  if (!hexMatch) return fallback
  const hex = hexMatch[1]
  const rgb = hex.length === 3
    ? hex.split('').map((c) => parseInt(c + c, 16))
    : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((c) => parseInt(c, 16))
  const luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255
  if (luminance > 0.9) return '#999999'
  return `#${hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex}`
}

const fullCharacterData = computed(() => {
  return voteCharacterData.value.map((voteChar: { id: string; isHonmei: boolean; reason: string }) => {
    const fullChar = characterList.value.find(c => c.id === voteChar.id)
    return {
      id: voteChar.id,
      name: fullChar?.name || '未知角色',
      works: fullChar?.work || [],
      color: normalizeColor(fullChar?.color),
      image: getExportAssetUrl(fullChar?.image || ''),
      isHonmei: voteChar.isHonmei,
      reason: voteChar.reason || ''
    }
  })
})

const honmeiCharacter = computed(() => {
  return fullCharacterData.value.find(char => char.isHonmei)
})

const otherCharacters = computed(() => {
  return fullCharacterData.value.filter(char => !char.isHonmei)
})
const generatingText = computed(() => (fetchingVoteData.value ? '正在获取投票信息...' : '正在生成图片...'))

async function resolveVoteCharacterData() {
  const mode: DataSourceMode = getDataSourceMode()
  fetchingVoteData.value = true
  try {
    const { data, error } = await getExportCharacterDataFromDataSource(mode)
    if (error) {
      console.warn(`获取数据时遇到问题: ${error}`)
    }
    return data
  } catch (error) {
    console.error('获取投票数据失败:', error)
    popMessageText('获取投票信息失败，已使用本地数据')
    return getExportCharacterData()
  } finally {
    fetchingVoteData.value = false
  }
}

function darkenColor(input: string, amount: number) {
  const hexMatch = /^#([0-9a-fA-F]{6})$/.exec(input)
  if (!hexMatch) return input
  const hex = hexMatch[1]
  const rgb = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((c) => parseInt(c, 16))
  const scale = Math.max(0, Math.min(1, 1 - amount))
  const darker = rgb.map((v) => Math.max(0, Math.min(255, Math.round(v * scale))))
  return `#${darker.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

const {
  canShare,
  downloadImage,
  exportDialogOpen,
  generating,
  openExport: handleOpenExport,
  previewImageUrl,
  shareImage,
} = useVoteImageExport({
  cardRef,
  fileName: () => `th-vote-${Date.now()}.png`,
  shareTitle: '我的东方人气投票',
  prepare: async () => {
    await loadVoteObjects()
    if (voteObjectsError.value) {
      popMessageText('加载投票数据失败，请稍后重试')
      throw createVoteImageExportAbortError()
    }
    voteCharacterData.value = await resolveVoteCharacterData()
    if (!voteCharacterData.value.length) {
      popMessageText('你还没有投票数据，请先提交投票后再导出图片。')
      throw createVoteImageExportAbortError()
    }
  },
})
</script>
