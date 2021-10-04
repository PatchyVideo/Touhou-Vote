<template>
  <div class="page w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <div class="font-medium">第⑩届 国内东方人气投票 - CP部门</div>
    </div>

    <div
      class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 lg:w-1/3 xl:w-1/4 3xl:w-1/5 md:m-auto"
    >
      <div class="p-1 rounded w-full space-y-2 shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl">
          <div>{{ '角色组合(' + couplesValid.length + '/' + couples.length + ')' }}</div>
          <icon-uil-times />
        </div>
        <div class="shadow-inner p-2 rounded bg-gray-50 bg-opacity-50 space-y-2">
          <div v-if="!couplesValid.length" key="no-selecting" class="w-full text-center text-gray-400 py-10 space-y-2">
            <div>请点击下方的按钮</div>
            <div>选择一对你喜欢的CP吧!</div>
          </div>
          <div v-else key="selecting">
            <CoupleCard v-for="(couple, index) in couplesValid" :key="index" v-model:couple="couplesValid[index]" />
          </div>
          <div
            v-if="couplesValid.length < couples.length"
            class="w-full shadow text-center bg-white cursor-pointer select-none p-2 rounded dark:bg-gray-800"
            @click="addCouple()"
          >
            <icon-uil-plus class="text-lg" />
            <div>添加组合</div>
          </div>
        </div>
        <div class="px-2 pb-2 flex justify-between bg-white">
          <div class="text-xl">本命组合：</div>
        </div>
      </div>

      <button
        :class="{ 'bg-accent-color-300': !couplesValid.length }"
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
      >
        {{ couplesValid.length ? '提交!' : '请投票' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { couples, couplesValid } from '@/vote-couple/lib/voteData'
import CoupleCard from '@/vote-couple/components/CoupleCard.vue'

function addCouple(): void {
  couples.value[0].valid = true
}
</script>

<style lang="postcss" scoped></style>
