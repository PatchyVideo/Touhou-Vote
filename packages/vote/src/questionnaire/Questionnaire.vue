<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh flex flex-col overflow-hidden">
    <div class="baseBoxShadow p-2 flex items-center justify-between">
      <div class="flex items-center">
        <BackToHome :show="true" />
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

    <div v-if="!runtime" class="flex-1 flex items-center justify-center p-6 text-center">
      <div v-if="structureLoading">问卷加载中…</div>
      <div v-else-if="structureError">问卷加载失败，请稍后刷新重试。</div>
      <div v-else>暂无可填写的问题。</div>
    </div>

    <template v-else>
      <div class="w-full h-1 2xl:h-3 flex mb-1">
        <div
          v-for="group in visibleGroups"
          :key="group.id"
          class="h-full"
          :class="[group.done ? 'bg-accent-color-600' : ' bg-subaccent']"
          :style="'width:' + 100 / visibleGroups.length + '%'"
        ></div>
      </div>

      <div class="w-full flex flex-col space-y-3 p-1 md:w-1/2 2xl:w-5/12 md:m-auto">
        <div v-if="currentQuestion" class="baseBoxRoundedShadow p-1 w-full">
          <div class="space-y-5 p-2">
            <div>
              {{ questionNum + 1 + '：' + currentQuestion.content + '（' + TypeToChinese[currentQuestion.type] + '）' }}
            </div>
            <div v-if="currentQuestion.type != 'Input'" class="innerBox p-2 space-y-1">
              <div
                v-for="option in availableOptions"
                :key="option.id"
                class="py-1 px-1 rounded-xl transition transition-colors cursor-pointer md:hover:bg-subaccent md:hover:bg-opacity-80"
                @click="selectOption(option.id)"
              >
                <VoteCheckBox :check="option.selected" :read-only="true" class="mr-2" />{{ option.content }}
              </div>
            </div>
            <div v-else>
              <textarea
                v-model="answerContent"
                :maxlength="currentQuestion.maxInputLen ?? 1000"
                class="p-1 md:p-3 w-full ring ring-accent-color-600 rounded-xl"
                placeholder="请说点儿什么吧..."
                rows="10"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-between space-x-2">
          <button
            class="w-1/2 py-1 text-sm md:text-base"
            :class="{ buttonDisabled: questionNum === 0 }"
            @click="!questionNum || changeQuestion('forward')"
          >
            上一题
          </button>
          <button
            class="w-1/2 py-1 text-sm md:text-base"
            :class="{ buttonDisabled: questionNum + 1 === visibleGroups.length }"
            @click="questionNum + 1 != visibleGroups.length && changeQuestion('back')"
          >
            下一题
          </button>
        </div>
        <button
          class="w-full py-1 text-sm md:text-base"
          :class="{ buttonDisabled: submiting }"
          :style="questionnaireDone ? '' : 'visibility:hidden'"
          @click="submitQuestionnire()"
        >
          <icon-uil-spinner-alt v-if="submiting" class="align-text-bottom animate-spin" />
          {{ submiting ? '提交中' : '提交' }}
        </button>
      </div>
    </template>
  </div>

  <QuestionnaireChange
    v-model:open="open"
    :questionnaire-id="questionnaireIdParam"
    @change-question="changeQuestion"
  />

  <button
    v-if="screenSizes['lg'] && screenSizes['<2xl']"
    class="fixed flex items-center bottom-20 right-5 px-3 py-1 text-lg"
    @click="drawerOpen"
  >
    <icon-uil-align class="fill-current mr-1" />
    选择题目
  </button>

  <VoteMessageBox v-model:open="submitCompleteMessageBoxOpen" title="提交成功！">
    <div class="p-2 space-y-2">
      <div v-if="isQuestionnaireAllDoneV2 && firstCompleteQuestionnaireAll">
        <div>感谢您完成了调查问卷的填写！您可以进行投票了！</div>
        <div>您是希望进行投票，还是继续填写/修改其他问卷呢？</div>
        <div>可以通过页面顶部的下拉菜单快速切换问卷或问题。</div>
      </div>
      <div v-else>
        <div>
          感谢您完成了<strong>{{ questionnaireName }}</strong
          >的填写！
        </div>
        <div>您是希望休息一下，还是继续填写/修改其他问卷呢？</div>
        <div>提示：可以通过页面顶部的下拉菜单快速切换问卷或问题。</div>
      </div>
      <div class="flex justify-between space-x-2">
        <button
          class="w-1/2 py-1 text-sm md:text-base"
          @click="backHome(isQuestionnaireAllDoneV2 && firstCompleteQuestionnaireAll)"
        >
          {{ isQuestionnaireAllDoneV2 && firstCompleteQuestionnaireAll ? '去投票！' : '休息一下，返回主页面' }}
        </button>
        <button class="w-1/2 py-1 text-sm md:text-base" @click="continueEdit()">我还想继续填写/修改问卷！</button>
      </div>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  buildAnswerStatePayload,
  firstCompleteQuestionnaireAll,
  getRuntime,
  isQuestionnaireAllDoneV2,
  questionnaires,
  setInput,
  structureError,
  structureLoading,
  toggleOption,
} from '@/questionnaire/lib/questionnaireStateV2'
import VoteCheckBox from '@/common/components/VoteCheckBox.vue'
import QuestionnaireChange from '@/questionnaire/components/QuestionnaireChange.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import BackToHome from '@/common/components/BackToHome.vue'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import { gql, useMutation } from '@/graphql'
import { voteToken } from '@/home/lib/user'
import { screenSizes } from '@/tailwindcss'
import { popConfirmText, popMessageText } from '@/common/lib/popMessage'

