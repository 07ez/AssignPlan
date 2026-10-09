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

  // Firebase 콘솔에서 보낸 메시지는 FCM SDK가 시스템 알림을 자동으로 표출합니다.
  // notification 객체가 이미 있을 때 showNotification을 다시 호출하면 알림이 2번 뜨므로,
  // data 전용 메시지이거나 자동 표출이 되지 않는 경우에만 수동으로 띄웁니다.
  if (!payload.notification && payload.data) {
    const title = payload.data.title || '알림';
    const options = {
      body: payload.data.body || '',
      icon: '/icon.png',
      badge: '/icon.png',
      tag: payload.data.tag || 'assign-plan-notice',
      data: payload.data
    };
    self.registration.showNotification(title, options);
  }
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