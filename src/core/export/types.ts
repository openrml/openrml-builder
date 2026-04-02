// src/core/export/types.ts

import type { Role } from '../domain/role/types';
import type { Language } from '../domain/role/enum-display-names';

/**
 * Supported export formats
 */
export type ExportFormat = 
  | 'orml'           // Native OpenRML format
  | 'gpt'            // ChatGPT Custom Instructions
  | 'claude-project' // Claude.ai Project Knowledge
  | 'gemini'         // Google Gemini Gem
  | 'json';          // Raw JSON export

/**
 * Export options
 */
export interface ExportOptions {
  language?: Language;
  includeMetadata?: boolean;
  minimalMode?: boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  warnings?: string[];
  errors?: string[];
  suggestions?: string[];
}

/**
 * Format metadata
 */
export interface FormatMetadata {
  name: string;
  description: string;
  platform: string;
  limitations: string[];
  documentationUrl?: string;
}

/**
 * Export strategy interface
 */
export interface ExportStrategy {
  readonly format: ExportFormat;
  readonly fileExtension: string;
  readonly mimeType: string;
  
  /**
   * Convert role to target format
   */
  convert(role: Role, options?: ExportOptions): string;
  
  /**
   * Validate if role can be exported to this format
   */
  validate(role: Role): ValidationResult;
  
  /**
   * Get format metadata
   */
  getMetadata(): FormatMetadata;
}
