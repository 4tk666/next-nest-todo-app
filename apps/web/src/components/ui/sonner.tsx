'use client'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * トースト通知を表示するコンポーネント
 * アクセシビリティを考慮した設定
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="z-50"
      theme="light"
      position="top-right"
      expand
      richColors
      {...props}
    />
  )
}

export { Toaster }
