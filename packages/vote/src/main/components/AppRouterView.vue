<template>
  <div v-if="bootstrapping" class="min-h-screen flex items-center justify-center text-gray-500">
    <div class="flex items-center gap-2">
      <icon-uil-spinner-alt class="animate-spin" />
      <span>少女祈祷中...</span>
    </div>
  </div>
  <RouterView v-else v-slot="{ Component }">
    <Suspense>
      <Component :is="Component" :key="$route.path" />
    </Suspense>
  </RouterView>
</template>

<script setup lang="ts">
defineProps<{
  bootstrapping: boolean
}>()
</script>
