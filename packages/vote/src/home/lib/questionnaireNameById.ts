export const questionnaireNameById: Record<
  string,
  {
    name: string
    desc: string
    children: Record<
      string,
      {
        name: string
        desc: string
        image: string
      }
    >
  }
> = {
  mainQuestionnaire: {
    name: '主要问卷',
    desc: '您至少需要选择填写两个主要问卷',
    children: {
      requiredQuestionnaire: {
        name: '基础问卷',
        desc: '该问卷为必选问卷',
        image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-%E5%85%AB%E4%BA%91%E7%B4%AB@100px.png',
      },
      optionalQuestionnaire1: {
        name: '官方作品问卷',
        desc: '适合对官作感兴趣的人填写',
        image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-ZUN@100px.png',
      },
      optionalQuestionnaire2: {
        name: '二次创作问卷',
        desc: '适合对二创感兴趣的人填写',
        image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-BigSight@100px.png',
      },
    },
  },
  extraQuestionnaire: {
    name: '额外问卷',
    desc: '您至少需要选择填写一个额外问卷',
    children: {
      exQuestionnaire1: {
        name: '同人创作相关',
        desc: '适合同人作者填写',
        image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-%E7%A5%B8%E7%81%B5%E6%A2%A6@100px.png',
      },
      exQuestionnaire2: {
        name: '官作游戏相关',
        desc: '适合官作游戏玩家填写',
        image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-%E9%98%B4%E9%98%B3%E7%8E%89@100px.png',
      },
      exQuestionnaire3: {
        name: '展会与手游相关',
        desc: '适合展会游客或东方手游玩家填写',
        image:
          'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-%E8%A7%92%E5%B7%9D%E4%B9%A6%E5%BA%97@100px.png',
      },
      exQuestionnaire4: {
        name: '正版盗版相关',
        desc: '适合对官方与二创作品感兴趣的人填写',
        image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/%E6%82%94%E6%82%9F%E6%A3%92@100px.png',
      },
      exQuestionnaire5: {
        name: '社群相关/主办方附加',
        desc: '适合对东方相关信息感兴趣的人填写',
        image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/Wiki%E6%97%A0%E5%AD%97@100px.png',
      },
    },
  },
}
