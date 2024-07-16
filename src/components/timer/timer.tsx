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
  const { showSettings, setShowSettings, workMinutes, breakMinutes } =
    useContext(SettingsContext);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [mode, setMode] = useState<"work" | "break">("work");

const isToday = (someDate: Date) => {
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
  })

  const saveSessions = useCallback(() => {
    const sessionData = {
      date: new Date(),
      sessions: pomodoroSessions
    };
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessionData));
  }, [pomodoroSessions])

  const resetSessionsIfNewDay = useCallback(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    if (savedSessions) {
      const parseSessions = JSON.parse(savedSessions);
      if (!isToday(new Date(parseSessions.date))) {
        setPomodoroSessions([]);
        saveSessions();
      }
    }
  }, [saveSessions]);

  const audioRef = useRef(new Audio(process.env.PUBLIC_URL + "/alarm.mp3"));

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

const tick = useCallback(() => {
  secondsLeftRef.current--;
  setSecondsLeft(secondsLeftRef.current);
}, [])
  
function startTimer() {
  setIsPaused(false);
  isPausedRef.current = false;
}

function pauseTimer() {
  setIsPaused(true);
  isPausedRef.current = true;
}

  const handlePomodoroComplete = useCallback((type: 'work' | 'break') => {
    setPomodoroSessions(prev => {
      const newSessions = [...prev, type];
      return newSessions;
    });
  },[]);

const switchMode = useCallback(() => {
    const nextMode = mode === 'work' ? 'break' : 'work';
    const nextSeconds = (nextMode === 'work' ? workMinutes : breakMinutes) * 60;

    setMode(nextMode);
    modeRef.current = nextMode;
    setSecondsLeft(nextSeconds);
    secondsLeftRef.current = nextSeconds;

    handlePomodoroComplete(mode)

    setIsPaused(true);
    isPausedRef.current = true;
  }, [workMinutes, breakMinutes, handlePomodoroComplete, mode]);

const initTimer = useCallback(() => {
    const initialSeconds = workMinutes * 60;
    setSecondsLeft(initialSeconds);
    secondsLeftRef.current = initialSeconds;
    setMode('work');
    modeRef.current = 'work';
  }, [workMinutes]);

  const sendNotification = useCallback(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const notificationTitle = mode === 'work' ? 'Work Session Ended' : 'Break Time Over';
        const notificationBody = mode === 'work'
        ? "Time's up! Take a break. ⏰" 
        : "Break's over! Time to focus. 💻" ;
        
        new Notification(notificationTitle, {
          body: notificationBody,
          icon: "/tomato.png"
        });
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    } 
  }, [mode]);

  useEffect(() => {
    resetSessionsIfNewDay();
    const interval = setInterval(resetSessionsIfNewDay, 3600000);
    return () => clearInterval(interval);
  }, [resetSessionsIfNewDay]);

  useEffect(() => {
    saveSessions();
  }, [pomodoroSessions, saveSessions])

  useEffect(() => {
    initTimer();
  }, [showSettings, initTimer]);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
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

  }, [switchMode, tick, mode, pomodoroSessions, sendNotification]);


  const totalSeconds = (modeRef.current === "work" ? workMinutes : breakMinutes) * 60;
  const percantage = Math.round((secondsLeft / totalSeconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  let secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;




  return (
    <div className={style.timer_container}>
      <CircularProgressbar
        value={percantage}
        text={`${minutes}:${secondsFormatted}`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: mode === "work" ? "#ed4141" : "#40c463",
          trailColor: "rgba(255,255,255,.2)",
          backgroundColor: "#40c463",
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
