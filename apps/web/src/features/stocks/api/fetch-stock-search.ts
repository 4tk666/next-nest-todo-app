import { useAuthSWR } from '@/lib/hooks/use-auth-swr'
import {
  type StockSearchResponse,
  stockSearchResponseSchema,
} from '@next-nest-todo-app/packages/schemas/stocks/stock-schemas'

export function getStockSearch(query: string) {
  return useAuthSWR<StockSearchResponse>({
    path: '/stocks',
    validateOutput: stockSearchResponseSchema,
    params: { search: query },
    isFetch: query !== '',
  })
}
