'use client'

import { cn } from '@/lib/utils/class-utils'
import {
  type FileValidationOptions,
  formatFileSize,
  getFirstFile,
  validateFile,
} from '@/lib/utils/file-utils'
import type { ChangeEvent, DragEvent } from 'react'
import { useRef, useState } from 'react'
import { HiOutlineDocumentAdd, HiX } from 'react-icons/hi'

type FileUploadProps = {
  /** ファイル入力要素のID */
  id: string
  /** フォームフィールド名 */
  name?: string
  /** CSS クラス名 */
  className?: string
  /** 受け入れ可能なファイルタイプ（デフォルト: ".pdf" - PDFファイルのみ） */
  accept?: string
  /** 最大ファイルサイズ（バイト単位） */
  maxSize?: number
  /** ファイル選択時のコールバック */
  onFileSelected?: (files?: File) => void
  /** エラーハンドラー */
  onError?: (error: string) => void
  /** 無効状態 */
  disabled?: boolean
  /** バリデーションエラー */
  errors?: string[]
}

/**
 * PDFファイルアップロードコンポーネント
 * ドラッグ&ドロップとクリックによるPDFファイル選択に対応
 * デフォルトで単一のPDFファイルのみアップロード可能
 */
export function FileUpload({
  id,
  name = id,
  className = '',
  accept = '.pdf',
  maxSize = 10 * 1024 * 1024, // デフォルト10MB
  onFileSelected,
  onError,
  disabled = false,
  errors,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasErrors = errors && errors.length > 0

  // バリデーションオプション
  const validationOptions: FileValidationOptions = {
    maxSize,
    accept,
  }

  /**
   * ファイル処理の共通ロジック
   */
  function handleFiles(file: File | undefined) {
    if (!file) return

    const validationError = validateFile(file, validationOptions)

    if (validationError) {
      onError?.(validationError)
      return
    }

    setSelectedFile(file)
    onFileSelected?.(file)
  }

  /**
   * ファイル入力の変更ハンドラー
   */
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = getFirstFile(event.target.files)
    handleFiles(file)
  }

  /**
   * ドラッグオーバーハンドラー
   * ドラッグ中にファイルがドロップ可能な領域に入ったときに呼ばれる
   * ドラッグ中のスタイルを適用するために使用
   */
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (disabled) return
    setIsDragOver(true)
  }

  /**
   * ドラッグリーブハンドラー
   * ドラッグ中にファイルがドロップ可能な領域から出たときに呼ばれる
   * ドラッグ中のスタイルをリセットするために使用
   */
  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (disabled) return
    setIsDragOver(false)
  }

  /**
   * ドロップハンドラー
   * ファイルがドロップ（ファイルを要素の上で手を離した時に発生）されたときに呼ばれる
   */
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const file = getFirstFile(event.dataTransfer.files)
    handleFiles(file)
  }

  /**
   * ファイル選択ダイアログを開く
   * クリックまたはキーボード操作で呼び出される
   */
  function openFileDialog() {
    if (disabled) return
    fileInputRef.current?.click()
  }

  /**
   * すべてのファイルをクリア
   */
  function clearFiles() {
    setSelectedFile(undefined)
    onFileSelected?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* ファイル選択エリア */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg',
          'transition-colors duration-200',
          'cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
          isDragOver && !disabled
            ? 'border-indigo-500 bg-indigo-50'
            : hasErrors
              ? 'border-red-300 bg-red-50'
              : selectedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100',
          disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
        )}
        tabIndex={disabled ? -1 : 0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFileDialog()
          }
        }}
        aria-label="PDFファイルを選択またはドラッグ&ドロップ"
      >
        {selectedFile ? (
          // ファイルが選択されている場合の表示
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <HiOutlineDocumentAdd className="h-12 w-12 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size) ?? '不明なサイズ'}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✓ アップロード完了
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearFiles()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      clearFiles()
                    }
                  }}
                  className={cn(
                    'p-2 text-red-600 hover:text-red-500',
                    'rounded-full hover:bg-red-50',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                    'cursor-pointer',
                  )}
                  aria-label={`${selectedFile.name}を削除`}
                >
                  <HiX className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                別のPDFファイルに変更する場合は
                <span className="text-indigo-600 font-medium">
                  クリックまたはドラッグ&ドロップ
                </span>
                してください
              </p>
            </div>
          </div>
        ) : (
          // ファイルが選択されていない場合の表示
          <div className="p-6 text-center">
            <HiOutlineDocumentAdd
              className={cn(
                'mx-auto h-12 w-12',
                isDragOver && !disabled
                  ? 'text-indigo-500'
                  : hasErrors
                    ? 'text-red-400'
                    : 'text-gray-400',
              )}
            />
            <div className="mt-4">
              <p className={cn('text-lg font-medium text-gray-900')}>
                PDFファイルをドラッグ&ドロップ
              </p>
              <p className="text-sm text-gray-600 mt-1">
                または
                <span className="text-indigo-600 font-medium hover:text-indigo-500">
                  クリックして選択
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {`最大ファイルサイズ: ${formatFileSize(maxSize)}`}
            </p>
          </div>
        )}
      </div>

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        name={name}
        accept={accept}
        multiple={false}
        onChange={handleInputChange}
        disabled={disabled}
        className="sr-only"
        data-testid={`${id}-file-input`}
      />

      {/* エラーメッセージ */}
      {hasErrors && (
        <div className="text-sm text-red-600">
          {errors?.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  )
}
