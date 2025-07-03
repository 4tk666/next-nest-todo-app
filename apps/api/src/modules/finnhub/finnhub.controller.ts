import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  FinnhubSearchResponse,
  type SearchStocksDto,
  searchStocksSchema,
} from './dto/finnhub.dto'
import { FinnhubService } from './finnhub.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('finnhub')
@UseGuards(JwtAuthGuard)
export class FinnhubController {
  constructor(private readonly finnhubService: FinnhubService) {}

  /**
   * 株式を検索する
   * GET /finnhub/search?q=apple
   */
  @Get('search')
  async searchStocks(
    @Query() query: SearchStocksDto,
  ): Promise<FinnhubSearchResponse> {
    // バリデーション
    const validatedQuery = searchStocksSchema.parse(query)

    return this.finnhubService.searchStocks(validatedQuery)
  }
}
