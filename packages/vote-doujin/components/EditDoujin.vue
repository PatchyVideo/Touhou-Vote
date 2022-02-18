<template>
  <transition name="editDoujin">
    <div
      v-if="open"
      class="fixed top-1/10 left-0 right-0 max-h-4/5 flex flex-col p-3 z-40 space-y-2 bg-white rounded w-19/20 mx-auto md:w-2/3 xl:w-1/2 3xl:w-1/4"
    >
      <div class="flex justify-between">
        <div class="md:text-base xl:text-xl 2xl:text-2xl">编辑提名</div>
        <icon-uil-times class="text-xl xl:text-2xl 2xl:text-3xl cursor-pointer" @click="cancelEdit()"></icon-uil-times>
      </div>
      <div class="flex-grow overflow-y-auto p-2 flex flex-col gap-y-3">
        <div class="flex flex-col">
          <div
            class="flex justify-between items-center gap-x-3"
            :class="{ 'animate-animated animate-shakeY': urlError }"
          >
            <div class="whitespace-nowrap py-0.5">链接</div>
            <input
              v-model="doujinUrl"
              class="inline-block h-full outline-none border-b border-gray-300 focus:border-accent-color-400 transition-colors w-full"
            />
          </div>
          <ul class="text-xs text-gray-800">
            <li>
              *<label :class="{ 'text-accent-color-600': invaildUrl }">必填项</label>，
              <label :class="{ 'text-accent-color-600': maxLengthUrl }">最长 2048 个字符</label>
            </li>
            <li>
              *有效的链接仅能包括以下网站：Bilibili(仅限视频)、微博、THBWiki、PatchyVideo/THVideo(仅限视频和播放列表，支持<a
                class="text-gray-800 hover:text-blue-600 transition transition-colors underline"
                href="https://thvideo.tv/"
                target="_blank"
                >旧页面</a
              >和<a
                class="text-gray-800 hover:text-blue-600 transition transition-colors underline"
                href="https://platinum.vercel.app/"
                target="_blank"
                >新页面</a
              >)、Twitter、YouTube、Pixiv、Nico静画/动画、Acfun、百度贴吧
            </li>
            <li>
              *如果在上述网站之外或无特定网站，请前往
              <a
                class="text-gray-800 hover:text-blue-600 transition transition-colors underline"
                href="https://thwiki.cc/"
                target="_blank"
                >THBWiki</a
              >
              创建词条并将词条链接粘贴到此处
            </li>
          </ul>
        </div>
        <div class="flex flex-col">
          <div
            class="flex justify-between items-center gap-x-3"
            :class="{ 'animate-animated animate-shakeY': titleError }"
          >
            <div class="whitespace-nowrap py-0.5">标题</div>
            <input
              v-model="doujinTitle"
              class="inline-block h-full outline-none border-b border-gray-300 focus:border-accent-color-400 transition-colors w-full"
            />
          </div>
          <ul class="text-xs text-gray-800">
            <li>
              *<label :class="{ 'text-accent-color-600': invaildTitle }">必填项</label>，
              <label :class="{ 'text-accent-color-600': maxLengthTitle }">最长 256 个字符</label>
            </li>
            <li>*请尽可能填写原名或较为通用的译名</li>
          </ul>
        </div>
        <div class="flex flex-col">
          <div
            class="flex justify-between items-center gap-x-3"
            :class="{ 'animate-animated animate-shakeY': authorError }"
          >
            <div class="whitespace-nowrap py-0.5">作者</div>
            <input
              v-model="doujinAuthor"
              class="inline-block h-full outline-none border-b border-gray-300 focus:border-accent-color-400 transition-colors w-full"
            />
          </div>
          <ul class="text-xs text-gray-800">
            <li>
              *<label :class="{ 'text-accent-color-600': invaildAuthor }">必填项</label>，
              <label :class="{ 'text-accent-color-600': maxLengthAuthor }">最长 128 个字符</label>
            </li>
            <li>*请尽可能填写原名或较为通用的译名</li>
          </ul>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-x-3" :class="{ 'animate-animated animate-shakeY': doujinTypeError }">
            <div class="whitespace-nowrap py-0.5">作品类型</div>
            <div class="flex-grow">
              <VoteSelect class="w-full" v-model:selected="doujinType" :item-list="doujintypesWithoutColor" />
            </div>
          </div>
          <ul class="text-xs text-gray-800">
            <li>*<label :class="{ 'text-accent-color-600': invaildDoujinType }">必填项</label></li>
          </ul>
        </div>
        <div class="flex flex-col gap-y-1" :class="{ 'animate-animated animate-shakeY': reasonError }">
          <div>
            <div class="whitespace-nowrap">提名理由</div>
            <ul class="text-xs text-gray-800">
              <li>*选填项，<label :class="{ 'text-accent-color-600': maxLengthReason }">最长 1024 个字符</label></li>
              <li>*如果写的很长或者很优秀，甚至有可能入选年度最感人推荐感言哦！</li>
            </ul>
          </div>
          <div>
            <textarea
              maxlength="1024"
              rows="8"
              v-model="doujinReason"
              class="inline-block outline-none border border-gray-300 focus:border-accent-color-400 transition-colors w-full p-1 rounded"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-between px-2">
        <div class="flex flex-row items-center py-2 cursor-pointer" @click="noticeOpen = true">
          <icon-uil-question-circle /><span class="<md:hidden">提名规则</span>
        </div>
        <div class="flex gap-x-4">
          <button v-if="props.index != doujinValid.length" class="px-5 py-1 rounded border" @click="deleteEdit()">
            删除
          </button>
          <button class="px-5 py-1 rounded border" @click="cancelEdit()">取消</button>
          <button class="px-5 py-1 rounded text-white bg-accent-color-600" @click="comfirmEdit()">确定</button>
        </div>
      </div>
    </div>
  </transition>
  <Transition name="mask">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-20 z-39" @touchmove.stop.prevent></div>
  </Transition>
  <VoteMessageBox v-model:open="noticeOpen" title="提名规则">
    <div class="flex flex-col overflow-auto">
      <ul class="space-y-2 p-2 list-disc list-inside">
        <li>“最近三年的作品(2019/1/1 0:00:00 ~ 2022/1/1 0:00:00)”以发布日期计算，不考虑是否完结的问题</li>
        <li>同一个作品在不同网站上发布视为同一作品，其中提名的链接如指向营销号盗用的作品，则不计票</li>
        <li>
          可能出现<label class="text-accent-color-600">版权问题或争议话题</label>的 IP
          联合创作作品（如创价x东方）的提名无效
        </li>
        <li><label class="text-accent-color-600">R18</label> 作品的提名无效</li>
        <li>单品和组合作品（如同人游戏的 OST 和该同人游戏本身）视为不同的作品</li>
      </ul>
      <button
        class="w-full py-2 rounded text text-white bg-accent-color-600 flex items-center space-x-1 justify-center"
        @click="noticeOpen = false"
      >
        <label>我知道了</label>
      </button>
    </div>
  </VoteMessageBox>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useLocalStorage, useVModel } from '@vueuse/core'
