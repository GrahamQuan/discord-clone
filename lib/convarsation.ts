import { db } from '@/lib/db'

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation
  conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId))

  if (!conversation) {
    conversation = createNewConversation(memberOneId, memberTwoId)
  }

  return conversation
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
    return conversation
  } catch (error) {
    console.log('FIND_CONVERSATION', error)
    return null
  }
}

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    const conversation = await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
    return conversation
  } catch (error) {
    console.log('[CREATE_NEW_CONVERSATION]', error)
    return null
  }
}
