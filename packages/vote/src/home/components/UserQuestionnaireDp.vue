<template>
  <div class="page"></div>
  <div class="flex flex-col gap-4">
    <div v-if="isQuestionnaireAllDoneV2" class="text-lg">
      问卷填写完成了！您可以继续填写，或在左栏选择"参与投票"开始投票
    </div>
    <div v-else class="text-lg">在开始投票之前，您需要完成所有必填问卷：</div>
    <div v-for="category in ['main', 'extra']" :key="category">
      <template v-if="questionnairesByCategory[category] && questionnairesByCategory[category].length">
        <div class="flex flex-nowrap items-end gap-2">
          <h2 class="text-xl">{{ categoryDisplay[category]?.name }}</h2>
          <span>{{ categoryDisplay[category]?.desc }}</span>
        </div>
        <div class="flex flex-wrap gap-3 mt-1">
          <RouterLink
            v-for="questionnaire in questionnairesByCategory[category]"
            :key="questionnaire.id"
            class="flex flex-row items-center gap-1 px-4 py-2 rounded-xl border-2 cursor-pointer border-accent-color-300 hover:shadow hover:border-accent-color-600 transition-all ease-in-out"
            :to="{ path: '/questionnaire', query: { questionnaireId: questionnaire.id } }"
          >
            <img
              class="w-32 h-32 object-cover"
              :src="questionnaireDisplayByKey[questionnaire.key]?.image ?? ''"
            />
            <div>
              <CompleteTag :complete="isQuestionnaireDoneV2(questionnaire.id)" />
              <h3 class="text-2xl max-w-17ch">
                {{ questionnaireDisplayByKey[questionnaire.key]?.name ?? questionnaire.title }}
              </h3>
              <span>{{ questionnaireDisplayByKey[questionnaire.key]?.desc ?? questionnaire.introduction }}</span>
            </div>
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { questionnaires, isQuestionnaireDoneV2, isQuestionnaireAllDoneV2 } from '@/questionnaire/lib/questionnaireStateV2'
import { questionnaireDisplayByKey, categoryDisplay } from '@/home/lib/questionnaireNameById'
import { username } from '../lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import CompleteTag from '@/home/components/CompleteTag.vue'

setSiteTitle(String(username.value))

const questionnairesByCategory = computed(() => {
  const result: Record<string, typeof questionnaires.value> = {}
  for (const q of questionnaires.value) {
    if (!result[q.category]) result[q.category] = []
    result[q.category].push(q)
  }
  // Sort by order within each category
  for (const cat of Object.keys(result)) {
    result[cat] = result[cat].slice().sort((a, b) => a.order - b.order)
  }
  return result
})
</script>
