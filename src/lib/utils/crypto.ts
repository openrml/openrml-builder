// src/lib/utils/crypto.ts
//
// Детерминированный хеш для RML Identity.
// Используем djb2 — синхронный, без зависимостей, работает в любом окружении.
// Достаточно для fingerprint-идентификации: не криптографический, но предсказуемый.
//
// Если в будущем потребуется криптографическая стойкость — заменить на
// SubtleCrypto.digest('SHA-256', ...) с переводом всего сервиса в async.

/**
 * Детерминированный djb2-хеш строки.
 * Возвращает 8-символьную hex-строку без знака.
 */
export function djb2Hash(content: string): string {
  let hash = 5381;
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) + hash) ^ content.charCodeAt(i);
    hash |= 0; // приводим к 32-bit int
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Псевдоним для совместимости с именем импорта в identity.service.ts.
 * Не является SHA-256 — использует djb2.
 */
export const sha256 = djb2Hash;