import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { getTheme, setTheme } from "../../lib/theme"; // Используем относительный путь

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = getTheme();
    setIsDark(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-accent))] transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[hsl(var(--color-foreground))]" />
      ) : (
        <Moon className="w-5 h-5 text-[hsl(var(--color-foreground))]" />
      )}
    </button>
  );
}