import {
  StockDetailResponse,
  StockSearchResponse,
  stockDetailResponseSchema,
  stockSearchResponseSchema,
} from '@next-nest-todo-app/packages/schemas/stocks/stock-schemas'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { z } from 'zod'
import { SearchStocksDto } from './dto/stock.dto'

type StockFetchParams<T> = {
  endpoint: string
  params?: {
    search?: string
    symbol?: string
    metric?: string
    active?: 'true' | 'false' // 'true' or 'false'
    market?: 'stocks'
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
    params = {},
    validateOutput,
  }: StockFetchParams<T>): Promise<T> {
    // クエリ文字列の構築
    const searchParams = new URLSearchParams({
      ...(params.search ? { search: params.search } : {}),
      ...(params.symbol ? { symbol: this.normalizeSymbol(params.symbol) } : {}),
      ...(params.metric ? { metric: params.metric } : {}),
      ...(params.active ? { active: params.active } : {}),
      ...(params.market ? { market: params.market } : {}),
      apiKey: this.apiKey ?? '',
    })

    const url = `${this.baseUrl}/${endpoint}?${searchParams.toString()}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 429) {
          this.logger.warn(
            `Stock API Rate Limit exceeded: ${response.status} ${response.statusText}`,
          )
          throw new HttpException(
            'APIのリクエスト制限に達しました。しばらく時間をおいてから再度お試しください。',
            HttpStatus.TOO_MANY_REQUESTS,
          )
        }

        throw new HttpException(
          `Stock APIリクエストに失敗しました: ${response.status} ${response.statusText}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
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
          throw new HttpException(
            'データの形式が正しくありません。しばらく時間をおいてから再度お試しください。',
            HttpStatus.INTERNAL_SERVER_ERROR,
          )
        }
        return validationResult.data
      }

      return data as T
    } catch (error) {
      // HttpExceptionはそのまま再スロー
      if (error instanceof HttpException) {
        throw error
      }

      // その他のエラー（ネットワークエラーなど）
      this.logger.error('Stock APIリクエスト中にエラーが発生しました:', error)
      throw new HttpException(
        'データの取得中にネットワークエラーが発生しました。しばらく時間をおいてから再度お試しください。',
        HttpStatus.SERVICE_UNAVAILABLE,
      )
    }
  }

  /**
   * 株式を検索する
   */
  async searchStocks(dto: SearchStocksDto): Promise<StockSearchResponse> {
    return this.stockFetch<StockSearchResponse>({
      endpoint: 'tickers',
      params: {
        search: dto.search,
        active: 'true',
        market: 'stocks', // 株式市場のみを対象
      },
      validateOutput: stockSearchResponseSchema,
    })
  }

  /**
   * 株式詳細を取得する
   */
  async getStockDetails(ticker: string): Promise<StockDetailResponse> {
    return this.stockFetch<StockDetailResponse>({
      endpoint: `tickers/${ticker}`,
      validateOutput: stockDetailResponseSchema,
    })
  }
}
