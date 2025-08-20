'use client'

import * as Collapsible from '@radix-ui/react-collapsible'
import clsx from 'clsx'
import { useState } from 'react'
import {
  HiChevronRight,
} from 'react-icons/hi2'

type AccordionProps = {
  title: string
  content: React.ReactNode
}

export function Accordion({ title, content }: AccordionProps) {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="w-full rounded-md border-[0.5px] border-[#bdc1c6] p-4"
    >
      <div className="flex items-center gap-[10px]">
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className="rounded-md p-[5px] text-sm font-medium hover:font-bold hover:text-white cursor-pointer hover:bg-white/30"
          >
            <HiChevronRight
              className={clsx(
                'ml-1 h-4 w-4 transition-transform',
                open && 'rotate-90',
              )}
            />
          </button>
        </Collapsible.Trigger>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <Collapsible.Content className="mt-[10px] overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {content}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
