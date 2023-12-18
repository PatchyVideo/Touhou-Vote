// 关于ID的说明：
// ID根据划分的细致程度，划分越细致其长度也会越来越长，现从左到右进行说明：
// 第一位：1表示主问卷；2表示额外问卷
// 第二位：主问卷的情况下1表示必填问卷，2表示官作分问卷，3表示二创分问卷
//        额外问卷的情况下1表示二创深入了解问卷，2表示官作通关情况深入了解问卷，3表示展会观众与商业授权手游深入了解，4表示正版&盗版深入了解问卷，5表示主办方附加问卷
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
export interface Question {
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
  optionalQuestionnaire2: Questionnaire
  [key: string]: Questionnaire
}
interface ExtraQuestionnaire {
  exQuestionnaire1: Questionnaire
  exQuestionnaire2: Questionnaire
  exQuestionnaire3: Questionnaire
  exQuestionnaire4: Questionnaire
  exQuestionnaire5: Questionnaire
  [key: string]: Questionnaire
}
export interface QuestionnaireALL {
  mainQuestionnaire: MainQuestionnaire
  extraQuestionnaire: ExtraQuestionnaire
  [key: string]: MainQuestionnaire | ExtraQuestionnaire
}

// 问卷的大致分类参见文件：TOUHOU-VOTE/doc/questionnaireROADMAP.png
export const questionnaire: QuestionnaireALL = {
  mainQuestionnaire: {
    requiredQuestionnaire: {
      id: 11,
      name: '主要问卷 - 基础问卷',
      introduction:
        '本问卷的目的是收集一些投票者的非敏感信息。这些信息既可以勾勒出中文东方众的基本构成，也可以就其中一些项对投票结果的影响进行分析而得到一些有用的信息',
      questions: [
        [
          {
            id: 11011,
            type: 'Single',
            question: '您的性别是？（填写的信息仅用于数据分析，不会以任何形式披露投票者个人信息）',
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
            question: '您现在的主要所在地区为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1102101,
                related: [11031],
                mutex: [],
                content: '国内（含港澳台）',
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
            question: '您现在的最主要所在地是哪个省级行政区？',
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
            question: '您现在的主要所在地位于哪个地区？',
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
            question: '您现在的年龄所在区间为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1104101,
                related: [],
                mutex: [1108107],
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
                content: '18-21岁',
              },
              {
                id: 1104105,
                related: [],
                mutex: [],
                content: '22-25岁',
              },
              {
                id: 1104106,
                related: [],
                mutex: [],
                content: '26-29岁',
              },
              {
                id: 1104107,
                related: [],
                mutex: [],
                content: '30-39岁',
              },
              {
                id: 1104108,
                related: [],
                mutex: [],
                content: '40岁及以上',
              },
            ],
          },
        ],
        [
          {
            id: 11051,
            type: 'Single',
            question: '您当前的受教育程度为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1105101,
                related: [],
                mutex: [],
                content: '小学或学龄前',
              },
              {
                id: 1105102,
                related: [],
                mutex: [],
                content: '初中',
              },
              {
                id: 1105103,
                related: [],
                mutex: [],
                content: '高中/中专/职高/技校',
              },
              {
                id: 1105104,
                related: [],
                mutex: [],
                content: '本科/专科/高职',
              },
              {
                id: 1105105,
                related: [],
                mutex: [],
                content: '硕士/博士',
              },
              {
                id: 1105106,
                related: [],
                mutex: [],
                content: '其他',
              },
            ],
          },
        ],
        [
          {
            id: 11061,
            type: 'Single',
            question: '您目前还是学生吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1106101,
                related: [11070],
                mutex: [],
                content: '是',
              },
              {
                id: 1106102,
                related: [11071],
                mutex: [],
                content: '不是',
              },
            ],
          },
        ],
        [
          {
            id: 11070,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 11071,
            type: 'Single',
            question: '您现在的工作情况为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1107201,
                related: [],
                mutex: [],
                content: '固定工作者',
              },
              {
                id: 1107202,
                related: [],
                mutex: [],
                content: '自由职业者',
              },
              {
                id: 1107203,
                related: [],
                mutex: [],
                content: '待业/无业/失业',
              },
              {
                id: 1107204,
                related: [],
                mutex: [],
                content: '其他',
              },
            ],
          },
        ],
        [
          {
            id: 11081,
            type: 'Single',
            question: '您是从什么时间段开始对东方Project感兴趣的？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1108101,
                related: [],
                mutex: [],
                content: '半年以内（2022年内）',
              },
              {
                id: 1108102,
                related: [],
                mutex: [],
                content: '2020年～2021年期间',
              },
              {
                id: 1108103,
                related: [],
                mutex: [],
                content: '2018～2019年期间',
              },
              {
                id: 1108104,
                related: [],
                mutex: [],
                content: '2015～2017年期间',
              },
              {
                id: 1108105,
                related: [],
                mutex: [],
                content: '2011～2014年期间',
              },
              {
                id: 1108106,
                related: [],
                mutex: [],
                content: '2007～2010年期间',
              },
              {
                id: 1108107,
                related: [],
                mutex: [],
                content: '2006年及之前',
              },
            ],
          },
        ],
        [
          {
            id: 11091,
            type: 'Single',
            question: '您是第几次参加人气投票活动？',
            introduction: '',
            input: '',
            options: [
              {
                id: 11109101,
                related: [],
                mutex: [],
                content: '1',
              },
              {
                id: 1109102,
                related: [],
                mutex: [],
                content: '2',
              },
              {
                id: 1109103,
                related: [],
                mutex: [],
                content: '3',
              },
              {
                id: 1109104,
                related: [],
                mutex: [],
                content: '4',
              },
              {
                id: 1109105,
                related: [],
                mutex: [],
                content: '5',
              },
              {
                id: 1109106,
                related: [],
                mutex: [],
                content: '6',
              },
              {
                id: 1109107,
                related: [],
                mutex: [],
                content: '7',
              },
              {
                id: 1109108,
                related: [],
                mutex: [],
                content: '8',
              },
              {
                id: 1109109,
                related: [],
                mutex: [],
                content: '9',
              },
              {
                id: 1109110,
                related: [],
                mutex: [],
                content: '10',
              },
            ],
          },
        ],
        [
          {
            id: 11101,
            type: 'Single',
            question: '您对东方的官方作品感兴趣吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1110101,
                related: [],
                mutex: [],
                content: '热衷于原作游戏/音乐/官方出版物等内容，期待新作更新',
              },
              {
                id: 1110102,
                related: [],
                mutex: [],
                content: '对原作游戏/音乐/官方出版物等内容比较感兴趣，关注新作信息',
              },
              {
                id: 1110103,
                related: [],
                mutex: [],
                content: '偶尔关注官作内容，如果看到新作信息会稍微关注一下',
              },
              {
                id: 1110104,
                related: [],
                mutex: [],
                content: '对官作不感兴趣，不会主动接触原作游戏/音乐/官方出版物等内容',
              },
            ],
          },
        ],
        [
          {
            id: 11111,
            type: 'Single',
            question: '您对东方的二次创作感兴趣吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1111101,
                related: [],
                mutex: [],
                content: '非常热衷，欣赏东方二创作品是日常生活的一部分',
              },
              {
                id: 1111102,
                related: [],
                mutex: [],
                content: '有些兴趣，有时间的时候经常会看',
              },
              {
                id: 1111103,
                related: [],
                mutex: [],
                content: '兴趣一般，偶尔刷到了会看一下',
              },
              {
                id: 1111104,
                related: [],
                mutex: [],
                content: '不感兴趣，不会主动接触',
              },
            ],
          },
        ],
      ],
    },
    optionalQuestionnaire1: {
      id: 12,
      name: '主要问卷 - 官方作品问卷',
      introduction: '该部分问卷涉及投票者对官作的基本认知情况。投票者可以在该问卷与二次创作分问卷中择一填写',
      questions: [
        [
          {
            id: 12011,
            type: 'Multiple',
            question: '您平时比较关注哪种体裁的东方官方作品？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1201101,
                related: [],
                mutex: [],
                content: '游戏',
              },
              {
                id: 1201102,
                related: [],
                mutex: [],
                content: '漫画',
              },
              {
                id: 1201103,
                related: [],
                mutex: [],
                content: '小说/设定集',
              },
              {
                id: 1201104,
                related: [],
                mutex: [],
                content: '音乐CD',
              },
              {
                id: 1201105,
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
            question: '您更喜欢官方游戏中的哪一类？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1202101,
                related: [],
                mutex: [],
                content: 'STG（弹幕射击类）',
              },
              {
                id: 1202102,
                related: [],
                mutex: [],
                content: 'FTG（黄昏作格斗类，包含刚欲异闻）',
              },
              {
                id: 1202103,
                related: [],
                mutex: [],
                content: '都喜欢',
              },
              {
                id: 1202104,
                related: [],
                mutex: [],
                content: '都没兴趣',
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
                content: '十分熟悉',
              },
              {
                id: 1203102,
                related: [],
                mutex: [],
                content: '有所了解',
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
                content: '不知道steam平台上有官方游戏',
              },
            ],
          },
        ],
        [
          {
            id: 12051,
            type: 'Multiple',
            question: '您关注哪些近期连载的官方作品？',
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
            question: '您最喜欢东方原作的哪方面？',
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
            question: '您购买正版原作的渠道为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1208101,
                related: [],
                mutex: [],
                content: '囧仙子通贩/B站会员购等正版渠道',
              },
              {
                id: 1208102,
                related: [],
                mutex: [],
                content: 'Steam等数字正版平台',
              },
              {
                id: 1208103,
                related: [],
                mutex: [],
                content: '代购店',
              },
              {
                id: 1208104,
                related: [],
                mutex: [],
                content: '二手交易',
              },
              {
                id: 1208105,
                related: [],
                mutex: [],
                content: '委托朋友',
              },
              {
                id: 1208106,
                related: [],
                mutex: [],
                content: '实地购买',
              },
            ],
          },
          {
            id: 12082,
            type: 'Multiple',
            question: '是什么原因而没有购买？',
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
            question: '您的能接受的官方作品的价格范围是？（单个作品，含税费、运费等）',
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
                content: '单价50RMB以内',
              },
              {
                id: 1209103,
                related: [],
                mutex: [],
                content: '单价100RMB以内',
              },
              {
                id: 1209104,
                related: [],
                mutex: [],
                content: '单价150RMB以内',
              },
              {
                id: 1209105,
                related: [],
                mutex: [],
                content: '单价200RMB以内',
              },
              {
                id: 1209106,
                related: [],
                mutex: [],
                content: '单价200RMB以上',
              },
            ],
          },
        ],
        [
          {
            id: 12101,
            type: 'Single',
            question: '您是否了解国内已引进的正版简体中文的东方官方出版物？',
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
        [
          {
            id: 12111,
            type: 'Input',
            question: '您最喜欢的官方作品是？（可填无）',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 12121,
            type: 'Input',
            question: '喜欢的理由是？（可填无）',
            introduction: '',
            input: '',
            options: [],
          },
        ],
      ],
    },
    optionalQuestionnaire2: {
      id: 13,
      name: '主要问卷 - 二次创作问卷',
      introduction: '该部分问卷涉及投票者对二次创作的基本了解情况。投票者可以在该问卷与官作分问卷中择一填写',
      questions: [
        [
          {
            id: 13011,
            type: 'Multiple',
            question: '您比较关注哪一类二次创作？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1301101,
                related: [],
                mutex: [],
                content: '音乐/音声',
              },
              {
                id: 1301102,
                related: [],
                mutex: [],
                content: '漫画',
              },
              {
                id: 1301103,
                related: [],
                mutex: [],
                content: '游戏',
              },
              {
                id: 1301104,
                related: [],
                mutex: [],
                content: '绘画',
              },
              {
                id: 1301105,
                related: [],
                mutex: [],
                content: '视频',
              },
              {
                id: 1301106,
                related: [],
                mutex: [],
                content: '文字',
              },
              {
                id: 1301107,
                related: [],
                mutex: [],
                content: 'Cosplay',
              },
              {
                id: 1301108,
                related: [],
                mutex: [],
                content: '实物',
              },
              {
                id: 1301109,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 13021,
            type: 'Multiple',
            question: '您关注二次创作的原因？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1302101,
                related: [],
                mutex: [],
                content: '喜欢某些二次设定或Meme',
              },
              {
                id: 1302102,
                related: [],
                mutex: [],
                content: '有趣的故事剧情与世界观架构',
              },
              {
                id: 1302103,
                related: [],
                mutex: [],
                content: '（作画、编曲、制作等）在同类作品中更为出色',
              },
              {
                id: 1302104,
                related: [],
                mutex: [],
                content: '东方相关的创作就喜欢看',
              },
              {
                id: 1302105,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 13031,
            type: 'Single',
            question: '平均来说，您浏览二次创作的大致频率为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1303101,
                related: [],
                mutex: [],
                content: '只要有时间就总是在浏览',
              },
              {
                id: 1303102,
                related: [],
                mutex: [],
                content: '几乎每天都会抽时间浏览',
              },
              {
                id: 1303103,
                related: [],
                mutex: [],
                content: '每隔几天主动浏览几次',
              },
              {
                id: 1303104,
                related: [],
                mutex: [],
                content: '仅在刷到的时候偶尔看看',
              },
              {
                id: 1303105,
                related: [],
                mutex: [],
                content: '如果没有特别的原因不会浏览',
              },
            ],
          },
        ],
        [
          {
            id: 13041,
            type: 'Single',
            question: '您购买过国内的二次同人作品吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1304101,
                related: [13051, 13061, 13071],
                mutex: [1312102],
                content: '购买过国内的二次同人作品',
              },
              {
                id: 1304103,
                related: [13050, 13060, 13070],
                mutex: [],
                content: '没有购买过',
              },
            ],
          },
        ],
        [
          {
            id: 13050,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 13051,
            type: 'Multiple',
            question: '您购买的国内二次同人作品类型为？（分类均包含数字版）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1305101,
                related: [],
                mutex: [],
                content: '音乐/音声类',
              },
              {
                id: 1305102,
                related: [],
                mutex: [],
                content: '漫画类',
              },
              {
                id: 1305103,
                related: [],
                mutex: [],
                content: '插画类',
              },
              {
                id: 1305104,
                related: [],
                mutex: [],
                content: '游戏类',
              },
              {
                id: 1305105,
                related: [],
                mutex: [],
                content: '文字类',
              },
              {
                id: 1305106,
                related: [],
                mutex: [],
                content: '视频类',
              },
              {
                id: 1305107,
                related: [],
                mutex: [],
                content: '实体周边类',
              },
              {
                id: 1305108,
                related: [],
                mutex: [],
                content: '服装饰品类',
              },
              {
                id: 1305109,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 13060,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 13061,
            type: 'Multiple',
            question: '您购买国内二次同人作品的渠道为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1306101,
                related: [],
                mutex: [],
                content: '网络邮购',
              },
              {
                id: 1306102,
                related: [],
                mutex: [],
                content: '展会购买',
              },
              {
                id: 1306103,
                related: [],
                mutex: [],
                content: '电子版/下载版',
              },
              {
                id: 1306104,
                related: [],
                mutex: [],
                content: '委托朋友/代购',
              },
              {
                id: 1306105,
                related: [],
                mutex: [],
                content: '他人转手/二手',
              },
              {
                id: 1306106,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 13070,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 13071,
            type: 'Single',
            question: '您对国内二次同人作品的购买力范围是？（单个作品，含手续费、运费等）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1307101,
                related: [],
                mutex: [],
                content: '单价30RMB以内',
              },
              {
                id: 1307102,
                related: [],
                mutex: [],
                content: '单价50RMB以内',
              },
              {
                id: 1307103,
                related: [],
                mutex: [],
                content: '单价100RMB以内',
              },
              {
                id: 1307104,
                related: [],
                mutex: [],
                content: '单价150RMB以内',
              },
              {
                id: 1307105,
                related: [],
                mutex: [],
                content: '单价200RMB以内',
              },
              {
                id: 1307106,
                related: [],
                mutex: [],
                content: '单价200RMB以上',
              },
            ],
          },
        ],
        [
          {
            id: 13081,
            type: 'Single',
            question: '您购买过国外的二次同人作品吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1304102,
                related: [13091, 13101, 13111],
                mutex: [1312101, 1312103],
                content: '购买过国外的二次同人作品',
              },
              {
                id: 1304103,
                related: [13090, 13100, 13110],
                mutex: [],
                content: '没有购买过',
              },
            ],
          },
        ],
        [
          {
            id: 13090,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 13091,
            type: 'Multiple',
            question: '您购买的国外二次同人作品类型为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1309101,
                related: [],
                mutex: [],
                content: '音乐/音声类',
              },
              {
                id: 1309102,
                related: [],
                mutex: [],
                content: '漫画类',
              },
              {
                id: 1309103,
                related: [],
                mutex: [],
                content: '插画类',
              },
              {
                id: 1309104,
                related: [],
                mutex: [],
                content: '游戏类',
              },
              {
                id: 1309105,
                related: [],
                mutex: [],
                content: '文字类',
              },
              {
                id: 1309106,
                related: [],
                mutex: [],
                content: '视频类',
              },
              {
                id: 1309107,
                related: [],
                mutex: [],
                content: '实体周边类',
              },
              {
                id: 1309108,
                related: [],
                mutex: [],
                content: '服装饰品类',
              },
              {
                id: 1309109,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 13100,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 13101,
            type: 'Multiple',
            question: '您购买国外二次同人作品的渠道为？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1310101,
                related: [],
                mutex: [],
                content: '国内代理/正版引进',
              },
              {
                id: 1310102,
                related: [],
                mutex: [],
                content: '电子版/下载版',
              },
              {
                id: 1310103,
                related: [],
                mutex: [],
                content: '代购平台/代购店',
              },
              {
                id: 1310104,
                related: [],
                mutex: [],
                content: '网络邮购/转运',
              },
              {
                id: 1310105,
                related: [],
                mutex: [],
                content: '实地购买（展会/实体店等）',
              },
              {
                id: 1310106,
                related: [],
                mutex: [],
                content: '委托朋友帮买',
              },
              {
                id: 1310107,
                related: [],
                mutex: [],
                content: '购买二手/他人转手',
              },
              {
                id: 1310108,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 13110,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 13111,
            type: 'Single',
            question: '您对国外二次同人作品的购买力范围是？（单个作品，含手续费、税费、运费等）',
            introduction: '',
            input: '',
            options: [
              {
                id: 1311101,
                related: [],
                mutex: [],
                content: '单价50RMB以内',
              },
              {
                id: 1311102,
                related: [],
                mutex: [],
                content: '单价100RMB以内',
              },
              {
                id: 1311103,
                related: [],
                mutex: [],
                content: '单价150RMB以内',
              },
              {
                id: 1311104,
                related: [],
                mutex: [],
                content: '单价200RMB以内',
              },
              {
                id: 1311105,
                related: [],
                mutex: [],
                content: '单价300RMB以内',
              },
              {
                id: 1311106,
                related: [],
                mutex: [],
                content: '单价500RMB以内',
              },
              {
                id: 1311107,
                related: [],
                mutex: [],
                content: '单价500RMB以上',
              },
            ],
          },
        ],
        [
          {
            id: 13121,
            type: 'Multiple',
            question: '阻碍您购买二次同人作品的原因是？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1312101,
                related: [],
                mutex: [],
                content: '缺少购买国外二次创作的渠道',
              },
              {
                id: 1312102,
                related: [],
                mutex: [],
                content: '缺少购买国内二次创作的渠道',
              },
              {
                id: 1312103,
                related: [],
                mutex: [],
                content: '不懂国外二次创作对应的外语',
              },
              {
                id: 1312104,
                related: [],
                mutex: [],
                content: '价格过高',
              },
              {
                id: 1312105,
                related: [],
                mutex: [],
                content: '不感兴趣',
              },
              {
                id: 1312106,
                related: [],
                mutex: [],
                content: '其它',
              },
              {
                id: 1312107,
                related: [],
                mutex: [1312101, 1312102, 1312103, 1312104, 1312105, 1312106],
                content: '不存在阻碍，我想买啥买啥！',
              },
            ],
          },
        ],
        [
          {
            id: 13131,
            type: 'Single',
            question: '您在进行（任何形式、任何程度的）二次创作吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1313101,
                related: [],
                mutex: [],
                content: '是，且有持续性的投入',
              },
              {
                id: 1313102,
                related: [],
                mutex: [],
                content: '是，偶尔进行',
              },
              {
                id: 1313103,
                related: [],
                mutex: [],
                content: '否',
              },
            ],
          },
        ],
        [
          {
            id: 13141,
            type: 'Single',
            question: '您了解官方授权商业作品（归言录、弹幕神乐等）吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 1314101,
                related: [],
                mutex: [],
                content: '正在玩，并且有在游戏中消费',
              },
              {
                id: 1314102,
                related: [],
                mutex: [],
                content: '正在玩，但没有在游戏中消费',
              },
              {
                id: 1314103,
                related: [],
                mutex: [],
                content: '之前玩过，已经弃坑',
              },
              {
                id: 1314104,
                related: [],
                mutex: [],
                content: '了解，但没在玩',
              },
              {
                id: 1314105,
                related: [],
                mutex: [],
                content: '不了解，没听说',
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
      name: '额外问卷 - 同人创作相关',
      introduction: '该部分问卷涉及投票者官作游玩的具体情况。投票者可以选择是否填写该问卷',
      questions: [
        [
          {
            id: 21011,
            type: 'Multiple',
            question: '您在进行何种类型的二次创作？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2101101,
                related: [],
                mutex: [],
                content: '音乐/音声类',
              },
              {
                id: 2101102,
                related: [],
                mutex: [],
                content: '漫画类',
              },
              {
                id: 2101103,
                related: [],
                mutex: [],
                content: '插画类',
              },
              {
                id: 2101104,
                related: [],
                mutex: [],
                content: '软件/游戏类',
              },
              {
                id: 2101105,
                related: [],
                mutex: [],
                content: '文字类',
              },
              {
                id: 2101106,
                related: [],
                mutex: [],
                content: '视频类',
              },
              {
                id: 2101107,
                related: [],
                mutex: [],
                content: '实体周边类',
              },
              {
                id: 2101108,
                related: [],
                mutex: [],
                content: '服装饰品类',
              },
              {
                id: 2101109,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 21021,
            type: 'Multiple',
            question: '在创作过程中，您的动力来源是？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2102101,
                related: [],
                mutex: [],
                content: '表达对角色/音乐/作品的喜爱',
              },
              {
                id: 2102102,
                related: [],
                mutex: [],
                content: '创作完成时的成就感',
              },
              {
                id: 2102103,
                related: [],
                mutex: [],
                content: '观众对作品的反馈',
              },
              {
                id: 2102104,
                related: [],
                mutex: [],
                content: '其它创作者的支持与鼓励',
              },
              {
                id: 2102105,
                related: [],
                mutex: [],
                content: '通过创作作品来获取经济收益',
              },
              {
                id: 2102106,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 21031,
            type: 'Input',
            question: '在诸多支持您进行创作的因素中，最主要的是？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2103101,
                related: [],
                mutex: [],
                content: '',
              },
            ],
          },
        ],
        [
          {
            id: 21041,
            type: 'Multiple',
            question: '在创作过程中遇到过什么样的困难？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2104101,
                related: [],
                mutex: [],
                content: '需要从其他事情上分时间和精力',
              },
              {
                id: 2104102,
                related: [],
                mutex: [],
                content: '感到技术力不足',
              },
              {
                id: 2104103,
                related: [],
                mutex: [],
                content: '难以维持自己的动力',
              },
              {
                id: 2104104,
                related: [],
                mutex: [],
                content: '疫情导致线下展会取消',
              },
              {
                id: 2104105,
                related: [],
                mutex: [],
                content: '缺少好用的线上发布或销售渠道',
              },
              {
                id: 2104106,
                related: [],
                mutex: [],
                content: '发布后缺乏关注无人问津',
              },
              {
                id: 2104107,
                related: [],
                mutex: [],
                content: '周边氛围对创作非常不友好',
              },
              {
                id: 2104108,
                related: [],
                mutex: [],
                content: '经济上难以维持',
              },
              {
                id: 2104109,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 21051,
            type: 'Input',
            question:
              '您认为在创作过程中遇到过的各种困难，可以如何得到改善？（如，印刷生产方面的建议和帮助、更好的同人作品发布平台，等等）',
            introduction: '',
            input: '',
            options: [
              {
                id: 2105101,
                related: [],
                mutex: [],
                content: '',
              },
            ],
          },
        ],
        [
          {
            id: 21061,
            type: 'Input',
            question:
              '您认为您需要/希望获得来自平台方面的何种帮助？（如建立新的推荐作品的渠道等）（如果认为现在状况很好可以写现状很好）',
            introduction: '',
            input: '',
            options: [
              {
                id: 2106101,
                related: [],
                mutex: [],
                content: '',
              },
            ],
          },
        ],
        [
          {
            id: 21071,
            type: 'Single',
            question: '基于线下的同人展会对您来说意义如何？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2107101,
                related: [],
                mutex: [],
                content: '非常重要，是作品销量的大头所在',
              },
              {
                id: 2107102,
                related: [],
                mutex: [],
                content: '有一定的参展需求',
              },
              {
                id: 2107103,
                related: [],
                mutex: [],
                content: '可有可无，随缘参加',
              },
              {
                id: 2107104,
                related: [],
                mutex: [],
                content: '从不参加',
              },
            ],
          },
        ],
      ],
    },
    exQuestionnaire2: {
      id: 22,
      name: '额外问卷 - 官作游戏相关',
      introduction: '该部分问卷涉及投票者官作游玩的具体情况。投票者可以选择是否填写该问卷',
      questions: [
        [
          {
            id: 22011,
            type: 'Single',
            question: '您玩过STG正作吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2201101,
                related: [22021],
                mutex: [],
                content: '玩过',
              },
              {
                id: 2201102,
                related: [22020],
                mutex: [],
                content: '没玩过',
              },
            ],
          },
        ],
        [
          {
            id: 22020,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 22021,
            type: 'Single',
            question: '您以什么为目标游玩STG？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2202101,
                related: [],
                mutex: [],
                content: '我只想体验游戏流程和视听表现',
              },
              {
                id: 2202102,
                related: [],
                mutex: [],
                content: '我想通关游戏',
              },
              {
                id: 2202103,
                related: [],
                mutex: [],
                content: '我想挑战游戏的高难度',
              },
              {
                id: 2202104,
                related: [],
                mutex: [],
                content: '我想挑战游戏的neta挑战',
              },
              {
                id: 2202105,
                related: [],
                mutex: [],
                content: '我想挑战游戏的最高得分',
              },
            ],
          },
        ],
        [
          {
            id: 22031,
            type: 'Single',
            question: '您玩过旧作吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2203101,
                related: [],
                mutex: [],
                content: '玩过且已有一部或以上的作品通关',
              },
              {
                id: 2203102,
                related: [],
                mutex: [],
                content: '玩过',
              },
              {
                id: 2203103,
                related: [],
                mutex: [],
                content: '没玩过',
              },
            ],
          },
        ],
        [
          {
            id: 22041,
            type: 'Single',
            question: '您玩过FTG作（单人）吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2204101,
                related: [22051],
                mutex: [],
                content: '玩过',
              },
              {
                id: 2204102,
                related: [22050],
                mutex: [],
                content: '没玩过',
              },
            ],
          },
        ],
        [
          {
            id: 22050,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 22051,
            type: 'Single',
            question: '您以什么为目标游玩FTG？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2205101,
                related: [],
                mutex: [],
                content: '我只想体验游戏流程和视听表现',
              },
              {
                id: 2205102,
                related: [],
                mutex: [],
                content: '我想通关某部作品的某些路线',
              },
              {
                id: 2205103,
                related: [],
                mutex: [],
                content: '我想通关某部作品的全部路线',
              },
              {
                id: 2205104,
                related: [],
                mutex: [],
                content: '我想要磨练自己的游戏技术',
              },
            ],
          },
        ],
        [
          {
            id: 22061,
            type: 'Single',
            question: '您玩过FTG作（多人）吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2206101,
                related: [22071],
                mutex: [],
                content: '玩过',
              },
              {
                id: 2206102,
                related: [22070],
                mutex: [],
                content: '没玩过',
              },
            ],
          },
        ],
        [
          {
            id: 22070,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 22071,
            type: 'Single',
            question: '您的多人FTG对战情况是什么样的？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2207101,
                related: [],
                mutex: [],
                content: '我与没什么游戏经验的朋友进行过联机对战',
              },
              {
                id: 2207102,
                related: [],
                mutex: [],
                content: '我与对游戏较为熟悉的玩家进行过对战',
              },
              {
                id: 2207103,
                related: [],
                mutex: [],
                content: '我与游戏水平较高的玩家进行过互有胜负的对战',
              },
              {
                id: 2207104,
                related: [],
                mutex: [],
                content: '我在经常进行格斗对战的社交圈内处于顶尖水平',
              },
            ],
          },
        ],
        [
          {
            id: 22081,
            type: 'Single',
            question: '您是否玩过《东方刚欲异闻》？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2208101,
                related: [],
                mutex: [],
                content: '玩过',
              },
              {
                id: 2208102,
                related: [],
                mutex: [],
                content: '没玩过',
              },
            ],
          },
        ],
      ],
    },
    exQuestionnaire3: {
      id: 23,
      name: '额外问卷 - 展会与手游相关',
      introduction: '该部分问卷涉及投票者对展会与授权手游了解的具体情况。投票者可以选择是否填写该问卷',
      questions: [
        [
          {
            id: 23011,
            type: 'Single',
            question: '您是否（作为游客/摊主）参加过东方主题的线下活动？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2301101,
                related: [23021],
                mutex: [],
                content: '是',
              },
              {
                id: 2301102,
                related: [23022],
                mutex: [],
                content: '否',
              },
            ],
          },
        ],
        [
          {
            id: 23021,
            type: 'Single',
            question: '您2022年内是否（作为游客/摊主）参加过东方主题的线下活动？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2302101,
                related: [],
                mutex: [],
                content: '是',
              },
              {
                id: 2302102,
                related: [],
                mutex: [],
                content: '否',
              },
            ],
          },
          {
            id: 23022,
            type: 'Multiple',
            question: '您没有参加过展会的原因是？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2302201,
                related: [],
                mutex: [],
                content: '想去的展会被取消',
              },
              {
                id: 2302202,
                related: [],
                mutex: [],
                content: '没有时间',
              },
              {
                id: 2302203,
                related: [],
                mutex: [],
                content: '路费太贵',
              },
              {
                id: 2302204,
                related: [],
                mutex: [],
                content: '生活环境原因（如封校）',
              },
              {
                id: 2302205,
                related: [],
                mutex: [],
                content: '不知道线下展会的信息',
              },
              {
                id: 2302206,
                related: [],
                mutex: [],
                content: '其它',
              },
            ],
          },
        ],
        [
          {
            id: 23031,
            type: 'Single',
            question: '在参加展会方面您是否受到了疫情的影响？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2303101,
                related: [],
                mutex: [],
                content: '是',
              },
              {
                id: 2303102,
                related: [],
                mutex: [],
                content: '否',
              },
            ],
          },
        ],
        [
          {
            id: 23041,
            type: 'Single',
            question: '您是否只考虑参加本地或附近地区的同人展？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2304101,
                related: [],
                mutex: [],
                content: '仅参加本地或附近地区的展会',
              },
              {
                id: 2304102,
                related: [],
                mutex: [],
                content: '异地的展会也会去',
              },
            ],
          },
        ],
        [
          {
            id: 23051,
            type: 'Single',
            question: '您了解官方授权商业手游《东方LostWord（东方归言录）》吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2305101,
                related: [23061],
                mutex: [],
                content: '正在玩，并且有在游戏中消费',
              },
              {
                id: 2305102,
                related: [23061],
                mutex: [],
                content: '正在玩，但没有在游戏中消费',
              },
              {
                id: 2305103,
                related: [23061],
                mutex: [],
                content: '之前玩过，已经弃坑',
              },
              {
                id: 2305104,
                related: [23061],
                mutex: [],
                content: '了解，但没在玩',
              },
              {
                id: 2305105,
                related: [23060],
                mutex: [],
                content: '不了解',
              },
            ],
          },
        ],
        [
          {
            id: 23060,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 23061,
            type: 'Input',
            question: '您对《东方LostWord（东方归言录）》评价如何？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 23071,
            type: 'Single',
            question: '您了解官方授权商业手游《东方弹幕神乐》吗？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2307101,
                related: [23081],
                mutex: [],
                content: '正在玩，并且有在游戏中消费',
              },
              {
                id: 2307102,
                related: [23081],
                mutex: [],
                content: '正在玩，但没有在游戏中消费',
              },
              {
                id: 2307103,
                related: [23081],
                mutex: [],
                content: '之前玩过，已经弃坑',
              },
              {
                id: 2307104,
                related: [23081],
                mutex: [],
                content: '了解，但没在玩',
              },
              {
                id: 2307105,
                related: [23080],
                mutex: [],
                content: '不了解',
              },
            ],
          },
        ],
        [
          {
            id: 23081,
            type: 'Input',
            question: '您对《东方弹幕神乐》评价如何？',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 23080,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 23091,
            type: 'Single',
            question: '您是否了解其他几款商业授权手游作品（如东方大炮弹、东方DungeonDive、东方ArcadiaRecord等）？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2309101,
                related: [],
                mutex: [],
                content: '十分了解',
              },
              {
                id: 2309102,
                related: [],
                mutex: [],
                content: '听闻过相关信息',
              },
              {
                id: 2309103,
                related: [],
                mutex: [],
                content: '没听说过',
              },
              {
                id: 2309104,
                related: [],
                mutex: [],
                content: '不关注这些',
              },
            ],
          },
        ],
        [
          {
            id: 23101,
            type: 'Input',
            question: '您对商业授权手游的看法如何？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
      ],
    },
    exQuestionnaire4: {
      id: 24,
      name: '额外问卷 - 正版盗版相关',
      introduction: '该部分问卷涉及投票者对正版和盗版了解的具体情况。投票者可以选择是否填写该问卷',
      questions: [
        [
          {
            id: 24011,
            type: 'Single',
            question: '您是否购买过已经引进的正版简中出版物《东方人物名鉴 常世篇/宵暗篇》？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2401101,
                related: [],
                mutex: [],
                content: '购买了两本',
              },
              {
                id: 2401102,
                related: [],
                mutex: [],
                content: '只购买了常世篇',
              },
              {
                id: 2401103,
                related: [],
                mutex: [],
                content: '只购买了宵暗篇',
              },
              {
                id: 2401104,
                related: [],
                mutex: [],
                content: '知晓但没有购买',
              },
              {
                id: 2401105,
                related: [],
                mutex: [],
                content: '未听说过',
              },
            ],
          },
        ],
        [
          {
            id: 24021,
            type: 'Single',
            question: '您是否购买过已经引进的正版简中出版物《东方文果真报》？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2402101,
                related: [],
                mutex: [],
                content: '购买了',
              },
              {
                id: 2402102,
                related: [],
                mutex: [],
                content: '知晓但没有购买',
              },
              {
                id: 2402103,
                related: [],
                mutex: [],
                content: '未听说过',
              },
            ],
          },
        ],
        [
          {
            id: 24031,
            type: 'Single',
            question: '您认为现在的官中出版物定价如何？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2403101,
                related: [],
                mutex: [],
                content: '合适',
              },
              {
                id: 2403102,
                related: [],
                mutex: [],
                content: '定价偏高',
              },
              {
                id: 2403103,
                related: [],
                mutex: [],
                content: '定价偏低',
              },
            ],
          },
        ],
        [
          {
            id: 24041,
            type: 'Single',
            question: '您是否支持继续以目前的模式（保持现在的引进速度及质量）引进官中出版物？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2404101,
                related: [24050],
                mutex: [],
                content: '支持',
              },
              {
                id: 2404102,
                related: [24051],
                mutex: [],
                content: '不支持',
              },
            ],
          },
        ],
        [
          {
            id: 24050,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 24051,
            type: 'Input',
            question: '您不支持的理由是？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 24061,
            type: 'Single',
            question: '您对于目前引进的官中出版物质量是否满意？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2406101,
                related: [24070],
                mutex: [],
                content: '满意',
              },
              {
                id: 2406102,
                related: [24071],
                mutex: [],
                content: '不满意',
              },
            ],
          },
        ],
        [
          {
            id: 24070,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 24071,
            type: 'Input',
            question: '您不满意的原因是？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 24081,
            type: 'Single',
            question: '您是否使用过盗版官作游戏？（注：网络上免费下载的完整官作游戏均为盗版）',
            introduction: '',
            input: '',
            options: [
              {
                id: 2408101,
                related: [24091],
                mutex: [],
                content: '是，并且购买了对应的正版',
              },
              {
                id: 2408102,
                related: [24091],
                mutex: [],
                content: '是，并且没有购买对应的正版',
              },
              {
                id: 2408103,
                related: [24090],
                mutex: [],
                content: '否',
              },
            ],
          },
        ],
        [
          {
            id: 24090,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 24091,
            type: 'Input',
            question: '您使用盗版官作游戏的理由是？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 24101,
            type: 'Single',
            question: '您是否了解过盗版的二创作品（盗版CD、盗版漫画等）？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2410101,
                related: [24111],
                mutex: [],
                content: '（有意或无意地）购买过',
              },
              {
                id: 2410102,
                related: [24111],
                mutex: [],
                content: '听说过',
              },
              {
                id: 2410103,
                related: [24110],
                mutex: [],
                content: '没有听说过',
              },
            ],
          },
        ],
        [
          {
            id: 24110,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 24111,
            type: 'Input',
            question: '您如何看待盗版的二创作品（盗版CD、盗版漫画等）？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 24121,
            type: 'Single',
            question: '您是否了解在同人创作中存在的盗用（如盗视频，挪用换皮，抄袭剽窃等）？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2412101,
                related: [24131],
                mutex: [],
                content: '见到过相关的盗用情况',
              },
              {
                id: 2412102,
                related: [24131],
                mutex: [],
                content: '听说过',
              },
              {
                id: 2412103,
                related: [24130],
                mutex: [],
                content: '没有听说过',
              },
            ],
          },
        ],
        [
          {
            id: 24130,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 24131,
            type: 'Input',
            question: '您如何看待同人创作中出现的盗版作品？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 24141,
            type: 'Single',
            question: '您是否了解类似流星计划、因幡帝汉化组这样的同人作品正版引进的组织？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2414101,
                related: [],
                mutex: [],
                content: '已购入过引进的作品',
              },
              {
                id: 2414102,
                related: [],
                mutex: [],
                content: '听说过',
              },
              {
                id: 2414103,
                related: [],
                mutex: [],
                content: '没有听说过',
              },
            ],
          },
        ],
      ],
    },
    exQuestionnaire5: {
      id: 25,
      name: '额外问卷 - 社群相关/主办方附加',
      introduction: '该部分问卷涉及投票者对主办方了解的具体情况。投票者可以选择是否填写该问卷',
      questions: [
        [
          {
            id: 25011,
            type: 'Single',
            question: '请问您是否知道“THBWiki”？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2502501,
                related: [],
                mutex: [],
                content: '一直在使用',
              },
              {
                id: 2502502,
                related: [],
                mutex: [],
                content: '偶尔会使用',
              },
              {
                id: 2502503,
                related: [],
                mutex: [],
                content: '基本不使用',
              },
              {
                id: 2502504,
                related: [],
                mutex: [],
                content: '仅仅知道存在但是没有访问过',
              },
              {
                id: 2502505,
                related: [],
                mutex: [],
                content: '现在才知道它的存在',
              },
            ],
          },
        ],
        [
          {
            id: 25021,
            type: 'Single',
            question: '请问您是否知道VoileLabs的下属网站“PatchyVideo（帕琪站）”？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2502101,
                related: [25030],
                mutex: [],
                content: '一直在使用',
              },
              {
                id: 2502102,
                related: [25030],
                mutex: [],
                content: '偶尔会使用',
              },
              {
                id: 2502103,
                related: [25031],
                mutex: [],
                content: '基本不使用',
              },
              {
                id: 2502104,
                related: [25031],
                mutex: [],
                content: '仅仅知道存在但是没有访问过',
              },
              {
                id: 2502105,
                related: [25031],
                mutex: [],
                content: '现在才知道它的存在',
              },
            ],
          },
        ],
        [
          {
            id: 25030,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 25031,
            type: 'Single',
            question: '请问您是否了解视频索引站（如帕琪站）的具体功能的用途？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2503101,
                related: [],
                mutex: [],
                content: '了解并且在使用',
              },
              {
                id: 2503102,
                related: [],
                mutex: [],
                content: '了解但没有使用',
              },
              {
                id: 2503103,
                related: [],
                mutex: [],
                content: '不了解',
              },
            ],
          },
        ],
        [
          {
            id: 25041,
            type: 'Input',
            question: '您认为帕琪站可以或者应该提供哪些功能？（不限于视频方面）',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 25051,
            type: 'Single',
            question: '您平时是否会“主动”关注东方信息？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2505101,
                related: [],
                mutex: [],
                content: '会',
              },
              {
                id: 2505102,
                related: [],
                mutex: [],
                content: '不会，但是会被动从社交环境中获得信息',
              },
              {
                id: 2505103,
                related: [],
                mutex: [],
                content: '想主动关注，但是不知道从何关注',
              },
              {
                id: 2505104,
                related: [],
                mutex: [],
                content: '完全不想关注',
              },
            ],
          },
        ],
        [
          {
            id: 25061,
            type: 'Multiple',
            question: '您接触东方信息的渠道有哪些？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2506101,
                related: [],
                mutex: [],
                content: '视频网站（如B站）',
              },
              {
                id: 2506102,
                related: [],
                mutex: [],
                content: '即时通信工具（包括QQ、Discord）',
              },
              {
                id: 2506103,
                related: [],
                mutex: [],
                content: '贴吧论坛等主题社区',
              },
              {
                id: 2506104,
                related: [],
                mutex: [],
                content: '微博推特类网站',
              },
              {
                id: 2506105,
                related: [],
                mutex: [],
                content: '社交网络（如人人，FB，G+等）',
              },
              {
                id: 2506106,
                related: [],
                mutex: [],
                content: '现实生活（如学校社团）',
              },
              {
                id: 2506107,
                related: [],
                mutex: [],
                content: '其他途径',
              },
            ],
          },
        ],
        [
          {
            id: 25071,
            type: 'Multiple',
            question: '您“主动”关注的信息类型有哪些？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2507101,
                related: [],
                mutex: [],
                content: '东方官方情报（如新作发布、ZUN的动态等）',
              },
              {
                id: 2507102,
                related: [],
                mutex: [],
                content: '国内二次创作作品',
              },
              {
                id: 2507103,
                related: [],
                mutex: [],
                content: '日本/海外二次创作作品',
              },
              {
                id: 2507104,
                related: [],
                mutex: [],
                content: '东方社群内的实时话题/梗/Meme等',
              },
              {
                id: 2507105,
                related: [],
                mutex: [],
                content: '线下活动相关',
              },
              {
                id: 2507106,
                related: [],
                mutex: [],
                content: '其他',
              },
            ],
          },
        ],
        [
          {
            id: 25081,
            type: 'Multiple',
            question: '您平时被动接触到的信息类型有哪些？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2508101,
                related: [],
                mutex: [],
                content: '东方官方情报（如新作发布、ZUN的动态等）',
              },
              {
                id: 2508102,
                related: [],
                mutex: [],
                content: '国内二次创作作品',
              },
              {
                id: 2508103,
                related: [],
                mutex: [],
                content: '日本/海外二次创作作品',
              },
              {
                id: 2508104,
                related: [],
                mutex: [],
                content: '东方社群内的实时话题/梗/Meme等',
              },
              {
                id: 2508105,
                related: [],
                mutex: [],
                content: '线下活动相关',
              },
              {
                id: 2508106,
                related: [],
                mutex: [],
                content: '其他',
              },
            ],
          },
        ],
        [
          {
            id: 25091,
            type: 'Multiple',
            question: '您通过哪些账号或平台了解东方信息？',
            introduction: '',
            input: '',
            options: [
              {
                id: 2509101,
                related: [25100],
                mutex: [],
                content: 'Bilibili',
              },
              {
                id: 2509102,
                related: [25100],
                mutex: [],
                content: '微博',
              },
              {
                id: 2509103,
                related: [25100],
                mutex: [],
                content: '推特',
              },
              {
                id: 2509104,
                related: [25100],
                mutex: [],
                content: 'Niconico',
              },
              {
                id: 2509105,
                related: [25100],
                mutex: [],
                content: 'Youtube',
              },
              {
                id: 2509106,
                related: [25100],
                mutex: [],
                content: 'Pixiv',
              },
              {
                id: 2509107,
                related: [25100],
                mutex: [],
                content: '东方吧',
              },
              {
                id: 2509108,
                related: [25100],
                mutex: [],
                content: '喵玉殿论坛',
              },
              {
                id: 2509109,
                related: [25100],
                mutex: [],
                content: 'NGA/S1等综合论坛',
              },
              {
                id: 2509110,
                related: [25100],
                mutex: [],
                content: '东方活动群（如THO群）或社团群/作者个人群',
              },
              {
                id: 2509111,
                related: [25100],
                mutex: [],
                content: 'THBWiki微博/B站号',
              },
              {
                id: 2509112,
                related: [25100],
                mutex: [],
                content: '殇韵月风微博/B站号',
              },
              {
                id: 2509113,
                related: [25100],
                mutex: [],
                content: '囧仙B站号',
              },
              {
                id: 2509114,
                related: [25100],
                mutex: [],
                content: '魅知幻想之旅B站号',
              },
              {
                id: 2509115,
                related: [25100],
                mutex: [],
                content: '东游鉴B站号',
              },
              {
                id: 2509116,
                related: [25100],
                mutex: [],
                content: '幽紫kkB站号',
              },
              {
                id: 2509117,
                related: [25100],
                mutex: [],
                content: '轩缘无痕B站号',
              },
              {
                id: 2509118,
                related: [25100],
                mutex: [],
                content: '东方初心者讲座群',
              },
              {
                id: 2509119,
                related: [25100],
                mutex: [],
                content: '囧仙粉丝群',
              },
              {
                id: 2509120,
                related: [25101],
                mutex: [],
                content: '其他',
              },
            ],
          },
        ],
        [
          {
            id: 25100,
            type: 'Input',
            question: '被遗忘的问题 ～ Error Occured',
            introduction: '',
            input: '',
            options: [],
          },
          {
            id: 25101,
            type: 'Input',
            question: '除以上账号/平台外，您通过哪些账号/平台了解东方信息？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 25111,
            type: 'Input',
            question: '您对于国内现有的平台有何建议和看法？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 25121,
            type: 'Input',
            question: '您认为除了现有平台，还可以搭建什么样的平台来帮助创作者与观众？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
        [
          {
            id: 25131,
            type: 'Input',
            question: '您对于本次投票有何意见或建议呢？',
            introduction: '',
            input: '',
            options: [],
          },
        ],
      ],
    },
  },
}
