import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { z } from 'zod'

/**
 * Zodスキーマを使用してリクエストデータを検証するパイプ
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => {
          const path = err.path.join('.')
          return path ? `${path}: ${err.message}` : err.message
        })
        throw new BadRequestException({
          message: 'バリデーションエラーが発生しました',
          errors: errorMessages,
        })
      }
      throw new BadRequestException('バリデーションに失敗しました')
    }
  }
}
