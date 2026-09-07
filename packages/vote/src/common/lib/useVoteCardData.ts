import { computed, ref, type Ref } from 'vue'
import { getDataSourceMode, type DataSourceMode } from '@/common/lib/voteDataSource'
import { loadVoteObjects, voteObjectsError } from '@/common/lib/voteObjectsDataSource'
import { popMessageText } from '@/common/lib/popMessage'
import { createVoteImageExportAbortError } from '@/common/lib/useVoteImageExport'

type UseVoteCardDataOptions<T> = {
  /** 从 localStorage 读取本次投票，作为数据源不可用时的兜底。 */
  loadLocal: () => T[]
  /** 按当前数据源模式读取本次投票（内部已含 GraphQL / 本地的回退逻辑）。 */
  loadFromDataSource: (mode: DataSourceMode) => Promise<{ data: T[]; error: string | null }>
}

/**
 * 导出投票卡片的取数流程。
 * 角色 / 音乐 / CP 三张卡片的取数步骤完全一致，只有具体读哪份数据不同。
 */
export function useVoteCardData<T>(options: UseVoteCardDataOptions<T>) {
  const rows = ref(options.loadLocal()) as Ref<T[]>
  const fetchingVoteData = ref(false)

  const generatingText = computed(() => (fetchingVoteData.value ? '正在获取投票信息...' : '正在生成图片...'))

  async function resolveRows(): Promise<T[]> {
    fetchingVoteData.value = true
    try {
      const { data, error } = await options.loadFromDataSource(getDataSourceMode())
      if (error) console.warn(`获取数据时遇到问题: ${error}`)
      return data
    } catch (error) {
      console.error('获取投票数据失败:', error)
      popMessageText('获取投票信息失败，已使用本地数据')
      return options.loadLocal()
    } finally {
      fetchingVoteData.value = false
    }
  }

  /**
   * 传给 ExportVoteImageDialog 的 prepare：先备齐候选表和本人投票，
   * 任一步拿不到就中止导出，不要生成一张空白卡片。
   */
  async function prepare(): Promise<void> {
    await loadVoteObjects()
    if (voteObjectsError.value) {
      popMessageText('加载投票数据失败，请稍后重试')
      throw createVoteImageExportAbortError()
    }

    rows.value = await resolveRows()
    if (!rows.value.length) {
      popMessageText('你还没有投票数据，请先提交投票后再导出图片。')
      throw createVoteImageExportAbortError()
    }
  }

  return { rows, generatingText, prepare }
}
