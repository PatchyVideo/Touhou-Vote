<template>
  <div class="page w-full min-h-100vh flex flex-col">
    <div class="p-2 shadow flex items-center bg-white mb-2">
      <div class="font-medium">第⑩届 国内东方人气投票 - CP部门</div>
    </div>

    <div
      class="md:flex-grow flex flex-wrap md:content-center p-1 space-y-2 md:w-1/2 lg:w-1/3 xl:w-1/4 3xl:w-1/5 md:m-auto"
    >
      <div class="p-1 rounded w-full shadow bg-white bg-opacity-80">
        <div class="p-1 flex justify-between md:text-base xl:text-xl 2xl:text-2xl">
          <div>投票位1</div>
          <icon-uil-times />
        </div>
        <div class="p-2 rounded shadow-inner bg-gray-50 bg-opacity-50">
          <div key="no-selecting" class="w-full text-center text-gray-400 py-10 space-y-2">
            <div>可以从喜欢的角色中选择一位</div>
            <div class="underline cursor-pointer transition hover:text-gray-500">把Ta选为你的本命票哦</div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <div
          class="
            inline-block
            shadow
            bg-gray-50
            cursor-pointer
            select-none
            p-2
            transition-opacity
            rounded-full
            dark:bg-gray-800
          "
        >
          <icon-uil-plus class="text-lg w-full h-full" />
        </div>
      </div>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
      >
        请投票
      </button>
    </div>
  </div>
</template>
