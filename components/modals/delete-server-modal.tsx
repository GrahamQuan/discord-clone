'use client'

import axios from 'axios'
import { type ChangeEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { server } = data
  const isModalOpen = isOpen && type === 'deleteServer'
  const isNotConfirm = value !== server?.name

  const onConfirm = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/servers/${server?.id}`)

      onClose()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation()
    setValue(e.target.value)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            Server{' '}
            <span className="text-indigo-500 font-semibold">
              {server?.name}
            </span>{' '}
            will be permanently deleted.
          </DialogDescription>
          <Input
            disabled={isLoading}
            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 mt-3"
            placeholder="Input the server name to confirm"
            value={value}
            onChange={onInput}
          />
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading || isNotConfirm}
              variant="primary"
              className={`${isNotConfirm ? 'cursor-not-allowed' : ''}`}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
