<template>
  <div class="p-3">
    <div v-if="questionnaireLoading || loading">问卷结果加载中…</div>
    <div v-else-if="questionnaireError || statisticsError" class="py-3">
      {{ questionnaireError || statisticsError }}
      <button class="underline ml-2" @click="QuestionnaireDetail(props.q)">重试</button>
    </div>
    <template v-else-if="statisticsReady">
    <div>
      <div class="text-2xl py-0.5 border-b border-accent-600">投票群体 - 问卷填写情况</div>
      <GraphPie :data="questionnaireCompletionRates" :much-legend="true" class="max-w-4xl pt-3 mx-auto" />
    </div>
    <div>
      <div class="text-2xl py-0.5 mb-3 border-b border-accent-600">投票群体 - 问卷回答情况</div>
      <div v-for="item in questionItem" :key="item.questionId" class="mb-3">
        <div class="py-0.5 border-b border-accent-300">
          {{ item.question }}
        </div>
        <div v-if="item.code" class="py-1 text-sm">
          {{ '总回答数：' + item.totalAnswers + '；男性数：' + item.totalMale + '；女性数：' + item.totalFemale }}
        </div>
        <div v-if="!item.code" class="py-2 text-gray-600">本题尚未设置统计编号。</div>
        <div v-else-if="item.totalAnswers === 0" class="py-2 text-gray-600">暂无回答。</div>
        <template v-else>
        <div v-if="item.hasUncodedOptions" class="text-gray-600">部分选项尚未设置统计编号，暂不展示对应选项统计。</div>
        <div v-if="item.type === 'Multiple'" class="py-1 text-sm italic text-gray-700">
          *【男性/女性相对比例】是方便查看男性/女性之间投票选项的差异而设置的，其计算公式为：回答该选项的男性/女性票数
          ➗ (回答该问题的男性/女性票数 ➗ 回答该问题的总票数)
        </div>
        <GraphMap
          v-if="item.questionId === 'q11031'"
          :data-total="
            item.answersCat.map((item2) => {
              return {
                name: item2.content,
                value: item2.totalVotes,
              }
            })
          "
          :data-male="
            item.answersCat.map((item2) => {
              return {
                name: item2.content,
                value: item2.maleVotes,
              }
            })
          "
          :data-female="
            item.answersCat.map((item2) => {
              return {
                name: item2.content,
                value: item2.femaleVotes,
              }
            })
          "
          class="max-w-4xl pt-3 mx-auto"
        />
        <GraphPie
          v-else-if="item.questionId === 'q11011'"
          :data="
            item.answersCat.map((item2) => {
              return {
                name: item2.content,
                value: item2.totalVotes,
              }
            })
          "
          class="max-w-4xl pt-3 mx-auto"
        />
        <div v-else-if="item.type === 'Single'">
          <GraphSunburst
            :data="
              item.answersCat.map((item2) => {
                return {
                  id: item2.aid,
                  name: item2.content,
                  value: item2.totalVotes,
                }
              })
            "
            :data-out="getMaleAndFemaleAnswerNumber(item)"
            :much-legend="item.answersCat.length > 2"
            class="max-w-4xl pt-3 mx-auto"
          />
        </div>
        <GraphRadar
          :indicator="getIndicator(item)"
          :data="getDataRadar(item)"
          :vote-total="item.totalAnswers"
          :vote-male="item.totalMale"
          :vote-female="item.totalFemale"
          v-else-if="item.type === 'Multiple'"
          class="max-w-4xl pt-3 mx-auto"
        />
        <router-link
          class="py-3 inline-block"
          :to="'/QuestionnaireInputDetail?qid=' + item.questionId + '&q=' + props.q"
          v-else-if="item.type === 'Input'"
          >点击这里查看全部回答</router-link
        >
        </template>
      </div>
    </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { voteStart, voteYear } from '@/lib/voteYear'
