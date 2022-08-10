<template>
  <div
    class="fixed max-h-full z-50 transform transition-transform duration-300 inset-x-0 bottom-0 overflow-auto p-3 bg-white shadow border-accent-200 lt-sm:max-h-70vh lt-sm:rounded-t lt-sm:border-t sm:rounded-l sm:border-l sm:right-0 sm:inset-y-0 sm:left-auto sm:p-2 sm:w-95"
    :class="{ 'sm:translate-x-full translate-y-full sm:translate-y-0': !open }"
  >
    <div class="w-full border-b p-1 pb-1.5 flex justify-between">
      <div class="flex items-center flex-nowrap space-x-1">
        <div class="i-uil:search text-2xl transition-colors" />
        <div class="text-lg">高级搜索</div>
      </div>
      <div class="i-uil:times text-2xl transition-colors" @click="open = false" />
    </div>
    <div v-if="GUIMode" class="divide-y-1">
      <!-- Filter by result -->
      <div class="space-y-2 py-1">
        <div>从投票结果中筛选：</div>
        <div class="flex justify-between space-x-2 items-center">
          <div class="whitespace-nowrap">关键字：</div>
          <input
            v-model="keyword"
            class="focus:outline-none border rounded border-accent-300 px-1 py-0.5 shadow-inner"
            placeholder="请输入关键字"
          />
        </div>
        <div class="flex justify-between items-center">
          <div class="whitespace-nowrap">搜索种类：</div>
          <div class="flex max-w-72 flex-wrap gap-x-1">
            <div
              v-for="type in searchRangeDisplay"
              :key="type.key"
              class="px-2 py-0.5 rounded-lg text-sm border border-accent-300 cursor-pointer transition transition-colors whitespace-nowrap mb-1"
              :class="{
                'bg-accent-600 text-white': searchRange.findIndex((item) => item === type.key) !== -1,
              }"
              @click="changeSearchRange(type.key)"
            >
              {{ type.name }}
            </div>
          </div>
        </div>
        <div class="flex justify-between space-x-2 items-center">
          <div class="whitespace-nowrap">最大得票数：</div>
          <input
            v-model.number="maxCount"
            class="focus:outline-none border rounded border-accent-300 px-1 py-0.5 shadow-inner"
            placeholder="请输入最大得票数"
          />
        </div>
        <div class="flex justify-between space-x-2 items-center">
          <div class="whitespace-nowrap">最小得票数：</div>
          <input
            v-model.number="minCount"
            class="focus:outline-none border rounded border-accent-300 px-1 py-0.5 shadow-inner"
            placeholder="请输入最小得票数"
          />
        </div>
      </div>
      <!-- Filter by vote -->
      <div class="space-y-2 py-1">
        <div>从投票中筛选：</div>
        <div>角色部门投了以下角色：</div>
        <div class="rounded border border-dashed border-accent-600 p-1">
          <div v-if="characters.length || charactersFirst" class="flex flex-wrap">
            <div
              @click="deleteCharacter(item)"
              v-for="item in characters"
              :key="item"
              class="px-2 py-0.5 rounded-lg text-sm border border-accent-300 cursor-pointer whitespace-nowrap mb-1 mr-1 bg-accent-600 text-white"
            >
              {{ item + ' X' }}
            </div>
            <div
              @click="deleteCharacter(charactersFirst)"
              v-if="charactersFirst"
              class="px-2 py-0.5 rounded-lg text-sm border border-accent-300 cursor-pointer whitespace-nowrap mb-1 mr-1 bg-accent-600 text-white"
            >
              {{ '【本命】' + charactersFirst + ' X' }}
            </div>
          </div>
          <div v-else class="text-gray-600 text-center text-sm py-1">请选择角色</div>
        </div>
        <div class="flex justify-between">
          <VoteSelect
            class="w-50"
            :item-list="characterItemList"
            v-model:selected="characterSelected"
            selected-name="请选择角色"
          />
          <div class="flex items-center space-x-1">
            <input type="checkbox" v-model="ifaddcharacterFirst" />
            <div>本命</div>
          </div>
          <div
            class="px-3 rounded-xl text-sm text-white bg-accent-600 flex items-center cursor-pointer"
            @click="addCharacter(characterSelected.name)"
          >
            添加
          </div>
        </div>
        <div>音乐部门投了以下曲目：</div>
        <div class="rounded border border-dashed border-accent-600 p-1">
          <div v-if="musics.length || musicsFirst" class="flex flex-wrap">
            <div
              @click="deleteMusic(item)"
              v-for="item in musics"
              :key="item"
              class="px-2 py-0.5 rounded-lg text-sm border border-accent-300 cursor-pointer whitespace-nowrap mb-1 mr-1 bg-accent-600 text-white"
            >
              {{ item + ' X' }}
            </div>
            <div
              @click="deleteMusic(musicsFirst)"
              v-if="musicsFirst"
              class="px-2 py-0.5 rounded-lg text-sm border border-accent-300 cursor-pointer whitespace-nowrap mb-1 mr-1 bg-accent-600 text-white"
            >
              {{ '【本命】' + musicsFirst + ' X' }}
            </div>
          </div>
          <div v-else class="text-gray-600 text-center text-sm py-1">请选择曲目</div>
        </div>
        <div class="flex justify-between">
          <VoteSelect
            class="w-50"
            :item-list="musicItemList"
            v-model:selected="musicSelected"
            selected-name="请选择曲目"
          />
          <div class="flex items-center space-x-1">
            <input type="checkbox" v-model="ifaddmusicsFirst" />
            <div>本命</div>
          </div>
          <div
            class="px-3 rounded-xl text-sm text-white bg-accent-600 flex items-center cursor-pointer"
            @click="addMusic(musicSelected.name)"
          >
            添加
          </div>
        </div>
        <div>调查问卷回答了以下问题：</div>
        <div class="rounded border border-dashed border-accent-600 p-1">
          <div v-if="questionnaires.length" class="flex flex-wrap">
            <div
              v-for="item in questionnaires"
              :key="item.answerID"
              class="px-2 py-0.5 rounded-lg text-sm border border-accent-300 cursor-pointer mb-1 mr-1 bg-accent-600 text-white"
              @click="deleteQuestion(item.answerID)"
            >
              {{ item.questionContent + ' ' + item.answerContent + ' X' }}
            </div>
          </div>
          <div v-else class="text-gray-600 text-center text-sm py-1">请选择问题</div>
        </div>
        <div>
          <VoteSelect
            class="w-full"
            :item-list="questionnaireItemList"
            v-model:selected="questionnaireQuestion"
            selected-name="请选择问题"
          />
        </div>
        <div v-if="questionnaireAnswerIitemList.length" class="flex justify-between">
          <VoteSelect
            class="w-70"
            :item-list="questionnaireAnswerIitemList"
            v-model:selected="questionnaireAnswer"
            selected-name="请选择答案"
          />
          <div
            class="px-3 rounded-xl text-sm text-white bg-accent-600 flex items-center cursor-pointer"
            @click="addQuestion()"
          >
            添加
          </div>
        </div>
      </div>
    </div>
    <div v-else class="py-1 space-y-2">
      <div>
        <div class="whitespace-nowrap">查询指令：</div>
        <textarea
          v-model="queryword"
          class="focus:outline-none border rounded border-accent-300 px-1 py-0.5 shadow-inner w-full"
          placeholder="请输入指令"
        />
      </div>
      <div>
        <div>查询规则：</div>
        <div class="text-sm space-y-2">
          <div>
            <div class="font-bold">问卷内容：</div>
            <div class="pl-4">
              • q+问卷题目ID = 选项ID
              <div class="pl-4">示例：q11011 = 1101110</div>
              <div>
                问卷ID相关内容请参阅<a
                  class="transition transition-colors underline p-1"
                  href="https://github.com/PatchyVideo/Touhou-Vote/blob/dev/packages/shared/data/questionnaire.ts#L67"
                  target="_blank"
                  >这里</a
                >
              </div>
            </div>
          </div>
          <div>
            <div class="font-bold">角色部门投票结果：</div>
            <div class="pl-4">
              • chars：角色名称数组
              <div class="pl-4">
                示例：chars: ["东风谷早苗", "博丽灵梦"]
                <div class="text-xs italic">
                  【注意】数组里的结果是以或的形式查询的，即示例中，查询的结果是角色部门中投了“东风谷早苗”或“博丽灵梦”的票中，各角色的投票结果
                </div>
              </div>
              • chars_first = 角色名
              <div class="pl-4">示例：chars_first="东风谷早苗"</div>
            </div>
          </div>
          <div>
            <div class="font-bold">音乐部门投票结果：</div>
            <div class="pl-4">
              • musics：曲目名称数组
              <div class="pl-4">
                示例：musics: ["信仰是为了虚幻之人", "Native Faith"]
                <div class="text-xs italic">
                  【注意】数组里的结果是以或的形式查询的，即示例中，查询的结果是音乐部门中投了“信仰是为了虚幻之人”或“Native
                  Faith”的票中，各曲目的投票结果
                </div>
              </div>
              • musics_first = 曲目名
              <div class="pl-4">示例：chars_first="信仰是为了虚幻之人"</div>
            </div>
          </div>
          <div>
            <div class="font-bold">规则间的逻辑关系：</div>
            <div class="pl-4">
              • 不同规则相互叠加的情况，使用 AND 关键字连接
              <div class="pl-4">
                示例：q11011 = 1101110 AND chars: ["东风谷早苗"] AND chars: ["博丽灵梦"]
                <div class="text-xs italic">
                  【注意】同一规则也可以使用 AND 关键字进行并列，如示例中，查询的结果是
                  [问题id11011回答的结果是1101110，且同时在角色部门投了“东风谷早苗”和“博丽灵梦”]
                  的票中，各角色的投票结果
                </div>
              </div>
              • 不同规则并列的情况，使用 OR 关键字连接
              <div class="pl-4">示例：q11011 = 1101110 OR chars: ["东风谷早苗"]</div>
              • 上述两种逻辑关系可以使用“(”或“)”调整优先级
              <div class="pl-4">
                示例：(q11011 = 1101110 AND chars: ["东风谷早苗"]) OR chars_first="信仰是为了虚幻之人"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Reset or search -->
    <div class="flex justify-around border-t pt-3">
      <button class="px-10 py-2 rounded-xl text-white bg-accent-600 justify-center" @click="reset()">重置</button>
      <button class="px-10 py-2 rounded-xl text-white bg-accent-600 justify-center" @click="search()">搜索</button>
    </div>
    <div
      class="my-1 text-sm text-accent-600 transition transition-colors hover:text-black cursor-pointer flex justify-end items-center"
      @click="GUIMode = !GUIMode"
    >
      <div class="i-uil:arrow-right text-2xl transition-colors" />
      {{ GUIMode ? '更多功能请切换到指令模式' : '返回图形用户界面模式' }}
    </div>
  </div>
  <!-- Mask -->
  <Transition
    enter-active-class="transition-all duration-200"
    enter-from-class="bg-opacity-0"
    leave-active-class="transition-all duration-200"
    leave-to-class="bg-opacity-0"
  >
    <div v-if="open" class="fixed inset-0 z-49" @click="open = false" />
  </Transition>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVModel } from '@vueuse/core'
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { characterList } from '@touhou-vote/shared/data/character'
import { musicList } from '@touhou-vote/shared/data/music'
import { questionnaire, Question } from '@touhou-vote/shared/data/questionnaire'
import VoteSelect from '@/components/VoteSelect.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
    requred: true,
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const route = useRoute()
const router = useRouter()

