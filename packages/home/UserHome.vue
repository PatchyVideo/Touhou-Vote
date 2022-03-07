<template>
  <!-- Mobile View -->
  <div v-if="screenSizes['<lg']" class="min-h-100vh flex flex-col text-sm bg-accent-color-200">
    <!-- Top Nav -->
    <div class="w-full py-1 pr-3 bg-white bg-opacity-80 shadow flex items-center justify-between">
      <div v-if="!systemListIsOpen" class="w-2/3 pl-3 flex items-center justify-between md:w-1/3 xl:w-1/4">
        <div class="w-3/4"><img src="@/common/assets/title.svg" /></div>
        <div class="w-1/5"><img src="@/common/assets/title10.svg" /></div>
      </div>
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
        <div v-if="userListOpen" class="absolute min-w-30 text-center top-6 z-51 right-0.5 rounded bg-white p-2 shadow">
          <img
            class="absolute -top-5 right-2 h-11 w-11 rounded-full ring-2 ring-accent-color-200 cursor-pointer"
            src="@/home/assets/DefaultAvatar.jpg"
          />
          <div class="pr-15 truncate">{{ username }}</div>
          <div class="space-y-2 mt-2">
            <router-link
              to="/user/settings"
              class="block text-black rounded cursor-pointer transition transition-colors hover:bg-accent-color-100"
              ><div>账号设置</div></router-link
            >
            <div
              class="rounded cursor-pointer transition transition-colors hover:bg-accent-color-100"
              @click="logout()"
            >
              退出登陆
            </div>
          </div>
        </div>
      </Transition>
      <!-- Mask -->
      <Transition name="mask">
        <div
          v-if="userListOpen"
          class="fixed inset-0 bg-black bg-opacity-0 z-50"
          @click="userListOpen = false"
          @touchmove.prevent.passive
        ></div>
      </Transition>
    </div>

    <!-- Main Content -->
    <div class="w-full overflow-hidden">
      <div
        class="w-2/1 flex transform-gpu transition-transform duration-300 space-x-1"
        :class="{ '-translate-x-1/2': systemListIsOpen }"
      >
        <div class="w-1/2 p-3 space-y-2">
          <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
            <div class="w-1/3 p-0.5 overflow-hidden rounded">
              <div class="w-full aspect-1/1">
                <img
                  src="https://upload.thwiki.cc/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png"
                  class="object-cover rounded"
                />
              </div>
            </div>
            <div class="w-2/3 p-0.5 flex flex-wrap content-between">
              <div class="w-full space-y-0.5">
                <div class="text-xl truncate">
                  填写问卷
                  <label v-if="IsQuestionnaireAllDone" class="p-0.5 rounded text-xs shadow bg-red-500 text-white"
                    >完成</label
                  >
                </div>
                <div class="text-xs">投票之前请先完成调查问卷哦</div>
              </div>
              <div class="w-full text-right">
                <button
                  class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600"
                  @click="systemListOpen('questionnaire')"
                >
                  {{ IsQuestionnaireAllDone ? '修改问卷' : '开始填写' }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
            <div class="w-1/3 p-0.5 overflow-hidden rounded">
              <div class="w-full aspect-1/1">
                <img
                  src="https://upload.thwiki.cc/a/a6/THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png"
                  class="object-cover rounded"
                />
              </div>
            </div>
            <div class="w-2/3 p-0.5 flex flex-wrap content-between">
              <div class="w-full space-y-0.5">
                <div class="text-xl truncate">
                  参与投票
                  <label
                    v-if="voteCharacterComplete && voteMusicComplete && voteCoupleComplete"
                    class="p-0.5 rounded text-xs shadow bg-red-500 text-white"
                    >完成</label
                  >
                </div>
                <div class="text-xs">为你喜爱的角色/曲目/CP投上一票吧！</div>
              </div>
              <div class="w-full text-right">
                <button
                  class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600"
                  :class="{ 'bg-accent-color-300': !IsQuestionnaireAllDone }"
                  @click="IsQuestionnaireAllDone && systemListOpen('vote')"
                >
                  {{
                    IsQuestionnaireAllDone
                      ? voteCharacterComplete && voteMusicComplete && voteCoupleComplete
                        ? '修改结果'
                        : '开始投票'
                      : '请先填写问卷哦'
                  }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
            <div class="w-1/3 p-0.5 overflow-hidden rounded">
              <div class="w-full aspect-1/1">
                <img src="https://upload.thwiki.cc/f/f1/ConstructionClock.png" class="object-contain rounded" />
              </div>
            </div>
            <div class="w-2/3 p-0.5 flex flex-wrap content-between">
              <div class="w-full space-y-0.5">
                <div class="text-xl truncate">
                  <label class="text-accent-color-600">（NEW）</label>提名系统
                  <label v-if="voteDoujinComplete" class="p-0.5 rounded text-xs shadow bg-red-500 text-white"
                    >完成</label
                  >
                </div>
                <div class="text-xs">新系统，为自己喜爱的同人作品提名！</div>
              </div>
              <div class="w-full text-right">
                <button
                  class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600"
                  :class="{ 'bg-accent-color-300': !IsQuestionnaireAllDone }"
                  @click="IsQuestionnaireAllDone && gotoDoujinSystem()"
                >
                  {{ IsQuestionnaireAllDone ? (voteDoujinComplete ? '修改提名' : '前往提名') : '请先填写问卷哦' }}
                </button>
              </div>
            </div>
          </div>

          <!-- <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
            <div class="w-1/3 p-0.5 overflow-hidden rounded">
              <div class="w-full aspect-1/1">
                <img src="@/home/assets/DefaultAvatar.jpg" class="object-cover rounded" />
              </div>
            </div>
            <div class="w-2/3 p-0.5 flex flex-wrap content-between">
              <div class="w-full space-y-0.5">
                <div class="text-xl truncate">查看往届数据</div>
                <div class="text-xs">投票之前需要完成问卷哦投票之前需要完成问卷哦投票之前需要完成</div>
              </div>
              <div class="w-full text-right">
                <button class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600">查看数据</button>
              </div>
            </div>
          </div> -->
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
  <div v-else class="relative h-100vh p-4 bg-accent-color-200">
    <!-- Skip Navigation -->
    <a
      class="z-52 absolute px-2 py-1 rounded-full bg-white transform -translate-x-3/2 focus-visible:translate-x-0"
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
        v-for="(tab, index) in dpTabs"
        :key="tab.title"
        class="flex flex-col justify-center items-center pr-8 py-4 rounded-xl border-2 transform focus-visible:-translate-x-0.5 transition-transform"
        :class="
          dpActiveTab === index
            ? 'bg-white border-accent-color-400'
            : 'bg-accent-color-100 border-accent-color-300 cursor-pointer'
        "
        :to="{ path: '/', query: { tab: index } }"
        role="tab"
      >
        <div class="flex min-h-0 aspect-square">
          <img class="object-contain" :src="tab.icon" />
        </div>
        <div
          class="mx-auto text-black text-center transition-all ease-in-out duration-600"
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
        class="flex-1 flex flex-col gap-4 pt-2 px-4 pb-px rounded-xl border-2 border-accent-color-400 bg-white pointer-events-auto"
      >
        <!-- Top Nav -->
        <div class="flex justify-between">
          <div class="flex-1 text-lg lg:text-xl xl:text-2xl">
            <icon-uil-align-justify
              class="align-text-bottom text-gray-400 cursor-pointer"
              tabindex="0"
              @click="() => (dpCollapseNav = !dpCollapseNav)"
              @keydown.enter="() => (dpCollapseNav = !dpCollapseNav)"
            />
            中文东方人气投票 第⑩回
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
                class="absolute min-w-30 text-center top-6 z-51 right-1 rounded bg-white p-2 shadow"
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
                    ><div>账号设置</div></router-link
                  >
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
            <!-- Mask -->
            <Transition name="mask">
              <div
                v-if="userListOpen"
                class="fixed inset-0 bg-black bg-opacity-0 z-50"
                @click="() => (userListOpen = false)"
                @keydown.escape="() => (userListOpen = false)"
                @touchmove.prevent.passive
              ></div>
            </Transition>
          </div>
        </div>
        <!-- Main Content -->
        <div id="maincontent" :key="dpActiveTab" class="flex-1 overflow-auto">
          <component :is="dpTabs[dpActiveTab].component" />
        </div>
        <!-- Copyright -->
        <div class="quicksand text-sm text-gray-600 text-center">
          &copy; Copyright 2022 THBWiki, VoileLabs. Licensed under GPL-3.0.&ensp;
          <a target="_blank" rel="noopener noreferrer" href="https://jq.qq.com/?k=0BnkgDKx">反馈问题</a>&ensp;
          <a rel="noopener noreferrer" href="/nav">往届结果</a>
        </div>
      </div>
    </div>

    <!-- <div
        class="
          flex flex-wrap
          space-y-2
          w-3/10
          p-2
          shadow-around
          rounded
          bg-white bg-opacity-50
          backdrop-filter backdrop-blur-2
        "
      >
        <div class="w-full overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img src="@/home/assets/DefaultAvatar.jpg" class="object-cover rounded" />
          </div>
        </div>
        <div class="w-full space-y-2">
          <div class="text-xl text-center truncate">查看往届数据（100%）</div>
          <div class="text-gray-600">投票之前需要完成问卷哦投票之前需要完成问卷哦投票之前需要完成</div>
        </div>
        <div class="w-full text-center">
          <button class="w-full p-2 rounded text-white bg-accent-color-600" @click="systemListOpen('vote')">
            查看数据
          </button>
        </div>
      </div> -->
  </div>
  <VoteMessageBox v-model:open="QuestionnaireruleMessageBoxOpen" title="问卷填写规则：">
    <div class="p-2">
      <div class="space-y-2">
        <div>
          需要完成调查问卷才能开始投票哦，本次投票将投票问卷拆分成了8份，分成主问卷和额外问卷两个大类，填写规则如下：
        </div>
        <div>• 主问卷中必填问卷需要填写</div>
        <div>• 主问卷中可选问卷选择至少一个填写</div>
        <div>• 额外中必填问卷选择至少一个填写</div>
        <div>那么，祝各位投票愉快啦！</div>
      </div>
    </div>
  </VoteMessageBox>
  <VoteMessageBox v-model:open="resetTabMessageBoxOpen" title="提示">
    <div class="p-2">需要先完成调查问卷才能开始投票哦！</div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import UserQuestionnaire from '@/home/components/UserQuestionnaire.vue'
import UserVote from '@/home/components/UserVote.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import UserQuestionnaireDp from '@/home/components/UserQuestionnaireDp.vue'
import UserVoteDp from '@/home/components/UserVoteDp.vue'
import VoteDoujinDp from '@/vote-doujin/components/VoteDoujinDp.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { screenSizes } from '@/tailwindcss'
import {
  username,
  deleteUserData,
  voteCharacterComplete,
  voteMusicComplete,
  voteCoupleComplete,
  voteDoujinComplete,
} from '@/home/lib/user'
import { IsQuestionnaireAllDone } from '@/questionnaire/lib/questionnaireData'
import { ruleMessageBoxOpen } from '@/home/lib/questionnaireRule'
import { setSiteTitle } from '@/common/lib/setSiteTitle'

setSiteTitle(username.value + ' - 第⑩回 中文东方人气投票')

const route = useRoute()
const router = useRouter()

/* User lists Operation */
const userListOpen = ref(false)

/* Questionnaire rule message box open */
const QuestionnaireruleMessageBoxOpen = computed<boolean>({
  get() {
    return ruleMessageBoxOpen.value && systemListIsOpen.value === 1 && systemListOpenName.value === 'questionnaire'
  },
  set(value) {
    ruleMessageBoxOpen.value = value
  },
})

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

function logout(): void {
  deleteUserData()
  location.reload()
}

// Resize the height of UserQuestionnaire
function setUserQuestionnaireHeight(): void {
  if (screenSizes['<md']) return
  let userQuestionnaire = document.getElementById('userQuestionnaire')
  let userVoteBox = document.getElementById('userVoteBox')
  if (userQuestionnaire && userVoteBox)
    userQuestionnaire.style.maxHeight = window.getComputedStyle(userVoteBox).getPropertyValue('height')
}
onMounted(() => setUserQuestionnaireHeight())
useEventListener('resize', setUserQuestionnaireHeight)

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
const dpTabs = [
  {
    title: '填写问卷',
    icon: 'https://upload.thwiki.cc/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png',
    component: UserQuestionnaireDp,
  },
  {
    title: '参与投票',
    icon: 'https://upload.thwiki.cc/a/a6/THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png',
    component: UserVoteDp,
  },
  {
    title: '提名作品',
    icon: 'https://upload.thwiki.cc/f/f1/ConstructionClock.png',
    component: VoteDoujinDp,
  },
]
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
.mask-enter-active,
.mask-leave-active {
  @apply transition-all duration-200;
}
.mask-enter-from,
.mask-leave-to {
  @apply bg-opacity-0;
}
</style>
