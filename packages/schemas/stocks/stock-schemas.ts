import { z } from 'zod'

/**
 * Stock株式検索結果の単一アイテムのスキーマ
 */
export const stockSearchResultItemSchema = z.object({
  description: z.string().describe('株式の説明'),
  displaySymbol: z.string().describe('表示用のシンボル'),
  symbol: z.string().describe('株式シンボル'),
  type: z.string().describe('株式の種類'),
})

/**
 * Stock株式検索レスポンスのスキーマ
 */
export const stockSearchResponseSchema = z.object({
  count: z.number().int().min(0).describe('検索結果の件数'),
  result: z.array(stockSearchResultItemSchema).describe('検索結果の配列'),
})

// 型の推論
export type StockSearchResultItem = z.infer<typeof stockSearchResultItemSchema>
export type StockSearchResponse = z.infer<typeof stockSearchResponseSchema>