const open = useVModel(props, 'open', emit)

// Initialize additional constraint with url
const additionalConstraintUrl = ref(
  String(route.query.a ? (Array.isArray(route.query.a) ? route.query.a[0] : route.query.a) : '')
)
const additionalConstraintObject = ref<{
  characters: string[]
  charactersFirst: string | null
  musics: string[]
  musicsFirst: string | null
  questionnaire: {
    questionContent: string
    questionID: string
    answerContent: string
    answerID: string
  }[]
}>(
  additionalConstraintUrl.value === ''
    ? {
        characters: [],
        charactersFirst: null,
        musics: [],
        musicsFirst: null,
        questionnaire: [],
      }
    : JSON.parse(decompressFromEncodedURIComponent(additionalConstraintUrl.value) || '{}')
)

// Count range
const maxCount = ref(
  Number(
    route.query.maxCount
      ? Array.isArray(route.query.maxCount)
        ? route.query.maxCount[0]
        : route.query.maxCount
      : 99999
  )
)
const minCount = ref(
  Number(
    route.query.minCount ? (Array.isArray(route.query.minCount) ? route.query.minCount[0] : route.query.minCount) : 0
  )
)

// Keyword and search range
const keyword = ref(
  String(route.query.keyword ? (Array.isArray(route.query.keyword) ? route.query.keyword[0] : route.query.keyword) : '')
)
type SearchRange = 'work' | 'name' | 'jpnName'
const searchRangeDisplay: {
  name: string
  key: SearchRange
}[] = [
  { name: '所属作品', key: 'work' },
  { name: '角色名', key: 'name' },
  { name: '日文名', key: 'jpnName' },
]
const searchRangeToNumber: { is: SearchRange[]; value: number }[] = [
  {
    is: ['work', 'name', 'jpnName'],
    value: 7,
  },
  {
    is: ['work', 'name'],
    value: 6,
  },
  {
    is: ['work', 'jpnName'],
    value: 5,
  },
  {
    is: ['work'],
    value: 4,
  },
  {
    is: ['name', 'jpnName'],
    value: 3,
  },
  {
    is: ['name'],
    value: 2,
  },
  {
    is: ['jpnName'],
    value: 1,
  },
]
const searchRange = ref<SearchRange[]>(
  JSON.parse(
    JSON.stringify(
      searchRangeToNumber.find(
        (item) =>
          item.value ===
          Number(
            route.query.searchRange
              ? Array.isArray(route.query.searchRange)
                ? route.query.searchRange[0]
                : route.query.searchRange
              : 7
          )
      )?.is || ['work', 'name', 'jpnName']
    )
  )
)
function convertSearchRangeToNumber(): number {
  let searchRangeToNumber2: { is: SearchRange[]; value: number }[] = JSON.parse(JSON.stringify(searchRangeToNumber))
  searchRangeToNumber2 = searchRangeToNumber2.map((item) => {
    item.is = item.is.sort()
    return item
  })
  const searchRange2: SearchRange[] = JSON.parse(JSON.stringify(searchRange.value)).sort()
  return searchRangeToNumber2.find((item) => JSON.stringify(item.is) === JSON.stringify(searchRange2))?.value || 7
}
function changeSearchRange(value: SearchRange): void {
  const indexOfType = searchRange.value.indexOf(value)
  if (indexOfType !== -1) {
    searchRange.value.splice(indexOfType, 1)
  } else {
    searchRange.value.push(value)
  }
}

