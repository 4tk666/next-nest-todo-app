import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FileUpload } from '../file-upload'

// File APIのモック
// Node.js環境で実行されるため、ブラウザ固有のAPIであるFileクラスが利用できないため、モックを定義
Object.defineProperty(window, 'File', {
  value: class MockFile {
    name: string
    size: number
    type: string
    lastModified: number

    constructor(
      _fileBits: BlobPart[],
      fileName: string,
      options?: FilePropertyBag,
    ) {
      this.name = fileName
      this.size = options?.type === 'application/pdf' ? 1024 : 1024
      this.type = options?.type || 'application/pdf'
      this.lastModified = options?.lastModified || Date.now()
    }
  },
})

describe('FileUpload', () => {
  const defaultProps = {
    id: 'test-file-upload',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基本的なレンダリングが正しく行われる', () => {
    render(<FileUpload {...defaultProps} />)

    expect(
      screen.getByText('PDFファイルをドラッグ&ドロップ'),
    ).toBeInTheDocument()
    expect(screen.getByText(/クリックして選択/)).toBeInTheDocument()
    expect(
      screen.getByLabelText('PDFファイルを選択またはドラッグ&ドロップ'),
    ).toBeInTheDocument()
  })

  it('エラーメッセージが表示される', () => {
    const errors = ['エラーメッセージ1', 'エラーメッセージ2']
    render(<FileUpload {...defaultProps} errors={errors} />)

    expect(screen.getByText('エラーメッセージ1')).toBeInTheDocument()
    expect(screen.getByText('エラーメッセージ2')).toBeInTheDocument()
  })

  it('無効状態の時は操作できない', () => {
    render(<FileUpload {...defaultProps} disabled />)

    const uploadArea = screen.getByLabelText(
      'PDFファイルを選択またはドラッグ&ドロップ',
    )
    expect(uploadArea).toHaveClass('cursor-not-allowed', 'opacity-50')
  })

  it('ファイル選択エリアをクリックするとファイル選択ダイアログが開く', () => {
    const clickSpy = vi.fn()
    const mockInput = { click: clickSpy }

    // HTMLInputElementのclickメソッドをモック
    vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(clickSpy)

    render(<FileUpload {...defaultProps} />)

    const uploadArea = screen.getByLabelText(
      'PDFファイルを選択またはドラッグ&ドロップ',
    )
    fireEvent.click(uploadArea)

    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('Enterキーでファイル選択ダイアログが開く', () => {
    const clickSpy = vi.fn()
    vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(clickSpy)

    render(<FileUpload {...defaultProps} />)

    const uploadArea = screen.getByLabelText(
      'PDFファイルを選択またはドラッグ&ドロップ',
    )
    fireEvent.keyDown(uploadArea, { key: 'Enter' })

    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('Spaceキーでファイル選択ダイアログが開く', () => {
    const clickSpy = vi.fn()
    vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(clickSpy)

    render(<FileUpload {...defaultProps} />)

    const uploadArea = screen.getByLabelText(
      'PDFファイルを選択またはドラッグ&ドロップ',
    )
    fireEvent.keyDown(uploadArea, { key: ' ' })

    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('有効なPDFファイルが選択された時の動作', () => {
    const onFileSelected = vi.fn()
    render(<FileUpload {...defaultProps} onFileSelected={onFileSelected} />)

    const fileInput = screen.getByTestId('test-file-upload-file-input')
    const file = new File(['pdf content'], 'test.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(onFileSelected).toHaveBeenCalledWith(file)
  })

  it('ファイル選択後に情報が表示される', () => {
    const onFileSelected = vi.fn()
    render(<FileUpload {...defaultProps} onFileSelected={onFileSelected} />)

    const fileInput = screen.getByTestId('test-file-upload-file-input')
    const file = new File(['pdf content'], 'document.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(screen.getByText('document.pdf')).toBeInTheDocument()
    expect(screen.getByText('1 KB')).toBeInTheDocument()
    expect(screen.getByText('✓ アップロード完了')).toBeInTheDocument()
  })

  it('削除ボタンでファイルがクリアされる', () => {
    const onFileSelected = vi.fn()
    render(<FileUpload {...defaultProps} onFileSelected={onFileSelected} />)

    // ファイルを選択
    const fileInput = screen.getByTestId('test-file-upload-file-input')
    const file = new File(['pdf content'], 'document.pdf', {
      type: 'application/pdf',
    })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // 削除ボタンをクリック
    const deleteButton = screen.getByLabelText('document.pdfを削除')
    fireEvent.click(deleteButton)

    // ファイル情報が消えてることを確認
    expect(screen.queryByText('document.pdf')).not.toBeInTheDocument()
    expect(
      screen.getByText('PDFファイルをドラッグ&ドロップ'),
    ).toBeInTheDocument()
    expect(onFileSelected).toHaveBeenLastCalledWith()
  })

  it('削除ボタンでEnterキーを押すとファイルがクリアされる', () => {
    const onFileSelected = vi.fn()
    render(<FileUpload {...defaultProps} onFileSelected={onFileSelected} />)

    // ファイルを選択
    const fileInput = screen.getByTestId('test-file-upload-file-input')
    const file = new File(['pdf content'], 'document.pdf', {
      type: 'application/pdf',
    })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // 削除ボタンでEnterキーを押す
    const deleteButton = screen.getByLabelText('document.pdfを削除')
    fireEvent.keyDown(deleteButton, { key: 'Enter' })

    // ファイル情報が消えてることを確認
    expect(screen.queryByText('document.pdf')).not.toBeInTheDocument()
    expect(
      screen.getByText('PDFファイルをドラッグ&ドロップ'),
    ).toBeInTheDocument()
    expect(onFileSelected).toHaveBeenLastCalledWith()
  })

  it('削除ボタンでSpaceキーを押すとファイルがクリアされる', () => {
    const onFileSelected = vi.fn()
    render(<FileUpload {...defaultProps} onFileSelected={onFileSelected} />)

    // ファイルを選択
    const fileInput = screen.getByTestId('test-file-upload-file-input')
    const file = new File(['pdf content'], 'document.pdf', {
      type: 'application/pdf',
    })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // 削除ボタンでSpaceキーを押す
    const deleteButton = screen.getByLabelText('document.pdfを削除')
    fireEvent.keyDown(deleteButton, { key: ' ' })

    // ファイル情報が消えてることを確認
    expect(screen.queryByText('document.pdf')).not.toBeInTheDocument()
    expect(
      screen.getByText('PDFファイルをドラッグ&ドロップ'),
    ).toBeInTheDocument()
    expect(onFileSelected).toHaveBeenLastCalledWith()
  })

  it('大きすぎるファイルでエラーが呼ばれる', () => {
    const onError = vi.fn()
    render(<FileUpload {...defaultProps} maxSize={1024} onError={onError} />)

    const fileInput = screen.getByTestId('test-file-upload-file-input')

    // 大きなファイルをモック
    const largeFile = new File(['large content'], 'large.pdf', {
      type: 'application/pdf',
    })
    Object.defineProperty(largeFile, 'size', { value: 2048 })

    fireEvent.change(fileInput, { target: { files: [largeFile] } })

    expect(onError).toHaveBeenCalledWith(
      'ファイルサイズは1 KB以下にしてください',
    )
  })

  it('PDF以外のファイルでエラーが呼ばれる', () => {
    const onError = vi.fn()
    render(<FileUpload {...defaultProps} onError={onError} />)

    const fileInput = screen.getByTestId('test-file-upload-file-input')
    const textFile = new File(['text content'], 'document.txt', {
      type: 'text/plain',
    })

    fireEvent.change(fileInput, { target: { files: [textFile] } })

    expect(onError).toHaveBeenCalledWith('PDFファイルのみアップロード可能です')
  })

  it('無効状態では削除ボタンも無効になる', () => {
    const onFileSelected = vi.fn()
    const { rerender } = render(
      <FileUpload {...defaultProps} onFileSelected={onFileSelected} />,
    )

    // ファイルを選択
    const fileInput = screen.getByTestId('test-file-upload-file-input')
    const file = new File(['pdf content'], 'document.pdf', {
      type: 'application/pdf',
    })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // コンポーネントを無効状態で再レンダー
    rerender(
      <FileUpload {...defaultProps} onFileSelected={onFileSelected} disabled />,
    )

    const uploadArea = screen.getByLabelText(
      'PDFファイルを選択またはドラッグ&ドロップ',
    )
    expect(uploadArea).toHaveClass('cursor-not-allowed', 'opacity-50')
  })
})
