import { z } from 'zod'

/**
 * Stock株式検索結果の単一アイテムのスキーマ
 */
export const stockSearchResultItemSchema = z.object({
  active: z.boolean().optional(),
  cik: z.string().optional(),
  composite_figi: z.string().optional(),
  currency_name: z.string().optional(),
  delisted_utc: z.string().optional(),
  last_updated_utc: z.string().optional(),
  locale: z.enum(['us', 'global']),
  market: z.enum(['stocks', 'crypto', 'fx', 'otc', 'indices']),
  name: z.string().optional(),
  primary_exchange: z.string().optional(),
  share_class_figi: z.string().optional(),
  ticker: z.string(),
  type: z.string().optional(),
})

/**
 * Stock株式検索レスポンスのスキーマ
 */
export const stockSearchResponseSchema = z.object({
  count: z.number().optional(),
  next_url: z.string().optional(),
  request_id: z.string().optional(),
  results: z.array(stockSearchResultItemSchema).optional(),
  status: z.string().optional(),
})

// 型の推論
export type StockSearchResultItem = z.infer<typeof stockSearchResultItemSchema>
export type StockSearchResponse = z.infer<typeof stockSearchResponseSchema>
