// ⚠️ নিচের দুইটা মান আপনার নিজের দিয়ে বদলাতে হবে
const WORKER_URL = 'https://push-notify-worker.YOUR-SUBDOMAIN.workers.dev';
const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('এই browser এ push notification সাপোর্ট নেই');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/push-sw.js');
    await navigator.serviceWorker.ready;

    // আগে থেকে subscribe করা থাকলে আবার করার দরকার নেই
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      console.log('আগে থেকেই subscribe করা আছে');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('User permission দেয়নি');
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    await fetch(`${WORKER_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    console.log('Subscribe সফল হয়েছে ✅');
  } catch (err) {
    console.error('Subscribe করতে সমস্যা হয়েছে:', err);
  }
}

// Site এ ঢোকার ৩ সেকেন্ড পর subscribe request দেখাবে
setTimeout(subscribeToPush, 3000);
