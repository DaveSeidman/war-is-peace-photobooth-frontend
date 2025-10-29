import React from 'react'
import './index.scss'

// Transparent clickable overlay positioned where ENGAGE button appears in idle.mp4
export default function EngageButton({ active, onClick }) {
  if (!active) return null

  return (
    <div
      className="engage-button"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Engage"
    />
  )
}
