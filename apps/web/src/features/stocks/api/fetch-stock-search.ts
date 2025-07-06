import { useAuthSWR } from '@/lib/hooks/use-auth-swr'
import {
  type StockSearchResponse,
  stockSearchResponseSchema,
} from '@ai-job-interview/packages/schemas/stocks/stock-schemas'

export function getStockSearch(query: string) {
  return useAuthSWR<StockSearchResponse>({
    path: '/stocks',
    validateOutput: stockSearchResponseSchema,
    params: { search: query },
    isFetch: query !== '',
  })
}
