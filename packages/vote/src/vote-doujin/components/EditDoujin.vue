<template>
  <transition name="editDoujin">
    <div
      v-if="open"
      class="baseBoxRoundedShadow fixed top-1/10 left-0 right-0 mx-auto w-19/20 max-w-105ch max-h-4/5 flex flex-col p-3 z-40 space-y-2"
    >
      <div class="flex justify-between">
        <div class="md:text-base xl:text-xl 2xl:text-2xl">编辑提名</div>
        <icon-uil-times class="text-xl xl:text-2xl 2xl:text-3xl cursor-pointer" @click="cancelEdit()"></icon-uil-times>
      </div>
      <div class="flex-grow overflow-y-auto p-2 flex flex-col gap-y-3">
        <div class="flex flex-col">
          <div class="flex justify-between items-center gap-x-3">
            <div class="whitespace-nowrap py-0.5"><strong>发布链接</strong></div>
            <input
              v-model="doujinUrl"
              class="inline-block h-full outline-none border-b border-gray-300 focus:border-accent-color-300 transition-colors w-full"
            />
            <button
              class="whitespace-nowrap px-1 py-0.5 text-xs lg:text-sm"
              :class="{ buttonDisabled: fetchLoading || !validUrlInvalid }"
              @click="!fetchLoading && validUrlInvalid && fetchMsg()"
            >
              <icon-uil-spinner-alt v-if="fetchLoading" class="animate-spin" />
              自动获取信息
            </button>
          </div>
          <ul class="text-xs 3xl:text-sm">
            <li>
              *<span ref="hintElUrlEmpty">必填项</span>，
              <span ref="hintElUrlMaxLength">最长 2048 个字符</span>
            </li>
            <li>
              *<span ref="hintElUrlInvalid">有效的链接仅支持以下网站</span
              >：Bilibili(仅限视频)、微博(仅限移动端链接)、THBWiki、PatchyVideo/THVideo(仅限视频和播放列表，支持<a
                class="underline"
                href="https://thvideo.tv/"
                target="_blank"
                >旧页面</a
              >和<a class="underline" href="https://platinum.vercel.app/" target="_blank">新页面</a
              >)、Twitter、YouTube、Pixiv、Nico静画/动画、Acfun、百度贴吧、Steam、dizzylab、DLsite
              <!-- 、Melonbooks -->
            </li>
            <li>
              *如果作品的发布地址在上述网站之外或并未在网络上发布，则请前往
              <a class="underline" href="https://thwiki.cc/" target="_blank">THBWiki</a>
              创建该作品的词条并将词条链接粘贴到此处
            </li>
            <li>
              *自动获取功能尚处于早期试用阶段，功能上仅供参考。THBWiki的链接如果遇到错误请尝试使用短链接（在词条页面的右上角）
            </li>
          </ul>
        </div>
        <div class="lg:flex lg:flex-row lg:gap-4">
          <div class="flex-1 flex flex-col gap-y-3">
            <div class="flex flex-col">
              <div class="flex justify-between items-center gap-x-3">
                <div class="whitespace-nowrap py-0.5">标题</div>
                <input
                  v-model="doujinTitle"
                  class="inline-block h-full outline-none border-b border-gray-300 focus:border-accent-color-300 transition-colors w-full"
                />
              </div>
              <ul class="text-xs text-gray-800 3xl:text-sm">
                <li>
                  *<span ref="hintElTitleEmpty">必填项</span>，
                  <span ref="hintElTitleMaxLength">最长 256 个字符</span>
                </li>
                <li>*请尽可能填写原名或较为通用的名称或译名，以方便计票</li>
              </ul>
            </div>
            <div class="flex flex-col">
              <div class="flex justify-between items-center gap-x-3">
                <div class="whitespace-nowrap py-0.5">作者</div>
                <input
                  v-model="doujinAuthor"
                  class="inline-block h-full outline-none border-b border-gray-300 focus:border-accent-color-300 transition-colors w-full"
                />
              </div>
              <ul class="text-xs text-gray-800 3xl:text-sm">
                <li>
                  *<span ref="hintElAuthorEmpty">必填项</span>，
                  <span ref="hintElAuthorMaxLength">最长 128 个字符</span>
                </li>
                <li>*请尽可能填写原名或较为通用的名称或译名，以方便计票。若是社团发布请尽量填写社团名。</li>
              </ul>
            </div>
            <div class="flex-grow flex flex-col">
              <div class="flex items-center gap-x-3">
                <div class="whitespace-nowrap py-0.5">作品类型</div>
                <div class="flex-grow">
                  <VoteSelect v-model:selected="doujinType" class="w-full" :item-list="doujintypesWithoutColor" />
                </div>
              </div>
              <ul class="text-xs 3xl:text-sm">
                <li>*<span ref="hintElTypeEmpty">必填项</span></li>
              </ul>
            </div>
          </div>
          <div class="flex-shrink-0 flex flex-row lg:flex-col flex-wrap justify-between">
            <div class="whitespace-nowrap space-y-0.5">
              <div>作品封面</div>
              <ul class="text-xs 3xl:text-sm">
                <li>*只能由爬虫自动获取</li>
                <li>*仅供用户参考，对提名无影响</li>
              </ul>
            </div>
            <div class="w-58">
              <div class="aspect-ratio-10/16 border rounded-xl">
                <picture class="h-full w-full object-contain">
                  <source :srcset="doujinImageUrl.replace(/^http:/, 'https:')" />
                  <img class="h-full w-full object-contain" :src="Doujin0.imageUrl" />
                </picture>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-y-1">
          <div>
            <div class="whitespace-nowrap">提名理由</div>
            <ul class="text-xs text-gray-800 3xl:text-sm">
              <li>*选填项，<span ref="hintElReasonMaxLength">最长 1024 个字符</span></li>
              <li>*如果写的很长或者很优秀，甚至有可能入选年度最感人推荐感言哦！</li>
            </ul>
          </div>
          <div>
            <textarea
              v-model="doujinReason"
              maxlength="1024"
              rows="8"
              class="inline-block outline-none border border-gray-300 focus:border-accent-color-300 transition-colors w-full p-1 rounded"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-between px-2">
        <div class="flex flex-row items-center py-2 cursor-pointer" @click="noticeOpen = true">
          <icon-uil-question-circle /><span class="<md:hidden">提名规则</span>
        </div>
        <div class="flex gap-x-4">
          <button
            v-if="props.index != doujinValid.length"
            class="px-5 py-1 bg-white text-accent-color-300 border"
            @click="deleteEdit()"
          >
            删除
          </button>
          <button class="px-5 py-1 bg-white text-accent-color-300 border" @click="cancelEdit()">取消</button>
          <button class="px-5 py-1" @click="comfirmEdit()">确定</button>
        </div>
      </div>
      <Transition name="mask">
        <div
          v-if="fetchLoading"
          class="absolute inset-0 rounded-xl flex justify-center backdrop-filter backdrop-blur-sm"
          @touchmove.stop.prevent
        >
          <div class="flex items-center text-accent-color-300 font-bold text-lg">
            <icon-uil-spinner-alt class="animate-spin" />
            少女祈祷中...
          </div>
        </div>
      </Transition>
    </div>
  </transition>
  <Mask v-model:open="open" :z-index="39" />

  <VoteMessageBox v-model:open="noticeOpen" title="提名规则">
    <div class="flex flex-col overflow-auto">
      <ul class="space-y-2 p-2 list-disc list-inside">
        <li>
          必须是符合上海爱丽丝幻乐团的
          <a
            class="text-gray-800 hover:text-blue-600 transition transition-colors underline"
            href="https://www.bilibili.com/read/cv6364137"
            target="_blank"
            ><label class="text-accent-color-300">东方Project使用规定</label></a
          >
          的东方Project二次创作作品。
        </li>
        <li>
          “最近三年的作品(2021/1/1 0:00:00 ~ 2024/1/1 00:00:00)”以作品本身的首次发布日期计算，不考虑是否完结的问题
        </li>
        <li>
          同一个作品在不同网站上发布或不同语言版本视为同一作品。提名的链接如指向无授权搬运或营销号盗用的发布，若能识别则计作对于原作品的提名，否则将不计票。考虑到有效性，建议使用原作者的发布地址进行提名。
        </li>
        <li>
          可能出现<label class="text-accent-color-300">版权问题、公序良俗争议或内容触犯法律</label>的作品的提名无效。
        </li>
        <li><label class="text-accent-color-300">R18</label> 作品的提名无效。</li>
        <li>
          单品和组合作品（如创作合集与其中的单品）、合作作品的单独发布（如游戏的OST和该游戏本身）均可视为不同的作品分别提名。
        </li>
        <li>
          请尽量避免提名作品的宣传或预告，除非该作品在网络上仅发布了宣传或预告。宣传和预告在计票时会被合并到作品本身。
        </li>
        <li>上述规则的最终解释权由THBWiki所有。</li>
      </ul>
      <button class="w-full py-2 flex items-center space-x-1 justify-center" @click="noticeOpen = false">
        <label>我知道了</label>
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useEventListener, useLocalStorage, useThrottle, useVModel } from '@vueuse/core'
import { Doujin, Doujin0, Doujin0NoImageUrl, doujinTypes } from '@/vote-doujin/lib/doujin'
import { doujinValid } from '@/vote-doujin/lib/doujinList'
import { doujins } from '@/vote-doujin/lib/voteData'
import VoteSelect from '@/common/components/VoteSelect.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'
import Mask from '@/common/components/Mask.vue'
import { popConfirmText, popMessageText } from '@/common/lib/popMessage'

