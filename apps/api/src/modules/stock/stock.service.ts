import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { z } from 'zod'
import {
  type SearchStocksDto,
  type StockSearchResponse,
  stockSearchResponseSchema,
} from './dto/stock.dto'

type StockFetchParams<T> = {
  endpoint: string
  params: {
    q?: string
    symbol?: string
    metric?: string
  }
  validateOutput: z.Schema<T>
}

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name)
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('FINNHUB_API_KEY')
    const apiUrl = this.configService.get<string>('FINNHUB_API_URL')

    if (!apiKey) {
      this.logger.error('FINNHUB_API_KEY環境変数が設定されていません')
      throw new Error('FINNHUB_API_KEY環境変数が設定されていません')
    }

    if (!apiUrl) {
      this.logger.error('FINNHUB_API_URL環境変数が設定されていません')
      throw new Error('FINNHUB_API_URL環境変数が設定されていません')
    }

    this.apiKey = apiKey
    this.baseUrl = apiUrl
  }

  private normalizeSymbol(symbol: string): string {
    // 株式シンボルの正規化（例: $AAPL → AAPL）
    return symbol.startsWith('$') ? symbol.slice(1) : symbol
  }

  /**
   * Stock APIの汎用取得関数
   */
  private async stockFetch<T>({
    endpoint,
    params,
    validateOutput,
  }: StockFetchParams<T>): Promise<T> {
    // クエリ文字列の構築
    const searchParams = new URLSearchParams({
      ...(params.q ? { q: params.q } : {}),
      ...(params.symbol ? { symbol: this.normalizeSymbol(params.symbol) } : {}),
      ...(params.metric ? { metric: params.metric } : {}),
      token: this.apiKey ?? '',
    })

    const url = `${this.baseUrl}/${endpoint}?${searchParams.toString()}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(
          `Stock APIエラー: ${response.status} ${response.statusText}`,
        )
      }

      const data = await response.json()

      if (validateOutput) {
        const validationResult = validateOutput.safeParse(data)
        if (!validationResult.success) {
          this.logger.error(
            'Stock API出力データの検証に失敗しました:',
            validationResult.error,
          )
          throw new Error('Stock API出力データの検証に失敗しました')
        }
        return validationResult.data
      }

      return data as T
    } catch (error) {
      this.logger.error('Stock APIリクエスト中にエラーが発生しました:', error)
      throw error
    }
  }

  /**
   * 株式を検索する
   */
  async searchStocks(dto: SearchStocksDto): Promise<StockSearchResponse> {
    return this.stockFetch<StockSearchResponse>({
      endpoint: 'search',
      params: { q: dto.q },
      validateOutput: stockSearchResponseSchema,
    })
  }
}
