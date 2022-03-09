<template>
  <div class="page"></div>
  <div class="w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <BackToHome :show="true" :saveable="false" />
      <div class="font-medium">第⑩届 国内东方人气投票 - CP部门</div>
    </div>

    <div class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 3xl:w-1/4 md:m-auto">
      <div class="p-1 rounded w-full space-y-2 shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl">
          <div>{{ '角色组合(' + couplesValid.length + '/' + couples.length + ')' }}</div>
        </div>
        <div class="shadow-inner p-2 rounded bg-gray-50 bg-opacity-50 space-y-2">
          <transition name="couple" mode="out-in">
            <div
              v-if="!couplesValid.length"
              key="no-selecting"
              class="w-full text-center text-gray-400 py-10 space-y-2"
            >
              <div>请点击下方的按钮</div>
              <div>选择一对你喜欢的CP吧!</div>
            </div>
            <div v-else key="selecting">
              <transition-group name="coupleList" tag="div">
                <div
                  v-for="(couple, index) in couplesValid"
                  :key="index"
                  class="transition transition-all duration-200 mb-2"
                >
                  <CoupleCard v-model:couple="couplesValid[index]" :index-of-couple="index" />
                </div>
              </transition-group>
            </div>
          </transition>
          <transition name="addMore" mode="out-in">
            <div
              v-if="couplesValid.length < couples.length"
              class="w-full shadow text-center bg-white cursor-pointer select-none p-2 rounded"
              @click="addCouple()"
            >
              <icon-uil-plus class="text-lg" />
              <div>添加组合</div>
            </div>
          </transition>
        </div>
        <div v-show="couplesValid.length" class="px-2 pb-2 flex justify-between">
          <div class="text-xl">本命组合：</div>
          <VoteSelect v-model:selected="coupleHonmeiNumber" :item-list="coupleHonmeiOptions" />
        </div>
      </div>

      <button
        :class="{ 'bg-accent-color-300': !couplesValid.length }"
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        @click="checkVote()"
      >
        {{ couplesValid.length ? '提交!' : '请投票' }}
      </button>
    </div>
  </div>
  <VoteMessageBox v-model:open="confirmBoxOpen" title="请确定投票内容：">
    <div class="overflow-auto">
      <div class="divide-y p-2">
        <div v-if="coupleHonmei.honmei" class="py-1">
          <div class="text-lg">
            <label>本命CP：</label>
            <label v-for="(character, index) in computeCharactersValid(coupleHonmei.characters)" :key="character.id"
              >{{ character.name
              }}<label v-if="coupleHonmei.seme === index" class="text-accent-color-600">(攻)</label>，</label
            >
          </div>
        </div>
        <div v-for="(couple, indexCouple) in couplesValidWithoutHonmei" :key="indexCouple" class="py-1">
          <div class="">
            <label>{{ '投票位' + (indexCouple + 1) + '：' }}</label>
            <label v-for="(character, indexCharacter) in computeCharactersValid(couple.characters)" :key="character.id"
              >{{ character.name
              }}<label v-if="couple.seme === indexCharacter" class="text-accent-color-600">(攻)</label
              ><label v-if="indexCharacter != computeCharactersValid(couple.characters).length - 1">，</label></label
            >
          </div>
        </div>
        <div class="text-gray-500 italic">*票位序号仅给用户参考，不影响加权<br />*投票期间可随时更改投票内容哦</div>
      </div>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        :class="{ 'bg-accent-color-300': loading }"
        @click="vote()"
      >
        <icon-uil-spinner-alt v-if="loading" class="animate-spin" /><label>{{
          loading ? '投票中' : '确认投票！'
        }}</label>
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { couples, updateVotecouple } from '@/vote-couple/lib/voteData'
import { couplesValid, coupleHonmei, couplesValidWithoutHonmei } from '@/vote-couple/lib/coupleList'
import CoupleCard from '@/vote-couple/components/CoupleCard.vue'
import VoteSelect from '@/common/components/VoteSelect.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import BackToHome from '@/common/components/BackToHome.vue'
import { Character, character0 } from '@/vote-character/lib/character'
import { useMutation, useQuery, gql, useResult } from '@/graphql'
import type { Mutation, Query, schema } from '@/graphql'
import { voteToken, voteCoupleComplete } from '@/home/lib/user'
import { setSiteTitle } from '@/common/lib/setSiteTitle'
import NProgress from 'nprogress'

setSiteTitle('CP部门 - 第⑩回 中文东方人气投票')