const props = defineProps({
  open: {
    type: Boolean,
    requred: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits<{
  (event: 'update:open', value: Doujin): void
}>()
const open = useVModel(props, 'open', emit)

const confirmedNotice = useLocalStorage('confirmedDoujinEditNotice', false)
const noticeOpen = computed<boolean>({
  get() {
    return open.value && !confirmedNotice.value
  },
  set(value) {
    confirmedNotice.value = !value
  },
})
watch(open, (n, o) => {
  if (n && !o) {
    clearDoujinData()
  }
})

const doujinUrl = ref(doujins.value[props.index].url === Doujin0.url ? '' : doujins.value[props.index].url)
const doujinTitle = ref(doujins.value[props.index].title === Doujin0.title ? '' : doujins.value[props.index].title)
const doujinAuthor = ref(doujins.value[props.index].author === Doujin0.author ? '' : doujins.value[props.index].author)
const doujinReason = ref(doujins.value[props.index].reason === Doujin0.reason ? '' : doujins.value[props.index].reason)
const doujinImageUrl = ref(
  doujins.value[props.index].imageUrl === Doujin0.imageUrl ? Doujin0.imageUrl : doujins.value[props.index].imageUrl
)
const doujintypesWithoutColor = computed(() =>
  doujinTypes.map((item) => {
    return {
      name: item.name,
      value: item.value,
    }
  })
)
const doujinType = ref(
  doujintypesWithoutColor.value.find(
    (item) =>
      item.value ===
      (doujins.value[props.index].dojinType === Doujin0.dojinType
        ? Doujin0.dojinType
        : doujins.value[props.index].dojinType)
  ) || doujintypesWithoutColor.value[0]
)

function close(): void {
  open.value = false
}
function clearDoujinData(): void {
  doujinUrl.value = doujins.value[props.index].url === Doujin0.url ? '' : doujins.value[props.index].url
  doujinTitle.value = doujins.value[props.index].title === Doujin0.title ? '' : doujins.value[props.index].title
  doujinAuthor.value = doujins.value[props.index].author === Doujin0.author ? '' : doujins.value[props.index].author
  doujinReason.value = doujins.value[props.index].reason === Doujin0.reason ? '' : doujins.value[props.index].reason
  doujinType.value =
    doujintypesWithoutColor.value.find(
      (item) =>
        item.value ===
        (doujins.value[props.index].dojinType === Doujin0.dojinType
          ? Doujin0.dojinType
          : doujins.value[props.index].dojinType)
    ) || doujintypesWithoutColor.value[0]
  doujinImageUrl.value =
    doujins.value[props.index].imageUrl === Doujin0.imageUrl ? Doujin0.imageUrl : doujins.value[props.index].imageUrl
}

const fetchLoading = ref(false)
async function fetchMsg(): Promise<void> {
  fetchLoading.value = true
  await fetch('/v10-be/doujin/api', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      url: doujinUrl.value,
    }),
    credentials: 'include',
  })
    .then((data) => data.json())
    .then(async (res) => {
      if (res.status === 'ok' || res.status === 'warning') {
        if (res.status === 'warning' && !(await popConfirmText('检测到内容可能为非东方作品，确定继续吗？'))) return
        if (res.data.title) doujinTitle.value = res.data.title
        if (res.data.author_name[0]) doujinAuthor.value = res.data.author_name.join(' ')
        if (res.data.tname)
          doujinType.value =
            doujintypesWithoutColor.value.find((item) => item.value === res.data.tname) ||
            doujintypesWithoutColor.value[0]
        doujinImageUrl.value = res.data.cover || Doujin0NoImageUrl
      } else if (res.status === 'r18') {
        popMessageText('检测到r18作品，该票无效，请选择其他作品提名！')
        return
      } else if (res.status === 'apierr' && res.msg.match(/thbapierr: no result for/)) {
        popMessageText('THB词条解析失败，请尝试使用THB页面右上角的短链接')
      } else if (res.status === 'err' || res.status === 'parsererr' || res.status === 'apierr') {
        console.log(res.status, res.msg)
        doujinImageUrl.value = Doujin0NoImageUrl
        popMessageText('未找到可以获取的内容！')
      } else {
        console.log(res.status, res.msg)
        doujinImageUrl.value = Doujin0NoImageUrl
        popMessageText('未知错误' + (res.status === 'except' ? ': ' + res.msg : '!'))
      }
    })
    .catch((err) => {
      console.log(err)
      popMessageText('获取失败，请稍后再试！')
    })
  fetchLoading.value = false
}

