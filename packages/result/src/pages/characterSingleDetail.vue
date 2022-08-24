<template>
  <div class="mx-1 my-3"></div>
  <!-- Overview -->
  <div
    class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded md:flex md:flex-wrap md:justify-between md:items-center"
  >
    <div class="flex items-end">
      <img :src="characterImg" class="w-10 h-10 col-span-1 row-span-2 rounded" />
      <h2 class="text-4xl font-light">{{ characterName }}</h2>
      <span class="ml-3 text-xl">角色信息</span>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-1 text-sm md:text-base text-center">
      <div>
        <div>票数</div>
        <div>{{ 0 }}</div>
      </div>
      <div>
        <div>本命票数</div>
        <div>{{ 0 }}</div>
      </div>
      <div>
        <div>本命率</div>
        <div>{{ 0 }}</div>
      </div>
      <div>
        <div>票数全局占比</div>
        <div>{{ 0 }}</div>
      </div>
      <div>
        <div>本命全局占比</div>
        <div>{{ 0 }}</div>
      </div>
      <div>
        <div>投票理由</div>
        <router-link class="underline" to="/">{{ 10000 + '(点此查看)' }}</router-link>
      </div>
    </div>
  </div>
  <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
    * 本页面为单独角色的详细信息页面，下面每个栏目的内容分别有各自的说明<br />
  </div>
  <div class="md:mx-5"></div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { characterList } from '@touhou-vote/shared/data/character'
import characterImages from '@/assets/defaultCharacterImage.png?url'

const route = useRoute()

const characterName = ref(
  String(route.query.name ? (Array.isArray(route.query.name) ? route.query.name[0] : route.query.name) : '博丽灵梦')
)
const characterImg = computed(
  () => characterList.find((item) => item.name === characterName.value)?.image || characterImages
)
setSiteTitle(characterName.value + ' - 第⑩回 中文东方人气投票')
</script>
