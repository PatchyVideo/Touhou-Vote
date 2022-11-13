<template>
  <div class="mx-1 my-3">
    <div class="mb-0 md:m-5 p-3 space-y-3 bg-white bg-opacity-80 rounded-t md:bg-opacity-0 md:rounded">
      <div class="flex items-end">
        <img
          src="https://upload.thwiki.cc/thumb/f/f7/THBWiki-LOGO-%E5%AE%87%E4%BD%90%E8%A7%81%E5%A0%87%E5%AD%90.png/100px-THBWiki-LOGO-%E5%AE%87%E4%BD%90%E8%A7%81%E5%A0%87%E5%AD%90.png"
          class="w-10 h-10 col-span-1 row-span-2 rounded"
        />
        <h2 class="text-4xl font-light">作品提名</h2>
        <span class="ml-3 text-xl">结果</span>
      </div>
      <div class="flex">
        <div class="text-xl">总票数：2250</div>
      </div>
    </div>

    <div class="md:m-5 px-3 py-1 bg-white bg-opacity-80 rounded-b md:bg-opacity-0 text-sm italic text-gray-700">
      *本页面为人气投票作品提名的评奖结果，提名的作品以票数作为名次判断标准，甄选评论没有名次<br />
      *提名的作品下的评论和甄选评论皆由中文东方人气投票组委会的主观评选<br />
      *中文东方人气投票组委会对本次结果保留最终解释权
    </div>

    <div class="mb-0 md:m-5 p-3 flex md:justify-around flex-wrap space-y-3 md:space-y-0">
      <!-- Doujin -->
      <div class="w-full md:w-2/5 p-3 flex flex-col rounded border-2 border-accent-300 space-y-3">
        <div class="text-2xl">提名作品前十名</div>
        <div v-for="(item, index) in DoujinData" :key="item.name" class="p-1 rounded border border-accent-600">
          <div class="flex items-center space-x-2">
            <div class="w-3/10 md:w-1/5 flex items-center rounded overflow-hidden">
              <img :src="item.pic" class="w-full" />
            </div>
            <div class="w-7/10 md:w-4/5">
              <div class="flex justify-between items-center">
                <div class="text-2xl md:text-3xl font-bold truncate" :title="item.name">{{ item.name }}</div>
                <div
                  class="min-w-10 h-10 flex items-center justify-center text-xl rounded-full font-semibold border-2 border-accent-300"
                  :class="{
                    'min-w-16 h-16 text-white bg-accent-600 rounded-full font-extrabold border-3': index === 0,
                    'min-w-14 h-14 text-white bg-accent-600 rounded-full font-extrabold border-3':
                      index === 1 || index === 2,
                  }"
                >
                  {{ (index < 3 ? 'No:' : '') + (index + 1) }}
                </div>
              </div>
              <div class="truncate">{{ '作者：' + item.author }}</div>
              <a :href="item.url" :title="item.url" target="_blank" class="truncate underline decoration-accent-600">{{
                '作品链接'
              }}</a>
            </div>
          </div>
          <div class="space-y-0.5 text-sm">
            <div v-for="(item2, index2) in item.reasons" :key="item2">
              <div class="font-medium">{{ '提名理由' + (index2 + 1) + '：' }}</div>
              <div class="whitespace-pre-wrap indent-8">{{ item2 }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Comment -->
      <div class="w-full md:w-2/5 p-3 flex flex-col rounded border-2 border-accent-600 space-y-3 md:border-accent-300">
        <div class="text-2xl">甄选评论</div>
        <div
          v-for="item in CommentData"
          :key="item.reason"
          class="p-1 rounded border border-accent-300 md:border-accent-600 space-y-2"
        >
          <div class="text-xl font-bold whitespace-pre-wrap">
            {{ '"' + item.reason + '"' }}
          </div>
          <div>{{ '所提名作品：' + item.work + ' by ' + item.author }}</div>
          <a :href="item.url" :title="item.url" target="_blank" class="truncate underline decoration-accent-600">{{
            '作品链接'
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NProgress from 'nprogress'
if (NProgress.isStarted()) NProgress.done()

setSiteTitle('作品提名 - 第⑩回 中文东方人气投票')

const DoujinData = [
  {
    name: '东方夜雀食堂',
    author: '二色幽紫蝶',
    url: 'https://www.bilibili.com/video/BV1eM4y1u7ep',
    pic: 'https://upload.thwiki.cc/c/ca/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A801.webp',
    desc: '',
    reasons: [
      '某985计算机专业，每天都为保研名额卷到头破血流，以前玩的魂类游戏和竟技类都逐漸没有精力了。今年有幸遇到了这个游戏，每天刚好可以用睡觉之前的时间玩一会，在夜雀食堂走一轮，真的很温馨。游戏中的时间过了三个月，现实生活中也过了三个月，感谢它让我可以在繁忙的生活中找到能让我慢下来的慰藉！',
      '夜雀之歌，耳之盛宴也。\n        夜雀之肴，嘴之盛宴也。\n        夜雀所行之境，目之盛宴也。\n        夜雀所历之事，心之盛宴也。\n        夜幕降临，红灯燃起。\n        客之涌动，雀之匆忙，\n        汗如雨下，心花盛放，\n        夜雀虽小，梦酒幻乡。',
      '站在你面前的是，2021年度国产独立单机游戏销量排行第十八名、2021年度东方国产同人游戏销量王者、让游戏区知名老人神奇陆夫人连续多日直播体验的优质同人作品、国产东方同人作八个月达成十万销量的奇迹、模拟经营类游戏的佳作、东方同人游戏的领跑者、连续九个月好评如潮的高质量传教专用作品——东方夜雀食堂，堂堂登场！',
      '很不错的一款东方经营类同人游戏，里面夹杂了复古像素风格+RPG兼做饭经营玩法+有意思的对话互动构成了如此多种多样的游戏世界，里面不仅仅还能看到东方原作各个区域的完整场景，对于一设也是贴合的十分巧妙，加上改编后却应景的背景音乐，属实是当之无愧的同人佳作（顺便也为小碎骨提升了不少人气）。',
    ],
  },
  {
    name: '3D永夜抄',
    author: 'minusT',
    url: 'https://www.youtube.com/watch?v=430ejbSn-5k',
    pic: 'https://upload.thwiki.cc/d/d2/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A802.webp',
    desc: '',
    reasons: [
      '如果说zun是将他头脑中的幻想世界变成游戏，在乎面的stg中呈现的话。那么minusT就是将zun的平面内容立体化，以一种更直观、更震撼的方式展现出来。超高的技术力，加上和原作弹嘉演出的高契合度，简直是至福。每当我回味这一部作品，或者是这一系列3d东方时，我总能感受到满屏的弹幕（视频中的也好，大家发送的也好）传递出的热情，一种同人文化独有的，创作者和爱好者的热情。一这么想，我就想就着手边的电脑开上一把原作。这种作者与爱好者间的良性互动，是每一次minusT作品给我带来的特殊又难得的体验。',
      '东方的灵魂就在于弹幕，而3d东方系列就是我心目中把弹幕要素的美学展现的最好的系列作品。 有时候真的很感激自己能喜欢东方，井且看到东方的同人作者们满怀热情制作的作品。',
      '整个系列都是无与伦比的作品，堪称3D东方动画顶峰的一块顽石，本次作品也更是再上一层楼，当之无愧的年度最佳。',
      '优秀的制作，精良的画面，灵活的动作，即使是一般通过也应该-能感受到弹幕游戏的魅力，让人感觉 啊！如果现实中真的有弹幕游戏应该也就是这样的吧。切实地体会到了弹幕的优美之处',
    ],
  },
  {
    name: '【半年制作量】东方mmd：永远亭争夺战（pv风 踩点 特效向）',
    author: '博丽x海苔',
    url: 'https://www.bilibili.com/video/BV1QA411t76e',
    pic: 'https://upload.thwiki.cc/0/03/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A803.webp',
    desc: '',
    reasons: [
      '疫情期间能看到这种高质量的MMD真是惊喜，符卡的还原非常绚丽，人物动作也十分流畅，每个角色都很灵动，或可爱或帅气，高级弹幕的配合也说明了其他的观众也是如我一样激动，希望能被更多的东方众或MMD爱好者看到。',
      '近年最优质的mmd之一：出色的特效；视频星短却有紧湊而又丰富的剧情；与视频背景音乐具有较为优秀的契合度。',
      '动作分鏡转场道染全都极为优秀，音乐与画面配合燃爆。中间红白组配合，阴阳玉炸出中村方块＋黑白闪，让人难以想象这是MMD能做出的效果（虽然好像有一小部分确实是手绘）',
      '电影级分镜设计，充满张力的酷炫动作，毫无违和感的梗植入，各种程度上都是绝世好活。还有什么能够阻挡！',
    ],
  },
  {
    name: '【2022·东方华灯宴】',
    author: '东方华灯宴制作组',
    url: 'https://www.bilibili.com/video/BV16q4y1h7xX',
    pic: 'https://upload.thwiki.cc/b/ba/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A804.webp',
    desc: '',
    reasons: [
      '应该是许多东方众每年过年时节必看的视频吧，感觉不需要额外说明了。里面的每个节目单独拿出来都非常优秀的作品，能感觉到作作者对东方倾注的熱情。',
      '舞台，一个所有创作者渴望的舞台；演出，一场座无虛席的演出。前者带来后者，后者成就前者。\n        作为创作者和爱好者，我们都湯望参与其中，无论自己会在哪个位置。台上努力付出的人，台下尽情享受的人，想必都能得到欢乐吧。',
      '不看华灯宴没法过年！',
    ],
  },
  {
    name: '【2021·东方华灯宴】',
    author: '东方华灯宴制作组',
    url: 'https://www.bilibili.com/video/BV1Sy4y1Y773/',
    pic: 'https://upload.thwiki.cc/8/88/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A805.webp',
    desc: '',
    reasons: [
      '华灯宴的一次小高潮，各种大小作品都能单独拿出來，可國可点。 音MAD、同人动画、音声都能看出国内同人创作者的一腔热诚与极高的技术力，穿插的主线剧情也表现出了熊怪作为主催对同人创作的一定思考。希望每年的华灯宴都能继续精彩！',
      '个人觉得最好的一次华灯宴，最喜欢的一届华灯宴！',
      '看过的第一届华灯宴，盛大的制1作，豪华的阵容，优秀的节目，无不给我留下深刻的印象，跟着许多人一起观看华灯宴也是头一次，无数同好同一时间为同一件事，同一个作品而感动快乐，这不正是东方的魅力之一吗？或许多年以后的自己依然会怀念井想念当年的那个快乐的人吧',
    ],
  },
  {
    name: '【东方MMD】事件：月城冲突',
    author: '博丽x海苔',
    url: 'https://www.bilibili.com/video/BV1qU4y1X7QD',
    pic: 'https://upload.thwiki.cc/8/88/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A806.webp',
    desc: '',
    reasons: [
      '神一般的动画，让人很难相信这是MMD。后半铃仙和纯狐的对战部分背景2D的特效真的特別惊艳，和前景了渲2结合得非常得体，我觉得甚至有可可能超过了大部分日本动画中对3D的运用。太强了。',
      '相比于其他作品风格独特，画面冲击感强，合我的口味。',
      '一个字，酷！分镜，踩点，动作全都十分精致。',
      '质量超高的MMD，整体风格大改，动作真实细节丰富，画面运镜渲染都几乎无可挑剔，打斗超帅。',
    ],
  },
  {
    name: '【東方projectPV】三妖精SAY YA!!! ',
    author: '森罗万象',
    url: 'https://www.bilibili.com/video/BV1rv411x7Jz',
    pic: 'https://upload.thwiki.cc/d/d0/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A807.webp',
    desc: '',
    reasons: [
      '森罗万象是我个人最喜爱的东方同人音乐社团，而我尤其喜欢这一首。原曲《春之冰精》 的痕迹很弱，整首曲子几乎是全新的曲调，PV也高廈概括了三月精的全剧情。尤其是高潮妖精们齐声高歌时，那种由萌系一跃而充满力量的跨感十分动人。即使生来弱小，也不放弃挑战强者的决心，这是妖精们的共识，也是东方人的情感所在。，幻想仍存，希望不灭。',
      '三月精！！！如此精良的制作又怎能不让人为之投票了，加上pv三月精的可爱度便暴增，激增，狂增，萌萌萌萌萌！如此可爱的pv，还有什么可以阳挡，tm的还有什么可以阳挡啊！！！',
      '〝新三月精漫画的问世，本就是一件令人幸福的事。一直以来东方创作者们就面临着平衡幻想与现实的难题，而三月精作为连载时间最长的官方漫画，自然面临过各种困难，但zUN和比良坂真琴最终将其顺利地完结。这首 《三妖精SAYYA!LD》 便是森罗万象为纪念三月精完结而作的曲子。',
    ],
  },
  {
    name: '东方长篇评书《畜生侦探》',
    author: '米斯特克里斯',
    url: 'https://www.bilibili.com/video/BV1UF411i7PL',
    pic: 'https://upload.thwiki.cc/5/52/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A808.webp',
    desc: '',
    reasons: [
      '醒木一方口一张，道尽古今说幻想。\n        灵长园内龙初现，鬼谋秘计椟中藏。\n        沉龙深潭浮白骨，义杰大殿请宴忙。\n        老龙威严义犹在，姊妹成仇竟相狀。\n        劲牙作乱夠掣电，忠勇护主看老狼。\n        两兽相斗双俱伤，强欲谋起暗难防。\n        蛇眸明识敌友辨，鼠辈跳梁傲语诳。\n        鬼杰孤直锁铁键，狼牙参差相颉颜。\n        段段出彩字字精，句句揪心声声亮。\n        畜生侦探才气溢，槐南茶馆评书强！',
      '难得一见的评书类东方作品，在众多二次创作中不失为一个相当有特色的作品。用语言描绘出吉吊与往时的畜生界，虽然没有画面，胜似有画面。情节曲折奇特，让人回味无穷。此时的畜生界，井不是现今的三大组织，而且义杰。刚翼，强欲三大组织，可以推测出，义杰成为了鬼态，正照应了其中“人不义，则为鬼”，而刚翼与强欲成为了刚欲同盟，劲牙帮成为了劲牙组。有着帅气，智慧与些许稚嫩的吉吊八千慧，在这部评书中磨砺、成长，最终成为了鬼杰组组长，而彌夠早鬼和饕餐尤魔也会作为相当重要的人物，跟随着剧情发展。',
      '剧情上环环相扣张弛有度，每一集留下的悬念和细节都是十分吸引着咱，而且老话说是“听书听扣” 畜生侦探这部作品里，每一回目留的这个“扣”，可是死死的吊佳咱的胃口，极其完美地完成了他应有的使命啊，只能说是让人想一直听下去，不舍得离开。',
    ],
  },
  {
    name: '有神论',
    author: 'CureLancy! & 草石虫',
    url: 'https://www.bilibili.com/video/BV1Ve411s79n',
    pic: 'https://upload.thwiki.cc/0/00/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A809.webp',
    desc: '',
    reasons: [
      '近年来非常制作非常精良的配音手书作品，剧情和叙事都非常的优秀，整个手书全程配音是加分项。整体结构完整，用阿呼的视角来讲述整个结界组的故事也非常的有趣。',
      '相当出色完整的手书作品，不停留于肤浅，也不会过分追求高质量以至手显得超出东方的范睛，用着能让人感到熱悉来切的人设背景讲出一个独特有趣的故事，私以为这是对所谓二创的一个很好的诠释。',
      '超越原作的故事设计，现实感极强的情感交互表达，完美的作画，脚本，视频制作，配音\n        《有神论》打破了我对东方project故事范国狭窄的刻板印象，让我愿意钻研官作，一遍遍打stg，来认识手书中出现的每一个角色。',
    ],
  },
  {
    name: '【安科】烈海王似乎打算在幻想乡挑战强者们的样子',
    author: '王子2326',
    url: 'https://tieba.baidu.com/p/6710222599',
    pic: 'https://upload.thwiki.cc/9/95/2021%E4%B8%AD%E6%96%87%E4%B8%9C%E6%96%B9%E4%BA%BA%E6%B0%94%E6%8A%95%E7%A5%A8-%E6%8F%90%E5%90%8D%E9%83%A8%E9%97%A810.jpeg',
    desc: '',
    reasons: [
      '当时我一直都是一个健康作息人：11点以前必须上床，而且要在11点半之前睡着。但是在当时看烈幻入看到12点半都是常态。而在这其中最印象深刻的一次，就是动物灵异变的最后一场战斗。以前以为是玩笑话的无呼吸连打F5，当时真真正正地实现了。因为真的想看到这一篇章，看这个故事究竟是怎样走向结局的。当时一楼一楼饥渴地看着，就想看到故事一直以来的所有发展如何在此结尾，跌宕起伏的剧情，瞬息万变的骰子，一步一步地把无人知晓的命运舞合完全地展现出來。最后一回合股出的大失败，我直楼很很地種了一下桌子；但接下来 “贫穷神的加护发动。发动的那个瞬间，我差点尖叫出来；决战之后的故事会和緊会，我笑得合不拢嘴；最后的 “堂堂完结！以及 “物底结束”，我的眼眶不知不觉中湿润了。',
      '这个作品真的带给了我太多太多，无论剧情的跌容起伏，还是之后线下因此收获的友谊，都是我无可替换的宝物。真的，真的非常感谢参与故事的各位…谢谢…除了谢谢"以外我再也找不到任何的话来表达了。',
      '让我找回了以前在贴吧观看二次创作的感动的作品。很难想象是这两年间出现的作品。\n        安科本身强烈的随机性带来的跌宕起伏，配上作者王子海皇强的吓人的圆剧情能力和在正经与欢乐之间平衡的怡到好处的文风，再加上馆长海皇等无数人充满热情的三次创作和刃牙吧众人天才般的吐槽，最重要的是大家对同人创作的无限热情，这一切组成了难以复现的互联网盛况。伴随着贴吧的衰微，刃牙吧的没落，也许未来的人也很难有机会看到这样的热潮了。',
    ],
  },
]
const CommentData = [
  {
    reason:
      '回到2010年4月，日本一群东方同人爱好者在niconico 上发起了“TOHO CLOCK” 企划，基于网页时钟插件Uniglock，每5秒钟切一个梗，每1分钟换一段曲。每一个东方爱好者，无论创作水平高低，都可以做出属于自己的 “五秒东方》。',
    work: 'TOHO MMD CLOCK - Again -',
    author: '众企划参加者',
    url: ' https://www.bilibili.com/video/BV1EJ411b7f3',
  },
  {
    reason:
      '12年过去，即使原企划早已停摆，这一创作形式仍然不断延续。爱好者们共同创作出的作品，不仅体现了不同人眼中的 “—千个幻想乡，更照应着TOHO CLOCK的主题：萃集同人创作的美好与乐趣，捕捉幻想乡每分每秒的精彩。',
    work: 'TOHO MMD CLOCK - Again -',
    author: '众企划参加者',
    url: ' https://www.bilibili.com/video/BV1EJ411b7f3',
  },
  {
    reason:
      '也许这一视频播放量默默无间，我仍然在传教时把它放在了首要推荐中。我时常在想东方project带给新人的魅力究竟会是什么，这个视频给了答案：一起创作，一起欢笑，为大家的幻想乡千杯，为共同的美好献上祈祷。',
    work: 'TOHO MMD CLOCK - Again -',
    author: '众企划参加者',
    url: ' https://www.bilibili.com/video/BV1EJ411b7f3',
  },
  {
    reason:
      'I LOVE 村纱\n        推荐理由：只用画面平移在十分钟内讲一个好故事！\n        东方杀时间系列的质量和口碑是有目共睹的。近年来这一系列发布的作品中，我选择提名这一部。首先剧情丰富且严密，采用了静叶工作和船长送货的双线剧情，开头埋下的伏笔之后也均有回收。其次笑料的数量与质量也维持了高水准，皮丝的美国树给我笑翻了。此外虽然画面简洁，却包含了不少细节，例如开头香霖堂里的各种货物，穰子每天换花样的晚饭，以及十分潦草的第四天的涂色 “进度条”（说明当时静叶快撑不住了w）。仅仅采用平移画面，在十分钟内将一个故事讲得如此之好，足以看出作者的用心程度。杀时间第32话，以及这个系列的其他同样优秀的作品，在此推荐给各位同好了！',
    work: '东方杀时间32',
    author: 'しぶちゃ',
    url: 'https://www.bilibili.com/video/BV1vF411B7nF',
  },
  {
    reason:
      '完全手绘动画！这还用得着说含金量吗，满满的都是作者的熱情！在我死之前让我看见了结珠传的道中对话剧情动画化，很是感激(笑），因为特别满足所以提名了',
    work: '【东方同人动画】绀珠传六面道中',
    author: '我爱cyb',
    url: 'https://www.bilibili.com/video/BV15P4y1M781',
  },
  {
    reason: '画面配合着音乐，让人切身感受到纯狐出场时的震撼！',
    work: '【东方同人动画】绀珠传六面道中',
    author: '我爱cyb',
    url: 'https://www.bilibili.com/video/BV15P4y1M781',
  },
  {
    reason: '惠子老师的手书作品。画风非常可爱，情节也相当幽默，人物和一设比较接近。重要的是废神厨/神奈子厨狂喜！',
    work: '【东方手书】信仰绝不可能低于零！',
    author: 'keiko_惠子',
    url: 'https://www.bilibili.com/video/BV1UC4y1b7eG',
  },
  {
    reason:
      '本手书的作者描绘了幻想乡守矢家及其它角色的短篇小故事集，用类似四格的叙事方式展现了守矢一家三口有趣温馨又生草的日常，加之作者柔和可爱的画风，更是锦上添花地使各人物更加贴合其在故事中的形象。',
    work: '【东方手书】信仰绝不可能低于零！',
    author: 'keiko_惠子',
    url: 'https://www.bilibili.com/video/BV1UC4y1b7eG',
  },
  {
    reason:
      '绝对算得上是优质作品，通过美宵的视角在对话中就建立了一个庞大的赛博朋克东方世界观，适当的留白和伏笔让人浮想联翩。幻想乡已不再是当年的桃源，妖怪已无力反抗人类，这样的幻想乡固然令人痛心，但这濒临崩溃的幻想乡依旧吸引着我，明知不会有好结局，却仍想看下去。如果up能做下去的话，会是不亚于无限螺旅的神作。可惜的是，无论多么优秀的东方二创，都难逃冷门的命运(苦笑)如此看来，酒香还是怕巷子深，无论如何浓郁的酒香在角落飘荡，也只有少数人会循香上门',
    work: '「赛博东方酒家」',
    author: '凌晨三点的罪袋',
    url: 'https://www.bilibili.com/video/BV1dA41157js',
  },
]
</script>

<route lang="yaml">
meta:
  navid: doujin
</route>
