import type { FC } from 'react'

type Props = {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className='h-full flex justify-center items-center'>
      {children}
    </div>
  )
}

export default Layout
