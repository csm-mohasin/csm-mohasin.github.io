// push-sw.js
// এই ফাইলটা আপনার site এর root এ থাকতে হবে (যেখানে index.html আছে)
// অর্থাৎ https://আপনার-সাইট/push-sw.js এভাবে access করা যেতে হবে

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Server থেকে push আসলে এটা চলবে
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: 'নতুন Notification', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'নতুন Notification';
  const options = {
    body: data.body || '',
    icon: data.icon || '/favico.png',
    badge: data.badge || '/favico.png',
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification এ ক্লিক করলে সেই URL এ নিয়ে যাবে
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
