import { z } from 'zod'

export const searchStocksSchema = z.object({
  search: z.string(),
})

export const detailStocksSchema = z.object({
  ticker: z.string().min(1, 'ティッカーシンボルを入力してください'),
})

export type SearchStocksDto = z.infer<typeof searchStocksSchema>

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
/**
 * 株式詳細の住所情報のスキーマ
 */
export const stockAddressSchema = z.object({
  address1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
})

/**
 * 株式詳細のブランディング情報のスキーマ
 */
export const stockBrandingSchema = z.object({
  icon_url: z.string().optional(),
  logo_url: z.string().optional(),
})

/**
 * 株式詳細のメイン情報のスキーマ
 */
export const stockDetailResultSchema = z.object({
  address: stockAddressSchema.optional(),
  branding: stockBrandingSchema.optional(),
  cik: z.string().optional(),
  composite_figi: z.string().optional(),
  currency_name: z.string().optional(),
  description: z.string().optional(),
  homepage_url: z.string().optional(),
  list_date: z.string().optional(),
  locale: z.string().optional(),
  market: z.string().optional(),
  market_cap: z.number().optional(),
  name: z.string().optional(),
  phone_number: z.string().optional(),
  primary_exchange: z.string().optional(),
  share_class_figi: z.string().optional(),
  share_class_shares_outstanding: z.number().optional(),
  sic_code: z.string().optional(),
  sic_description: z.string().optional(),
  ticker: z.string(),
  total_employees: z.number().optional(),
  type: z.string().optional(),
  weighted_shares_outstanding: z.number().optional(),
})

/**
 * 株式詳細レスポンスのスキーマ
 */
export const stockDetailResponseSchema = z.object({
  results: stockDetailResultSchema,
  status: z.string(),
  request_id: z.string(),
})

/**
 * 株式詳細取得パラメータのスキーマ
 */
export const getStockDetailSchema = z.object({
  ticker: z.string().min(1, 'ティッカーシンボルを入力してください'),
})

// 型の推論
export type StockAddress = z.infer<typeof stockAddressSchema>
export type StockBranding = z.infer<typeof stockBrandingSchema>
export type StockDetailResult = z.infer<typeof stockDetailResultSchema>
export type StockDetailResponse = z.infer<typeof stockDetailResponseSchema>
export type GetStockDetailDto = z.infer<typeof getStockDetailSchema>
// 型の推論
export type StockSearchResultItem = z.infer<typeof stockSearchResultItemSchema>
export type StockSearchResponse = z.infer<typeof stockSearchResponseSchema>
