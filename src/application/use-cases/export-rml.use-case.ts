// src/application/use-cases/export-rml.use-case.ts
import { Role } from '../../core/domain/role/types';
import { exportRoleToText, downloadRole, sanitizeFilename } from '../../core/rml/exporter';
import type { Language } from '../../core/domain/role/enum-display-names';

export interface ExportRMLInput {
  role: Role;
  download?: boolean;
  language?: Language;  // Optional language override
}

export interface ExportRMLOutput {
  content: string;
  fileName: string;
}

export class ExportRMLUseCase {
  constructor() {}

  execute(input: ExportRMLInput): ExportRMLOutput {
    // P0: Убедимся, что новые поля присутствуют в роли для экспорта
    const roleToExport = {
      ...input.role,
      // Гарантируем наличие новых P0 полей
      status: input.role.status || 'draft',
      version: input.role.version || '0.9.0',
      category: input.role.category || 'productivity',
      tags: input.role.tags || [],
      ethicalRules: input.role.ethicalRules || [],
      sessions: input.role.sessions?.map(session => ({
        ...session,
        outcomes: session.outcomes || []
      })) || []
    };
    
    const content = exportRoleToText(roleToExport, input.language);
    const fileName = `${sanitizeFilename(roleToExport.name || 'role')}_role.orml.txt`;
    
    if (input.download) {
      downloadRole(roleToExport, input.language);
    }
    
    return { 
      content, 
      fileName
    };
  }
}