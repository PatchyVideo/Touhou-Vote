<template>
  <div class="overflow-auto">
    <!-- Main Content -->
    <div class="w-full p-3 space-y-2">
      <div
        v-for="(questionaire, index) in questionnaireKeyToName"
        :key="index"
        class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2"
      >
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img :src="imageListForSmallQuestionnaire[index]" class="object-cover rounded" />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="text-base">
              {{ questionaire.name }}
              <label
                v-if="IsQuestionnaireDone(questionaire.bigQuestionnaire, questionaire.smallQuestionnaire)"
                class="p-0.5 rounded text-xs shadow bg-red-500 text-white"
                >完成</label
              >
            </div>
          </div>
          <div class="w-full text-right">
            <button
              class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600 xl:px-3 xl:py-2"
              @click="gotoQuestionnaire(questionaire.bigQuestionnaire, questionaire.smallQuestionnaire)"
            >
              开始填写
            </button>
          </div>
        </div>
      </div>
      <div
        class="text-accent-color-600 text-lg text-right underline cursor-pointer transition transition-colors hover:text-accent-color-900"
        @click="OpenConfirmedNotice()"
      >
        ！问卷填写规则
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ruleMessageBoxOpen } from '@/home/lib/questionnaireRule'
import { useRouter } from 'vue-router'
import { IsQuestionnaireDone, questionnaireKeyToName } from '@/questionnaire/lib/questionnaireData'

const router = useRouter()

function OpenConfirmedNotice() {
  ruleMessageBoxOpen.value = true
}

function gotoQuestionnaire(bigQuestionnaire: string, smallQuestionnaire: string): void {
  router.push({
    path: '/questionnaire',
    query: { bigQuestionnaire: bigQuestionnaire, smallQuestionnaire: smallQuestionnaire },
  })
}

const imageListForSmallQuestionnaire = [
  'https://upload.thwiki.cc/3/32/THBWiki-LOGO-%E5%85%AB%E4%BA%91%E7%B4%AB.png',
  'https://upload.thwiki.cc/b/b7/THBWiki-LOGO-ZUN.png',
  'https://upload.thwiki.cc/f/f1/THBWiki-LOGO-BigSight.png',
  'https://upload.thwiki.cc/8/84/THBWiki-LOGO-%E7%A5%B8%E7%81%B5%E6%A2%A6.png',
  'https://upload.thwiki.cc/3/34/THBWiki-LOGO-%E9%98%B4%E9%98%B3%E7%8E%89.png',
  'https://upload.thwiki.cc/0/05/THBWiki-LOGO-%E8%A7%92%E5%B7%9D%E4%B9%A6%E5%BA%97.png',
  'https://upload.thwiki.cc/7/7e/%E6%82%94%E6%82%9F%E6%A3%92.png',
  'https://upload.thwiki.cc/c/c1/Wiki%E6%97%A0%E5%AD%97.png',
]
</script>
