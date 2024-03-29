<template>
  <div
    class="baseBoxShadow fixed top-0 inset-x-0 lg:inset-x-auto lg:inset-y-0 2xl:top-15 2xl:bottom-0 lg:right-0 lg:w-1/3 2xl:w-1/4 max-h-100vh z-51 2xl:z-auto p-3 lg:p-10 rounded-b overflow-auto transform-gpu transition-transform 2xl:translate-x-0 duration-200 ease-in-out flex flex-col"
    :class="{ '-translate-y-full lg:translate-y-0 lg:translate-x-full': !open }"
  >
    <div
      v-for="(questionnaire, index) in questionnaireKeyToName"
      :key="index"
      class="baseBoxRoundedShadow w-full border border-accent-color-600 mb-2"
    >
      <div
        class="px-2 py-1 truncate cursor-pointer"
        @click="screenSizes['<2xl'] && selectAsQuestionnaireCurrent(questionnaire.smallQuestionnaire)"
      >
        {{
          questionnaire.name +
          '（' +
          questionDone[questionnaire.bigQuestionnaire][questionnaire.smallQuestionnaire].answers.filter(
            (item) => item.done
          ).length +
          '/' +
          questionDone[questionnaire.bigQuestionnaire][questionnaire.smallQuestionnaire].answers.length +
          '）'
        }}
      </div>
      <div
        :id="questionnaire.smallQuestionnaire"
        name="questionnaire"
        class="innerBox flex flex-wrap m-1 mt-0 transform transition-all duration-200 ease-in-out overflow-hidden"
      >
        <div
          v-for="(answer, index2) in questionDone[questionnaire.bigQuestionnaire][questionnaire.smallQuestionnaire]
            .answers"
          :key="index2"
          class="rounded-full m-2 w-8 h-8 leading-8 text-center cursor-pointer shadow ring"
          :class="[
            answer.done ? 'ring ring-accent-color-600 bg-accent-color-300 text-white' : ' ring-accent-color-100',
          ]"
          @click="changeQuestion(questionnaire.bigQuestionnaire, questionnaire.smallQuestionnaire, index2)"
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
import { questionDone, questionnaireKeyToName } from '@/questionnaire/lib/questionnaireData'
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
  bigQuestionnaire: {
    type: String,
    default: 'mainQuestionnaire',
    requred: true,
  },
  smallQuestionnaire: {
    type: String,
    default: 'requiredQuestionnaire',
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
        bigQuestionnaireCurrent.value = props.bigQuestionnaire
        smallQuestionnaireCurrent.value = props.smallQuestionnaire
        selectedQuestionnaire.value = props.smallQuestionnaire
        selectAsQuestionnaireCurrent(selectedQuestionnaire.value)
      }, 200)
  }
})
function close(): void {
  open.value = false
}

const bigQuestionnaireCurrent = ref(props.bigQuestionnaire)
const smallQuestionnaireCurrent = ref(props.smallQuestionnaire)
const selectedQuestionnaire = ref(props.smallQuestionnaire)
watch(selectedQuestionnaire, () => {
  bigQuestionnaireCurrent.value =
    questionnaireKeyToName.value.find((item) => item.smallQuestionnaire == selectedQuestionnaire.value)
      ?.bigQuestionnaire || questionnaireKeyToName.value[0].bigQuestionnaire
  smallQuestionnaireCurrent.value = selectedQuestionnaire.value
})
function selectAsQuestionnaireCurrent(selectedClass: string): void {
  let SubContentAll = document.getElementsByName('questionnaire')
  SubContentAll.forEach((item) => {
    item.style.height = '0'
  })
  let openSubContent = document.getElementById(selectedClass)
  if (openSubContent) openSubContent.style.height = openSubContent.scrollHeight + 'px'
  selectedQuestionnaire.value = selectedClass
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

function changeQuestion(big: string, small: string, index: number): void {
  emit('changeQuestion', 'no')
  const query = JSON.parse(JSON.stringify(route.query))
  query.number = index
  query.bigQuestionnaire = big
  query.smallQuestionnaire = small
  router.push({ path: route.path, query })
  close()
}
</script>
