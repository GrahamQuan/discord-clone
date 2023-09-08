import { NextResponse } from 'next/server'
import { utapi } from 'uploadthing/server'

type ParamsType = {
  params: {
    imageId?: string
  }
}

// remove image from cloud when user clear image
export const DELETE = async (req: Request, { params }: ParamsType) => {
  const { imageId } = params
  if (!imageId) {
    return new NextResponse('Image ID Missing', { status: 400 })
  }
  try {
    await utapi.deleteFiles(imageId)
  } catch (error) {
    console.log(error)
    NextResponse.error()
  }
}
