<template>
  <ExportVoteImageDialog
    accent="pink"
    button-label="导出CP投票为图片"
    :card-title="`${userName}的CP组合投票`"
    file-name-prefix="th-cp-vote"
    share-title="我的东方人气CP投票"
    :prepare="prepare"
    :generating-text="generatingText"
  >
    <!-- 本命CP卡片 -->
    <div v-if="honmeiCouple" class="mb-10">
      <div
        class="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-lg"
        :style="{ background: darkenColor(honmeiThemeColor, 0.18) }"
      >
        <div class="absolute inset-0 pointer-events-none opacity-40" :style="{ background: HONMEI_HIGHLIGHT }" />

        <!-- 本命斜角标签 -->
        <div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
          <div
            class="absolute top-5 -right-12 w-40 h-9 bg-black bg-opacity-30 flex items-center justify-center transform rotate-45 shadow-sm"
          >
            <span class="text-white text-xl font-black tracking-[0.2em] uppercase leading-none -mt-1.5 select-none">
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
                :style="{ background: honmeiThemeColor, clipPath: ACTIVE_CLIP_PATH }"
              >
                <span class="text-white text-xs font-black tracking-widest">主动</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CP名字 -->
        <div class="text-center mb-6 relative">
          <h2 class="text-4xl font-black mb-2 text-white">{{ coupleName(honmeiCouple) }}</h2>
          <p class="text-lg font-bold opacity-90 text-white">{{ coupleWorks(honmeiCouple) }}</p>
        </div>

        <!-- 理由区域 -->
        <div v-if="honmeiCouple.reason" class="pt-5 border-t border-white border-opacity-30 relative">
          <p class="text-xl leading-relaxed opacity-95 break-words whitespace-normal text-white text-left -mt-1">
            "{{ honmeiCouple.reason }}"
          </p>
        </div>
      </div>
    </div>

    <!-- 其他CP：一行一个卡片 -->
    <div class="flex flex-col gap-6 mb-16">
      <div
        v-for="(cp, cpIndex) in otherCouples"
        :key="cpIndex"
        class="rounded-2xl p-5 shadow-md overflow-hidden relative"
        :style="{ background: darkenColor(cpThemeColor(cp), 0.12) }"
      >
        <div class="absolute inset-0 pointer-events-none opacity-35" :style="{ background: OTHER_HIGHLIGHT }" />

        <div class="relative">
          <!-- 角色展示：2 或 3 个均匀排布 -->
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
                  :style="{ background: cpThemeColor(cp), clipPath: ACTIVE_CLIP_PATH }"
                >
                  <span class="text-white text-[10px] font-black tracking-widest">主动</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CP名字 -->
          <div class="text-center mt-4">
            <div class="text-xl font-black text-white break-words whitespace-normal px-2 drop-shadow">
              {{ coupleName(cp) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ExportVoteImageDialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ExportVoteImageDialog from './ExportVoteImageDialog.vue'
import { getExportCoupleData, getExportCoupleDataFromDataSource } from '@/common/lib/exportVoteData'
import { characterList } from '@/vote-character/lib/characterList'
import { username } from '@/home/lib/user'
import { getExportAssetUrl } from '@/common/lib/exportAssetUrl'
import { darkenColor, normalizeColor } from '@/common/lib/exportCardColor'
import { useVoteCardData } from '@/common/lib/useVoteCardData'

const DEFAULT_THEME_COLOR = '#FC4328'
// 卡片上方的柔光，纯装饰。
const HONMEI_HIGHLIGHT =
  'radial-gradient(900px 280px at 20% 10%, rgba(255,255,255,.35), transparent 60%), radial-gradient(900px 280px at 80% 0%, rgba(255,255,255,.18), transparent 55%)'
const OTHER_HIGHLIGHT =
  'radial-gradient(700px 220px at 15% 0%, rgba(255,255,255,.30), transparent 60%), radial-gradient(700px 220px at 90% -10%, rgba(255,255,255,.15), transparent 55%)'
// 头像下沿的弓形「主动」标。
const ACTIVE_CLIP_PATH = 'ellipse(70% 80% at 50% 100%)'

type FullCoupleData = {
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

const userName = computed(() => username.value || '匿名用户')

const {
  rows: voteCoupleData,
  generatingText,
  prepare,
} = useVoteCardData({
  loadLocal: getExportCoupleData,
  loadFromDataSource: getExportCoupleDataFromDataSource,
})

// 投票只存了三个角色 id 和主动方 id，展示信息要回 characterList 里补。
const fullCoupleData = computed<FullCoupleData[]>(() =>
  voteCoupleData.value.map((cp) => {
    const members = [cp.idA, cp.idB, cp.idC].map((id) => characterList.value.find((c) => c.id === id))

    return {
      // 主动方在这一组里的下标；没填主动方时为 -1。
      activeIndex: cp.active ? members.findIndex((c) => c?.id === cp.active) : -1,
      isHonmei: cp.isHonmei,
      reason: cp.reason || '',
      // 空位用 id '0' 占，两人 CP 会在这里被滤掉第三个。
      characters: members
        .filter((c) => c && c.id !== '0')
        .map((c) => ({
          id: c!.id,
          name: c!.name,
          works: c!.work || [],
          color: normalizeColor(c!.color),
          image: getExportAssetUrl(c!.image || ''),
        })),
    }
  })
)

const honmeiCouple = computed(() => fullCoupleData.value.find((cp) => cp.isHonmei))
const otherCouples = computed(() => fullCoupleData.value.filter((cp) => !cp.isHonmei))

/** 每张卡片的主题色取第一个角色的颜色。 */
function cpThemeColor(cp: FullCoupleData) {
  return cp.characters[0]?.color || DEFAULT_THEME_COLOR
}

const honmeiThemeColor = computed(() =>
  honmeiCouple.value ? cpThemeColor(honmeiCouple.value) : DEFAULT_THEME_COLOR
)

function coupleName(cp: FullCoupleData) {
  return cp.characters.map((c) => c.name).join(' × ')
}

function coupleWorks(cp: FullCoupleData) {
  return cp.characters.map((c) => c.works.join(' / ')).join(' | ')
}
</script>
