import type { SupportedLanguage } from "./types";

// Importar todas las traducciones
import es from "./translations/es.json";
import en from "./translations/en.json";
import fr from "./translations/fr.json";
import de from "./translations/de.json";

export const languages = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
} as const;

export const defaultLang: SupportedLanguage = "es";

const translations = {
  es,
  en,
  fr,
  de,
};

export function getLangFromUrl(url: URL): SupportedLanguage {
  const pathname = url.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // Buscar el idioma en la URL: /en/, /fr/, /de/
  if (segments.length > 0) {
    const potentialLang = segments[0];
    if (potentialLang in translations) {
      return potentialLang as SupportedLanguage;
    }
  }
  return defaultLang;
}

export function useTranslations(lang: SupportedLanguage = defaultLang) {
  return function t(key: string, params?: Record<string, string>): string {
    const keys = key.split(".");
    let value: any = translations[lang];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback al idioma por defecto
        value = translations[defaultLang];
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(
              `Translation key "${key}" not found for language "${lang}"`
            );
            return key;
          }
        }
        break;
      }
    }

    if (typeof value !== "string") {
      console.warn(
        `Translation key "${key}" is not a string for language "${lang}"`
      );
      return key;
    }

    // Reemplazar parámetros si los hay
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return value;
  };
}

export function getRouteFromUrl(url: URL): string {
  const pathname = url.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // Si el primer segmento es un idioma, lo eliminamos para obtener la ruta base
  if (segments.length > 0 && segments[0] in translations) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname;
}

export function translatePath(path: string, lang: SupportedLanguage): string {
  // Limpiar la ruta de cualquier idioma existente
  const cleanPath =
    path.startsWith("/en/") ||
    path.startsWith("/fr/") ||
    path.startsWith("/de/")
      ? "/" + path.split("/").slice(2).join("/")
      : path;

  if (lang === defaultLang) {
    return cleanPath;
  }
  return `/${lang}${cleanPath}`;
}
