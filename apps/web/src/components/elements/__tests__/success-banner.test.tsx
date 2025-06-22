import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SuccessBanner } from '../success-banner'

describe('SuccessBanner コンポーネント', () => {
  it('メッセージが正しく表示されること', () => {
    render(<SuccessBanner message="操作が成功しました" />)

    expect(screen.getByText('操作が成功しました')).toBeInTheDocument()
  })

  it('タイトル付きでメッセージが正しく表示されること', () => {
    render(
      <SuccessBanner
        title="成功"
        message="アカウントが作成されました"
      />
    )

    expect(screen.getByText('成功')).toBeInTheDocument()
    expect(screen.getByText('アカウントが作成されました')).toBeInTheDocument()
  })

  it('タイトルが太字で表示されること', () => {
    render(
      <SuccessBanner
        title="成功"
        message="操作が完了しました"
      />
    )

    const title = screen.getByText('成功')
    expect(title).toHaveClass('font-semibold')
  })

  it('適切なアクセシビリティ属性が設定されること', () => {
    render(<SuccessBanner message="成功メッセージ" />)

    const banner = screen.getByText('成功メッセージ').parentElement
    expect(banner).toHaveAttribute('aria-live', 'polite')
  })

  it('カスタムクラス名が適用されること', () => {
    render(
      <SuccessBanner
        message="カスタムメッセージ"
        className="custom-class"
      />
    )

    const banner = screen.getByText('カスタムメッセージ').parentElement
    expect(banner).toHaveClass('custom-class')
  })

  it('デフォルトのスタイルクラスが適用されること', () => {
    render(<SuccessBanner message="テストメッセージ" />)

    const banner = screen.getByText('テストメッセージ').parentElement
    expect(banner).toHaveClass('bg-green-100', 'border-green-400', 'text-green-700', 'rounded')
  })
})
