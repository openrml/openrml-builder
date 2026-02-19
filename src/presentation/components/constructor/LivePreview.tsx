// src/presentation/components/constructor/LivePreview.tsx
import React, { useState, useMemo } from 'react';
import { Role } from '../../../core/domain/role/types';
import { exportRoleToText } from '../../../core/rml/exporter';
import { LicenseService } from '../../../core/services/license.service';
import { LicenseBadge } from './licensing/LicenseBadge';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Maximize2, Minimize2, Download, 
  Shield, FileText,
  AlertCircle
} from 'lucide-react';

interface LivePreviewProps {
  role: Role;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ role }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const licenseService = useMemo(() => new LicenseService(), []);

  // Защита: Если role не определен, показываем заглушку
  if (!role) {
    return (
      <div className="h-full flex flex-col border-2 border-[hsl(var(--color-border))] rounded-lg bg-[hsl(var(--color-background))] p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FileText className="w-12 h-12 text-[hsl(var(--color-muted-foreground))]/50 mx-auto mb-4" />
            <h3 className="font-semibold text-[hsl(var(--color-foreground))] mb-2">No Role Selected</h3>
            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
              Create a new role or select an existing one to preview
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Мемоизируем тяжелые вычисления
  const previewText = useMemo(() => {
    try {
      return exportRoleToText(role);
    } catch (error) {
      console.warn('Failed to export role to text:', error);
      return 'Error generating preview';
    }
  }, [role]);

  const licenseValid = useMemo(() => {
    if (!role?.license) return true;
    try {
      return licenseService.validateLicenseExpiry(role.license).valid;
    } catch {
      return true;
    }
  }, [role, licenseService]);

  const handleDownload = () => {
    try {
      const blob = new Blob([previewText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${role.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'role'}_preview.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download preview:', error);
    }
  };

  return (
    <div className={`h-full flex flex-col border border-[hsl(var(--color-border))] rounded-lg bg-[hsl(var(--color-background))] transition-all ${
      isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : ''
    }`}>
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-[hsl(var(--color-border))] bg-gradient-to-r from-[hsl(var(--color-background))] to-[hsl(var(--color-muted))] flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-[hsl(var(--color-foreground))] text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-[hsl(var(--color-primary))]" />
              Live Preview
            </h3>
            <p className="text-xs sm:text-sm text-[hsl(var(--color-muted-foreground))]">
              Real-time RML preview
            </p>
          </div>
          
          {/* Quick Status Badges */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            {role.license && (
              <LicenseBadge licenseInfo={role.license} compact />
            )}
            
            <Badge variant={role.status === 'published' ? 'default' : 'secondary'}>
              {role.status || 'draft'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            title="Download preview"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation - только один таб */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-3 pt-2 border-b border-[hsl(var(--color-border))]">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="preview" className="text-xs sm:text-sm">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              RML Preview
            </TabsTrigger>
            <TabsTrigger value="license" className="text-xs sm:text-sm">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              License
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: RML Preview */}
        <TabsContent value="preview" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <pre className="font-mono text-[10px] xs:text-xs sm:text-sm leading-relaxed text-[hsl(var(--color-foreground))]/80 whitespace-pre-wrap p-3 sm:p-4">
              {previewText}
            </pre>
          </ScrollArea>
        </TabsContent>

        {/* Tab: License Details - переделан на role.license */}
        <TabsContent value="license" className="flex-1 mt-0 p-4">
          <ScrollArea className="h-full">
            {role.license ? (
              <div className="space-y-4">
                {/* License Terms */}
                <div className="border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-3">License Terms</h4>
                  <LicenseBadge licenseInfo={role.license} showDetails={true} />
                </div>

                {/* Attribution */}
                {role.license.attribution && (
                  <div className="border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2">Attribution</h4>
                    <p className="text-sm">Must credit: {role.license.attribution}</p>
                  </div>
                )}

                {/* Expiry Warning */}
                {!licenseValid && role.license.expiresAt && (
                  <div className="border border-[hsl(var(--color-warning))]/30 bg-[hsl(var(--color-warning-light))] rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-[hsl(var(--color-warning))] mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-[hsl(var(--color-warning))]">License Expired</h4>
                        <p className="text-sm text-[hsl(var(--color-warning))]/80 mt-1">
                          License expired on {new Date(role.license.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Author Info */}
                {(role.author || role.contacts) && (
                  <div className="border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2">Author</h4>
                    <div className="space-y-1">
                      {role.author && <p className="text-sm">{role.author}</p>}
                      {role.contacts && (
                        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                          Contact: {role.contacts}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Shield className="w-12 h-12 text-[hsl(var(--color-muted-foreground))]/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No License Selected</h3>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                  Go to Step 8: Ethics & Versions to select a license for your role.
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Expanded Footer */}
      {isExpanded && (
        <div className="p-3 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-muted))] flex justify-between items-center rounded-b-lg">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <FileText className="w-3 h-3" />
              {role.name || 'Role'} v{role.version || '0.9.0'}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-xs"
          >
            Close fullscreen
          </Button>
        </div>
      )}
    </div>
  );
};