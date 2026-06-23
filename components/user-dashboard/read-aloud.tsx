"use client";

import { useState } from "react";
import { Volume2, Pause, Play } from "lucide-react";

interface ReadAloudProps {
  targetId: string;
}

export default function ReadAloud({ targetId }: ReadAloudProps) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleClick = () => {
    // Resume
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Pause
    if (isReading) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    const content = document.getElementById(targetId);

    if (!content) return;

    const text = content.innerText;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleClick}
      className="
        fixed
        bottom-25
        lg:bottom-10
        right-2
        lg:right-6
        z-50
        h-12
        w-12
        rounded-xl
        cursor-pointer
        border
        border-border
        bg-primary
        text-primary-foreground
        shadow-xl
        flex
        items-center
        justify-center
        hover:scale-110
        transition-all
        duration-200
      "
      title={
        !isReading
          ? "Read Aloud"
          : isPaused
          ? "Resume Reading"
          : "Pause Reading"
      }
    >
      {!isReading ? (
        <Volume2 className="w-5 h-5" />
      ) : isPaused ? (
        <Play className="w-5 h-5" />
      ) : (
        <Pause className="w-5 h-5" />
      )}
    </button>
  );
}