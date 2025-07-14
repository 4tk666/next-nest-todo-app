import { z } from 'zod'

export const searchStocksSchema = z.object({
  search: z.string(),
})

export type SearchStocksDto = z.infer<typeof searchStocksSchema>


/**
 * 株式詳細取得パラメータのスキーマ（URLパラメータ用）
 */
export const tickerParamSchema = z.string().min(1, 'ティッカーシンボルを入力してください')
