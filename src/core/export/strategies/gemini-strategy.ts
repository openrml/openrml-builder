// src/core/export/strategies/gemini-strategy.ts

import { BaseExportStrategy } from './base-strategy';
import type { Role } from '../../domain/role/types';
import type { FormatMetadata, ValidationResult } from '../types';

/**
 * Google Gemini Gem export strategy
 * Optimized for Gemini's system instructions format
 */
export class GeminiExportStrategy extends BaseExportStrategy {
  readonly format = 'gemini' as const;
  readonly fileExtension = 'txt';
  readonly mimeType = 'text/plain';
  
  convert(role: Role): string {
    const sections: string[] = [];
    
    // Header
    sections.push('SYSTEM INSTRUCTIONS');
    sections.push('='.repeat(50));
    sections.push('');
    
    sections.push(`Role: ${role.name}`);
    sections.push(`Purpose: ${role.mainGoal}`);
    sections.push('');
    
    // Core behavior
    sections.push('CORE BEHAVIOR:');
    sections.push(`Tone: ${role.tone}`);
    sections.push(`Formality: ${role.personality.formality}/10`);
    sections.push(`Creativity: ${role.personality.creativity}/10`);
    sections.push('');
    
    // Capabilities
    if (role.expertiseAreas && role.expertiseAreas.length > 0) {
      sections.push('CAPABILITIES:');
      role.expertiseAreas.forEach((area: string | { title: string; description?: string }) => {
        // Handle both string array and object array formats
        if (typeof area === 'string') {
          sections.push(`• ${area}`);
        } else if (area.title) {
          const desc = area.description ? this.truncateText(area.description, 200) : '';
          sections.push(`• ${area.title}${desc ? ': ' + desc : ''}`);
        }
      });
      sections.push('');
    }
    
    // Interaction rules
    sections.push('INTERACTION RULES:');
    sections.push('');
    
    if (role.shouldDo.length > 0) {
      sections.push('Do:');
      role.shouldDo.forEach(item => {
        sections.push(`✓ ${item}`);
      });
      sections.push('');
    }
    
    if (role.shouldNotDo.length > 0) {
      sections.push('Do Not:');
      role.shouldNotDo.forEach(item => {
        sections.push(`✗ ${item}`);
      });
      sections.push('');
    }
    
    // Conversation structure
    if (role.sessions.length > 0) {
      sections.push('CONVERSATION STRUCTURE:');
      const flattened = this.flattenJourney(role.sessions);
      sections.push(...flattened);
      sections.push('');
    }
    
    // Ethical boundaries
    if (role.ethicalRules && role.ethicalRules.length > 0) {
      sections.push('ETHICAL BOUNDARIES:');
      role.ethicalRules.forEach(rule => {
        const prefix = rule.action === 'stop' ? '🛑' : '⚠️';
        sections.push(`${prefix} ${rule.rule}`);
      });
      sections.push('');
    }
    
    // Greeting template
    sections.push('GREETING:');
    sections.push(role.greeting);
    
    return sections.join('\n');
  }
  
  validate(role: Role): ValidationResult {
    const result = super.validate(role);
    
    // Estimate word count (Gemini has ~4000 word limit)
    const content = this.convert(role);
    const wordCount = content.split(/\s+/).length;
    
    if (wordCount > 4000) {
      result.warnings = result.warnings || [];
      result.warnings.push(`Content is ${wordCount} words - Gemini system instructions have ~4000 word limit`);
    }
    
    return result;
  }
  
  getMetadata(): FormatMetadata {
    return {
      name: 'Google Gemini Gem',
      description: 'System instructions for Gemini Custom Gems',
      platform: 'Google Gemini',
      limitations: [
        'Maximum ~4000 words in system instructions',
        'No file attachments support',
        'Limited structured data support',
      ],
      documentationUrl: 'https://support.google.com/gemini/answer/14284826',
    };
  }
}
