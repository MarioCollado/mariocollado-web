export type SupportedLanguage = "es" | "en" | "fr" | "de";

export interface TranslationFunction {
  (key: string, params?: Record<string, string>): string;
}
