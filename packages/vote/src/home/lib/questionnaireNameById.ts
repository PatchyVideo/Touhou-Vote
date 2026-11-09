// Optional illustrations only; titles and descriptions come from the backend.
export const questionnaireDisplayByKey: Record<string, { image: string }> = {
  requiredQuestionnaire: {
    image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-%E5%85%AB%E4%BA%91%E7%B4%AB@100px.png',
  },
  optionalQuestionnaire1: {
    image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-ZUN@100px.png',
  },
  optionalQuestionnaire2: {
    image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-BigSight@100px.png',
  },
  exQuestionnaire1: {
    image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-%E7%A5%B8%E7%81%B5%E6%A2%A6@100px.png',
  },
  exQuestionnaire2: {
    image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-%E9%98%B4%E9%98%B3%E7%8E%89@100px.png',
  },
  exQuestionnaire3: {
    image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/THBWiki-LOGO-%E8%A7%92%E5%B7%9D%E4%B9%A6%E5%BA%97@100px.png',
  },
  exQuestionnaire4: {
    image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/%E6%82%94%E6%82%9F%E6%A3%92@100px.png',
  },
  exQuestionnaire5: {
    image: 'https://asset.lilywhite.cc/thvote/imgs/vote/home/Wiki%E6%97%A0%E5%AD%97@100px.png',
  },
}

export const categoryDisplay: Record<string, { name: string; desc: string }> = {
  main: { name: '主要问卷', desc: '您至少需要选择填写两个主要问卷' },
  extra: { name: '额外问卷', desc: '您至少需要选择填写一个额外问卷' },
}