// 夕渃 2023/12/25 20:15
// @Lurantis 其实你可以不用我搞了正则你还搞，你只要确保丢到我这边的是一个合法的url就行了
const universalSiteRegExp = new RegExp(
  '^((http|https):\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'
)
// const bilibiliRegExp = new RegExp(
//   '^(https:\\/\\/|http:\\/\\/)?(www\\.|m\\.)?(bilibili\\.com\\/video\\/([aA][vV][\\d]+|BV[a-zA-Z0-9]+)(\\?p=[\\d]+)?|b23\\.tv\\/([aA][vV][\\d]+|BV[a-zA-Z0-9]+)(\\?p=[\\d]+)?|b23\\.tv\\/[\\w\\d]+)'
// )
// const weiboRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?(weibo\\.com\\/[\\d]+\\/[a-zA-Z0-9])')
// const thbwikiRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?(thwiki\\.cc|thbwiki\\.cc)')
// const patchyvideoRegExp = new RegExp(
//   '^(https:\\/\\/)?(www\\.)?(patchyvideo\\.com\\/#\\/|thvideo\\.tv\\/#\\/)(video\\?id=[a-zA-Z0-9]+|listdetail\\?id=[a-zA-Z0-9]+)'
// )
// const platinumRegExp = new RegExp(
//   '^(https:\\/\\/)?(www\\.)?(platinum\\.vercel\\.app\\/)(video\\/|playlist\\/)[a-zA-Z0-9]+'
// )
// const twitterRegExp = new RegExp('^(https:\\/\\/)?(www\\.|mobile\\.)?twitter\\.com\\/[\\w]+\\/status\\/[\\d]+')
// const youtubeRegExp = new RegExp(
//   '^(https:\\/\\/(www\\.|m\\.)?youtube\\.com\\/(tv#\\/)?watch\\?v=[-\\w]+|https:\\/\\/youtu\\.be\\/(watch\\?v=[-\\w]+|[-\\w]+))'
// )
// const pixivRegExp = new RegExp(
//   '^(https:\\/\\/)?(www\\.)?pixiv\\.net\\/(artworks\\/[\\d]+|novel\\/(series\\/[\\d]+|show\\.php\\?id=[\\d]+))'
// )
// const nicovideoRegExp = new RegExp(
//   '^(https:\\/\\/|http:\\/\\/)?(www\\.|sp\\.|m\\.|seiga\\.)?(nicovideo\\.jp)(\\/watch\\/(s|n)m[\\d]+|nico\\.ms\\/(s|n)m[\\d]+)|(seiga\\/im[\\d])'
// )
// const acfunRegExp = new RegExp('^(https:\\/\\/|http:\\/\\/)?(www\\.|m\\.)?acfun\\.cn\\/v\\/[aA][cC][\\d]+')
// const tiebaRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?tieba\\.baidu\\.com\\/p\\/[\\d]+')
// const steamRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?store\\.steampowered\\.com\\/app\\/[\\d]+')
// const dizzylabRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?dizzylab\\.net\\/d\\/[a-zA-Z0-9-]+\\/')
// const dlsiteRegExp = new RegExp(
//   '^(https:\\/\\/)?(www\\.)?dlsite\\.com\\/home\\/work\\/=\\/product_id\\/[a-zA-Z0-9]+\\.html'
// )
// const melonbooksRegExp = new RegExp(
//   '^(https:\\/\\/)?(www\\.)?melonbooks.co.jp\\/detail\\/detail.php\\?product_id=[\\d]+'
// )
const hintError = ref(0)
function useValidation<T>(el: Ref<HTMLElement | null>, value: Ref<T>, valCb: (value: T) => boolean) {
  const throttled = useThrottle(value, 200, true, false)
  const isValid = computed(() => valCb(throttled.value))
  watch(el, (el) => {
    if (el) el.classList.add('inline-block', 'animate-animated', 'decoration-accent-color-300')
  })
  watch([el, isValid], ([el, isValid]) => {
    if (!el) return
    if (isValid) el.classList.remove('text-accent-color-300', 'underline')
    else el.classList.add('underline')
  })
  watch(hintError, () => {
    if (!el.value) return
    if (!isValid.value) el.value.classList.add('text-accent-color-300', 'animate-shakeX')
  })
  watch(open, (open) => {
    if (!el.value || open) return
    el.value.classList.remove('text-accent-color-300', 'animate-shakeX')
  })
  const onAnimationEnd = () => {
    el.value?.classList.remove('animate-shakeX')
  }
  useEventListener(el, 'animationend', onAnimationEnd)
  useEventListener(el, 'animationcancel', onAnimationEnd)
  return isValid
}
const hintElUrlEmpty = ref<HTMLElement | null>(null)
const validUrlEmpty = useValidation(hintElUrlEmpty, doujinUrl, (value) => value !== '')
const hintElUrlMaxLength = ref<HTMLElement | null>(null)
const validUrlMaxLength = useValidation(hintElUrlMaxLength, doujinUrl, (value) => value.length <= 2048)
const hintElUrlInvalid = ref<HTMLElement | null>(null)
const validUrlInvalid = useValidation(hintElUrlInvalid, doujinUrl, (value) =>
  [
    universalSiteRegExp,
    // bilibiliRegExp,
    // weiboRegExp,
    // thbwikiRegExp,
    // patchyvideoRegExp,
    // platinumRegExp,
    // twitterRegExp,
    // youtubeRegExp,
    // pixivRegExp,
    // nicovideoRegExp,
    // acfunRegExp,
    // tiebaRegExp,
    // steamRegExp,
    // dizzylabRegExp,
    // dlsiteRegExp,
    // melonbooksRegExp,
  ].some((reg) => reg.test(value))
)
const hintElTitleEmpty = ref<HTMLElement | null>(null)
const validTitleEmpty = useValidation(hintElTitleEmpty, doujinTitle, (value) => value !== '')
const hintElTitleMaxLength = ref<HTMLElement | null>(null)
const validTitleMaxLength = useValidation(hintElTitleMaxLength, doujinTitle, (value) => value.length <= 256)
const hintElAuthorEmpty = ref<HTMLElement | null>(null)
const validAuthorEmpty = useValidation(hintElAuthorEmpty, doujinAuthor, (value) => value !== '')
const hintElAuthorMaxLength = ref<HTMLElement | null>(null)
const validAuthorMaxLength = useValidation(hintElAuthorMaxLength, doujinAuthor, (value) => value.length <= 128)
const hintElTypeEmpty = ref<HTMLElement | null>(null)
const validTypeEmpty = useValidation(hintElTypeEmpty, doujinType, (value) => value.value !== Doujin0.dojinType)
const hintElReasonMaxLength = ref<HTMLElement | null>(null)
const validReasonMaxLength = useValidation(hintElReasonMaxLength, doujinReason, (value) => value.length <= 1024)
const isDoujinValid = computed(() =>
  [
    validUrlEmpty.value,
    validUrlMaxLength.value,
    validUrlInvalid.value,
    validTitleEmpty.value,
    validTitleMaxLength.value,
    validAuthorEmpty.value,
    validAuthorMaxLength.value,
    validTypeEmpty.value,
    validReasonMaxLength.value,
  ].every((v) => v)
)

