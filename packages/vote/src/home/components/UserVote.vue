<template>
  <div class="min-h-[calc(100vh-44px)] md:min-h-0">
    <!-- Main Content -->
    <div class="w-full p-3 space-y-2">
      <div class="baseBlock flex w-full p-0.5 shadow rounded">
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img src="https://s3c.lilywhite.cc/thvote/imgs/nav/character@100px.png" class="object-cover rounded" />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="w-full flex items-center space-x-2">
              <div class="text-xl truncate">角色部门</div>
              <span
                v-if="voteCharacterComplete"
                class="px-1 text-emerald-600 truncate rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
                >已投票
              </span>
              <span
                v-else
                class="px-1 text-amber-600 truncate rounded border border-amber-300 bg-amber-50 bg-opacity-50"
                >未投票
              </span>
            </div>
            <div class="text-sm">为喜欢的角色投票</div>
          </div>
          <div class="w-full text-right">
            <button class="px-2 py-0.5 text-sm rounded bg-accent-color-600 md:px-3 md:py-2" @click="voteCharacter()">
              {{ voteCharacterComplete ? '修改结果' : '开始投票' }}
            </button>
          </div>
        </div>
      </div>

      <div class="baseBlock flex w-full p-0.5 shadow rounded">
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img src="https://s3c.lilywhite.cc/thvote/imgs/nav/music@100px.png" class="object-cover rounded" />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="w-full flex items-center space-x-2">
              <div class="text-xl truncate">音乐部门</div>
              <span
                v-if="voteMusicComplete"
                class="px-1 text-emerald-600 truncate rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
                >已投票
              </span>
              <span
                v-else
                class="px-1 text-amber-600 truncate rounded border border-amber-300 bg-amber-50 bg-opacity-50"
                >未投票
              </span>
            </div>
            <div class="text-sm">为喜欢的音乐投票</div>
          </div>
          <div class="w-full text-right">
            <button class="px-2 py-0.5 text-sm rounded bg-accent-color-600 md:px-3 md:py-2" @click="voteMusic()">
              {{ voteMusicComplete ? '修改结果' : '开始投票' }}
            </button>
          </div>
        </div>
      </div>
      <div class="baseBlock flex w-full p-0.5 shadow rounded">
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img src="https://s3c.lilywhite.cc/thvote/imgs/nav/couple@100px.png" class="object-cover rounded" />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="w-full flex items-center space-x-2">
              <div class="text-xl truncate">CP部门</div>
              <span
                v-if="voteCoupleComplete"
                class="px-1 text-emerald-600 truncate rounded border border-emerald-300 bg-emerald-50 bg-opacity-50"
                >已投票
              </span>
              <span
                v-else
                class="px-1 text-amber-600 truncate rounded border border-amber-300 bg-amber-50 bg-opacity-50"
                >未投票
              </span>
            </div>
            <div class="text-sm">为喜欢的角色组合投票</div>
          </div>
          <div class="w-full text-right">
            <button class="px-2 py-0.5 text-sm rounded bg-accent-color-600 md:px-3 md:py-2" @click="voteCouple()">
              {{ voteCoupleComplete ? '修改结果' : '开始投票' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { voteCharacterComplete, voteCoupleComplete, voteMusicComplete } from '@/home/lib/user'

const router = useRouter()

function voteCharacter(): void {
  router.push('/vote/character')
}
function voteMusic(): void {
  router.push('/vote/music')
}
function voteCouple(): void {
  router.push('/vote/couple')
}
</script>
