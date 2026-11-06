"use client";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
const subscribe = () => () => {};
const modes = [
  {
    value: "light",
    label: "Light",
    description: "A brighter perspective",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Easy on late-night eyes",
    Icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device",
    Icon: Monitor,
  },
];
export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const selected = mounted ? theme || "system" : "system";
  const CurrentIcon =
    modes.find((mode) => mode.value === selected)?.Icon || Monitor;
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger asChild>
        <button
          type="button"
          className="icon-button theme-trigger"
          aria-label={`Color theme: ${selected}. Change appearance`}
          title="Change appearance"
        >
          <span key={selected} className="theme-current-icon">
            <CurrentIcon size={19} aria-hidden="true" />
          </span>
        </button>
      </Menu.Trigger>
      <Menu.Portal>
        <div role="region" aria-label="Appearance settings">
          <Menu.Content
            className="theme-menu"
            align="end"
            sideOffset={10}
            collisionPadding={12}
            aria-label="Appearance"
          >
            <Menu.Label className="theme-menu-label">
              YOUR KIND OF LIGHT
            </Menu.Label>
            <Menu.RadioGroup value={selected} onValueChange={setTheme}>
              {modes.map(({ value, label, description, Icon }) => (
                <Menu.RadioItem
                  key={value}
                  value={value}
                  className="theme-option"
                >
                  <span className="theme-option-icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                  <Menu.ItemIndicator className="theme-selected">
                    <Check size={16} aria-hidden="true" />
                  </Menu.ItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
            <Menu.Separator className="theme-menu-separator" />
            <p className="theme-menu-note">
              A little comfort, saved for next time.
            </p>
          </Menu.Content>
        </div>
      </Menu.Portal>
    </Menu.Root>
  );
}
