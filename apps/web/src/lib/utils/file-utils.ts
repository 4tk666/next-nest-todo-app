/**
 * ファイルサイズを人間が読みやすい形式にフォーマットする
 * @param bytes ファイルサイズ（バイト単位）
 * @returns フォーマットされたファイルサイズ文字列
 */
export function formatFileSize(bytes: number): string | undefined {
  // 無効な値の処理
  if (!Number.isFinite(bytes) || bytes < 0) return

  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

/**
 * PDFファイルのバリデーションオプション
 */
export type FileValidationOptions = {
  /** 最大ファイルサイズ（バイト単位） */
  maxSize: number
  /** 受け入れ可能なファイルタイプ */
  accept: string
}

/**
 * ファイルバリデーション
 * @param file バリデーション対象のファイル
 * @param options バリデーションオプション
 * @returns エラーメッセージ（バリデーション成功時はundefined）
 */
export function validateFile(
  file: File,
  options: FileValidationOptions,
): string | undefined {
  const { maxSize, accept } = options

  if (file.size > maxSize) {
    return `ファイルサイズは${formatFileSize(maxSize)}以下にしてください`
  }

  // PDFファイルのみ許可
  if (accept === '.pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return 'PDFファイルのみアップロード可能です'
  }

  // MIMEタイプでもチェック
  if (accept === '.pdf' && file.type !== 'application/pdf') {
    return 'PDFファイルのみアップロード可能です'
  }

  return undefined
}

/**
 * FileListまたはDataTransferFilesから最初のファイルを安全に取得する
 * @param files FileListまたはFileList-like オブジェクト
 * @returns 最初のファイル（存在しない場合はundefined）
 */
export function getFirstFile(files: FileList | null): File | undefined {
  if (!files || files.length === 0) return undefined
  return files[0]
}
