import { useState, useRef } from 'react'
import { Bell, Info } from 'lucide-react'

// 1. 타입 및 유틸리티 불러오기
import type { ItemData, ModalType } from './types'
import { getDaysInMonth, getFirstDayOfMonth, sortByDate } from './utils/dateUtils'

// 2. 분리한 컴포넌트 불러오기
import { Header } from './components/Header'
import { ItemSection } from './components/ItemSection'
import { Toast } from './components/Toast'
import { AddModal } from './components/AddModal'
import { DatePickerModal } from './components/DatePicker'
import { ChangelogDrawer } from './components/Changelog'

const TODAY = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
}

export default function App() {
  // --- UI 상태 ---
  const [showMenu, setShowMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [alarmEnabled, setAlarmEnabled] = useState(true)

  // 모달 및 드로어 상태
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('강의')

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isDatePickerClosing, setIsDatePickerClosing] = useState(false)

  const [showChangelog, setShowChangelog] = useState(false)
  const [isChangelogClosing, setIsChangelogClosing] = useState(false)

  // 토스트 상태
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // --- 날짜 피커 관련 상태 ---
  const [currentYear, setCurrentYear] = useState(TODAY.year)
  const [currentMonth, setCurrentMonth] = useState(TODAY.month)
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [pickerOrigin, setPickerOrigin] = useState('center center')
  const [isWheelPickerMode, setIsWheelPickerMode] = useState(false)

  // --- 입력 폼 상태 ---
  const [itemTitle, setItemTitle] = useState('')
  const [memo, setMemo] = useState('')

  // --- 과제 / 강의 데이터 상태 ---
  const [lectures, setLectures] = useState<ItemData[]>([])
  const [assignments, setAssignments] = useState<ItemData[]>([])

  // DOM 참조 (날짜 뱃지 위치 계산용)
  const dateBadgeRef = useRef<HTMLSpanElement | null>(null)

  // 토스트 메시지 출력
  const triggerToast = (msg = '아직 구현중인 기능입니다.') => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  // --- 모달 제어 함수 ---
  const handleOpenModal = (type: ModalType) => {
    setModalType(type)
    setItemTitle('')
    setMemo('')
    setSelectedDate(TODAY)
    setShowModal(true)
    setShowMenu(false)
  }

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowModal(false)
      setIsClosing(false)
    }, 200)
  }

  // --- 날짜 피커 제어 ---
  const toggleDatePicker = () => {
    if (showDatePicker) {
      closeDatePicker()
    } else {
      if (dateBadgeRef.current) {
        const rect = dateBadgeRef.current.getBoundingClientRect()
        setPickerOrigin(`${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`)
      }
      setCurrentYear(selectedDate.year)
      setCurrentMonth(selectedDate.month)
      setShowDatePicker(true)
      setIsWheelPickerMode(false)
    }
  }

  const closeDatePicker = () => {
    setIsDatePickerClosing(true)
    setTimeout(() => {
      setShowDatePicker(false)
      setIsDatePickerClosing(false)
    }, 200)
  }

  const handlePrevMonth = () => {
    setSlideDirection('left')
    if (currentMonth === 1) {
      setCurrentYear((prev) => prev - 1)
      setCurrentMonth(12)
    } else {
      setCurrentMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = () => {
    setSlideDirection('right')
    if (currentMonth === 12) {
      setCurrentYear((prev) => prev + 1)
      setCurrentMonth(1)
    } else {
      setCurrentMonth((prev) => prev + 1)
    }
  }

  const isPastDate = (year: number, month: number, day: number) => {
    const target = new Date(year, month - 1, day).getTime()
    const today = new Date(TODAY.year, TODAY.month - 1, TODAY.day).getTime()
    return target < today
  }

  // --- 패치내역 드로어 제어 ---
  const openChangelog = () => {
    setShowSettingsMenu(false)
    setShowChangelog(true)
  }

  const closeChangelog = () => {
    setIsChangelogClosing(true)
    setTimeout(() => {
      setShowChangelog(false)
      setIsChangelogClosing(false)
    }, 250)
  }

  // --- 데이터 저장 및 토글 ---
  const handleSave = () => {
    if (!itemTitle.trim()) return

    const newItem: ItemData = {
      id: Date.now().toString(),
      title: itemTitle,
      date: selectedDate,
      memo,
      completed: false,
    }

    if (modalType === '강의') {
      setLectures((prev) => [...prev, newItem].sort(sortByDate))
    } else {
      setAssignments((prev) => [...prev, newItem].sort(sortByDate))
    }
    handleCloseModal()
  }

  const handleToggleComplete = (id: string, type: '강의' | '과제') => {
    if (type === '강의') {
      setLectures((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      )
    } else {
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      )
    }
  }

  return (
    <div
      style={{ backgroundColor: '#f5f5f7', maxWidth: '480px' }}
      className="w-full min-h-screen flex flex-col relative overflow-hidden select-none mx-auto"
    >
      {/* 상단 헤더 */}
      <Header
        showMenu={showMenu}
        onToggleMenu={() => setShowMenu(!showMenu)}
        onOpenModal={handleOpenModal}
        onSearchClick={() => triggerToast('검색 기능 준비중입니다.')}
        onSettingsClick={() => setShowSettingsMenu(!showSettingsMenu)}
      />

      {/* 설정 팝업 메뉴 — Apple utility card style */}
      {showSettingsMenu && (
        <div
          style={{
            position: 'absolute',
            right: '16px',
            top: '96px',
            width: '220px',
            backgroundColor: 'rgba(250, 250, 252, 0.96)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '18px',
            padding: '6px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            zIndex: 50,
          }}
          className="flex flex-col gap-0.5 animate-popover-in"
        >
          {/* Alarm row */}
          <div
            className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          >
            <div className="flex items-center gap-2.5">
              <Bell
                className="w-4 h-4"
                style={{ color: '#1d1d1f', strokeWidth: 2 }}
              />
              <span
                style={{ fontSize: '14px', fontWeight: 400, letterSpacing: '-0.224px', color: '#1d1d1f' }}
              >
                알람
              </span>
            </div>
            <button
              onClick={() => setAlarmEnabled(!alarmEnabled)}
              style={{
                width: '40px',
                height: '24px',
                borderRadius: '9999px',
                padding: '2px',
                backgroundColor: alarmEnabled ? '#0066cc' : '#e0e0e0',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                  transform: alarmEnabled ? 'translateX(16px)' : 'translateX(0)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
          </div>

          {/* Hairline */}
          <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '0 8px' }} />

          {/* Version / Changelog */}
          <button
            onClick={openChangelog}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl cursor-pointer active:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Info
                className="w-4 h-4"
                style={{ color: '#1d1d1f', strokeWidth: 2 }}
              />
              <span
                style={{ fontSize: '14px', fontWeight: 400, letterSpacing: '-0.224px', color: '#1d1d1f' }}
              >
                버전
              </span>
            </div>
            <span
              style={{ fontSize: '12px', fontWeight: 400, color: '#0066cc', letterSpacing: '-0.12px' }}
            >
              v1.0.5
            </span>
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-12 flex flex-col gap-3">
        <ItemSection
          title="강의"
          items={lectures}
          onToggleComplete={(id) => handleToggleComplete(id, '강의')}
          onMoreClick={() => triggerToast()}
        />

        <ItemSection
          title="과제"
          items={assignments}
          onToggleComplete={(id) => handleToggleComplete(id, '과제')}
          onMoreClick={() => triggerToast()}
        />
      </main>

      {/* 대화상자/모달 컴포넌트 모음 */}
      <AddModal
        show={showModal}
        isClosing={isClosing}
        modalType={modalType}
        itemTitle={itemTitle}
        memo={memo}
        selectedDate={selectedDate}
        dateBadgeRef={dateBadgeRef}
        setItemTitle={setItemTitle}
        setMemo={setMemo}
        onClose={handleCloseModal}
        onSave={handleSave}
        onToggleDatePicker={toggleDatePicker}
      />

      <DatePickerModal
        show={showDatePicker}
        isClosing={isDatePickerClosing}
        pickerOrigin={pickerOrigin}
        currentYear={currentYear}
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        today={TODAY}
        isWheelPickerMode={isWheelPickerMode}
        onToggleWheelPicker={() => setIsWheelPickerMode(!isWheelPickerMode)}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onSelectDate={setSelectedDate}
        onClose={closeDatePicker}
        onYearScroll={(e) => {
          const target = e.currentTarget
          const index = Math.round(target.scrollTop / 38)
          setCurrentYear(TODAY.year + index)
        }}
        onMonthScroll={(e) => {
          const target = e.currentTarget
          const index = Math.round(target.scrollTop / 38)
          setCurrentMonth(index + 1)
        }}
        getDaysInMonth={getDaysInMonth}
        getFirstDayOfMonth={getFirstDayOfMonth}
        isPastDate={isPastDate}
        slideDirection={slideDirection}
      />

      <ChangelogDrawer
        show={showChangelog}
        isClosing={isChangelogClosing}
        onClose={closeChangelog}
      />

      <Toast show={showToast} message={toastMessage} />
    </div>
  )
}