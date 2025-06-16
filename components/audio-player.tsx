"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play, Pause, RotateCcw, SkipBack, AlertCircle,
  RefreshCw, Download, Volume2, VolumeX
} from "lucide-react"

// Mock Button component since we don't have access to shadcn/ui in this environment
const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    icon: "h-10 w-10"
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Mock Slider component
const Slider = {
  Root: ({ value, onValueChange, max, step, className = "" }) => {
    const handleChange = (e) => {
      const newValue = (e.target.value / max) * 100
      onValueChange([newValue])
    }
    
    return (
      <div className={`relative flex items-center ${className}`}>
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #304674 0%, #304674 ${value[0]}%, #b2cbde ${value[0]}%, #b2cbde 100%)`
          }}
        />
      </div>
    )
  },
  Track: ({ children }) => children,
  Range: ({ children }) => children,
  Thumb: ({ children }) => children
}

interface AudioPlayerProps {
  src: string
  autoPlay?: boolean
}

export default function UploadThingAudioPlayer({ src, autoPlay = false }: AudioPlayerProps) {
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

  // Separate effect for volume changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  // Main loading effect
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let timeout: NodeJS.Timeout
    setIsLoading(true)
    setError(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    const handleCanPlay = () => {
      console.log('Audio can start playing')
      setIsLoading(false)
      clearTimeout(timeout)
      if (autoPlay) {
        audio.play().then(() => setIsPlaying(true)).catch(() => setError("Autoplay failed"))
      }
    }

    const handleLoadedMetadata = () => {
      console.log('Metadata loaded, duration:', audio.duration)
      setDuration(audio.duration || 0)
    }

    const handleLoadedData = () => {
      console.log('Audio data loaded')
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleError = (e) => {
      console.error('Audio error:', e)
      setIsLoading(false)
      clearTimeout(timeout)
      const errorMsg = loadAttempts < maxRetries - 1
        ? `Load failed (attempt ${loadAttempts + 1}/${maxRetries})`
        : "Failed to load audio after multiple attempts."
      setError(errorMsg)
    }

    const handleLoadStart = () => {
      console.log('Started loading audio')
    }

    // Set a more reasonable timeout (5 seconds instead of 10)
    timeout = setTimeout(() => {
      if (audio.readyState < 2) { // HAVE_CURRENT_DATA
        console.log('Audio load timeout, readyState:', audio.readyState)
        setIsLoading(false)
        setError(`Audio load timeout (attempt ${loadAttempts + 1}/${maxRetries})`)
      }
    }, 5000)

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("error", handleError)

    // Force load the audio
    audio.load()

    return () => {
      clearTimeout(timeout)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("error", handleError)
    }
  }, [src, loadAttempts, autoPlay])

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return
    
    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (err) {
      console.error('Playback error:', err)
      setError("Playback error")
    }
  }

  const rewind10Seconds = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0)
    }
  }

  const replay = async () => {
    const audio = audioRef.current
    if (!audio) return
    
    audio.currentTime = 0
    try {
      await audio.play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Replay error:', err)
      setError("Playback error")
    }
  }

  const retryLoad = () => {
    if (loadAttempts < maxRetries - 1) {
      setLoadAttempts(prev => prev + 1)
      setError(null)
    }
  }

  const toggleMute = () => {
    const newMuted = !muted
    setMuted(newMuted)
    if (audioRef.current) {
      audioRef.current.muted = newMuted
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVol = value[0] / 100
    setVolume(newVol)
    const shouldMute = newVol === 0
    setMuted(shouldMute)
    
    if (audioRef.current) {
      audioRef.current.volume = newVol
      audioRef.current.muted = shouldMute
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
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Download error:', e)
      setError("Download failed.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    if (audioRef.current && duration && isFinite(duration)) {
      const newTime = percent * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (t: number) => {
    if (!isFinite(t) || isNaN(t)) return "0:00"
    const minutes = Math.floor(t / 60)
    const seconds = Math.floor(t % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progress = duration && isFinite(duration) && duration > 0 ? (currentTime / duration) * 100 : 0

  if (error) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
        {loadAttempts < maxRetries - 1 && (
          <Button onClick={retryLoad} size="sm" variant="outline" className="mt-3">
            Retry ({loadAttempts + 1}/{maxRetries})
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-[#d8e1e8] border border-[#b2cbde] rounded-xl shadow p-3 sm:p-4 space-y-3 sm:space-y-4">
      <audio 
        ref={audioRef} 
        preload="metadata" 
        src={src}
        crossOrigin="anonymous"
      />

      <div className="text-xs flex justify-between font-medium text-[#304674]">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Progress bar with circle */}
      <div
        className="relative h-2 w-full rounded-full cursor-pointer"
        style={{ backgroundColor: "#c6d3e3" }}
        onClick={handleProgressClick}
      >
        <div
          className="absolute top-0 left-0 h-2 rounded-full transition-all duration-100"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: "#304674" }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-100"
          style={{ 
            left: `calc(${Math.max(0, Math.min(100, progress))}% - 6px)`, 
            backgroundColor: "#98bad5" 
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
        <div className="flex gap-2 w-full sm:w-auto justify-center">
          <Button 
            onClick={rewind10Seconds} 
            variant="ghost" 
            size="icon" 
            className="text-[#304674] hover:text-[#98bad5] h-8 w-8 sm:h-10 sm:w-10"
            disabled={isLoading}
          >
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            onClick={togglePlayPause}
            size="icon"
            className="bg-[#304674] text-white hover:bg-[#98bad5] h-10 w-10 sm:h-12 sm:w-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </Button>
          <Button 
            onClick={replay} 
            variant="ghost" 
            size="icon" 
            className="text-[#304674] hover:text-[#98bad5] h-8 w-8 sm:h-10 sm:w-10"
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Volume and Download */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Volume */}
          <div className="flex items-center gap-2 flex-1 sm:flex-none sm:w-40">
            <Button 
              onClick={toggleMute} 
              variant="ghost" 
              size="icon" 
              className="text-[#304674] hover:text-[#98bad5] h-8 w-8 sm:h-10 sm:w-10"
            >
              {muted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>

            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-4"
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
            />
          </div>

          <Button 
            onClick={downloadAudio} 
            variant="ghost" 
            size="icon" 
            className="text-[#304674] hover:text-[#98bad5] h-8 w-8 sm:h-10 sm:w-10"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <RefreshCw className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-2">
          Loading: {isLoading ? 'Yes' : 'No'} | 
          Ready State: {audioRef.current?.readyState || 'N/A'} | 
          Network State: {audioRef.current?.networkState || 'N/A'}
        </div>
      )}
    </div>
  )
}