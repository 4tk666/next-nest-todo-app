import { serverAuthenticatedReadFetch } from '@/lib/utils/fetch/server/server-auth-fetch'
import {
  type StockDetailResponse,
  stockDetailResponseSchema,
} from '@ai-job-interview/packages/schemas/stocks/stock-schemas'

/**
 * 株式詳細情報を取得するためのカスタムフック（クライアントサイド）
 * @param ticker 株式のティッカーシンボル（例: AAPL, MSFT）
 * @returns 株式の詳細情報
 */
export function getStockDetail(ticker: string) {
  return serverAuthenticatedReadFetch<StockDetailResponse>({
    path: `/stocks/${ticker}`,
    validateOutput: stockDetailResponseSchema,
  })
}
