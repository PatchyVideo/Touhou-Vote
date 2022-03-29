<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <Component :is="Component" :key="$route.path" />
    </Suspense>
  </RouterView>
</template>
