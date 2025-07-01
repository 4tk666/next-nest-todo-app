'use server'

import { authenticatedFileUpload } from '@/lib/utils/fetch/auth-fetch'
import type { ActionState } from '@/types/form'
import {
  type DocumentResponse,
  type UploadDocumentInput,
  type UploadDocumentType,
  documentResponseSchema,
} from '@ai-job-interview/packages/schemas/user/document'

/**
 * useActionState用のファイルアップロードAction
 * @param prevState 前の状態
 * @param formData FormDataオブジェクト
 * @returns アップロード結果
 */
export async function uploadDocumentActionState(
  uploadDocument: File,
  documentType: UploadDocumentType,
): Promise<ActionState<DocumentResponse>> {
  try {
    const file = uploadDocument

    const data: UploadDocumentInput = {
      documentType: documentType,
      fileName: file.name,
    }

    const result = await authenticatedFileUpload({
      path: 'user-documents/upload',
      file,
      data,
      validateOutput: documentResponseSchema,
    })

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('ドキュメントアップロードエラー:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'ドキュメントのアップロードに失敗しました'

    return {
      success: false,
      error: {
        message: errorMessage,
      },
    }
  }
}
