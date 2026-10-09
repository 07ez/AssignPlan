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
  // 기본 높이 및 확장 높이 계산
  const getStandardHeight = () => Math.min(500, typeof window !== 'undefined' ? window.innerHeight * 0.65 : 500)
  const getExpandedHeight = () => (typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.88, 720) : 680)

  const [sheetHeight, setSheetHeight] = useState<number>(getStandardHeight())
  const [isDragging, setIsDragging] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isMemoFocused, setIsMemoFocused] = useState(false)

  const startYRef = useRef(0)
  const startHeightRef = useRef(getStandardHeight())

  // 모달 오픈 시 표준 높이로 리셋
  useEffect(() => {
    if (show) {
      const std = getStandardHeight()
      setSheetHeight(std)
      setIsDragging(false)
    }
  }, [show])

  if (!show) return null

  // ─── 1:1 핸들 드래그 (오직 회색 핸들 바만 잡아서 조작) ───
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    startYRef.current = e.clientY
    startHeightRef.current = sheetHeight
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
    // 마우스/손가락 위치에 따라 실시간 1:1로 높이 증감
    const newHeight = startHeightRef.current - deltaY
    const minHeight = 120
    const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.92 : 750

    setSheetHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)))
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }

    const windowH = typeof window !== 'undefined' ? window.innerHeight : 800
    const closeThreshold = windowH * 0.35 // 35% 이하로 내리면 닫기
    const standardH = getStandardHeight()
    const expandedH = getExpandedHeight()
    const snapMidpoint = (standardH + expandedH) / 2

    if (sheetHeight < closeThreshold) {
      // 아래로 많이 내렸으면 닫기
      onClose()
    } else if (sheetHeight > snapMidpoint) {
      // 위로 충분히 올렸으면 전체 화면 확장으로 스냅
      setSheetHeight(expandedH)
    } else {
      // 그 외에는 기본 높이로 스냅
      setSheetHeight(standardH)
    }
  }

  const isExpanded = sheetHeight > (getStandardHeight() + getExpandedHeight()) / 2

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px] ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
    >
      {/* TDS BottomSheet Container (실시간 1:1 높이 조절) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          height: `${sheetHeight}px`,
          transition: isDragging
            ? 'none'
            : 'height 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-full max-w-[480px] bg-white rounded-t-[28px] px-6 pt-1 pb-8 flex flex-col justify-between shadow-[0_-8px_32px_rgba(25,31,40,0.14)] select-none ${
          isClosing ? 'animate-sheet-down' : 'animate-sheet-up'
        }`}
      >
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          {/* Grab Handle Bar (오직 이 알약 핸들만 잡아서 1:1 드래그 가능) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full py-2.5 flex justify-center cursor-grab active:cursor-grabbing touch-none select-none group"
            title="핸들을 잡고 위나 아래로 드래그하세요"
          >
            <div className="w-12 h-1.5 rounded-full bg-[#D1D6DB] group-hover:bg-[#B0B8C1] group-active:bg-[#8B95A1] group-active:scale-x-110 transition-all" />
          </div>

          {/* Centered Title */}
          <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight text-center w-full pb-1">
            {modalType} 추가하기
          </h2>

          {/* Form Fields */}
          <div className="flex flex-col gap-3 flex-1 min-h-0">
            {/* Title Input (TDS TextField) */}
            <div
              className={`h-13 rounded-2xl px-4 flex items-center transition-all border shrink-0 ${
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
              className="h-13 rounded-2xl px-4 bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-[0.99] flex items-center justify-between cursor-pointer transition-all border border-transparent shrink-0"
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

            {/* Memo Input (확장 시 넉넉하게 늘어남) */}
            <div
              className={`rounded-2xl p-4 transition-all border flex flex-col flex-1 min-h-[90px] ${
                isExpanded ? 'min-h-[160px]' : 'min-h-[90px]'
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
                className="w-full h-full min-h-[60px] bg-transparent text-[15px] font-medium text-[#191F28] placeholder-[#8B95A1] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* TDS XL Primary Button (56px) */}
        <button
          onClick={onSave}
          disabled={!itemTitle.trim()}
          className={`w-full h-14 rounded-2xl text-[17px] font-bold flex items-center justify-center transition-all cursor-pointer mt-3 shrink-0 ${
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