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

  const startTimeRef = useRef<Date | null>(null);

  const audioRef = useRef(new Audio(process.env.PUBLIC_URL + "/alarm.mp3"));

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function tick() {
    if (startTimeRef.current) {
      const now = new Date().getTime();
      const elapsed = (now - startTimeRef.current.getTime()) / 1000;
      const currentTotalSeconds =
        modeRef.current === "work" ? workMinutes * 60 : breakMinutes * 60;
      const newSecondsLeft = currentTotalSeconds - Math.floor(elapsed);

      if (newSecondsLeft <= 0) {
        audioRef.current.play();
        switchMode();
      } else {
        setSecondsLeft(newSecondsLeft);
        setTimeout(tick, 1000 - (elapsed % 1) * 1000);
      }
    }
  }

  function startTimer() {
    if (!startTimeRef.current) {
      startTimeRef.current = new Date(
        new Date().getTime() - (totalSeconds - secondsLeft) * 1000
      );
    }
    setIsPaused(false);
    isPausedRef.current = false;
    setTimeout(tick, 1000);
  }

  function pauseTimer() {
    setIsPaused(true);
    isPausedRef.current = true;
    startTimeRef.current = null;
  }

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  useEffect(() => {
    if (secondsLeft === 0 && !isPaused) {
      audioRef.current.play();
    }
  }, [secondsLeft, isPaused]);

  const handlePomodoroComplete = (type: string) => {
    setPomodoroSessions((prev: any) => [...prev, type]);
  };

  function switchMode() {
    const nextMode = modeRef.current === "work" ? "break" : "work";
    setMode(nextMode);
    modeRef.current = nextMode;

    const nextSeconds = (nextMode === "work" ? workMinutes : breakMinutes) * 60;
    setSecondsLeft(nextSeconds);
    secondsLeftRef.current = nextSeconds;
    startTimeRef.current = new Date();

    if (nextMode === "break") {
      handlePomodoroComplete("work");
    } else {
      handlePomodoroComplete("break");
    }
  }

  function initTimer() {
    const initialSeconds = (mode === "work" ? workMinutes : breakMinutes) * 60;
    setSecondsLeft(initialSeconds);
    secondsLeftRef.current = initialSeconds;
    startTimeRef.current = new Date();
  }

  useEffect(() => {
    initTimer();
  }, [showSettings, workMinutes, breakMinutes, mode]);

  // useEffect(() => {
  //   initTimer();
  //   startTimeRef.current = new Date();
  // }, [showSettings, workMinutes, breakMinutes]);

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
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
