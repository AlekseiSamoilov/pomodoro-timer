import React, { useContext } from "react";
import style from "./settings.module.css";
import ReactSlider from "react-slider";
import SettingsContext from "../settings-context/SettingsContext";
import BackButton from "../back-button/BackButton";

const Settings = () => {
  const {
    workMinutes,
    breakMinutes,
    setWorkMinutes,
    setBreakMinutes,
    showSettings,
    setShowSettings,
  } = useContext(SettingsContext);
  if (!showSettings) {
    return null;
  }
  return (
    <div className={style.settings_container}>
      <label className={style.label_text}>work: {workMinutes} min</label>
      <ReactSlider
        className={style.slider}
        value={workMinutes}
        thumbClassName={style.thumb}
        trackClassName={style.track}
        min={1}
        max={60}
        onChange={(newValue) => setWorkMinutes(newValue)}
      />
      <label className={style.label_text}>break: {breakMinutes} min</label>
      <ReactSlider
        className={style.slider_green}
        value={breakMinutes}
        thumbClassName={`${style.thumb} ${style.thumb_green}`}
        trackClassName={style.track}
        onChange={(newValue) => setBreakMinutes(newValue)}
        min={1}
        max={30}
      />
      <div className={style.back_button_container}>
        <BackButton onClick={() => setShowSettings(false)} />
      </div>
    </div>
  );
};

export default Settings;
