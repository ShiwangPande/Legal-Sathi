'use client';

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface ReadAloudButtonProps {
  text: string;
  title?: string;
  language: string;
  className?: string;
}

// Well-supported languages for speech synthesis
const wellSupportedLanguages = ['hi', 'en'];

export default function ReadAloudButton({ text, title, language, className = "" }: ReadAloudButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize speech synthesis support
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'speechSynthesis' in window;
      setIsSupported(supported);
      
      if (supported) {
        // Load voices
        window.speechSynthesis.getVoices();
        
        // Listen for voices loaded event
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    };

    checkSupport();

    // Cleanup
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Debug: Log available voices (remove this in production)
  useEffect(() => {
    if (isSupported && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    }
  }, [isSupported]);

  const handleSpeak = () => {
    if (!isSupported || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Combine title and text for reading
    const fullText = title ? `${title}. ${text}` : text;
    
    // Start speaking
    const utterance = new SpeechSynthesisUtterance(fullText);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
      // Language mapping with fallbacks - only well-supported languages
  const languageMap: { [key: string]: string[] } = {
    'hi': ['hi-IN', 'hi'], // Hindi - well supported
    'en': ['en-US', 'en-IN', 'en'], // English - well supported
    // For other languages, use English as fallback
    'bn': ['en-IN', 'en-US'], // Bengali -> English
    'te': ['en-IN', 'en-US'], // Telugu -> English
    'ta': ['en-IN', 'en-US'], // Tamil -> English
    'mr': ['en-IN', 'en-US'], // Marathi -> English
    'gu': ['en-IN', 'en-US'], // Gujarati -> English
    'kn': ['en-IN', 'en-US'], // Kannada -> English
    'ml': ['en-IN', 'en-US'], // Malayalam -> English
    'pa': ['en-IN', 'en-US'], // Punjabi -> English
    'ur': ['en-IN', 'en-US'], // Urdu -> English
    'or': ['en-IN', 'en-US'], // Odia -> English
    'as': ['en-IN', 'en-US'], // Assamese -> English
  };

    // Try to find a suitable voice
    const targetLanguages = languageMap[language] || ['en-US'];
    let selectedVoice = null;
    
    for (const lang of targetLanguages) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith(lang) || voice.lang.includes(lang)
      );
      if (selectedVoice) break;
    }

    // If no suitable voice found, use default
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = targetLanguages[0];
    }

    utterance.rate = 0.8; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.log('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Don't render if not supported or language not well-supported
  if (!isSupported || !wellSupportedLanguages.includes(language)) {
    return null;
  }
  
  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3 py-2 bg-[#98bad5] text-white rounded-lg hover:bg-[#c6d3e3] transition-colors text-sm ${className}`}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="h-4 w-4" />
          {language === "hi" ? "रोकें" : "Stop"}
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" />
          {language === "hi" ? "जोर से पढ़ें" : "Read Aloud"}
        </>
      )}
    </button>
  );
}
