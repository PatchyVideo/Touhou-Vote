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
          class="flex flex-row items-center gap-1 px-4 py-2 rounded-xl border-2 cursor-pointer border-accent-color-300 hover:shadow hover:border-accent-color-600 transition-all ease-in-out"
          :to="{ path: '/questionnaire', query: { bigQuestionnaire: catogory, smallQuestionnaire: childId } }"
        >
          <img class="w-32 h-32 object-cover" :src="questionnaireNameById[catogory].children[childId].image" />
          <div>
            <CompleteTag :complete="IsQuestionnaireDone(catogory as string, childId as string)" />
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
import CompleteTag from '@/home/components/CompleteTag.vue'

setSiteTitle(String(username.value))
</script>
