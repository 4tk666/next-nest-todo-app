import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FinnhubController } from './finnhub.controller'
import { FinnhubService } from './finnhub.service'

@Module({
  controllers: [FinnhubController],
  providers: [FinnhubService],
  exports: [FinnhubService],
})
export class FinnhubModule {}
