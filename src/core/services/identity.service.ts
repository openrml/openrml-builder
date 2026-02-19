// src/core/services/identity.service.ts
import { Role } from '../domain/role/types';
import { djb2Hash } from '../../lib/utils/crypto';
import { FEATURES } from '../../config/features';

export class RMLIdentityService {

  /**
   * Генерирует RML Identity для роли.
   * Опционально: не выбрасывает ошибки, тихо возвращает null при сбое.
   * Управляется флагом FEATURES.RML_IDENTITY.
   */
  generateIdentity(role: Role): { rmlIdentity: Role['rmlIdentity'], metadata: Role['identityMetadata'] } | null {
    if (!FEATURES.RML_IDENTITY) return null;

    try {
      const baseHash     = this.hashStep1(role);
      const visualHash   = this.hashStep2(role);
      const toneHash     = this.hashStep3(role);
      const expertiseHash = this.hashStep4(role);
      const journeyHash  = this.hashStep5(role);
      const teamHash     = this.hashStep6(role);
      const memoryHash   = this.hashStep7(role);
      const ethicsHash   = this.hashStep8(role);

      const rmlIdentity = {
        baseHash,
        visualHash,
        toneHash,
        expertiseHash,
        journeyHash,
        teamHash,
        memoryHash,
        ethicsHash,
        fullId: this.generateFullId(role, {
          baseHash, visualHash, toneHash, expertiseHash,
          journeyHash, teamHash, memoryHash, ethicsHash,
        }),
        reference: this.generateReference(role),
      };

      const metadata = {
        generatedAt: new Date().toISOString(),
        schemaVersion: '1.0' as const,
        canonical: true,
      };

      return { rmlIdentity, metadata };
    } catch (error) {
      // Тихое падение — не ломаем сохранение роли
      console.warn('[RMLIdentity] Failed to generate identity:', error);
      return null;
    }
  }

  /**
   * Обновляет identity только если роль изменилась.
   * Оптимизация: не генерируем заново, если fullId совпадает.
   */
  updateIdentityIfChanged(oldRole: Role, newRole: Role): Role['rmlIdentity'] | null {
    if (!FEATURES.RML_IDENTITY) return null;

    const oldHash = oldRole.rmlIdentity?.fullId;
    const newIdentity = this.generateIdentity(newRole);

    if (newIdentity && newIdentity.rmlIdentity && newIdentity.rmlIdentity.fullId !== oldHash) {
      return newIdentity.rmlIdentity;
    }

    return oldRole.rmlIdentity ?? null; // Без изменений
  }

  /**
   * Валидирует целостность роли — сравнивает хранимые хеши с пересчитанными.
   * Возвращает результат, не прерывает выполнение.
   * Управляется флагом FEATURES.RML_IDENTITY_VALIDATION.
   */
  validateIdentity(role: Role): { valid: boolean; mismatchedComponents: string[] } {
    if (!FEATURES.RML_IDENTITY_VALIDATION) {
      return { valid: true, mismatchedComponents: [] };
    }

    if (!role.rmlIdentity) {
      return { valid: false, mismatchedComponents: [] };
    }

    const current = this.generateIdentity(role);
    if (!current) {
      return { valid: false, mismatchedComponents: [] };
    }

    if (!current.rmlIdentity) {
      return { valid: false, mismatchedComponents: [] };
    }

    const mismatched: string[] = [];

    if (current.rmlIdentity.baseHash      !== role.rmlIdentity.baseHash)      mismatched.push('base');
    if (current.rmlIdentity.visualHash    !== role.rmlIdentity.visualHash)    mismatched.push('visual');
    if (current.rmlIdentity.toneHash      !== role.rmlIdentity.toneHash)      mismatched.push('tone');
    if (current.rmlIdentity.expertiseHash !== role.rmlIdentity.expertiseHash) mismatched.push('expertise');
    if (current.rmlIdentity.journeyHash   !== role.rmlIdentity.journeyHash)   mismatched.push('journey');
    if (current.rmlIdentity.teamHash      !== role.rmlIdentity.teamHash)      mismatched.push('team');
    if (current.rmlIdentity.memoryHash    !== role.rmlIdentity.memoryHash)    mismatched.push('memory');
    if (current.rmlIdentity.ethicsHash    !== role.rmlIdentity.ethicsHash)    mismatched.push('ethics');

    return {
      valid: mismatched.length === 0,
      mismatchedComponents: mismatched,
    };
  }

