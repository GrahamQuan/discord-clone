import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, // not admin member
        },
        members: {
          some: {
            profileId: profile.id, // member is in the server
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id, // delete member id
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVER_ID_LEAVE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}