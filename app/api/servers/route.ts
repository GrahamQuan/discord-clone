import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { MemberRole } from '@prisma/client'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

// create server
export const POST = async (req: Request) => {
  try {
    const { name, imageUrl } = await req.json()
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', profileId: profile.id }], // first channel will be named "general"
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }], // admin create server
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVERS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
