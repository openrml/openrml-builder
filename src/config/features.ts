// src/config/features.ts
/**
 * Feature flags for OpenRML Builder
 * Все фичи опциональны и могут быть отключены через .env
 */

export const FEATURES = {
  /**
   * RML Identity - генерация и валидация идентификаторов ролей
   * Включено по умолчанию, отключается через VITE_DISABLE_RML_IDENTITY=true
   */
  RML_IDENTITY: import.meta.env.VITE_DISABLE_RML_IDENTITY !== 'true',
  
  /**
   * Показывать UI для RML Identity
   * Зависит от RML_IDENTITY
   */
  RML_IDENTITY_UI: import.meta.env.VITE_DISABLE_RML_IDENTITY_UI !== 'true',
  
  /**
   * Автоматическая валидация identity при импорте
   */
  RML_IDENTITY_VALIDATION: import.meta.env.VITE_DISABLE_RML_IDENTITY_VALIDATION !== 'true',
  
  /**
   * Режим разработки - дополнительные логи и инструменты
   */
  DEV_MODE: import.meta.env.DEV
};

// Удалите или закомментируйте этот блок, так как он уже в vite-env.d.ts
// declare global {
//   interface ImportMetaEnv {
//     VITE_DISABLE_RML_IDENTITY?: string;
//     VITE_DISABLE_RML_IDENTITY_UI?: string;
//     VITE_DISABLE_RML_IDENTITY_VALIDATION?: string;
//   }
// }