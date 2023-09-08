import { useState, useEffect } from 'react'

function useOperatingSystem() {
  const [operatingSystem, setOperatingSystem] = useState('')

  useEffect(() => {
    const detectOperatingSystem = () => {
      const platform = window.navigator.platform.toLowerCase()

      if (platform.includes('win')) {
        setOperatingSystem('Windows')
      } else if (platform.includes('mac')) {
        setOperatingSystem('macOS')
      } else if (platform.includes('linux')) {
        setOperatingSystem('Linux')
      } else if (platform.includes('android')) {
        setOperatingSystem('Android')
      } else if (platform.includes('ios')) {
        setOperatingSystem('iOS')
      } else {
        setOperatingSystem('Unknown')
      }
    }

    detectOperatingSystem()

    window.addEventListener('resize', detectOperatingSystem)

    return () => {
      window.removeEventListener('resize', detectOperatingSystem)
    }
  }, [])

  return operatingSystem
}

export default useOperatingSystem
