// src/presentation/components/constructor/steps/Step1Base.tsx
import React from 'react';
import { Role, Archetype, RoleType } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Slider } from '../../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
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