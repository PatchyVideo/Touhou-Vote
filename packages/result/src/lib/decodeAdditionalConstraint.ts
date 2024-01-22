import { decompressFromEncodedURIComponent } from 'lz-string'
import { characterList } from '@touhou-vote/shared/data/character'
import { musicList } from '@touhou-vote/shared/data/music'

export function getAdditionalConstraintString(additionalConstraintUrl: string): string {
  const additionalConstraintObject = JSON.parse(decompressFromEncodedURIComponent(additionalConstraintUrl) || '{}')
  if (additionalConstraintUrl === '' || JSON.stringify(additionalConstraintObject) === '{}') return ''
  let additionalConstraintString = ''
  if (additionalConstraintObject.charactersFirst) {
    const charactersFirstID = characterList.find((item) => item.name === additionalConstraintObject.charactersFirst)!.id
    additionalConstraintString += `AND chars_first="${charactersFirstID}" `
  }
  if (additionalConstraintObject.characters.length) {
    const charactersID: string[] = additionalConstraintObject.characters.map(
      (item: string) => characterList.find((item2) => item2.name === item)!.id
    )
    for (let i = 0; i < charactersID.length; i++) additionalConstraintString += `AND chars:["${charactersID[i]}"] `
  }
  if (additionalConstraintObject.musicsFirst) {
    const musicsFirstID = musicList.find((item) => item.name === additionalConstraintObject.musicsFirst)!.id
    additionalConstraintString += `AND musics_first="${musicsFirstID}" `
  }
  if (additionalConstraintObject.musics.length) {
    const musicsID: string[] = additionalConstraintObject.musics.map(
      (item: string) => musicList.find((item2) => item2.name === item)!.id
    )
    for (let i = 0; i < musicsID.length; i++) additionalConstraintString += `AND musics:["${musicsID[i]}"] `
  }
  if (additionalConstraintObject.questionnaire.length) {
    for (let i = 0; i < additionalConstraintObject.questionnaire.length; i++)
      additionalConstraintString += `AND q${additionalConstraintObject.questionnaire[i].questionID}=${additionalConstraintObject.questionnaire[i].answerID}`
  }
  return additionalConstraintString.trim().slice(4).trim()
}
