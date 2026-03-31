export interface QuestionnaireOptionV2 {
  id: number
  content: string
  relatedQuestionIds: number[]
  mutexOptionIds: number[]
  optionGroup: number
}

export interface QuestionnaireQuestionV2 {
  id: number
  type: 'Single' | 'Multiple' | 'Input'
  content: string
  introduction: string
  options: QuestionnaireOptionV2[]
}

export interface QuestionnaireGroupV2 {
  id: number
  questionnaireId: number
  order: number
  // PRD 中的“初始问题”。末位为 0 表示该问题组默认隐藏。
  initialQuestionId: number
  questions: QuestionnaireQuestionV2[]
}

export interface QuestionnaireDefinitionV2 {
  id: number
  name: string
  introduction: string
  questionGroups: QuestionnaireGroupV2[]
}

export interface QuestionnaireDefinitionAllV2 {
  mainQuestionnaire: {
    requiredQuestionnaire: QuestionnaireDefinitionV2
    optionalQuestionnaire1: QuestionnaireDefinitionV2
    optionalQuestionnaire2: QuestionnaireDefinitionV2
  }
  extraQuestionnaire: {
    exQuestionnaire1: QuestionnaireDefinitionV2
    exQuestionnaire2: QuestionnaireDefinitionV2
    exQuestionnaire3: QuestionnaireDefinitionV2
    exQuestionnaire4: QuestionnaireDefinitionV2
    exQuestionnaire5: QuestionnaireDefinitionV2
  }
}

export interface QuestionnaireGroupAnswerDraftV2 {
  groupId: number
  activeQuestionId: number | null
  selectedOptionIds: number[]
  input: string
}

export interface QuestionnaireAnswerDraftV2 {
  questionnaireId: number
  groups: QuestionnaireGroupAnswerDraftV2[]
}

export interface QuestionnaireAnswerStateV2 {
  mainQuestionnaire: {
    requiredQuestionnaire: QuestionnaireAnswerDraftV2
    optionalQuestionnaire1: QuestionnaireAnswerDraftV2
    optionalQuestionnaire2: QuestionnaireAnswerDraftV2
  }
  extraQuestionnaire: {
    exQuestionnaire1: QuestionnaireAnswerDraftV2
    exQuestionnaire2: QuestionnaireAnswerDraftV2
    exQuestionnaire3: QuestionnaireAnswerDraftV2
    exQuestionnaire4: QuestionnaireAnswerDraftV2
    exQuestionnaire5: QuestionnaireAnswerDraftV2
  }
}

function createOption(
  id: number,
  content: string,
  relatedQuestionIds: number[] = [],
  mutexOptionIds: number[] = [],
  optionGroup = 0
): QuestionnaireOptionV2 {
  return { id, content, relatedQuestionIds, mutexOptionIds, optionGroup }
}

function createPlaceholderQuestionnaire(id: number, name: string, introduction: string): QuestionnaireDefinitionV2 {
  const group1QuestionId = id * 1000 + 11
  const group2HiddenQuestionId = id * 1000 + 20
  const group2Question1Id = id * 1000 + 21
  const group2Question2Id = id * 1000 + 22
  const group3Question1Id = id * 1000 + 31

  return {
    id,
    name,
    introduction,
    questionGroups: [
      {
        id: Math.floor(group1QuestionId / 10),
        questionnaireId: id,
        order: 1,
        initialQuestionId: group1QuestionId,
        questions: [
          {
            id: group1QuestionId,
            type: 'Single',
            content: '占位问题组 1：请选择你要进入的后续路径',
            introduction: '第一个问题组必须仅有一个问题，后续合作者可在此基础上替换为正式题面。',
            options: [
              createOption(group1QuestionId * 100 + 1, '进入问题组 2 的第 1 个问题', [group2Question1Id]),
              createOption(group1QuestionId * 100 + 2, '进入问题组 2 的第 2 个问题', [group2Question2Id]),
              createOption(group1QuestionId * 100 + 3, '隐藏问题组 2', [group2HiddenQuestionId]),
            ],
          },
        ],
      },
      {
        id: Math.floor(group2HiddenQuestionId / 10),
        questionnaireId: id,
        order: 2,
        initialQuestionId: group2HiddenQuestionId,
        questions: [
          {
            id: group2HiddenQuestionId,
            type: 'Input',
            content: '占位问题组 2 - 第 0 个问题',
            introduction: '第 0 个问题仅用于表达“该问题组默认隐藏 / 被 related 隐藏”。不应在页面上直接展示。',
            options: [],
          },
          {
            id: group2Question1Id,
            type: 'Single',
            content: '占位问题组 2 - 第 1 个问题',
            introduction: '当 related 指向本题时，页面应展示本问题。',
            options: [
              createOption(group2Question1Id * 100 + 1, '继续'),
              createOption(group2Question1Id * 100 + 2, '继续（备用）'),
            ],
          },
          {
            id: group2Question2Id,
            type: 'Input',
            content: '占位问题组 2 - 第 2 个问题',
            introduction: '当 related 指向本题时，页面应展示本问题。',
            options: [],
          },
        ],
      },
      {
        id: Math.floor(group3Question1Id / 10),
        questionnaireId: id,
        order: 3,
        initialQuestionId: group3Question1Id,
        questions: [
          {
            id: group3Question1Id,
            type: 'Input',
            content: '占位问题组 3 - 第 1 个问题',
            introduction: '本问题组初始问题不是第 0 个问题，因此默认展示第 1 个问题。',
            options: [],
          },
        ],
      },
    ],
  }
}

