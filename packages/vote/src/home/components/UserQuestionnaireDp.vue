<template>
  <div class="page"></div>
  <div class="flex flex-col gap-4">
    <div v-if="IsQuestionnaireAllDone" class="text-lg">
      问卷填写完成了！您可以继续填写，或在左栏选择“参与投票”开始投票
    </div>
    <div v-else class="text-lg">在开始投票之前，您需要至少填写下列问卷中的3个（2+1）：</div>
    <div v-for="(children, catogory) in questionnaire" :key="catogory">
      <div class="flex flex-nowrap items-end gap-2">
        <h2 class="text-xl" v-text="questionnaireNameById[catogory].name"></h2>
        <span v-text="questionnaireNameById[catogory].desc"></span>
      </div>
      <div class="flex flex-wrap gap-3 mt-1">
        <RouterLink
          v-for="(_child, childId) in children"
          :key="childId"
          class="flex flex-row items-center gap-1 px-4 py-2 rounded-xl border-2 border-accent-color-400 cursor-pointer"
          :to="{ path: '/questionnaire', query: { bigQuestionnaire: catogory, smallQuestionnaire: childId } }"
        >
          <img class="w-32 h-32 object-cover" :src="questionnaireNameById[catogory].children[childId].image" />
          <div>
            <span
              v-if="IsQuestionnaireDone(catogory as string, childId as string)"
              class="px-1 text-emerald-600 rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
              >已填写</span
            >
            <span v-else class="px-1 text-amber-600 rounded border border-amber-300 bg-amber-50 bg-opacity-50"
              >未填写</span
            >
            <h3 class="text-2xl max-w-17ch" v-text="questionnaireNameById[catogory].children[childId].name"></h3>
            <span v-text="questionnaireNameById[catogory].children[childId].desc"></span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { questionnaire } from '@/questionnaire/lib/questionnaire'
import { IsQuestionnaireAllDone, IsQuestionnaireDone } from '@/questionnaire/lib/questionnaireData'
import { questionnaireNameById } from '@/home/lib/questionnaireNameById'
import { username } from '../lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'

setSiteTitle(String(username.value))
</script>
