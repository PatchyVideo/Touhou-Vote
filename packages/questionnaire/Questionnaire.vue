<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh flex flex-col overflow-hidden">
    <div class="p-2 shadow flex items-center justify-between bg-white">
      <div class="flex items-center">
        <BackToHome :show="true" :saveable="true" />
        <div class="font-medium">
          {{ questionnaireName }}
        </div>
      </div>
      <div
        v-if="screenSizes['<lg']"
        class="text-2xl mr-3 cursor-pointer transform-gpu origin-center transition-all duration-200"
        :class="{ 'rotate-180': open }"
        @click="drawerOpen"
      >
        ▼
      </div>
    </div>
    <div class="w-full h-1 flex mb-1">
      <div
        v-for="(answer, index) in questionDone[bigQuestionnaire][smallQuestionnaire].answers"
        :key="index"
        class="h-full"
        :class="[answer.done ? 'bg-accent-color-600' : ' bg-gray-300']"
        :style="'width:' + 100 / questionDone[bigQuestionnaire][smallQuestionnaire].answers.length + '%'"
      ></div>
    </div>

    <div class="w-full flex flex-col space-y-3 p-1 md:w-1/2 3xl:w-1/4 md:m-auto">
      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="space-y-5 p-2">
          <div>{{ questionNum + 1 + '：' + question.content + '（' + TypeToChinese[question.type] + '）' }}</div>
          <div v-if="question.type != 'Input'" class="rounded bg-gray-50 bg-opacity-50 space-y-1">
            <div
              v-for="(option, index) in options"
              :key="index"
              class="md:hover:bg-accent-color-100 py-1 px-1 rounded transition transition-colors cursor-pointer"
              @click="selectOption(option.id)"
            >
              <VoteCheckBox
                :check="answerData.findIndex((answer) => answer === option.id) != -1"
                :read-only="true"
                class="mr-2"
              />{{ option.content }}
            </div>
          </div>
          <div v-else>
            <textarea
              v-model="answerContent"
              maxlength="1000"
              class="w-full ring ring-accent-color-600 rounded"
              placeholder="请说点儿什么吧..."
              rows="5"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-between space-x-2">
        <button
          class="w-1/2 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
          :class="{ 'bg-accent-color-300 cursor-default': questionNum === 0 }"
          @click="!questionNum || changeQuestion('forward')"
        >
          上一题
        </button>
        <button
          v-if="questionNum + 1 != questionDone[bigQuestionnaire][smallQuestionnaire].answers.length"
          class="w-1/2 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
          @click="changeQuestion('back')"
        >
          下一题
        </button>
        <button
          v-else
          class="w-1/2 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
          :class="{ 'bg-accent-color-300': submiting || !questionnaireDone }"
          @click="questionnaireDone && submitQuestionnire()"
        >
          <icon-uil-spinner-alt v-if="submiting" class="animate-spin" /><label>{{
            submiting ? '提交中' : '提交'
          }}</label>
        </button>
      </div>
      <button
        v-if="
          questionnaireDone &&
          Boolean(questionNum + 1 != questionDone[bigQuestionnaire][smallQuestionnaire].answers.length)
        "
        class="w-full py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
        :class="{ 'bg-accent-color-300': submiting }"
        @click="submitQuestionnire()"
      >
        <icon-uil-spinner-alt v-if="submiting" class="animate-spin" /><label>{{ submiting ? '提交中' : '提交' }}</label>
      </button>
    </div>
  </div>
  <QuestionnaireChange
    v-model:open="open"
    :big-questionnaire="bigQuestionnaire"
    :small-questionnaire="smallQuestionnaire"
    @change-question="changeQuestion"
  />
  <button
    v-if="screenSizes['lg']"
    class="fixed flex items-center bottom-20 right-5 px-3 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
    @click="drawerOpen"
  >
    <icon-uil-align class="fill-current" />
    选择题目
  </button>
  <VoteMessageBox v-model:open="submitCompleteMessageBoxOpen" title="提交成功！">
    <div class="p-2 space-y-2">
      <div v-if="IsQuestionnaireAllDone && firstCompleteQuestionnaireAll">
        <div>感谢您完成了调查问卷的填写！,您可以进行投票了！</div>
        <div>您是希望进行投票，还是继续填写/修改其他问卷呢？</div>
      </div>
      <div v-else>
        <div>{{ '感谢您完成了' + questionnaireName + '的填写！' }}</div>
        <div>您是希望休息一下，还是继续填写/修改其他问卷呢？</div>
      </div>
      <div class="flex justify-between space-x-2">
        <button
          class="w-1/2 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
          @click="backHome(IsQuestionnaireAllDone && firstCompleteQuestionnaireAll)"
        >
          {{ IsQuestionnaireAllDone && firstCompleteQuestionnaireAll ? '去投票！' : '休息一下，返回主页面' }}
        </button>
        <button
          class="w-1/2 py-1 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
          @click="continueEdit()"
        >
          我还想继续填写/修改问卷！
        </button>
      </div>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IsQuestionnaireAllDone,
  IsQuestionnaireDone,
  computeQuestionnaire,
  firstCompleteQuestionnaireAll,
  questionDone,
  questionnaireComputed,
  questionnaireData,
} from '@/questionnaire/lib/questionnaireData'
import VoteCheckBox from '@/common/components/VoteCheckBox.vue'
import QuestionnaireChange from '@/questionnaire/components/QuestionnaireChange.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import BackToHome from '@/common/components/BackToHome.vue'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { gql, useMutation } from '@/graphql'
import type { Mutation } from '@/graphql'
import { voteToken } from '@/home/lib/user'
import { screenSizes } from '@/tailwindcss'
import { popConfirmText, popMessageText } from '@/common/lib/popMessage'

