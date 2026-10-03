import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const styles = {
  button: {
    primary:
      "bg-[var(--primary)] text-white hover:bg-[var(--dark-primary)]",

    secondary:
      "bg-[var(--surface)] text-[var(--primary)] border border-[var(--subtle-border)]",
  },

  card:
    "bg-[var(--surface)] rounded-[16px] border border-[var(--subtle-border)]",

  input:
    "bg-[var(--surface)] border border-[var(--subtle-border)] rounded-[10px]",

  text: {
    primary: "text-[var(--primary-text)]",
    muted: "text-[var(--muted-text)]",
  },
};
