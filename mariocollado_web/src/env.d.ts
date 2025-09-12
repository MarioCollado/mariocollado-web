/// <reference types="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN?: string;
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;
  readonly SUPABASE_SERVICE_ROLE?: string;
  readonly RESEND_API_KEY?: string;
  readonly YOUR_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
