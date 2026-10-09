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

const messaging = firebase.messaging();

// 백그라운드 메시지 수신
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || '알림';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // public 폴더 안의 아이콘 경로
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});