setSiteTitle('调查问卷 - 第⑩回 中文东方人气投票')

const route = useRoute()
const router = useRouter()

const bigQuestionnaire = computed<'mainQuestionnaire' | 'extraQuestionnaire'>(() => {
  let big = String(
    route.query.bigQuestionnaire
      ? Array.isArray(route.query.bigQuestionnaire)
        ? route.query.bigQuestionnaire[0]
        : route.query.bigQuestionnaire
      : 'mainQuestionnaire'
  )
  return big === 'mainQuestionnaire' || big === 'extraQuestionnaire' ? big : 'mainQuestionnaire'
})
const smallQuestionnaire = computed<
  | 'requiredQuestionnaire'
  | 'optionalQuestionnaire1'
  | 'optionalQuestionnaire2'
  | 'exQuestionnaire1'
  | 'exQuestionnaire2'
  | 'exQuestionnaire3'
  | 'exQuestionnaire4'
  | 'exQuestionnaire5'
>(() => {
  let small = String(
    route.query.smallQuestionnaire
      ? Array.isArray(route.query.smallQuestionnaire)
        ? route.query.smallQuestionnaire[0]
        : route.query.smallQuestionnaire
      : 'mainQuestionnaire'
  )
  return small === 'requiredQuestionnaire' ||
    small === 'optionalQuestionnaire1' ||
    small === 'optionalQuestionnaire2' ||
    small === 'exQuestionnaire1' ||
    small === 'exQuestionnaire2' ||
    small === 'exQuestionnaire3' ||
    small === 'exQuestionnaire4' ||
    small === 'exQuestionnaire5'
    ? small
    : 'requiredQuestionnaire'
})
const questionnaireName = computed<string>(
  () => questionnaireComputed.value[bigQuestionnaire.value][smallQuestionnaire.value].name
)
const questionNum = computed<number>(() =>
  Number(route.query.number ? (Array.isArray(route.query.number) ? route.query.number[0] : route.query.number) : 0)
)
// Because questionnaireComputed will delete questions invaild while questionnaireData won't, questionNum is not equal to the index of this question in questionnaireData
const indexOfAnswerInQuestionnaireData = computed<number>(() =>
  questionnaireData.value[bigQuestionnaire.value][smallQuestionnaire.value].answers.findIndex(
    (item) =>
      item.id ===
      questionnaireComputed.value[bigQuestionnaire.value][smallQuestionnaire.value].questions[questionNum.value][0].id
  )
)
interface Question {
  content: string
  id: number
  type: 'Single' | 'Multiple' | 'Input'
}
const question = computed<Question>(() => {
  return {
    content:
      questionnaireComputed.value[bigQuestionnaire.value][smallQuestionnaire.value].questions[questionNum.value][0]
        .question,
    id: questionnaireComputed.value[bigQuestionnaire.value][smallQuestionnaire.value].questions[questionNum.value][0]
      .id,
    type: questionnaireComputed.value[bigQuestionnaire.value][smallQuestionnaire.value].questions[questionNum.value][0]
      .type,
  }
})
const TypeToChinese = {
  Single: '单选',
  Multiple: '多选',
  Input: '输入',
}
interface Option {
  content: string
  id: number
}
const options = computed<Option[]>(() =>
  questionnaireComputed.value[bigQuestionnaire.value][smallQuestionnaire.value].questions[
    questionNum.value
  ][0].options.map((option) => {
    return {
      content: option.content,
      id: option.id,
    }
  })
)
const answerData = ref<number[]>(updateAnswerData())
function updateAnswerData(): number[] {
  return (
    questionnaireData.value[bigQuestionnaire.value][smallQuestionnaire.value].answers[
      indexOfAnswerInQuestionnaireData.value
    ].options || []
  )
}
const answerContent = ref<string>(updateAnswerContent())
function updateAnswerContent(): string {
  return (
    questionnaireData.value[bigQuestionnaire.value][smallQuestionnaire.value].answers[
      indexOfAnswerInQuestionnaireData.value
    ].input || ''
  )
}
watch(
  answerContent,
  () => {
    questionnaireData.value[bigQuestionnaire.value][smallQuestionnaire.value].answers[
      indexOfAnswerInQuestionnaireData.value
    ].input = answerContent.value
  },
  { deep: true }
)
watch(
  route,
  () => {
    answerData.value = updateAnswerData()
    answerContent.value = updateAnswerContent()
  },
  { deep: true }
)

