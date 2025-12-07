import { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { flushSync } from "react-dom";

export const AnimatedThemeToggler = ({ className, duration = 450 }) => {
  const { isDark, toggleTheme } = useTheme();
  const btnRef = useRef(null);

  const handleToggle = async () => {
    if (!document.startViewTransition || !btnRef.current) {
      toggleTheme();
      return;
    }

    const rect = btnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);

    const transition = document.startViewTransition(() => {
      flushSync(() => toggleTheme());
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <button
      ref={btnRef}
      onClick={handleToggle}
      className={cn("p-2 rounded-full", className)}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
