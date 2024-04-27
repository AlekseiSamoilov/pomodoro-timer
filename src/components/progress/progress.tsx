import style from "./style.module.css";
// #ed4141 red
// #40c463 green
interface IProgress {
  count: number;
}

const Progress: React.FC<IProgress> = ({ count }) => {
  const colorCell = (index: number): string => {
    if (index < count) return "#ed4141";
    return "rgba(255,255,255,.1)";
  };

  const cells = Array.from({ length: 24 }, (_, i) => (
    <div
      className={style.cell}
      key={i}
      style={{ backgroundColor: colorCell(i) }}
    />
  ));
  return <div className={style.cells}>{cells}</div>;
};

export default Progress;
