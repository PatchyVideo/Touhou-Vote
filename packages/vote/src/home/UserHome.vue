<template>
  <div class="page"></div>
  <!-- Mobile View -->
  <div v-if="screenSizes['<lg']" class="min-h-100vh flex flex-col text-sm">
    <!-- Top Nav -->
    <div class="baseBoxRoundedShadow rounded-none w-full py-1 pr-3 flex items-center justify-between">
      <div v-if="!systemListIsOpen" class="pl-3 text-lg">第11届 中文东方人气投票</div>
      <div v-else class="flex items-center space-x-2">
        <icon-uil-angle-left-b class="w-8 h-8 cursor-pointer" @click="systemListClose()" />
        <div class="text-lg">
          {{
            systemListOpenName === 'questionnaire'
              ? '投票问卷'
              : systemListOpenName === 'vote'
              ? '人气投票'
              : 'ERROR PAGE'
          }}
        </div>
      </div>
      <img
        class="h-9 w-9 rounded-full ring-2 ring-accent-color-200 cursor-pointer"
        src="@/home/assets/DefaultAvatar.jpg"
        @click="userListOpen = true"
      />

      <!-- User List -->
      <Transition name="userList">
        <div v-if="userListOpen" class="baseBoxRoundedShadow absolute min-w-30 text-center top-6 z-51 right-0.5 p-2">
          <img
            class="absolute -top-5 right-2 h-11 w-11 rounded-full ring-2 ring-accent-color-200 cursor-pointer"
            src="@/home/assets/DefaultAvatar.jpg"
          />
          <div class="pr-15 truncate">{{ username }}</div>
          <div class="space-y-2 mt-2">
            <router-link
              to="/user/settings"
              class="block rounded cursor-pointer transition transition-colors hover:bg-accent-color-100"
            >
              <div>账号设置</div>
            </router-link>
            <div
              class="rounded cursor-pointer transition transition-colors hover:bg-accent-color-100"
              @click="logout()"
            >
              退出登陆
            </div>
          </div>
        </div>
      </Transition>
      <Mask v-model:open="userListOpen" click-to-close />
    </div>

    <!-- Main Content -->
    <div class="w-full overflow-hidden">
      <div
        class="w-2/1 flex transform-gpu transition-transform duration-300 space-x-1"
        :class="{ '-translate-x-1/2': systemListIsOpen }"
      >
        <div class="w-1/2 p-3 space-y-2">
          <div v-for="item in TabList" :key="item.type" class="baseBoxRoundedShadow flex w-full p-0.5">
            <div class="w-1/3 p-0.5 overflow-hidden rounded">
              <div class="w-full aspect-1/1">
                <img :src="item.icon" class="object-cover rounded" />
              </div>
            </div>
            <div class="w-2/3 p-0.5 flex flex-wrap content-between">
              <div class="w-full space-y-0.5">
                <div class="w-full flex items-center space-x-2">
                  <div class="text-xl truncate">{{ item.title }}</div>
                  <span
                    v-if="item.complete()"
                    class="px-1 text-emerald-600 rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
                    >完成
                  </span>
                </div>
                <div class="text-sm">{{ item.desc }}</div>
              </div>
              <div class="w-full text-right">
                <button
                  class="px-2 py-0.5 text-sm"
                  :class="{ 'bg-accent-color-300': item.buttonInactive() }"
                  @click="item.buttonFunction()"
                >
                  {{ item.buttonText() }}
                </button>
              </div>
            </div>
          </div>
          <Copyright copyright-type="absolute" />
        </div>
        <div class="w-1/2">
          <Component
            :is="
              systemListOpenName === 'questionnaire'
                ? UserQuestionnaire
                : systemListOpenName === 'vote'
                ? UserVote
                : UserQuestionnaire
            "
          />
        </div>
      </div>
    </div>
  </div>

  <!-- DeskTop View -->
  <div v-else class="relative h-100vh p-4">
    <!-- Skip Navigation -->
    <a
      class="z-52 absolute px-2 py-1 rounded-full bg-subaccent transform -translate-x-3/2 focus-visible:translate-x-0"
      href="#maincontent"
      >Skip Navigation</a
    >
    <!-- Left Nav -->
    <div
      class="grid grid-rows-3 grid-flow-col h-full text-lg lg:text-xl xl:text-2xl transition-all ease-in-out duration-600"
      :class="dpCollapseNav ? 'w-[calc(4ch+2rem)]' : 'w-[min(calc(30vh-2rem),calc(256px+3rem))]'"
      role="tablist"
      tabindex="0"
    >
      <RouterLink
        v-for="(tab, index) in TabList"
        :key="tab.type"
        class="flex flex-col justify-center items-center pr-8 py-4 rounded-xl border-2 transform focus-visible:-translate-x-0.5 transition-transform"
        :class="
          dpActiveTab === index
            ? 'bg-subaccent bg-opacity-100 border-accent-color-400'
            : 'bg-subaccent bg-opacity-50 border-accent-color-300 cursor-pointer'
        "
        :to="{ path: '/', query: { tab: index } }"
        role="tab"
      >
        <div class="flex min-h-0 aspect-square">
          <img class="object-contain" :src="tab.icon" />
        </div>
        <div
          class="mx-auto text-center transition-all ease-in-out duration-600"
          :class="dpCollapseNav ? 'w-2ch' : 'w-9ch'"
          v-text="tab.title"
        ></div>
      </RouterLink>
    </div>
    <!-- Content Box -->
    <div class="absolute top-4 bottom-4 left-4 right-4 flex flex-nowrap pointer-events-none">
      <!-- Left Padding -->
      <div
        class="text-lg lg:text-xl xl:text-2xl transition-all ease-in-out duration-600"
        :class="dpCollapseNav ? 'ml-[calc(4ch-2px)]' : 'ml-[min(calc(30vh-4rem-2px),calc(256px+1rem-2px))]'"
      ></div>
      <div
        class="flex-1 flex flex-col gap-4 pt-2 px-4 pb-px rounded-xl border-2 border-accent-color-400 bg-subaccent pointer-events-auto"
      >
        <!-- Top Nav -->
        <div class="flex justify-between">
          <div class="flex-1 text-lg lg:text-xl xl:text-2xl">
            <icon-uil-align-justify
              class="align-text-bottom cursor-pointer"
              tabindex="0"
              @click="() => (dpCollapseNav = !dpCollapseNav)"
              @keydown.enter="() => (dpCollapseNav = !dpCollapseNav)"
            />
            中文东方人气投票 第11回
          </div>
          <div class="flex flex-nowrap" @keydown.escape="() => (userListOpen = false)">
            <img
              class="h-8 w-8 rounded-full ring-2 ring-accent-color-200 cursor-pointer"
              src="@/home/assets/DefaultAvatar.jpg"
              tabindex="0"
              @click="() => (userListOpen = true)"
              @keydown.enter="() => (userListOpen = true)"
            />
            <!-- User List -->
            <Transition name="userList">
              <div
                v-if="userListOpen"
                class="baseBoxRoundedShadow absolute min-w-30 text-center top-6 z-51 right-1 p-2"
              >
                <img
                  class="absolute -top-5 right-2 h-11 w-11 rounded-full ring-2 ring-accent-color-200 cursor-pointer"
                  src="@/home/assets/DefaultAvatar.jpg"
                />
                <div class="pr-15 truncate">{{ username }}</div>
                <div class="space-y-2 mt-2">
                  <router-link
                    to="/user/settings"
                    class="block text-black rounded cursor-pointer transition transition-colors hover:bg-accent-color-100"
                  >
                    <div>账号设置</div>
                  </router-link>
                  <div
                    class="rounded cursor-pointer transition transition-colors hover:bg-accent-color-100"
                    tabindex="0"
                    @click="logout()"
                    @keydown.enter="logout()"
                  >
                    退出登陆
                  </div>
                </div>
              </div>
            </Transition>
            <Mask v-model:open="userListOpen" click-to-close />
          </div>
        </div>
        <!-- Main Content -->
        <div id="maincontent" :key="dpActiveTab" class="flex-1 overflow-auto">
          <component :is="TabList[dpActiveTab].component" />
        </div>
        <Copyright />
      </div>
    </div>
  </div>
  <VoteMessageBox v-model:open="resetTabMessageBoxOpen" title="提示" close-button>
    <div class="p-2">需要先完成<strong>必填问卷</strong>才能开始投票哦！</div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserQuestionnaire from '@/home/components/UserQuestionnaire.vue'