setSiteTitle('调查问卷')

const route = useRoute()
const router = useRouter()

const questionnaireIdParam = computed<number>(() => {
  const raw = route.query.questionnaireId
  const id = Number(Array.isArray(raw) ? raw[0] : raw)
  if (!isNaN(id) && id > 0) return id
  // default to first questionnaire
  return questionnaires.value[0]?.id ?? 0
})

const runtime = computed(() => getRuntime(questionnaireIdParam.value))
const questionnaireName = computed<string>(() => runtime.value?.name ?? '')
const visibleGroups = computed(() => runtime.value?.visibleGroups ?? [])

const rawNumber = computed<number>(() =>
  Number(route.query.number ? (Array.isArray(route.query.number) ? route.query.number[0] : route.query.number) : 0)
)
const questionNum = computed<number>(() => {
  const len = visibleGroups.value.length
  if (len === 0) return 0
  return Math.min(Math.max(rawNumber.value, 0), len - 1)
})
const currentGroup = computed(() => visibleGroups.value[questionNum.value] ?? null)
const currentQuestion = computed(() => currentGroup.value?.activeQuestion ?? null)
const availableOptions = computed(() => currentQuestion.value?.options.filter((option) => option.available) ?? [])
const questionnaireDone = computed<boolean>(() => runtime.value?.done ?? false)

const TypeToChinese = {
  Single: '单选',
  Multiple: '多选',
  Input: '输入，没有可填"无"',
}

// Input 题目本地文本,导航时从运行时重置,输入时回写 store
const answerContent = ref<string>('')
watch(
  () => [questionnaireIdParam.value, questionNum.value] as const,
  () => {
    answerContent.value = currentQuestion.value?.type === 'Input' ? currentQuestion.value.input : ''
  },
  { immediate: true }
)
watch(answerContent, (val) => {
  if (currentQuestion.value?.type === 'Input' && currentGroup.value && val !== currentQuestion.value.input) {
    setInput(questionnaireIdParam.value, currentGroup.value.id, val)
  }
})

function selectOption(id: number): void {
  const question = currentQuestion.value
  const group = currentGroup.value
  if (!question || !group) return
  const wasSelected = question.options.find((option) => option.id === id)?.selected ?? false
  toggleOption(questionnaireIdParam.value, group.id, id)
  if (question.type === 'Single' && !wasSelected && questionNum.value + 1 < visibleGroups.value.length) {
    changeQuestion('back')
  }
}

function changeQuestion(direction: 'forward' | 'back' | 'no'): void {
  if (direction === 'no') return
  const query = JSON.parse(JSON.stringify(route.query))
  query.number = direction === 'forward' ? questionNum.value - 1 : questionNum.value + 1
  router.push({ path: route.path, query })
}

const open = ref(false)
function drawerOpen(): void {
  open.value = true
}

const submitCompleteMessageBoxOpen = ref(false)

const { mutate, loading: submiting, onDone, onError } = useMutation<{ submitPaperV2: boolean }>(gql`
  mutation ($voteToken: String!, $answers: JSON!) {
    submitPaperV2(voteToken: $voteToken, answers: $answers)
  }
`)

async function submitQuestionnire(): Promise<void> {
  if (submiting.value) return
  const payload = buildAnswerStatePayload()
  if (!payload) {
    popMessageText('问卷尚未加载完成，请稍后再试')
    return
  }
  if (await popConfirmText('确认提交' + questionnaireName.value + '吗？（您之后还可以修改）')) {
    mutate({ voteToken: voteToken.value, answers: payload })
  }
}
onDone(() => {
  submitCompleteMessageBoxOpen.value = true
})
onError((error) => {
  if (error.graphQLErrors?.[0]?.extensions?.error_kind === 'REQUEST_TOO_FREQUENT') popMessageText('请求过于频繁！')
  else popMessageText('提交失败，原因：' + (error.graphQLErrors?.[0]?.extensions?.human_readable_message ?? '未知错误'))
})

function backHome(gotoVote: boolean): void {
  firstCompleteQuestionnaireAll.value = false
  router.push(gotoVote ? '/?openList=vote&open=1' : '/')
}
function continueEdit(): void {
  firstCompleteQuestionnaireAll.value = false
  submitCompleteMessageBoxOpen.value = false
  drawerOpen()
}
</script>
