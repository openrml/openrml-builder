// src/presentation/components/constructor/ExportMenu.tsx

import { useState } from 'react';
import { Download, Copy, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { ExportRoleUseCase } from '../../../application/use-cases/export-role.use-case';
import type { Role } from '../../../core/domain/role/types';
import type { ExportFormat } from '../../../core/export';

interface ExportMenuProps {
  role: Role;
  disabled?: boolean;
}

/**
 * Export menu component with multi-format support
 * Provides dropdown for selecting export format
 */
export function ExportMenu({ role, disabled = false }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const exportUseCase = new ExportRoleUseCase();
  
  // Get all available formats
  const formats = exportUseCase.getAvailableFormats();
  
  /**
   * Handle export with download
   */
  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    
    try {
      const result = exportUseCase.execute({
        role,
        format,
        download: true,
      });
      
      // Show warnings if any
      if (result.validation.warnings && result.validation.warnings.length > 0) {
        toast.warning('Exported with warnings', {
          description: result.validation.warnings[0],
          duration: 5000,
        });
      } else {
        toast.success(`Exported as ${result.metadata.name}`);
      }
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  /**
   * Handle copy to clipboard
   */
  const handleCopyToClipboard = async (format: ExportFormat) => {
    try {
      const result = exportUseCase.execute({
        role,
        format,
        download: false,
      });
      
      await navigator.clipboard.writeText(result.content);
      
      toast.success(`Copied ${result.metadata.name} to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  /**
   * Map format metadata name to ExportFormat enum
   */
  const getFormatEnum = (formatName: string): ExportFormat => {
    const mapping: Record<string, ExportFormat> = {
      'OpenRML': 'orml',
      'ChatGPT Custom Instructions': 'gpt',
      'Claude Project': 'claude-project',
      'Google Gemini Gem': 'gemini',
      'JSON Export': 'json',
    };
    
    return mapping[formatName] || 'orml';
  };
  
  /**
   * Get format-specific icon or emoji
   */
  const getFormatIcon = (formatName: string): string => {
    const icons: Record<string, string> = {
      'OpenRML': '📄',
      'ChatGPT': '🤖',
      'Claude': '🧠',
      'Gemini': '✨',
      'JSON': '{ }',
    };
    
    for (const [key, icon] of Object.entries(icons)) {
      if (formatName.includes(key)) return icon;
    }
    
    return '📋';
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled || isExporting}
          className="min-w-[120px]"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {formats.map((format) => {
          const formatEnum = getFormatEnum(format.name);
          
          return (
            <DropdownMenuItem
              key={format.name}
              onClick={() => handleExport(formatEnum)}
              className="cursor-pointer flex-col items-start py-3"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{getFormatIcon(format.name)}</span>
                  <span className="font-medium">{format.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format.platform}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {format.description}
              </p>
              
              {format.limitations.length > 0 && (
                <div className="flex items-start gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    {format.limitations[0]}
                  </p>
                </div>
              )}
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => handleCopyToClipboard('orml')}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy ORML to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
