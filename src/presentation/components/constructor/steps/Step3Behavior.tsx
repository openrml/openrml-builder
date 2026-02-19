import React, { useState } from 'react';
import { Role, Tone, EmotionalRange } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Slider } from '../../ui/slider';
import { Button } from '../../ui/button';
import { Plus, X } from 'lucide-react';

interface Step3BehaviorProps {
  role: Role;
  onChange: (updates: Partial<Role>) => void;
}

export const Step3Behavior: React.FC<Step3BehaviorProps> = ({ role, onChange }) => {
  const { t } = useLanguage();
  const [newShouldDo, setNewShouldDo] = useState('');
  const [newShouldNotDo, setNewShouldNotDo] = useState('');

  const tones: { value: Tone; label: string }[] = [
    { value: 'professional', label: t('professionalTone') || 'Professional' },
    { value: 'friendly', label: t('friendlyTone') || 'Friendly' },
    { value: 'formal', label: t('formalTone') || 'Formal' },
    { value: 'informal', label: t('informalTone') || 'Informal' },
    { value: 'empathetic', label: t('empatheticTone') || 'Empathetic' },
    { value: 'enthusiastic', label: t('enthusiasticTone') || 'Enthusiastic' },
  ];

  const emotionalRanges: { value: EmotionalRange; label: string }[] = [
    { value: 'minimal', label: t('minimal') || 'Minimal' },
    { value: 'moderate', label: t('moderate') || 'Moderate' },
    { value: 'expressive', label: t('expressive') || 'Expressive' },
  ];

  const addShouldDo = () => {
    if (newShouldDo.trim()) {
      onChange({ shouldDo: [...role.shouldDo, newShouldDo.trim()] });
      setNewShouldDo('');
    }
  };

  const removeShouldDo = (index: number) => {
    onChange({ shouldDo: role.shouldDo.filter((_, i) => i !== index) });
  };

  const addShouldNotDo = () => {
    if (newShouldNotDo.trim()) {
      onChange({ shouldNotDo: [...role.shouldNotDo, newShouldNotDo.trim()] });
      setNewShouldNotDo('');
    }
  };

  const removeShouldNotDo = (index: number) => {
    onChange({ shouldNotDo: role.shouldNotDo.filter((_, i) => i !== index) });
  };

  const updatePersonality = (key: keyof typeof role.personality, value: number) => {
    onChange({
      personality: {
        ...role.personality,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Greeting */}
      <div className="space-y-2">
        <Label htmlFor="greeting" className="text-sm sm:text-base font-semibold">
          {t('greeting') || 'Greeting'} *
        </Label>
        <Textarea
          id="greeting"
          value={role.greeting}
          onChange={(e) => onChange({ greeting: e.target.value })}
          placeholder="Hi! I'm your career coach Alex. Let's find your ideal job together!"
          rows={3}
          className="text-sm sm:text-base resize-none"
        />
      </div>

      {/* Tone & Emotional Range - ВЕРТИКАЛЬНО */}
      <div className="space-y-4 sm:space-y-6">
        {/* Base Tone */}
        <div className="space-y-2 sm:space-y-3">
          <Label className="text-sm sm:text-base font-semibold">{t('baseTone') || 'Base Tone'} *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tones.map(tone => (
              <button
                key={tone.value}
                onClick={() => onChange({ tone: tone.value })}
                className={`p-3 rounded-lg border text-sm text-center transition-all min-h-[60px] flex items-center justify-center whitespace-normal ${
                  role.tone === tone.value
                    ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary-active))] font-medium'
                    : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] hover:border-[hsl(var(--color-primary))]/40 hover:bg-[hsl(var(--color-primary))]/5'
                }`}
                title={tone.label}
              >
                <span className="line-clamp-2">{tone.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emotional Range */}
        <div className="space-y-2 sm:space-y-3">
          <Label className="text-sm sm:text-base font-semibold">{t('emotionalRange') || 'Emotional Range'} *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {emotionalRanges.map(range => (
              <button
                key={range.value}
                onClick={() => onChange({ emotionalRange: range.value })}
                className={`p-4 rounded-lg border text-base text-center transition-all min-h-[70px] flex flex-col items-center justify-center ${
                  role.emotionalRange === range.value
                    ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary-active))] font-medium shadow-sm'
                    : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] hover:border-[hsl(var(--color-primary))]/40 hover:bg-[hsl(var(--color-primary))]/5'
                }`}
              >
                <span className="text-lg mb-1">
                  {range.value === 'minimal' ? '😐' : range.value === 'moderate' ? '🙂' : '😄'}
                </span>
                <span className="font-medium">{range.label}</span>
                <span className="text-xs text-[hsl(var(--color-muted-foreground))] mt-1">
                  {range.value === 'minimal' 
                    ? 'Neutral, focused' 
                    : range.value === 'moderate' 
                    ? 'Balanced, warm' 
                    : 'Expressive, animated'
                  }
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div>
        <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
          {t('personalityTraits') || 'Personality Traits'}
        </Label>
        <div className="space-y-3 sm:space-y-4">
          {[
            { key: 'creativity' as const, label: t('creativity') || 'Creativity', emoji: '🎨' },
            { key: 'formality' as const, label: t('formality') || 'Formality', emoji: '👔' },
            { key: 'empathy' as const, label: t('empathy') || 'Empathy', emoji: '❤️' },
            { key: 'assertiveness' as const, label: t('assertiveness') || 'Assertiveness', emoji: '💪' },
            { key: 'patience' as const, label: t('patience') || 'Patience', emoji: '⏳' },
          ].map(trait => (
            <div key={trait.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{trait.emoji}</span>
                  <Label className="text-sm sm:text-base font-medium">{trait.label}</Label>
                </div>
                <span className="text-sm sm:text-base font-semibold text-[hsl(var(--color-primary))]">
                  {role.personality[trait.key]}/10
                </span>
              </div>
              <Slider
                value={[role.personality[trait.key]]}
                onValueChange={([value]) => updatePersonality(trait.key, value)}
                min={0}
                max={10}
                step={1}
              />
              <div className="flex justify-between text-xs text-[hsl(var(--color-muted-foreground))] px-1">
                <span>{t('low') || 'Low'}</span>
                <span>{t('medium') || 'Medium'}</span>
                <span>{t('high') || 'High'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behavior Rules */}
      <div className="space-y-3 sm:space-y-4">
        <Label className="text-sm sm:text-base font-semibold">
          {t('behaviorRules') || 'Behavior Rules'}
        </Label>
        
        {/* Should Do */}
        <div className="space-y-2 sm:space-y-3">
          <Label className="text-sm font-medium text-[hsl(var(--color-success))]">
            {t('shouldDo') || 'Should Do'}
            <span className="text-xs text-[hsl(var(--color-muted-foreground))] ml-2">
              ({t('positiveBehaviors') || 'Positive behaviors to encourage'})
            </span>
          </Label>
          <div className="space-y-2">
            {role.shouldDo.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-[hsl(var(--color-success))]/5 border border-[hsl(var(--color-success))]/20 rounded-lg p-3">
                <span className="text-[hsl(var(--color-success))] font-bold text-base flex-shrink-0">✓</span>
                <span className="flex-1 text-sm">{item}</span>
                <button
                  onClick={() => removeShouldDo(index)}
                  className="text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-destructive))] flex-shrink-0"
                  aria-label={t('remove') || 'Remove'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newShouldDo}
                onChange={(e) => setNewShouldDo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addShouldDo()}
                placeholder={t('addRulePlaceholder') || "What the role should do (e.g., 'Ask clarifying questions')..."}
                className="flex-1 text-sm sm:text-base"
              />
              <Button 
                onClick={addShouldDo} 
                size="sm" 
                className="gap-2 bg-[hsl(var(--color-success))] hover:bg-[hsl(var(--color-success))]/80"
              >
                <Plus className="w-4 h-4" />
                {t('addRule') || 'Add Rule'}
              </Button>
            </div>
          </div>
        </div>

        {/* Should Not Do */}
        <div className="space-y-2 sm:space-y-3">
          <Label className="text-sm font-medium text-[hsl(var(--color-destructive))]">
            {t('shouldNotDo') || 'Should Not Do'}
            <span className="text-xs text-[hsl(var(--color-muted-foreground))] ml-2">
              ({t('restrictions') || 'Behaviors to avoid'})
            </span>
          </Label>
          <div className="space-y-2">
            {role.shouldNotDo.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-[hsl(var(--color-destructive))]/5 border border-[hsl(var(--color-destructive))]/20 rounded-lg p-3">
                <span className="text-[hsl(var(--color-destructive))] font-bold text-base flex-shrink-0">✗</span>
                <span className="flex-1 text-sm">{item}</span>
                <button
                  onClick={() => removeShouldNotDo(index)}
                  className="text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-destructive))] flex-shrink-0"
                  aria-label={t('remove') || 'Remove'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newShouldNotDo}
                onChange={(e) => setNewShouldNotDo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addShouldNotDo()}
                placeholder={t('addRestrictionPlaceholder') || "What the role should NOT do (e.g., 'Provide medical advice')..."}
                className="flex-1 text-sm sm:text-base"
              />
              <Button 
                onClick={addShouldNotDo} 
                size="sm" 
                variant="outline"
                className="gap-2 border-[hsl(var(--color-destructive))]/30 text-[hsl(var(--color-destructive))] hover:bg-[hsl(var(--color-destructive))]/5"
              >
                <Plus className="w-4 h-4" />
                {t('addRestriction') || 'Add Restriction'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};