// Fotografías de la sección VISUALS.
// Origen de los archivos: D:\MARIOCOLLADO-WEB\WEB_ASSETS\photos
// Copiar a: public/images/photography/
export interface Photo {
  type: "photo";
  src: string;
  alt: string;
}

const base = "/images/photography";

export const photos: Photo[] = [
  { type: "photo", src: `${base}/bisabuelos.webp`, alt: "Bisabuelos" },
  { type: "photo", src: `${base}/burgos.webp`, alt: "Burgos" },
  { type: "photo", src: `${base}/caldoveiro_1.webp`, alt: "Caldoveiro 1" },
  { type: "photo", src: `${base}/caldoveiro_2.webp`, alt: "Caldoveiro 2" },
  { type: "photo", src: `${base}/caldoveiro_3.webp`, alt: "Caldoveiro 3" },
  { type: "photo", src: `${base}/caldoveiro_4.webp`, alt: "Caldoveiro 4" },
  { type: "photo", src: `${base}/dedal.webp`, alt: "Dedal" },
  { type: "photo", src: `${base}/flor-y.webp`, alt: "Flor y" },
  { type: "photo", src: `${base}/nalon.webp`, alt: "Nalón" },
];
