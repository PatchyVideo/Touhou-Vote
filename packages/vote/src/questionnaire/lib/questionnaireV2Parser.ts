import type {
  QuestionnaireAnswerDraftV2,
  QuestionnaireDefinitionV2,
  QuestionnaireGroupAnswerDraftV2,
  QuestionnaireGroupV2,
  QuestionnaireOptionV2,
  QuestionnaireQuestionV2,
} from '@touhou-vote/shared/data/questionnaireV2'

export interface QuestionnaireRuntimeOptionV2 extends QuestionnaireOptionV2 {
  available: boolean
  selected: boolean
}

export interface QuestionnaireRuntimeQuestionV2 extends QuestionnaireQuestionV2 {
  options: QuestionnaireRuntimeOptionV2[]
  selectedOptionIds: number[]
  input: string
  done: boolean
}

export interface QuestionnaireRuntimeGroupV2 extends QuestionnaireGroupV2 {
  visible: boolean
  triggerQuestionIds: number[]
  activeQuestionId: number | null
  activeQuestion: QuestionnaireRuntimeQuestionV2 | null
  done: boolean
}

export interface QuestionnaireRuntimeV2 {
  questionnaireId: number
  name: string
  introduction: string
  groups: QuestionnaireRuntimeGroupV2[]
  visibleGroups: QuestionnaireRuntimeGroupV2[]
  questionCount: number
  answeredCount: number
  done: boolean
}

type GroupLookup = Map<number, QuestionnaireGroupV2>

function getQuestionOrder(questionId: number): number {
  return questionId % 10
}

function isZeroOrderQuestion(questionId: number): boolean {
  return getQuestionOrder(questionId) === 0
}

function cloneDraft(draft: QuestionnaireAnswerDraftV2): QuestionnaireAnswerDraftV2 {
  return {
    questionnaireId: draft.questionnaireId,
    groups: draft.groups.map((group) => ({
      groupId: group.groupId,
      activeQuestionId: group.activeQuestionId,
      selectedOptionIds: [...group.selectedOptionIds],
      input: group.input,
    })),
  }
}

function buildLookups(definition: QuestionnaireDefinitionV2) {
  const groupsById: GroupLookup = new Map()

  for (const group of definition.questionGroups) {
    groupsById.set(group.id, group)
  }

  return { groupsById }
}

function findQuestionInGroup(group: QuestionnaireGroupV2, questionId: number | null): QuestionnaireQuestionV2 | null {
  if (questionId == null) return null
  return group.questions.find((question) => question.id === questionId) ?? null
}

function getQuestionByOrder(group: QuestionnaireGroupV2, order: number): QuestionnaireQuestionV2 | null {
  return group.questions.find((question) => getQuestionOrder(question.id) === order) ?? null
}

function getDefaultVisibleQuestionId(group: QuestionnaireGroupV2): number | null {
  if (isZeroOrderQuestion(group.initialQuestionId)) return null
  return getQuestionByOrder(group, 1)?.id ?? null
}

function validateQuestionnaireDefinitionV2(definition: QuestionnaireDefinitionV2) {
  const firstGroup = definition.questionGroups[0]

  if (!firstGroup) {
    throw new Error(`[questionnaireV2] questionnaire ${definition.id} has no question groups`)
  }

  if (firstGroup.questions.length !== 1) {
    throw new Error(`[questionnaireV2] questionnaire ${definition.id} first group must contain exactly one question`)
  }

  for (const group of definition.questionGroups) {
    if (!findQuestionInGroup(group, group.initialQuestionId)) {
      throw new Error(`[questionnaireV2] group ${group.id} initialQuestionId is not in questions`)
    }
  }
}

function createEmptyGroupDraft(group: QuestionnaireGroupV2): QuestionnaireGroupAnswerDraftV2 {
  return {
    groupId: group.id,
    activeQuestionId: null,
    selectedOptionIds: [],
    input: '',
  }
}

