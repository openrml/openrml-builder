import React, { useState } from 'react';
import { Role } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Plus, X } from 'lucide-react';

interface Step4ExpertiseProps {
  role: Role;
  onChange: (updates: Partial<Role>) => void;
}

export const Step4Expertise: React.FC<Step4ExpertiseProps> = ({ role, onChange }) => {
  const { t } = useLanguage();
  
  const [newArea, setNewArea] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newFormat, setNewFormat] = useState('');

  const addItem = (field: 'expertiseAreas' | 'tools' | 'outputFormats', value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      onChange({ [field]: [...role[field], value.trim()] });
      setter('');
    }
  };

  const removeItem = (field: 'expertiseAreas' | 'tools' | 'outputFormats', index: number) => {
    onChange({ [field]: role[field].filter((_, i) => i !== index) });
  };

  const ListSection = ({ 
    title, 
    items, 
    newValue, 
    setNewValue, 
    field, 
    buttonLabel,
    placeholder 
  }: { 
    title: string; 
    items: string[]; 
    newValue: string; 
    setNewValue: (v: string) => void; 
    field: 'expertiseAreas' | 'tools' | 'outputFormats';
    buttonLabel: string;
    placeholder: string;
  }) => (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-xs sm:text-sm font-medium">{title}</Label>
        <span className="text-xs text-[hsl(var(--color-muted-foreground))]">{items.length} items</span>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 bg-[hsl(var(--color-muted))] border border-[hsl(var(--color-border))] rounded-lg p-2 sm:p-3">
            <span className="text-[hsl(var(--color-primary))] font-bold text-sm">•</span>
            <span className="flex-1 text-xs sm:text-sm">{item}</span>
            <button
              onClick={() => removeItem(field, index)}
              className="text-red-500 hover:text-[hsl(var(--color-destructive-hover))]"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem(field, newValue, setNewValue)}
            placeholder={placeholder}
            className="flex-1 text-sm sm:text-base"
          />
          <Button onClick={() => addItem(field, newValue, setNewValue)} size="sm" className="gap-1 sm:gap-2">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <ListSection
        title={t('expertiseAreas')}
        items={role.expertiseAreas}
        newValue={newArea}
        setNewValue={setNewArea}
        field="expertiseAreas"
        buttonLabel={t('addArea')}
        placeholder={t('expertisePlaceholder') || "Add area of expertise..."}
      />

      <ListSection
        title={t('toolsAndMethods')}
        items={role.tools}
        newValue={newTool}
        setNewValue={setNewTool}
        field="tools"
        buttonLabel={t('addTool')}
        placeholder={t('toolsPlaceholder') || "Add tool or method..."}
      />

      <ListSection
        title={t('outputFormats')}
        items={role.outputFormats}
        newValue={newFormat}
        setNewValue={setNewFormat}
        field="outputFormats"
        buttonLabel={t('addFormat')}
        placeholder={t('formatsPlaceholder') || "Add output format..."}
      />

      {/* Additional Rules */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="additionalRules" className="text-sm sm:text-base font-semibold">
            {t('additionalRules')}
          </Label>
          <span className="text-xs text-[hsl(var(--color-muted-foreground))]">
            {role.additionalRules.length}/500 {t('characters')}
          </span>
        </div>
        <Textarea
          id="additionalRules"
          value={role.additionalRules}
          onChange={(e) => onChange({ additionalRules: e.target.value })}
          placeholder={t('rulesPlaceholder') || "Any additional rules, constraints, or guidelines..."}
          rows={4}
          className="text-sm sm:text-base resize-none"
          maxLength={500}
        />
      </div>
    </div>
  );
};