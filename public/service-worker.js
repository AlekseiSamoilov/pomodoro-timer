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
