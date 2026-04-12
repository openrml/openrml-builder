// src/presentation/components/constructor/ExportMenuV1_1.tsx

import { useState } from 'react';
import { Copy, AlertCircle, Save, FileCode, Sparkles, Info } from 'lucide-react';
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
import { downloadRole } from '../../../core/rml/exporter';
import { downloadMinimalOpenRML_1_1 } from '../../../core/rml/exporter-minimal-v1_1';
import { ExportRoleUseCase } from '../../../application/use-cases/export-role.use-case';
import type { Role } from '../../../core/domain/role/types';
import type { ExportFormat } from '../../../core/export';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface ExportMenuProps {
  role: Role;
  disabled?: boolean;
}

type OpenRMLVersion = '1.0' | '1.1';

/**
 * Export menu with OpenRML 1.1 Minimal support
 */
export function ExportMenu({ role, disabled = false }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const exportUseCase = new ExportRoleUseCase();
  
  /**
   * Handle OpenRML export (with version selection)
   */
  const handleOpenRMLExport = async (version: OpenRMLVersion) => {
    setIsExporting(true);
    
    try {
      if (version === '1.1') {
        downloadMinimalOpenRML_1_1(role);
        toast.success('Exported as OpenRML 1.1 Minimal', {
          description: 'Enhanced with priority system and behavioral anchors',
        });
      } else {
        downloadRole(role);
        toast.success('Exported as OpenRML 1.0', {
          description: 'Stable format for maximum compatibility',
        });
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
   * Handle platform export
   */
  const handlePlatformExport = async (format: ExportFormat) => {
    setIsExporting(true);
    
    try {
      const result = exportUseCase.execute({
        role,
        format,
        download: true,
      });
      
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
  const handleCopyToClipboard = async (version: OpenRMLVersion) => {
    try {
      let content: string;
      if (version === '1.1') {
        const { exportToMinimalOpenRML_1_1 } = await import('../../../core/rml/exporter-minimal-v1_1');
        content = exportToMinimalOpenRML_1_1(role);
      } else {
        const { exportRoleToText } = await import('../../../core/rml/exporter');
        content = exportRoleToText(role);
      }
      
      await navigator.clipboard.writeText(content);
      toast.success(`Copied OpenRML ${version} to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  /**
   * Get compilation targets
   */
  const getCompilationTargets = () => {
    const allFormats = exportUseCase.getAvailableFormats();
    return allFormats.filter(f => !f.name.includes('OpenRML'));
  };
  
  const compilationTargets = getCompilationTargets();
  
  const getFormatEnum = (formatName: string): ExportFormat => {
    const mapping: Record<string, ExportFormat> = {
      'ChatGPT Custom Instructions': 'gpt',
      'Claude Project': 'claude-project',
      'Google Gemini Gem': 'gemini',
      'JSON Export': 'json',
    };
    return mapping[formatName] || 'gpt';
  };
  
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
        
        {/* OpenRML 1.1 - PRIMARY */}
        <div className="px-2 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md mx-1 mb-2 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-sm">OpenRML 1.1 Minimal</span>
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-600 text-white">New</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Enhanced with priority system, behavioral anchors, and anti-drift mechanisms.
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleOpenRMLExport('1.1')}
              disabled={disabled || isExporting}
            >
              <Save className="mr-2 h-3 w-3" />
              Download v1.1
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="px-2"
                  >
                    <Info className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-64">
                  <p className="text-xs">
                    <strong>What's new in 1.1:</strong><br />
                    • Priority system (CRITICAL &gt; HIGH &gt; STRUCTURE)<br />
                    • Behavioral anchors for conflict resolution<br />
                    • Core anchor against long-context drift<br />
                    • Declarative strategic priming
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* OpenRML 1.0 - STABLE */}
        <div className="px-2 py-3 bg-primary/5 rounded-md mx-1 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Save className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">OpenRML 1.0</span>
            <Badge variant="secondary" className="ml-auto text-xs">Stable</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Classic format with maximum compatibility. Use for established workflows.
          </p>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full"
            onClick={() => handleOpenRMLExport('1.0')}
            disabled={disabled || isExporting}
          >
            <Save className="mr-2 h-3 w-3" />
            Download v1.0
          </Button>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Platform exports */}
        <DropdownMenuLabel className="flex items-center gap-2 text-muted-foreground font-normal">
          <FileCode className="h-3 w-3" />
          <span className="text-xs">Compile to platform (lossy)</span>
        </DropdownMenuLabel>
        
        {compilationTargets.map((format) => {
          const formatEnum = getFormatEnum(format.name);
          
          return (
            <DropdownMenuItem
              key={format.name}
              onClick={() => handlePlatformExport(formatEnum)}
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
          💡 Tip: Use OpenRML 1.1 for new roles, 1.0 for compatibility
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Copy to clipboard options */}
        <DropdownMenuItem
          onClick={() => handleCopyToClipboard('1.1')}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy OpenRML 1.1 to Clipboard
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleCopyToClipboard('1.0')}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy OpenRML 1.0 to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}