function submitDoujinData(): void {
  const doujinData = new Doujin()
  doujinData.url = doujinUrl.value
  doujinData.title = doujinTitle.value
  doujinData.author = doujinAuthor.value
  doujinData.dojinType = doujinType.value.value
  doujinData.reason = doujinReason.value
  doujinData.imageUrl = doujinImageUrl.value
  doujins.value[props.index] = doujinData
}
async function deleteEdit(): Promise<void> {
  if (await popConfirmText('您想要删除该提名吗？')) {
    doujins.value.splice(props.index, 1)
    doujins.value.push(new Doujin())
    close()
  }
}
async function cancelEdit(): Promise<void> {
  if (await popConfirmText('您想要取消修改吗？')) {
    clearDoujinData()
    close()
  }
}
function comfirmEdit(): void {
  if (isDoujinValid.value) {
    submitDoujinData()
    close()
  } else {
    hintError.value++
  }
}
</script>
<style lang="postcss" scoped>
.editDoujin-enter-active,
.editDoujin-leave-active {
  @apply transition-all duration-200;
}

.editDoujin-enter-from,
.editDoujin-leave-to {
  @apply opacity-0;
}

.mask-enter-active,
.mask-leave-active {
  @apply transition-all duration-200;
}

.mask-enter-from,
.mask-leave-to {
  @apply bg-opacity-0;
}
</style>
