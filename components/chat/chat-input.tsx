'use client'

import qs from 'query-string'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'
import * as z from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, SendHorizontal } from 'lucide-react'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { ActionTooltip } from '@/components/action-tooltip'
import { useModal } from '@/hooks/use-modal-store'
import { Input } from '@/components/ui/input'

type Props = {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
}

const formSchema = z.object({
  content: z.string().min(1),
})

export const ChatInput: FC<Props> = ({ apiUrl, query, name, type }) => {
  const { onOpen } = useModal()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting
  const hasContent = !!form.watch('content')

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {
    try {
      if (!values.content) return

      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })
      await axios.post(url, values)

      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6 flex items-center">
                  <button
                    type="button"
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  {/* <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div> */}
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    {...field}
                  />
                  <ActionTooltip side="top" label="Send">
                    <div
                      className={cn(
                        'absolute transition right-8 hover:cursor-pointer p-1 rounded-md',
                        hasContent ? 'bg-[#19c37d]' : ''
                      )}
                      onClick={form.handleSubmit(onSubmit)}
                    >
                      <SendHorizontal
                        className={`${hasContent ? '' : 'text-zinc-300'}`}
                        strokeWidth={1.75}
                      />
                    </div>
                  </ActionTooltip>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
