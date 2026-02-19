// /src/presentation/components/constructor/licensing/LicenseSelector.tsx
import React, { useState } from 'react';
import { 
  Check, 
  ExternalLink,
  Info,
  Crown,
  Users,
  Lock,
  DollarSign,
  Shield
} from 'lucide-react'; // ❌ Удален ChevronDown
import { LicenseType, LicenseInfo } from '../../../../core/domain/role/types';
import { LicenseService } from '../../../../core/services/license.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { LicenseBadge } from './LicenseBadge';
import { cn } from '../../ui/utils';

interface LicenseSelectorProps {
  value?: LicenseInfo;
  onChange: (licenseInfo: LicenseInfo) => void;
  author?: string;
  className?: string;
  showRecommendations?: boolean;
  showAdvanced?: boolean;
}

export const LicenseSelector: React.FC<LicenseSelectorProps> = ({
  value,
  onChange,
  author,
  className,
  showRecommendations = true,
  showAdvanced = false,
}) => {
  const licenseService = React.useMemo(() => new LicenseService(), []);
  const [attribution, setAttribution] = useState(value?.attribution || author || '');
  const [expiresAt, setExpiresAt] = useState(value?.expiresAt || '');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [showCustomAttribution, setShowCustomAttribution] = useState(false);

  const availableLicenses = licenseService.getAvailableLicenseTypes();
  const recommendations = licenseService.getLicenseRecommendations();

  const handleLicenseChange = (licenseType: LicenseType) => {
    const newLicense = licenseService.createLicenseInfo(licenseType, attribution, expiresAt);
    onChange(newLicense);
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    const recommendation = recommendations.find(r => r.goal === goal);
    if (recommendation) {
      handleLicenseChange(recommendation.recommendation as LicenseType);
    }
  };

  const handleAttributionChange = (newAttribution: string) => {
    setAttribution(newAttribution);
    if (value) {
      onChange({
        ...value,
        attribution: newAttribution || undefined,
      });
    }
  };

  const handleExpiryChange = (newExpiry: string) => {
    setExpiresAt(newExpiry);
    if (value) {
      onChange({
        ...value,
        expiresAt: newExpiry || undefined,
      });
    }
  };

  const getGoalIcon = (goal: string) => {
    if (goal.includes('Maximum reach') || goal.includes('virality')) {
      return <Users className="w-4 h-4" />;
    }
    if (goal.includes('Protect authorship')) {
      return <Shield className="w-4 h-4" />;
    }
    if (goal.includes('Prevent others from profiting')) {
      return <DollarSign className="w-4 h-4" />;
    }
    if (goal.includes('Prevent modifications')) {
      return <Lock className="w-4 h-4" />;
    }
    if (goal.includes('Sell to corporations')) {
      return <Crown className="w-4 h-4" />;
    }
    if (goal.includes('Collaborative development')) {
      return <Users className="w-4 h-4" />;
    }
    return <Info className="w-4 h-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current License Preview */}
      {value && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Selected License</CardTitle>
          </CardHeader>
          <CardContent>
            <LicenseBadge 
              licenseInfo={value} 
              showDetails 
              showExpiry 
            />
          </CardContent>
        </Card>
      )}

      {/* License Selection Tabs */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="all">All Licenses</TabsTrigger>
        </TabsList>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {showRecommendations && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Choose your goal:</h4>
              <div className="grid gap-2">
                {recommendations.map((rec) => (
                  <button
                    key={rec.goal}
                    type="button"
                    onClick={() => handleGoalSelect(rec.goal)}
                    className={cn(
                      "p-4 text-left border rounded-lg transition-all hover:border-primary",
                      selectedGoal === rec.goal
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getGoalIcon(rec.goal)}
                        <span className="font-medium">{rec.goal}</span>
                      </div>
                      {selectedGoal === rec.goal && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {rec.recommendation}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {rec.why}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* All Licenses Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Select a license:</h4>
            <Select
              value={value?.type}
              onValueChange={(val) => handleLicenseChange(val as LicenseType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a license" />
              </SelectTrigger>
              <SelectContent>
                {availableLicenses.map((license) => (
                  <SelectItem key={license.type} value={license.type}>
                    <div className="flex items-center justify-between w-full">
                      <span>{license.name}</span>
                      {value?.type === license.type && (
                        <Check className="w-4 h-4 text-primary ml-2" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid gap-3">
              {availableLicenses.map((license) => (
                <div
                  key={license.type}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all",
                    value?.type === license.type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleLicenseChange(license.type)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {value?.type === license.type && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                      <span className="font-medium">{license.name}</span>
                    </div>
                    <Badge variant="outline">
                      {license.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {license.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Advanced Options */}
      {showAdvanced && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Advanced Options</CardTitle>
            <CardDescription>
              Customize license settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Attribution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="attribution">Attribution</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomAttribution(!showCustomAttribution)}
                >
                  {showCustomAttribution ? 'Use Author' : 'Custom'}
                </Button>
              </div>
              
              {showCustomAttribution ? (
                <Input
                  id="attribution"
                  placeholder="Enter attribution name or organization"
                  value={attribution}
                  onChange={(e) => handleAttributionChange(e.target.value)}
                />
              ) : (
                <div className="p-2 border rounded bg-muted/50">
                  <span className="text-sm">{author || 'No author specified'}</span>
                </div>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expiresAt">License Expiry (Optional)</Label>
                {expiresAt && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExpiryChange('')}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => handleExpiryChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {expiresAt && (
                <p className="text-xs text-muted-foreground">
                  License will expire on {new Date(expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* License Terms Preview */}
            {value && value.type !== 'CUSTOM' && (
              <div className="space-y-2">
                <Label>License Terms</Label>
                <div className="p-3 border rounded bg-muted/50 text-sm">
                  <pre className="whitespace-pre-wrap font-sans">
                    {licenseService.generateLicenseText(value)}
                  </pre>
                </div>
              </div>
            )}

            {/* CUSTOM License Warning */}
            {value?.type === 'CUSTOM' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <div className="flex items-center gap-2 text-amber-800">
                  <Info className="w-4 h-4" />
                  <span className="font-medium">Custom License Note</span>
                </div>
                <p className="text-sm mt-1 text-amber-700">
                  When using a custom license, you must provide the full license text separately.
                  This badge only indicates that a custom license exists.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legal Links */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Need help choosing?{' '}
          <Button
            variant="link"
            className="h-auto p-0 text-xs"
            onClick={() => window.open('https://creativecommons.org/choose/', '_blank')}
          >
            Use Creative Commons Chooser
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </p>
        <p>
          License details:{' '}
          <Button
            variant="link"
            className="h-auto p-0 text-xs"
            onClick={() => window.open('https://creativecommons.org/licenses/', '_blank')}
          >
            Creative Commons Licenses
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </p>
      </div>
    </div>
  );
};