// Filter for vote character
const characterItemList = computed(() =>
  characterList
    .filter(
      (item) => characters.value.findIndex((item2) => item2 === item.name) === -1 && item.name != charactersFirst.value
    )
    .map((item) => {
      return {
        name: item.name,
        value: item.name,
      }
    })
)
const characterSelected = ref({
  name: '',
  value: '',
})
const characters = ref<string[]>(additionalConstraintObject.value.characters)
const charactersFirst = ref<string | null>(additionalConstraintObject.value.charactersFirst)
const ifaddcharacterFirst = ref(false)
function addCharacter(character: string) {
  if (character === '') return
  if (ifaddcharacterFirst.value) {
    if (charactersFirst.value) characters.value.push(charactersFirst.value)
    charactersFirst.value = character
  } else characters.value.push(character)
  ifaddcharacterFirst.value = false
  characterSelected.value = {
    name: '',
    value: '',
  }
}
function deleteCharacter(character: string | null) {
  if (!character) return
  if (character === charactersFirst.value) charactersFirst.value = null
  else if (characters.value.findIndex((item) => item === character) != -1) {
    characters.value.splice(
      characters.value.findIndex((item) => item === character),
      1
    )
  }
}

// Filter for vote music
const musicItemList = computed(() =>
  musicList
    .filter((item) => musics.value.findIndex((item2) => item2 === item.name) === -1 && item.name != musicsFirst.value)
    .map((item) => {
      return {
        name: item.name,
        value: item.name,
      }
    })
)
const musicSelected = ref({
  name: '',
  value: '',
})
const musics = ref<string[]>(additionalConstraintObject.value.musics)
const musicsFirst = ref<string | null>(additionalConstraintObject.value.musicsFirst)
const ifaddmusicsFirst = ref(false)
function addMusic(music: string) {
  if (music === '') return
  if (ifaddmusicsFirst.value) {
    if (musicsFirst.value) musics.value.push(musicsFirst.value)
    musicsFirst.value = music
  } else musics.value.push(music)
  ifaddmusicsFirst.value = false
  musicSelected.value = {
    name: '',
    value: '',
  }
}
function deleteMusic(music: string | null) {
  if (!music) return
  if (music === musicsFirst.value) musicsFirst.value = null
  else if (musics.value.findIndex((item) => item === music) != -1) {
    musics.value.splice(
      musics.value.findIndex((item) => item === music),
      1
    )
  }
}

