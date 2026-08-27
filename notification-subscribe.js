// এই স্ক্রিপ্টটা আপনার মেইন পেজে (index.html) <script type="module"> দিয়ে লোড করবেন
// এটা ভিজিটরের permission নেবে এবং token automatic Realtime Database এ সেভ করবে

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsGBSRCHVUhXQZ5DNMEZWgQWk1gxMF1E4",
  authDomain: "signup-d32c5.firebaseapp.com",
  databaseURL: "https://signup-d32c5-default-rtdb.firebaseio.com",
  projectId: "signup-d32c5",
  storageBucket: "signup-d32c5.firebasestorage.app",
  messagingSenderId: "583812949955",
  appId: "1:583812949955:web:fab1bb7be94bc1b4ab3f76"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getDatabase(app);

// ⚠️ Firebase Console > Project Settings > Cloud Messaging > Web Push certificates থেকে নিন
const VAPID_KEY = "BMjwy9ovzgzflWQ_AraWgJPmoihKx6XRrMHwB5yKNXfLsXLTmjaYF-tq16tA7e45XHr4HLBrTeezO3gfHJY2-vY";

async function subscribeToNotifications() {
  try {
    // আগে থেকে blocked থাকলে কিছু করার নাই, আগে থেকে granted থাকলে সরাসরি token নেবে
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('User denied notification permission');
      return;
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (token) {
      // Realtime Database এ token সেভ (duplicate এড়াতে token নিজেই key হিসেবে ব্যবহার করা হচ্ছে)
      const safeKey = token.replace(/[.#$/\[\]]/g, '_');
      await set(ref(db, `fcm_tokens/${safeKey}`), {
        token: token,
        subscribedAt: Date.now(),
        userAgent: navigator.userAgent
      });
      console.log('Notification subscribed & saved ✅');
      const btnEl = document.getElementById('enable-notif-btn');
      if (btnEl) {
        btnEl.classList.add('subscribed');
        btnEl.title = 'Notification চালু আছে ✅';
      }
    }
  } catch (err) {
    console.error('Notification subscribe failed:', err);
  }
}

// পেজ লোড হলে automatic চেষ্টা করবে (চাইলে বাটনের সাথেও bind করতে পারেন)
if ('serviceWorker' in navigator && 'Notification' in window) {
  // চাইলে সরাসরি call করুন, অথবা একটা বাটনে click event দিয়ে call করুন
  // subscribeToNotifications();

  // ✅ Recommended: বাটন দিয়ে ট্রিগার করুন যাতে popup জোর করে না আসে
  const btn = document.getElementById('enable-notif-btn');
  if (btn) btn.addEventListener('click', subscribeToNotifications);
}
