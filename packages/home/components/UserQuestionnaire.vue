<template>
  <div class="min-h-100vh page md:min-h-0">
    <!-- Main Content -->
    <div class="w-full p-3 space-y-2">
      <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img src="@/home/assets/DefaultAvatar.jpg" class="object-cover rounded" />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="text-xl">主问卷</div>
          </div>
          <div class="w-full text-right">
            <button
              class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600 md:px-3 md:py-2"
              @click="mainQuestionnaire()"
            >
              开始填写
            </button>
          </div>
        </div>
      </div>

      <div class="flex w-full p-0.5 shadow rounded bg-white bg-opacity-50 backdrop-filter backdrop-blur-2">
        <div class="w-1/3 p-0.5 overflow-hidden rounded">
          <div class="w-full aspect-1/1">
            <img src="@/home/assets/DefaultAvatar.jpg" class="object-cover rounded" />
          </div>
        </div>
        <div class="w-2/3 p-0.5 flex flex-wrap content-between">
          <div class="w-full space-y-0.5">
            <div class="text-xl">额外问卷</div>
          </div>
          <div class="w-full text-right">
            <button
              class="px-2 py-0.5 text-sm rounded text-white bg-accent-color-600 md:px-3 md:py-2"
              @click="extraQuestionnaire()"
            >
              开始填写
            </button>
          </div>
        </div>
      </div>
      <button
        v-if="props.deskTopReturn"
        class="w-full py-2 text-sm rounded text-white bg-accent-color-600"
        @click="returnBack()"
      >
        返回
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  deskTopReturn: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const router = useRouter()

function returnBack(): void {
  const query = JSON.parse(JSON.stringify(route.query))
  query.open = 0
  router.push({ path: route.path, query })
}

function mainQuestionnaire(): void {
  router.push('/questionnaire')
}
function extraQuestionnaire(): void {
  router.push({
    path: '/questionnaire',
    query: { bigQuestionnaire: 'extraQuestionnaire', smallQuestionnaire: 'exQuestionnaire1' },
  })
}
</script>

<style lang="postcss" scoped></style>
