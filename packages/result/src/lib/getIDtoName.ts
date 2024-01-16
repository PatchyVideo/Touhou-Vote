import { characterList } from '@touhou-vote/shared/data/character'
import { musicList } from '@touhou-vote/shared/data/music'

export function getIDtoCharacterName() {
  return characterList.map((item) => {
    return {
      id: item.id,
      name: item.name,
    }
  })
}

export function getIDtoMusicName() {
  return musicList.map((item) => {
    return {
      id: item.id,
      name: item.name,
    }
  })
}
