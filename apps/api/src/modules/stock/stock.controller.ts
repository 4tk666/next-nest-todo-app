import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../../common/jwt/guards/jwt-auth.guard'
import {
  type SearchStocksDto,
  type StockDetailResponse,
  StockSearchResponse,
  getStockDetailSchema,
  searchStocksSchema,
} from './dto/stock.dto'
import { StockService } from './stock.service'

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  /**
   * 株式を検索する
   * GET /stocks/search?q=apple
   */
  @Get('')
  async searchStocks(
    @Query(new ZodValidationPipe(searchStocksSchema))
    query: SearchStocksDto,
  ): Promise<StockSearchResponse> {
    return this.stockService.searchStocks(query)
  }

  /**
   * 株式の詳細を取得する
   * GET /stocks/:ticker
   * @param ticker 株式のティッカーシンボル（例: AAPL, TSLA）
   * @returns 株式の詳細情報
   * @throws 404 - 株式が見つからない場合
   */
  @Get(':ticker')
  async getStockDetails(
    @Param('ticker', new ZodValidationPipe(getStockDetailSchema))
    ticker: string,
  ): Promise<StockDetailResponse> {
    return this.stockService.getStockDetails(ticker)
  }
}
