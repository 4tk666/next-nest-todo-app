import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils/class-utils'

type ButtonVariant = 'primary' | 'outline'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

export function Button({
  children,
  disabled,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const getVariantStyles = (variant: ButtonVariant): string => {
    switch (variant) {
      case 'primary':
        return cn(
          'text-white',
          'bg-indigo-600 hover:bg-indigo-500',
          'focus-visible:outline-indigo-600',
          'disabled:bg-gray-300 disabled:text-gray-500',
        )
      case 'outline':
        return cn(
          'text-indigo-600 border border-indigo-600',
          'bg-transparent hover:bg-indigo-50',
          'focus-visible:outline-indigo-600',
          'disabled:border-gray-300 disabled:text-gray-300 disabled:bg-transparent',
        )
      default:
        return ''
    }
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'group cursor-pointer relative',
        'flex w-full justify-center',
        'px-4 py-2',
        'rounded-md',
        'text-sm font-semibold',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed',
        getVariantStyles(variant),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
