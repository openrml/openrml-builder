// src/application/use-cases/export-role.use-case.ts

import type { Role } from '../../core/domain/role/types';
import { 
  exportRegistry, 
  type ExportFormat, 
  type ExportOptions,
  type ValidationResult,
  type FormatMetadata,
} from '../../core/export';
import { sanitizeFilename } from '../../core/rml/exporter';

/**
 * Input for export operation
 */
export interface ExportRoleInput {
  role: Role;
  format: ExportFormat;
  options?: ExportOptions;
  download?: boolean;
}

/**
 * Output from export operation
 */
export interface ExportRoleOutput {
  content: string;
  fileName: string;
  validation: ValidationResult;
  metadata: FormatMetadata;
}

/**
 * Unified use case for exporting roles to any format
 * Replaces the old ExportRMLUseCase
 */
export class ExportRoleUseCase {
  constructor(
    private registry = exportRegistry
  ) {}
  
  /**
   * Execute export operation
   */
  execute(input: ExportRoleInput): ExportRoleOutput {
    // Get strategy for target format
    const strategy = this.registry.getStrategy(input.format);
    
    // Validate role for this format
    const validation = strategy.validate(input.role);
    
    if (!validation.valid) {
      throw new Error(
        `Cannot export role to ${input.format}: ${validation.errors?.join(', ')}`
      );
    }
    
    // Prepare role with defaults
    const roleToExport = this.prepareRole(input.role);
    
    // Convert to target format
    const content = strategy.convert(roleToExport, input.options);
    
    // Generate filename
    const fileName = this.generateFileName(roleToExport, strategy);
    
    // Download if requested
    if (input.download) {
      this.downloadFile(content, fileName, strategy.mimeType);
    }
    
    return {
      content,
      fileName,
      validation,
      metadata: strategy.getMetadata(),
    };
  }
  
  /**
   * Get all available export formats with metadata
   */
  getAvailableFormats(): FormatMetadata[] {
    return this.registry.getAvailableStrategies();
  }
  
  /**
   * Prepare role with defaults for export
   */
  private prepareRole(role: Role): Role {
    return {
      ...role,
      // Ensure required fields have defaults
      status: role.status || 'draft',
      version: role.version || '1.0.0',
      category: role.category || 'productivity',
      tags: role.tags || [],
      ethicalRules: role.ethicalRules || [],
      sessions: role.sessions?.map(session => ({
        ...session,
        outcomes: session.outcomes || [],
      })) || [],
    };
  }
  
  /**
   * Generate filename for export
   */
  private generateFileName(role: Role, strategy: { fileExtension: string }): string {
    const safeName = sanitizeFilename(role.name || 'role');
    return `${safeName}.${strategy.fileExtension}`;
  }
  
  /**
   * Download file to user's device
   */
  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
