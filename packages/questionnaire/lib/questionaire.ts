// 关于ID的说明：
// ID根据划分的细致程度，划分越细致其长度也会越来越长，现从左到右进行说明：
// 第一位：1表示主问卷；2表示额外问卷
// 第二位：主问卷的情况下1表示必填问卷，2表示官作分问卷，3表示官作分问卷
//        额外问卷的情况下1表示二创深入了解问卷，2表示官作通关情况深入了解问卷，3表示正版&盗版深入了解问卷，4表示主办方附加问卷
// 第三位&第四位：表示该问卷中的题目序号，从1开始计数。请注意，同一问卷中的同一问题序号有可能不止一个问题，由于用户选择的不同，同一序号也会出现不同的题目
// 第五位：表示该题目序号对应的题库中的题目顺序，从1开始计数
// 第六位&第七位：表示该题目对应的选项的序号，从1开始计数

interface Option {
  // 7位ID，说明见上
  id: number
  // 问题ID的数组，选择此选项之后，展示related内对应ID的问题（因为相同的问题序号可能有很多问题，根据用户选择不同的选项来展示不同的问题）
  related: number[]
  // 选项ID的数组，选择此选项之后，用户不再能够选择mutex内对应ID的选项
  mutex: number[]
  // 选项内容
  content: string
  [key: string]: number | number[] | string
}
interface Question {
  // 5位ID，说明见上
  id: number
  // Single：单选题；Multiple：多选题；Input：填空题
  type: 'Single' | 'Multiple' | 'Input'
  // 问题
  question: string
  // 问题详细说明
  introduction: string
  // 问题选项
  options: Option[]
  input: string
  [key: string]: number | string | Option[]
}
interface Questionaire {
  // 2位ID，说明见上
  id: number
  // 问卷名称
  name: string
  // 问卷详细说明
  introduction: string
  // 问卷内的问题
  questions: Question[][]
  [key: string]: number | string | Question[][]
}
interface MainQuestionaire {
  requiredQuestionaire: Questionaire
  // optionalQuestionaire1: Questionaire
  // optionalQuestionaire2: Questionaire
  [key: string]: Questionaire
}
interface ExtraQuestionaire {
  exQuestionaire1: Questionaire
  [key: string]: Questionaire
}
export interface QuestionaireALL {
  mainQuestionaire: MainQuestionaire
  // extraQuestionaire: ExtraQuestionaire
  [key: string]: MainQuestionaire | ExtraQuestionaire
}

