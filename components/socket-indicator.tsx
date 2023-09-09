'use client'

import { SignalHigh, SignalLow } from 'lucide-react'

import { useSocket } from '@/components/providers/socket-provider'
import { ActionTooltip } from '@/components/action-tooltip'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <>
        <SignalHigh className="absolute text-gray-400" />
        <ActionTooltip label="Fallback: Polling every 1s" side="bottom">
          <SignalLow className="text-yellow-600 relative inset-x-0 inset-y-0" />
        </ActionTooltip>
      </>
    )
  }

  return (
    <ActionTooltip label="Live: Real-time updates" side="bottom">
      <SignalHigh className="text-emerald-600" />
    </ActionTooltip>
  )
}
