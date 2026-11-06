// Tarjetas de la Home. image: null hasta disponer de material propio.
export interface HomeCard {
  id: string;
  title: string;
  image: string | null;
  rowSpan: number;
  colStart?: number;
  rowStart?: number;
}

export const homeCards: HomeCard[] = [
  { id: "music", title: "MUSIC", image: null, rowSpan: 6 },
  { id: "film", title: "VISUALS", image: null, rowSpan: 6 },
  { id: "tech", title: "TECH", image: null, rowSpan: 6 },
  { id: "contact", title: "CONTACT", image: null, rowSpan: 6, colStart: 4, rowStart: 2 },
];
