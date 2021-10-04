import { Character } from '@/vote-character/lib/character'
import { character0 } from '@/vote-character/lib/voteData'

export class Couple {
  valid: boolean
  characters: Character[]
  seme: number // Serial number of the cp character(0, 1, 2), -1 means no seme character
  honmei: boolean
  constructor(valid = false, characters = [character0], seme = -1, honmei = false) {
    this.valid = valid
    this.characters = characters
    this.seme = seme
    this.honmei = honmei
  }
}
export const couple0 = new Couple()
