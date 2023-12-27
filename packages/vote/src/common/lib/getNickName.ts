import { characterList } from '@touhou-vote/shared/data/character'
import type { Character } from '@touhou-vote/shared/data/character'

const NickNameData =
  '原创角色:*yuanchuang:*Original:*オリジナル*博丽灵梦:*博麗霊夢:*はくれいれいむ:*Hakurei Reimu:*红白:*博丽霊梦#博丽灵梦*雾雨魔理沙:*霧雨魔理沙:*きりさめまりさ:*Kirisame Marisa:*黑白#雾雨魔理沙*秘封俱乐部:*密封:*hifuu club#宇佐见莲子，{{赫恩}}#宇佐见莲子#{{赫恩}}*蕾米莉亚·斯卡蕾特:*蕾米莉亚 · 斯卡蕾特:*レミリア · スカーレット:*remiria sukaaretto:*Remilia Scarlet:*大小姐:*蕾咪#{{蕾米莉亚}}*芙兰朵露·斯卡蕾特:*芙兰朵露 · 斯卡蕾特:*フランドール · スカーレット:*furandooru sukaaretto:*Flandre Scarlet:*二小姐:*二妹#{{芙兰朵露}}*西行寺幽幽子:*西行寺幽々子:*さいぎょうじゆゆこ:*Saigyouji Yuyuko:*UUZ#西行寺幽幽子*八云紫:*八雲紫:*やくもゆかり:*yakumo yukari:*Yukari Yakumo:*紫妈:*8#八云紫*东风谷早苗:*東風谷早苗:*こちやさなえ:*Kochiya Sanae:*早喵#东风谷早苗*古明地姐妹:*古明地:*こめいじ:*Komeiji#古明地觉，古明地恋#古明地觉#古明地恋*帕秋莉·诺蕾姬:*帕秋莉 · 诺蕾姬:*パチュリー · ノーレッジ:*pachurii noorejji:*Patchouli Knowledge:*姆Q:*帕琪:*图书#{{帕秋莉}}*宇佐见莲子:*宇佐見蓮子:*うさみれんこ:*Usami Renko#宇佐见莲子*玛艾露贝莉·赫恩:*玛艾露贝莉 · 赫恩:*梅莉:*マエリベリー · ハーン:*メリー:*maeriberii haan:*merii:*Maribel Hearn:*Merry#{{赫恩}}*露米娅:*ルーミア:*ruumia:*Rumia:*10:*露米亚#露米娅*大妖精:*だいようせい:*Daiyousei:*大酱#大妖精*琪露诺:*チルノ:*chiruno:*Cirno:*9:*Baka:*笨蛋#琪露诺*红美铃:*紅美鈴:*ホンメイリン:*hon meirin:*Hoan Meirin:*中国:*红师傅:*Hong Meirin#红美铃*小恶魔:*小悪魔:*リートルデビッル:*こあくま:*riitoru debirru:*Little Devil:*Koakuma#小恶魔*十六夜咲夜:*いざよいさくや:*Izayoi Sakuya:*PAD长:*16#十六夜咲夜*斯卡蕾特姐妹:*Scarlet:*スカーレット:*sukaaretto#{{蕾米莉亚}}，{{芙兰朵露}}#{{蕾米莉亚}}#{{芙兰朵露}}*蕾蒂·霍瓦特洛克:*蕾蒂 · 霍瓦特洛克:*レティ · ホワイトロック:*reti howaitorokku:*Letty Whiterock:*9妈#{{蕾蒂}}*橙:*チェン:*Chen:*八云橙:*八雲橙:*Yakumo Chen:*8#橙*八云家:*Yakumo:*やくも:*8#八云紫，八云蓝，橙*爱丽丝·玛格特洛依德:*爱丽丝 · 玛格特洛依德:*アリス · マーガトロイド:*arisu maagatoroido:*Alice Margatroid:*小爱:*威震天:*爱丽丝 · 玛格特罗依德:*爱丽丝 · 马格特洛伊德:*爱丽丝 · 马格特罗伊德:*爱丽丝 · 马格特罗依德:*爱丽丝 · 马格特洛依德:*爱丽丝 · 玛格特罗伊德:*爱丽丝 · 玛格特洛伊德#{{爱丽丝}}*上海人偶:*上海人形:*Shanghai Doll:*Shanghai#上海人偶*莉莉霍瓦特:*リリーホワイト:*ririihowaito:*LilyWhite:*莉莉白:*白莉莉:*莉莉怀特:*黑莉莉:*莉莉黑#{{Lily}}*普莉兹姆利巴三姐妹:*虹川三姐妹:*プリズムリバー:*purizumuribaa:*Prismriver:*骚灵三姐妹#{{露娜萨}}，{{梅露兰}}，{{莉莉卡}}#{{露娜萨}}#{{梅露兰}}#{{莉莉卡}}*露娜萨·普莉兹姆利巴:*露娜萨 · 普莉兹姆利巴:*露娜萨 · 虹川:*ルナサ · プリズムリバー:*runasa purizumuribaa:*Lunasa Prismriver:*露娜姐#{{露娜萨}}*梅露兰·普莉兹姆利巴:*梅露兰 · 普莉兹姆利巴:*梅露兰 · 虹川:*メルラン · プリズムリバー:*meruran purizumuribaa:*Merlin Prismriver#{{梅露兰}}*莉莉卡·普莉兹姆利巴:*莉莉卡 · 普莉兹姆利巴:*莉莉卡 · 虹川:*リリカ · プリズムリバー:*ririka purizumuribaa:*Lyrica Prismriver#{{莉莉卡}}*魂魄妖梦:*魂魄妖夢:*こんぱくようむ:*Konpaku Youmu#魂魄妖梦*八云蓝:*八雲藍:*やくもらん:*Yakumo Ran:*素裸天狐:*8#八云蓝*魂魄妖忌:*こんぱくようき:*konpaku youki:*Youki Konpaku#魂魄妖忌*蕾拉·普莉兹姆利巴:*蕾拉 · 普莉兹姆利巴:*レイラ · プリズムリバー:*reira purizumuribaa:*Leira Prismriver#{{蕾拉}}*伊吹萃香:*いぶきすいか:*Ibuki Suika:*西瓜#伊吹萃香*莉格露·奈特巴格:*莉格露 · 奈特巴格:*リグル · ナイトバグ:*riguru naitobagu:*Wriggle Nightbug:*虫子#{{莉格露}}*米斯蒂娅·萝蕾拉:*米斯蒂娅 · 萝蕾拉:*ミスティア · ローレライ:*misutia roorerai:*Mystia Lorelei:*小碎骨:*老板娘:*夜雀#{{米斯蒂娅}}*上白泽慧音:*上白沢慧音:*かみしらさわけいね:*kamishirasawa keine:*Keine Kamishirasawa:*老师#上白泽慧音*因幡帝:*因幡てゐ:*因幡天为:*いなばてゐ:*inaba tewi:*Tewi Inaba:*黑兔子#{{tewi}}*铃仙·优昙华院·因幡:*铃仙 · 优昙华院 · 因幡:*铃仙 · 优昙华院 · 稻叶:*鈴仙 · 優曇華院 · イナバ:*鈴仙 · U · イナバ:*れいせん · うどんげいん · イナバ:*Reisen Udongein Inaba:*受兔:*铃仙:*铃仙 · U · 因幡#{{铃仙}}*八意永琳:*やごころえいりん:*yagokoro eirin:*Eirin Yagokoro:*师匠#八意永琳*蓬莱山辉夜:*蓬莱山輝夜:*ほうらいさんかぐや:*Houraisan Kaguya:*NEET姬#蓬莱山辉夜*藤原妹红:*藤原妹紅:*ふじわらのもこう:*fujiwara no mokou:*Huziwara no Mokou:*爷们红:*不死鸟#藤原妹红*射命丸文:*しゃめいまるあや:*shameimaru aya:*Syameimaru Aya:*文文:*Ayaya#射命丸文*梅蒂欣·梅兰可莉:*梅蒂欣 · 梅兰可莉:*メディスン · メランコリー:*medisun merankorii:*Medicine Melancholy:*毒人偶#{{梅蒂欣}}*风见幽香:*風見幽香:*かざみゆうか:*kazami yuuka:*Kazami Yuka:*花妈#风见幽香*小野塚小町:*おのづかこまち:*Onozuka Komachi:*乳町:*死神#小野塚小町*四季映姬·夜摩仙那度:*四季映姬 · 亚玛萨那度:*四季映姫 · ヤマザナドゥ:*しきえいき · やまざなどぅ:*shikieiki yamazanadu:*Shikieiki Yamaxanadu:*阎魔:*阎萝王:*四季映姬·亚玛萨那度:*四季映姫 · 亚玛萨那度:*四季映姬·夜摩仙那度:*四季映姬 · 夜摩仙那度#{{四季映姬}}*秋静叶:*秋静葉:*あきしずは:*aki shizuha:*Aki Sizuha:*不人气姐妹#秋静叶*秋穰子:*秋穣子:*あきみのりこ:*Aki Minoriko#秋穰子*键山雏:*鍵山雛:*かぎやまひな:*kagiyama hina:*Hina Kagiyama:*转转:*厄神#键山雏*河城荷取:*河城にとり:*河城似鸟:*かわしろにとり:*kawashiro nitori:*Kawasiro Nitori:*绿坝娘:*河城鸟取#河城荷取*犬走椛:*いぬばしりもみじ:*inubashiri momiji:*Inubashiri Momizi:*椛椛:*磨米机#犬走椛*八坂神奈子:*やさかかなこ:*Yasaka Kanako#八坂神奈子*洩矢诹访子:*洩矢諏訪子:*もりやすわこ:*Moriya Suwako:*青蛙子:*泄矢诹访子#洩矢诹访子*永江衣玖:*ながえいく:*Nagae Iku:*19:*龙宫使:*皇带鱼#永江衣玖*比那名居天子:*ひななゐてんし:*Hinanawi Tenshi:*M子#比那名居天子*琪斯美:*キスメ:*Kisume:*小桶:*琪丝美#{{琪斯美}}*黑谷山女:*黒谷ヤマメ:*くろだにやまめ:*Kurodani Yamame#黑谷山女*水桥帕露西:*水橋パルスィ:*みずはしパルスィ:*mizuhashi parusui:*Mizuhashi Parsee:*桥姬#{{水桥}}*星熊勇仪:*星熊勇儀:*ほしぐまゆうぎ:*hoshiguma yuugi:*Hoshiguma Yugi:*红有三#星熊勇仪*古明地觉:*古明地悟:*古明地さとり:*こめいじさとり:*Komeiji Satori:*觉觉:*小五:*5#古明地觉*火焰猫燐:*火焔猫燐:*かえんびょうりん:*Kaenbyou Rin:*猫车:*阿燐#火焰猫燐*灵乌路空:*霊烏路空:*れいうじうつほ:*Reiuji Utsuho:*阿空:*呆头空#灵乌路空*古明地恋:*古明地こいし:*こめいじこいし:*Komeiji Koishi:*恋恋:*小石:*514#古明地恋*娜兹玲:*ナズーリン:*nazuurin:*Nazrin:*老鼠:*纳兹琳:*娜兹琳#{{Naz}}*多多良小伞:*多々良小傘:*たたらこがさ:*Tatara Kogasa:*小伞#多多良小伞*云居一轮:*雲居一輪:*くもいいちりん:*Kumoi Ichirin#云居一轮*云山:*雲山:*うんざん:*Unzan#云山*村纱水蜜:*村紗水蜜:*むらさみなみつ:*Murasa Minamitsu:*船长:*Captain#村纱水蜜*寅丸星:*とらまるしょう:*Toramaru Shou:*老虎#寅丸星*圣白莲:*聖白蓮:*ひじりびゃくれん:*hijiri byakuren:*Hiziri Byakuren:*莲妈:*摩托车#圣白莲*封兽鵺:*封獣ぬえ:*ほうじゅうぬえ:*Houjuu Nue#封兽鵺*命莲:*命蓮:*みょうれん:*Myouren#命莲*姬海棠果:*姫海棠はたて:*ひめかいどうはたて:*Himekaidou Hatate:*姬海棠羽立:*姬海棠极#{{姬海棠}}*幽谷响子:*幽谷響子:*かそだにきょうこ:*Kasodani Kyouko#幽谷响子*宫古芳香:*宮古芳香:*みやこよしか:*Miyako Yoshika:*僵尸#宫古芳香*霍青娥:*青娥娘娘:*青娥娘々:*かくせいが:*せいがにゃんにゃん:*Seiga NyanNyan:*Kaku Seiga#霍青娥*苏我屠自古:*蘇我屠自古:*そがのとじこ:*soga no tojiko:*Soga no Toziko:*大根:*萝卜#苏我屠自古*物部布都:*もののべのふと:*Mononobe no Futo#物部布都*丰聪耳神子:*豊聡耳神子:*とよさとみみのみこ:*Toyosatomimi no Miko:*二婶子#丰聪耳神子*二岩猯藏:*二ッ岩マミゾウ:*ふたついわまみぞう:*futatsuiwa mamizou:*Hutatsuiwa Mamizou:*大狸子#{{二岩}}*秦心:*秦こころ:*はたのこころ:*Hata no Kokoro#秦心*若鹭姬:*わかさぎ姫:*わかさぎひめ:*Wakasagihime:*若鹭姫#若鹭姬*赤蛮奇:*せきばんき:*Sekibanki:*7#赤蛮奇*今泉影狼:*いまいずみかげろう:*Imaizumi Kagerou#今泉影狼*九十九弁弁:*九十九弁々:*つくもべんべん:*Tsukumo Benben:*998#九十九弁弁*九十九八桥:*九十九八橋:*つくもやつはし:*Tsukumo Yatsuhashi:*998#九十九八桥*鬼人正邪:*きじんせいじゃ:*Kijin Seija#鬼人正邪*少名针妙丸:*少名針妙丸:*すくなしんみょうまる:*Sukuna Shinmyoumaru:*小碗#少名针妙丸*堀川雷鼓:*ほりかわらいこ:*Horikawa Raiko#堀川雷鼓*宇佐见堇子:*宇佐見菫子:*うさみすみれこ:*Usami Sumireko:*会长:*宇佐美堇子#宇佐见堇子*绿巨人:*緑の巨人:*みどりのきょじん:*Little Green Men*阿菊:*お菊:*おきく:*お菊さん:*おきくさん:*Okiku-san*八尺大人:*八尺さま:*はっしゃくさま:*Hasshaku-sama*彭祖:*ほうそ:*Houso*黄帝:*こうてい*尼西号:*ネッシー:*ねっしー:*Nessie*清兰:*清蘭:*セイラン:*Seiran:*青兰#清兰*铃瑚:*鈴瑚:*りんご:*Ringo#铃瑚*哆来咪·苏伊特:*哆来咪 · 苏伊特:*ドレミー · スイート:*doremii suiito:*Doremy Sweet:*123#{{哆来咪}}*稀神探女:*稀神サグメ:*きしんさぐめ:*kishin sagume:*Kisin Sagume#稀神探女*克劳恩皮丝:*クラウンピース:*kuraunpiisu:*Clownpiece:*美国妖精#{{克劳恩}}*纯狐:*純狐:*じゅんこ:*Junko:*老佛爷#纯狐*赫卡提亚·拉碧斯拉祖利:*赫卡提亚 · 拉碧斯拉祖利:*ヘカーティア · ラピスラズリ:*hekaatia rapisurazuri:*Hecatia Lapislazuli#{{赫卡提亚}}*依神女苑:*よりがみじょおん:*Yorigami Jyoon#依神女苑*依神紫苑:*よりがみしおん:*Yorigami Shion#依神紫苑*爱塔妮缇拉尔瓦:*エタニティラルバ:*etanitiraruba:*Etanity Larva:*大扑棱蛾子:*Etarnity Larva#{{爱塔}}*坂田合欢:*坂田ネムノ:*さかたねむの:*Sakata Nemuno:*坂田合欢野:*坂田合欢乃#坂田合欢*高丽野阿吽:*高麗野あうん:*こまのあうん:*komano aun:*Komano Aunn:*石狮子#高丽野阿吽*矢田寺成美:*やたでらなるみ:*Yatadera Narumi#矢田寺成美*尔子田里乃:*爾子田里乃:*にしださとの:*Nishida Satono#尔子田里乃*丁礼田舞:*ていれいだまい:*Teireida Mai#丁礼田舞*摩多罗隐岐奈:*摩多羅隠岐奈:*またらおきな:*Matara Okina:*摩托罗拉#摩多罗隐岐奈*戎璎花:*戎瓔花:*えびすえいか:*えびすようか:*Ebisu Eika:*Ebisu Youka:*水母#戎璎花*牛崎润美:*牛崎潤美:*うしざきうるみ:*Ushizaki Urumi:*牛#牛崎润美*庭渡久侘歌:*庭渡久侘歌:*うしざきうるみ:*Niwatari Kutaka:*鸡#庭渡久侘歌*吉吊八千慧:*吉弔八千慧:*Kitcho Yachie:*きっちょうやちえ#吉吊八千慧*杖刀偶磨弓:*杖刀偶磨弓:*じょうとうぐうまゆみ:*Joutougu Mayumi#杖刀偶磨弓*埴安神袿姬:*埴安神袿姫:*はにやすしんけいき:*Haniyasushin Keiki#埴安神袿姬*骊驹早鬼:*驪駒早鬼:*くろこまさき:*Kurokoma Saki#骊驹早鬼*饕餮尤魔:*饕餮尤魔:*とうてつゆうま:*Toutetsu Yuma#饕餮尤魔*豪德寺三花:*豪徳寺ミケ:*ごうとくじみけ:*Goutokuzi Mike:*招财猫#豪德寺三花*山城高岭:*山城たかね:*やましろたかね:*Yamashiro Takane#山城高岭*驹草山如:*駒草山如:*こまくささんにょ:*Komakusa Sannyo:*駒草太夫:*こまくさ だゆう:*Komakusa Dayuu:*华子姐#驹草山如*玉造魅须丸:*玉造魅須丸:*たまつくりみすまる:*Tamatsukuri Misumaru#玉造魅须丸*菅牧典:*菅牧典:*くだまきつかさ:*Kudamaki Tsukasa#菅牧典*饭纲丸龙:*飯綱丸龍:*いいずなまるめぐむ:*Iizunamaru Megumu:*大天狗#饭纲丸龙*天弓千亦:*天弓千亦:*てんきゅうちまた:*Tenkyu Chimata#天弓千亦*姬虫百百世:*姫虫百々世:*ひめむしももよ:*Himemushi Momoyo:*大蜈蚣#姬虫百百世*孙美天:*孫美天:*そんびてん:*Son Biten#孙美天*三头慧之子:*三頭慧ノ子:*みつがしらえのこ:*Mitsugashira Enoko#{{三头}}*天火人血枪:*天火人ちやり:*テンカジンちやり:*Tenkajin Chiyari#{{天火人}}*豫母都日狭美:*豫母都日狭美:*よもつひさみ:*Yomotsu Hisami#豫母都日狭美*日白残无:*日白残無:*にっぱくざんむ:*Nippaku Zanmu#日白残无*森近霖之助:*もりちかりんのすけ:*Morichika Rinnosuke:*乡长#森近霖之助*朱鹭子:*朱鷺子ときこ:*Tokiko:*无名的读书妖怪#朱鹭子*光之三妖精:*3:*三月精#{{桑尼}}，{{露娜}}，{{斯塔}}#{{桑尼}}#{{露娜}}#{{斯塔}}*桑尼米尔克:*サニーミルク:*saniimiruku:*Sunny Milk:*光明牛奶#{{桑尼}}*露娜切露德:*ルナチャイルド:*runachairudo:*Luna Child:*露娜茶#{{露娜}}*斯塔萨菲雅:*スターサファイア:*sutaasafaia:*Star Sapphire#{{斯塔}}*绵月丰姬:*綿月豊姫:*わたつきのとよひめ:*Watatsuki no Toyohime#绵月丰姬*绵月依姬:*綿月依姫:*わたつきのよりひめ:*Watatsuki no Yorihime#绵月依姬*铃仙（二号）:*レイセン:*Reisen:*铃仙二号#铃仙二号*稗田阿求:*ひえだのあきゅう:*Hieda no Akyuu:*阿加莎克里斯Q#稗田阿求*茨木华扇:*茨华仙:*茨木華扇:*茨華仙:*いばらきかせん:*いばらかせん:*Ibarakasen:*Ibaraki Kasen:*包子仙#茨木华扇*本居小铃:*本居小鈴:*もとおりこすず:*Motoori Kosuzu:*防撞桶:*作死铃#本居小铃*奥野田美宵:*奥野田美宵:*おくのだみよい:*Okunoda Miyoi:*鲸鱼#奥野田美宵*博丽灵梦（旧作角色）:*博麗霊夢:*はくれいれいむ:*Hakurei Reimu:*红白:*博丽霊梦#博丽灵梦（旧作角色）*雾雨魔理沙（旧作角色）:*霧雨魔理沙:*きりさめまりさ:*Kirisame Marisa:*黑白#雾雨魔理沙（旧作角色）*神玉:*しんぎょく:*shingyoku:*SinGyoku#神玉*魅魔:*みま:*Mima#魅魔*幽幻魔眼:*ゆうげんまがん:*yuugenmagan:*YuugenMagan:*幽玄魔眼#幽幻魔眼*依莉斯:*エリス:*えりす:*elis:*Elis#依莉斯*萨丽爱尔:*サリエル:*さりえる:*sariel:*Sariel#萨丽爱尔*菊理:*きくり:*Kikuri:*硬币:*菊里#菊理*矜羯罗:*矜羯羅:*こんがら:*Konngara#矜羯罗*玄爷:*玄爺:*げんじい:*Genjii#玄爷*里香:*りか:*Rika:*坦克#里香*明罗:*明羅:*めいら:*Meira#明罗*爱莲:*エレン:*eren:*Ellen#爱莲*苏格拉底:*ソクラテス:*そくらてす:*Socrates#苏格拉底*小兔姬:*小兎姫:*ことひめ:*Kotohime#小兔姬*卡娜·安娜贝拉尔:*卡娜 · 安娜贝拉尔:*カナ · アナベラル:*kana anaberaru:*Kana Anaberal#卡娜·安娜贝拉尔*朝仓理香子:*朝倉理香子:*あさくらりかこ:*asakura rikako:*Rikako Asakura#朝仓理香子*北白河千百合:*北白河ちゆり:*きたしらかわちゆり:*kitashirakawa chiyuri:*Chiyuri Kitashirakawa:*折凳#北白河千百合*冈崎梦美:*岡崎夢美:*おかざきゆめみ:*okazaki yumemi:*Yumemi Okazaki:*教授#冈崎梦美*留琴:*る～こと:*ruukoto:*Ru~koto#留琴*玛○奇:*ま○ち:*mamaruchi:*Ma maru chi:*玛玛露奇:*玛露奇:*玛bi奇#玛○奇*咪咪号:*ミミちゃん:*みみｄちゃん:*Mimi-chan#咪咪号留琴*奥莲姬:*オレンジ:*orenji:*Orange:*橘子#奥莲姬*胡桃:*くるみ:*Kurumi#胡桃*艾丽:*エリー:*erii:*Elly:*苹果#艾丽*幽香（旧作角色）:*ゆうか:*yuuka:*Yuka#幽香*梦月:*夢月:*むげつ:*mugetsu:*Mugetu#梦月*幻月:*げんげつ:*gengetsu:*Gengetu#幻月*萨拉:*サラ:*Sara#萨拉*露易兹:*ルイズ:*ruizu:*Luize#露易兹*爱丽丝（旧作角色）:*アリス:*arisu:*Alice:*萝莉丝#爱丽丝（旧作角色）*雪:*ユキ:*Yuki#雪*舞:*マイ:*Mai#舞*梦子:*夢子:*ゆめこ:*Yumeko#梦子*神绮:*神綺:*しんき:*Shinki:*绮妈#神绮*缪斯:*ミューズ:*Muse#缪斯*VIVIT#VIVIT*蓬莱人形C63版碟面少女:*蓬莱人形ジャケットイラストの娘:*ほうらいにんぎょうじゃけっといらすとのむすめ:*DiPP jacket girl#蓬莱人形C63版碟面少女*蓬莱人形C62版碟面少女:*蓬莱人形レーベルイラストの娘:*ほうらいにんぎょうれえべるいらすとのむすめ:*DiPP label girl#蓬莱人形C62版碟面少女*冴月麟:*さつきりん:*さえつきりん:*さえづきりん:*satsukirin:*saetsukirin:*saezukirin#冴月麟'
