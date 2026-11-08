export type CandidateCategory = 'character' | 'music'
export interface CandidateSearchResult {
  category: CandidateCategory
  query: string
  vote_year: number
  candidate_ids: number[]
}

export async function fetchCandidateSearch(
  baseUrl: string,
  category: CandidateCategory,
  query: string,
  voteYear: number
): Promise<CandidateSearchResult> {
  const normalized = query.trim().toLowerCase()
  const response = await fetch(baseUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, query: normalized, vote_year: voteYear }),
  })
  if (!response.ok) throw new Error(`candidate search HTTP ${response.status}`)
  const data = (await response.json()) as CandidateSearchResult
  if (
    !data ||
    data.category !== category ||
    data.query !== normalized ||
    data.vote_year !== voteYear ||
    !Array.isArray(data.candidate_ids) ||
    !data.candidate_ids.every((id) => Number.isSafeInteger(id) && id > 0)
  )
    throw new Error('candidate search 响应结构不完整')
  return data
}
