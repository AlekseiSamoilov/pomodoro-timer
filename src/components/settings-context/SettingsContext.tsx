import React from "react";

interface ISettingsContext {
  workMinutes: number;
  breakMinutes: number;
  setWorkMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const SettingsContext = React.createContext<ISettingsContext>({
  workMinutes: 45,
  breakMinutes: 5,
  setWorkMinutes: () => {},
  setBreakMinutes: () => {},
  showSettings: false,
  setShowSettings: () => {},
});

export default SettingsContext;
