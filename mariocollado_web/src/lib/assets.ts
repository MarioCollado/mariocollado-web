import { supabase } from "./supabase";

export interface SectionAsset {
  asset_key: string;
  path: string;
  section: string;
  alt_text: string;
}

export interface CardData {
  id: string;
  title: string;
  image: string;
  rowSpan: number;
  colStart?: number;
  rowStart?: number;
}

/**
 * Obtiene los assets de UI para las secciones principales
 */
export async function getSectionAssets(): Promise<SectionAsset[]> {
  const { data, error } = await supabase
    .from("ui_assets")
    .select("asset_key, path, section, alt_text")
    .eq("asset_type", "background")
    .in("section", ["music", "film", "tech", "contact"])
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching section assets:", error);
    return [];
  }

  return data || [];
}

/**
 * Genera URL de Supabase para un path dado
 */
function getSupabaseUrl(path: string): string {
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

/**
 * Mapea los assets de la BD al formato de cards para el componente Home
 */
export function mapAssetsToCards(assets: SectionAsset[]): CardData[] {
  const sectionConfig = [
    { id: "music", title: "MUSIC", rowSpan: 6 },
    { id: "film", title: "VISUALS", rowSpan: 6 },
    { id: "tech", title: "TECH", rowSpan: 6 },
    { id: "contact", title: "CONTACT", rowSpan: 4, colStart: 4, rowStart: 3 },
  ];

  const fallbackPaths = {
    music: "sections/music.jpg",
    film: "sections/film.jpg",
    tech: "sections/tech.jpg",
    contact: "sections/mail.jpg",
  };

  return sectionConfig.map((config) => {
    const asset = assets.find((a) => a.section === config.id);
    const imagePath =
      asset?.path || fallbackPaths[config.id as keyof typeof fallbackPaths];
    return {
      ...config,
      image: getSupabaseUrl(imagePath),
    };
  });
}

/**
 * Función principal para obtener las cards del home
 */
export async function getHomeCards(): Promise<CardData[]> {
  const assets = await getSectionAssets();
  return mapAssetsToCards(assets);
}