import { Doujin, Doujin0, doujinTypes } from '@/vote-doujin/lib/doujin'
import { doujinValid } from '@/vote-doujin/lib/doujinList'
import { doujins, setVoteDataDoujins } from '@/vote-doujin/lib/voteData'
import VoteSelect from '@/common/components/VoteSelect.vue'
import VoteMessageBox from '@/common/components/VoteMessageBox.vue'

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
      (doujins.value[props.index].reason === Doujin0.reason ? Doujin0.dojinType : doujins.value[props.index].dojinType)
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
        (doujins.value[props.index].reason === Doujin0.reason
          ? Doujin0.dojinType
          : doujins.value[props.index].dojinType)
    ) || doujintypesWithoutColor.value[0]
}

const bilibiliRegExp = new RegExp(
  '^(https:\\/\\/|http:\\/\\/)?(www\\.|m\\.)?(bilibili\\.com\\/video\\/([aA][vV][\\d]+|BV[a-zA-Z0-9]+)(\\?p=[\\d]+)?|b23\\.tv\\/([aA][vV][\\d]+|BV[a-zA-Z0-9]+)(\\?p=[\\d]+)?|b23.tv\\/[\\w\\d]+)'
)
const weiboRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?(weibo.com\\/[\\d]+\\/[a-zA-Z0-9])')
const thbwikiRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?(thwiki\\.cc|thbwiki\\.cc)')
const patchyvideoRegExp = new RegExp(
  '^(https:\\/\\/)?(www\\.)?(patchyvideo.com\\/#\\/|thvideo.tv\\/#\\/)(video\\?id=[a-zA-Z0-9]+|listdetail\\?id=[a-zA-Z0-9]+)'
)
const platinumRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?(platinum.vercel.app\\/)(video\\/|playlist\\/)[a-zA-Z0-9]+')
const twitterRegExp = new RegExp('^(https:\\/\\/)?(www\\.|mobile\\.)?twitter\\.com\\/[\\w]+\\/status\\/[\\d]+')
const youtubeRegExp = new RegExp(
  '^(https:\\/\\/(www\\.|m\\.)?youtube\\.com\\/(tv#\\/)?watch\\?v=[-\\w]+|https:\\/\\/youtu\\.be\\/(watch\\?v=[-\\w]+|[-\\w]+))'
)
const pixivRegExp = new RegExp(
  '^(https:\\/\\/)?(www\\.)?pixiv.net\\/(artworks\\/[\\d]+|novel\\/(series\\/[\\d]+|show.php\\?id=[\\d]+))'
)
const nicovideoRegExp = new RegExp(
  '^(https:\\/\\/|http:\\/\\/)?(www\\.|sp\\.|m\\.)?(nicovideo\\.jp\\/watch\\/(s|n)m[\\d]+|nico\\.ms\\/(s|n)m[\\d]+)'
)
const acfunRegExp = new RegExp('^(https:\\/\\/|http:\\/\\/)?(www\\.|m\\.)?acfun\\.cn\\/v\\/[aA][cC][\\d]+')
const tiebaRegExp = new RegExp('^(https:\\/\\/)?(www\\.)?tieba.baidu.com\\/p\\/[\\d]+')
const invaildUrl = ref(false)
const maxLengthUrl = ref(false)
const invaildTitle = ref(false)
const maxLengthTitle = ref(false)
const invaildAuthor = ref(false)
const maxLengthAuthor = ref(false)
const invaildDoujinType = ref(false)
const maxLengthReason = ref(false)
const urlError = ref(false)
const titleError = ref(false)
const authorError = ref(false)
const doujinTypeError = ref(false)
const reasonError = ref(false)
function checkDoujinData(): boolean {
  let vaild = true
  invaildUrl.value = false
  maxLengthUrl.value = false
  invaildTitle.value = false
  maxLengthTitle.value = false
  invaildAuthor.value = false
  maxLengthAuthor.value = false
  invaildDoujinType.value = false
  maxLengthReason.value = false
  if (
    !(
      bilibiliRegExp.test(doujinUrl.value) ||
      weiboRegExp.test(doujinUrl.value) ||
      thbwikiRegExp.test(doujinUrl.value) ||
      patchyvideoRegExp.test(doujinUrl.value) ||
      platinumRegExp.test(doujinUrl.value) ||
      twitterRegExp.test(doujinUrl.value) ||
      youtubeRegExp.test(doujinUrl.value) ||
      pixivRegExp.test(doujinUrl.value) ||
      nicovideoRegExp.test(doujinUrl.value) ||
      acfunRegExp.test(doujinUrl.value) ||
      tiebaRegExp.test(doujinUrl.value)
    )
  ) {
    // alert('请输入有效的链接！')
    invaildUrl.value = true
    urlError.value = true
    setTimeout(() => (urlError.value = false), 500)
    vaild = false
  } else if (doujinUrl.value.length > 2048) {
    // alert('链接长度超过最大值！')
    maxLengthUrl.value = true
    urlError.value = true
    setTimeout(() => (urlError.value = false), 500)
    vaild = false
  } else if (doujinTitle.value === '') {
    // alert('请输入标题！')
    invaildTitle.value = true
    titleError.value = true
    setTimeout(() => (titleError.value = false), 500)
    vaild = false
  } else if (doujinTitle.value.length > 256) {
    // alert('标题长度超过最大值！')
    maxLengthTitle.value = true
    titleError.value = true
    setTimeout(() => (titleError.value = false), 500)
    vaild = false
  } else if (doujinAuthor.value === '') {
    // alert('请输入作者名！')
    invaildAuthor.value = true
    authorError.value = true
    setTimeout(() => (authorError.value = false), 500)
    vaild = false
  } else if (doujinAuthor.value.length > 128) {
    // alert('作者名长度超过最大值！')
    maxLengthAuthor.value = true
    authorError.value = true
    setTimeout(() => (authorError.value = false), 500)
    vaild = false
  } else if (doujinType.value.value === Doujin0.dojinType) {
    // alert('请选择作品类型！')
    invaildDoujinType.value = true
    doujinTypeError.value = true
    setTimeout(() => (doujinTypeError.value = false), 500)
    vaild = false
  } else if (doujinReason.value.length > 1024) {
    // alert('提名理由长度超过最大值！')
    maxLengthReason.value = true
    reasonError.value = true
    setTimeout(() => (reasonError.value = false), 500)
    vaild = false
  }
  return vaild
}
function submitDoujinData(): void {
  const doujinData = new Doujin()
  doujinData.url = doujinUrl.value
  doujinData.title = doujinTitle.value
  doujinData.author = doujinAuthor.value
  doujinData.dojinType = doujinType.value.value
  doujinData.reason = doujinReason.value
  doujins.value[props.index] = doujinData
}
function deleteEdit(): void {
  if (confirm('你确定要删除该提名吗？')) {
    doujins.value.splice(props.index, 1)
    doujins.value.push(new Doujin())
    setVoteDataDoujins()
    close()
  }
}
function cancelEdit(): void {
  if (confirm('你确定要取消修改吗？')) {
    clearDoujinData()
    close()
  }
}
function comfirmEdit(): void {
  if (checkDoujinData()) {
    submitDoujinData()
    setVoteDataDoujins()
    close()
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
