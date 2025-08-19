'use client'

import { Button } from '@/components/ui/button'
import { SideOverlay } from '@/components/ui/side-overlay'
import { clsx } from 'clsx'
import { useState } from 'react'

/**
 * Todoページのクライアント側コンポーネント
 * タスク追加モーダルの状態管理を担当
 */
export function TaskCreate() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <>
      <Button
        variant="outline"
        className={clsx('max-w-[120px]')}
        onClick={openForm}
      >
        タスクを作成
      </Button>

      {isFormOpen && (
        <SideOverlay
          title="新しいタスクを作成"
          isOpen={isFormOpen}
          onClose={closeForm}
        >
          <div>あとで追加する</div>
        </SideOverlay>
      )}
    </>
  )
}
