<template>
  <div class="mx-1 my-3">
    <!-- Overview -->
    <div
      class="mb-0 md:mx-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:flex-wrap md:justify-between md:items-center"
    >
      <div class="flex items-end">
        <img :src="characterImg" class="w-10 h-10 col-span-1 row-span-2 rounded" />
        <h2 class="text-4xl font-light">{{ characterName }}</h2>
        <span class="ml-3 text-xl">角色信息</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-1 text-sm md:text-base text-center">
        <div>
          <div>票数</div>
          <div>{{ voteCount }}</div>
        </div>
        <div>
          <div>本命票数</div>
          <div>{{ firstVoteCount }}</div>
        </div>
        <div>
          <div>本命率</div>
          <div>{{ firstVotePercentage }}</div>
        </div>
        <div>
          <div>票数全局占比</div>
          <div>{{ votePercentage }}</div>
        </div>
        <div>
          <div>本命全局占比</div>
          <div>{{ firstPercentage }}</div>
        </div>
        <div>
          <div>投票理由</div>
          <router-link class="underline" v-if="numReasons > 0" :to="'/characterReason?rank=' + characterRank">{{
            numReasons + '(点此查看)'
          }}</router-link>
          <div v-else>{{ numReasons }}</div>
        </div>
      </div>
    </div>
    <div class="md:mx-5 p-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      * 本页面为单独角色的详细信息页面，下面每个栏目的内容分别有各自的说明<br />
    </div>
    <!-- Vote Evolution -->
    <div class="md:mx-5 p-3">
      <div class="text-2xl py-0.5 border-b border-accent-600">投票演进</div>
      <div class="py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
        * 该图表表示该角色随着投票进程的票数变化情况。<br />
        * 投票日期：{{ startTimeString + ' ~ ' + deadlineString }}。<br />
        * 通过拖动底部和右侧的滑柄或在图表上缩放（鼠标或手指）可以筛选数据范围，也可以点击顶部的图例开关某个数据的显示。
      </div>
      <GraphEvolution :x-axis="GraphTimeRange" :data="trend" class="max-w-4xl pt-3 mx-auto" />
    </div>
    <!-- Questionnaire Complete -->
    <div class="md:mx-5 p-3">
      <div class="text-2xl py-0.5 border-b border-accent-600">投票群体 - 问卷填写情况</div>
      <GraphPie :data="questionnaireCompletionRates" :much-legend="true" class="max-w-4xl pt-3 mx-auto" />
    </div>
    <!-- Vote Group -->
    <div class="md:mx-5 p-3">
      <div class="text-2xl py-0.5 mb-3 border-b border-accent-600">投票群体 - 问卷回答情况</div>
      <div v-for="item in questionItem" :key="item.questionId" class="mb-3">
        <div class="py-0.5 border-b border-accent-300">
          {{ item.question }}
        </div>
        <div class="py-1 text-sm">
          {{ '总回答数：' + item.totalAnswers + '；男性数：' + item.totalMale + '；女性数：' + item.totalFemale }}
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
            :much-legend="item.answersCat.length > 5"
            class="max-w-4xl pt-3 mx-auto"
          />
        </div>
        <GraphRadar
          :indicator="getIndicator(item)"
          :data="getDataRadar(item)"
          v-else-if="item.type === 'Multiple'"
          class="max-w-4xl pt-3 mx-auto"
        />
        <router-link
          class="py-3 inline-block"
          :to="'QuestionnaireInputDetail?qid=' + item.questionId + '&q=chars:[&quot;' + characterName + '&quot;]'"
          v-else-if="item.type === 'Input'"
          >点击这里查看全部回答</router-link
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { gql, useQuery, useLazyQuery } from '@/composables/graphql'
import type { Query } from '@/composables/graphql'
import NProgress from 'nprogress'
import { characterList } from '@touhou-vote/shared/data/character'
import { toPercentageString } from '@/lib/numberFormat'
import {
  GraphDataLine,
  GraphTimeRange,
  getTrendData,
  getAddedTrendData,
  GraphDataPie,
  GraphDataSunburst,
  GraphDataRadar,
} from '@/lib/Graph'
import {
  allQuestionnaireIDList,
  qIDToID,
  findQuestionWithQuestionID,
  getSmallQuestionnaireChineseName,
} from '@/lib/Questionnaire'
import { startTimeString, deadlineString } from '@touhou-vote/shared/data/time'
import characterImages from '@/assets/defaultCharacterImage.png?url'
import GraphMap from '../components/GraphMap.vue'
import GraphPie from '../components/GraphPie.vue'
import GraphSunburst from '../components/GraphSunburst.vue'
import GraphRadar from '../components/GraphRadar.vue'
import GraphEvolution from '../components/GraphEvolution.vue'

const route = useRoute()

