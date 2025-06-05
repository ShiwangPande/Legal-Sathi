"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { useUploadThing } from "@/lib/uploadthing-client"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UploadAudioProps {
  onUploadComplete: (url: string) => void
  onUploadError?: (error: Error) => void
}

export function UploadAudio({ onUploadComplete, onUploadError }: UploadAudioProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing("audioUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onUploadComplete(res[0].url)
        setIsUploaded(true)
        setProgress(100)
      }
    },
    onUploadError: (err) => {
      setError(err.message)
      if (onUploadError) {
        onUploadError(err)
      }
    },
    onUploadProgress: (p) => {
      setProgress(p)
    },
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        setError(null)
        setIsUploaded(false)
      }
    },
    [setFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: permittedFileInfo?.audio ? generateClientDropzoneAccept(["audio/*"]) : undefined,
    maxFiles: 1,
    maxSize: 16 * 1024 * 1024, // 16MB
  })

  const handleUpload = () => {
    if (file) {
      startUpload([file])
    }
  }

  const handleRemove = () => {
    setFile(null)
    setProgress(0)
    setError(null)
    setIsUploaded(false)
  }

  return (
    <div className="space-y-4">
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop the audio file here" : "Drag & drop audio file here, or click to select"}
            </p>
            <p className="text-xs text-gray-500">MP3, WAV, or OGG (Max 16MB)</p>
          </div>
        </div>
      )}

      {file && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {isUploaded ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : error ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs font-medium">AUDIO</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>

          {(isUploading || progress > 0) && !isUploaded && !error && (
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Uploading: {Math.round(progress)}%</p>
            </div>
          )}

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          {!isUploaded && !isUploading && !error && (
            <div className="mt-3">
              <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>Upload Audio</>
                )}
              </Button>
            </div>
          )}

          {isUploaded && (
            <p className="text-sm text-green-500 mt-2 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1" /> Upload complete
            </p>
          )}
        </div>
      )}
    </div>
  )
}
