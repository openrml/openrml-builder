// src/core/export/strategies/base-strategy.ts

import type { Role, Session } from '../../domain/role/types';
import type { 
  ExportStrategy, 
  ExportFormat, 
  ExportOptions, 
  ValidationResult, 
  FormatMetadata 
} from '../types';

/**
 * Base class for all export strategies
 * Provides common functionality and utilities
 */
export abstract class BaseExportStrategy implements ExportStrategy {
  abstract readonly format: ExportFormat;
  abstract readonly fileExtension: string;
  abstract readonly mimeType: string;
  
  abstract convert(role: Role, options?: ExportOptions): string;
  abstract getMetadata(): FormatMetadata;
  
  /**
   * Default validation - can be overridden
   */
  validate(role: Role): ValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Basic validation
    if (!role.name) {
      errors.push('Role name is required');
    }
    
    if (!role.description) {
      warnings.push('Role description is recommended for better context');
    }
    
    if (!role.mainGoal) {
      warnings.push('Main goal helps clarify the role\'s purpose');
    }
    
    if (role.shouldDo.length === 0) {
      warnings.push('Consider adding "always do" guidelines');
    }
    
    if (role.shouldNotDo.length === 0) {
      warnings.push('Consider adding "never do" boundaries');
    }
    
    return {
      valid: errors.length === 0,
      warnings: warnings.length > 0 ? warnings : undefined,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
  
  /**
   * Flatten journey sessions into simple list
   * Useful for platforms that don't support structured sessions
   */
  protected flattenJourney(sessions: Session[]): string[] {
    return sessions.flatMap((session, idx) => {
      const lines: string[] = [];
      
      lines.push(`Session ${idx + 1}: ${session.title}`);
      
      if (session.estimatedDuration) {
        lines.push(`  Duration: ~${session.estimatedDuration} min`);
      }
      
      session.tasks.forEach(task => {
        lines.push(`  - ${task}`);
      });
      
      if (session.outcomes && session.outcomes.length > 0) {
        lines.push('  Expected outcomes:');
        session.outcomes.forEach(outcome => {
          lines.push(`    • ${outcome}`);
        });
      }
      
      return lines;
    });
  }
  
  /**
   * Remove ORML-specific metadata for cleaner output
   */
  protected stripORMLMetadata(role: Role): Partial<Role> {
    const { rmlIdentity, ...rest } = role;
    return rest;
  }
  
  /**
   * Truncate text to specified length
   */
  protected truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
  
  /**
   * Estimate token count (rough approximation)
   */
  protected estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
