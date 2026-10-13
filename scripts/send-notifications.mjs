import admin from 'firebase-admin'

// 1. 환경변수에서 Firebase 서비스 계정 키 로드
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
if (!serviceAccountJson) {
  console.error('❌ Error: FIREBASE_SERVICE_ACCOUNT 환경변수가 설정되지 않았습니다.')
  process.exit(1)
}

let serviceAccount
try {
  serviceAccount = JSON.parse(serviceAccountJson)
} catch (err) {
  console.error('❌ Error: FIREBASE_SERVICE_ACCOUNT JSON 파싱에 실패했습니다.', err)
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const messaging = admin.messaging()

// 2. 한국 시간(KST, UTC+9) 기준 오늘 날짜 계산
function getKSTToday() {
  const now = new Date()
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000
  const kstDate = new Date(utcMs + 9 * 60 * 60 * 1000)

  const year = kstDate.getFullYear()
  const month = kstDate.getMonth() + 1
  const day = kstDate.getDate()
  const todayUtcMs = Date.UTC(year, month - 1, day)

  return { year, month, day, todayUtcMs }
}

async function run() {
  const { year, month, day, todayUtcMs } = getKSTToday()
  const forceTest = process.env.FORCE_TEST === 'true'

  console.log(`⏰ [Assign Plan 알림 스케줄러] 실행 기준일 (KST): ${year}-${month}-${day} ( 강제 테스트: ${forceTest} )`)

  // users 컬렉션의 모든 사용자 문서 참조 조회 (하위 컬렉션만 있는 문서 포함)
  const userRefs = await db.collection('users').listDocuments()
  console.log(`👥 조회된 사용자 수: ${userRefs.length}명`)

  let totalSent = 0
  let totalCleaned = 0

  for (const userRef of userRefs) {
    const uid = userRef.id

    // 사용자의 등록된 FCM 토큰 조회
    const tokensSnap = await userRef.collection('fcmTokens').get()
    if (tokensSnap.empty) {
      continue
    }

    const tokens = []
    tokensSnap.forEach((docSnap) => {
      const data = docSnap.data()
      if (data.token) {
        tokens.push(data.token)
      } else {
        tokens.push(docSnap.id)
      }
    })

    if (tokens.length === 0) continue

    // 발송할 알림 목록 수집
    const notificationsToSend = []

    // 강의(lectures) 및 과제(tasks) 조회
    const [lecturesSnap, tasksSnap] = await Promise.all([
      userRef.collection('lectures').get(),
      userRef.collection('tasks').get(),
    ])

    const checkItems = (snap, typeLabel) => {
      snap.forEach((docSnap) => {
        const data = docSnap.data()
        if (data.completed === true) return
        if (!data.date || !data.date.year || !data.date.month || !data.date.day) return

        const targetUtcMs = Date.UTC(data.date.year, data.date.month - 1, data.date.day)
        const diffDays = Math.round((targetUtcMs - todayUtcMs) / (1000 * 60 * 60 * 24))

        const itemTitle = data.title || '일정'

        if (diffDays === 3) {
          notificationsToSend.push({
            title: `[Assign Plan] ${itemTitle} 마감 3일 전이에요`,
            body: `3일 뒤(${data.date.month}월 ${data.date.day}일) 마감인 ${typeLabel} 일정이 있어요. 미리 준비해 보세요!`,
            tag: `${docSnap.id}_D-3_${year}-${month}-${day}`,
          })
        } else if (diffDays === 1) {
          notificationsToSend.push({
            title: `[Assign Plan] ${itemTitle} 마감이 내일이에요!`,
            body: `내일(${data.date.month}월 ${data.date.day}일) 마감인 ${typeLabel} 일정이 있어요. 잊지 말고 확인해 보세요.`,
            tag: `${docSnap.id}_D-1_${year}-${month}-${day}`,
          })
        } else if (diffDays === 0) {
          notificationsToSend.push({
            title: `[Assign Plan] 오늘 마감: ${itemTitle}`,
            body: `오늘 마감인 ${typeLabel} 일정이 있어요! 기한 내에 꼭 완료해 보세요.`,
            tag: `${docSnap.id}_D-Day_${year}-${month}-${day}`,
          })
        }
      })
    }

    checkItems(lecturesSnap, '강의')
    checkItems(tasksSnap, '과제')

    // 수동 테스트 모드일 때 마감 일정이 하나도 없다면 테스트 알림 1건 추가
    if (forceTest && notificationsToSend.length === 0) {
      notificationsToSend.push({
        title: '[Assign Plan] 오전 10시 자동 알림 연동 완료! 🔔',
        body: '이제 앱이 꺼져 있어도 마감 3일 전, 1일 전, 당일 오전 10시에 알림을 보내드릴게요.',
        tag: `test_${year}-${month}-${day}_${Date.now()}`,
      })
    }

    if (notificationsToSend.length === 0) {
      console.log(`ℹ️ 사용자(${uid}): 오늘 발송할 D-3 / D-1 / D-Day 마감 일정이 없습니다.`)
      continue
    }

    // 각 알림을 사용자의 모든 기기 토큰으로 발송
    for (const notice of notificationsToSend) {
      for (const token of tokens) {
        try {
          await messaging.send({
            token,
            notification: {
              title: notice.title,
              body: notice.body,
            },
            data: {
              title: notice.title,
              body: notice.body,
              tag: notice.tag,
            },
            webpush: {
              notification: {
                title: notice.title,
                body: notice.body,
                icon: 'https://assignplan-0701.web.app/icon-192.png',
                badge: 'https://assignplan-0701.web.app/icon-192.png',
                tag: notice.tag,
              },
              fcmOptions: {
                link: 'https://assignplan-0701.web.app/',
              },
            },
          })
          totalSent++
          console.log(`✅ 발송 성공 [${uid}]: "${notice.title}" -> ${token.slice(0, 12)}...`)
        } catch (err) {
          const errorCode = err?.errorInfo?.code || err?.code || ''
          console.warn(`⚠️ 발송 실패 [${uid}] (${errorCode}):`, err.message)

          // 만료되었거나 유효하지 않은 토큰은 Firestore에서 자동 정리
          if (
            errorCode === 'messaging/registration-token-not-registered' ||
            errorCode === 'messaging/invalid-registration-token'
          ) {
            await userRef.collection('fcmTokens').doc(token).delete()
            totalCleaned++
            console.log(`🧹 만료된 토큰 자동 삭제 완료: ${token.slice(0, 12)}...`)
          }
        }
      }
    }
  }

  console.log(`🎉 작업 완료! 총 발송 성공: ${totalSent}건, 만료 토큰 정리: ${totalCleaned}건`)
}

run().catch((err) => {
  console.error('❌ 스케줄러 실행 중 치명적 오류 발생:', err)
  process.exit(1)
})
