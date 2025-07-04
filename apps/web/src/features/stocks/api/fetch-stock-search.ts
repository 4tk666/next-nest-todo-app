import { authenticatedReadFetch } from '@/lib/utils/fetch/auth-fetch'
import {
  type FinnhubSearchResponse,
  finnhubSearchResponseSchema,
} from '@ai-job-interview/packages/schemas/stocks/finnhub-schemas'

export function fetchStockSearch(query: string) {
  return authenticatedReadFetch<FinnhubSearchResponse>({
    path: 'finnhub/search/',
    params: { q: query },
    validateOutput: finnhubSearchResponseSchema,
  })
}
