// src/presentation/components/constructor/steps/Step8Ethics.tsx
import React, { useState } from 'react';
import { Role, EthicalAction, LicenseInfo } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { LicenseSelector } from '../licensing/LicenseSelector';
import { LicenseBadge } from '../licensing/LicenseBadge';
import { 
  Plus, X, Shield, FileText, User, History, 
  AlertTriangle, StopCircle, ArrowRightCircle, 
  Copyright
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';

interface Step8EthicsProps {
  role: Role;
  onChange: (updates: Partial<Role>) => void;
}

export const Step8Ethics: React.FC<Step8EthicsProps> = ({ role, onChange }) => {
  const { t } = useLanguage();
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleAction, setNewRuleAction] = useState<EthicalAction>('warn');
  const [newChangelog, setNewChangelog] = useState('');

  // Добавление правила
  const addRule = () => {
    if (newRuleText.trim()) {
      const newRule = {
        rule: newRuleText.trim(),
        action: newRuleAction
      };
      
      // Конвертируем старые правила если нужно
      let currentRules = role.ethicalRules;
      if (Array.isArray(currentRules) && currentRules.length > 0 && typeof currentRules[0] === 'string') {
        currentRules = (currentRules as unknown as string[]).map(rule => ({
          rule,
          action: 'warn' as EthicalAction
        }));
      }
      
      onChange({
        ethicalRules: [...(Array.isArray(currentRules) ? currentRules : []), newRule],
      });
      setNewRuleText('');
      setNewRuleAction('warn');
    }
  };

  const removeRule = (index: number) => {
    const currentRules = Array.isArray(role.ethicalRules) ? role.ethicalRules : [];
    onChange({
      ethicalRules: currentRules.filter((_, i) => i !== index),
    });
  };

  const updateRule = (index: number, updates: Partial<{ rule: string; action: EthicalAction }>) => {
    const currentRules = Array.isArray(role.ethicalRules) ? role.ethicalRules : [];
    const updatedRules = [...currentRules];
    
    if (typeof updatedRules[index] === 'string') {
      updatedRules[index] = {
        rule: updatedRules[index] as string,
        action: 'warn'
      };
    }
    
    updatedRules[index] = { ...(updatedRules[index] as any), ...updates };
    onChange({ ethicalRules: updatedRules });
  };

  const addChangelog = () => {
    if (newChangelog.trim()) {
      onChange({
        changelog: [...role.changelog, newChangelog.trim()],
      });
      setNewChangelog('');
    }
  };

  const removeChangelog = (index: number) => {
    onChange({
      changelog: role.changelog.filter((_, i) => i !== index),
    });
  };

  // Обработка изменения лицензии
  const handleLicenseChange = (licenseInfo: LicenseInfo) => {
    onChange({ license: licenseInfo });
  };

  const getActionIcon = (action: EthicalAction) => {
    switch (action) {
      case 'warn': return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-warning))]" />;
      case 'stop': return <StopCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-destructive))]" />;
      case 'refer': return <ArrowRightCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-info))]" />;
      default: return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-warning))]" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* License Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-primary-light))] rounded-lg flex items-center justify-center">
            <Copyright className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-primary))]" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold">License</h3>
          {role.license && (
            <LicenseBadge licenseInfo={role.license} compact className="ml-2" />
          )}
        </div>
        
        <LicenseSelector
          value={role.license}
          onChange={handleLicenseChange}
          author={role.author}
          showRecommendations={true}
          showAdvanced={true}
        />
      </div>

      <Separator />

      {/* Ethical Rules */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-success-light))] rounded-lg flex items-center justify-center">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-success))]" />
          </div>
          <Label className="text-sm sm:text-base font-semibold">{t('ethicalRules')}</Label>
        </div>

        <div className="space-y-2">
          {Array.isArray(role.ethicalRules) && role.ethicalRules.map((rule, index) => {
            const ruleObj = typeof rule === 'string' 
              ? { rule, action: 'warn' as EthicalAction }
              : rule;
            
            return (
              <div
                key={index}
                className="flex items-start gap-2 sm:gap-3 bg-[hsl(var(--color-success-light))] border border-[hsl(var(--color-success))]/30 rounded-lg p-2 sm:p-3"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActionIcon(ruleObj.action)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-[hsl(var(--color-success-light))] text-[hsl(var(--color-success))] border-[hsl(var(--color-success))]/30">
                      {ruleObj.action.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={ruleObj.rule}
                      onChange={(e) => updateRule(index, { rule: e.target.value })}
                      className="border-none bg-transparent p-0 text-xs sm:text-sm focus-visible:ring-0"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(index)}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-[hsl(var(--color-destructive))] hover:text-[hsl(var(--color-destructive-hover))] hover:bg-[hsl(var(--color-destructive))]/5"
                >
                  <X className="w-2 h-2 sm:w-3 sm:h-3" />
                </Button>
              </div>
            );
          })}

          {/* Add Rule Form */}
          <div className="space-y-2 border-2 border-dashed border-[hsl(var(--color-border))] rounded-lg p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <Label className="text-xs font-medium">Rule</Label>
                <Input
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRule()}
                  placeholder="Maintain confidentiality, avoid discrimination..."
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label className="text-xs font-medium">Action</Label>
                <Select value={newRuleAction} onValueChange={(value) => setNewRuleAction(value as EthicalAction)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warn">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-[hsl(var(--color-warning))]" />
                        Warn
                      </span>
                    </SelectItem>
                    <SelectItem value="stop">
                      <span className="flex items-center gap-2">
                        <StopCircle className="w-3 h-3 text-[hsl(var(--color-destructive))]" />
                        Stop
                      </span>
                    </SelectItem>
                    <SelectItem value="refer">
                      <span className="flex items-center gap-2">
                        <ArrowRightCircle className="w-3 h-3 text-[hsl(var(--color-info))]" />
                        Refer
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={addRule}
              size="sm"
              className="gap-1 sm:gap-2 mt-2"
              disabled={!newRuleText.trim()}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('addRule') || 'Add Rule'}
            </Button>
          </div>
        </div>
      </div>

      {/* Referral Protocol */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-info-light))] rounded-lg flex items-center justify-center">
            <ArrowRightCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-info))]" />
          </div>
          <Label className="text-sm sm:text-base font-semibold">Referral Protocol</Label>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Triggers</Label>
            <Textarea
              value={role.referralProtocol?.triggers?.join('\n') || ''}
              onChange={(e) => {
                const triggers = e.target.value.split('\n').filter(t => t.trim());
                onChange({
                  referralProtocol: {
                    triggers,
                    message: role.referralProtocol?.message || ''
                  }
                });
              }}
              placeholder="Mental health crisis\nLegal advice needed\nMedical emergency\nFinancial fraud"
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Referral Message</Label>
            <Textarea
              value={role.referralProtocol?.message || ''}
              onChange={(e) => onChange({
                referralProtocol: {
                  triggers: role.referralProtocol?.triggers || [],
                  message: e.target.value
                }
              })}
              placeholder="I notice you're asking about [topic]. While I can provide general information, this sounds like a situation that requires professional assistance. I recommend consulting with [appropriate professional] for personalized guidance."
              rows={3}
              className="text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-warning-light))] rounded-lg flex items-center justify-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-warning))]" />
          </div>
          <Label htmlFor="disclaimer" className="text-sm sm:text-base font-semibold">
            {t('disclaimer')}
          </Label>
        </div>
        <Textarea
          id="disclaimer"
          value={role.disclaimer}
          onChange={(e) => onChange({ disclaimer: e.target.value })}
          placeholder="This AI assistant provides information for educational purposes only. Not a replacement for professional advice. Consult qualified professionals for specific situations."
          rows={4}
          className="text-sm sm:text-base resize-none"
        />
      </div>

      {/* Author and Contacts */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-info-light))] rounded-lg flex items-center justify-center">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-info))]" />
          </div>
          <Label className="text-sm sm:text-base font-semibold">{t('authorAndContacts')}</Label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm sm:text-base">{t('author')}</Label>
            <Input
              id="author"
              value={role.author}
              onChange={(e) => onChange({ author: e.target.value })}
              placeholder="Your name or organization"
              className="text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contacts" className="text-sm sm:text-base">{t('contacts')}</Label>
            <Input
              id="contacts"
              value={role.contacts}
              onChange={(e) => onChange({ contacts: e.target.value })}
              placeholder="email@example.com or website"
              className="text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Version History */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-primary-light))] rounded-lg flex items-center justify-center">
            <History className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-primary))]" />
          </div>
          <Label className="text-sm sm:text-base font-semibold">{t('versionHistory')}</Label>
        </div>

        <div className="space-y-2">
          {role.changelog.map((entry, index) => (
            <div
              key={index}
              className="flex items-start justify-between bg-[hsl(var(--color-muted))] border border-[hsl(var(--color-border))] rounded-lg p-2 sm:p-3"
            >
              <div className="flex items-start gap-1 sm:gap-2">
                <span className="text-[hsl(var(--color-primary))] font-mono text-xs sm:text-sm">→</span>
                <span className="text-xs sm:text-sm font-mono">{entry}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeChangelog(index)}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-[hsl(var(--color-destructive))] hover:text-[hsl(var(--color-destructive-hover))] hover:bg-[hsl(var(--color-destructive))]/5"
              >
                <X className="w-2 h-2 sm:w-3 sm:h-3" />
              </Button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={newChangelog}
              onChange={(e) => setNewChangelog(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChangelog()}
              placeholder="v1.0 — Initial version with basic functionality"
              className="flex-1 text-sm sm:text-base font-mono"
            />
            <Button
              onClick={addChangelog}
              size="sm"
              className="gap-1 sm:gap-2"
              disabled={!newChangelog.trim()}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('addToChangelog')}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Use semantic versioning: vMAJOR.MINOR.PATCH — Description
        </div>
      </div>

      {/* Summary Card with License Info */}
      <Card className="bg-gradient-to-r from-[hsl(var(--color-card))] to-[hsl(var(--color-background))]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span>📋</span>
            Publishing Summary
          </CardTitle>
          <CardDescription>
            All components for publication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium ml-2">{role.name || 'Unnamed'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium ml-2">{role.version || '0.9.0'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium ml-2 capitalize">{role.status || 'draft'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">License:</span>
              <span className="font-medium ml-2">
                {role.license?.type || 'CC-BY-4.0'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Ethical Rules:</span>
              <span className="font-medium ml-2">
                {Array.isArray(role.ethicalRules) ? role.ethicalRules.length : 0}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium ml-2">
                {new Date(role.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};