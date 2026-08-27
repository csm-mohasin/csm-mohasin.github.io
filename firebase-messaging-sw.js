// এই ফাইলটা আপনার সাইটের ROOT ফোল্ডারে রাখতে হবে (mohasin.is-a.dev এর root এ)
// নাম অবশ্যই "firebase-messaging-sw.js" রাখতে হবে, নাহলে কাজ করবে না

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// ⚠️ নিচের config আপনার Firebase Project Settings > General থেকে কপি করুন
firebase.initializeApp({
  apiKey: "AIzaSyCsGBSRCHVUhXQZ5DNMEZWgQWk1gxMF1E4",
  authDomain: "signup-d32c5.firebaseapp.com",
  databaseURL: "https://signup-d32c5-default-rtdb.firebaseio.com",
  projectId: "signup-d32c5",
  storageBucket: "signup-d32c5.firebasestorage.app",
  messagingSenderId: "583812949955",
  appId: "1:583812949955:web:fab1bb7be94bc1b4ab3f76"
});

const messaging = firebase.messaging();

// সাইট বন্ধ থাকলে/ব্যাকগ্রাউন্ডে থাকলে এই function কাজ করবে (automatic)
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, image, click_action } = payload.data || payload.notification;

  self.registration.showNotification(title || 'নতুন আপডেট', {
    body: body || '',
    icon: icon || '/icon-192.png',
    image: image || undefined,
    badge: '/icon-192.png',
    data: { url: click_action || 'https://mohasin.bro.bd' },
    vibrate: [200, 100, 200]
  });
});

// নোটিফিকেশনে ক্লিক করলে যেখানে যাবে
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || 'https://mohasin.bro.bd';
  event.waitUntil(clients.openWindow(url));
});
