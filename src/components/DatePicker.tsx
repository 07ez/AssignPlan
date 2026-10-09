import React from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

interface DateType {
  year: number
  month: number
  day: number
}

interface DatePickerModalProps {
  show: boolean
  isClosing: boolean
  pickerOrigin: string
  currentYear: number
  currentMonth: number
  selectedDate: DateType
  today: DateType
  isWheelPickerMode: boolean
  onToggleWheelPicker: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDate: (date: DateType) => void
  onClose: () => void
  onYearScroll: (e: React.UIEvent<HTMLDivElement>) => void
  onMonthScroll: (e: React.UIEvent<HTMLDivElement>) => void
  getDaysInMonth: (year: number, month: number) => number
  getFirstDayOfMonth: (year: number, month: number) => number
  isPastDate: (year: number, month: number, day: number) => boolean
  slideDirection: 'left' | 'right'
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  show,
  isClosing,
  pickerOrigin,
  currentYear,
  currentMonth,
  selectedDate,
  today,
  isWheelPickerMode,
  onToggleWheelPicker,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onClose,
  onYearScroll,
  onMonthScroll,
  getDaysInMonth,
  getFirstDayOfMonth,
  isPastDate,
  slideDirection,
}) => {
  if (!show) return null

  const daysCount = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const daysInMonthArray = Array.from({ length: daysCount }, (_, i) => i + 1)
  const emptyDaysBefore = Array.from({ length: firstDay })
  const emptyDaysAfter = Array.from({ length: 42 - (firstDay + daysCount) })

  const yearsList = Array.from({ length: 6 }, (_, i) => today.year + i)
  const monthsList = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ transformOrigin: pickerOrigin }}
        className={`w-full max-w-[360px] bg-white rounded-[24px] p-6 shadow-[0_12px_36px_rgba(25,31,40,0.18)] border border-[#E5E8EB] flex flex-col gap-4 ${
          isClosing ? 'animate-popover-out' : 'animate-popover-in'
        }`}
      >
        {/* Month Selector Header */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={onToggleWheelPicker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#F2F4F6] transition-colors cursor-pointer"
          >
            <span className="text-[18px] font-bold text-[#191F28] tracking-tight tabular-nums">
              {currentYear}년 {currentMonth}월
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#4E5968] transition-transform duration-200 ${
                isWheelPickerMode ? 'rotate-180' : ''
              }`}
            />
          </button>

          {!isWheelPickerMode && (
            <div className="flex items-center gap-1">
              <button
                onClick={onPrevMonth}
                disabled={currentYear === today.year && currentMonth <= today.month}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#4E5968] hover:bg-[#F2F4F6] disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer"
                aria-label="이전 달"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2]" />
              </button>
              <button
                onClick={onNextMonth}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#4E5968] hover:bg-[#F2F4F6] active:scale-95 transition-all cursor-pointer"
                aria-label="다음 달"
              >
                <ChevronRight className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          )}
        </div>

        {isWheelPickerMode ? (
          /* Wheel Picker Mode */
          <div className="flex justify-center items-center gap-2 py-2 relative h-[180px]">
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-10 bg-[#F2F4F6] rounded-xl pointer-events-none" />

            <div
              onScroll={onYearScroll}
              className="flex-1 h-full overflow-y-auto py-[70px] text-center snap-y snap-mandatory scrollbar-none"
            >
              {yearsList.map((y) => (
                <div
                  key={y}
                  className={`h-10 flex items-center justify-center snap-center text-[15px] font-semibold transition-all ${
                    y === currentYear
                      ? 'text-[#3182F6] font-bold text-[17px] scale-105'
                      : 'text-[#8B95A1]'
                  }`}
                >
                  {y}년
                </div>
              ))}
            </div>

            <div
              onScroll={onMonthScroll}
              className="flex-1 h-full overflow-y-auto py-[70px] text-center snap-y snap-mandatory scrollbar-none"
            >
              {monthsList.map((m) => {
                const isDisabled = currentYear === today.year && m < today.month
                return (
                  <div
                    key={m}
                    className={`h-10 flex items-center justify-center snap-center text-[15px] font-semibold transition-all ${
                      isDisabled
                        ? 'text-[#D1D6DB] opacity-40'
                        : m === currentMonth
                        ? 'text-[#3182F6] font-bold text-[17px] scale-105'
                        : 'text-[#8B95A1]'
                    }`}
                  >
                    {m}월
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Calendar Grid Mode */
          <div
            key={`${currentYear}-${currentMonth}`}
            className={
              slideDirection === 'left'
                ? 'animate-slide-from-left'
                : 'animate-slide-from-right'
            }
          >
            <div className="grid grid-cols-7 text-center text-[12px] font-semibold text-[#8B95A1] py-1 mb-1">
              <span>일</span>
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span>토</span>
            </div>

            <div className="grid grid-cols-7 text-center gap-y-1 text-[14px]">
              {emptyDaysBefore.map((_, index) => (
                <div key={`empty-b-${index}`} className="w-9 h-9" />
              ))}

              {daysInMonthArray.map((day) => {
                const isSelected =
                  selectedDate.year === currentYear &&
                  selectedDate.month === currentMonth &&
                  selectedDate.day === day
                const disabled = isPastDate(currentYear, currentMonth, day)
                const isToday =
                  today.year === currentYear &&
                  today.month === currentMonth &&
                  today.day === day

                return (
                  <div key={day} className="flex items-center justify-center">
                    <button
                      disabled={disabled}
                      onClick={() => {
                        onSelectDate({
                          year: currentYear,
                          month: currentMonth,
                          day,
                        })
                        onClose()
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-medium transition-all cursor-pointer ${
                        disabled
                          ? 'text-[#D1D6DB] cursor-not-allowed opacity-40'
                          : isSelected
                          ? 'bg-[#3182F6] text-white font-bold shadow-sm'
                          : isToday
                          ? 'text-[#3182F6] font-bold bg-[#E8F3FF]'
                          : 'text-[#191F28] hover:bg-[#F2F4F6] active:scale-95'
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                )
              })}

              {emptyDaysAfter.map((_, index) => (
                <div key={`empty-a-${index}`} className="w-9 h-9" />
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full h-12 bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-[0.98] text-[#191F28] font-bold text-[15px] rounded-xl transition-all cursor-pointer mt-1"
        >
          완료
        </button>
      </div>
    </div>
  )
}