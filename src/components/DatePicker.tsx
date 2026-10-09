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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-5 pointer-events-none"
      style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          transformOrigin: pickerOrigin,
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '18px',
          padding: '20px',
          boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0',
          width: '100%',
          maxWidth: '340px',
        }}
        className={`flex flex-col gap-4 pointer-events-auto ${
          isClosing ? 'animate-popover-out' : 'animate-popover-in'
        }`}
      >
        {/* Calendar header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleWheelPicker}
            className="flex items-center gap-1.5 cursor-pointer active:opacity-60 transition-opacity"
            style={{ color: '#0066cc' }}
          >
            <span
              style={{
                fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
              }}
            >
              {currentYear}년 {currentMonth}월
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isWheelPickerMode ? 'rotate-180' : ''
              }`}
              style={{ color: '#0066cc', strokeWidth: 2 }}
            />
          </button>

          {!isWheelPickerMode && (
            <div className="flex items-center gap-1">
              <button
                onClick={onPrevMonth}
                disabled={currentYear === today.year && currentMonth <= today.month}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#1d1d1f',
                }}
                className="hover:bg-[#f5f5f7] disabled:opacity-20 disabled:cursor-not-allowed transition-colors active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" style={{ strokeWidth: 2 }} />
              </button>
              <button
                onClick={onNextMonth}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#1d1d1f',
                }}
                className="hover:bg-[#f5f5f7] transition-colors active:scale-95"
              >
                <ChevronRight className="w-4 h-4" style={{ strokeWidth: 2 }} />
              </button>
            </div>
          )}
        </div>

        {isWheelPickerMode ? (
          /* Wheel picker */
          <div className="flex justify-center items-center gap-2 py-2 relative h-[180px]">
            <div
              style={{
                position: 'absolute',
                left: '8px',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '38px',
                backgroundColor: '#f5f5f7',
                borderRadius: '8px',
                pointerEvents: 'none',
              }}
            />
            <div
              onScroll={onYearScroll}
              className="flex-1 h-full overflow-y-auto py-[71px] text-center snap-y snap-mandatory scrollbar-none"
            >
              {yearsList.map((y) => (
                <div
                  key={y}
                  style={{
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: y === currentYear ? '15px' : '14px',
                    fontWeight: y === currentYear ? 600 : 400,
                    color: y === currentYear ? '#1d1d1f' : '#7a7a7a',
                    letterSpacing: '-0.224px',
                    transform: y === currentYear ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.1s ease',
                  }}
                  className="snap-center"
                >
                  {y}년
                </div>
              ))}
            </div>

            <div
              onScroll={onMonthScroll}
              className="flex-1 h-full overflow-y-auto py-[71px] text-center snap-y snap-mandatory scrollbar-none"
            >
              {monthsList.map((m) => {
                const isDisabled = currentYear === today.year && m < today.month
                return (
                  <div
                    key={m}
                    style={{
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: m === currentMonth ? '15px' : '14px',
                      fontWeight: m === currentMonth ? 600 : 400,
                      color: isDisabled ? '#cccccc' : m === currentMonth ? '#1d1d1f' : '#7a7a7a',
                      opacity: isDisabled ? 0.4 : 1,
                      letterSpacing: '-0.224px',
                      transform: m === currentMonth ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.1s ease',
                    }}
                    className="snap-center"
                  >
                    {m}월
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Calendar grid */
          <div
            key={`${currentYear}-${currentMonth}`}
            className={slideDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right'}
          >
            {/* Day headers */}
            <div
              className="grid grid-cols-7 text-center py-1 mb-1"
              style={{ fontSize: '12px', fontWeight: 400, color: '#7a7a7a', letterSpacing: '-0.12px' }}
            >
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 text-center gap-y-1">
              {emptyDaysBefore.map((_, i) => (
                <div key={`eb-${i}`} className="w-full aspect-square" />
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
                        onSelectDate({ year: currentYear, month: currentMonth, day })
                        onClose()
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: isSelected ? 600 : isToday ? 600 : 400,
                        letterSpacing: '-0.224px',
                        backgroundColor: isSelected ? '#0066cc' : 'transparent',
                        color: disabled
                          ? '#cccccc'
                          : isSelected
                          ? '#ffffff'
                          : isToday
                          ? '#0066cc'
                          : '#1d1d1f',
                        opacity: disabled ? 0.3 : 1,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                      className={!disabled && !isSelected ? 'hover:bg-[#f5f5f7] active:scale-95' : ''}
                    >
                      {day}
                    </button>
                  </div>
                )
              })}

              {emptyDaysAfter.map((_, i) => (
                <div key={`ea-${i}`} className="w-full aspect-square" />
              ))}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '9999px',
            backgroundColor: '#f5f5f7',
            color: '#1d1d1f',
            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: '-0.224px',
            border: 'none',
            cursor: 'pointer',
          }}
          className="active:scale-95 transition-transform"
        >
          닫기
        </button>
      </div>
    </div>
  )
}