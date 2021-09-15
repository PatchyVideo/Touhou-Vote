<template>
  <div
    class="relative p-1 pt-5 rounded shadow bg-white ring"
    :style="'--tw-ring-color:' + character.color + ';color:' + character.color"
  >
    <icon-uil-times class="absolute right-0 top-0 cursor-pointer" @click="closeCharacterCard()"></icon-uil-times>
    <img class="w-full rounded border" :src="character.image" />
    <div class="p-1 truncate text-center text-xs md:text-base" :style="'color:' + character.color">
      {{ character.name }}
    </div>
    <button
      class="w-full py-1 shadow rounded text-white text-sm md:text-base"
      :style="'background-color:' + character.color"
      @click="openReasonBox()"
    >
      投票理由
    </button>
  </div>
  <VoteMessageBox v-model:open="reasonBoxOpen" :title="reasonTitle">
    <div class="space-y-3 py-5">
      <label class="input-border input-border-md flex flex-row py-2 px-4">
        <input
          v-model="reasonEdit"
          class="w-full bg-transparent rounded focus:outline-none"
          placeholder="理由："
          type="text"
      /></label>
      <button
        class="w-full py-2 shadow rounded text-white bg-accent-color-600 text-sm md:text-base"
        @click="commitReasonBox()"
      >
        确定
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType, ref, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { Character } from '@/vote-character/lib/character'
import { character0, characters } from '@/vote-character/lib/voteData'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'

const props = defineProps({
  character: {
    type: Object as PropType<Character>,
    requred: true,
    default: function () {
      return character0
    },
  },
})
const emit = defineEmits<{
  (event: 'update:character', value: Character): void
}>()
const character = useVModel(props, 'character', emit)

const reasonTitle = computed(() => '选择 ' + character.value.name + ' 的理由')
const reasonBoxOpen = ref(false)
const reasonEdit = ref('')
function openReasonBox(): void {
  reasonBoxOpen.value = true
  reasonEdit.value = character.value.name
}
function commitReasonBox(): void {
  reasonBoxOpen.value = false
}

function closeCharacterCard(): void {
  characters.value = characters.value.map((cha): Character => {
    if (cha.id === character.value.id) return character0
    else return cha
  })
}
</script>
