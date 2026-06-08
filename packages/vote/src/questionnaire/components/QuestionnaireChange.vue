<template>
  <div
    class="baseBoxShadow fixed top-0 inset-x-0 lg:inset-x-auto lg:inset-y-0 2xl:top-15 2xl:bottom-0 lg:right-0 lg:w-1/3 2xl:w-1/4 max-h-100vh z-51 2xl:z-auto p-3 lg:p-10 rounded-b overflow-auto transform-gpu transition-transform 2xl:translate-x-0 duration-200 ease-in-out flex flex-col"
    :class="{ '-translate-y-full lg:translate-y-0 lg:translate-x-full': !open }"
  >
    <div
      v-for="questionnaire in questionnaireKeyToNameV2"
      :key="questionnaire.questionnaireId"
      class="baseBoxRoundedShadow w-full border border-accent-color-600 mb-2"
    >
      <div
        class="px-2 py-1 truncate cursor-pointer"
        @click="screenSizes['<2xl'] && selectAsQuestionnaireCurrent(questionnaire.questionnaireId)"
      >
        {{
          questionnaire.name +
          '（' +
          (getRuntime(questionnaire.questionnaireId)?.answeredCount ?? 0) +
          '/' +
          (getRuntime(questionnaire.questionnaireId)?.questionCount ?? 0) +
          '）'
        }}
      </div>
      <div
        :id="String(questionnaire.questionnaireId)"
        name="questionnaire"
        class="innerBox flex flex-wrap m-1 mt-0 transform transition-all duration-200 ease-in-out overflow-hidden"
      >
        <div
          v-for="(group, index2) in getRuntime(questionnaire.questionnaireId)?.visibleGroups ?? []"
          :key="group.id"
          class="rounded-full m-2 w-8 h-8 leading-8 text-center cursor-pointer shadow ring"
          :class="[
            group.done ? 'ring ring-accent-color-600 bg-accent-color-300 text-white' : ' ring-accent-color-100',
          ]"
          @click="changeQuestion(questionnaire.questionnaireId, index2)"
        >
          {{ index2 + 1 }}
        </div>
      </div>
    </div>
    <div
      v-if="screenSizes['<2xl']"
      class="text-right text-accent-color-300 hover:text-accent-color-600 cursor-pointer"
      @click="close()"
    >
      收起
    </div>
  </div>
  <Mask v-if="screenSizes['<2xl']" v-model:open="open" click-to-close />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { getRuntime, questionnaireKeyToNameV2 } from '@/questionnaire/lib/questionnaireStateV2'
import { screenSizes } from '@/tailwindcss'
import Mask from '@/common/components/Mask.vue'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
    requred: true,
  },
  questionnaireId: {
    type: Number,
    default: 0,
    requred: true,
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: string): void
  (event: 'changeQuestion', direction: 'forward' | 'back' | 'no'): void
}>()

const open = useVModel(props, 'open', emit)
watchEffect(() => {
  if (open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
  else {
    document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
    // Change to current questionnaire after close this component in mobile view
    screenSizes['<2xl'] &&
      // Waiting for animation
      setTimeout(() => {
        selectedQuestionnaire.value = props.questionnaireId
        selectAsQuestionnaireCurrent(selectedQuestionnaire.value)
      }, 200)
  }
})
function close(): void {
  open.value = false
}

const selectedQuestionnaire = ref<number>(props.questionnaireId)
watch(
  () => props.questionnaireId,
  (id) => {
    selectedQuestionnaire.value = id
  }
)

function selectAsQuestionnaireCurrent(questionnaireId: number): void {
  let SubContentAll = document.getElementsByName('questionnaire')
  SubContentAll.forEach((item) => {
    item.style.height = '0'
  })
  let openSubContent = document.getElementById(String(questionnaireId))
  if (openSubContent) openSubContent.style.height = openSubContent.scrollHeight + 'px'
  selectedQuestionnaire.value = questionnaireId
}
function unfoldAllQuestionnaire() {
  let SubContentAll = document.getElementsByName('questionnaire')
  SubContentAll.forEach((item) => {
    item.style.height = 'auto'
  })
}
onMounted(() => screenSizes['<2xl'] && selectAsQuestionnaireCurrent(selectedQuestionnaire.value))
window.onresize = () => {
  // 1536px: 2xl, screenSizes['<2xl'] does not respond timely
  window.innerWidth < 1536 ? selectAsQuestionnaireCurrent(selectedQuestionnaire.value) : unfoldAllQuestionnaire()
}

function changeQuestion(questionnaireId: number, index: number): void {
  emit('changeQuestion', 'no')
  const query = JSON.parse(JSON.stringify(route.query))
  query.number = index
  query.questionnaireId = questionnaireId
  delete query.bigQuestionnaire
  delete query.smallQuestionnaire
  router.push({ path: route.path, query })
  close()
}
</script>
