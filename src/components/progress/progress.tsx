import { useState } from "react";
import style from "./style.module.css";
// #ed4141 red
// #40c463 green
interface IProgress {
  sessions: Array<"work" | "break">;
}

const Progress: React.FC<IProgress> = ({ sessions }) => {
  const totalCells = 36;
  const getColor = (index: number) => {
    if (index < sessions.length) {
      return sessions[index] === "work" ? "#ed4141" : "#40c463";
    }
    return "#ddd";
  };

  const cells = Array.from({ length: totalCells }, (_, i) => (
    <div
      className={style.cell}
      key={i}
      style={{ backgroundColor: getColor(i) }}
    />
  ));
  return <div className={style.cells}>{cells}</div>;
};

export default Progress;
