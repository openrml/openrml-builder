// presentation/components/ui/rml-identity-badge.tsx
import { Role } from '../../../core/domain/role/types';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { Button } from './button';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { rmlIdentityService } from '../../../core/services/identity.service';
import { FEATURES } from '../../../config/features';

interface RMLIdentityBadgeProps {
  role: Role;
  showValidation?: boolean;
  className?: string;
}

export function RMLIdentityBadge({ 
  role, 
  showValidation = true,
  className 
}: RMLIdentityBadgeProps) {
  const [copied, setCopied] = useState(false);
  
  if (!FEATURES.RML_IDENTITY_UI || !role.rmlIdentity?.fullId) {
    return null;
  }
  
  const validation = showValidation && FEATURES.RML_IDENTITY_VALIDATION
    ? rmlIdentityService.validateIdentity(role)
    : null;
  
  const isValid = validation?.valid !== false;
  const mismatches = validation?.mismatchedComponents || [];
  
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(role.rmlIdentity?.fullId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Badge 
        variant={isValid ? 'outline' : 'destructive'}
        className="font-mono text-xs"
      >
        {!isValid && <AlertCircle className="w-3 h-3 mr-1" />}
        RML ID
      </Badge>
      
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {role.rmlIdentity.fullId}
      </code>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
      
      {role.rmlIdentity.reference && (
        <code className="text-xs text-muted-foreground hidden sm:inline">
          {role.rmlIdentity.reference}
        </code>
      )}
      
      {!isValid && mismatches.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className="text-xs cursor-help">
              Modified
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Changed: {mismatches.join(', ')}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}