function createAnswerDraft(questionnaire: QuestionnaireDefinitionV2): QuestionnaireAnswerDraftV2 {
  return {
    questionnaireId: questionnaire.id,
    groups: questionnaire.questionGroups.map((group) => ({
      groupId: group.id,
      activeQuestionId: null,
      selectedOptionIds: [],
      input: '',
    })),
  }
}

export const questionnaireV2: QuestionnaireDefinitionAllV2 = {
  mainQuestionnaire: {
    requiredQuestionnaire: createPlaceholderQuestionnaire(
      11,
      '主要问卷 - 基础问卷（V2 占位）',
      '新版问卷结构占位数据。后续合作者应直接在本文件维护正式问题组与组内问题，而不是从旧版问卷推导。'
    ),
    optionalQuestionnaire1: createPlaceholderQuestionnaire(
      12,
      '主要问卷 - 官作问卷（V2 占位）',
      '新版问卷结构占位数据。'
    ),
    optionalQuestionnaire2: createPlaceholderQuestionnaire(
      13,
      '主要问卷 - 二创问卷（V2 占位）',
      '新版问卷结构占位数据。'
    ),
  },
  extraQuestionnaire: {
    exQuestionnaire1: createPlaceholderQuestionnaire(21, '额外问卷 - 同人作品相关（V2 占位）', '新版问卷结构占位数据。'),
    exQuestionnaire2: createPlaceholderQuestionnaire(22, '额外问卷 - 官作游戏相关（V2 占位）', '新版问卷结构占位数据。'),
    exQuestionnaire3: createPlaceholderQuestionnaire(23, '额外问卷 - 展会与手游相关（V2 占位）', '新版问卷结构占位数据。'),
    exQuestionnaire4: createPlaceholderQuestionnaire(24, '额外问卷 - 正版盗版相关（V2 占位）', '新版问卷结构占位数据。'),
    exQuestionnaire5: createPlaceholderQuestionnaire(25, '额外问卷 - 主办方附加（V2 占位）', '新版问卷结构占位数据。'),
  },
}

export function createQuestionnaireAnswerStateV2(
  source: QuestionnaireDefinitionAllV2 = questionnaireV2
): QuestionnaireAnswerStateV2 {
  return {
    mainQuestionnaire: {
      requiredQuestionnaire: createAnswerDraft(source.mainQuestionnaire.requiredQuestionnaire),
      optionalQuestionnaire1: createAnswerDraft(source.mainQuestionnaire.optionalQuestionnaire1),
      optionalQuestionnaire2: createAnswerDraft(source.mainQuestionnaire.optionalQuestionnaire2),
    },
    extraQuestionnaire: {
      exQuestionnaire1: createAnswerDraft(source.extraQuestionnaire.exQuestionnaire1),
      exQuestionnaire2: createAnswerDraft(source.extraQuestionnaire.exQuestionnaire2),
      exQuestionnaire3: createAnswerDraft(source.extraQuestionnaire.exQuestionnaire3),
      exQuestionnaire4: createAnswerDraft(source.extraQuestionnaire.exQuestionnaire4),
      exQuestionnaire5: createAnswerDraft(source.extraQuestionnaire.exQuestionnaire5),
    },
  }
}