function selectOption(id: number): void {
  const index = answerData.value.findIndex((option) => option === id)
  if (question.value.type === 'Single') {
    if (index === -1) {
      answerData.value = []
      answerData.value.push(id)
      if (questionNum.value + 1 != questionDone.value[bigQuestionnaire.value][smallQuestionnaire.value].answers.length)
        changeQuestion('back')
      else changeQuestion('no')
    }
  } else if (question.value.type === 'Multiple') {
    index === -1 ? answerData.value.push(id) : answerData.value.splice(index, 1)
  }
}

function changeQuestion(direction: 'forward' | 'back' | 'no'): void {
  changeQuestionnaireData()
  questionnaireComputed.value = computeQuestionnaire()
  if (direction === 'no') return
  const query = JSON.parse(JSON.stringify(route.query))
  query.number = direction === 'forward' ? questionNum.value - 1 : questionNum.value + 1
  router.push({ path: route.path, query })
}
function changeQuestionnaireData(): void {
  questionnaireData.value[bigQuestionnaire.value][smallQuestionnaire.value].answers[
    indexOfAnswerInQuestionnaireData.value
  ].options = answerData.value
  questionnaireData.value[bigQuestionnaire.value][smallQuestionnaire.value].answers[
    indexOfAnswerInQuestionnaireData.value
  ].input = answerContent.value
  setQuestionnaireDataToLocalStorage()
}
function setQuestionnaireDataToLocalStorage(): void {
  localStorage.setItem('questionnaireDataLocal', JSON.stringify(questionnaireData.value))
}

const open = ref(false)
function drawerOpen(): void {
  open.value = true
}

const submitCompleteMessageBoxOpen = ref(false)
const questionnaireDone = computed<boolean>(() => {
  return IsQuestionnaireDone(bigQuestionnaire.value, smallQuestionnaire.value)
})

async function submitQuestionnire() {
  changeQuestion('no')
  if (submiting.value) return
  if (await popConfirmText('确认提交' + questionnaireName.value + '吗？')) {
    mutate({ content: { voteToken: voteToken.value, paperJson: JSON.stringify(questionnaireData.value) } })
  }
}

function backHome(gotoVote: boolean): void {
  firstCompleteQuestionnaireAll.value = false
  router.push(gotoVote ? '/?openList=vote&open=1' : '/')
}
function continueEdit(): void {
  firstCompleteQuestionnaireAll.value = false
  submitCompleteMessageBoxOpen.value = false
  drawerOpen()
}

const {
  mutate,
  loading: submiting,
  onDone,
  onError,
} = useMutation<Mutation>(
  gql`
    mutation ($content: PaperSubmitGQL!) {
      submitPaperVote(content: $content)
    }
  `
)
onDone((result) => {
  popMessageText('提交成功！')
  submitCompleteMessageBoxOpen.value = true
})
onError((error) => {
  console.log(error.graphQLErrors[0].extensions.error_kind)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('投票失败，原因：' + error.graphQLErrors[0].extensions.human_readable_message)
})
</script>
