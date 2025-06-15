"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play, Pause, RotateCcw, SkipBack, AlertCircle,
  RefreshCw, Download, Volume2, VolumeX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import * as Slider from "@radix-ui/react-slider"

interface AudioPlayerProps {
  src: string
  autoPlay?: boolean
}

export function UploadThingAudioPlayer({ src, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadAttempts, setLoadAttempts] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)

  const maxRetries = 3

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.muted = muted

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [volume, muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setIsLoading(true)
    setError(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    const timeout = setTimeout(() => {
      if (audio.readyState < 3) {
        setIsLoading(false)
        setError(`Audio load timeout (attempt ${loadAttempts + 1}/${maxRetries})`)
      }
    }, 10000)

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
      clearTimeout(timeout)
      if (autoPlay) {
        audio.play().then(() => setIsPlaying(true)).catch(() => setError("Autoplay failed"))
      }
    }

    const handleError = () => {
      setIsLoading(false)
      clearTimeout(timeout)
      setError(loadAttempts < maxRetries - 1
        ? `Load failed (attempt ${loadAttempts + 1}/${maxRetries})`
        : "Failed to load audio after multiple attempts.")
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("error", handleError)

    return () => {
      clearTimeout(timeout)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("error", handleError)
    }
  }, [src, loadAttempts, autoPlay])

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      isPlaying ? audio.pause() : await audio.play()
      setIsPlaying(!isPlaying)
    } catch {
      setError("Playback error")
    }
  }

  const rewind10Seconds = () => {
    const audio = audioRef.current
    if (audio) audio.currentTime = Math.max(audio.currentTime - 10, 0)
  }

  const replay = async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setError("Playback error")
    }
  }

  const retryLoad = () => {
    setLoadAttempts(prev => prev + 1)
    setError(null)
  }

  const toggleMute = () => setMuted(!muted)

  const handleVolumeChange = (value: number[]) => {
    const newVol = value[0] / 100
    setVolume(newVol)
    setMuted(newVol === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVol
      audioRef.current.muted = newVol === 0
    }
  }

  const downloadAudio = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(src)
      if (!response.ok) throw new Error("Failed to fetch audio file")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const ext = src.split('.').pop()?.split('?')[0] || 'mp3'
      const a = document.createElement('a')
      a.href = url
      a.download = `audio-${Date.now()}.${ext}`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      setError("Download failed.")
    } finally {
      setIsDownloading(false)
    }
  }

  const formatTime = (t: number) =>
    isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}` : "0:00"

  const progress = duration && isFinite(duration) ? (currentTime / duration) * 100 : 0

  if (error) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
        <Button onClick={retryLoad} size="sm" variant="outline" className="mt-3">Retry</Button>
      </div>
    )
  }

  return (
  <div className="bg-[#d8e1e8] border border-[#b2cbde] rounded-xl shadow p-4 space-y-4">
  <audio ref={audioRef} preload="metadata" src={src} />

  <div className="text-xs flex justify-between font-medium text-[#304674]">
    <span>{formatTime(currentTime)}</span>
    <span>{formatTime(duration)}</span>
  </div>

  {/* Progress bar with circle */}
  <div
    className="relative h-2 w-full rounded-full cursor-pointer"
    style={{ backgroundColor: "#c6d3e3" }}
    onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      if (audioRef.current && duration && isFinite(duration)) {
        audioRef.current.currentTime = percent * duration
        setCurrentTime(audioRef.current.currentTime)
      }
    }}
  >
    <div
      className="absolute top-0 left-0 h-2 rounded-full"
      style={{ width: `${progress}%`, backgroundColor: "#304674" }}
    />
    <div
      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
      style={{ left: `calc(${progress}% - 6px)`, backgroundColor: "#98bad5" }}
    />
  </div>

  {/* Controls */}
  <div className="flex items-center justify-between">
    <div className="flex gap-2">
      <Button onClick={rewind10Seconds} variant="ghost" size="icon" className="text-[#304674] hover:text-[#98bad5]">
        <SkipBack className="w-5 h-5" />
      </Button>
      <Button
        onClick={togglePlayPause}
        size="icon"
        className="bg-[#304674] text-white hover:bg-[#98bad5]"
      >
        {isLoading ? (
          <RefreshCw className="animate-spin w-5 h-5" />
        ) : isPlaying ? (
          <Pause />
        ) : (
          <Play />
        )}
      </Button>
      <Button onClick={replay} variant="ghost" size="icon" className="text-[#304674] hover:text-[#98bad5]">
        <RotateCcw className="w-5 h-5" />
      </Button>
    </div>

    {/* Volume */}
    <div className="flex items-center gap-2 w-40">
      <Button onClick={toggleMute} variant="ghost" size="icon" className="text-[#304674] hover:text-[#98bad5]">
        {muted || volume === 0 ? <VolumeX /> : <Volume2 />}
      </Button>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-4"
        value={[volume * 100]}
        onValueChange={handleVolumeChange}
        max={100}
        step={1}
      >
        <Slider.Track className="relative grow rounded-full h-1" style={{ backgroundColor: "#b2cbde" }}>
          <Slider.Range className="absolute rounded-full h-1" style={{ backgroundColor: "#304674" }} />
        </Slider.Track>
        <Slider.Thumb
          className="block w-3 h-3 rounded-full hover:scale-110 transition-transform"
          style={{ backgroundColor: "#98bad5" }}
        />
      </Slider.Root>
    </div>

    <Button onClick={downloadAudio} variant="ghost" size="icon" className="text-[#304674] hover:text-[#98bad5]">
      {isDownloading ? (
        <RefreshCw className="animate-spin w-5 h-5" />
      ) : (
        <Download className="w-5 h-5" />
      )}
    </Button>
  </div>
</div>

  )
}
