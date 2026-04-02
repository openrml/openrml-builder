// src/core/export/strategies/claude-strategy.ts

import { BaseExportStrategy } from './base-strategy';
import type { Role } from '../../domain/role/types';
import type { ExportOptions, FormatMetadata, ValidationResult } from '../types';

/**
 * Claude.ai Project Knowledge export strategy
 * Uses markdown format optimized for Claude Projects
 */
export class ClaudeProjectStrategy extends BaseExportStrategy {
  readonly format = 'claude-project' as const;
  readonly fileExtension = 'md';
  readonly mimeType = 'text/markdown';
  
  convert(role: Role, options?: ExportOptions): string {
    const sections: string[] = [];
    
    // Title and description
    sections.push(`# ${role.name}`);
    sections.push('');
    sections.push(`**Description:** ${role.description}`);
    sections.push(`**Main Goal:** ${role.mainGoal}`);
    sections.push('');
    
    // Custom Instructions section
    sections.push('## Custom Instructions');
    sections.push('');
    
    // Personality
    sections.push('### Personality');
    sections.push(`- **Tone:** ${role.tone}`);
    sections.push(`- **Emotional Range:** ${role.emotionalRange}`);
    sections.push(`- **Creativity:** ${role.personality.creativity}/10`);
    sections.push(`- **Formality:** ${role.personality.formality}/10`);
    sections.push(`- **Empathy:** ${role.personality.empathy}/10`);
    sections.push(`- **Assertiveness:** ${role.personality.assertiveness}/10`);
    sections.push(`- **Patience:** ${role.personality.patience}/10`);
    sections.push('');
    
    // Behavior Guidelines
    sections.push('### Behavior Guidelines');
    sections.push('');
    
    if (role.shouldDo.length > 0) {
      sections.push('**Always Do:**');
      role.shouldDo.forEach(item => {
        sections.push(`- ${item}`);
      });
      sections.push('');
    }
    
    if (role.shouldNotDo.length > 0) {
      sections.push('**Never Do:**');
      role.shouldNotDo.forEach(item => {
        sections.push(`- ${item}`);
      });
      sections.push('');
    }
    
    // Expertise Areas
    if (role.expertiseAreas && role.expertiseAreas.length > 0) {
      sections.push('## Expertise Areas');
      sections.push('');
      
      role.expertiseAreas.forEach((area: string | { title: string; description?: string; tools?: string[]; methods?: string[] }) => {
        // Handle both string array and object array formats
        if (typeof area === 'string') {
          sections.push(`### ${area}`);
          sections.push('');
        } else if (area.title) {
          sections.push(`### ${area.title}`);
          sections.push(area.description || '');
          sections.push('');
          
          if (area.tools && area.tools.length > 0) {
            sections.push('**Tools:**');
            area.tools.forEach((tool: string) => {
              sections.push(`- ${tool}`);
            });
            sections.push('');
          }
          
          if (area.methods && area.methods.length > 0) {
            sections.push('**Methods:**');
            area.methods.forEach((method: string) => {
              sections.push(`- ${method}`);
            });
            sections.push('');
          }
        }
      });
    }
    
    // Workflow Sessions
    if (role.sessions.length > 0) {
      sections.push('## Workflow Sessions');
      sections.push('');
      
      role.sessions.forEach((session, idx) => {
        sections.push(`### Session ${idx + 1}: ${session.title}`);
        
        if (session.estimatedDuration) {
          sections.push(`*Duration: ~${session.estimatedDuration} minutes*`);
          sections.push('');
        }
        
        sections.push('**Tasks:**');
        session.tasks.forEach(task => {
          sections.push(`- ${task}`);
        });
        sections.push('');
        
        if (session.outcomes && session.outcomes.length > 0) {
          sections.push('**Expected Outcomes:**');
          session.outcomes.forEach(outcome => {
            sections.push(`- ${outcome}`);
          });
          sections.push('');
        }
      });
    }
    
    // Memory Context
    sections.push('## Memory Context');
    sections.push('');
    sections.push(`**Hot Memory (Current Context):** ${role.hotMemory}`);
    sections.push(`**Warm Memory (Recent History):** ${role.warmMemory}`);
    sections.push(`**Cold Memory (Long-term Patterns):** ${role.coldMemory}`);
    sections.push('');
    
    // Ethical Boundaries
    if (role.ethicalRules && role.ethicalRules.length > 0) {
      sections.push('## Ethical Boundaries');
      sections.push('');
      
      const stopRules = role.ethicalRules.filter(r => r.action === 'stop');
      const warnRules = role.ethicalRules.filter(r => r.action === 'warn');
      
      if (stopRules.length > 0) {
        sections.push('**Critical Boundaries (Never):**');
        stopRules.forEach(rule => {
          sections.push(`- ${rule.rule}`);
        });
        sections.push('');
      }
      
      if (warnRules.length > 0) {
        sections.push('**Advisory Guidelines (Caution):**');
        warnRules.forEach(rule => {
          sections.push(`- ${rule.rule}`);
        });
        sections.push('');
      }
    }
    
    // Greeting
    sections.push('## Initial Greeting');
    sections.push('');
    sections.push(role.greeting);
    sections.push('');
    
    // Footer
    if (!options?.minimalMode) {
      sections.push('---');
      sections.push('*Created with OpenRML Builder (rolesai.life)*');
    }
    
    return sections.join('\n');
  }
  
  validate(role: Role): ValidationResult {
    const result = super.validate(role);
    
    // Estimate size
    const content = this.convert(role);
    const sizeKB = new Blob([content]).size / 1024;
    
    if (sizeKB > 100) {
      result.warnings = result.warnings || [];
      result.warnings.push(`Content size is ${sizeKB.toFixed(1)}KB - Claude Projects have 100KB limit`);
    }
    
    return result;
  }
  
  getMetadata(): FormatMetadata {
    return {
      name: 'Claude Project',
      description: 'Markdown format for Claude.ai Project Knowledge',
      platform: 'Claude.ai',
      limitations: [
        'Maximum 100KB project knowledge',
        'No executable code in project files',
        'Structured sessions flattened to workflow',
      ],
      documentationUrl: 'https://support.anthropic.com/en/articles/9517075',
    };
  }
}
