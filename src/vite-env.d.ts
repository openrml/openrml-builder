/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISABLE_RML_IDENTITY?: string;
  readonly VITE_DISABLE_RML_IDENTITY_UI?: string;
  readonly VITE_DISABLE_RML_IDENTITY_VALIDATION?: string;
  readonly DEV?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}