import UserVote from '@/home/components/UserVote.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import UserQuestionnaireDp from '@/home/components/UserQuestionnaireDp.vue'
import UserVoteDp from '@/home/components/UserVoteDp.vue'
import VoteDoujinDp from '@/vote-doujin/components/VoteDoujinDp.vue'
import Copyright from '@/common/components/Copyright.vue'
import Mask from '@/common/components/Mask.vue'
import { screenSizes } from '@/tailwindcss'
import {
  deleteUserData,
  username,
  voteCharacterComplete,
  voteCoupleComplete,
  voteDoujinComplete,
  voteMusicComplete,
} from '@/home/lib/user'
import { IsQuestionnaireAllDone } from '@/questionnaire/lib/questionnaireData'
import { setSiteTitle } from '@/common/lib/setSiteTitle'

setSiteTitle(String(username.value))

const route = useRoute()
const router = useRouter()

const TabList = [
  {
    type: 'questionnaire',
    title: '填写问卷',
    icon: 'https://s3c.lilywhite.cc/thvote/imgs/nav/questionnaireDetail@100px.png',
    desc: '投票之前请先完成调查问卷哦',
    complete: () => IsQuestionnaireAllDone.value,
    buttonText: () => (IsQuestionnaireAllDone.value ? '修改问卷' : '开始填写'),
    buttonInactive: () => false,
    buttonFunction: () => systemListOpen('questionnaire'),
    component: UserQuestionnaireDp,
  },
  {
    type: 'vote',
    title: '参与投票',
    icon: 'https://s3c.lilywhite.cc/thvote/imgs/nav/couple@100px.png',
    desc: '为您喜爱的角色/曲目/CP投上一票吧！',
    complete: () => voteCharacterComplete.value && voteMusicComplete.value && voteCoupleComplete.value,
    buttonText: () =>
      IsQuestionnaireAllDone.value
        ? voteCharacterComplete.value && voteMusicComplete.value && voteCoupleComplete.value
          ? '修改结果'
          : '开始投票'
        : '请先填写问卷哦',
    buttonInactive: () => !IsQuestionnaireAllDone.value,
    buttonFunction: () => IsQuestionnaireAllDone.value && systemListOpen('vote'),
    component: UserVoteDp,
  },
  {
    type: 'doujin',
    title: '作品提名',
    icon: 'https://s3c.lilywhite.cc/thvote/imgs/nav/doujin@100px.png',
    desc: '为自己喜爱的同人作品提名！',
    complete: () => voteDoujinComplete.value,
    buttonInactive: () => !IsQuestionnaireAllDone.value,
    buttonText: () =>
      IsQuestionnaireAllDone.value ? (voteDoujinComplete.value ? '修改提名' : '前往提名') : '请先填写问卷哦',
    buttonFunction: () => IsQuestionnaireAllDone.value && gotoDoujinSystem(),
    component: VoteDoujinDp,
  },
  // {
  //   value: 'doujin',
  //   title: '查看往届数据',
  //   icon: '@/home/assets/DefaultAvatar.jpg',
  //   desc: '回顾过去的投票！',
  //   complete: () => false,
  //   buttonInactive: () => false,
  //   buttonText: () => '查看数据',
  //   buttonFunction: () => {},
  //   component: VotePastDp,
  // },
]

