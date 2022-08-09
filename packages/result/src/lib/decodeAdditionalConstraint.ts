export function getAdditionalConstraintString(additionalConstraintUrl: string): string {
  if (additionalConstraintUrl === '') return ''
  const additionalConstraintObject = JSON.parse(decodeURI(window.atob(additionalConstraintUrl)))
  let additionalConstraintString = ''
  if (additionalConstraintObject.charactersFirst)
    additionalConstraintString += `chars_first="${additionalConstraintObject.charactersFirst}" `
  if (additionalConstraintObject.characters.length) {
    for (let i = 0; i < additionalConstraintObject.characters.length; i++)
      additionalConstraintString += `AND chars:["${additionalConstraintObject.characters[i]}"] `
  }
  if (additionalConstraintObject.musicsFirst)
    additionalConstraintString += `AND musics_first="${additionalConstraintObject.musicsFirst}" `
  if (additionalConstraintObject.musics.length) {
    for (let i = 0; i < additionalConstraintObject.musics.length; i++)
      additionalConstraintString += `AND musics:["${additionalConstraintObject.musics[i]}"] `
  }
  if (additionalConstraintObject.questionnaire.length) {
    for (let i = 0; i < additionalConstraintObject.questionnaire.length; i++)
      additionalConstraintString += `AND q${additionalConstraintObject.questionnaire[i].questionID}=${additionalConstraintObject.questionnaire[i].answerID}`
  }
  return additionalConstraintString.trim()
}