  // ─── Приватные методы хеширования ────────────────────────────────────────────

  private hashStep1(role: Role): string {
    const content = [
      role.name      || '',
      role.archetype || '',
      role.category  || '',
      role.mainGoal  || '',
    ].join('|');
    return djb2Hash(content).substring(0, 4);
  }

  private hashStep2(role: Role): string {
    const content = [
      role.age          || '',
      role.visualStyle  || '',
      role.environment  || '',
      role.atmosphere   || '',
    ].join('|');
    return djb2Hash(content).substring(0, 4);
  }

  private hashStep3(role: Role): string {
    const content = [
      role.tone          || '',
      role.emotionalRange || '',
      role.greeting      || '',
      // Personality traits в фиксированном порядке
      String(role.personality?.creativity   ?? 5),
      String(role.personality?.formality    ?? 5),
      String(role.personality?.empathy      ?? 5),
      String(role.personality?.assertiveness ?? 5),
      String(role.personality?.patience     ?? 5),
    ].join('|');
    return djb2Hash(content).substring(0, 4);
  }

  private hashStep4(role: Role): string {
    const content = [
      (role.expertiseAreas || []).slice().sort().join(','),
      (role.tools          || []).slice().sort().join(','),
      (role.outputFormats  || []).slice().sort().join(','),
    ].join('|');
    return djb2Hash(content).substring(0, 4);
  }

  private hashStep5(role: Role): string {
    // Исправлено: правильные имена полей из JourneyPacing
    const content = [
      JSON.stringify(role.sessions || []),
      role.journeyPacing?.recommendedInterval  || '',
      String(role.journeyPacing?.maxSessionsPerWeek ?? ''),
    ].join('|');
    return djb2Hash(content).substring(0, 4);
  }

  private hashStep6(role: Role): string {
    const content = [
      role.teamEnabled ? '1' : '0',
      role.orchestrator || '',
      JSON.stringify(role.subRoles || []),
      role.taskProtocol || '',
    ].join('|');
    return djb2Hash(content).substring(0, 4);
  }

  private hashStep7(role: Role): string {
    const content = [
      role.hotMemory      || '',
      role.warmMemory     || '',
      role.coldMemory     || '',
      role.memoryStrategy || '',
    ].join('|');
    return djb2Hash(content).substring(0, 4);
  }

  private hashStep8(role: Role): string {
    const content = [
      JSON.stringify(role.ethicalRules    || []),
      JSON.stringify(role.referralProtocol || {}),
      role.disclaimer || '',
    ].join('|');
    return djb2Hash(content).substring(0, 4);
  }

  // ─── Генерация ID и ссылки ────────────────────────────────────────────────────

  private generateFullId(role: Role, hashes: Record<string, string>): string {
    const archetypeCode = this.getArchetypeCode(role.archetype);
    const categoryCode  = this.getCategoryCode(role.category);

    return [
      'RML',
      `${archetypeCode}${categoryCode}`,
      role.version || '1.0.0',
      hashes.baseHash,
      hashes.visualHash,
      hashes.toneHash,
      hashes.expertiseHash,
      hashes.journeyHash,
      hashes.teamHash,
      hashes.memoryHash,
      hashes.ethicsHash,
    ].join('/');
  }

  private generateReference(role: Role): string {
    const author  = role.author?.toLowerCase().replace(/\s+/g, '-') || 'anonymous';
    const name    = role.name?.toLowerCase().replace(/\s+/g, '-')   || 'untitled';
    const version = role.version || '1.0.0';
    return `rml://${author}/${name}/${version}`;
  }

  private getArchetypeCode(archetype?: string): string {
    const map: Record<string, string> = {
      mentor:    'M',
      creator:   'C',
      analyst:   'A',
      healer:    'H',
      scientist: 'S',
      leader:    'L',
      explorer:  'E',
      guardian:  'G',
    };
    return map[archetype || ''] || 'X';
  }

  private getCategoryCode(category?: string): string {
    const map: Record<string, string> = {
      health:        'H',
      productivity:  'P',
      daily:         'D',
      finance:       'F',
      relationships: 'R',
      development:   'V',
      technology:    'T',
      entertainment: 'E',
    };
    return map[category || ''] || 'X';
  }
}

// Синглтон для простоты использования
export const rmlIdentityService = new RMLIdentityService();