function ensureDraftGroups(definition: QuestionnaireDefinitionV2, draft: QuestionnaireAnswerDraftV2) {
  const nextGroups = definition.questionGroups.map((group) => {
    const existing = draft.groups.find((item) => item.groupId === group.id)
    return existing
      ? {
          groupId: existing.groupId,
          activeQuestionId: existing.activeQuestionId,
          selectedOptionIds: [...existing.selectedOptionIds],
          input: existing.input,
        }
      : createEmptyGroupDraft(group)
  })

  draft.groups = nextGroups
}

function clearGroupAnswer(groupDraft: QuestionnaireGroupAnswerDraftV2, nextQuestionId: number | null) {
  groupDraft.activeQuestionId = nextQuestionId
  groupDraft.selectedOptionIds = []
  groupDraft.input = ''
}

function chooseTriggeredQuestionId(
  currentQuestionId: number | null,
  triggeredQuestionIds: number[]
): number | null {
  const visibleQuestionIds = triggeredQuestionIds.filter((questionId) => !isZeroOrderQuestion(questionId))

  if (!visibleQuestionIds.length) return null
  if (currentQuestionId != null && visibleQuestionIds.includes(currentQuestionId)) return currentQuestionId
  return visibleQuestionIds[0]
}

function sanitizeSelectionByQuestion(question: QuestionnaireQuestionV2, groupDraft: QuestionnaireGroupAnswerDraftV2) {
  const validOptionIds = new Set(question.options.map((option) => option.id))
  groupDraft.selectedOptionIds = groupDraft.selectedOptionIds.filter((optionId) => validOptionIds.has(optionId))

  if (question.type === 'Input') {
    groupDraft.selectedOptionIds = []
    return
  }

  if (question.type === 'Single') {
    groupDraft.input = ''
    groupDraft.selectedOptionIds = groupDraft.selectedOptionIds.length ? [groupDraft.selectedOptionIds[0]] : []
    return
  }

  groupDraft.input = ''
  if (!groupDraft.selectedOptionIds.length) return

  const optionById = new Map(question.options.map((option) => [option.id, option]))
  const lastSelected = optionById.get(groupDraft.selectedOptionIds[groupDraft.selectedOptionIds.length - 1])
  if (!lastSelected) {
    groupDraft.selectedOptionIds = []
    return
  }

  groupDraft.selectedOptionIds = groupDraft.selectedOptionIds.filter(
    (optionId) => optionById.get(optionId)?.optionGroup === lastSelected.optionGroup
  )
}

function getVisibleTriggeredQuestionIds(
  definition: QuestionnaireDefinitionV2,
  draft: QuestionnaireAnswerDraftV2,
  groupsById: GroupLookup
) {
  const triggerMap = new Map<number, number[]>()

  for (const group of definition.questionGroups) {
    const groupDraft = draft.groups.find((item) => item.groupId === group.id)
    if (!groupDraft?.activeQuestionId) continue
    const activeQuestion = findQuestionInGroup(group, groupDraft.activeQuestionId)
    if (!activeQuestion || activeQuestion.type === 'Input') continue

    for (const selectedOptionId of groupDraft.selectedOptionIds) {
      const selectedOption = activeQuestion.options.find((option) => option.id === selectedOptionId)
      if (!selectedOption) continue

      for (const relatedQuestionId of selectedOption.relatedQuestionIds) {
        const targetGroupId = Math.floor(relatedQuestionId / 10)
        if (!groupsById.has(targetGroupId)) continue
        const current = triggerMap.get(targetGroupId) ?? []
        current.push(relatedQuestionId)
        triggerMap.set(targetGroupId, current)
      }
    }
  }

  return triggerMap
}

