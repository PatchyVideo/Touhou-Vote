<template>
  <ExportVoteImageDialog
    accent="purple"
    :button-label="buttonLabel"
    :card-title="`${userName}的角色部门投票`"
    file-name-prefix="th-vote"
    share-title="我的东方人气投票"
    :prepare="prepare"
    :generating-text="generatingText"
  >
    <!-- 本命角色卡片 -->
    <div v-if="honmeiCharacter" class="mb-12">
      <div
        class="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-lg"
        :style="{ background: darkenColor(honmeiCharacter.color, 0.2) }"
      >
        <!-- 本命斜角标签 -->
        <div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
          <div
            class="absolute top-5 -right-12 w-40 h-9 bg-black bg-opacity-30 flex items-center justify-center transform rotate-45 shadow-sm"
          >
            <!-- -mt-1.5 抵消字体上方留白，让文字在色块里视觉居中 -->
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
      <div v-for="char in otherCharacters" :key="char.id" class="flex flex-col items-center text-center">
        <!-- 圆形头像外框 -->
        <div class="w-32 h-32 rounded-full p-1 border-4 mb-4 shadow-sm" :style="{ borderColor: char.color }">
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
  </ExportVoteImageDialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ExportVoteImageDialog from './ExportVoteImageDialog.vue'
import { getExportCharacterData, getExportCharacterDataFromDataSource } from '@/common/lib/exportVoteData'
import { characterList } from '@/vote-character/lib/characterList'
import { username } from '@/home/lib/user'
import { getExportAssetUrl } from '@/common/lib/exportAssetUrl'
import { darkenColor, normalizeColor } from '@/common/lib/exportCardColor'
import { useVoteCardData } from '@/common/lib/useVoteCardData'

// 触发按钮文案可以被调用方改写（提交成功页用的是「生成分享图」）。
withDefaults(defineProps<{ buttonLabel?: string }>(), { buttonLabel: '导出角色投票为图片' })

const userName = computed(() => username.value || '匿名用户')

const {
  rows: voteCharacterData,
  generatingText,
  prepare,
} = useVoteCardData({
  loadLocal: getExportCharacterData,
  loadFromDataSource: getExportCharacterDataFromDataSource,
})

// 投票只存了 id / 本命 / 理由，名字、作品、配色、立绘都要回 characterList 里补。
const fullCharacterData = computed(() =>
  voteCharacterData.value.map((voteChar) => {
    const fullChar = characterList.value.find((c) => c.id === voteChar.id)
    return {
      id: voteChar.id,
      name: fullChar?.name || '未知角色',
      works: fullChar?.work || [],
      color: normalizeColor(fullChar?.color),
      image: getExportAssetUrl(fullChar?.image || ''),
      isHonmei: voteChar.isHonmei,
      reason: voteChar.reason || '',
    }
  })
)

const honmeiCharacter = computed(() => fullCharacterData.value.find((char) => char.isHonmei))
const otherCharacters = computed(() => fullCharacterData.value.filter((char) => !char.isHonmei))
</script>
