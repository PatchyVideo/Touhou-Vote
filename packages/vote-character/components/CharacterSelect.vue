<template>
  <Transition name="mask">
    <div class="fixed inset-0 bg-black bg-opacity-20 z-50">
      <div
        class="
          h-160
          max-h-4/5
          flex flex-col
          mt-11
          p-3
          z-50
          space-y-2
          bg-white
          rounded
          w-9/10
          m-auto
          md:w-1/2 md:mt-12
          xl:w-1/4
        "
      >
        <div class="flex justify-between border-b">
          <div>请选择角色</div>
          <icon-uil-times class="cursor-pointer"></icon-uil-times>
        </div>
        <div class="flex justify-between items-center">
          <div class="shadow rounded h-7 w-1/2 flex justify-start items-center">
            <icon-uil-search class="flex-shrink-0 inline ml-2 mr-1" />
            <input class="nline-block h-full outline-none dark:bg-gray-800 w-full rounded" />
          </div>
          <div class="text-sm">从新到旧</div>
          <div class="text-sm">筛选</div>
        </div>
        <div class="flex-grow overflow-y-auto p-2 rounded shadow-inner bg-gray-50 flex flex-col space-y-1">
          <div v-for="(item, index) in characterList" :key="index" class="p-1 rounded shadow bg-white flex">
            <img class="w-1/3 rounded border" src="https://i.loli.net/2021/08/16/vUNt2gOj37F16cs.png" />
            <div class="w-9/10 p-1 flex flex-wrap content-between md:p-2">
              <div class="w-full">
                <div class="truncate text-sm">祭祀风的人类</div>
                <div class="font-semibold truncate">东风谷 早苗</div>
              </div>
              <div class="w-full flex justify-end">
                <div class="px-3 py-1 shadow rounded bg-red-500 text-white text-sm">选择</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, defineProps, defineEmits } from 'vue'

const characterList = ref([1, 2, 3])
</script>
<style lang="postcss" scoped>
.mask-enter-active,
.mask-leave-active {
  @apply transition-all duration-200;
}
.mask-enter-from,
.mask-leave-to {
  @apply bg-opacity-0;
}
</style>
