"use client";

import { useState, useEffect } from "react";
import { Volume2, Pause, Play, VolumeX } from "lucide-react";

interface ReadAloudProps {
  targetId: string;
}

export default function ReadAloud({ targetId }: ReadAloudProps) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check browser support
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.error("Speech synthesis not supported in this browser");
      setIsSupported(false);
      return;
    }

    // Load voices - critical for mobile browsers
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("Voices loaded:", voices.length);
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    // Try to load voices immediately
    loadVoices();

    // Also listen for voiceschanged event (important for mobile)
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  const handleClick = () => {
    // Check support
    if (!isSupported) {
      console.error("Speech synthesis not supported");
      alert("Text-to-speech is not supported in this browser");
      return;
    }

    // Check if voices are loaded
    if (!voicesLoaded) {
      console.warn("Voices not loaded yet, forcing load...");
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        alert("Voice loading failed. Please try again in a few seconds.");
        return;
      }
    }

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

    if (!content) {
      console.error("Content element not found");
      return;
    }

    const text = content.innerText;

    if (!text || text.trim().length === 0) {
      console.error("No text to read");
      return;
    }

    console.log("Starting speech synthesis with text length:", text.length);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Select a good voice - important for mobile compatibility
    const voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices.length);
    
    // Prefer English voices, especially Google voices which work well on mobile
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Samantha') || voice.name.includes('Daniel'))
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log("Using voice:", preferredVoice.name);
    }

    utterance.lang = preferredVoice?.lang || 'en-US';

    utterance.onstart = () => {
      console.log("Speech started");
      setIsReading(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      console.log("Speech ended");
      setIsReading(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event);
      setIsReading(false);
      setIsPaused(false);
    };

    // Cancel any existing speech before starting new one
    window.speechSynthesis.cancel();
    
    // Small delay to ensure cancel completes (important for mobile)
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Failed to speak:", error);
        setIsReading(false);
      }
    }, 100);
  };

return (
  <>
    {isPaused && (
      <button
        onClick={stopReading}
        className="
          fixed
          bottom-39
          lg:bottom-24
          right-3
          lg:right-7
          z-50
          h-9
          w-9
          rounded-lg
          cursor-pointer
          border
          border-border
          bg-red-500
          text-white
          shadow-xl
          flex
          items-center
          justify-center
          hover:scale-110
          transition-all
          duration-200
        "
        title="Stop Reading"
      >
        <VolumeX className="w-4 h-4 fill-current" />
      </button>
    )}

    <button
      onClick={handleClick}
      className="
        fixed
        bottom-25
        lg:bottom-10
        right-2
        lg:right-6
        z-50
        h-11
        w-11
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
          ? 'Read Aloud'
          : isPaused
          ? 'Resume Reading'
          : 'Pause Reading'
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
  </>
);
}