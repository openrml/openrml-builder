// src/core/export/strategies/orml-strategy.ts

import { BaseExportStrategy } from './base-strategy';
import { exportRoleToText } from '../../rml/exporter';
import type { Role } from '../../domain/role/types';
import type { ExportOptions, FormatMetadata } from '../types';

/**
 * Native OpenRML export strategy
 * Wraps existing exporter logic
 */
export class ORMLExportStrategy extends BaseExportStrategy {
  readonly format = 'orml' as const;
  readonly fileExtension = 'orml.txt';
  readonly mimeType = 'text/plain';
  
  convert(role: Role, options?: ExportOptions): string {
    // Use existing ORML exporter
    return exportRoleToText(role, options?.language);
  }
  
  getMetadata(): FormatMetadata {
    return {
      name: 'OpenRML',
      description: 'Native OpenRML format with full metadata and structure',
      platform: 'Universal',
      limitations: [],
      documentationUrl: 'https://openrml.org/docs',
    };
  }
}
