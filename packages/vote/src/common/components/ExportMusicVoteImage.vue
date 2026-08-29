<template>
	<div class="w-full">
		<button
			class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
			@click="handleOpenExport"
		>
			<icon-uil-image-download class="inline-block mr-2" />
			导出音乐投票为图片
		</button>

		<!-- 预览对话框 -->
		<VoteMessageBox v-model:open="exportDialogOpen" :title="`第${voteYear}回 投票卡片`" close-button>
			<div class="space-y-4 p-2 flex flex-col items-center">
				<div v-if="generating" class="py-20 flex flex-col items-center">
					<icon-uil-spinner-alt class="text-4xl animate-spin text-blue-500 mb-4" />
					<p class="text-gray-500">{{ generatingText }}</p>
				</div>

				<div v-else-if="previewImageUrl" class="w-full flex flex-col items-center">
					<div class="border rounded-lg shadow-inner bg-gray-50 overflow-hidden">
						<img :src="previewImageUrl" class="max-w-full max-h-[50vh] object-contain" />
					</div>
					<p class="text-xs text-gray-400 mt-2">提示：长按图片或点击下方按钮保存</p>
				</div>

				<div v-if="!generating && previewImageUrl" class="flex w-[30vh] gap-2">
					<button class="flex-1 py-1 text-sm bg-blue-600 text-white rounded-lg font-semibold" @click="downloadImage">
						保存图片
					</button>
					<button v-if="canShare" class="flex-1 py-1 text-sm bg-pink-500 text-white rounded-lg font-semibold" @click="shareImage">
						分享
					</button>
				</div>
			</div>

			<!-- 离屏渲染区域 (真正生成的图片内容) -->
			<div style="position: absolute; left: -9999px; top: 0;">
				<div
					ref="cardRef"
					class="w-[640px] bg-white p-10 flex flex-col font-sans"
					style="min-height: 1100px;"
				>
					<!-- 顶部标题 -->
					<div class="flex justify-between items-end mb-10">
						<h1 class="text-3xl font-black text-black">
							{{ userName }}的音乐部门投票
						</h1>
						<span class="text-gray-400 text-lg font-bold">
							第{{ voteYear }}回中文东方人气投票
						</span>
					</div>

					<!-- 本命音乐卡片 -->
					<div v-if="honmeiMusic" class="mb-12">
						<div
							class="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-lg"
							:style="{ background: darkenColor(honmeiMusic.color, 0.2) }"
						>
							<!-- 本命斜角标签 -->
							<div class="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
								<div class="absolute top-5 -right-12 w-40 h-9 bg-black bg-opacity-30 flex items-center justify-center transform rotate-45 shadow-sm">
									<span class="text-white text-lg font-black tracking-[0.12em] uppercase leading-tight -mt-1 select-none text-center">
										本命票
									</span>
								</div>
							</div>
							<div class="flex items-center gap-8">
								<!-- 头像 -->
								<div class="w-36 h-36 rounded-full border-4 border-white border-opacity-60 overflow-hidden flex-shrink-0 bg-white">
									<img :src="honmeiMusic.image" class="w-full h-full object-cover" />
								</div>
								<!-- 名字信息 -->
								<div class="flex-1 min-w-0">
									<h2 class="text-5xl font-black mb-3 break-words whitespace-normal text-white">{{ honmeiMusic.name }}</h2>
									<p class="text-xl font-bold opacity-90 break-words whitespace-normal text-white">
										{{ honmeiMusic.origname }} / {{ honmeiMusic.album }}
									</p>
								</div>
							</div>

							<!-- 理由区域 -->
							<div v-if="honmeiMusic.reason" class="mt-8 pt-5 border-t border-white border-opacity-30">
								<p class="text-xl leading-relaxed opacity-95 break-words whitespace-normal text-white text-left -mt-1">
									"{{ honmeiMusic.reason }}"
								</p>
							</div>
						</div>
					</div>

					<!-- 其他音乐网格 -->
					<div class="grid grid-cols-3 gap-y-12 gap-x-6 mb-16">
						<div
							v-for="(music, index) in otherMusics"
							:key="music.id"
							class="flex flex-col items-center text-center"
						>
							<!-- 圆形头像外框 -->
							<div
								class="w-32 h-32 rounded-full p-1 border-4 mb-4 shadow-sm"
								:style="{ borderColor: music.color }"
							>
								<div class="w-full h-full rounded-full overflow-hidden bg-gray-100">
									<img :src="music.image" class="w-full h-full object-cover" />
								</div>
							</div>
							<!-- 名字 -->
							<div class="text-2xl font-black text-black break-words whitespace-normal w-full px-2">
								{{ music.name }}
							</div>
						</div>
					</div>

					<!-- 底部装饰信息 -->
					<div class="mt-auto pt-10 border-t-2 border-gray-50 flex flex-col items-center text-gray-400">
						<div class="w-36 h-36 mb-3 rounded-lg border-2 border-gray-100 bg-[linear-gradient(90deg,#f3f4f6_50%,transparent_50%),linear-gradient(#f3f4f6_50%,transparent_50%)] bg-[length:16px_16px] bg-[position:0_0,0_0] flex items-center justify-center">
							<div class="w-24 h-24 border-4 border-gray-500 bg-white flex items-center justify-center text-center text-xs leading-5 font-bold text-gray-500">
								TOUHOU
								<br />
								VOTE
							</div>
						</div>
						<p class="text-sm mb-4">打开 touhou.vote 参与投票</p>

						<div class="text-center space-y-1 font-medium">
							<p>
								投票链接：
								<span class="underline">https://touhou.vote</span>
							</p>
							<p>投票时间： xxxx年xx月xx日-xxxx年xx月xx日</p>
						</div>
					</div>
				</div>
			</div>
		</VoteMessageBox>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import VoteMessageBox from './VoteMessageBox.vue'
