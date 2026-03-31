<template>
  <div class="w-full">
    <button
      class="px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
      @click="handleOpenExport"
    >
      <icon-uil-image-download class="inline-block mr-2" />
      导出CP投票为图片
    </button>

    <!-- 预览对话框 -->
    <VoteMessageBox v-model:open="exportDialogOpen" :title="`第${voteYear}回 投票卡片`" close-button>
      <div class="space-y-4 p-2 flex flex-col items-center">
        <div v-if="generating" class="py-20 flex flex-col items-center">
          <icon-uil-spinner-alt class="text-4xl animate-spin text-pink-500 mb-4" />
          <p class="text-gray-500">{{ generatingText }}</p>
        </div>

        <div v-else-if="previewImageUrl" class="w-full flex flex-col items-center">
          <div class="border rounded-lg shadow-inner bg-gray-50 overflow-hidden">
            <img :src="previewImageUrl" class="max-w-full max-h-[50vh] object-contain" />
          </div>
          <p class="text-xs text-gray-400 mt-2">提示：长按图片或点击下方按钮保存</p>
        </div>

        <div v-if="!generating && previewImageUrl" class="flex w-[30vh] gap-2">
          <button class="flex-1 py-1 text-sm bg-pink-600 text-white rounded-lg font-semibold" @click="downloadImage">
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

      <!-- 离屏渲染区域 (真正生成的图片内容) -->
      <div style="position: absolute; left: -9999px; top: 0;">
        <div ref="cardRef" class="w-[640px] bg-white p-10 flex flex-col font-sans" style="min-height: 1100px;">
          <!-- 顶部标题 -->
          <div class="flex justify-between items-end mb-10">
            <h1 class="text-3xl font-black text-black">
              {{ userName }}的CP组合投票
            </h1>
            <span class="text-gray-400 text-lg font-bold">
              第{{ voteYear }}回中文东方人气投票
            </span>
          </div>

          <!-- 本命CP卡片 -->
          <div v-if="honmeiCouple" class="mb-10">
            <div
              class="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-lg"
              :style="{ background: darkenColor(honmeiThemeColor, 0.18) }"
            >
              <!-- subtle highlight -->
              <div
                class="absolute inset-0 pointer-events-none opacity-40"
                :style="{
                  background:
                    'radial-gradient(900px 280px at 20% 10%, rgba(255,255,255,.35), transparent 60%), radial-gradient(900px 280px at 80% 0%, rgba(255,255,255,.18), transparent 55%)'
                }"
              />

              <!-- 本命斜角标签 -->
              <div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
                <div
                  class="absolute top-5 -right-12 w-40 h-9 bg-black bg-opacity-30 flex items-center justify-center transform rotate-45 shadow-sm"
                >
                  <span
                    class="text-white text-xl font-black tracking-[0.2em] uppercase leading-none -mt-1.5 select-none"
                  >
                    本命票
                  </span>
                </div>
              </div>

              <!-- 角色展示 -->
              <div class="flex items-center justify-center gap-6 mb-6">
                <div
                  v-for="(char, index) in honmeiCouple.characters"
                  :key="char.id"
                  class="flex-1 max-w-[160px] flex justify-center"
                >
                  <div class="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white border-opacity-60 bg-white">
                    <img :src="char.image" class="w-full h-full object-cover" />

                    <!-- 主动：下部弓形区域 -->
                    <div
                      v-if="honmeiCouple.activeIndex === index"
                      class="absolute left-0 right-0 bottom-0 h-[30%] flex items-center justify-center"
                      :style="{
                        background: honmeiThemeColor,
                        clipPath: 'ellipse(70% 80% at 50% 100%)'
                      }"
                    >
                      <span class="text-white text-xs font-black tracking-widest">主动</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CP名字 -->
              <div class="text-center mb-6 relative">
                <h2 class="text-4xl font-black mb-2 text-white">
                  {{ honmeiCouple.characters.map(c => c.name).join(' × ') }}
                </h2>
                <p class="text-lg font-bold opacity-90 text-white">
                  {{ honmeiCouple.characters.map(c => c.works.join(' / ')).join(' | ') }}
                </p>
              </div>

              <!-- 理由区域 -->
              <div v-if="honmeiCouple.reason" class="pt-5 border-t border-white border-opacity-30 relative">
                <p class="text-xl leading-relaxed opacity-95 break-words whitespace-normal text-white text-left -mt-1">
                  "{{ honmeiCouple.reason }}"
                </p>
              </div>
            </div>
          </div>

          <!-- 其他CP：改为纵向一行一个卡片 -->
          <div class="flex flex-col gap-6 mb-16">
            <div
              v-for="(cp, cpIndex) in otherCouples"
              :key="cpIndex"
              class="rounded-2xl p-5 shadow-md overflow-hidden relative"
              :style="{ background: darkenColor(cpThemeColor(cp), 0.12) }"
            >
              <!-- highlight -->
              <div
                class="absolute inset-0 pointer-events-none opacity-35"
                :style="{
                  background:
                    'radial-gradient(700px 220px at 15% 0%, rgba(255,255,255,.30), transparent 60%), radial-gradient(700px 220px at 90% -10%, rgba(255,255,255,.15), transparent 55%)'
                }"
              />

              <div class="relative">
                <!-- 角色展示：2或3个均匀排布 -->
                <div class="flex items-center justify-center gap-6">
                  <div
                    v-for="(char, charIndex) in cp.characters"
                    :key="char.id"
                    class="flex-1 max-w-[170px] flex justify-center"
                  >
                    <div class="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white border-opacity-60 bg-white">
                      <img :src="char.image" class="w-full h-full object-cover" />

                      <!-- 主动：下部弓形区域（用该卡片主题色） -->
                      <div
                        v-if="cp.activeIndex === charIndex"
                        class="absolute left-0 right-0 bottom-0 h-[32%] flex items-center justify-center"
                        :style="{
                          background: cpThemeColor(cp),
                          clipPath: 'ellipse(70% 80% at 50% 100%)'
                        }"
                      >
                        <span class="text-white text-[10px] font-black tracking-widest">主动</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- CP名字 -->
                <div class="text-center mt-4">
                  <div class="text-xl font-black text-white break-words whitespace-normal px-2 drop-shadow">
                    {{ cp.characters.map(c => c.name).join(' × ') }}
                  </div>
                </div>
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
import { getExportCoupleData, getExportCoupleDataFromDataSource } from '@/common/lib/exportVoteData'
import { getDataSourceMode, type DataSourceMode } from '@/common/lib/voteDataSource'
import { characterList } from '@/vote-character/lib/characterList'
import { voteYear } from '@/common/lib/voteYear'
import { popMessageText } from '@/common/lib/popMessage'
import { username } from '@/home/lib/user'
import { getExportAssetUrl } from '@/common/lib/exportAssetUrl'
import { createVoteImageExportAbortError, useVoteImageExport } from '@/common/lib/useVoteImageExport'

