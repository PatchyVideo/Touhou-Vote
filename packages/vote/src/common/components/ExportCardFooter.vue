<!--
  导出投票卡片（角色 / 音乐 / CP）共用的底部信息区。
  三张卡片的页脚内容完全一致，抽出来避免二维码、投票时间这类对外信息各改各的走样。
-->
<template>
  <div class="mt-auto pt-10 border-t-2 border-gray-50 flex flex-col items-center text-gray-400">
    <img :src="qrcodeUrl" alt="投票站二维码" class="w-36 h-36 mb-3 rounded-lg border-2 border-gray-100" />
    <p class="text-sm mb-4">扫码或打开 touhou.vote 参与投票</p>

    <div class="text-center space-y-1 font-medium">
      <p>
        投票链接：
        <span class="underline">{{ VOTE_SITE_URL }}</span>
      </p>
      <p v-if="voteWindowText">投票时间：{{ voteWindowText }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 二维码内容为 https://touhou.vote/，与下方展示的链接一致。
// 走 vite 资源引用而非外链，导出时是同源图片，不受 html2canvas 的跨域限制。
import qrcodeUrl from '@/common/assets/vote-qrcode.png'
import { voteWindowText } from '@/common/lib/voteYear'

const VOTE_SITE_URL = 'https://touhou.vote'
</script>