import { getExportMusicData, getExportMusicDataFromDataSource } from '@/common/lib/exportVoteData'
import { getDataSourceMode, type DataSourceMode } from '@/common/lib/voteDataSource'
import { musicList } from '@/vote-music/lib/musicList'
import { voteYear } from '@/common/lib/voteYear'
import { popMessageText } from '@/common/lib/popMessage'
import { username } from '@/home/lib/user'
import { getExportAssetUrl } from '@/common/lib/exportAssetUrl'
import { createVoteImageExportAbortError, useVoteImageExport } from '@/common/lib/useVoteImageExport'
import { loadVoteObjects, voteObjectsError } from '@/common/lib/voteObjectsDataSource'

const userName = computed(() => username.value || '匿名用户')

const cardRef = ref<HTMLElement>()
const fetchingVoteData = ref(false)

const voteMusicData = ref(getExportMusicData())

function hashStringToHue(value: string) {
	let hash = 0
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash * 31 + value.charCodeAt(i)) | 0
	}
	return Math.abs(hash) % 360
}

function hslToHex(h: number, s: number, l: number) {
	const sRatio = s / 100
	const lRatio = l / 100
	const c = (1 - Math.abs(2 * lRatio - 1)) * sRatio
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = lRatio - c / 2
	let r = 0
	let g = 0
	let b = 0

	if (h < 60) {
		r = c
		g = x
	} else if (h < 120) {
		r = x
		g = c
	} else if (h < 180) {
		g = c
		b = x
	} else if (h < 240) {
		g = x
		b = c
	} else if (h < 300) {
		r = x
		b = c
	} else {
		r = c
		b = x
	}

	const toHex = (val: number) => Math.round((val + m) * 255).toString(16).padStart(2, '0')
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function getMusicColor(name: string) {
	const hue = hashStringToHue(name || 'music')
	// Use darker lightness to keep text readable on the card background.
	return hslToHex(hue, 68, 32)
}

const fullMusicData = computed(() => {
	return voteMusicData.value.map((voteMusic: { id: string; isHonmei: boolean; reason: string }) => {
			const fullMusic = musicList.value.find(m => m.id === voteMusic.id)
		return {
			id: voteMusic.id,
			name: fullMusic?.name || '未知曲目',
			origname: fullMusic?.origname || '',
			album: fullMusic?.album || '',
			image: getExportAssetUrl(fullMusic?.image || ''),
			color: getMusicColor(fullMusic?.name || voteMusic.id),
			isHonmei: voteMusic.isHonmei,
			reason: voteMusic.reason || ''
		}
	})
})

const honmeiMusic = computed(() => {
	return fullMusicData.value.find(music => music.isHonmei)
})

const otherMusics = computed(() => {
	return fullMusicData.value.filter(music => !music.isHonmei)
})

const generatingText = computed(() => (fetchingVoteData.value ? '正在获取投票信息...' : '正在生成图片...'))

async function resolveVoteMusicData() {
	const mode: DataSourceMode = getDataSourceMode()
	fetchingVoteData.value = true
	try {
		const { data, error } = await getExportMusicDataFromDataSource(mode)
		if (error) {
			console.warn(`获取数据时遇到问题: ${error}`)
		}

		return data
	} catch (error) {
		console.error('获取投票数据失败:', error)
		popMessageText('获取投票信息失败，已使用本地数据')
		return getExportMusicData()
	} finally {
		fetchingVoteData.value = false
	}
}

function darkenColor(input: string, amount: number) {
	const hexMatch = /^#([0-9a-fA-F]{6})$/.exec(input)
	if (!hexMatch) return input
	const hex = hexMatch[1]
	const rgb = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((c) => parseInt(c, 16))
	const scale = Math.max(0, Math.min(1, 1 - amount))
	const darker = rgb.map((v) => Math.max(0, Math.min(255, Math.round(v * scale))))
	return `#${darker.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

const {
	canShare,
	downloadImage,
	exportDialogOpen,
	generating,
	openExport: handleOpenExport,
	previewImageUrl,
	shareImage,
} = useVoteImageExport({
	cardRef,
	fileName: () => `th-music-vote-${Date.now()}.png`,
	shareTitle: '我的东方人气投票',
	prepare: async () => {
		await loadVoteObjects()
		if (voteObjectsError.value) {
			popMessageText('加载投票数据失败，请稍后重试')
			throw createVoteImageExportAbortError()
		}
		voteMusicData.value = await resolveVoteMusicData()
		if (!voteMusicData.value.length) {
			popMessageText('你还没有投票数据，请先提交投票后再导出图片。')
			throw createVoteImageExportAbortError()
		}
	},
})
</script>
