import React from 'react'

interface ToastProps {
  show: boolean
  message: string
}

export const Toast: React.FC<ToastProps> = ({ show, message }) => {
  if (!show) return null

  return (
    <div
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-fade-up"
    >
      <div
        style={{
          backgroundColor: 'rgba(29, 29, 31, 0.88)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 400,
          letterSpacing: '-0.224px',
          padding: '10px 20px',
          borderRadius: '9999px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
        }}
      >
        {message}
      </div>
    </div>
  )
}