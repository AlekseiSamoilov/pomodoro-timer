import React from "react";
import style from "./skip-button.module.css";

interface ISkipButtonProps {
  onClick: () => void;
  className?: string;
}

const SkipButton: React.FC<ISkipButtonProps> = ({ onClick, className }) => {
  return (
    <button className={`${style.skip_button} ${className}`} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m0 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v2.25m0 0h18M8.25 12l3.75 3.75L15.75 12"
        />
      </svg>
    </button>
  );
};

export default SkipButton;