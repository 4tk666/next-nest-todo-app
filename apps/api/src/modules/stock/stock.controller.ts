import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../../common/jwt/guards/jwt-auth.guard'
import {
  type SearchStocksDto,
  StockSearchResponse,
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
  @Get('search')
  async searchStocks(
    @Query(new ZodValidationPipe(searchStocksSchema))
    query: SearchStocksDto,
  ): Promise<StockSearchResponse> {
    return this.stockService.searchStocks(query)
  }
}
