// src/presentation/components/constructor/steps/Step1Base.tsx
import React from 'react';
import { Role, Archetype, RoleType, Language, ResponseBehavior } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Slider } from '../../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { categories } from '../../../../data/categories';
import { Badge } from '../../ui/badge';
// ❌ Удалены все импорты RMLIdentityBadge, IdentityService, Card, AlertTriangle

interface Step1BaseProps {
  role: Role;
  onChange: (updates: Partial<Role>) => void;
}

export const Step1Base: React.FC<Step1BaseProps> = ({ role, onChange }) => {
  const { t } = useLanguage();

  const archetypes: { value: Archetype; emoji: string; label: string }[] = [
    { value: 'mentor', emoji: '👨‍🏫', label: t('mentor') },
    { value: 'creator', emoji: '🎨', label: t('creator') },
    { value: 'analyst', emoji: '📊', label: t('analyst') },
    { value: 'healer', emoji: '🩺', label: t('healer') },
    { value: 'scientist', emoji: '📚', label: t('scientist') },
    { value: 'leader', emoji: '⚔️', label: t('leader') },
    { value: 'explorer', emoji: '🧭', label: t('explorer') },
    { value: 'guardian', emoji: '🛡️', label: t('guardian') },
  ];

  const roleTypes: { value: RoleType; label: string }[] = [
    { value: 'professional', label: t('professional') },
    { value: 'personal', label: t('personal') },
    { value: 'educational', label: t('educational') },
    { value: 'creative', label: t('creative') },
  ];

  // Обработка тегов
  const updateTags = (newTags: string) => {
    const tagArray = newTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    onChange({ tags: tagArray });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ❌ Удален RML Identity Card */}

      {/* Role Name */}
      <div className="space-y-2">
        <Label htmlFor="roleName" className="text-sm sm:text-base font-semibold">
          {t('roleName')} *
        </Label>
        <Input
          id="roleName"
          value={role.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Career Coach Alex"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Status and Version */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm sm:text-base font-semibold">Status *</Label>
          <Select
            value={role.status || 'draft'}
            onValueChange={(value) => onChange({ 
              status: value as 'draft' | 'published',
              updatedAt: new Date().toISOString()
            })}
          >
            <SelectTrigger id="status" className="text-sm sm:text-base">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">
                <span className="flex items-center gap-2">
                  <Badge variant="secondary">Draft</Badge>
                  <span className="text-muted-foreground">Not ready for sharing</span>
                </span>
              </SelectItem>
              <SelectItem value="published">
                <span className="flex items-center gap-2">
                  <Badge variant="default">Published</Badge>
                  <span className="text-muted-foreground">Ready for sharing</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="version" className="text-sm sm:text-base font-semibold">Version *</Label>
          <Input
            id="version"
            value={role.version || '0.9.0'}
            onChange={(e) => onChange({ version: e.target.value })}
            placeholder="0.9.0"
            className="text-sm sm:text-base font-mono"
          />
          <div className="text-xs text-muted-foreground">
            Semantic versioning: MAJOR.MINOR.PATCH
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm sm:text-base font-semibold">Category *</Label>
        <Select
          value={role.category || 'productivity'}
          onValueChange={(value) => onChange({ category: value as any })}
        >
          <SelectTrigger id="category" className="text-sm sm:text-base">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <span className="flex items-center gap-2">
                  {cat.icon} {cat.name.en}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm sm:text-base font-semibold">
          Tags
        </Label>
        <Input
          id="tags"
          value={role.tags?.join(', ') || ''}
          onChange={(e) => updateTags(e.target.value)}
          placeholder="coaching, career, productivity, goals"
          className="text-sm sm:text-base"
        />
        <div className="text-xs text-muted-foreground">
          Separate with commas: tag1, tag2, tag3
        </div>
      </div>

      {/* Archetype */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-sm sm:text-base font-semibold">{t('archetype')} *</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {archetypes.map(archetype => (
            <button
              key={archetype.value}
              onClick={() => onChange({ archetype: archetype.value })}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all hover:border-indigo-400 ${
                role.archetype === archetype.value
                  ? 'border-indigo-600 bg-[hsl(var(--color-primary))]/5'
                  : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))]'
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-1">{archetype.emoji}</div>
              <div className="text-xs font-medium text-slate-700">{archetype.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Role Type */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-sm sm:text-base font-semibold">{t('roleType')} *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {roleTypes.map(type => (
            <button
              key={type.value}
              onClick={() => onChange({ roleType: type.value })}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                role.roleType === type.value
                  ? 'border-indigo-600 bg-[hsl(var(--color-primary))]/5 text-[hsl(var(--color-primary-active))]'
                  : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] text-slate-700 hover:border-[hsl(var(--color-primary))]/30'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm sm:text-base font-semibold">
          {t('description')} *
        </Label>
        <Textarea
          id="description"
          value={role.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Helps with career growth and job transitions..."
          rows={4}
          maxLength={250}
          className="text-sm sm:text-base resize-none"
        />
        <div className="text-xs text-muted-foreground text-right">
          {role.description.length}/250 {t('charactersRemaining')}
        </div>
      </div>

      {/* Main Goal */}
      <div className="space-y-2">
        <Label htmlFor="mainGoal" className="text-sm sm:text-base font-semibold">
          {t('mainGoal')} *
        </Label>
        <Textarea
          id="mainGoal"
          value={role.mainGoal}
          onChange={(e) => onChange({ mainGoal: e.target.value })}
          placeholder="Help find dream job and build successful career"
          rows={2}
          className="text-sm sm:text-base resize-none"
        />
      </div>

      {/* Language Settings */}
      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🌐</span>
          <h3 className="text-sm sm:text-base font-semibold">Language Settings</h3>
        </div>
        
        {/* Primary Language */}
        <div className="space-y-2">
          <Label htmlFor="roleLang" className="text-sm">
            Primary Language
            <span className="ml-1 text-xs text-muted-foreground">(Language the role content is written in)</span>
          </Label>
          <Select
            value={role.roleLang || 'en'}
            onValueChange={(value) => onChange({ roleLang: value as Language })}
          >
            <SelectTrigger id="roleLang" className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="ua">🇺🇦 Українська</SelectItem>
              <SelectItem value="es">🇪🇸 Español</SelectItem>
              <SelectItem value="zh">🇨🇳 中文</SelectItem>
              <SelectItem value="fr">🇫🇷 Français</SelectItem>
              <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Supported Languages */}
        <div className="space-y-2">
          <Label className="text-sm">
            Supported Languages
            <span className="ml-1 text-xs text-muted-foreground">(Languages the role can respond in)</span>
          </Label>
          <Input
            value={(role.supportedLanguages || ['en', 'ua']).join(', ')}
            onChange={(e) => {
              const langs = e.target.value
                .split(',')
                .map(l => l.trim())
                .filter(l => ['en', 'ua', 'es', 'zh', 'fr', 'de'].includes(l)) as Language[];
              onChange({ supportedLanguages: langs.length > 0 ? langs : ['en', 'ua'] });
            }}
            placeholder="en, ua, es"
            className="text-sm font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated codes: en, ua, es, zh, fr, de
          </p>
        </div>

        {/* Response Behavior */}
        <div className="space-y-2">
          <Label className="text-sm">Response Behavior</Label>
          <RadioGroup
            value={role.responseBehavior || 'auto'}
            onValueChange={(value) => onChange({ responseBehavior: value as ResponseBehavior })}
            className="space-y-2"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="auto" id="auto" className="mt-0.5" />
              <Label htmlFor="auto" className="text-sm font-normal cursor-pointer">
                <span className="font-medium">Auto-detect</span>
                <span className="block text-xs text-muted-foreground">
                  Automatically detect and respond in user's language
                </span>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="match" id="match" className="mt-0.5" />
              <Label htmlFor="match" className="text-sm font-normal cursor-pointer">
                <span className="font-medium">Match user</span>
                <span className="block text-xs text-muted-foreground">
                  Always respond in the same language as user's message
                </span>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="strict" id="strict" className="mt-0.5" />
              <Label htmlFor="strict" className="text-sm font-normal cursor-pointer">
                <span className="font-medium">Primary only</span>
                <span className="block text-xs text-muted-foreground">
                  Always respond in primary language regardless of user's language
                </span>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="flexible" id="flexible" className="mt-0.5" />
              <Label htmlFor="flexible" className="text-sm font-normal cursor-pointer">
                <span className="font-medium">Flexible</span>
                <span className="block text-xs text-muted-foreground">
                  Switch language when user explicitly requests
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Allow Language Switch */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="allowLanguageSwitch"
            checked={role.allowLanguageSwitch !== false}
            onChange={(e) => onChange({ allowLanguageSwitch: e.target.checked })}
            className="mt-1"
          />
          <Label htmlFor="allowLanguageSwitch" className="text-sm font-normal cursor-pointer">
            Allow user to change language during conversation
            <span className="block text-xs text-muted-foreground">
              User can ask to switch languages (e.g., "Please continue in English")
            </span>
          </Label>
        </div>
      </div>

      {/* Response Length */}
      <div className="space-y-3">
        <Label className="text-sm sm:text-base font-semibold">{t('responseLength')}</Label>
        <div className="px-1 sm:px-2">
          <Slider
            value={[role.responseLength]}
            onValueChange={([value]) => onChange({ responseLength: value })}
            min={1}
            max={7}
            step={1}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t('short')}</span>
            <span className="font-medium text-[hsl(var(--color-primary))]">{role.responseLength}/7</span>
            <span>{t('long')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};