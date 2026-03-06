// src/presentation/components/ui/language-badge.tsx

import React from 'react';
import { Badge } from './badge';
import type { Language } from '../../../core/domain/role/enum-display-names';
import { formatLanguageDisplay } from '../../../lib/utils/language-detection';

interface LanguageBadgeProps {
  language: Language;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({ 
  language, 
  variant = 'outline',
  className 
}) => {
  return (
    <Badge variant={variant} className={className}>
      {formatLanguageDisplay(language)}
    </Badge>
  );
};
