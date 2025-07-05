import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../../common/jwt/guards/jwt-auth.guard'
import {
  FinnhubSearchResponse,
  type SearchStocksDto,
  searchStocksSchema,
} from './dto/finnhub.dto'
import { FinnhubService } from './finnhub.service'

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
    @Query(new ZodValidationPipe(searchStocksSchema))
    query: SearchStocksDto,
  ): Promise<FinnhubSearchResponse> {
    return this.finnhubService.searchStocks(query)
  }
}