import { gql, useLazyQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import type { GraphDataPie, GraphDataRadar, GraphDataSunburst } from '@/lib/Graph'
import {
  allQuestionnaireIDList,
  buildQuestionnaireResultItems,
  ensureQuestionnaireStructure,
  questionnaireIndex,
  questionnaireLoading,
  questionnaireError,
  getSmallQuestionnaireChineseName,
} from '@/lib/Questionnaire'
import GraphMap from '../components/GraphMap.vue'
import GraphPie from '../components/GraphPie.vue'
import GraphSunburst from '../components/GraphSunburst.vue'
import GraphRadar from '../components/GraphRadar.vue'

const props = defineProps<{
  // "NONE" is the default value of q
  q: string
}>()

const statisticsError = ref<string | null>(null)
const statisticsReady = ref(false)
watch(() => props.q, (query) => {
  if (query !== 'NONE') void QuestionnaireDetail(query)
}, { immediate: true })

const questionnaireCompletionRates = ref<GraphDataPie[]>([])
type QuestionItem = ReturnType<typeof buildQuestionnaireResultItems>[number]
const questionItem = ref<QuestionItem[]>([])
function getMaleAndFemaleAnswerNumber(item: QuestionItem): GraphDataSunburst[] {
  const dataOut: GraphDataSunburst[] = []
  item.answersCat.map((item2) => {
    dataOut.push(
      {
        id: item2.aid + '0',
        name: '男性',
        value: item2.maleVotes,
      },
      {
        id: item2.aid + '1',
        name: '女性',
        value: item2.femaleVotes,
      }
    )
  })
  return dataOut
}
function getIndicator(item: QuestionItem): string[] {
  const indicator: string[] = []
  const answersCat = [...item.answersCat]
  answersCat.map((item2) => indicator.push(item2.content))
  return indicator
}
function getDataRadar(item: QuestionItem): GraphDataRadar[] {
  const data: GraphDataRadar[] = []
  const answersCat = [...item.answersCat]
  data.push(
    { name: '总票数', value: answersCat.map((item2) => item2.totalVotes) },
    { name: '男性票数', value: answersCat.map((item2) => item2.maleVotes) },
    { name: '女性票数', value: answersCat.map((item2) => item2.femaleVotes) }
  )
  return data
}
const {
  result,
  load,
  loading,
  onError,
  fetchMore,
  forceDisabled: queryQuestionnaireDisabled,
} = useLazyQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $query: String, $questionsOfInterest: [String!]!) {
      queryQuestionnaire(
        voteStart: $voteStart
        voteYear: $voteYear
        query: $query
        questionsOfInterest: $questionsOfInterest
      ) {
        entries {
          questionId
          answersCat {
            aid
            totalVotes
            maleVotes
            femaleVotes
          }
          totalAnswers
          totalMale
          totalFemale
        }
      }
      queryCompletionRates(voteStart: $voteStart, voteYear: $voteYear, query: $query) {
        items {
          name
          numComplete
          rate
          total
        }
      }
    }
  `,
  props.q === ''
    ? {
        voteStart,
        voteYear,
        questionsOfInterest: allQuestionnaireIDList.value,
      }
    : {
        voteStart,
        voteYear,
        query: props.q,
        questionsOfInterest: allQuestionnaireIDList.value,
      }
)
watchEffect(() => {
  if (loading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
watchEffect(() => {
  if (result.value) {
    if (result.value.queryQuestionnaire) {
      if (questionnaireIndex.value) {
        questionItem.value = buildQuestionnaireResultItems(questionnaireIndex.value, result.value.queryQuestionnaire.entries)
        statisticsReady.value = true
      }
    }
    if (result.value.queryCompletionRates) {
      questionnaireCompletionRates.value = result.value.queryCompletionRates.items.map((item) => {
        return {
          name: getSmallQuestionnaireChineseName(item.name),
          value: item.numComplete,
          rate: item.rate,
        }
      })
    }
  }
})
onError((err) => {
  statisticsReady.value = false
  statisticsError.value = err.message
})
async function QuestionnaireDetail(q: string): Promise<void> {
  if (q === 'NONE') return
  statisticsError.value = null
  statisticsReady.value = false
  try {
    await ensureQuestionnaireStructure()
    if (q !== props.q) return
    const variables = {
      voteStart, voteYear, questionsOfInterest: allQuestionnaireIDList.value,
      query: q || undefined,
    }
    if (queryQuestionnaireDisabled.value) {
      await load(undefined, variables)
    } else {
      await fetchMore({ variables, updateQuery(previous, { fetchMoreResult }) {
        return fetchMoreResult ?? previous
      } })
    }
    // A cached successful response is also valid when the same filter is retried.
    if (result.value?.queryQuestionnaire && !statisticsError.value && questionnaireIndex.value) {
      questionItem.value = buildQuestionnaireResultItems(questionnaireIndex.value, result.value.queryQuestionnaire.entries)
      statisticsReady.value = true
    }
  } catch (error) {
    statisticsError.value = error instanceof Error ? error.message : String(error)
  }
}
</script>
