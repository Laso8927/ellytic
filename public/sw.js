self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data?.json?.() || {}; } catch (_) {}
  const title = data.title || 'Ellytic';
  const body = data.body || 'You have a new notification';
  event.waitUntil(self.registration.showNotification(title, { body }));
});

