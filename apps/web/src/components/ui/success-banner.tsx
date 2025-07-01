import { cn } from '../../lib/utils/class-utils'

type SuccessBannerProps = {
  /** 成功メッセージのタイトル */
  title?: string
  /** 成功メッセージの説明 */
  message: string
  /** カスタムクラス名 */
  className?: string
}

/**
 * 成功メッセージを表示するバナーコンポーネント
 * サインアップ完了やその他の成功状態の表示に使用します
 */
export function SuccessBanner({
  title,
  message,
  className,
}: SuccessBannerProps) {
  return (
    <output
      className={cn(
        'block',
        'p-3',
        'text-sm',
        'bg-green-100 border border-green-400',
        'text-green-700 rounded',
        className,
      )}
      aria-live="polite"
    >
      {title && <p className="font-semibold">{title}</p>}
      <p>{message}</p>
    </output>
  )
}
