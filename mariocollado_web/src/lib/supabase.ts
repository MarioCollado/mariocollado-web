import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.SUPABASE_URL!,
  import.meta.env.SUPABASE_ANON_KEY!
);

export interface MediaItem {
  url: string;
  name: string;
  type: "photo" | "video";
}

export async function getImageUrls() {
  const { data } = await supabase.storage.from("fotos").list();
  return (
    data?.map(
      (file) =>
        `${
          import.meta.env.PUBLIC_SUPABASE_URL
        }/storage/v1/object/public/fotos/${file.name}`
    ) ?? []
  );
}

export async function getPhotos(): Promise<MediaItem[]> {
  try {
    console.log("Fetching photos from 'media/photos' folder...");
    const { data, error } = await supabase.storage.from("media").list("photos");

    if (error) {
      console.error("Error fetching photos from media/photos:", error);
      return [];
    }

    console.log("Found photos in 'media/photos' folder:", data?.length || 0);
    return (
      data?.map((file) => ({
        url: supabase.storage.from("media").getPublicUrl(`photos/${file.name}`)
          .data.publicUrl,
        name: file.name,
        type: "photo" as const,
      })) ?? []
    );
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}

export async function getVideos(): Promise<MediaItem[]> {
  try {
    console.log("Fetching videos from 'media/videos' folder...");
    const { data, error } = await supabase.storage.from("media").list("videos");

    if (error) {
      console.error("Error fetching videos from media/videos:", error);
      return [];
    }

    console.log("Found videos in 'media/videos' folder:", data?.length || 0);
    return (
      data?.map((file) => ({
        url: supabase.storage.from("media").getPublicUrl(`videos/${file.name}`)
          .data.publicUrl,
        name: file.name,
        type: "video" as const,
      })) ?? []
    );
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export async function listAllBuckets(): Promise<void> {
  try {
    console.log("Listing all available buckets...");
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error listing buckets:", error);
    } else {
      console.log("Available buckets:", data?.map((b) => b.name) || []);

      // Test each bucket for content
      if (data && data.length > 0) {
        for (const bucket of data) {
          console.log(`\nTesting bucket: ${bucket.name}`);

          // List root content
          const { data: rootData, error: rootError } = await supabase.storage
            .from(bucket.name)
            .list();

          if (rootError) {
            console.error(`Error listing root of ${bucket.name}:`, rootError);
          } else {
            console.log(
              `Root content of ${bucket.name}:`,
              rootData?.map((f) => f.name) || []
            );

            // Check for photos and videos folders
            const photosFolder = rootData?.find((f) => f.name === "photos");
            const videosFolder = rootData?.find((f) => f.name === "videos");

            if (photosFolder) {
              const { data: photosData } = await supabase.storage
                .from(bucket.name)
                .list("photos");
              console.log(
                `Photos in ${bucket.name}/photos:`,
                photosData?.length || 0
              );
            }

            if (videosFolder) {
              const { data: videosData } = await supabase.storage
                .from(bucket.name)
                .list("videos");
              console.log(
                `Videos in ${bucket.name}/videos:`,
                videosData?.length || 0
              );
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error listing buckets:", error);
  }
}

// Get media using direct URL construction since API access is restricted
export async function getMediaDirectly(): Promise<MediaItem[]> {
  const baseUrl =
    "https://dryyhhzxqwysfbxaptiy.supabase.co/storage/v1/object/public/media";

  // List of known files - you can expand this list with your actual files
  const knownFiles = [
    { name: "caldoveiro_2.webp", type: "photo" as const },
    { name: "caldoveiro_dark.webm", type: "video" as const },
    { name: "bisabuelos.webp", type: "photo" as const },
    { name: "caldoveiro_1.webp", type: "photo" as const },
    { name: "caldoveiro_3.webp", type: "photo" as const },
    { name: "w-snach.webm", type: "video" as const },
    // Add more files here as needed
  ];

  return knownFiles.map((file) => ({
    url: `${baseUrl}/${file.type}s/${file.name}`,
    name: file.name,
    type: file.type,
  }));
}

// Hardcoded media for testing - replace with your actual files
export function getHardcodedMedia(): MediaItem[] {
  return [
    {
      url: "https://dryyhhzxqwysfbxaptiy.supabase.co/storage/v1/object/public/media/photos/caldoveiro_2.webp",
      name: "caldoveiro_2.webp",
      type: "photo",
    },
    {
      url: "https://dryyhhzxqwysfbxaptiy.supabase.co/storage/v1/object/public/media/videos/caldoveiro_dark.webm",
      name: "caldoveiro_dark.webm",
      type: "video",
    },
  ];
}

export async function getAllMedia(): Promise<MediaItem[]> {
  try {
    console.log("Fetching all media...");

    // First try direct method since API access seems restricted
    console.log("Trying direct URL method...");
    const directMedia = await getMediaDirectly();
    console.log(`Direct method found: ${directMedia.length} items`);

    if (directMedia.length > 0) {
      console.log("Using direct URL method - media found!");
      return directMedia.sort(() => Math.random() - 0.5);
    }

    // Fallback to API method
    console.log("Direct method failed, trying API method...");
    await listAllBuckets();

    const [photos, videos] = await Promise.all([getPhotos(), getVideos()]);

    console.log(`Total photos found: ${photos.length}`);
    console.log(`Total videos found: ${videos.length}`);

    // If no media found, try the old method as fallback
    if (photos.length === 0 && videos.length === 0) {
      console.log("No media found in API method, trying fallback method...");
      const fallbackImages = await getImageUrls();
      console.log(`Fallback images found: ${fallbackImages.length}`);

      if (fallbackImages.length > 0) {
        return fallbackImages.map((url, index) => ({
          url,
          name: `Image ${index + 1}`,
          type: "photo" as const,
        }));
      }

      // Last resort: use hardcoded media for testing
      console.log("Using hardcoded media for testing...");
      return getHardcodedMedia();
    }

    // Combine and shuffle the media items
    const allMedia = [...photos, ...videos];
    console.log(`Total media items: ${allMedia.length}`);

    return allMedia.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching all media:", error);
    // Return hardcoded media as last resort
    console.log("Error occurred, returning hardcoded media...");
    return getHardcodedMedia();
  }
}