/* User lists Operation */
const userListOpen = ref(false)

/* System List Operation */
const systemListIsOpen = computed<number>(() => {
  return route.query.open
    ? Array.isArray(route.query.open)
      ? Number(route.query.open[0])
      : Number(route.query.open)
    : 0
})
const systemListOpenName = computed<'questionnaire' | 'vote'>(() => {
  const listName = route.query.openList
    ? Array.isArray(route.query.openList)
      ? route.query.openList[0]
      : route.query.openList
    : 'questionnaire'
  if (listName != 'questionnaire' && listName != 'vote') return 'questionnaire'
  else return listName
})
function systemListOpen(listName: 'questionnaire' | 'vote'): void {
  const query = JSON.parse(JSON.stringify(route.query))
  query.openList = listName
  query.open = 1
  router.push({ path: route.path, query })
}
function systemListClose(): void {
  const query = JSON.parse(JSON.stringify(route.query))
  query.open = 0
  router.push({ path: route.path, query })
}
function gotoDoujinSystem(): void {
  router.push({ path: '/doujin' })
}

async function logout(): Promise<void> {
  deleteUserData()
  await router.push({ path: route.path, query: {} })
  location.reload()
}

// destop exclusive
const dpActiveTab = computed<number>({
  get: () => Number(route.query.tab) || 0,
  set: (v) => {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        tab: v,
      },
    })
  },
})
const resetTabMessageBoxOpen = ref(false)
watch(dpActiveTab, (tab) => {
  if (!IsQuestionnaireAllDone.value && tab > 0) {
    resetTabMessageBoxOpen.value = true
    router.push({
      path: route.path,
      query: {
        ...route.query,
        tab: 0,
      },
    })
  }
})
const dpCollapseNav = ref(screenSizes['<xl'])
</script>

<style lang="postcss" scoped>
.userList-enter-active,
.userList-leave-active {
  transition: opacity 0.2s ease;
}

.userList-enter-from,
.userList-leave-to {
  opacity: 0;
}
</style>
