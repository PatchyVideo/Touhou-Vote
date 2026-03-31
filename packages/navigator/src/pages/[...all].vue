<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-500/10 to-pink-500/5 select-none">
    
    <!-- status="404" 会自动显示一个未找到页面的插图 -->
    <n-result
      status="404"
      title="404 - 页面迷路了"
      description="您访问的页面可能已神隐。"
      size="huge"
      class="z-10"
    >
      <template #icon>
        <img 
          src="@/assets/notFound.png" 
          class="w-48 h-48 md:w-64 md:h-64 object-contain opacity-80" 
          alt="404"
        />
      </template>
      <template #footer>
        <div class="flex gap-4 justify-center mt-4">
          <!-- 返回上一页按钮 -->
          <n-button 
            round
            size="large"
            @click="goBack"
            class="!border !border-black !text-black !bg-transparent hover:!bg-green-600 hover:!text-white hover:!border-green-600 transition-colors duration-300"
          >
            <template #icon>
              <div class="i-carbon-arrow-left" />
            </template>
            返回上页
          </n-button>

          <!-- 回到首页按钮 -->
          <n-button 
            round 
            size="large"
            @click="goHome"
            class="!border !border-black !text-black !bg-transparent hover:!bg-green-600 hover:!text-white hover:!border-green-600 transition-colors duration-300"
          >
            <template #icon>
              <div class="i-carbon-home" />
            </template>
            回到首页
          </n-button>
        </div>
      </template>
    </n-result>

    <div class="absolute bottom-8 text-gray-400 text-sm quicksand font-medium opacity-60">中文东方人气投票组委会</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult, NButton } from 'naive-ui' // 我最喜欢的前端组件库 Naive-UI

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  // 检查是否有历史记录，没有则回首页
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>

</style>
