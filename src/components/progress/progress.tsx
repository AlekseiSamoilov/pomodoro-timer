import { useState } from "react";
import style from "./style.module.css";
import React from "react";
// #ed4141 red
// #40c463 green
interface IProgress {
  sessions: Array<"work" | "break">;
}

const Progress: React.FC<IProgress> = React.memo(({ sessions }) => {
  const totalCells = 36;
  const getColor = (index: number) => {
    if (index < sessions.length) {
      return sessions[index] === "work" ? "#ed4141" : "#40c463";
    }
    return "rgba(255,255,255,.2)";
  };

  const cells = Array.from({ length: totalCells }, (_, i) => (
    <div
      className={style.cell}
      key={i}
      style={{ backgroundColor: getColor(i) }}
    />
  ));
  return <div className={style.cells}>{cells}</div>;
});

export default Progress;