const splitRegex = /(?<!:)\*(?!:)/

const NickNameArray: string[] = NickNameData.split(splitRegex)

// 格式：每一个子数组的第一个元素是简中译名，第二个元素是繁中译名，第三个元素是日文假名，第四个元素是罗马拼音，第五个元素（可能有）是英文名，再往后都是别称
function getNickNameArrayInEachCharacter(): string[][] {
  const NickNameArrayInEachCharacter: string[][] = []

  for (const item of NickNameArray) {
    let NickNameOfOneCharacter = item.split(':*')
    // 删除#后面的内容
    NickNameOfOneCharacter = NickNameOfOneCharacter.map((item) => item.replace(/#.*/, ''))
    NickNameArrayInEachCharacter.push(NickNameOfOneCharacter)
  }

  return NickNameArrayInEachCharacter
}

// 单独兼容的别名
const hifuu = ['秘封', '密封', 'hifuu']
const labelzi = [
  '蓬莱人形C62版碟面少女',
  '蓬莱人形レーベルイラストの娘',
  'ほうらいにんぎょうれえべるいらすとのむすめ',
  'DiPP label girl',
]
const jiakezi = [
  '蓬莱人形C63版碟面少女',
  '蓬莱人形ジャケットイラストの娘',
  'ほうらいにんぎょうじゃけっといらすとのむすめ',
  'DiPP jacket girl',
]

export function importNickName(): Character[] {
  const characterListCopy = [...characterList]
  const NickNameArrayInEachCharacter = getNickNameArrayInEachCharacter()
  for (const item of characterListCopy) {
    for (const item2 of NickNameArrayInEachCharacter) {
      if (item.name === item2[0]) {
        item.altnames = [...new Set([...item2, ...item.altnames])]
        // 删除简中译名
        item.altnames.splice(0, 1)
      }
    }
    // 加入单独兼容的别名
    if (item.name === '宇佐见莲子' || item.name === '玛艾露贝莉·赫恩') {
      item.altnames = [...item.altnames, ...hifuu]
    }
    if (item.name === '夹克子') {
      item.altnames = [...item.altnames, ...jiakezi]
    }
    if (item.name === 'Label子') {
      item.altnames = [...item.altnames, ...labelzi]
    }
  }
  return characterListCopy
}
