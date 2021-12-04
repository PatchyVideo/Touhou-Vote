<template>
  <div class="min-h-100vh page flex flex-col text-sm md:text-base xl:text-xl 2xl:text-2xl">
    <!-- Top Nav -->
    <div class="w-full py-1 pr-3 bg-white bg-opacity-80 shadow flex items-center justify-between">
      <div
        v-if="!systemListIsOpen || screenSizes['md']"
        class="w-2/3 pl-3 flex items-center justify-between md:w-1/3 xl:w-1/4"
      >
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
    <!-- Mobile View -->
    <div v-if="screenSizes['<md']" class="w-full overflow-hidden">
      <div
        class="w-2/1 flex transform-gpu transition-transform duration-300 space-x-1"
        :class="{ '-translate-x-1/2': systemListIsOpen }"
      >
        <div class="w-1/2 p-3 space-y-2">
          <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
            <div class="w-1/3 p-0.5 overflow-hidden rounded">
              <div class="w-full aspect-1/1">
                <img src="@/home/assets/DefaultAvatar.jpg" class="object-cover rounded" />
              </div>
            </div>
            <div class="w-2/3 p-0.5 flex flex-wrap content-between">
              <div class="w-full space-y-0.5">
                <div class="text-xl truncate">{{ '填写问卷' + (IsQuestionnaireAllDone ? '(完成)' : '') }}</div>
                <div class="text-xs">投票之前需要完成问卷哦投票之前需要完成问卷哦投票之前需要完成</div>
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
                <img src="@/home/assets/DefaultAvatar.jpg" class="object-cover rounded" />
              </div>
            </div>
            <div class="w-2/3 p-0.5 flex flex-wrap content-between">
              <div class="w-full space-y-0.5">
                <div class="text-xl truncate">参与投票</div>
                <div class="text-xs">投票之前需要完成问卷哦投票之前需要完成问卷哦投票之前需要完成</div>
              </div>
              <div class="w-full text-right">
                <button
                  class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600"
                  :class="{ 'bg-accent-color-300': !IsQuestionnaireAllDone }"
                  @click="IsQuestionnaireAllDone && systemListOpen('vote')"
                >
                  {{ IsQuestionnaireAllDone ? '开始投票' : '请先填写问卷哦' }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
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
          </div>
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

    <!-- DeskTop View -->
    <div v-else class="flex-grow w-9/10 mx-auto flex justify-between items-center lg:w-9/10 xl:w-2/3 3xl:w-1/2">
      <div class="w-3/10 overflow-hidden shadow-around">
        <div
          class="w-2/1 flex transform-gpu transition-transform duration-300"
          :class="{ '-translate-x-1/2': systemListIsOpen && systemListOpenName === 'questionnaire' }"
        >
          <div
            class="
              w-1/2
              flex flex-wrap
              space-y-2
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
              <div class="text-xl text-center truncate">
                {{ '填写问卷' + (IsQuestionnaireAllDone ? '(完成)' : '') }}
              </div>
              <div class="text-gray-600">投票之前需要完成问卷哦投票之前需要完成问卷哦投票之前需要完成</div>
            </div>
            <div class="w-full text-center">
              <button
                class="w-full p-2 rounded text-white bg-accent-color-600"
                @click="systemListOpen('questionnaire')"
              >
                {{ IsQuestionnaireAllDone ? '修改问卷' : '开始填写' }}
              </button>
            </div>
          </div>
          <UserQuestionnaire :desk-top-return="true" class="w-1/2" />
        </div>
      </div>

      <div class="w-3/10 overflow-hidden shadow-around">
        <div
          class="w-2/1 flex transform-gpu transition-transform duration-300"
          :class="{ '-translate-x-1/2': systemListIsOpen && systemListOpenName === 'vote' }"
        >
          <div
            class="
              w-1/2
              flex flex-wrap
              space-y-2
              p-2
              shadow
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
              <div class="text-xl text-center truncate">参与投票</div>
              <div class="text-gray-600">投票之前需要完成问卷哦投票之前需要完成问卷哦投票之前需要完成</div>
            </div>
            <div class="w-full text-center">
              <button
                class="w-full p-2 rounded text-white bg-accent-color-600"
                :class="{ 'bg-accent-color-300': !IsQuestionnaireAllDone }"
                @click="IsQuestionnaireAllDone && systemListOpen('vote')"
              >
                {{ IsQuestionnaireAllDone ? '开始投票' : '请先填写问卷哦' }}
              </button>
            </div>
          </div>
          <UserVote :desk-top-return="true" class="w-1/2" />
        </div>
      </div>

      <div
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
      </div>
    </div>
  </div>
  <VoteMessageBox v-model:open="ruleMessageBoxOpen" title="问卷填写规则：">
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
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { screenSizes } from '@/tailwindcss'
import { username, deleteUserData } from '@/home/lib/user'
import { IsQuestionnaireAllDone } from '@/questionnaire/lib/questionnaireData'
import { ruleMessageBoxOpen } from '@/home/lib/questionnaireRule'
import UserQuestionnaire from './components/UserQuestionnaire.vue'
import UserVote from './components/UserVote.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'

const route = useRoute()
const router = useRouter()

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

function logout(): void {
  deleteUserData()
  location.reload()
}
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
