'use client'

import * as Tabs from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils/class-utils'

type TabItem = {
  value: string
  label: string
  triggerClassName?: string
}

type TabsComponentProps = {
  items: TabItem[]
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
  listClassName?: string
}

/**
 * 汎用的な制御コンポーネントのTabsコンポーネント
 * @param items - タブの配列（value, label, content, triggerClassNameを含む）
 * @param value - 現在選択されているタブの値（制御）
 * @param onValueChange - タブ変更時のコールバック関数
 * @param className - Tabs.Rootに適用されるクラス名
 * @param listClassName - Tabs.Listに適用されるクラス名
 */
export function TabsComponent({
  items,
  value,
  onValueChange,
  className,
  listClassName,
  children,
}: TabsComponentProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <Tabs.Root
      value={value}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      {/* タブトリガー部分 */}
      <Tabs.List
        className={cn('flex border-b-[0.5px] border-gray-200 mb-6', listClassName)}
      >
        {items.map((item) => (
          <Tabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'px-4 py-2 text-sm font-medium',
              'border-b-2 border-transparent',
              'hover:font-bold',
              'data-[state=active]:font-bold data-[state=active]:border-b-white',
              'cursor-pointer',
              item.triggerClassName,
            )}
          >
            {item.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* 各タブのコンテンツを定義（アクセシビリティのため） */}
      {items.map((item) => (
        <Tabs.Content
          key={item.value}
          value={item.value}
          className="outline-none"
        >
          {value === item.value ? children : null}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
