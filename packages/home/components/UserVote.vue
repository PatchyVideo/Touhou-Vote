<template>
  <div class="min-h-100vh md:min-h-0">
    <!-- Main Content -->
    <div class="w-full p-3 space-y-2">
      <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img
              src="https://upload.thwiki.cc/a/a6/THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png"
              class="object-cover rounded"
            />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="text-xl">
              角色部门
              <label v-if="voteCharacterComplete" class="p-0.5 rounded text-xs shadow bg-red-500 text-white"
                >完成</label
              >
            </div>
            <div class="text-xs"></div>
          </div>
          <div class="w-full text-right">
            <button
              class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600 md:px-3 md:py-2"
              @click="voteCharacter()"
            >
              {{ voteCharacterComplete ? '修改结果' : '开始投票' }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img
              src="https://upload.thwiki.cc/4/49/THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png"
              class="object-cover rounded"
            />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="text-xl">
              音乐部门
              <label v-if="voteMusicComplete" class="p-0.5 rounded text-xs shadow bg-red-500 text-white">完成</label>
            </div>
            <div class="text-xs"></div>
          </div>
          <div class="w-full text-right">
            <button
              class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600 md:px-3 md:py-2"
              @click="voteMusic()"
            >
              {{ voteMusicComplete ? '修改结果' : '开始投票' }}
            </button>
          </div>
        </div>
      </div>
      <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img
              src="https://upload.thwiki.cc/0/02/THBWiki-LOGO-%E4%B8%89%E6%9C%88%E7%B2%BE.png"
              class="object-cover rounded"
            />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="text-xl">
              CP部门
              <label v-if="voteCoupleComplete" class="p-0.5 rounded text-xs shadow bg-red-500 text-white">完成</label>
            </div>
            <div class="text-xs"></div>
          </div>
          <div class="w-full text-right">
            <button
              class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600 md:px-3 md:py-2"
              @click="voteCouple()"
            >
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
import { voteCharacterComplete, voteMusicComplete, voteCoupleComplete } from '@/home/lib/user'

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