function applyVisibilityAndQuestionBranch(
  definition: QuestionnaireDefinitionV2,
  draft: QuestionnaireAnswerDraftV2,
  groupsById: GroupLookup
) {
  const triggerMap = getVisibleTriggeredQuestionIds(definition, draft, groupsById)

  for (const group of definition.questionGroups) {
    const groupDraft = draft.groups.find((item) => item.groupId === group.id)
    if (!groupDraft) continue

    const triggerQuestionIds = triggerMap.get(group.id) ?? []
    const nextQuestionId =
      group.order === 1
        ? group.questions[0]?.id ?? null
        : triggerQuestionIds.length
          ? chooseTriggeredQuestionId(groupDraft.activeQuestionId, triggerQuestionIds)
          : getDefaultVisibleQuestionId(group)

    if (nextQuestionId !== groupDraft.activeQuestionId) {
      clearGroupAnswer(groupDraft, nextQuestionId)
    } else if (nextQuestionId == null && (groupDraft.selectedOptionIds.length || groupDraft.input)) {
      clearGroupAnswer(groupDraft, null)
    }
  }
}

function collectMutexTargets(definition: QuestionnaireDefinitionV2, draft: QuestionnaireAnswerDraftV2) {
  const mutexTargets = new Set<number>()

  for (const group of definition.questionGroups) {
    const groupDraft = draft.groups.find((item) => item.groupId === group.id)
    if (!groupDraft?.activeQuestionId) continue
    const activeQuestion = findQuestionInGroup(group, groupDraft.activeQuestionId)
    if (!activeQuestion || activeQuestion.type === 'Input') continue

    for (const selectedOptionId of groupDraft.selectedOptionIds) {
      const selectedOption = activeQuestion.options.find((option) => option.id === selectedOptionId)
      if (!selectedOption) continue
      for (const mutexOptionId of selectedOption.mutexOptionIds) mutexTargets.add(mutexOptionId)
    }
  }

  return mutexTargets
}

export function normalizeQuestionnaireDraftV2(
  definition: QuestionnaireDefinitionV2,
  draft: QuestionnaireAnswerDraftV2
): QuestionnaireAnswerDraftV2 {
  validateQuestionnaireDefinitionV2(definition)

  const nextDraft = cloneDraft(draft)
  const { groupsById } = buildLookups(definition)

  ensureDraftGroups(definition, nextDraft)

  for (let iteration = 0; iteration < definition.questionGroups.length * 4; iteration += 1) {
    const snapshot = JSON.stringify(nextDraft)

    applyVisibilityAndQuestionBranch(definition, nextDraft, groupsById)

    for (const group of definition.questionGroups) {
      const groupDraft = nextDraft.groups.find((item) => item.groupId === group.id)
      if (!groupDraft?.activeQuestionId) continue
      const activeQuestion = findQuestionInGroup(group, groupDraft.activeQuestionId)
      if (!activeQuestion) {
        clearGroupAnswer(groupDraft, null)
        continue
      }
      sanitizeSelectionByQuestion(activeQuestion, groupDraft)
    }

    const mutexTargets = collectMutexTargets(definition, nextDraft)

    for (const group of definition.questionGroups) {
      const groupDraft = nextDraft.groups.find((item) => item.groupId === group.id)
      if (!groupDraft?.activeQuestionId) continue
      const activeQuestion = findQuestionInGroup(group, groupDraft.activeQuestionId)
      if (!activeQuestion || activeQuestion.type === 'Input') continue

      groupDraft.selectedOptionIds = groupDraft.selectedOptionIds.filter((optionId) => !mutexTargets.has(optionId))
      sanitizeSelectionByQuestion(activeQuestion, groupDraft)
    }

    if (JSON.stringify(nextDraft) === snapshot) break
  }

  return nextDraft
}

function buildRuntimeQuestion(
  question: QuestionnaireQuestionV2,
  groupDraft: QuestionnaireGroupAnswerDraftV2,
  mutexTargets: Set<number>
): QuestionnaireRuntimeQuestionV2 {
  const selectedOptionIds = [...groupDraft.selectedOptionIds]

  return {
    ...question,
    options: question.options.map((option) => ({
      ...option,
      available: !mutexTargets.has(option.id),
      selected: selectedOptionIds.includes(option.id),
    })),
    selectedOptionIds,
    input: groupDraft.input,
    done:
      question.type === 'Input'
        ? groupDraft.input.trim().length > 0
        : groupDraft.selectedOptionIds.length > 0,
  }
}

