'use client'
import { useEffect, useState } from 'react'

import Drag from '@/providers/Drag'

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)


  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement
      setIsFullscreen(!!fsElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange) // Safari

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [])

  const enterFullscreen = async () => {
    const elem = document.documentElement
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen()
      }

    } catch (err) {
      console.log('Fullscreen failed:', err)
    }
  }

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }

  if (isFullscreen) return null

  return (
    <Drag>
      <button
        onClick={enterFullscreen}
        className="select-none bg-brand-400 px-1 py-1.5 rounded-lg font-black text-md m-2.5 fixed"
      >
        Enter Full Screen
      </button>
    </Drag>
  )
}