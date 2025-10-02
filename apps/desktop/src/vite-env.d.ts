/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_ADMIN_PASSWORD: string;
  readonly VITE_DAILY_REQUEST_LIMIT: string;
  readonly VITE_PER_USER_SESSION_LIMIT: string;
  readonly VITE_ADMIN_MODE_ENABLED: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
