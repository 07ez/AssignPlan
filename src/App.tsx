import { useState, useRef, useEffect } from 'react'
import { Bell, Info, LogOut } from 'lucide-react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'

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
import { LoginScreen } from './components/LoginScreen'
import appIcon from './assets/icon.png'
import {
  requestNotificationPermission,
  setupForegroundMessageListener,
  checkAndSendDueNotifications,
} from './utils/notification'

const TODAY = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
}

export default function App() {
  // --- 사용자 인증 상태 ---
  const [user, setUser] = useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  // --- UI 상태 ---
  const [showMenu, setShowMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [alarmEnabled, setAlarmEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('assign_plan_alarm_enabled') === 'true'
  })

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
  const [lectures, setLectures] = useState<ItemData[]>(() => {
    try {
      const saved = localStorage.getItem('assign_plan_lectures_local')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [assignments, setAssignments] = useState<ItemData[]>(() => {
    try {
      const saved = localStorage.getItem('assign_plan_tasks_local')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // DOM 참조 (날짜 뱃지 위치 계산용)
  const dateBadgeRef = useRef<HTMLSpanElement | null>(null)

  // 토스트 메시지 출력
  const triggerToast = (msg = '아직 준비 중인 기능이에요') => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  // --- LocalStorage 자동 백업 ---
  useEffect(() => {
    try {
      localStorage.setItem('assign_plan_lectures_local', JSON.stringify(lectures))
    } catch (err) {
      console.error('LocalStorage write error (lectures):', err)
    }
  }, [lectures])

  useEffect(() => {
    try {
      localStorage.setItem('assign_plan_tasks_local', JSON.stringify(assignments))
    } catch (err) {
      console.error('LocalStorage write error (tasks):', err)
    }
  }, [assignments])

  // --- Firebase 인증 리스너 ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthLoading(false)
    })
    return () => unsub()
  }, [])

  // --- Firestore 실시간 동기화 (users > {uid} > lectures / tasks) ---
  useEffect(() => {
    if (!user) return

    // 1. 강의 컬렉션 구독 (lectures)
    const lecturesRef = collection(db, 'users', user.uid, 'lectures')
    const unsubLectures = onSnapshot(
      lecturesRef,
      (snapshot) => {
        const items: ItemData[] = []
        snapshot.forEach((d) => {
          const data = d.data()
          // 완료된(completed === true) 항목은 불러오지 않음
          if (data.completed === true) return

          items.push({
            id: d.id,
            title: data.title || '',
            memo: data.memo || '',
            date: data.date || TODAY,
            completed: false,
            createdAt: data.createdAt,
          })
        })
        setLectures(items.sort(sortByDate))
      },
      (err) => {
        console.error('Lectures snapshot error:', err)
      }
    )

    // 2. 과제 컬렉션 구독 (tasks)
    const tasksRef = collection(db, 'users', user.uid, 'tasks')
    const unsubTasks = onSnapshot(
      tasksRef,
      (snapshot) => {
        const items: ItemData[] = []
        snapshot.forEach((d) => {
          const data = d.data()
          // 완료된(completed === true) 항목은 불러오지 않음
          if (data.completed === true) return

          items.push({
            id: d.id,
            title: data.title || '',
            memo: data.memo || '',
            date: data.date || TODAY,
            completed: false,
            createdAt: data.createdAt,
          })
        })
        setAssignments(items.sort(sortByDate))
      },
      (err) => {
        console.error('Tasks snapshot error:', err)
      }
    )

    return () => {
      unsubLectures()
      unsubTasks()
    }
  }, [user])

  // --- FCM 토큰 동기화 및 포그라운드 메시지 리스너 ---
  useEffect(() => {
    if (!user || !alarmEnabled) return

    // 브라우저 권한이 이미 허용된 상태라면 FCM 토큰 갱신 및 등록
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      requestNotificationPermission(user).catch(console.error)
    }

    // 포그라운드 메시지 리스너 설정
    let unsubForeground: (() => void) | undefined
    setupForegroundMessageListener((payload) => {
      triggerToast(`🔔 ${payload.title}: ${payload.body}`)
    }).then((unsub) => {
      unsubForeground = unsub
    })

    return () => {
      if (unsubForeground) unsubForeground()
    }
  }, [user, alarmEnabled])

  // --- 마감 일정 체크 및 로컬 알림 발송 (D-3, D-1, D-Day 오전 10시) ---
  useEffect(() => {
    if (!user || !alarmEnabled) return

    checkAndSendDueNotifications([...lectures, ...assignments])

    // 주기적 마감 체크 (지정 시각 도달 감지, 15초 주기)
    const interval = setInterval(() => {
      checkAndSendDueNotifications([...lectures, ...assignments])
    }, 1000 * 15)

    return () => {
      clearInterval(interval)
    }
  }, [user, alarmEnabled, lectures, assignments])

  // --- 알림 켜기/끄기 토글 제어 ---
  const handleToggleAlarm = async () => {
    const nextState = !alarmEnabled
    setAlarmEnabled(nextState)
    localStorage.setItem('assign_plan_alarm_enabled', String(nextState))

    if (nextState) {
      if (user) {
        const res = await requestNotificationPermission(user)
        if (res.success) {
          triggerToast('마감 알림이 켜졌어요 (오전 10시)')
          checkAndSendDueNotifications([...lectures, ...assignments])
        } else {
          triggerToast(res.error || '브라우저 알림 권한을 허용해주세요')
        }
      } else {
        triggerToast('마감 알림이 켜졌어요')
      }
    } else {
      triggerToast('마감 알림이 꺼졌어요')
    }
  }

  // --- 구글 로그인 / 로그아웃 제어 ---
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      triggerToast('Google 계정으로 로그인되었어요')
    } catch (err) {
      console.error('Login error:', err)
      triggerToast('로그인에 실패했어요')
    }
  }

  const handleLogout = async () => {
    try {
      setShowSettingsMenu(false)
      await signOut(auth)
      triggerToast('로그아웃되었어요')
    } catch (err) {
      console.error('Logout error:', err)
      triggerToast('로그아웃에 실패했어요')
    }
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
  const handleSave = async () => {
    if (!itemTitle.trim()) return

    const docData = {
      title: itemTitle.trim(),
      memo: memo.trim(),
      date: {
        year: selectedDate.year,
        month: selectedDate.month,
        day: selectedDate.day,
      },
      completed: false,
      createdAt: Date.now(),
    }

    if (user) {
      try {
        const collName = modalType === '강의' ? 'lectures' : 'tasks'
        await addDoc(collection(db, 'users', user.uid, collName), docData)
        triggerToast(`${modalType}가 저장되었어요`)
      } catch (err) {
        console.error('Firestore save error:', err)
        triggerToast('저장에 실패했어요')
      }
    } else {
      const newItem: ItemData = {
        id: Date.now().toString(),
        ...docData,
      }
      if (modalType === '강의') {
        setLectures((prev) => [...prev, newItem].sort(sortByDate))
      } else {
        setAssignments((prev) => [...prev, newItem].sort(sortByDate))
      }
      triggerToast(`${modalType}가 저장되었어요`)
    }

    handleCloseModal()
  }

  const handleToggleComplete = (id: string, type: '강의' | '과제') => {
    const collName = type === '강의' ? 'lectures' : 'tasks'

    // 1. 체크마크 애니메이션 즉시 적용
    if (type === '강의') {
      setLectures((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: true } : item
        )
      )
    } else {
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: true } : item
        )
      )
    }

    // 2. 잠시 후(350ms) Firestore 완료 처리 -> completed true인 항목은 목록에서 자연스럽게 제외
    setTimeout(async () => {
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid, collName, id), {
            completed: true,
          })
        } catch (err) {
          console.error('Firestore update error:', err)
          triggerToast('완료 상태 변경에 실패했어요')
        }
      } else {
        if (type === '강의') {
          setLectures((prev) => prev.filter((item) => item.id !== id))
        } else {
          setAssignments((prev) => prev.filter((item) => item.id !== id))
        }
      }
    }, 350)
  }

  const handleToggleMenu = () => {
    if (!showMenu) {
      setShowSettingsMenu(false)
    }
    setShowMenu((prev) => !prev)
  }

  const handleToggleSettings = () => {
    if (!showSettingsMenu) {
      setShowMenu(false)
    }
    setShowSettingsMenu((prev) => !prev)
  }

  // --- 1. 인증 초기 로딩 화면 ---
  if (isAuthLoading) {
    return (
      <div className="w-full max-w-[480px] min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center mx-auto shadow-xl select-none">
        <img
          src={appIcon}
          alt="Assign Plan"
          className="w-14 h-14 rounded-2xl shadow-md object-cover animate-pulse"
        />
        <p className="mt-4 text-[14px] font-medium text-[#8B95A1]">불러오는 중...</p>
      </div>
    )
  }

  // --- 2. 비로그인 상태: 로그인 화면 (게스트 로그인 없음) ---
  if (!user) {
    return (
      <>
        <LoginScreen onLogin={handleGoogleLogin} />
        <Toast show={showToast} message={toastMessage} />
      </>
    )
  }

  // --- 3. 로그인 완료 상태: 메인 앱 화면 ---
  return (
    <div className="w-full max-w-[480px] min-h-screen bg-[#F2F4F6] text-[#191F28] flex flex-col relative overflow-hidden select-none mx-auto shadow-xl">
      {/* 상단 헤더 (설정 버튼은 항상 설정 톱니바퀴 아이콘) */}
      <Header
        showMenu={showMenu}
        showSettingsMenu={showSettingsMenu}
        onToggleMenu={handleToggleMenu}
        onOpenModal={handleOpenModal}
        onSearchClick={() => triggerToast('검색 기능은 준비 중이에요')}
        onSettingsClick={handleToggleSettings}
      />

      {/* 설정 팝업 메뉴 (TDS Menu Popover) */}
      {showSettingsMenu && (
        <div
          className="absolute right-5 top-18 w-64 bg-white rounded-2xl p-2.5 z-50 flex flex-col gap-1 border border-[#E5E8EB] origin-top-right animate-popover-in"
          style={{ boxShadow: '0 8px 24px rgba(25, 31, 40, 0.12)' }}
        >
          {/* 유저 계정 프로필 카드 */}
          <div className="p-3 bg-[#F9FAFB] rounded-xl flex items-center gap-3 border border-[#E5E8EB] mb-1">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || '사용자'}
                className="w-9 h-9 rounded-full object-cover border border-[#E5E8EB] shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold text-[14px] flex items-center justify-center shrink-0">
                {user.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-[#191F28] truncate">
                {user.displayName || '사용자'}
              </div>
              <div className="text-[11px] text-[#8B95A1] truncate">
                {user.email}
              </div>
            </div>
          </div>

          {/* 알람 항목 */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#F2F4F6] transition-colors">
            <div className="flex items-center gap-2.5 text-[#191F28]">
              <Bell className="w-4 h-4 stroke-[2.2] text-[#4E5968]" />
              <span className="text-[14px] font-semibold">알림 받기</span>
            </div>
            {/* TDS Switch Component */}
            <button
              onClick={handleToggleAlarm}
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
              v1.1.3
            </span>
          </button>

          {/* 로그아웃 버튼 */}
          <div className="h-[1px] bg-[#F2F4F6] my-0.5" />
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl hover:bg-[#FEE2E2]/60 active:bg-[#FEE2E2] transition-colors cursor-pointer text-[#F04452]"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 stroke-[2.2]" />
              <span className="text-[14px] font-semibold">로그아웃</span>
            </div>
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-12 flex flex-col gap-3.5">
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