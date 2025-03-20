import { registerRootComponent } from 'expo';
import App from './App';
import { LogBox } from "react-native";

// ✅ Ignore ALL logs from UI but keep them in the console
LogBox.ignoreAllLogs(); // Hides warnings in the UI

// ✅ Auto-detect & suppress ANY warning dynamically (while still logging them)
const originalWarn = console.warn;
console.warn = (...args) => {
  if (__DEV__) {
    // ✅ Log all warnings in development mode
    originalWarn(...args);
  }
};


registerRootComponent(App);