// Filter for questionnaire
const questionnaires = ref<
  {
    questionContent: string
    questionID: string
    answerContent: string
    answerID: string
  }[]
>(additionalConstraintObject.value.questionnaire)
const questionnaireQuestion = ref({
  name: '',
  value: '',
})
const questionnaireAnswer = ref({
  name: '',
  value: '',
})
const questionnaireItemList = computed<
  {
    name: string
    value: string
  }[]
>(() => {
  let questionnaireItemList = []
  for (const bigquestionnaire in questionnaire)
    for (const smallquestionnaire in questionnaire[bigquestionnaire])
      for (const questionLib of questionnaire[bigquestionnaire][smallquestionnaire].questions)
        for (const question of questionLib)
          if (
            question.type === 'Single' &&
            !questionnaires.value.find((item) => item.questionID === String(question.id))
          )
            questionnaireItemList.push({
              name: question.question,
              value: String(question.id),
            })
          else if (question.type === 'Multiple' && checkQuestionAvailable(question))
            questionnaireItemList.push({
              name: question.question,
              value: String(question.id),
            })
  return questionnaireItemList
})
const questionnaireAnswerIitemList = computed<
  {
    name: string
    value: string
  }[]
>(() => {
  for (const bigquestionnaire in questionnaire)
    for (const smallquestionnaire in questionnaire[bigquestionnaire])
      for (const questionLib of questionnaire[bigquestionnaire][smallquestionnaire].questions)
        for (const question of questionLib)
          if (String(question.id) === questionnaireQuestion.value.value)
            return question.options
              .filter((item) => questionnaires.value.findIndex((item2) => item2.answerID === String(item.id)) === -1)
              .map((item) => {
                return {
                  name: item.content,
                  value: String(item.id),
                }
              })
  return []
})
function checkQuestionAvailable(question: Question): boolean {
  var flag = 0
  for (const item of questionnaires.value) {
    if (item.questionID === String(question.id)) flag++
  }
  if (flag === question.options.length) return false
  else return true
}
function addQuestion() {
  if (questionnaireQuestion.value.name === '' || questionnaireAnswer.value.name === '') return
  questionnaires.value.push({
    questionContent: questionnaireQuestion.value.name,
    questionID: questionnaireQuestion.value.value,
    answerContent: questionnaireAnswer.value.name,
    answerID: questionnaireAnswer.value.value,
  })
  questionnaireQuestion.value = {
    name: '',
    value: '',
  }
  questionnaireAnswer.value = {
    name: '',
    value: '',
  }
}
function deleteQuestion(ansId: string) {
  questionnaires.value.splice(
    questionnaires.value.findIndex((item) => item.answerID === ansId),
    1
  )
}

