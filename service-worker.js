self.addEventListener('push', function (event) {
    const title = 'Pomodoro Timer';
    const options = {
        body: 'Time is up ⏰',
        icon: '%PUBLIC_URL%/tomato.png',
        badge: '%PUBLIC_URL%/tomato.png',
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notificaion.close();
    event.waitUntil(
        client.openWindow('/')
    );
});