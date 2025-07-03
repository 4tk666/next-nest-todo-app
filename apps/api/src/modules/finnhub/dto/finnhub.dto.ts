import { z } from 'zod'

export const searchStocksSchema = z.object({
  q: z.string(),
})

export type SearchStocksDto = z.infer<typeof searchStocksSchema>

/**
 * Finnhub株式検索結果の単一アイテムのスキーマ
 */
export const finnhubSearchResultItemSchema = z.object({
  description: z.string().describe('株式の説明'),
  displaySymbol: z.string().describe('表示用のシンボル'),
  symbol: z.string().describe('株式シンボル'),
  type: z.string().describe('株式の種類'),
})

/**
 * Finnhub株式検索レスポンスのスキーマ
 */
export const finnhubSearchResponseSchema = z.object({
  count: z.number().int().min(0).describe('検索結果の件数'),
  result: z.array(finnhubSearchResultItemSchema).describe('検索結果の配列'),
})


// 型の推論
export type FinnhubSearchResultItem = z.infer<typeof finnhubSearchResultItemSchema>
export type FinnhubSearchResponse = z.infer<typeof finnhubSearchResponseSchema>