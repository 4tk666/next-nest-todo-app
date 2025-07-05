import { clientAuthenticatedReadFetch } from '@/lib/utils/fetch/client/client-auth-fetch'
import {
  type FinnhubSearchResponse,
  finnhubSearchResponseSchema,
} from '@ai-job-interview/packages/schemas/stocks/finnhub-schemas'

export function fetchStockSearch(query: string) {
  return clientAuthenticatedReadFetch<FinnhubSearchResponse>({
    path: 'finnhub/search/',
    params: { q: query },
    validateOutput: finnhubSearchResponseSchema,
  })
}
