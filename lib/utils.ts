import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let timeGreeting = "Good evening";
  
  if (hour < 12) {
    timeGreeting = "Good morning";
  } else if (hour < 18) {
    timeGreeting = "Good afternoon";
  }
  
  return `${timeGreeting}, ${name}!`;
}
