<template>
  <div class="p-3">
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
        <div class="py-1 text-sm">
          {{ '总回答数：' + item.totalAnswers + '；男性数：' + item.totalMale + '；女性数：' + item.totalFemale }}
        </div>
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
          :vote-famale="item.totalFemale"
          v-else-if="item.type === 'Multiple'"
          class="max-w-4xl pt-3 mx-auto"
        />
        <router-link
          class="py-3 inline-block"
          :to="'QuestionnaireInputDetail?qid=' + item.questionId + '&q=' + props.q"
          v-else-if="item.type === 'Input'"
          >点击这里查看全部回答</router-link
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { gql, useLazyQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import { GraphDataPie, GraphDataSunburst, GraphDataRadar } from '@/lib/Graph'
import {
  allQuestionnaireIDList,
  qIDToID,
  findQuestionWithQuestionID,
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
watchEffect(() => {
  if (props.q != 'NONE') {
    QuestionnaireDetail(props.q)
  }
})

const questionnaireCompletionRates = ref<GraphDataPie[]>([])
interface QuestionItem {
  questionId: string
  question: string
  type: 'Input' | 'Single' | 'Multiple'
  answersCat: {
    aid: string
    content: string
    totalVotes: number
    maleVotes: number
    femaleVotes: number
  }[]
  totalAnswers: number
  totalMale: number
  totalFemale: number
}
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
  answersCat.sort((a, b) => Number(a.aid) - Number(b.aid))
  answersCat.map((item2) => indicator.push(item2.content))
  // 囧说要把这两个选项去掉，原因未知💩
  if (item.questionId === 'q25091') {
    indicator.splice(18, 1)
    indicator.splice(17, 1)
  }
  return indicator
}
function getDataRadar(item: QuestionItem): GraphDataRadar[] {
  const data: GraphDataRadar[] = []
  const answersCat = [...item.answersCat]
  answersCat.sort((a, b) => Number(a.aid) - Number(b.aid))
  // 囧说要把这两个选项去掉，原因未知💩
  if (item.questionId === 'q25091') {
    answersCat.splice(18, 1)
    answersCat.splice(17, 1)
    data.push(
      { name: '总票数', value: answersCat.map((item2) => item2.totalVotes) },
      { name: '男性票数', value: answersCat.map((item2) => item2.maleVotes) },
      { name: '女性票数', value: answersCat.map((item2) => item2.femaleVotes) }
    )
  } else
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
        }
      }
    }
  `,
  props.q === ''
    ? {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        questionsOfInterest: allQuestionnaireIDList.value,
      }
    : {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
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
      questionItem.value = result.value.queryQuestionnaire.entries
        .map((item) => {
          return {
            questionId: item.questionId,
            question: findQuestionWithQuestionID(qIDToID(item.questionId)).question,
            type: findQuestionWithQuestionID(qIDToID(item.questionId)).type,
            answersCat: item.answersCat.map((item2) => {
              return {
                aid: item2.aid,
                content:
                  findQuestionWithQuestionID(qIDToID(item.questionId)).options.find(
                    (item3) => String(item3.id) === item2.aid
                  )?.content || 'ERROR',
                totalVotes: item2.totalVotes,
                maleVotes: item2.maleVotes,
                femaleVotes: item2.femaleVotes,
              }
            }),
            totalAnswers: item.totalAnswers,
            totalMale: item.totalMale,
            totalFemale: item.totalFemale,
          }
        })
        .sort((a, b) => Number(qIDToID(a.questionId)) - Number(qIDToID(b.questionId)))
    }
    if (result.value.queryCompletionRates) {
      questionnaireCompletionRates.value = result.value.queryCompletionRates.items.map((item) => {
        return {
          name: getSmallQuestionnaireChineseName(item.name),
          value: item.numComplete,
        }
      })
    }
  }
})
onError((err) => {
  alert(err.message)
  console.log(err.message)
})
async function QuestionnaireDetail(q: string): Promise<void> {
  if (queryQuestionnaireDisabled.value)
    load(
      undefined,
      q === ''
        ? {
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
            questionsOfInterest: allQuestionnaireIDList.value,
          }
        : {
            voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
            voteYear: 10,
            query: q,
            questionsOfInterest: allQuestionnaireIDList.value,
          }
    )
  else
    fetchMore({
      variables:
        q === ''
          ? {
              voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
              voteYear: 10,
              questionsOfInterest: allQuestionnaireIDList.value,
            }
          : {
              voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
              voteYear: 10,
              query: q,
              questionsOfInterest: allQuestionnaireIDList.value,
            },
      updateQuery(previousQueryResult, { fetchMoreResult }) {
        if (!fetchMoreResult) return previousQueryResult
        return fetchMoreResult
      },
    })
}
</script>
