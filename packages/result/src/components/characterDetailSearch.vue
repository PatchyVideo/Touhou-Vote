<template>
  <div
    class="fixed max-h-full z-50 transform transition-transform duration-300 inset-x-0 bottom-0 overflow-auto p-3 bg-white shadow border-accent-200 lt-sm:max-h-70vh lt-sm:rounded-t lt-sm:border-t sm:rounded-l sm:border-l sm:right-0 sm:inset-y-0 sm:left-auto sm:p-2 sm:w-95"
    :class="{ 'sm:translate-x-full translate-y-full sm:translate-y-0': !open }"
  >
    <div class="w-full border-b p-1 pb-1.5 flex justify-between">
      <div class="flex items-center flex-nowrap space-x-1">
        <div class="i-uil:search text-2xl transition-colors" />
        <div class="text-lg">高级搜索</div>
      </div>
      <div class="i-uil:times text-2xl transition-colors" @click="open = false" />
    </div>
    <div class="mt-4 space-y-3">
      <!-- Reset or search -->
      <div class="flex justify-around border-t pt-3">
        <button class="px-10 py-2 rounded-xl text-white bg-accent-600 justify-center" @click="reset()">
          {{ '重置' }}
        </button>
        <button class="px-10 py-2 rounded-xl text-white bg-accent-600 justify-center" @click="search()">
          {{ '搜索' }}
        </button>
      </div>
    </div>
  </div>
  <!-- Mask -->
  <Transition
    enter-active-class="transition-all duration-200"
    enter-from-class="bg-opacity-0"
    leave-active-class="transition-all duration-200"
    leave-to-class="bg-opacity-0"
  >
    <div v-if="open" class="fixed inset-0 z-49" @click="open = false" />
  </Transition>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
    requred: true,
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const route = useRoute()
const router = useRouter()

const open = useVModel(props, 'open', emit)

/* initialize additional constraint with url */
const additionalConstraintUrl = ref(
  String(route.query.a ? (Array.isArray(route.query.a) ? route.query.a[0] : route.query.a) : '')
)
const additionalConstraintObject = ref(
  additionalConstraintUrl.value === ''
    ? {
        searchContentAndOrNot: '',
        exceptContent: '',
        visibleSites: [''],
        date1: {
          beforeAfterEqualDate1: '',
          year1: '',
          month1: '',
          day1: '',
        },
        date2: {
          beforeAfterEqualDate2: '',
          year2: '',
          month2: '',
          day2: '',
        },
        tag: {
          moreLessEqualTagNum: '',
          tagNum: '',
        },
        onlyShowAutotagedVideos: false,
      }
    : JSON.parse(decodeURI(window.atob(additionalConstraintUrl.value)))
)

/* Reset */
function reset() {}

/* Search */
function checkSubmitContent(): boolean {
  return true
}
const additionalConstraintBase64 = computed(() => {
  return window.btoa(encodeURI(JSON.stringify({})))
})
function search(): void {
  if (!checkSubmitContent()) return
  // const query = { qtype: qtype.value, order: order.value, a: additionalConstraintBase64.value }
  // router.push({ path: route.path, query })
  open.value = false
}
</script>
