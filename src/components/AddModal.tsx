import React, { useState, useRef } from 'react'
import { X, Check } from 'lucide-react'

interface DateType {
  year: number
  month: number
  day: number
}

interface AddModalProps {
  show: boolean
  isClosing: boolean
  modalType: '강의' | '과제'
  itemTitle: string
  memo: string
  selectedDate: DateType
  dateBadgeRef: React.RefObject<HTMLSpanElement | null>
  setItemTitle: (val: string) => void
  setMemo: (val: string) => void
  onClose: () => void
  onSave: () => void
  onToggleDatePicker: () => void
}

export const AddModal: React.FC<AddModalProps> = ({
  show,
  isClosing,
  modalType,
  itemTitle,
  memo,
  selectedDate,
  dateBadgeRef,
  setItemTitle,
  setMemo,
  onClose,
  onSave,
  onToggleDatePicker,
}) => {
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)

  if (!show) return null

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaY = e.touches[0].clientY - startYRef.current
    if (deltaY > 0) setTranslateY(deltaY)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (translateY > 120) {
      onClose()
    } else {
      setTranslateY(0)
    }
  }

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      {/* Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0, 0, 0.2, 1)',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          borderTop: '1px solid #e0e0e0',
          width: '100%',
          maxWidth: '480px',
          padding: '0 0 40px 0',
          boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0',
        }}
        className={`flex flex-col touch-none select-none ${
          isClosing ? 'animate-modal-down' : 'animate-modal-up'
        }`}
      >
        {/* Drag handle */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing"
        >
          <div
            style={{
              width: '36px',
              height: '5px',
              borderRadius: '9999px',
              backgroundColor: '#e0e0e0',
            }}
          />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-3">
          {/* Close — dark utility button */}
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#1d1d1f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
            }}
            className="active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" style={{ color: '#ffffff', strokeWidth: 2.2 }} />
          </button>

          <h2
            style={{
              fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.374px',
              color: '#1d1d1f',
            }}
          >
            {modalType} 추가
          </h2>

          {/* Save — primary pill button */}
          <button
            onClick={onSave}
            disabled={!itemTitle.trim()}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              backgroundColor: itemTitle.trim() ? '#0066cc' : '#f5f5f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: itemTitle.trim() ? 'pointer' : 'not-allowed',
              border: 'none',
            }}
            className="transition-all active:scale-95"
          >
            <Check
              className="w-4 h-4"
              style={{
                color: itemTitle.trim() ? '#ffffff' : '#cccccc',
                strokeWidth: 2.5,
              }}
            />
          </button>
        </div>

        {/* Hairline */}
        <div style={{ height: '1px', backgroundColor: '#f0f0f0', marginBottom: '4px' }} />

        {/* Form fields */}
        <div className="flex flex-col gap-2 px-5 mt-3">
          {/* Title input */}
          <div
            style={{
              backgroundColor: '#f5f5f7',
              borderRadius: '11px',
              padding: '14px 16px',
            }}
          >
            <input
              type="text"
              placeholder={modalType === '강의' ? '강의명을 입력하세요' : '과제명을 입력하세요'}
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '17px',
                fontWeight: 400,
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
              }}
              className="placeholder-[#7a7a7a]"
            />
          </div>

          {/* Date selector */}
          <div
            onClick={onToggleDatePicker}
            style={{
              backgroundColor: '#f5f5f7',
              borderRadius: '11px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            className="active:bg-[#e8e8ea] transition-colors"
          >
            <span
              style={{
                fontSize: '17px',
                fontWeight: 400,
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
              }}
            >
              날짜
            </span>
            <span
              ref={dateBadgeRef}
              style={{
                fontSize: '14px',
                fontWeight: 400,
                letterSpacing: '-0.224px',
                color: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.08)',
                padding: '4px 12px',
                borderRadius: '9999px',
              }}
            >
              {selectedDate.year}.{String(selectedDate.month).padStart(2, '0')}.{String(selectedDate.day).padStart(2, '0')}
            </span>
          </div>

          {/* Memo textarea */}
          <div
            style={{
              backgroundColor: '#f5f5f7',
              borderRadius: '11px',
              padding: '14px 16px',
              minHeight: '110px',
            }}
          >
            <textarea
              placeholder="메모 (선택사항)"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '80px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: '17px',
                fontWeight: 400,
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
              }}
              className="placeholder-[#7a7a7a]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}