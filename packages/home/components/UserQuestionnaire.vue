<template>
  <div class="overflow-auto">
    <!-- Main Content -->
    <div class="w-full p-3 space-y-2">
      <div
        class="
          text-accent-color-600 text-lg text-right
          underline
          cursor-pointer
          transition transition-colors
          hover:text-accent-color-900
        "
        @click="openRuleMessageBox()"
      >
        ！问卷填写规则
      </div>
      <div
        v-for="(questionaire, index) in questionnaireKeyToName"
        :key="index"
        class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2"
      >
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img src="@/home/assets/DefaultAvatar.jpg" class="object-cover rounded" />
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
      <button
        v-if="props.deskTopReturn"
        class="w-full py-2 text-sm rounded text-white bg-accent-color-600"
        @click="returnBack()"
      >
        返回
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openRuleMessageBox } from '@/home/lib/questionnaireRule'
import { useRoute, useRouter } from 'vue-router'
import { questionnaireKeyToName, IsQuestionnaireDone } from '@/questionnaire/lib/questionnaireData'

const props = defineProps({
  deskTopReturn: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const router = useRouter()

function returnBack(): void {
  const query = JSON.parse(JSON.stringify(route.query))
  query.open = 0
  router.push({ path: route.path, query })
}

function gotoQuestionnaire(bigQuestionnaire: string, smallQuestionnaire: string): void {
  router.push({
    path: '/questionnaire',
    query: { bigQuestionnaire: bigQuestionnaire, smallQuestionnaire: smallQuestionnaire },
  })
}
</script>


