import { describe, it, expect } from 'vitest'
import {
  formatFileSize,
  validateFile,
  getFirstFile,
  type FileValidationOptions,
} from '../file-utils'

describe('formatFileSize', () => {
  it('0バイトを正しくフォーマットする', () => {
    expect(formatFileSize(0)).toBe('0 Bytes')
  })

  it('バイト単位を正しくフォーマットする', () => {
    expect(formatFileSize(500)).toBe('500 Bytes')
    expect(formatFileSize(1023)).toBe('1023 Bytes')
  })

  it('キロバイト単位を正しくフォーマットする', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB') // 1.5 KB
    expect(formatFileSize(1048575)).toBe('1024 KB') // 1MB - 1バイト
  })

  it('メガバイト単位を正しくフォーマットする', () => {
    expect(formatFileSize(1048576)).toBe('1 MB') // 1MB
    expect(formatFileSize(5242880)).toBe('5 MB') // 5MB
    expect(formatFileSize(10485760)).toBe('10 MB') // 10MB
  })

  it('ギガバイト単位を正しくフォーマットする', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB') // 1GB
    expect(formatFileSize(2147483648)).toBe('2 GB') // 2GB
  })

  it('小数点以下を適切に処理する', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1610612736)).toBe('1.5 GB')
  })

  it('マイナス値や無効な値を適切に処理する', () => {
    expect(formatFileSize(-1024)).toBeUndefined()
    expect(formatFileSize(-1)).toBeUndefined()
    expect(formatFileSize(Number.NaN)).toBeUndefined()
    expect(formatFileSize(Number.POSITIVE_INFINITY)).toBeUndefined()
    expect(formatFileSize(Number.NEGATIVE_INFINITY)).toBeUndefined()
  })
})

describe('validateFile', () => {
  const defaultOptions: FileValidationOptions = {
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: '.pdf',
  }

  // モックファイルを作成するヘルパー関数
  function createMockFile(
    name: string,
    size: number,
    type = 'application/pdf',
  ): File {
    const file = new File(['dummy content'], name, {
      type,
      lastModified: Date.now(),
    })
    
    // サイズプロパティを手動で設定
    Object.defineProperty(file, 'size', {
      value: size,
      writable: false,
    })
    
    return file
  }

  it('有効なPDFファイルはエラーを返さない', () => {
    const file = createMockFile('document.pdf', 1024, 'application/pdf')
    const result = validateFile(file, defaultOptions)
    expect(result).toBeUndefined()
  })

  it('ファイルサイズが上限を超える場合エラーを返す', () => {
    const file = createMockFile('large.pdf', 15 * 1024 * 1024) // 15MB
    const result = validateFile(file, defaultOptions)
    expect(result).toBe('ファイルサイズは10 MB以下にしてください')
  })

  it('PDF以外の拡張子の場合エラーを返す', () => {
    const file = createMockFile('document.txt', 1024, 'text/plain')
    const result = validateFile(file, defaultOptions)
    expect(result).toBe('PDFファイルのみアップロード可能です')
  })

  it('PDFファイルでもMIMEタイプが異なる場合エラーを返す', () => {
    const file = createMockFile('document.pdf', 1024, 'text/plain')
    const result = validateFile(file, defaultOptions)
    expect(result).toBe('PDFファイルのみアップロード可能です')
  })

  it('大文字小文字を区別せずPDF拡張子をチェックする', () => {
    const file1 = createMockFile('document.PDF', 1024, 'application/pdf')
    const file2 = createMockFile('document.Pdf', 1024, 'application/pdf')
    
    expect(validateFile(file1, defaultOptions)).toBeUndefined()
    expect(validateFile(file2, defaultOptions)).toBeUndefined()
  })

  it('ファイルサイズが0の場合は有効とする', () => {
    const file = createMockFile('empty.pdf', 0, 'application/pdf')
    const result = validateFile(file, defaultOptions)
    expect(result).toBeUndefined()
  })

  it('カスタムの最大サイズ設定が適用される', () => {
    const customOptions: FileValidationOptions = {
      maxSize: 5 * 1024 * 1024, // 5MB
      accept: '.pdf',
    }
    
    const file = createMockFile('medium.pdf', 7 * 1024 * 1024) // 7MB
    const result = validateFile(file, customOptions)
    expect(result).toBe('ファイルサイズは5 MB以下にしてください')
  })
})

describe('getFirstFile', () => {
  it('nullの場合undefinedを返す', () => {
    const result = getFirstFile(null)
    expect(result).toBeUndefined()
  })

  it('空のFileListの場合undefinedを返す', () => {
    // 空のFileListをモック
    const emptyFileList = {
      length: 0,
    } as FileList
    
    const result = getFirstFile(emptyFileList)
    expect(result).toBeUndefined()
  })

  it('FileListの最初のファイルを返す', () => {
    const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    
    // FileListをモック
    const fileList = {
      length: 1,
      0: mockFile,
      item: (index: number) => (index === 0 ? mockFile : null),
    } as unknown as FileList
    
    const result = getFirstFile(fileList)
    expect(result).toBe(mockFile)
  })

  it('複数ファイルがある場合でも最初のファイルのみを返す', () => {
    const mockFile1 = new File(['content1'], 'test1.pdf', { type: 'application/pdf' })
    const mockFile2 = new File(['content2'], 'test2.pdf', { type: 'application/pdf' })
    
    // 複数ファイルのFileListをモック
    const fileList = {
      length: 2,
      0: mockFile1,
      1: mockFile2,
      item: (index: number) => {
        if (index === 0) return mockFile1
        if (index === 1) return mockFile2
        return null
      },
    } as unknown as FileList
    
    const result = getFirstFile(fileList)
    expect(result).toBe(mockFile1)
    expect(result).not.toBe(mockFile2)
  })
})
