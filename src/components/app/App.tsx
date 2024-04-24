import React, { useState } from "react";
import style from "./app.module.css";
import Timer from "../timer/timer";
import Settings from "../settings/settings";
import SettingsContext from "../settings-context/SettingsContext";

const App = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [workMinutes, setWorkMinutes] = useState<number>(20);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  return (
    <main className={style.main}>
      <SettingsContext.Provider
        value={{
          workMinutes,
          breakMinutes,
          setWorkMinutes,
          setBreakMinutes,
          showSettings,
          setShowSettings,
        }}
      >
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
};

export default App;
