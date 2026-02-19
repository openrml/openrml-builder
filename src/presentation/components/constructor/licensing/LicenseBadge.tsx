// /src/presentation/components/constructor/licensing/LicenseBadge.tsx
import React from 'react';
import { 
  Check, 
  X, 
  AlertTriangle,
  Copyright,
  CreativeCommons,
  FileText,
  Lock,
} from 'lucide-react';
import { LicenseInfo } from '../../../../core/domain/role/types';
import { LicenseService } from '../../../../core/services/license.service';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { Badge } from '../../ui/badge';
import { cn } from '../../ui/utils';

interface LicenseBadgeProps {
  licenseInfo?: LicenseInfo;
  className?: string;
  showDetails?: boolean;
  showExpiry?: boolean;
  compact?: boolean;
}

export const LicenseBadge: React.FC<LicenseBadgeProps> = ({
  licenseInfo,
  className,
  showDetails = false,
  showExpiry = true,
  compact = false,
}) => {
  const licenseService = React.useMemo(() => new LicenseService(), []);
  
  if (!licenseInfo) {
    return (
      <Badge variant="outline" className={cn("bg-muted text-muted-foreground", className)}>
        <FileText className="w-3 h-3 mr-1" />
        No License
      </Badge>
    );
  }

  const { type, attribution, expiresAt, terms } = licenseInfo;
  const expiryCheck = showExpiry ? licenseService.validateLicenseExpiry(licenseInfo) : null;
  const isCustom = type === 'CUSTOM';
  const isCC = type.startsWith('CC-');
  const isExpired = expiryCheck?.expired || false;
  const daysLeft = expiryCheck?.daysLeft;

  const getLicenseIcon = () => {
    if (isCustom) return <FileText className="w-3 h-3" />;
    if (isCC) return <CreativeCommons className="w-3 h-3" />;
    return <Copyright className="w-3 h-3" />;
  };

  const getLicenseColor = () => {
    if (isExpired) return 'destructive';
    if (isCustom) return 'secondary';
    return 'default';
  };

  const formatLicenseType = () => {
    if (type === 'CC-BY-4.0') return 'CC BY 4.0';
    if (type === 'CC-BY-SA-4.0') return 'CC BY-SA 4.0';
    if (type === 'CC-BY-NC-4.0') return 'CC BY-NC 4.0';
    if (type === 'CC-BY-NC-SA-4.0') return 'CC BY-NC-SA 4.0';
    return type;
  };

  const getPermissionBadges = () => {
    if (!terms || compact) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {terms.canUse && (
          <Badge variant="outline" className="text-xs gap-1">
            <Check className="w-3 h-3" />
            Use
          </Badge>
        )}
        {terms.canModify && (
          <Badge variant="outline" className="text-xs gap-1">
            <Check className="w-3 h-3" />
            Modify
          </Badge>
        )}
        {terms.canDistribute && (
          <Badge variant="outline" className="text-xs gap-1">
            <Check className="w-3 h-3" />
            Share
          </Badge>
        )}
        {terms.canUseCommercially ? (
          <Badge variant="outline" className="text-xs gap-1">
            <Check className="w-3 h-3" />
            Commercial
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs gap-1 bg-amber-50 text-amber-800 border-amber-200">
            <X className="w-3 h-3" />
            Commercial
          </Badge>
        )}
        {terms.mustAttribute && (
          <Badge variant="outline" className="text-xs gap-1">
            <Copyright className="w-3 h-3" />
            Attribution
          </Badge>
        )}
        {terms.mustShareAlike && (
          <Badge variant="outline" className="text-xs gap-1">
            <Lock className="w-3 h-3" />
            ShareAlike
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main License Badge */}
      <div className="flex items-start gap-2">
        <Badge variant={getLicenseColor()} className="gap-1">
          {getLicenseIcon()}
          {formatLicenseType()}
        </Badge>
        
        {attribution && !compact && (
          <span className="text-sm text-muted-foreground truncate" title={attribution}>
            by {attribution}
          </span>
        )}
        
        {isExpired && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Expired
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>License expired on {new Date(expiresAt!).toLocaleDateString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {!isExpired && expiresAt && daysLeft && daysLeft <= 30 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="warning" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {daysLeft}d
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>License expires in {daysLeft} days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Attribution (compact view) */}
      {attribution && compact && (
        <p className="text-xs text-muted-foreground truncate" title={attribution}>
          by {attribution}
        </p>
      )}

      {/* Expiry Info */}
      {showExpiry && expiresAt && !compact && (
        <div className="text-xs text-muted-foreground">
          {isExpired ? (
            <span className="text-destructive">
              Expired on {new Date(expiresAt).toLocaleDateString()}
            </span>
          ) : (
            <span>
              Expires on {new Date(expiresAt).toLocaleDateString()}
              {daysLeft && daysLeft <= 30 && (
                <span className="text-amber-600 ml-1">
                  ({daysLeft} days remaining)
                </span>
              )}
            </span>
          )}
        </div>
      )}

      {/* Detailed Permissions */}
      {showDetails && getPermissionBadges()}

      {/* Custom License Warning */}
      {isCustom && showDetails && (
        <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Custom License</span>
          </div>
          <p className="mt-1">
            This role uses a custom license. Terms may vary. Verify permissions before use.
          </p>
        </div>
      )}
    </div>
  );
};