<template>
  <div
    class="
      fixed
      top-0
      inset-x-0
      max-h-100vh
      z-51
      p-3
      md:p-10
      rounded-b
      shadow
      bg-white
      overflow-auto
      transform-gpu
      transition-transform
      duration-200
      ease-in-out
      flex flex-col
    "
    :class="{ '-translate-y-full': !open }"
  >
    <div v-for="(questionnaire, index) in questionnaireKeyToName" :key="index" class="w-full rounded shadow mb-2">
      <div
        class="px-2 py-1 truncate cursor-pointer"
        @click="selectAsQuestionnaireCurrent(questionnaire.smallQuestionnaire)"
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
        class="
          flex flex-wrap
          shadow-inner
          m-1
          rounded
          transform
          transition-all
          duration-200
          ease-in-out
          h-0
          overflow-hidden
        "
      >
        <div
          v-for="(answer, index2) in questionDone[questionnaire.bigQuestionnaire][questionnaire.smallQuestionnaire]
            .answers"
          :key="index2"
          class="rounded-full ring ring-accent-color-600 m-3 w-8 h-8 leading-8 text-center cursor-pointer"
          :class="[answer.done ? 'text-white bg-accent-color-600' : 'text-black bg-accent-color-100']"
          @click="changeQuestion(questionnaire.bigQuestionnaire, questionnaire.smallQuestionnaire, index2)"
        >
          {{ index2 + 1 }}
        </div>
      </div>
    </div>
    <div class="text-right text-accent-color-600 cursor-pointer" @click="close()">▲收起</div>
  </div>
  <Transition name="mask">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-20 z-50" @touchmove.stop.prevent @click="close()"></div>
  </Transition>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { questionDone, questionnaireKeyToName } from '@/questionnaire/lib/questionnaireData'
import { watchEffect, watch, onMounted } from 'vue'
import { useVModel } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

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
  if (!open.value) document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:auto')
  else document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden')
})
function close(): void {
  open.value = false
  // Waiting for animation
  setTimeout(() => {
    bigQuestionnaireCurrent.value = props.bigQuestionnaire
    smallQuestionnaireCurrent.value = props.smallQuestionnaire
    selectedQuestionnaire.value = props.smallQuestionnaire
    selectAsQuestionnaireCurrent(selectedQuestionnaire.value)
  }, 200)
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
onMounted(() => selectAsQuestionnaireCurrent(selectedQuestionnaire.value))

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
<style lang="postcss" scoped>
.mask-enter-active,
.mask-leave-active {
  @apply transition-all duration-200;
}
.mask-enter-from,
.mask-leave-to {
  @apply bg-opacity-0;
}
</style>
