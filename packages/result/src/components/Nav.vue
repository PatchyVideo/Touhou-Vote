<template>
  <div class="z-50 fixed w-full md:sticky bg-white" :class="{ '-top-px': !noTop, 'top-0': noTop }">
    <div v-if="!noTop" class="w-full h-px bg-accent-400"></div>

    <div class="flex p-1 justify-between transition-colors md:hidden" :class="{ 'bg-white': !showSummary }">
      <div
        class="transition-all overflow-hidden"
        :class="{
          '-translate-y-full': showSummary,
          'translate-y-0': !showSummary,
        }"
      >
        <RouterLink to="/" class="flex items-center gap-1">
          <img src="/favicon.ico" class="w-6 h-6 m-1 rounded" />
          <div class="text-black text-xl">中文东方人气投票</div>
        </RouterLink>
      </div>

      <div
        class="w-8 h-8 p-1 rounded-full border-1 border-accent-400 bg-white"
        @click="() => (drawerOpen = !drawerOpen)"
      >
        <div
          class="w-full h-full"
          :class="{
            'i-uil:list-ul': !drawerOpen,
            'i-uil:times': drawerOpen,
          }"
        ></div>
      </div>
    </div>

    <div
      class="flex flex-col items-center lt-md:(fixed top-0 w-[calc(100vw-4rem)] h-100vh border-r border-accent-400 bg-white transform transition-transform)"
      :class="{
        'lt-md:-translate-x-full': !drawerOpen,
        'lt-md:translate-x-0': drawerOpen,
      }"
    >
      <RouterLink to="/" class="w-full flex items-center gap-1 md:hidden">
        <img src="/favicon.ico" class="w-8 h-8 m-1 rounded" />
        <div class="text-black text-xl">中文东方人气投票</div>
      </RouterLink>

      <div class="flex justify-around w-full max-w-screen-xl lt-md:flex-col">
        <RouterLink
          v-if="noTop"
          to="/"
          class="relative flex py-1 justify-start md:flex-1 md:justify-center overflow-hidden"
        >
          <div
            class="md:absolute flex items-center gap-1 transition-all ease-out"
            :class="{
              '-top-1/1': !showSummary,
              'top-1': showSummary,
            }"
          >
            <img
              src="https://upload.thwiki.cc/thumb/a/a6/THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png/100px-THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png"
              class="w-10 h-10 rounded"
            />
            <div
              class="text-black text-xl"
              :class="{
                'font-medium': route.meta.navid === 'summary',
              }"
            >
              投票首页
            </div>
          </div>
          <div
            class="lt-md:hidden md:absolute flex items-center gap-1 transition-all ease-out"
            :class="{
              'top-1': !showSummary,
              'top-1/1': showSummary,
            }"
          >
            <img src="/favicon.ico" class="w-9 h-9 m-1 rounded" />
            <div
              class="text-black text-xl"
              :class="{
                'font-medium': route.meta.navid === 'summary',
              }"
            >
              中文东方人气投票
            </div>
          </div>
        </RouterLink>

        <RouterLink to="/character" class="flex py-1 items-center gap-1 md:flex-1 md:justify-center">
          <img
            src="https://upload.thwiki.cc/thumb/a/a6/THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png/100px-THBWiki-LOGO-%E5%8D%9A%E4%B8%BD%E7%81%B5%E6%A2%A6%E6%96%B0%E4%BD%9C.png"
            class="w-10 h-10 col-span-1 row-span-2 rounded"
          />
          <div
            class="text-black text-xl"
            :class="{
              'font-medium': route.meta.navid === 'character',
            }"
          >
            角色部门
          </div>
        </RouterLink>

        <RouterLink to="/music" class="flex py-1 items-center gap-1 md:flex-1 md:justify-center">
          <img
            src="https://upload.thwiki.cc/thumb/4/49/THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png/100px-THBWiki-LOGO-%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85.png"
            class="w-10 h-10 col-span-1 row-span-2 rounded"
          />
          <div
            class="text-black text-xl"
            :class="{
              'font-medium': route.meta.navid === 'music',
            }"
          >
            音乐部门
          </div>
        </RouterLink>

        <RouterLink to="/couple" class="flex py-1 items-center gap-1 md:flex-1 md:justify-center">
          <img
            src="https://upload.thwiki.cc/thumb/a/a6/THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png/100px-THBWiki-LOGO-%E7%A7%98%E5%B0%81%E4%BF%B1%E4%B9%90%E9%83%A8.png"
            class="w-10 h-10 col-span-1 row-span-2 rounded"
          />
          <div
            class="text-black text-xl"
            :class="{
              'font-medium': route.meta.navid === 'couple',
            }"
          >
            CP部门
          </div>
        </RouterLink>

        <RouterLink to="/doujin" class="flex py-1 items-center gap-1 md:flex-1 md:justify-center">
          <img
            src="https://upload.thwiki.cc/thumb/f/f7/THBWiki-LOGO-%E5%AE%87%E4%BD%90%E8%A7%81%E5%A0%87%E5%AD%90.png/100px-THBWiki-LOGO-%E5%AE%87%E4%BD%90%E8%A7%81%E5%A0%87%E5%AD%90.png"
            class="w-10 h-10 col-span-1 row-span-2 rounded"
          />
          <div
            class="text-black text-xl"
            :class="{
              'font-medium': route.meta.navid === 'doujin',
            }"
          >
            作品提名
          </div>
        </RouterLink>

        <RouterLink to="/questionnaireDetail" class="flex py-1 items-center gap-1 md:flex-1 md:justify-center">
          <img
            src="https://upload.thwiki.cc/thumb/d/dd/THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png/100px-THBWiki-LOGO-%E6%9C%AC%E5%B1%85%E5%B0%8F%E9%93%83.png"
            class="w-10 h-10 col-span-1 row-span-2 rounded"
          />
          <div
            class="text-black text-xl"
            :class="{
              'font-medium': route.meta.navid === 'questionnaire',
            }"
          >
            调查问卷
          </div>
        </RouterLink>
      </div>
    </div>

    <div
      class="w-full h-px bg-accent-400 transform transition-transform"
      :class="{
        'lt-md:translate-x-0': !showSummary,
        '-lt-md:translate-x-full': showSummary,
      }"
    ></div>
  </div>
  <div v-if="!noPadding" class="h-10 border-b-1 border-transparent md:hidden"></div>
</template>

<script lang="ts" setup>
defineProps<{
  noTop?: boolean
  noPadding?: boolean
  showSummary?: boolean
}>()

const route = useRoute()

watch(
  route,
  () => {
    drawerOpen = false
  },
  { deep: true }
)

const drawerOpen = $ref(false)
</script>
