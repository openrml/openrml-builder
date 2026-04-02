// src/presentation/components/constructor/ExportMenu.tsx

import { useState } from 'react';
import { Copy, AlertCircle, Save, FileCode } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { ExportRoleUseCase } from '../../../application/use-cases/export-role.use-case';
import type { Role } from '../../../core/domain/role/types';
import type { ExportFormat } from '../../../core/export';

interface ExportMenuProps {
  role: Role;
  disabled?: boolean;
}

/**
 * Export menu component with correct architecture:
 * - OpenRML is the SOURCE format (primary)
 * - Other formats are COMPILATION TARGETS (secondary, lossy)
 */
export function ExportMenu({ role, disabled = false }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const exportUseCase = new ExportRoleUseCase();
  
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
   * Get compilation targets (all formats except ORML)
   */
  const getCompilationTargets = () => {
    const allFormats = exportUseCase.getAvailableFormats();
    return allFormats.filter(f => !f.name.includes('OpenRML'));
  };
  
  const compilationTargets = getCompilationTargets();
  
  /**
   * Map format name to enum
   */
  const getFormatEnum = (formatName: string): ExportFormat => {
    const mapping: Record<string, ExportFormat> = {
      'ChatGPT Custom Instructions': 'gpt',
      'Claude Project': 'claude-project',
      'Google Gemini Gem': 'gemini',
      'JSON Export': 'json',
    };
    
    return mapping[formatName] || 'gpt';
  };
  
  /**
   * Get format icon
   */
  const getFormatIcon = (formatName: string): string => {
    const icons: Record<string, string> = {
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
          size="sm"
          disabled={disabled || isExporting}
          className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
        >
          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{isExporting ? 'Saving...' : 'Export'}</span>
          <span className="sm:hidden">Exp</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* PRIMARY: Save as OpenRML */}
        <div className="px-2 py-3 bg-primary/5 rounded-md mx-1 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Save className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Save as OpenRML</span>
            <Badge variant="secondary" className="ml-auto text-xs">Source</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Full-fidelity format preserving all metadata, language settings, and identity.
          </p>
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => handleExport('orml')}
            disabled={disabled || isExporting}
          >
            <Save className="mr-2 h-3 w-3" />
            Download .orml.txt
          </Button>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* SECONDARY: Compile to platforms */}
        <DropdownMenuLabel className="flex items-center gap-2 text-muted-foreground font-normal">
          <FileCode className="h-3 w-3" />
          <span className="text-xs">Compile to platform (lossy)</span>
        </DropdownMenuLabel>
        
        {compilationTargets.map((format) => {
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
                  <span className="font-medium text-sm">{format.name}</span>
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
        
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          💡 Tip: Always keep .orml.txt as your source file
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => handleCopyToClipboard('orml')}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy OpenRML to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
