'use client'

import { FileUpload } from '@/components/elements/file-upload'
import { uploadDocumentActionState } from '@/lib/server-actions/user/upload-document-action'
import type { ActionState } from '@/types/form'
import type {
  DocumentResponse,
} from '@ai-job-interview/packages/schemas/user/document'
import { clsx } from 'clsx'
import { useActionState, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../elements/button'

/**
 * ドキュメントアップロード用のコンポーネント
 */
export function DocumentUploadSection() {
  const [uploadDocument, setUploadDocument] = useState<File>()
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [state, formAction, isPending] = useActionState(
    async (
      _p: ActionState<DocumentResponse> | undefined,
      _f: unknown,
    ) => {
      if (!uploadDocument) return

      const result = await uploadDocumentActionState(uploadDocument, 'RESUME')

      if (!result.success) {
        setUploadErrors(result.error?.message ? [result.error.message] : [])
      } else {
        setUploadDocument(undefined)
        setUploadErrors([])
        toast.success('ドキュメントが正常にアップロードされました！')
      }

      return result
    },
    undefined,
  )

  /**
   * ファイルアップロード処理
   */
  async function handleFileUpload(file?: File) {
    if (!file) return

    setUploadErrors([])

    setUploadDocument(file)
  }

  /**
   * エラーハンドリング
   */
  function handleUploadError(error: string) {
    setUploadErrors([error])
  }

  return (
    <div className={clsx('border border-gray-200 rounded-lg', 'p-6')}>
      <h3 className={clsx('text-lg font-medium text-gray-900', 'mb-4')}>
        ドキュメントアップロード
      </h3>

      {/* ファイルアップロード */}
      <form action={formAction}>
        <FileUpload
          id="document-upload"
          onFileSelected={handleFileUpload}
          onError={handleUploadError}
          disabled={isPending}
          errors={uploadErrors}
        />
        <Button type="submit" disabled={!uploadDocument || isPending}>
          登録
        </Button>
      </form>

      {/* ローディング表示 */}
      {isPending && (
        <div
          className={clsx(
            'mt-4 p-3',
            'bg-blue-50 border border-blue-200 rounded-md',
            'text-blue-800',
          )}
        >
          アップロード中...
        </div>
      )}
    </div>
  )
}
