
import style from "./style.module.css";
import React from "react";

interface IProgress {
  sessions: Array<"work" | "break">;
}

const Progress: React.FC<IProgress> = React.memo(({ sessions }) => {
  const totalCells = 48;
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