// 问卷的大致分类参见文件：TOUHOU-VOTE/doc/QUESTIONAIREROADMAP.png
export const questionaire: QuestionaireALL = {
  mainQuestionaire: {
    requiredQuestionaire: {
      id: 11,
      name: '主问卷 - 必填问卷',
      introduction:
        '本问卷的目的是收集一些投票者的非敏感信息。这些信息既可以勾勒出中文东方众的基本构成，也可以就其中一些项对投票结果的影响进行分析而得到一些有用的信息',
      questions: [
        [
          {
            id: 11011,
            type: 'Single',
            question: '您的性别是?',
            introduction: '',
            input: '',
            options: [
              {
                id: 1101101,
                related: [],
                mutex: [],
                content: '男',
              },
              {
                id: 1101102,
                related: [],
                mutex: [],
                content: '女',
              },
            ],
          },
        ],
        [
          {
            id: 11021,
            type: 'Single',
            question: '您现在居住的地区为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1102101,
                related: [11031],
                mutex: [],
                content: '国内',
              },
              {
                id: 1102101,
                related: [11032],
                mutex: [],
                content: '国外',
              },
            ],
          },
        ],
        [
          {
            id: 11031,
            type: 'Single',
            question: '您现在居住的地区位于哪个省级行政区？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1101301,
                related: [],
                mutex: [],
                content: '北京',
              },
              {
                id: 1101302,
                related: [],
                mutex: [],
                content: '天津',
              },
              {
                id: 1101303,
                related: [],
                mutex: [],
                content: '河北',
              },
              {
                id: 1101304,
                related: [],
                mutex: [],
                content: '山西',
              },
              {
                id: 1101305,
                related: [],
                mutex: [],
                content: '内蒙古',
              },
              {
                id: 1101306,
                related: [],
                mutex: [],
                content: '辽宁',
              },
              {
                id: 1101307,
                related: [],
                mutex: [],
                content: '吉林',
              },
              {
                id: 1101308,
                related: [],
                mutex: [],
                content: '黑龙江',
              },
              {
                id: 1101309,
                related: [],
                mutex: [],
                content: '上海',
              },
              {
                id: 1101310,
                related: [],
                mutex: [],
                content: '江苏',
              },
              {
                id: 1101311,
                related: [],
                mutex: [],
                content: '浙江',
              },
              {
                id: 1101312,
                related: [],
                mutex: [],
                content: '安徽',
              },
              {
                id: 1101313,
                related: [],
                mutex: [],
                content: '福建',
              },
              {
                id: 1101314,
                related: [],
                mutex: [],
                content: '江西',
              },
              {
                id: 1101315,
                related: [],
                mutex: [],
                content: '山东',
              },
              {
                id: 1101316,
                related: [],
                mutex: [],
                content: '河南',
              },
              {
                id: 1101317,
                related: [],
                mutex: [],
                content: '湖北',
              },
              {
                id: 1101318,
                related: [],
                mutex: [],
                content: '湖南',
              },
              {
                id: 1101319,
                related: [],
                mutex: [],
                content: '广东',
              },
              {
                id: 1101320,
                related: [],
                mutex: [],
                content: '广西',
              },
              {
                id: 1101321,
                related: [],
                mutex: [],
                content: '海南',
              },
              {
                id: 1101322,
                related: [],
                mutex: [],
                content: '重庆',
              },
              {
                id: 1101323,
                related: [],
                mutex: [],
                content: '四川',
              },
              {
                id: 1101324,
                related: [],
                mutex: [],
                content: '贵州',
              },
              {
                id: 1101325,
                related: [],
                mutex: [],
                content: '云南',
              },
              {
                id: 1101326,
                related: [],
                mutex: [],
                content: '西藏',
              },
              {
                id: 1101327,
                related: [],
                mutex: [],
                content: '陕西',
              },
              {
                id: 1101328,
                related: [],
                mutex: [],
                content: '甘肃',
              },
              {
                id: 1101329,
                related: [],
                mutex: [],
                content: '青海',
              },
              {
                id: 1101330,
                related: [],
                mutex: [],
                content: '宁夏',
              },
              {
                id: 1101331,
                related: [],
                mutex: [],
                content: '新疆',
              },
              {
                id: 1101332,
                related: [],
                mutex: [],
                content: '台湾',
              },
              {
                id: 1101333,
                related: [],
                mutex: [],
                content: '香港',
              },
              {
                id: 1101334,
                related: [],
                mutex: [],
                content: '澳门',
              },
            ],
          },
          {
            id: 11032,
            type: 'Single',
            question: '您现在居住的地区位于哪个省级行政区？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1103201,
                related: [],
                mutex: [],
                content: '日本',
              },
              {
                id: 1103202,
                related: [],
                mutex: [],
                content: '亚洲其他地区',
              },
              {
                id: 1103203,
                related: [],
                mutex: [],
                content: '大洋洲',
              },
              {
                id: 1103204,
                related: [],
                mutex: [],
                content: '欧洲',
              },
              {
                id: 1103205,
                related: [],
                mutex: [],
                content: '北美洲',
              },
              {
                id: 1103206,
                related: [],
                mutex: [],
                content: '南美洲',
              },
              {
                id: 1103207,
                related: [],
                mutex: [],
                content: '非洲',
              },
              {
                id: 1103208,
                related: [],
                mutex: [],
                content: '其他',
              },
            ],
          },
        ],
        [
          {
            id: 11041,
            type: 'Single',
            question: '您现在的年龄为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1104101,
                related: [],
                mutex: [],
                content: '未满10岁',
              },
              {
                id: 1104102,
                related: [],
                mutex: [],
                content: '10-14岁',
              },
              {
                id: 1104103,
                related: [],
                mutex: [],
                content: '15-17岁',
              },
              {
                id: 1104104,
                related: [],
                mutex: [],
                content: '18-20岁',
              },
              {
                id: 1104105,
                related: [],
                mutex: [],
                content: '21-23岁',
              },
              {
                id: 1104106,
                related: [],
                mutex: [],
                content: '24-26岁',
              },
              {
                id: 1104107,
                related: [],
                mutex: [],
                content: '27-29岁',
              },
              {
                id: 1104108,
                related: [],
                mutex: [],
                content: '30岁及以上',
              },
            ],
          },
        ],
        [
          {
            id: 11051,
            type: 'Single',
            question: '您是学生吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1105101,
                related: [11061],
                mutex: [],
                content: '是',
              },
              {
                id: 1105102,
                related: [11062],
                mutex: [],
                content: '不是',
              },
            ],
          },
        ],
        [
          {
            id: 11061,
            type: 'Single',
            question: '您现在的教育阶段为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1106101,
                related: [],
                mutex: [],
                content: '小学',
              },
              {
                id: 1106102,
                related: [],
                mutex: [],
                content: '初中',
              },
              {
                id: 1106103,
                related: [],
                mutex: [],
                content: '高中',
              },
              {
                id: 1106104,
                related: [],
                mutex: [],
                content: '中职/中专/技校',
              },
              {
                id: 1106105,
                related: [],
                mutex: [],
                content: '本科',
              },
              {
                id: 1106106,
                related: [],
                mutex: [],
                content: '专科',
              },
              {
                id: 1106107,
                related: [],
                mutex: [],
                content: '硕士',
              },
              {
                id: 1106108,
                related: [],
                mutex: [],
                content: '博士',
              },
              {
                id: 1106109,
                related: [],
                mutex: [],
                content: '其他',
              },
            ],
          },
          {
            id: 11062,
            type: 'Single',
            question: '您现在的工作情况为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1106201,
                related: [],
                mutex: [],
                content: '固定工作者',
              },
              {
                id: 1106202,
                related: [],
                mutex: [],
                content: '自由职业者',
              },
              {
                id: 1106203,
                related: [],
                mutex: [],
                content: '待业/无业/失业',
              },
              {
                id: 1106204,
                related: [],
                mutex: [],
                content: '其他',
              },
            ],
          },
        ],
        [
          {
            id: 11071,
            type: 'Single',
            question: '您正式接触东方project多久？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1107101,
                related: [],
                mutex: [],
                content: '半年以内（2021年4月及以后）',
              },
              {
                id: 1107102,
                related: [],
                mutex: [],
                content: '半年至一年（2020年10月及以后）',
              },
              {
                id: 1107103,
                related: [],
                mutex: [],
                content: '一年至三年（2018年10月及以后）',
              },
              {
                id: 1107104,
                related: [],
                mutex: [],
                content: '三年至五年（2016年10月及以后）',
              },
              {
                id: 1107105,
                related: [],
                mutex: [],
                content: '五年至七年（2014年10月及以后）',
              },
              {
                id: 1107106,
                related: [],
                mutex: [],
                content: '七年至十年（2011年10月及以后）',
              },
              {
                id: 1107107,
                related: [],
                mutex: [],
                content: '更早（2011年10月以前）',
              },
            ],
          },
        ],
        [
          {
            id: 11081,
            type: 'Single',
            question: '您是第几次参加人气投票活动？',
            introduction: '',
            input: '',
            options: [
              {
                id: 11108101,
                related: [],
                mutex: [],
                content: '第1次且经由投票的朋友介绍',
              },
              {
                id: 1108102,
                related: [],
                mutex: [],
                content: '1',
              },
              {
                id: 1108103,
                related: [],
                mutex: [],
                content: '2',
              },
              {
                id: 1108104,
                related: [],
                mutex: [],
                content: '3',
              },
              {
                id: 1108105,
                related: [],
                mutex: [],
                content: '4',
              },
              {
                id: 1108106,
                related: [],
                mutex: [],
                content: '5',
              },
              {
                id: 1108107,
                related: [],
                mutex: [],
                content: '6',
              },
              {
                id: 1108108,
                related: [],
                mutex: [],
                content: '7',
              },
              {
                id: 1108109,
                related: [],
                mutex: [],
                content: '8',
              },
              {
                id: 1108110,
                related: [],
                mutex: [],
                content: '9',
              },
              {
                id: 1108111,
                related: [],
                mutex: [],
                content: '10',
              },
            ],
          },
        ],
        [
          {
            id: 11091,
            type: 'Single',
            question: '您对原作感兴趣吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1109101,
                related: [],
                mutex: [],
                content: '很感兴趣，经常玩原作游戏/听官方曲/看官方出版物，期待新作发售',
              },
              {
                id: 1109102,
                related: [],
                mutex: [],
                content: '比较感兴趣，会玩原作游戏/听官方曲/看官方出版物，关注新作信息',
              },
              {
                id: 1109103,
                related: [],
                mutex: [],
                content: '一般感兴趣，偶尔会玩原作游戏/听官方曲/看官方出版物，新作信息刷到会稍微关注一下',
              },
              {
                id: 1109104,
                related: [],
                mutex: [],
                content: '对官作不感兴趣，不会去玩原作游戏/听官方曲/看官方出版物',
              },
            ],
          },
        ],
        [
          {
            id: 11101,
            type: 'Single',
            question: '您对二次创作感兴趣吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1110101,
                related: [],
                mutex: [],
                content: '非常热衷，欣赏二创作品是日常生活的一部分',
              },
              {
                id: 1110102,
                related: [],
                mutex: [],
                content: '有些兴趣，经常会看',
              },
              {
                id: 1110103,
                related: [],
                mutex: [],
                content: '兴趣一般，刷到了会看一下',
              },
              {
                id: 1110104,
                related: [],
                mutex: [],
                content: '不感兴趣',
              },
            ],
          },
        ],
      ],
    },
  },
}
