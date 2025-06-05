"use client"

import dynamic from "next/dynamic"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Headphones } from "lucide-react"

const AudioPlayer = dynamic(
  () => import("./audio-player").then((mod) => mod.UploadThingAudioPlayer),
  { ssr: false }
)

interface AudioPlayerWrapperProps {
  src: string
}

export default function AudioPlayerWrapper({ src }: AudioPlayerWrapperProps) {
  const [showPlayer, setShowPlayer] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)

  const handleListenClick = () => {
    setShowPlayer(true)
    setAutoPlay(true)
  }

  if (!showPlayer) {
    return (
      <div className="flex items-center justify-center">
        <Button
          onClick={handleListenClick}
          className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-150"
        >
          <Headphones className="w-5 h-5 mr-2" />
          Listen
        </Button>
      </div>
    )
  }

  return <AudioPlayer src={src} autoPlay={autoPlay}  />
}
