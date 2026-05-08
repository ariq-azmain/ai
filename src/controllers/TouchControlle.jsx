'use client'
import { useEffect } from 'react'

const TouchControlle = () => {
  useEffect(() => {
    const handleContextMenu = (e) => {
      const isInput = e.target.closest('input, textarea, [contenteditable="true"]')
      if (!isInput) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    let timer
    const handleTouchStart = (e) => {
      const isInput = e.target.closest('input, textarea, [contenteditable="true"]')
      if (isInput) return
      
      timer = setTimeout(() => {
        e.preventDefault()
      }, 480)
    }
    
    const handleTouchEnd = () => clearTimeout(timer)
    const handleTouchMove = () => clearTimeout(timer)

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('touchmove', handleTouchMove)
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return <></>;
}

export default TouchControlle