import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { UploadDocumentDto } from './dto/upload-document.dto'

/**
 * ドキュメントレスポンス用の型定義
 */
export interface DocumentResponseDto {
  id: number
  userId: string
  documentType: string
  fileName: string
  uploadedAt: Date
}

/**
 * ユーザードキュメントアップロード関連のビジネスロジックを担当するサービス
 */
@Injectable()
export class UserDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ドキュメントをアップロードする
   * @param userId - ユーザーID
   * @param uploadData - アップロードするドキュメントデータ
   * @param fileBuffer - ファイルのバイナリデータ
   * @returns アップロードされたドキュメント情報
   */
  async uploadDocument(
    userId: string,
    uploadData: UploadDocumentDto,
    fileBuffer: Buffer,
  ): Promise<DocumentResponseDto> {
    try {
      // ユーザーが存在するかチェック
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!userExists) {
        throw new NotFoundException('ユーザーが見つかりません')
      }

      // 同じタイプのドキュメントがすでに存在するかチェック
      const existingDocument = await this.prisma.userDocument.findFirst({
        where: {
          userId,
          documentType: uploadData.documentType,
        },
      })

      if (existingDocument) {
        // 既存のドキュメントを更新
        const updatedDocument = await this.prisma.userDocument.update({
          where: { id: existingDocument.id },
          data: {
            fileName: uploadData.fileName,
            fileData: fileBuffer,
            uploadedAt: new Date(),
          },
          select: {
            id: true,
            userId: true,
            documentType: true,
            fileName: true,
            uploadedAt: true,
          },
        })

        return updatedDocument
      }

      // 新しいドキュメントを作成
      const newDocument = await this.prisma.userDocument.create({
        data: {
          userId,
          documentType: uploadData.documentType,
          fileName: uploadData.fileName,
          fileData: fileBuffer,
        },
        select: {
          id: true,
          userId: true,
          documentType: true,
          fileName: true,
          uploadedAt: true,
        },
      })

      return newDocument
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('ドキュメントのアップロードに失敗しました')
    }
  }
}
