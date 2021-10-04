<template>
  <div
    class="relative w-full p-1 rounded shadow bg-white flex ring"
    :style="'--tw-ring-color:' + characterHonmei.color + ';color:' + characterHonmei.color"
  >
    <img class="w-2/5 rounded border" :src="characterHonmei.image" />
    <icon-uil-times class="absolute right-1 top-1 cursor-pointer" @click="closeCard()"></icon-uil-times>
    <div class="w-3/5 p-1 flex flex-wrap content-between md:p-2">
      <div class="w-full">
        <div class="truncate opacity-60">{{ characterHonmei.title }}</div>
        <div class="font-semibold text-xl truncate">
          {{ characterHonmei.name }}
        </div>
        <input
          ref="reasonInput"
          v-model="reasonEdit"
          placeholder="点此填写理由（可选）"
          class="truncate"
          type="text"
          @blur="updateReason()"
          @keydown.enter="updateReason()"
        />
      </div>
      <div class="w-full flex justify-end">
        <div
          class="transform transform-gpu -rotate-45 border rounded-sm border-red-500 text-red-500 md:text-lg xl:text-xl"
        >
          本命
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType, ref, watch, shallowRef } from 'vue'
import { useVModel } from '@vueuse/core'
import { Character } from '@/vote-character/lib/character'
import { characters } from '@/vote-character/lib/voteData'

const props = defineProps({
  characterHonmei: {
    type: Object as PropType<Character>,
    requred: true,
    default: function () {
      return new Character()
    },
  },
})
const emit = defineEmits<{
  (event: 'update:characterHonmei', value: Character): void
}>()
const characterHonmei = useVModel(props, 'characterHonmei', emit)

const reasonInput = shallowRef<HTMLInputElement | null>(null)
const reasonEdit = ref(characterHonmei.value.reason)
watch(characterHonmei, () => {
  reasonEdit.value = characterHonmei.value.reason
})
function updateReason(): void {
  characters.value.map((item) => {
    if (item.honmei) item.reason = reasonEdit.value
  })
  reasonInput.value?.blur()
}

function closeCard(): void {
  characters.value.map((item) => (item.honmei = false))
}
</script>