// Cli model
const GUIMode = ref(true)
const queryword = ref(String(route.query.q ? (Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : ''))

// Reset
function reset() {
  if (GUIMode.value) {
    maxCount.value = 99999
    minCount.value = 0
    keyword.value = ''
    searchRange.value = ['work', 'name', 'jpnName']
    characters.value = []
    charactersFirst.value = null
    musics.value = []
    musicsFirst.value = null
    questionnaires.value = []
  } else {
    queryword.value = ''
  }
}

// Search
function checkSubmitContent(): boolean {
  if (isNaN(maxCount.value) || !Number.isSafeInteger(maxCount.value) || maxCount.value < minCount.value) {
    alert('请检查最大得票数的填写是否正确！')
    return false
  }
  if (isNaN(minCount.value) || !Number.isSafeInteger(minCount.value) || minCount.value < 0) {
    alert('请检查最小得票数的填写是否正确！')
    return false
  }
  return true
}
const additionalConstraintCompressed = computed(() => {
  return compressToEncodedURIComponent(
    JSON.stringify({
      characters: characters.value,
      charactersFirst: charactersFirst.value,
      musics: musics.value,
      musicsFirst: musicsFirst.value,
      questionnaire: questionnaires.value,
    })
  )
})

function search(): void {
  if (!checkSubmitContent() && GUIMode.value) return
  const query = {
    maxCount: maxCount.value,
    minCount: minCount.value,
    keyword: keyword.value,
    searchRange: convertSearchRangeToNumber(),
    gui: GUIMode.value ? 1 : 0,
    a: additionalConstraintCompressed.value,
    q: queryword.value,
  }
  router.push({ path: route.path, query })
  open.value = false
}
</script>
