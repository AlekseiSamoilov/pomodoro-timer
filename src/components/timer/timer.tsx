import React, { useContext, useState, useEffect, useRef } from "react";
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
  const [mode, setMode] = useState<"work" | "break" | "pause">("work");
  const [pomodoroSessions, setPomodoroSessions] = useState<
    ("work" | "break")[]
  >([]);

  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const audioRef = useRef(new Audio(process.env.PUBLIC_URL + "/alarm.mp3"));

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function tick() {
    if (startTimeRef.current === null || endTimeRef.current === null) return;
  
    const now = Date.now();
    const newSecondsLeft = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
  
    if (newSecondsLeft !== secondsLeftRef.current) {
      setSecondsLeft(newSecondsLeft);
      secondsLeftRef.current = newSecondsLeft;
    }
  
    if (newSecondsLeft > 0 && !isPausedRef.current) {
      rafIdRef.current = requestAnimationFrame(tick);
    } else if (newSecondsLeft === 0) {
      audioRef.current.play();
      switchMode();
    }
  }
  
function startTimer() {
  const now = Date.now();
  startTimeRef.current = now;
  endTimeRef.current = now + secondsLeftRef.current * 1000;

  setIsPaused(false);
  isPausedRef.current = false;
  rafIdRef.current = requestAnimationFrame(tick);
}

  function pauseTimer() {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    setIsPaused(true);
    isPausedRef.current = true;
    if (startTimeRef.current !== null && endTimeRef.current !== null) {
      const timeLeft = endTimeRef.current - Date.now();
      endTimeRef.current = Date.now() + timeLeft
    }
  }


  const handlePomodoroComplete = (type: 'work' | 'break') => {
    setPomodoroSessions((prev: any) => [...prev, type]);
  };

  function switchMode() {
    const nextMode = modeRef.current === 'work' ? 'break' : 'work';
    const nextSeconds = (nextMode === 'work' ? workMinutes : breakMinutes) * 60;

    setMode(nextMode);
    modeRef.current = nextMode;
    setSecondsLeft(nextSeconds);
    secondsLeftRef.current = nextSeconds;

    const now = Date.now();
    startTimeRef.current = now;
    endTimeRef.current = now + nextSeconds * 1000;

    if (nextMode === 'break') {
      handlePomodoroComplete('work');
    } else {
      handlePomodoroComplete('break');
    }

    if (!isPausedRef.current) {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }

  function initTimer() {
    const initialSeconds = (mode === 'work' ? workMinutes : breakMinutes) * 60;
    setSecondsLeft(initialSeconds);
    secondsLeftRef.current = initialSeconds;

    const now = Date.now();
    startTimeRef.current = now;
    endTimeRef.current = now + initialSeconds * 1000;
  }

  useEffect(() => {
    initTimer();
  }, [showSettings, workMinutes, breakMinutes, mode]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

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