const {
  result,
  loading: getSubmitCPVoteLoading,
  onError: getSubmitCPVoteError,
} = useQuery<Query>(
  gql`
    query ($voteToken: String!) {
      getSubmitCPVote(voteToken: $voteToken) {
        cps {
          nameA
          nameB
          nameC
          active
          first
        }
      }
    }
  `,
  {
    voteToken: voteToken.value,
  },
  {
    fetchPolicy: 'network-only',
  }
)
watchEffect(() => {
  if (getSubmitCPVoteLoading.value) {
    if (!NProgress.isStarted()) NProgress.start()
  } else {
    if (NProgress.isStarted()) NProgress.done()
  }
})
const resultData = useResult(result, null, (data) => data?.getSubmitCPVote)
watchEffect(() => {
  if (resultData.value) {
    updateVotecouple(resultData.value.cps)
  }
})
getSubmitCPVoteError((err) => {
  console.log(err.message)
  if (err.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else alert('获取投票信息失败！失败原因：' + err.message)
})

const coupleHonmeiOptions = computed(() =>
  new Array(couplesValid.value.length).fill(null).map((item, index) => {
    return {
      name: '投票位' + (index + 1),
      value: index,
    }
  })
)
const coupleHonmeiNumber = ref(updateCoupleHonmeiNumber())
function updateCoupleHonmeiNumber() {
  const honmeiIndex = couplesValid.value.findIndex((couple) => couple.honmei)
  return honmeiIndex === -1 ? { name: '', value: -1 } : { name: '投票位' + (honmeiIndex + 1), value: honmeiIndex }
}
// Note: 'couples.value[coupleHonmeiNumber.value.value].honmei = true' has been moved to function vote() to avoid infinite call bug.
watch(
  couples,
  () => {
    coupleHonmeiNumber.value = updateCoupleHonmeiNumber()
  },
  { deep: true }
)

function addCouple(): void {
  couples.value[couplesValid.value.length].valid = true
}

const confirmBoxOpen = ref(false)

function computeCharactersValid(characterList: Character[]): Character[] {
  return characterList.filter((character) => character.id != character0.id)
}

function checkVote(): void {
  couples.value.map((item) => {
    item.honmei = false
  })
  if (coupleHonmeiNumber.value.value != -1) couples.value[coupleHonmeiNumber.value.value].honmei = true
  for (let i = 0; i < couplesValid.value.length; i++)
    if (computeCharactersValid(couplesValid.value[i].characters).length < 2) {
      alert('投票位' + (i + 1) + '选择的角色数量小于两个！')
      return
    }
  for (let i = 0; i < couplesValid.value.length; i++)
    for (let j = i + 1; j < couplesValid.value.length; j++) {
      let characterOverlapNumber = 0
      for (let m = 0; m < couplesValid.value[i].characters.length; m++)
        for (let n = 0; n < couplesValid.value[j].characters.length; n++) {
          if (couplesValid.value[i].characters[m].id === couplesValid.value[j].characters[n].id)
            characterOverlapNumber++
        }
      if (couplesValid.value[i].seme != -1 && couplesValid.value[j].seme != -1)
        if (
          characterOverlapNumber ===
            Math.min(couplesValid.value[i].characters.length, couplesValid.value[j].characters.length) &&
          couplesValid.value[i].characters[couplesValid.value[i].seme].name ===
            couplesValid.value[j].characters[couplesValid.value[j].seme].name
        ) {
          alert('投票位' + (i + 1) + '投票位' + (j + 1) + '重复！')
          return
        }
    }
  confirmBoxOpen.value = true
}

const CPSubmit = computed<schema.CpSubmit[]>(() =>
  couplesValid.value.map((item) => {
    if (item.seme === -1)
      if (computeCharactersValid(item.characters).length === 3)
        return {
          nameA: computeCharactersValid(item.characters)[0].name,
          nameB: computeCharactersValid(item.characters)[1].name,
          nameC: computeCharactersValid(item.characters)[2].name,
          first: item.honmei,
        }
      else
        return {
          nameA: computeCharactersValid(item.characters)[0].name,
          nameB: computeCharactersValid(item.characters)[1].name,
          first: item.honmei,
        }
    else {
      if (computeCharactersValid(item.characters).length === 3)
        return {
          nameA: computeCharactersValid(item.characters)[0].name,
          nameB: computeCharactersValid(item.characters)[1].name,
          nameC: computeCharactersValid(item.characters)[2].name,
          active: item.characters[item.seme].name,
          first: item.honmei,
        }
      else
        return {
          nameA: computeCharactersValid(item.characters)[0].name,
          nameB: computeCharactersValid(item.characters)[1].name,
          active: item.characters[item.seme].name,
          first: item.honmei,
        }
    }
  })
)
const router = useRouter()
async function vote(): Promise<void> {
  mutate({ content: { voteToken: voteToken.value, cps: CPSubmit.value } })
}
const { mutate, loading, onDone, onError } = useMutation<Mutation>(
  gql`
    mutation ($content: CPSubmitGQL!) {
      submitCPVote(content: $content)
    }
  `
)
onDone((result) => {
  alert('投票成功！')
  voteCoupleComplete.value = true
  router.push({ path: '/' })
})
onError((error) => {
  console.log(error.graphQLErrors[0].extensions)
  if (error.graphQLErrors[0].extensions.error_kind === 'REQUEST_TOO_FREQUENT') alert('请求过于频繁！')
  else alert('投票失败，原因：' + error.graphQLErrors[0].extensions.human_readable_message)
})
</script>

<style lang="postcss" scoped>
.addMore-enter-active,
.addMore-leave-active,
.couple-enter-active,
.couple-leave-active {
  @apply transition-all duration-200;
}
.addMore-enter-from,
.addMore-leave-to,
.couple-enter-from,
.couple-leave-to {
  @apply opacity-0;
}
.coupleList-enter-active,
.coupleList-leave-active {
  @apply transition transition-all duration-200;
}

.coupleList-enter-from,
.coupleList-leave-to {
  @apply opacity-0  translate-y-2;
}
</style>
