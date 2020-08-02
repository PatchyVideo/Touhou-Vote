<template>
  <div>
    <!-- 背景图片 -->
    <div class="BgImg fixed w-screen h-screen bg-cover -z-1">
      <div class="h-full w-full bg-white opacity-75"></div>
    </div>
    <navtop class="fixed top-0 w-full" />
    <Nuxt />
    <navbottom />
  </div>
</template>
<script lang="ts">
import navtop from '~/components/NavTop.vue'
import navbottom from '~/components/NavBottom.vue'

export default {
  components: { navtop, navbottom },
}
</script>
<style lang="postcss" scoped>
.BgImg {
  background-image: url('/img/UserLogin.jpg');
  -webkit-filter: blur(10px);
  filter: blur(10px);
}
</style>
