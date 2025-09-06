/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // pode adicionar mais variáveis aqui
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
