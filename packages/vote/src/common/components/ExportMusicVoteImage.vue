<template>
  <ExportVoteImageDialog
    accent="blue"
    :button-label="buttonLabel"
    :card-title="`${userName}的音乐部门投票`"
    file-name-prefix="th-music-vote"
    share-title="我的东方人气投票"
    :prepare="prepare"
    :generating-text="generatingText"
  >
    <!-- 本命音乐卡片 -->
    <div v-if="honmeiMusic" class="mb-12">
      <div
        class="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-lg"
        :style="{ background: darkenColor(honmeiMusic.color, 0.2) }"
      >
        <!-- 本命斜角标签 -->
        <div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
          <div
            class="absolute top-5 -right-12 w-40 h-9 bg-black bg-opacity-30 flex items-center justify-center transform rotate-45 shadow-sm"
          >
            <span
              class="text-white text-lg font-black tracking-[0.12em] uppercase leading-tight -mt-1 select-none text-center"
            >
              本命票
            </span>
          </div>
        </div>

        <div class="flex items-center gap-8">
          <!-- 曲绘 -->
          <div class="w-36 h-36 rounded-full border-4 border-white border-opacity-60 overflow-hidden flex-shrink-0 bg-white">
            <img :src="honmeiMusic.image" class="w-full h-full object-cover" />
          </div>
          <!-- 曲目信息 -->
          <div class="flex-1 min-w-0">
            <h2 class="text-5xl font-black mb-3 break-words whitespace-normal text-white">{{ honmeiMusic.name }}</h2>
            <p class="text-xl font-bold opacity-90 break-words whitespace-normal text-white">
              {{ honmeiMusic.origname }} / {{ honmeiMusic.album }}
            </p>
          </div>
        </div>

        <!-- 理由区域 -->
        <div v-if="honmeiMusic.reason" class="mt-8 pt-5 border-t border-white border-opacity-30">
          <p class="text-xl leading-relaxed opacity-95 break-words whitespace-normal text-white text-left -mt-1">
            "{{ honmeiMusic.reason }}"
          </p>
        </div>
      </div>
    </div>

    <!-- 其他音乐网格 -->
    <div class="grid grid-cols-3 gap-y-12 gap-x-6 mb-16">
      <div v-for="music in otherMusics" :key="music.id" class="flex flex-col items-center text-center">
        <!-- 圆形曲绘外框 -->
        <div class="w-32 h-32 rounded-full p-1 border-4 mb-4 shadow-sm" :style="{ borderColor: music.color }">
          <div class="w-full h-full rounded-full overflow-hidden bg-gray-100">
            <img :src="music.image" class="w-full h-full object-cover" />
          </div>
        </div>
        <!-- 曲名 -->
        <div class="text-2xl font-black text-black break-words whitespace-normal w-full px-2">
          {{ music.name }}
        </div>
      </div>
    </div>
  </ExportVoteImageDialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ExportVoteImageDialog from './ExportVoteImageDialog.vue'
import { getExportMusicData, getExportMusicDataFromDataSource } from '@/common/lib/exportVoteData'
import { musicList } from '@/vote-music/lib/musicList'
import { username } from '@/home/lib/user'
import { getExportAssetUrl } from '@/common/lib/exportAssetUrl'
import { darkenColor, getMusicColor } from '@/common/lib/exportCardColor'
import { useVoteCardData } from '@/common/lib/useVoteCardData'

// 触发按钮文案可以被调用方改写（提交成功页用的是「生成分享图」）。
withDefaults(defineProps<{ buttonLabel?: string }>(), { buttonLabel: '导出音乐投票为图片' })

const userName = computed(() => username.value || '匿名用户')

const {
  rows: voteMusicData,
  generatingText,
  prepare,
} = useVoteCardData({
  loadLocal: getExportMusicData,
  loadFromDataSource: getExportMusicDataFromDataSource,
})

// 投票只存了 id / 本命 / 理由，曲名、原名、专辑、曲绘都要回 musicList 里补。
const fullMusicData = computed(() =>
  voteMusicData.value.map((voteMusic) => {
    const fullMusic = musicList.value.find((m) => m.id === voteMusic.id)
    return {
      id: voteMusic.id,
      name: fullMusic?.name || '未知曲目',
      origname: fullMusic?.origname || '',
      album: fullMusic?.album || '',
      image: getExportAssetUrl(fullMusic?.image || ''),
      color: getMusicColor(fullMusic?.name || voteMusic.id),
      isHonmei: voteMusic.isHonmei,
      reason: voteMusic.reason || '',
    }
  })
)

const honmeiMusic = computed(() => fullMusicData.value.find((music) => music.isHonmei))
const otherMusics = computed(() => fullMusicData.value.filter((music) => !music.isHonmei))
</script>