export function parseQuestionnaireRuntimeV2(
  definition: QuestionnaireDefinitionV2,
  draft: QuestionnaireAnswerDraftV2
): QuestionnaireRuntimeV2 {
  const normalizedDraft = normalizeQuestionnaireDraftV2(definition, draft)
  const { groupsById } = buildLookups(definition)
  const mutexTargets = collectMutexTargets(definition, normalizedDraft)
  const triggerMap = getVisibleTriggeredQuestionIds(definition, normalizedDraft, groupsById)

  const groups = definition.questionGroups.map((group) => {
    const groupDraft = normalizedDraft.groups.find((item) => item.groupId === group.id) ?? createEmptyGroupDraft(group)
    const visible = groupDraft.activeQuestionId != null
    const triggerQuestionIds = triggerMap.get(group.id) ?? []
    const activeQuestion = visible
      ? findQuestionInGroup(group, groupDraft.activeQuestionId)
      : null

    const runtimeQuestion = activeQuestion ? buildRuntimeQuestion(activeQuestion, groupDraft, mutexTargets) : null

    return {
      ...group,
      visible,
      triggerQuestionIds,
      activeQuestionId: groupDraft.activeQuestionId,
      activeQuestion: runtimeQuestion,
      done: runtimeQuestion?.done ?? false,
    }
  })

  const visibleGroups = groups.filter((group) => group.visible)
  const answeredCount = visibleGroups.filter((group) => group.done).length

  return {
    questionnaireId: definition.id,
    name: definition.name,
    introduction: definition.introduction,
    groups,
    visibleGroups,
    questionCount: visibleGroups.length,
    answeredCount,
    done: visibleGroups.length > 0 && visibleGroups.length === answeredCount,
  }
}

export function getRuntimeGroupByIdV2(runtime: QuestionnaireRuntimeV2, groupId: number) {
  return runtime.groups.find((group) => group.id === groupId) ?? null
}

export function getRuntimeQuestionByIndexV2(runtime: QuestionnaireRuntimeV2, questionIndex: number) {
  return runtime.visibleGroups[questionIndex] ?? null
}

export function setQuestionInputV2(
  definition: QuestionnaireDefinitionV2,
  draft: QuestionnaireAnswerDraftV2,
  groupId: number,
  input: string
): QuestionnaireAnswerDraftV2 {
  const nextDraft = normalizeQuestionnaireDraftV2(definition, draft)
  const groupDraft = nextDraft.groups.find((group) => group.groupId === groupId)
  if (!groupDraft?.activeQuestionId) return nextDraft

  const group = definition.questionGroups.find((item) => item.id === groupId)
  const activeQuestion = group && findQuestionInGroup(group, groupDraft.activeQuestionId)
  if (!activeQuestion || activeQuestion.type !== 'Input') return nextDraft

  groupDraft.input = input
  return normalizeQuestionnaireDraftV2(definition, nextDraft)
}

export function toggleQuestionOptionV2(
  definition: QuestionnaireDefinitionV2,
  draft: QuestionnaireAnswerDraftV2,
  groupId: number,
  optionId: number
): QuestionnaireAnswerDraftV2 {
  const nextDraft = normalizeQuestionnaireDraftV2(definition, draft)
  const groupDraft = nextDraft.groups.find((group) => group.groupId === groupId)
  if (!groupDraft?.activeQuestionId) return nextDraft

  const group = definition.questionGroups.find((item) => item.id === groupId)
  const activeQuestion = group && findQuestionInGroup(group, groupDraft.activeQuestionId)
  if (!activeQuestion || activeQuestion.type === 'Input') return nextDraft

  const option = activeQuestion.options.find((item) => item.id === optionId)
  if (!option) return nextDraft

  const selectedIndex = groupDraft.selectedOptionIds.findIndex((item) => item === optionId)

  if (activeQuestion.type === 'Single') {
    groupDraft.selectedOptionIds = [optionId]
  } else if (selectedIndex === -1) {
    groupDraft.selectedOptionIds.push(optionId)
  } else {
    groupDraft.selectedOptionIds.splice(selectedIndex, 1)
  }

  return normalizeQuestionnaireDraftV2(definition, nextDraft)
}
