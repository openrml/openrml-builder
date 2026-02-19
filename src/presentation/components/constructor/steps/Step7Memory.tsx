import React, { useState } from 'react';
import { Role, MemoryStrategy } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Plus, X, Brain, Clock, Star, Heart } from 'lucide-react';

interface Step7MemoryProps {
  role: Role;
  onChange: (updates: Partial<Role>) => void;
}

export const Step7Memory: React.FC<Step7MemoryProps> = ({ role, onChange }) => {
  const { t } = useLanguage();
  const [newState, setNewState] = useState('');

  const memoryStrategies: { 
    value: MemoryStrategy; 
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      value: 'semantic',
      label: t('semantic'),
      icon: <Brain className="w-3 h-3 sm:w-4 sm:h-4" />,
      description: t('semanticDescription') || 'Preserves key meanings and concepts',
    },
    {
      value: 'chronological',
      label: t('chronological'),
      icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />,
      description: t('chronologicalDescription') || 'Organizes by timeline and sequence',
    },
    {
      value: 'importance',
      label: t('importance'),
      icon: <Star className="w-3 h-3 sm:w-4 sm:h-4" />,
      description: t('importanceDescription') || 'Prioritizes important events and data',
    },
    {
      value: 'emotional',
      label: t('emotional'),
      icon: <Heart className="w-3 h-3 sm:w-4 sm:h-4" />,
      description: t('emotionalDescription') || 'Focuses on emotional experiences',
    },
  ];

  const addState = () => {
    if (newState.trim()) {
      onChange({
        emotionalStates: [...role.emotionalStates, newState.trim()],
      });
      setNewState('');
    }
  };

  const removeState = (index: number) => {
    onChange({
      emotionalStates: role.emotionalStates.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Memory System Explanation */}
      <div className="bg-[hsl(var(--color-info-light))] border border-[hsl(var(--color-info))]/30 rounded-lg p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-[hsl(var(--color-info))] mb-1 sm:mb-2">Memory System</h3>
        <p className="text-xs sm:text-sm text-[hsl(var(--color-info))]/80">
          Defines how the AI remembers and organizes information over time
        </p>
      </div>

      {/* Hot Memory (Operational) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-destructive-light))] rounded-lg flex items-center justify-center">
            <span className="text-[hsl(var(--color-destructive))] font-bold text-sm">🔥</span>
          </div>
          <Label htmlFor="hotMemory" className="text-sm sm:text-base font-semibold">
            {t('hotMemory')}
          </Label>
        </div>
        <Textarea
          id="hotMemory"
          value={role.hotMemory}
          onChange={(e) => onChange({ hotMemory: e.target.value })}
          placeholder="Recent conversations, current user goals, immediate needs, last 24 hours of interaction"
          rows={3}
          className="text-sm sm:text-base resize-none"
        />
        <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
          Stores information from last 24-48 hours
        </p>
      </div>

      {/* Warm Memory (Medium-term) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-warning-light))] rounded-lg flex items-center justify-center">
            <span className="text-[hsl(var(--color-warning))] font-bold text-sm">🌡️</span>
          </div>
          <Label htmlFor="warmMemory" className="text-sm sm:text-base font-semibold">
            {t('warmMemory')}
          </Label>
        </div>
        <Textarea
          id="warmMemory"
          value={role.warmMemory}
          onChange={(e) => onChange({ warmMemory: e.target.value })}
          placeholder="Progress on goals, pattern recognition, user preferences, last 2 weeks of data"
          rows={3}
          className="text-sm sm:text-base resize-none"
        />
        <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
          Stores information from last 1-2 weeks
        </p>
      </div>

      {/* Cold Memory (Long-term) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[hsl(var(--color-info-light))] rounded-lg flex items-center justify-center">
            <span className="text-[hsl(var(--color-info))] font-bold text-sm">❄️</span>
          </div>
          <Label htmlFor="coldMemory" className="text-sm sm:text-base font-semibold">
            {t('coldMemory')}
          </Label>
        </div>
        <Textarea
          id="coldMemory"
          value={role.coldMemory}
          onChange={(e) => onChange({ coldMemory: e.target.value })}
          placeholder="Archived conversations, long-term patterns, historical data, compressed insights"
          rows={3}
          className="text-sm sm:text-base resize-none"
        />
        <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
          Archived data older than 1 month, highly compressed
        </p>
      </div>

      {/* Memory Strategy */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-sm sm:text-base font-semibold">{t('memoryStrategy')}</Label>
        <RadioGroup
          value={role.memoryStrategy}
          onValueChange={(value) => onChange({ memoryStrategy: value as MemoryStrategy })}
          className="space-y-2 sm:space-y-3"
        >
          {memoryStrategies.map((strategy) => (
            <div
              key={strategy.value}
              className={`flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                role.memoryStrategy === strategy.value
                  ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/5'
                  : 'border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))]/30'
              }`}
              onClick={() => onChange({ memoryStrategy: strategy.value })}
            >
              <RadioGroupItem
                value={strategy.value}
                id={`strategy-${strategy.value}`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <div className="text-[hsl(var(--color-foreground))]/70">{strategy.icon}</div>
                  <Label
                    htmlFor={`strategy-${strategy.value}`}
                    className="cursor-pointer text-xs sm:text-sm font-medium"
                  >
                    {strategy.label}
                  </Label>
                </div>
                <p className="text-xs text-[hsl(var(--color-muted-foreground))]">{strategy.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Emotional States */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm sm:text-base font-semibold">{t('emotionalStates')}</Label>
          <span className="text-xs sm:text-sm text-[hsl(var(--color-muted-foreground))]">
            {role.emotionalStates.length} {t('states')}
          </span>
        </div>

        <div className="space-y-2">
          {role.emotionalStates.map((state, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[hsl(var(--color-primary-light))] border border-[hsl(var(--color-primary))]/30 rounded-lg p-2 sm:p-3"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[hsl(var(--color-primary))] text-sm">💭</span>
                <span className="text-xs sm:text-sm font-medium">{state}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeState(index)}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-[hsl(var(--color-destructive))] hover:text-[hsl(var(--color-destructive-hover))] hover:bg-[hsl(var(--color-destructive))]/5"
              >
                <X className="w-2 h-2 sm:w-3 sm:h-3" />
              </Button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addState()}
              placeholder={t('addState') || 'Add emotional state (e.g., Confident, Anxious, Hopeful)'}
              className="flex-1 text-sm sm:text-base"
            />
            <Button
              onClick={addState}
              size="sm"
              className="gap-1 sm:gap-2"
              disabled={!newState.trim()}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('addState')}
            </Button>
          </div>
        </div>

        <div className="text-xs text-[hsl(var(--color-muted-foreground))]">
          {t('emotionalStatesHint') || 'Track these emotional states to better understand user needs'}
        </div>
      </div>
    </div>
  );
};