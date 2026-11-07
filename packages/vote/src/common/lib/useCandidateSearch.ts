import { type Ref, ref, watch } from 'vue'
import { type CandidateCategory, fetchCandidateSearch } from '@touhou-vote/shared/api/candidateSearch'
import { API_PREFIX } from './apiPrefix'
import { voteYear } from './voteYear'

export function useCandidateSearch(category: CandidateCategory, query: Ref<string>) {
  const matchedIds = ref(new Set<string>())
  const loading = ref(false)
  const error = ref<string | null>(null)

  watch(
    () => query.value.trim().toLowerCase(),
    (keyword, _previous, onCleanup) => {
      let current = true
      onCleanup(() => {
        current = false
      })
      matchedIds.value = new Set()
      error.value = null
      loading.value = Boolean(keyword)
      if (!keyword) return

      fetchCandidateSearch(`${API_PREFIX}/api/v1/autocomplete/candidates/search`, category, keyword, voteYear)
        .then((result) => {
          if (current) matchedIds.value = new Set(result.candidate_ids.map(String))
        })
        .catch(() => {
          if (current) error.value = '搜索失败，请修改关键词重试'
        })
        .finally(() => {
          if (current) loading.value = false
        })
    },
    { immediate: true, flush: 'sync' }
  )

  return { matchedIds, loading, error }
}
