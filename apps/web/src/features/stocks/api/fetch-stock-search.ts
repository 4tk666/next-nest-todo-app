import { clientAuthenticatedReadFetch } from '@/lib/utils/fetch/client/client-auth-fetch'
import {
  type StockSearchResponse,
  stockSearchResponseSchema,
} from '@ai-job-interview/packages/schemas/stocks/stock-schemas'

export function fetchStockSearch(query: string) {
  return clientAuthenticatedReadFetch<StockSearchResponse>({
    path: 'stock/search/',
    params: { q: query },
    validateOutput: stockSearchResponseSchema,
  })
}
