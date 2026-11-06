// Fotografías de la sección VISUALS.
// Origen de los archivos: D:\MARIOCOLLADO-WEB\WEB_ASSETS\photos
// Copiar a: public/images/photography/
export interface Photo {
  src: string;
  alt: string;
}

const base = "/images/photography";

export const photos: Photo[] = [
  { src: `${base}/bisabuelos.webp`, alt: "Bisabuelos" },
  { src: `${base}/burgos.jpg`, alt: "Burgos" },
  { src: `${base}/caldoveiro_1.webp`, alt: "Caldoveiro 1" },
  { src: `${base}/caldoveiro_2.webp`, alt: "Caldoveiro 2" },
  { src: `${base}/caldoveiro_3.webp`, alt: "Caldoveiro 3" },
  { src: `${base}/caldoveiro_4.webp`, alt: "Caldoveiro 4" },
  { src: `${base}/dedal.webp`, alt: "Dedal" },
  { src: `${base}/flor-y.webp`, alt: "Flor y" },
  { src: `${base}/nalon.webp`, alt: "Nalón" },
];
