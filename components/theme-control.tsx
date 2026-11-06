"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
const subscribe = () => () => {};
export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return (
    <label className="theme-control">
      <Sun size={16} className="sun-icon" />
      <Moon size={16} className="moon-icon" />
      <span className="sr-only">Color theme</span>
      <select
        aria-label="Color theme"
        value={mounted ? theme : "system"}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
  );
}
