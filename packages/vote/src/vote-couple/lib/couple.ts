import { Character } from '@/vote-character/lib/character'

export class Couple {
  valid: boolean
  characters: Character[]
  seme: number // Serial number of the cp character(0, 1, 2), -1 means no seme character
  honmei: boolean
  reason: string
  constructor(
    valid = false,
    characters = Array(3)
      .fill(null)
      .map(() => new Character()),
    seme = -1,
    honmei = false,
    reason = ''
  ) {
    this.valid = valid
    this.characters = characters
    this.seme = seme
    this.honmei = honmei
    this.reason = reason
  }
}
export const couple0 = new Couple()
