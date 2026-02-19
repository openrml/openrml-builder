// src/application/use-cases/export-rml.use-case.ts
import { Role } from '../../core/domain/role/types';
import { exportRoleToText, downloadRole } from '../../core/rml/exporter';

export interface ExportRMLInput {
  role: Role;
  download?: boolean;
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
    
    const content = exportRoleToText(roleToExport);
    const fileName = `${roleToExport.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_role.rml.txt`;
    
    if (input.download) {
      downloadRole(roleToExport);
    }
    
    return { 
      content, 
      fileName
    };
  }
}