const characterRank = ref(
  Number(route.query.rank ? (Array.isArray(route.query.rank) ? route.query.rank[0] : route.query.rank) : 1)
)
const characterName = ref('ID：' + characterRank.value)
const characterImg = computed(
  () => characterList.find((item) => item.name === characterName.value)?.image || characterImages
)
const voteCount = ref(-1)
const firstVoteCount = ref(-1)
const firstVotePercentage = ref<number | string>(-1)
const votePercentage = ref<number | string>(-1)
const firstPercentage = ref<number | string>(-1)
const numReasons = ref(-1)
const trend = ref<GraphDataLine[]>([])
const { result, loading, onError } = useQuery<Query>(
  gql`
    query ($voteStart: DateTimeUtc!, $voteYear: Int!, $rank: Int!) {
      queryCharacterSingle(voteStart: $voteStart, voteYear: $voteYear, rank: $rank) {
        name
        voteCount
        firstVoteCount
        firstVotePercentage
        votePercentage
        firstPercentage
        numReasons
        trend {
          hrs
          cnt
        }
        trendFirst {
          hrs
          cnt
        }
      }
    }
  `,
  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    rank: characterRank.value,
  }
)
watchEffect(() => {
  if (result.value) {
    if (result.value.queryCharacterSingle) {
      characterName.value = result.value.queryCharacterSingle.name
      setSiteTitle(characterName.value + ' - 第⑩回 中文东方人气投票')
      QuestionnaireDetail(characterName.value)
      voteCount.value = result.value.queryCharacterSingle.voteCount
      firstVoteCount.value = result.value.queryCharacterSingle.firstVoteCount
      firstVotePercentage.value = toPercentageString(result.value.queryCharacterSingle.firstVotePercentage)
      votePercentage.value = toPercentageString(result.value.queryCharacterSingle.votePercentage)
      firstPercentage.value = toPercentageString(result.value.queryCharacterSingle.firstPercentage)
      numReasons.value = result.value.queryCharacterSingle.numReasons
      trend.value.push(
        getTrendData('总票数', result.value.queryCharacterSingle.trend),
        getAddedTrendData('新增票数', result.value.queryCharacterSingle.trend),
        getTrendData('总本命票数', result.value.queryCharacterSingle.trendFirst),
        getAddedTrendData('新增本命票', result.value.queryCharacterSingle.trendFirst)
      )
    }
  }
})
onError((err) => {
  alert(err.message)
  console.log(err.message)
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
  item.answersCat.map((item2) => indicator.push(item2.content))
  return indicator
}
function getDataRadar(item: QuestionItem): GraphDataRadar[] {
  const data = []
  data.push(
    { name: '总票数2', value: item.answersCat.map((item2) => item2.totalVotes) },
    { name: '男性票数', value: item.answersCat.map((item2) => item2.maleVotes) },
    { name: '女性票数', value: item.answersCat.map((item2) => item2.femaleVotes) }
  )
  return data
}
const {
  result: queryQuestionnaireResult,
  load: loadQuestionnaire,
  loading: queryQuestionnaireLoading,
  onError: queryQuestionnaireError,
  fetchMore: queryQuestionnaireMore,
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
  {
    voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
    voteYear: 10,
    query: 'chars:["' + characterName.value + '"]',
    questionsOfInterest: allQuestionnaireIDList.value,
  }
)
watchEffect(() => {
  if (queryQuestionnaireResult.value) {
    if (queryQuestionnaireResult.value.queryQuestionnaire) {
      questionItem.value = queryQuestionnaireResult.value.queryQuestionnaire.entries
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
    if (queryQuestionnaireResult.value.queryCompletionRates) {
      questionnaireCompletionRates.value = queryQuestionnaireResult.value.queryCompletionRates.items.map((item) => {
        return {
          name: getSmallQuestionnaireChineseName(item.name),
          value: item.numComplete,
        }
      })
    }
  }
})
queryQuestionnaireError((err) => {
  alert(err.message)
  console.log(err.message)
})
async function QuestionnaireDetail(name: string): Promise<void> {
  if (queryQuestionnaireDisabled.value)
    loadQuestionnaire(undefined, {
      voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
      voteYear: 10,
      query: 'chars:["' + name + '"]',
      questionsOfInterest: allQuestionnaireIDList.value,
    })
  else
    queryQuestionnaireMore({
      variables: {
        voteStart: new Date(Date.UTC(2022, 5, 17, 10)),
        voteYear: 10,
        query: 'chars:["' + name + '"]',
        questionsOfInterest: allQuestionnaireIDList.value,
      },
      updateQuery(previousQueryResult, { fetchMoreResult }) {
        if (!fetchMoreResult) return previousQueryResult
        return fetchMoreResult
      },
    })
}
watchEffect(() => {
  if (loading.value || queryQuestionnaireLoading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
</script>
<route lang="yaml">
meta:
  navid: character
</route>
