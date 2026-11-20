'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useI18n } from '@/i18n/provider'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const DialogRoot = Dialog.Root
export const DialogTrigger = Dialog.Trigger
export const DialogClose = Dialog.Close
export const DialogTitle = Dialog.Title
export const DialogDescription = Dialog.Description

export function DialogContent({ className, children, ...props }: ComponentProps<typeof Dialog.Content>) {
  const { t } = useI18n()
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-[2px]" />
      <Dialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-[2001] max-h-[min(88dvh,760px)] w-[min(100%-1.5rem,34rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-white/10 bg-[#10141c] p-5 text-[#f3efe6] shadow-2xl focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-3 top-3 grid size-9 place-items-center text-[#a39c90] hover:text-white" aria-label={t.close}>
          <X className="size-4" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
