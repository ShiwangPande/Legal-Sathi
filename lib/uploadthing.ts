import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@clerk/nextjs/server"
import { UTApi } from "uploadthing/server"

const f = createUploadthing()
const utapi = new UTApi()

// Utility function to delete image from UploadThing
export async function deleteImageFromUploadThing(imageUrl: string | null | undefined) {
  if (!imageUrl) return;

  try {
    // Extract the file key from the URL
    const fileKey = imageUrl.split('/').pop();
    if (!fileKey) return;

    // Delete the file from UploadThing
    await utapi.deleteFiles(fileKey);
    console.log(`Successfully deleted image: ${fileKey}`);
  } catch (error) {
    console.error("Error deleting image from UploadThing:", error);
  }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique route key
  imageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth()
      if (!userId) throw new Error("Unauthorized")
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      return { uploadedBy: metadata.userId, url: file.url }
    }),

  audioUploader: f({ audio: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth()
      if (!userId) throw new Error("Unauthorized")
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
