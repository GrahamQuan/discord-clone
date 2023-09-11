'use client'

import { Fragment, type FC } from 'react'
import { format } from 'date-fns'
import { Member, Message, Profile } from '@prisma/client'
import { Loader2, ServerCrash } from 'lucide-react'
import Image from 'next/image'

import { useChatQuery } from '@/hooks/use-chat-query'

import DiscordIcon from '@/public/discord.png'
import { ChatWelcome } from './chat-welcome'
import CahtItem from './chat-item'
import { useChatSocket } from '@/hooks/use-chat-socket'

const DATE_FORMAT = 'yyyy/MM/dd HH:mm:ss'

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

type Props = {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}

export const ChatMessages: FC<Props> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })

  useChatSocket({ queryKey, addKey, updateKey })

  if (status === 'loading') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      {false && (
        <div className="flex-1 flex justify-center items-center">
          <div>
            <Image
              src={DiscordIcon}
              alt="Discord Clone"
              width={100}
              height={100}
            />
            <p className="text-zinc-600 dark:text-zinc-400">Discord Clone</p>
          </div>
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <CahtItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <ChatWelcome type={type} name={name} />
    </div>
  )
}
