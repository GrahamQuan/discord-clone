import { type FC } from 'react'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

type Props = {
  params: {
    inviteCode: string
  }
}

const InviteCodePage: FC<Props> = async ({ params }) => {
  const profile = await currentProfile()
  if (!profile) return redirectToSignIn()
  if (!params.inviteCode) return redirect('/')

  // find server
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })
  if (existingServer) return redirect(`/servers/${existingServer.id}`)

  // member join server
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  })
  if (server) return redirect(`/servers/${server.id}`)

  return null
}

export default InviteCodePage
