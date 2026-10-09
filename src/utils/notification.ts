import { getToken, onMessage, isSupported } from 'firebase/messaging'
import { doc, setDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db, messaging } from '../firebase'
import type { ItemData } from '../types'

// Firebase Console에서 발급받은 VAPID 키
export const DEFAULT_VAPID_KEY =
  'BFjf4YJVVDZY8NA-qvmOEHE9TkwqltIROVygTMffBukNPhpcssCCW8frAWDnkgR1KYZkEOd6rV9lTqq7_A-xjlM'

/**
 * 브라우저 알림 권한을 요청하고 FCM 등록 토큰을 발급받아 Firestore에 저장합니다.
 */
export async function requestNotificationPermission(
  user: User,
  vapidKey: string = DEFAULT_VAPID_KEY
): Promise<{ success: boolean; token?: string; error?: string }> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { success: false, error: '이 브라우저는 알림을 지원하지 않아요.' }
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return { success: false, error: '알림 권한이 거부되었어요. 브라우저 설정에서 허용해 주세요.' }
    }

    // 서비스 워커 등록 확인
    let registration: ServiceWorkerRegistration | undefined
    if ('serviceWorker' in navigator) {
      registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      await navigator.serviceWorker.ready
    }

    const supported = await isSupported()
    if (supported && messaging) {
      try {
        const tokenOptions: { serviceWorkerRegistration?: ServiceWorkerRegistration; vapidKey?: string } = {
          serviceWorkerRegistration: registration,
        }
        if (vapidKey) {
          tokenOptions.vapidKey = vapidKey
        }

        const isStandalone =
          (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
          window.matchMedia('(display-mode: standalone)').matches

        const token = await getToken(messaging, tokenOptions)
        if (token) {
          // Firestore users/{uid}/fcmTokens/{token} 저장
          await setDoc(doc(db, 'users', user.uid, 'fcmTokens', token), {
            token,
            platform: isStandalone ? 'pwa' : 'browser',
            userAgent: navigator.userAgent,
            updatedAt: Date.now(),
          })
          return { success: true, token }
        }
      } catch (fcmErr) {
        console.warn('FCM Token generation note (VAPID key required for web push):', fcmErr)
        // VAPID 키가 아직 등록되지 않았더라도 브라우저 Notification 권한은 획득됨
        return { success: true }
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Notification permission error:', err)
    return { success: false, error: err?.message || '알림 설정 중 오류가 발생했어요.' }
  }
}

/**
 * 포그라운드(앱 실행 중) 상태에서 FCM 메시지를 수신합니다.
 */
export async function setupForegroundMessageListener(
  onReceive: (payload: { title: string; body: string }) => void
) {
  if (typeof window === 'undefined') return () => {}
  const supported = await isSupported()
  if (!supported || !messaging) return () => {}

  return onMessage(messaging, (payload) => {
    const title = payload.notification?.title || '[Assign Plan] 알림'
    const body = payload.notification?.body || '새로운 일정이 있어요.'
    onReceive({ title, body })

    // 브라우저 네이티브 알림도 함께 표출
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon.png',
      })
    }
  })
}

/**
 * 마감 임박 일정(D-3, D-1, D-Day 당일)을 검사하여 브라우저 알림을 발송합니다.
 * (동일 일정/동일 조건은 하루 1회만 발송되도록 중복 방지 캐시 적용)
 */
export function checkAndSendDueNotifications(items: ItemData[]) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

  items.forEach((item) => {
    // 이미 완료된 일정은 건너뜀
    if (item.completed) return

    const targetDate = new Date(item.date.year, item.date.month - 1, item.date.day).getTime()
    const diffDays = Math.round((targetDate - todayStart) / (1000 * 60 * 60 * 24))

    let alertType: 'D-3' | 'D-1' | 'D-Day' | null = null
    let title = ''
    let body = ''

    if (diffDays === 3) {
      alertType = 'D-3'
      title = `[Assign Plan] ${item.title} 마감 3일 전이에요`
      body = `3일 뒤(${item.date.month}월 ${item.date.day}일) 마감인 일정이 있어요. 미리 준비해 보세요!`
    } else if (diffDays === 1) {
      alertType = 'D-1'
      title = `[Assign Plan] ${item.title} 마감이 내일이에요!`
      body = `내일(${item.date.month}월 ${item.date.day}일) 마감인 일정이 있어요. 잊지 말고 확인해 보세요.`
    } else if (diffDays === 0) {
      alertType = 'D-Day'
      title = `[Assign Plan] 오늘 마감: ${item.title}`
      body = `오늘 마감인 일정이 있어요! 기한 내에 꼭 완료해 보세요.`
    }

    if (alertType) {
      const cacheKey = `assign_plan_notified_${item.id}_${alertType}_${dateKey}`
      if (!localStorage.getItem(cacheKey)) {
        try {
          new Notification(title, {
            body,
            icon: '/icon.png',
            tag: item.id,
          })
          localStorage.setItem(cacheKey, 'true')
        } catch (e) {
          console.error('Notification dispatch error:', e)
        }
      }
    }
  })
}
