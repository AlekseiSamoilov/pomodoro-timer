import style from "./style.module.css";

interface IProgress {
  count: number;
}

const Progress: React.FC<IProgress> = ({ count }) => {
  const colorCell = (index: number): string => {
    if (index < count) return "#40c463";
    return "#ebedf0";
  };
  const cells = Array.from({ length: 24 }, (_, i) => (
    <div
      key={i}
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: colorCell(i),
        margin: "2px",
      }}
    />
  ));
  return <div className={style.cells}>{cells}</div>;
};

export default Progress;
