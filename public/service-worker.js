let timerEndTime = null;
let timerMode = null;

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SET_TIMER') {
        timerEndTime = event.data.endTime;
        timerMode = event.data.mode;
        setTimer();
    } else if (event.data && event.data.type === 'CANCEL_TIMER') {
        timerEndTime = null;
        timerMode = null;
    }
});

// function setTimer() {
//     if (timerEndTime) {
//         const now = Date.now();
//         const timeLeft = timerEndTime - now;

//         if (timeLeft <= 0) {
//             showNotification();
//         } else {
//             setTimeout(setTimer, Math.min(timeLeft, 2147483647));
//         }
//     }
// }

// function showNotification() {
//     const title = timerMode === 'work' ? 'Work Session Ended' : 'Break Time Over';
//     const body = timerMode === 'work'
//         ? "Time's up! Take a break. ⏰"
//         : "Break's over! Time to focus. 💻";

//     self.registration.showNotification(title, {
//         body: body,
//         icon: '/tomato.png'
//     });
// }