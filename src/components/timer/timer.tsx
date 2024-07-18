import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "../play-button/play-button";
import style from "./timer.module.css";
import PauseButton from "../pause-button/pause-button";
import SettingsButton from "../settings-button/settings-button";
import SettingsContext from "../settings-context/SettingsContext";
import Progress from "../progress/progress";

function Timer() {
  const { showSettings, setShowSettings, workMinutes, breakMinutes } = useContext(SettingsContext);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [mode, setMode] = useState<"work" | "break">("work");

  const isToday = (someDate: Date): boolean => {
    const today = new Date()
    return someDate.getDate() === today.getDate() && 
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  }

  const [pomodoroSessions, setPomodoroSessions] = useState<("work" | "break")[]>(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    if (savedSessions) {
      const parsedSession = JSON.parse(savedSessions);
      if (isToday(new Date(parsedSession.date))) {
        return parsedSession.sessions;
      }
    }
    return [];
  });

  const audioRef = useRef(new Audio(process.env.PUBLIC_URL + "/alarm.mp3"));
  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  const savePomodoroSessions = useCallback(() => {
    const sessionsData = {
      date: new Date(),
      sessions: pomodoroSessions
    };
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessionsData));
  }, [pomodoroSessions])

  const updateServiceWorker = useCallback((duration: number, mode: 'work' | 'break') => {
    if (navigator.serviceWorker.controller) {
      const endTime = Date.now() + duration * 1000;
      navigator.serviceWorker.controller.postMessage({
        type: 'SET_TIMER',
        endTime: endTime,
        mode: mode
      });
    }
  }, []);

  const tick = useCallback(() => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }, []);

  const initTimer = useCallback(() => {
    
    const initialSeconds = (modeRef.current === 'work' ? workMinutes : breakMinutes) * 60;
    secondsLeftRef.current = initialSeconds;
    setSecondsLeft(initialSeconds);
    setIsPaused(true);
    isPausedRef.current = true;
  }, [workMinutes, breakMinutes]);

  const switchMode = useCallback(() => {
    setPomodoroSessions(prev => [...prev, mode]);
    
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    initTimer();
  }, [initTimer, mode]);

  const sendNotification = useCallback(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(modeRef.current === 'work' ? 'Work Session Ended' : 'Break Time Over', {
        body: modeRef.current === 'work' ? "Time's up! Take a break. ⏰" : "Break's over! Time to focus. 💻",
        icon: "/tomato.png"
      });
    }
  }, []);

  function startTimer() {
    setIsPaused(false);
    isPausedRef.current = false;
    updateServiceWorker(secondsLeftRef.current, modeRef.current);
  }

  function pauseTimer() {
    setIsPaused(true);
    isPausedRef.current = true;
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CANCEL_TIMER' });
    }
  }

  useEffect(() => {
    initTimer();

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        audioRef.current.play();
        sendNotification();
        switchMode();
        return;
      }
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [initTimer, sendNotification, switchMode, tick]);

  useEffect(() => {
    savePomodoroSessions();
  }, [pomodoroSessions, savePomodoroSessions]);

  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setPomodoroSessions([]);
        savePomodoroSessions();
      }
    };

    const interval = setInterval(checkDate, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, [savePomodoroSessions]);

  const totalSeconds = (modeRef.current === "work" ? workMinutes : breakMinutes) * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className={style.timer_container}>
      <CircularProgressbar
        value={percentage}
        text={`${minutes}:${secondsFormatted}`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: mode === "work" ? "#ed4141" : "#40c463",
          trailColor: "rgba(255,255,255,.2)",
        })}
      />
      <div className={style.button_container}>
        {isPaused ? (
          <PlayButton onClick={startTimer} />
        ) : (
          <PauseButton onClick={pauseTimer} />
        )}
      </div>
      <Progress sessions={pomodoroSessions} />
      <div className={style.settings_button_container}>
        <SettingsButton onClick={() => setShowSettings(true)} />
      </div>
    </div>
  );
}

export default Timer;