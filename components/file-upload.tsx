'use client'

import Image from 'next/image'
import { type FC } from 'react'
import { Axis3dIcon, X } from 'lucide-react'
import axios from 'axios'

import { UploadDropzone } from '@/lib/uploadthing'

import '@uploadthing/react/styles.css'

type Props = {
  onChange: (url?: string) => void
  value: string
  endpoint: 'messageFile' | 'serverImage'
}

export const FileUpload: FC<Props> = ({ onChange, value, endpoint }) => {
  const fileType = value?.split('.').pop()

  const deleteImage = async () => {
    onChange('')
    const imageId = value?.split('/').pop()
    try {
      await axios.delete(`/api/uploadthing/${imageId}`)
    } catch (error) {
      console.log(error)
    }
  }

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={deleteImage}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
    />
  )
}
