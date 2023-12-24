<template>
  <div class="overflow-auto max-h-[calc(100vh-44px)]">
    <!-- Main Content -->
    <div class="w-full p-3 space-y-2">
      <div v-for="(children, catogory) in questionnaire" :key="catogory">
        <div class="flex flex-nowrap items-end border-b-1 border-gray-700 space-x-2">
          <h2 class="text-base font-bold whitespace-nowrap">{{ questionnaireNameById[catogory].name }}</h2>
          <span class="text-sm truncate">{{ questionnaireNameById[catogory].desc }}</span>
        </div>
        <div
          v-for="(_child, childId) in children"
          :key="childId"
          class="baseBoxRoundedShadow flex w-full p-0.5 mt-2"
          @click="gotoQuestionnaire(catogory as string, childId as string)"
        >
          <div class="w-1/3 p-0.5 overflow-hidden rounded-xl">
            <div class="w-full aspect-1/1">
              <img :src="questionnaireNameById[catogory].children[childId].image" class="object-cover" />
            </div>
          </div>
          <div class="w-2/3 p-0.5 flex flex-wrap content-between">
            <div class="w-full space-y-0.5">
              <div class="w-full flex items-center space-x-2">
                <div class="text-xl truncate">
                  {{ questionnaireNameById[catogory].children[childId].name }}
                </div>
                <CompleteTag :complete="IsQuestionnaireDone(catogory as string, childId as string)" />
              </div>
              <span v-text="questionnaireNameById[catogory].children[childId].desc"></span>
            </div>
            <div class="w-full text-right">
              <button class="px-2 py-0.5 text-sm xl:px-3 xl:py-2">开始填写</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { questionnaire } from '@/questionnaire/lib/questionnaire'
import { IsQuestionnaireDone } from '@/questionnaire/lib/questionnaireData'
import { questionnaireNameById } from '@/home/lib/questionnaireNameById'
import CompleteTag from '@/home/components/CompleteTag.vue'

const router = useRouter()

function gotoQuestionnaire(bigQuestionnaire: string, smallQuestionnaire: string): void {
  router.push({
    path: '/questionnaire',
    query: { bigQuestionnaire: bigQuestionnaire, smallQuestionnaire: smallQuestionnaire },
  })
}
</script>
