<template>
  <transition name="editDoujin">
    <div
      v-if="open"
      class="fixed top-1/10 left-0 right-0 h-4/5 flex flex-col p-3 z-40 space-y-2 bg-white rounded w-19/20 mx-auto md:w-1/2 3xl:w-1/4"
    >
      <div class="flex justify-between pb-4">
        <div class="md:text-base xl:text-xl 2xl:text-2xl">编辑提名</div>
        <icon-uil-times class="cursor-pointer" @click="cancelEdit()"></icon-uil-times>
      </div>
      <div class="flex-grow overflow-y-auto p-2 flex flex-col space-y-3">
        <div class="flex flex-col">
          <div class="flex justify-between items-center space-x-3">
            <div class="whitespace-nowrap py-0.5">链接</div>
            <input
              v-model="doujinUrl"
              class="inline-block h-full outline-none bg-gray-200 border-2 border-gray-300 w-full rounded"
            />
          </div>
          <ul class="text-xs text-gray-800 italic">
            <li>*必填项，最长2048个字符</li>
            <li>
              *有效的链接仅能包括以下网站：Bilibili(仅限视频)、微博、THBWiki、PatchyVideo/THVideo(仅限视频和播放列表，支持<a
                class="text-blue-500 hover:text-blue-800 transition transition-colors underline"
                href="https://thvideo.tv/"
                target="_blank"
                >旧页面</a
              >和<a
                class="text-blue-500 hover:text-blue-800 transition transition-colors underline"
                href="https://platinum.vercel.app/"
                target="_blank"
                >新页面</a
              >)、Twitter、YouTube、Pixiv、Nico静画/动画、Acfun、百度贴吧
            </li>
            <li>
              *如果在上述网站之外或无特定网站，请前往
              <a
                class="text-blue-500 hover:text-blue-800 transition transition-colors underline"
                href="https://thwiki.cc/"
                target="_blank"
                >THBWiki</a
              >
              创建词条并将词条链接粘贴到此处
            </li>
          </ul>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between items-center space-x-3">
            <div class="whitespace-nowrap py-0.5">标题</div>
            <input
              v-model="doujinTitle"
              class="inline-block h-full outline-none bg-gray-200 border-2 border-gray-300 w-full rounded"
            />
          </div>
          <ul class="text-xs text-gray-800 italic">
            <li>*必填项，最长256个字符</li>
            <li>*请尽可能填写原名或较为通用的译名</li>
          </ul>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between items-center space-x-3">
            <div class="whitespace-nowrap py-0.5">作者</div>
            <input
              v-model="doujinAuthor"
              class="inline-block h-full outline-none bg-gray-200 border-2 border-gray-300 w-full rounded"
            />
          </div>
          <ul class="text-xs text-gray-800 italic">
            <li>*必填项，最长128个字符</li>
            <li>*请尽可能填写原名或较为通用的译名</li>
          </ul>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center space-x-3">
            <div class="whitespace-nowrap py-0.5">作品类型</div>
            <div class="flex-grow">
              <VoteSelect class="w-full" v-model:selected="doujinType" :item-list="doujintypesWithoutColor" />
            </div>
          </div>
        </div>
        <div class="flex-grow flex flex-col space-y-1">
          <div>
            <div class="whitespace-nowrap">提名理由</div>
            <ul class="text-xs text-gray-800 italic">
              <li>*选填项，最长1024个字符</li>
              <li>*如果写的很长或者很优秀，甚至有可能入选年度最感人推荐感言哦！</li>
            </ul>
          </div>
          <div class="flex-grow">
            <textarea
              maxlength="1024"
              v-model="doujinReason"
              class="inline-block outline-none bg-gray-200 border-2 border-gray-300 w-full h-full rounded"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-between px-2">
        <div class="h-full py-2">
          <icon-uil-question-circle
            class="cursor-pointer w-full h-full"
            @click="noticeOpen = true"
          ></icon-uil-question-circle>
        </div>
        <div class="flex space-x-4">
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
  <VoteMessageBox v-model:open="noticeOpen" title="提名须知">
    <div class="flex flex-col overflow-auto">
      <ul class="space-y-2 p-2 list-disc list-inside">
        <li>“最近三年的作品(2019/1/1 0:00:00 ~ 2022/1/1 0:00:00)”以发布日期计算，不考虑是否完结的问题</li>
        <li>同一个作品在不同网站上发布视为同一作品，其中提名的链接如指向营销号盗用的作品，则不计票</li>
        <li>
          可能出现<label class="text-accent-color-600">版权问题或争议话题</label
          >的IP联合创作作品（如创价x东方）的提名无效
        </li>
        <li><label class="text-accent-color-600">R18</label>作品的提名无效</li>
        <li>单品和组合作品（如同人游戏的ost和该同人游戏本身）视为不同的作品</li>
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
import { useVModel } from '@vueuse/core'
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

const noticeOpen = ref(false)
watch(open, () => {
  if (open.value) {
    clearDoujinData()
    setTimeout(() => {
      noticeOpen.value = true
    }, 300)
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

function checkDoujinData(): boolean {
  let vaild = true
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
    alert('请输入有效的链接！')
    vaild = false
  } else if (doujinUrl.value.length > 2048) {
    alert('链接长度超过最大值！')
    vaild = false
  } else if (doujinTitle.value === '') {
    alert('请输入标题！')
    vaild = false
  } else if (doujinTitle.value.length > 256) {
    alert('标题长度超过最大值！')
    vaild = false
  } else if (doujinAuthor.value === '') {
    alert('请输入作者名！')
    vaild = false
  } else if (doujinAuthor.value.length > 128) {
    alert('作者名长度超过最大值！')
    vaild = false
  } else if (doujinType.value.value === Doujin0.dojinType) {
    alert('请选择作品类型！')
    vaild = false
  } else if (doujinReason.value.length > 1024) {
    alert('提名理由长度超过最大值！')
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
