"use client"

import { useRef, useState, useEffect } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReuseAudioPlayerProps {
  src: string
}

export const ReuseAudioPlayer: React.FC<ReuseAudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener("ended", handleEnded)

    return () => audio.removeEventListener("ended", handleEnded)
  }, [])

  return (
    <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm w-fit">
      <audio ref={audioRef} src={src} preload="auto" />
      <Button onClick={togglePlayPause} variant="outline">
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <Button onClick={resetAudio} variant="ghost">
        <RotateCcw />
      </Button>
    </div>
  )
}