const userName = computed(() => username.value || '匿名用户')

const cardRef = ref<HTMLElement>()
const fetchingVoteData = ref(false)

// 定义CP数据类型（与GraphQL的CpSubmitQuery保持一致）
type CoupleData = {
  idA: string
  idB: string
  idC: string
  active: string | null | undefined
  isHonmei: boolean
  reason: string
}

const voteCoupleData = ref<CoupleData[]>(getExportCoupleData())

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

// 完整CP数据类型（包含角色信息）
type FullCoupleData = {
  idA: string
  idB: string
  idC: string
  activeIndex: number
  isHonmei: boolean
  reason: string
  characters: Array<{
    id: string
    name: string
    works: string[]
    color: string
    image: string
  }>
}

const fullCoupleData = computed<FullCoupleData[]>(() => {
  return voteCoupleData.value.map((cp) => {
    // 获取3个角色
    const charA = characterList.find(c => c.id === cp.idA)
    const charB = characterList.find(c => c.id === cp.idB)
    const charC = characterList.find(c => c.id === cp.idC)

    // 确定主动方索引
    const activeIndex = cp.active ? [charA, charB, charC].findIndex(c => c?.id === cp.active) : -1

    // 过滤出有效角色（两人/三人都支持）
    const characters = [charA, charB, charC]
      .filter(c => c && c.id !== '0')
      .map(c => ({
        id: c!.id,
        name: c!.name,
        works: c!.work || [],
        color: normalizeColor(c!.color),
        image: getExportAssetUrl(c!.image || '')
      }))

    return {
      idA: cp.idA,
      idB: cp.idB,
      idC: cp.idC,
      activeIndex,
      isHonmei: cp.isHonmei,
      reason: cp.reason || '',
      characters
    }
  })
})

const honmeiCouple = computed(() => {
  return fullCoupleData.value.find(cp => cp.isHonmei)
})

const otherCouples = computed(() => {
  return fullCoupleData.value.filter(cp => !cp.isHonmei)
})

const generatingText = computed(() => (fetchingVoteData.value ? '正在获取投票信息...' : '正在生成图片...'))

// 主题色：每个卡片取第一个角色的颜色
function cpThemeColor(cp: FullCoupleData) {
  return cp.characters[0]?.color || '#FC4328'
}

const honmeiThemeColor = computed(() => {
  return honmeiCouple.value ? cpThemeColor(honmeiCouple.value) : '#FC4328'
})

async function resolveVoteCoupleData() {
  const mode: DataSourceMode = getDataSourceMode()
  fetchingVoteData.value = true
  try {
    const { data, error } = await getExportCoupleDataFromDataSource(mode)
    if (error) {
      console.warn(`获取数据时遇到问题: ${error}`)
    }

    return data
  } catch (error) {
    console.error('获取投票数据失败:', error)
    popMessageText('获取投票信息失败，已使用本地数据')
    return getExportCoupleData()
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
  fileName: () => `th-cp-vote-${Date.now()}.png`,
  shareTitle: '我的东方人气CP投票',
  prepare: async () => {
    voteCoupleData.value = await resolveVoteCoupleData()
    if (!voteCoupleData.value.length) {
      popMessageText('你还没有投票数据，请先提交投票后再导出图片。')
      throw createVoteImageExportAbortError()
    }
  },
})
</script>
