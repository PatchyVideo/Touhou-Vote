import { computed, ref } from 'vue'
import { CachedSearcher, SearchLogicContain } from 'pinin'
import type { Character } from './character'
import { character0 } from './character'
import { characterHonmei, characters } from './voteData'
import { filterForKind, workSelected } from './workList'
import { pinin } from '@/common/lib/pinin'
import { characterList } from '@touhou-vote/shared/data/character'

export { characterList }

export const characterListLeft = computed<Character[]>(() => {
  let charaList = characterList.filter((character) => {
    let characterInCharacters = false
    for (let i = 0; i < characters.value.length; i++) {
      if (characters.value[i].id === character.id) characterInCharacters = true
    }
    return character.id != characterHonmei.value.id && !characterInCharacters
  })

  if (filterForKind.value.length) {
    charaList = charaList.filter((chara) => filterForKind.value.find((k1) => chara.kind.find((k2) => k2 === k1.value)))
  }

  if (workSelected.value.name) {
    charaList = charaList.filter((chara) => chara.work.find((work) => work === workSelected.value.name))
  }

  return charaList
})

export const characterHonmeiListLeft = computed<Character[]>(() => {
  return charactersReverse.value.filter((character) => character.id != characterHonmei.value.id)
})

export const charactersReverse = computed<Character[]>(() =>
  characters.value.filter((character) => character.id != character0.id).reverse()
)
export const charactersReverseWithoutHonmei = computed<Character[]>(() => {
  return charactersReverse.value.filter((character) => !character.honmei)
})

export const orderOptions = [
  {
    name: '出场正序',
    value: 'newest',
  },
  {
    name: '出场倒序',
    value: 'oldest',
  },
]
export const order = ref(orderOptions[0])
export const keyword = ref('')

const searcher = computed(() => {
  const s = new CachedSearcher<Character>(SearchLogicContain, pinin)

  for (const c of characterListLeft.value) {
    s.put(c.name.toLowerCase(), c)
    for (const altname of c.altnames) {
      s.put(altname.toLowerCase(), c)
    }
    for (const work of c.work) {
      s.put(work.toLowerCase(), c)
    }
  }

  return s
})
export const characterListLeftWithFilter = computed<Character[]>(() => {
  const res = keyword.value ? [...new Set(searcher.value.search(keyword.value.toLowerCase()))] : characterListLeft.value

  if (order.value.name === orderOptions[0].name) {
    res.sort((a, b) => a.date - b.date)
  } else {
    res.sort((a, b) => b.date - a.date)
  }

  return res
})
