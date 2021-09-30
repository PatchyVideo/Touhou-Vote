import { Character } from '@/vote-character/lib/character'
export interface Couple {
  id: string
  seme: Character
  uke: Character
  honmei: boolean
  selecting: boolean
}
