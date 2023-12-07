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
          class="flex w-full p-0.5 shadow rounded bg-subaccent bg-opacity-90 mt-2"
        >
          <div class="w-1/3 p-0.5 overflow-hidden rounded">
            <div class="w-full aspect-1/1">
              <img :src="questionnaireNameById[catogory].children[childId].image" class="object-cover rounded" />
            </div>
          </div>
          <div class="w-2/3 p-0.5 flex flex-wrap content-between">
            <div class="w-full space-y-0.5">
              <div class="w-full flex items-center space-x-2">
                <div class="text-xl truncate">
                  {{ questionnaireNameById[catogory].children[childId].name }}
                </div>
                <span
                  v-if="IsQuestionnaireDone(catogory as string, childId as string)"
                  class="px-1 text-emerald-600 truncate rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
                  >已填写
                </span>
                <span
                  v-else
                  class="px-1 text-amber-600 truncate rounded border border-amber-300 bg-amber-50 bg-opacity-50"
                  >未填写
                </span>
              </div>
              <span v-text="questionnaireNameById[catogory].children[childId].desc"></span>
            </div>
            <div class="w-full text-right">
              <button
                class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600 xl:px-3 xl:py-2"
                @click="gotoQuestionnaire(catogory as string, childId as string)"
              >
                开始填写
              </button>
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

const router = useRouter()

function gotoQuestionnaire(bigQuestionnaire: string, smallQuestionnaire: string): void {
  router.push({
    path: '/questionnaire',
    query: { bigQuestionnaire: bigQuestionnaire, smallQuestionnaire: smallQuestionnaire },
  })
}
</script>
