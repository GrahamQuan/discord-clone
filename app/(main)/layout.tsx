import { type ReactNode, type FC } from 'react'

import NavigationSidebar from '@/components/navigation/navigation-sidebar'

type Props = {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  )
}

export default MainLayout
