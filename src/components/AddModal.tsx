import React, { useState, useRef } from 'react'
import { Calendar } from 'lucide-react'

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
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isMemoFocused, setIsMemoFocused] = useState(false)
  const startYRef = useRef(0)

  if (!show) return null

  // Pointer drag handler (터치 및 마우스 드래그 모두 지원)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    startYRef.current = e.clientY
    setIsDragging(true)
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const deltaY = e.clientY - startYRef.current
    if (deltaY > 0) {
      setTranslateY(deltaY)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
    if (translateY > 90) {
      onClose()
    } else {
      setTranslateY(0)
    }
  }

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px] ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
    >
      {/* TDS BottomSheet Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-full max-w-[480px] bg-white rounded-t-[28px] px-6 pt-3 pb-8 flex flex-col gap-4 shadow-[0_-8px_32px_rgba(25,31,40,0.12)] select-none ${
          isClosing ? 'animate-sheet-down' : 'animate-sheet-up'
        }`}
      >
        {/* Drag Handle & Header Area (포인터 다운으로 드래그) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full pt-1 pb-2 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Drag Handle Bar */}
          <div className="w-10 h-1 rounded-full bg-[#D1D6DB] mb-3" />

          {/* Centered Title (X버튼 제거 및 중앙 배치) */}
          <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight text-center w-full">
            {modalType} 추가하기
          </h2>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-3">
          {/* Title Input (TDS TextField) */}
          <div
            className={`h-13 rounded-2xl px-4 flex items-center transition-all border ${
              isInputFocused
                ? 'bg-white border-[#3182F6] ring-2 ring-[#3182F6]/15'
                : 'bg-[#F2F4F6] border-transparent hover:border-[#D1D6DB]'
            }`}
          >
            <input
              type="text"
              placeholder={
                modalType === '강의'
                  ? '강의명을 입력해 주세요'
                  : '과제명을 입력해 주세요'
              }
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className="w-full bg-transparent text-[16px] font-medium text-[#191F28] placeholder-[#8B95A1] focus:outline-none"
            />
          </div>

          {/* Date Picker Trigger Row */}
          <div
            onClick={onToggleDatePicker}
            className="h-13 rounded-2xl px-4 bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-[0.99] flex items-center justify-between cursor-pointer transition-all border border-transparent"
          >
            <div className="flex items-center gap-2.5 text-[#4E5968]">
              <Calendar className="w-5 h-5 text-[#8B95A1]" />
              <span className="text-[15px] font-medium">마감 날짜</span>
            </div>

            <span
              ref={dateBadgeRef}
              className="text-[14px] font-semibold text-[#3182F6] bg-[#E8F3FF] px-3 py-1 rounded-xl tabular-nums"
            >
              {selectedDate.year}년 {selectedDate.month}월 {selectedDate.day}일
            </span>
          </div>

          {/* Memo Input */}
          <div
            className={`rounded-2xl p-4 transition-all border min-h-[100px] flex flex-col ${
              isMemoFocused
                ? 'bg-white border-[#3182F6] ring-2 ring-[#3182F6]/15'
                : 'bg-[#F2F4F6] border-transparent hover:border-[#D1D6DB]'
            }`}
          >
            <textarea
              placeholder="메모를 남겨보세요 (선택)"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              onFocus={() => setIsMemoFocused(true)}
              onBlur={() => setIsMemoFocused(false)}
              className="w-full h-full min-h-[70px] bg-transparent text-[15px] font-medium text-[#191F28] placeholder-[#8B95A1] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* TDS XL Primary Button (56px) */}
        <button
          onClick={onSave}
          disabled={!itemTitle.trim()}
          className={`w-full h-14 rounded-2xl text-[17px] font-bold flex items-center justify-center transition-all cursor-pointer ${
            itemTitle.trim()
              ? 'bg-[#3182F6] text-white hover:bg-[#1b64da] active:scale-[0.98] shadow-md'
              : 'bg-[#E5E8EB] text-[#8B95A1] cursor-not-allowed'
          }`}
        >
          저장하기
        </button>
      </div>
    </div>
  )
}