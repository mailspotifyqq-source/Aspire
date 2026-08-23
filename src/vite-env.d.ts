/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAIL_WORKER_URL?: string;
  readonly VITE_OTHER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
