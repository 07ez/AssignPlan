importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCZzgJRCf1xHJCkAvW6f4Uzw3xC5NflFqE",
  authDomain: "assignplan-0701.firebaseapp.com",
  projectId: "assignplan-0701",
  storageBucket: "assignplan-0701.firebasestorage.app",
  messagingSenderId: "318585258391",
  appId: "1:318585258391:web:c98cd7be1e1827f50ac4d2"
});

// 서비스 워커 즉시 활성화 (새 버전 배포 시 대기 없이 즉시 적용)
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const title = payload.notification?.title || payload.data?.title || 'Assign Plan 알림';
  const body = payload.notification?.body || payload.data?.body || '새로운 일정이 있어요.';

  // 동일한 알림은 브라우저에서 하나로 병합되도록 tag 적용 (중복 알림 방지)
  const tag = payload.messageId || payload.data?.tag || 'assign-plan-notice';

  const notificationOptions = {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag,
    data: payload.data || {},
    vibrate: [200, 100, 200]
  };

  // iOS(APNs)는 콘솔 알림 발송 시 Apple 시스템이 자체적으로 1회를 띄우므로, 중복 방지를 위해 iOS이고 notification 객체가 있는 경우 수동 표출 스킵
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS && payload.notification) {
    return;
  }

  return self.registration.showNotification(title, notificationOptions);
});

// 알림 클릭 시 앱 창 활성화 또는 오픈
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});