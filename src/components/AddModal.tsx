import React, { useState, useRef, useEffect } from 'react'
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
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isMemoFocused, setIsMemoFocused] = useState(false)
  const startYRef = useRef(0)

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (show) {
      setTranslateY(0)
      setIsExpanded(false)
    }
  }, [show])

  if (!show) return null

  // Pointer drag handler (핸들러 잡고 올리거나 내리기)
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

    // 확장 상태에서는 위로 더 많이 올라가는 것 제한, 축소 상태에서는 아래/위 모두 자유롭게 이동
    if (isExpanded) {
      setTranslateY(deltaY > 0 ? deltaY : deltaY * 0.3)
    } else {
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

    if (!isExpanded) {
      // 축소(기본) 상태에서:
      if (translateY > 80) {
        // 아래로 충분히 내리면 닫기
        onClose()
      } else if (translateY < -40) {
        // 위로 올리면 전체 화면으로 확장
        setIsExpanded(true)
        setTranslateY(0)
      } else {
        setTranslateY(0)
      }
    } else {
      // 확장 상태에서:
      if (translateY > 180) {
        // 크게 내리면 닫기
        onClose()
      } else if (translateY > 50) {
        // 살짝 내리면 기본 크기로 축소
        setIsExpanded(false)
        setTranslateY(0)
      } else {
        setTranslateY(0)
      }
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
          transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-full max-w-[480px] bg-white rounded-t-[28px] px-6 pt-2.5 pb-8 flex flex-col justify-between shadow-[0_-8px_32px_rgba(25,31,40,0.12)] select-none transition-[height] ${
          isExpanded ? 'h-[85vh]' : 'h-auto max-h-[85vh]'
        } ${isClosing ? 'animate-sheet-down' : 'animate-sheet-up'}`}
      >
        <div className="flex flex-col gap-4">
          {/* Handler & Header Area (위/아래 드래그 제스처 감지) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full pt-1 pb-2 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none"
          >
            {/* Grab Handle Pill */}
            <div className="w-11 h-1.5 rounded-full bg-[#D1D6DB] hover:bg-[#B0B8C1] active:bg-[#8B95A1] transition-colors mb-2.5" />

            {/* Centered Title */}
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
              className={`rounded-2xl p-4 transition-all border flex flex-col ${
                isExpanded ? 'min-h-[180px] flex-1' : 'min-h-[110px]'
              } ${
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
        </div>

        {/* TDS XL Primary Button (56px) */}
        <button
          onClick={onSave}
          disabled={!itemTitle.trim()}
          className={`w-full h-14 rounded-2xl text-[17px] font-bold flex items-center justify-center transition-all cursor-pointer mt-4 ${
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