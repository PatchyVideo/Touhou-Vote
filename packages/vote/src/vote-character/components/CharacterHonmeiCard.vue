<template>
  <div class="baseBoxRoundedShadow relative w-full p-1 flex">
    <div class="w-2/5 max-w-64">
      <div class="aspect-ratio-1/1 rounded-xl border border-accent-color-600">
        <img class="object-contain" :src="characterHonmei.image ? characterHonmei.image : characterImages" />
      </div>
    </div>
    <icon-uil-times class="absolute right-1 top-1 cursor-pointer" @click="closeCard()"></icon-uil-times>
    <div class="flex-1 p-1 flex flex-wrap content-between md:p-2">
      <div class="w-full">
        <div class="truncate opacity-60">{{ characterHonmei.title }}</div>
        <div class="font-semibold text-xl truncate">
          {{ characterHonmei.name }}
        </div>
        <input
          ref="reasonInput"
          v-model="reasonEdit"
          placeholder="点此填写理由（可选）"
          class="innerBox w-full truncate px-1 outline-none"
          type="text"
          @blur="updateReason()"
          @keydown.enter="updateReason()"
        />
      </div>
      <div class="w-full flex justify-end">
        <div
          class="transform transform-gpu -rotate-45 border rounded border-accent-color-300 text-accent-color-300 md:text-lg xl:text-xl"
        >
          本命
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref, shallowRef, watch } from 'vue'
import { Character } from '@/vote-character/lib/character'
import { characters } from '@/vote-character/lib/voteData'
import characterImages from '@/vote-character/assets/defaultCharacterImage.png?url'

const props = defineProps({
  // Note that characterHonmei in voteData.ts is readonly
  characterHonmei: {
    type: Object as PropType<Character>,
    requred: true,
    default: function () {
      return new Character()
    },
  },
})

const reasonInput = shallowRef<HTMLInputElement | null>(null)
const reasonEdit = ref(props.characterHonmei.reason)
watch(props.characterHonmei, function (newv) {
  reasonEdit.value = newv.reason
})
function updateReason(): void {
  characters.value.map((chara) => {
    if (chara.honmei) chara.reason = reasonEdit.value
  })
  reasonInput.value?.blur()
}

function closeCard(): void {
  characters.value.map((chara) => (chara.honmei = false))
}
</script>
