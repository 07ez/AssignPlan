import React, { useState, useRef } from 'react'
import { X, Calendar } from 'lucide-react'

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
        className={`w-full max-w-[480px] bg-white rounded-t-[28px] px-6 pt-3 pb-8 flex flex-col gap-5 shadow-[0_-8px_32px_rgba(25,31,40,0.12)] touch-none select-none ${
          isClosing ? 'animate-sheet-down' : 'animate-sheet-up'
        }`}
      >
        {/* Drag Handle */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full pt-1 pb-1 flex justify-center cursor-grab active:cursor-grabbing"
        >
          <div className="w-10 h-1 rounded-full bg-[#D1D6DB]" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#191F28] tracking-tight">
              {modalType} 추가하기
            </h2>
            <p className="text-[13px] text-[#8B95A1] mt-0.5">
              새로운 {modalType}의 일정과 메모를 등록해 보세요
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
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