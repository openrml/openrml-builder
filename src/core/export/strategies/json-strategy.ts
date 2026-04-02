// src/core/export/strategies/json-strategy.ts

import { BaseExportStrategy } from './base-strategy';
import type { Role } from '../../domain/role/types';
import type { ExportOptions, FormatMetadata } from '../types';

/**
 * JSON export strategy
 * Machine-readable format for API integrations
 */
export class JSONExportStrategy extends BaseExportStrategy {
  readonly format = 'json' as const;
  readonly fileExtension = 'json';
  readonly mimeType = 'application/json';
  
  convert(role: Role, options?: ExportOptions): string {
    // Clean export without internal metadata
    const exportData = {
      meta: {
        version: role.version || '1.0.0',
        format: 'openrml-json-v1',
        exportedAt: new Date().toISOString(),
        language: role.roleLang || 'en',
      },
      role: {
        // Core identity
        name: role.name,
        description: role.description,
        mainGoal: role.mainGoal,
        archetype: role.archetype,
        category: role.category,
        roleType: role.roleType,
        
        // Language settings
        language: {
          primary: role.roleLang || 'en',
          supported: role.supportedLanguages || ['en', 'ua'],
          responseBehavior: role.responseBehavior || 'auto',
          allowSwitch: role.allowLanguageSwitch !== false,
        },
        
        // Personality
        personality: role.personality,
        tone: role.tone,
        emotionalRange: role.emotionalRange,
        
        // Behavior
        behavior: {
          shouldDo: role.shouldDo,
          shouldNotDo: role.shouldNotDo,
          greeting: role.greeting,
        },
        
        // Expertise
        expertise: role.expertiseAreas,
        
        // Journey
        journey: {
          sessions: role.sessions,
          pacing: role.journeyPacing,
        },
        
        // Memory
        memory: {
          hot: role.hotMemory,
          warm: role.warmMemory,
          cold: role.coldMemory,
          strategy: role.memoryStrategy,
          emotionalStates: role.emotionalStates,
        },
        
        // Ethics
        ethics: {
          rules: role.ethicalRules,
          referral: role.referralProtocol,
          disclaimer: role.disclaimer,
        },
        
        // Team (if enabled)
        team: role.teamEnabled ? {
          enabled: true,
          orchestrator: role.orchestrator,
          subRoles: role.subRoles,
          taskProtocol: role.taskProtocol,
          memoryTransfer: role.memoryTransfer,
        } : {
          enabled: false,
        },
        
        // Visual portrait (optional metadata)
        portrait: options?.includeMetadata ? {
          age: role.age,
          visualStyle: role.visualStyle,
          visualDetails: role.visualDetails,
          visualAccent: role.visualAccent,
          environment: role.environment,
          atmosphere: role.atmosphere,
          imageStyle: role.imageStyle,
          lighting: role.lighting,
        } : undefined,
        
        // License
        license: role.license,
        
        // Metadata
        author: role.author,
        contacts: role.contacts,
        tags: role.tags,
        changelog: role.changelog,
      },
    };
    
    return JSON.stringify(exportData, null, 2);
  }
  
  getMetadata(): FormatMetadata {
    return {
      name: 'JSON Export',
      description: 'Machine-readable JSON format for API integrations',
      platform: 'Universal',
      limitations: [],
      documentationUrl: 'https://openrml.org/docs/json-format',
    };
  }
}
