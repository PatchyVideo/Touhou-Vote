// 关于ID的说明：
// ID根据划分的细致程度，划分越细致其长度也会越来越长，现从左到右进行说明：
// 第一位：1表示主问卷；2表示额外问卷
// 第二位：主问卷的情况下1表示必填问卷，2表示官作分问卷，3表示官作分问卷
//        额外问卷的情况下1表示二创深入了解问卷，2表示官作通关情况深入了解问卷，3表示正版&盗版深入了解问卷，4表示主办方附加问卷
// 第三位&第四位：表示该问卷中的题目序号，从1开始计数。请注意，同一问卷中的同一问题序号有可能不止一个问题，由于用户选择的不同，同一序号也会出现不同的题目
// 第五位：表示该题目序号对应的题库中的题目顺序，从1开始计数
// 第六位&第七位：表示该题目对应的选项的序号，从1开始计数

import { computed } from 'vue-demi'

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
interface Questionnaire {
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
interface MainQuestionnaire {
  requiredQuestionnaire: Questionnaire
  optionalQuestionnaire1: Questionnaire
  // optionalQuestionnaire2: Questionnaire
  [key: string]: Questionnaire
}
interface ExtraQuestionnaire {
  exQuestionnaire1: Questionnaire
  [key: string]: Questionnaire
}
export interface QuestionnaireALL {
  mainQuestionnaire: MainQuestionnaire
  extraQuestionnaire: ExtraQuestionnaire
  [key: string]: MainQuestionnaire | ExtraQuestionnaire
}

// 问卷的大致分类参见文件：TOUHOU-VOTE/doc/QUESTIONAIREROADMAP.png
export const questionnaire: QuestionnaireALL = {
  mainQuestionnaire: {
    requiredQuestionnaire: {
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
                id: 1102102,
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
                id: 1103101,
                related: [],
                mutex: [],
                content: '北京',
              },
              {
                id: 1103102,
                related: [],
                mutex: [],
                content: '天津',
              },
              {
                id: 1103103,
                related: [],
                mutex: [],
                content: '河北',
              },
              {
                id: 1103104,
                related: [],
                mutex: [],
                content: '山西',
              },
              {
                id: 1103105,
                related: [],
                mutex: [],
                content: '内蒙古',
              },
              {
                id: 1103106,
                related: [],
                mutex: [],
                content: '辽宁',
              },
              {
                id: 1103107,
                related: [],
                mutex: [],
                content: '吉林',
              },
              {
                id: 1103108,
                related: [],
                mutex: [],
                content: '黑龙江',
              },
              {
                id: 1103109,
                related: [],
                mutex: [],
                content: '上海',
              },
              {
                id: 1103110,
                related: [],
                mutex: [],
                content: '江苏',
              },
              {
                id: 1103111,
                related: [],
                mutex: [],
                content: '浙江',
              },
              {
                id: 1103112,
                related: [],
                mutex: [],
                content: '安徽',
              },
              {
                id: 1103113,
                related: [],
                mutex: [],
                content: '福建',
              },
              {
                id: 1103114,
                related: [],
                mutex: [],
                content: '江西',
              },
              {
                id: 1103115,
                related: [],
                mutex: [],
                content: '山东',
              },
              {
                id: 1103116,
                related: [],
                mutex: [],
                content: '河南',
              },
              {
                id: 1103117,
                related: [],
                mutex: [],
                content: '湖北',
              },
              {
                id: 1103118,
                related: [],
                mutex: [],
                content: '湖南',
              },
              {
                id: 1103119,
                related: [],
                mutex: [],
                content: '广东',
              },
              {
                id: 1103120,
                related: [],
                mutex: [],
                content: '广西',
              },
              {
                id: 1103121,
                related: [],
                mutex: [],
                content: '海南',
              },
              {
                id: 1103122,
                related: [],
                mutex: [],
                content: '重庆',
              },
              {
                id: 1103123,
                related: [],
                mutex: [],
                content: '四川',
              },
              {
                id: 1103124,
                related: [],
                mutex: [],
                content: '贵州',
              },
              {
                id: 1103125,
                related: [],
                mutex: [],
                content: '云南',
              },
              {
                id: 1103126,
                related: [],
                mutex: [],
                content: '西藏',
              },
              {
                id: 1103127,
                related: [],
                mutex: [],
                content: '陕西',
              },
              {
                id: 1103128,
                related: [],
                mutex: [],
                content: '甘肃',
              },
              {
                id: 1103129,
                related: [],
                mutex: [],
                content: '青海',
              },
              {
                id: 1103130,
                related: [],
                mutex: [],
                content: '宁夏',
              },
              {
                id: 1103131,
                related: [],
                mutex: [],
                content: '新疆',
              },
              {
                id: 1103132,
                related: [],
                mutex: [],
                content: '台湾',
              },
              {
                id: 1103133,
                related: [],
                mutex: [],
                content: '香港',
              },
              {
                id: 1103134,
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
                mutex: [1107107],
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
    optionalQuestionnaire1: {
      id: 12,
      name: '主问卷 - 官作分问卷',
      introduction: '该部分问卷涉及投票者对官作的基本认知情况。投票者可以在该问卷与二次创作分问卷中择一填写',
      questions: [
        [
          {
            id: 12011,
            type: 'Multiple',
            question: '您关注哪一类官作？（多选）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1201101,
                related: [],
                mutex: [],
                content: '原作游戏',
              },
              {
                id: 1201102,
                related: [],
                mutex: [],
                content: '官方出版物',
              },
              {
                id: 1201103,
                related: [],
                mutex: [],
                content: '音乐CD',
              },
              {
                id: 1201104,
                related: [],
                mutex: [],
                content: '其它公式资料等',
              },
            ],
          },
        ],
        [
          {
            id: 12021,
            type: 'Single',
            question: '您喜欢官方游戏中的哪一类？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1202101,
                related: [],
                mutex: [],
                content: 'STG（整数作，射击类）',
              },
              {
                id: 1202102,
                related: [],
                mutex: [],
                content: 'FTG（小数点作，格斗类）',
              },
              {
                id: 1202103,
                related: [],
                mutex: [],
                content: '都喜欢',
              },
            ],
          },
        ],
        [
          {
            id: 12031,
            type: 'Single',
            question: '您是否了解旧五作？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1203101,
                related: [],
                mutex: [],
                content: '了解并且玩过',
              },
              {
                id: 1203102,
                related: [],
                mutex: [],
                content: '了解但没有玩过',
              },
              {
                id: 1203103,
                related: [],
                mutex: [],
                content: '不了解',
              },
            ],
          },
        ],
        [
          {
            id: 12041,
            type: 'Single',
            question: '您是否在steam平台上购买过官方游戏？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1204101,
                related: [],
                mutex: [],
                content: '买过',
              },
              {
                id: 1204102,
                related: [],
                mutex: [],
                content: '没买过',
              },
              {
                id: 1204103,
                related: [],
                mutex: [],
                content: '不知道这回事',
              },
            ],
          },
        ],
        [
          {
            id: 12051,
            type: 'Multiple',
            question: '您关注哪些近期连载的官方作品？（多选）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1205101,
                related: [],
                mutex: [],
                content: '东方醉蝶华',
              },
              {
                id: 1205102,
                related: [],
                mutex: [],
                content: '东方智灵奇传',
              },
              {
                id: 1205103,
                related: [],
                mutex: [],
                content: '东方外来韦编',
              },
              {
                id: 1205104,
                related: [],
                mutex: [],
                content: '东方我乐多丛志中的其它内容',
              },
              {
                id: 1205105,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 12061,
            type: 'Multiple',
            question: '您最喜欢东方原作的哪方面？（多选）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1206101,
                related: [],
                mutex: [],
                content: '游戏本身',
              },
              {
                id: 1206102,
                related: [],
                mutex: [],
                content: '音乐曲目',
              },
              {
                id: 1206103,
                related: [],
                mutex: [],
                content: '人物设定',
              },
              {
                id: 1206104,
                related: [],
                mutex: [],
                content: '故事剧情',
              },
              {
                id: 1206105,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 12071,
            type: 'Single',
            question: '您购买过实体正版原作吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1207101,
                related: [12081],
                mutex: [],
                content: '热衷于收集',
              },
              {
                id: 1207102,
                related: [12081],
                mutex: [],
                content: '购买过',
              },
              {
                id: 1207103,
                related: [12082],
                mutex: [],
                content: '想买但是没有条件',
              },
              {
                id: 1207104,
                related: [12082],
                mutex: [],
                content: '没买过且没有购买的想法',
              },
            ],
          },
        ],
        [
          {
            id: 12081,
            type: 'Multiple',
            question: '您购买实体正版原作的渠道为？（多选）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1208101,
                related: [],
                mutex: [],
                content: '代购',
              },
              {
                id: 1208102,
                related: [],
                mutex: [],
                content: '通过二手交易',
              },
              {
                id: 1208103,
                related: [],
                mutex: [],
                content: '委托朋友',
              },
              {
                id: 1208104,
                related: [],
                mutex: [],
                content: '实地购买',
              },
            ],
          },
          {
            id: 12082,
            type: 'Multiple',
            question: '是什么原因而没有购买？（多选）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1208201,
                related: [],
                mutex: [],
                content: '缺少渠道',
              },
              {
                id: 1208202,
                related: [],
                mutex: [],
                content: '不懂日语',
              },
              {
                id: 1208203,
                related: [],
                mutex: [],
                content: '价格过高',
              },
              {
                id: 1208204,
                related: [],
                mutex: [],
                content: '不感兴趣',
              },
              {
                id: 1208205,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 12091,
            type: 'Single',
            question: '您的购买力范围是？（单个作品，含税费、运费等）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1209101,
                related: [],
                mutex: [],
                content: '没有自主购买能力',
              },
              {
                id: 1209102,
                related: [],
                mutex: [],
                content: '总价50RMB以内',
              },
              {
                id: 1209103,
                related: [],
                mutex: [],
                content: '总价100RMB以内',
              },
              {
                id: 1209104,
                related: [],
                mutex: [],
                content: '总价150RMB以内',
              },
              {
                id: 1209105,
                related: [],
                mutex: [],
                content: '总价200RMB以内',
              },
              {
                id: 1209106,
                related: [],
                mutex: [],
                content: '总价200RMB以上',
              },
            ],
          },
        ],
        [
          {
            id: 12101,
            type: 'Single',
            question: '您是否了解官中出版物？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1210101,
                related: [],
                mutex: [],
                content: '已经购买',
              },
              {
                id: 1210102,
                related: [],
                mutex: [],
                content: '了解，打算购买',
              },
              {
                id: 1210103,
                related: [],
                mutex: [],
                content: '了解，不打算购买',
              },
              {
                id: 1210104,
                related: [],
                mutex: [],
                content: '不了解',
              },
            ],
          },
        ],
      ],
    },
  },
  extraQuestionnaire: {
    exQuestionnaire1: {
      id: 21,
      name: '额外问卷 - 官作通关深入了解',
      introduction: '该部分问卷涉及投票者官作游玩的具体情况。投票者可以选择是否填写该问卷',
      questions: [
        [
          {
            id: 21011,
            type: 'Multiple',
            question: '你吼辣么大声干什么嘛',
            introduction: '',
            input: '',
            options: [
              {
                id: 2101101,
                related: [],
                mutex: [],
                content: 'あないます',
              },
              {
                id: 2101102,
                related: [],
                mutex: [],
                content: 'あみましぜならひ',
              },
            ],
          },
        ],
      ],
    },
  },
}
