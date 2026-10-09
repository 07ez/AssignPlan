import React from 'react'

interface ToastProps {
  show: boolean
  message: string
}

export const Toast: React.FC<ToastProps> = ({ show, message }) => {
  if (!show) return null

  return (
    <div className="fixed bottom-12 inset-x-0 z-[100] flex justify-center pointer-events-none px-4">
      <div className="bg-[#191F28] text-white text-[14px] font-medium px-5 py-3 rounded-2xl shadow-[0_8px_24px_rgba(25,31,40,0.24)] animate-toast flex items-center justify-center text-center max-w-max">
        <span>{message}</span>
      </div>
    </div>
  )
}