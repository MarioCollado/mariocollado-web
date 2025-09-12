import { supabase } from "./supabase";

export interface MediaItem {
  tipo: string;
  ruta: string;
  descripcion: string;
}

export interface MediaRow {
  path: string;
  tipo: string;
  descripcion: string;
  orden: number;
  created_at: string;
  published: boolean;
}

/**
 * Obtiene los elementos de media publicados ordenados
 */
export async function getPublishedMedia(): Promise<MediaRow[]> {
  const { data, error } = await supabase
    .from("media_items")
    .select("path, tipo, descripcion, orden, created_at, published")
    .eq("published", true)
    .order("orden", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching media items:", error);
    return [];
  }

  return data || [];
}

/**
 * Genera URLs firmadas o públicas para los elementos de media
 */
export async function generateMediaUrls(
  mediaRows: MediaRow[]
): Promise<MediaItem[]> {
  const signedUrls = await Promise.all(
    mediaRows.map(async (row) => {
      try {
        const { data, error } = await supabase.storage
          .from("media")
          .createSignedUrl(row.path, 60 * 60); // 1 hora

        const ruta = error
          ? supabase.storage.from("media").getPublicUrl(row.path).data.publicUrl
          : data!.signedUrl;

        return {
          tipo: row.tipo,
          ruta,
          descripcion: row.descripcion ?? row.path,
        };
      } catch {
        return {
          tipo: row.tipo,
          ruta: supabase.storage.from("media").getPublicUrl(row.path).data
            .publicUrl,
          descripcion: row.descripcion ?? row.path,
        };
      }
    })
  );

  return signedUrls;
}

/**
 * Función principal para obtener el contenido de la galería
 */
export async function getGalleryContent(): Promise<MediaItem[]> {
  const mediaRows = await getPublishedMedia();
  return generateMediaUrls(mediaRows);
}
