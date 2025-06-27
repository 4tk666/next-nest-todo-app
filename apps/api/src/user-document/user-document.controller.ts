import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserDocumentService } from './user-document.service'
import { ResponseTransformInterceptor } from '../interceptors/response-transform.interceptor'
import { uploadDocumentSchema, type UploadDocumentDto } from './dto/upload-document.dto'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

/**
 * アップロードされるファイルの型定義
 */
interface MultipartFile {
  originalname: string
  buffer: Buffer
  mimetype: string
  size: number
}

/**
 * JWTから取得するユーザー情報の型定義
 */
interface AuthenticatedRequest extends Request {
  user: {
    id: string
    email: string
  }
}

/**
 * ユーザードキュメントアップロード関連のAPIエンドポイントを提供するコントローラー
 */
@Controller('user-documents')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
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
    const userId = request.user.id
    const uploadData = { ...body, fileName: file.originalname }

    return await this.userDocumentService.uploadDocument(
      userId,
      uploadData,
      file.buffer,
    )
  }
}
