// src/core/export/strategies/gpt-strategy.ts

import { BaseExportStrategy } from './base-strategy';
import type { Role } from '../../domain/role/types';
import type { ExportOptions, FormatMetadata, ValidationResult } from '../types';

/**
 * ChatGPT Custom Instructions export strategy
 * Optimized for OpenAI's GPT Builder format
 */
export class GPTExportStrategy extends BaseExportStrategy {
  readonly format = 'gpt' as const;
  readonly fileExtension = 'txt';
  readonly mimeType = 'text/plain';
  
  convert(role: Role, options?: ExportOptions): string {
    const sections: string[] = [];
    
    // Header - simple and conversational
    sections.push(`You are ${role.name}.`);
    sections.push('');
    
    // Core identity
    sections.push(`DESCRIPTION: ${role.description}`);
    sections.push(`MAIN GOAL: ${role.mainGoal}`);
    sections.push('');
    
    // Personality traits
    sections.push('PERSONALITY:');
    sections.push(`- Creativity: ${role.personality.creativity}/10`);
    sections.push(`- Formality: ${role.personality.formality}/10`);
    sections.push(`- Empathy: ${role.personality.empathy}/10`);
    sections.push(`- Assertiveness: ${role.personality.assertiveness}/10`);
    sections.push(`- Patience: ${role.personality.patience}/10`);
    sections.push('');
    
    sections.push(`Communication Tone: ${role.tone}`);
    sections.push(`Emotional Range: ${role.emotionalRange}`);
    sections.push('');
    
    // Behavior guidelines
    if (role.shouldDo.length > 0) {
      sections.push('ALWAYS DO:');
      role.shouldDo.forEach(item => {
        sections.push(`- ${item}`);
      });
      sections.push('');
    }
    
    if (role.shouldNotDo.length > 0) {
      sections.push('NEVER DO:');
      role.shouldNotDo.forEach(item => {
        sections.push(`- ${item}`);
      });
      sections.push('');
    }
    
    // Expertise areas
    if (role.expertiseAreas && role.expertiseAreas.length > 0) {
      sections.push('EXPERTISE:');
      role.expertiseAreas.forEach((area: string | { title: string; description?: string }) => {
        // Handle both string array and object array formats
        if (typeof area === 'string') {
          sections.push(`• ${area}`);
        } else if (area.title) {
          sections.push(`• ${area.title}: ${area.description || ''}`);
        }
      });
      sections.push('');
    }
    
    // Journey - flattened for GPT
    if (role.sessions.length > 0) {
      sections.push('INTERACTION FLOW:');
      const flattenedSessions = this.flattenJourney(role.sessions);
      sections.push(...flattenedSessions);
      sections.push('');
    }
    
    // Ethical boundaries
    if (role.ethicalRules && role.ethicalRules.length > 0) {
      sections.push('ETHICAL BOUNDARIES:');
      
      const stopRules = role.ethicalRules.filter(r => r.action === 'stop');
      const warnRules = role.ethicalRules.filter(r => r.action === 'warn');
      
      if (stopRules.length > 0) {
        sections.push('🛑 NEVER:');
        stopRules.forEach(rule => {
          sections.push(`- ${rule.rule}`);
        });
      }
      
      if (warnRules.length > 0) {
        sections.push('⚠️ CAUTION:');
        warnRules.forEach(rule => {
          sections.push(`- ${rule.rule}`);
        });
      }
      sections.push('');
    }
    
    // Greeting
    sections.push('INITIAL GREETING:');
    sections.push(role.greeting);
    sections.push('');
    
    // Note about limitations
    if (!options?.minimalMode) {
      sections.push('---');
      sections.push('Note: This role was created with OpenRML Builder (rolesai.life)');
    }
    
    return sections.join('\n');
  }
  
  validate(role: Role): ValidationResult {
    const result = super.validate(role);
    
    // GPT-specific warnings
    if (role.teamEnabled) {
      result.warnings = result.warnings || [];
      result.warnings.push('Team collaboration is not supported in GPT format - team references will be omitted');
    }
    
    if (role.sessions.length > 10) {
      result.warnings = result.warnings || [];
      result.warnings.push('GPT may not handle >10 sessions effectively - consider simplifying');
    }
    
    // Estimate token count
    const estimatedTokens = this.estimateTokens(this.convert(role));
    if (estimatedTokens > 8000) {
      result.warnings = result.warnings || [];
      result.warnings.push(`Estimated ${estimatedTokens} tokens - GPT custom instructions have ~8000 token limit`);
    }
    
    return result;
  }
  
  getMetadata(): FormatMetadata {
    return {
      name: 'ChatGPT Custom Instructions',
      description: 'Optimized format for OpenAI ChatGPT Custom GPTs',
      platform: 'ChatGPT',
      limitations: [
        'No team collaboration support',
        'Limited to ~8000 characters in custom instructions',
        'No visual portrait metadata',
        'Structured sessions are flattened',
      ],
      documentationUrl: 'https://platform.openai.com/docs/guides/gpts',
    };
  }
}
