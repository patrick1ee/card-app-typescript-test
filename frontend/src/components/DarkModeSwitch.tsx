import { useContext } from 'react';

import { ThemeContextType } from "../@types/context";
import { ThemeContext } from "../utilities/globalContext";

export default function DarkModeSwitch () {
 const { mode, toggleMode } = useContext(ThemeContext) as ThemeContextType;

 const isDarkMode = mode === "dark";
 const labelText = isDarkMode ? "Dark Mode" : "Light Mode";

  return (
    <div className="flex justify-center items-center  text-black dark:text-white">
      <span className="mr-3">{ labelText  }</span>
      <label className="relative inline-block w-14 h-8">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleMode}
          className="sr-only peer"
        />
        <span className="block bg-gray-300 w-full h-full rounded-full cursor-pointer peer-checked:bg-blue-500"></span>
        <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 dark:bg-gray-700"></span>
      </label>
    </div>
  );
};