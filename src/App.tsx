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
  const triggerToast = (msg = '아직 준비 중인 기능이에요') => {
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

  const totalIncomplete =
    lectures.filter((l) => !l.completed).length +
    assignments.filter((a) => !a.completed).length

  return (
    <div className="w-full max-w-[480px] min-h-screen bg-[#F2F4F6] text-[#191F28] flex flex-col relative overflow-hidden select-none mx-auto shadow-xl">
      {/* 상단 헤더 (TDS TopBar) */}
      <Header
        showMenu={showMenu}
        onToggleMenu={() => setShowMenu(!showMenu)}
        onOpenModal={handleOpenModal}
        onSearchClick={() => triggerToast('검색 기능은 준비 중이에요')}
        onSettingsClick={() => setShowSettingsMenu(!showSettingsMenu)}
      />

      {/* 설정 팝업 메뉴 (TDS Menu Popover) */}
      {showSettingsMenu && (
        <div
          className="absolute right-5 top-16 w-56 bg-white rounded-2xl p-2 z-50 flex flex-col gap-1 border border-[#E5E8EB] animate-popover-in"
          style={{ boxShadow: '0 8px 24px rgba(25, 31, 40, 0.12)' }}
        >
          {/* 알람 항목 */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#F2F4F6] transition-colors">
            <div className="flex items-center gap-2.5 text-[#191F28]">
              <Bell className="w-4 h-4 stroke-[2.2] text-[#4E5968]" />
              <span className="text-[14px] font-semibold">알림 받기</span>
            </div>
            {/* TDS Switch Component */}
            <button
              onClick={() => setAlarmEnabled(!alarmEnabled)}
              className={`w-11 h-6.5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                alarmEnabled ? 'bg-[#3182F6]' : 'bg-[#D1D6DB]'
              }`}
            >
              <div
                className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ${
                  alarmEnabled ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-[1px] bg-[#F2F4F6] my-0.5" />

          {/* 버전 / 업데이트 내역 항목 */}
          <button
            onClick={openChangelog}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors cursor-pointer text-[#191F28]"
          >
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 stroke-[2.2] text-[#4E5968]" />
              <span className="text-[14px] font-semibold">버전 정보</span>
            </div>
            <span className="text-[12px] font-bold text-[#3182F6] tabular-nums bg-[#E8F3FF] px-2 py-0.5 rounded-full">
              v1.0.5
            </span>
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-12 flex flex-col gap-3.5">
        {/* TDS Summary Banner */}
        <div className="w-full bg-white rounded-[24px] p-5 border border-[#E5E8EB] shadow-[0_2px_10px_rgba(25,31,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[13px] font-semibold text-[#8B95A1]">
              오늘의 학업 현황
            </span>
            <h3 className="text-[19px] font-bold text-[#191F28] mt-0.5 tracking-tight">
              {totalIncomplete === 0 ? (
                '모든 일정을 끝냈어요 🎉'
              ) : (
                <>
                  남은 일정이{' '}
                  <span className="text-[#3182F6] tabular-nums">
                    {totalIncomplete}개
                  </span>{' '}
                  있어요
                </>
              )}
            </h3>
          </div>

          <button
            onClick={() => handleOpenModal('강의')}
            className="h-10 px-4 rounded-xl bg-[#E8F3FF] text-[#3182F6] hover:bg-[#d8eaff] active:scale-95 text-[14px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>+ 추가</span>
          </button>
        </div>

        <ItemSection
          title="강의"
          items={lectures}
          onToggleComplete={(id) => handleToggleComplete(id, '강의')}
          onMoreClick={() => triggerToast('강의 상세 목록을 준비하고 있어요')}
        />

        <ItemSection
          title="과제"
          items={assignments}
          onToggleComplete={(id) => handleToggleComplete(id, '과제')}
          onMoreClick={() => triggerToast('과제 상세 목록을 준비하고 있어요')}
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