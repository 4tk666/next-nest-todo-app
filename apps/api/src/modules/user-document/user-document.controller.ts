import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { AuthenticatedRequest } from 'src/modules/auth/strategies/jwt.strategy'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import {
  type UploadDocumentDto,
  uploadDocumentSchema,
} from './dto/upload-document.dto'
import { UserDocumentService } from './user-document.service'

/**
 * アップロードされるファイルの型定義
 */
type MultipartFile = {
  originalname: string
  buffer: Buffer
  mimetype: string
  size: number
}

/**
 * ユーザードキュメントアップロード関連のAPIエンドポイントを提供するコントローラー
 */
@Controller('user-documents')
@UseGuards(JwtAuthGuard)
export class UserDocumentController {
  constructor(private readonly userDocumentService: UserDocumentService) {}

  /**
   * ドキュメントをアップロードする
   * @param request - リクエストオブジェクト（JWTからユーザー情報を取得）
   * @param file - アップロードされたファイル
   * @param body - リクエストボディ
   * @returns アップロードされたドキュメント情報
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Request() request: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'application/pdf' }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: MultipartFile,
    @Body(new ZodValidationPipe(uploadDocumentSchema)) body: UploadDocumentDto,
  ) {
    const userId = request.user.sub

    return await this.userDocumentService.uploadDocument(
      userId,
      body,
      file.buffer,
    )
  }
}
