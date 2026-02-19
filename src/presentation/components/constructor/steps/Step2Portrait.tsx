import React from 'react';
import { Role, VisualStyle, Environment, ImageStyle, Lighting } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface Step2PortraitProps {
  role: Role;
  onChange: (updates: Partial<Role>) => void;
}

export const Step2Portrait: React.FC<Step2PortraitProps> = ({ role, onChange }) => {
  const { t } = useLanguage();

  const visualStyles: { value: VisualStyle; label: string }[] = [
    { value: 'professional', label: t('professionalStyle') },
    { value: 'casual', label: t('casualStyle') },
    { value: 'creative', label: t('creativeStyle') },
    { value: 'academic', label: t('academicStyle') },
  ];

  const environments: { value: Environment; emoji: string; label: string }[] = [
    { value: 'office', emoji: '🏢', label: t('office') },
    { value: 'hospital', emoji: '🏥', label: t('hospital') },
    { value: 'business', emoji: '👔', label: t('business') },
    { value: 'library', emoji: '📚', label: t('library') },
    { value: 'studio', emoji: '🎨', label: t('studio') },
    { value: 'home', emoji: '🏠', label: t('home') },
    { value: 'digital', emoji: '💻', label: t('digital') },
  ];

  const imageStyles: { value: ImageStyle; label: string }[] = [
    { value: 'portrait', label: t('portrait') },
    { value: 'professional', label: t('professionalPhoto') },
    { value: 'illustration', label: t('illustration') },
    { value: 'digital-art', label: t('digitalArt') },
  ];

  const lightingOptions: { value: Lighting; label: string }[] = [
    { value: 'natural', label: t('natural') },
    { value: 'studio', label: t('studioLight') },
    { value: 'soft', label: t('soft') },
    { value: 'dramatic', label: t('dramatic') },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Personal Data */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-[hsl(var(--color-foreground))] mb-3 sm:mb-4">{t('personalData')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">{t('name')}</Label>
            <Input
              id="name"
              value={role.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Alex"
              className="text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm sm:text-base">{t('age')}</Label>
            <Input
              id="age"
              value={role.age}
              onChange={(e) => onChange({ age: e.target.value })}
              placeholder="35-50"
              className="text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Visual Style */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-[hsl(var(--color-foreground))] mb-3 sm:mb-4">{t('visualStyle')}</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          {visualStyles.map(style => (
            <button
              key={style.value}
              onClick={() => onChange({ visualStyle: style.value })}
              className={`p-2 sm:p-3 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all ${
                role.visualStyle === style.value
                  ? 'border-indigo-600 bg-[hsl(var(--color-primary))]/5 text-[hsl(var(--color-primary-active))]'
                  : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] text-slate-700 hover:border-[hsl(var(--color-primary))]/30'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visualDetails" className="text-sm sm:text-base">{t('keyDetails')}</Label>
            <Input
              id="visualDetails"
              value={role.visualDetails}
              onChange={(e) => onChange({ visualDetails: e.target.value })}
              placeholder="glasses, neat beard, warm smile"
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visualAccent" className="text-sm sm:text-base">{t('visualAccent')}</Label>
            <Input
              id="visualAccent"
              value={role.visualAccent}
              onChange={(e) => onChange({ visualAccent: e.target.value })}
              placeholder="confident posture, direct eye contact"
              className="text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Environment */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-[hsl(var(--color-foreground))] mb-3 sm:mb-4">{t('environment')}</h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
          {environments.map(env => (
            <button
              key={env.value}
              onClick={() => onChange({ environment: env.value })}
              className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                role.environment === env.value
                  ? 'border-indigo-600 bg-[hsl(var(--color-primary))]/5'
                  : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] hover:border-[hsl(var(--color-primary))]/30'
              }`}
              title={env.label}
            >
              <div className="text-xl sm:text-2xl">{env.emoji}</div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="atmosphere" className="text-sm sm:text-base">{t('atmosphere')}</Label>
          <Input
            id="atmosphere"
            value={role.atmosphere}
            onChange={(e) => onChange({ atmosphere: e.target.value })}
            placeholder="Professional, inviting, creative..."
            className="text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Technical Details */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-[hsl(var(--color-foreground))] mb-3 sm:mb-4">{t('technical')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">{t('imageStyle')}</Label>
            <div className="space-y-2">
              {imageStyles.map(style => (
                <button
                  key={style.value}
                  onClick={() => onChange({ imageStyle: style.value })}
                  className={`w-full p-2 sm:p-2 rounded border text-xs sm:text-sm text-left transition-all ${
                    role.imageStyle === style.value
                      ? 'border-indigo-600 bg-[hsl(var(--color-primary))]/5 text-[hsl(var(--color-primary-active))]'
                      : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] text-slate-700 hover:border-[hsl(var(--color-primary))]/30'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">{t('lighting')}</Label>
            <div className="space-y-2">
              {lightingOptions.map(light => (
                <button
                  key={light.value}
                  onClick={() => onChange({ lighting: light.value })}
                  className={`w-full p-2 sm:p-2 rounded border text-xs sm:text-sm text-left transition-all ${
                    role.lighting === light.value
                      ? 'border-indigo-600 bg-[hsl(var(--color-primary))]/5 text-[hsl(var(--color-primary-active))]'
                      : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] text-slate-700 hover:border-[hsl(var(--color-primary))]/30'
                  }`}
                >
                  {light.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};