<template>
  <div class="flex flex-col gap-4">
    <div v-for="(children, catogory) in questionnaire">
      <div class="flex flex-nowrap items-end gap-2">
        <h2 class="text-xl" v-text="nameById[catogory].name"></h2>
        <span class="text-gray-700" v-text="nameById[catogory].desc"></span>
      </div>
      <div class="flex flex-wrap gap-3 mt-1">
        <RouterLink
          v-for="(_child, childId) in children"
          class="flex flex-row items-center gap-1 px-4 py-2 rounded-xl border-2 border-accent-color-400 cursor-pointer"
          :to="{ path: '/questionnaire', query: { bigQuestionnaire: catogory, smallQuestionnaire: childId } }"
        >
          <img class="w-32 h-32 object-cover" :src="nameById[catogory].children[childId].image" />
          <div>
            <span
              v-if="IsQuestionnaireDone(catogory as string, childId as string)"
              class="px-1 text-emerald-600 rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
              >已填写</span
            >
            <span v-else class="px-1 text-amber-600 rounded border border-amber-300 bg-amber-50 bg-opacity-50"
              >未填写</span
            >
            <h3 class="text-black text-2xl max-w-17ch" v-text="nameById[catogory].children[childId].name"></h3>
            <span class="text-gray-700" v-text="nameById[catogory].children[childId].desc"></span>
          </div>
        </RouterLink>
      </div>
    </div>
    <div v-if="IsQuestionnaireAllDone" class="text-gray-800">
      问卷填写完成了！<RouterLink :to="{ path: '/', query: { tab: 1 } }">开始投票</RouterLink>
    </div>
    <div v-else class="text-gray-800">开始投票之前先填写问卷哦！</div>
  </div>
</template>

<script lang="ts" setup>
import { questionnaire } from '@/questionnaire/lib/questionnaire'
import { IsQuestionnaireAllDone, IsQuestionnaireDone } from '@/questionnaire/lib/questionnaireData'

const nameById: Record<
  string,
  {
    name: string
    desc: string
    children: Record<
      string,
      {
        name: string
        desc: string
        image: string
      }
    >
  }
> = {
  mainQuestionnaire: {
    name: '主问卷',
    desc: '必填问卷必须填写，分问卷选一填写',
    children: {
      requiredQuestionnaire: {
        name: '必填问卷',
        desc: '每个人都必填的问卷',
        image: 'https://upload.thwiki.cc/3/32/THBWiki-LOGO-%E5%85%AB%E4%BA%91%E7%B4%AB.png',
      },
      optionalQuestionnaire1: {
        name: '官作分问卷',
        desc: '适合对官作感兴趣的人填写',
        image: 'https://upload.thwiki.cc/b/b7/THBWiki-LOGO-ZUN.png',
      },
      optionalQuestionnaire2: {
        name: '二次创作分问卷',
        desc: '适合对二创感兴趣的人填写',
        image: 'https://upload.thwiki.cc/f/f1/THBWiki-LOGO-BigSight.png',
      },
    },
  },
  extraQuestionnaire: {
    name: '额外问卷',
    desc: '额外问卷中需选一填写',
    children: {
      exQuestionnaire1: {
        name: '二创深入了解问卷',
        desc: '适合二次创作者填写',
        image: 'https://upload.thwiki.cc/8/84/THBWiki-LOGO-%E7%A5%B8%E7%81%B5%E6%A2%A6.png',
      },
      exQuestionnaire2: {
        name: '官作通关深入了解',
        desc: '适合官作游戏玩家填写',
        image: 'https://upload.thwiki.cc/3/34/THBWiki-LOGO-%E9%98%B4%E9%98%B3%E7%8E%89.png',
      },
      exQuestionnaire3: {
        name: '展会观众与商业授权手游深入了解',
        desc: '适合展会观众和东方手游玩家填写',
        image: 'https://upload.thwiki.cc/0/05/THBWiki-LOGO-%E8%A7%92%E5%B7%9D%E4%B9%A6%E5%BA%97.png',
      },
      exQuestionnaire4: {
        name: '正版&盗版深入了解',
        desc: '适合对官方与二创作品感兴趣的人填写',
        image: 'https://upload.thwiki.cc/7/7e/%E6%82%94%E6%82%9F%E6%A3%92.png',
      },
      exQuestionnaire5: {
        name: '主办方附加问卷',
        desc: '适合对东方相关信息感兴趣的人填写',
        image: 'https://upload.thwiki.cc/c/c1/Wiki%E6%97%A0%E5%AD%97.png',
      },
    },
  },
}
</script>
