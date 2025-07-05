// import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // Cookieパーサーを有効化
  app.use(cookieParser())

  // CORS設定
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true, // Cookieを受け取るために必要
  })

  // グローバルバリデーションパイプの設定
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // )

  // グローバルインターセプターの設定（レスポンス変換）
  app.useGlobalInterceptors(new ResponseTransformInterceptor())

  // グローバル例外フィルターの設定
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(process.env.PORT ?? 4000)
}
bootstrap()
