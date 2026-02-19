import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Role } from '../../core/domain/role/types';
import { cloneRole } from '../../core/services/role-factory';
import { rmlIdentityService } from '../../core/services/identity.service';
import { FEATURES } from '../../config/features';

interface RoleEditorContextType {
  // Текущая редактируемая роль
  currentRole: Role;

  // Операции с ролью
  updateRole: (updates: Partial<Role>) => void;
  resetRole: () => void;
  cloneCurrentRole: () => Role;

  // Навигация по шагам
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Валидация
  validateCurrentStep: () => boolean;
  getStepErrors: (step: number) => string[];
}

const RoleEditorContext = createContext<RoleEditorContextType | undefined>(undefined);

export function RoleEditorProvider({
  children,
  initialRole,
}: {
  children: React.ReactNode;
  initialRole: Role;
}) {
  const [currentRole, setCurrentRole] = useState<Role>(initialRole);
  const [currentStep, setCurrentStep] = useState(1);

  // Внутреннее состояние Identity — не публикуется в контекст,
  // так как RMLIdentityBadge и другие потребители удалены из UI.
  // Используется только внутри getStepErrors для подсказки в Step 1.
  const [identityValid, setIdentityValid]         = useState<boolean | null>(null);
  const [identityMismatches, setIdentityMismatches] = useState<string[]>([]);

  // Debounce для identity generation — не блокируем UI при каждом keystroke
  const identityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Валидация identity при изменении роли
  useEffect(() => {
    if (!FEATURES.RML_IDENTITY || !currentRole.rmlIdentity?.fullId) {
      setIdentityValid(null);
      setIdentityMismatches([]);
      return;
    }

    const validation = rmlIdentityService.validateIdentity(currentRole);
    setIdentityValid(validation.valid);
    setIdentityMismatches(validation.mismatchedComponents);
  }, [currentRole]);

  const updateRole = useCallback((updates: Partial<Role>) => {
    setCurrentRole(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));

    // Асинхронное обновление identity (не блокируем UI)
    if (FEATURES.RML_IDENTITY) {
      if (identityTimeoutRef.current) {
        clearTimeout(identityTimeoutRef.current);
      }

      identityTimeoutRef.current = setTimeout(() => {
        setCurrentRole(prev => {
          const newIdentity = rmlIdentityService.updateIdentityIfChanged(
            { ...prev, ...updates } as Role,
            { ...prev, ...updates } as Role,
          );

          if (newIdentity) {
            return { ...prev, rmlIdentity: newIdentity };
          }
          return prev;
        });
      }, 500); // Debounce 500ms
    }
  }, []);

  const resetRole = useCallback(() => {
    setCurrentRole(initialRole);
    setCurrentStep(1);
    setIdentityValid(null);
    setIdentityMismatches([]);
  }, [initialRole]);

  const cloneCurrentRole = useCallback((): Role => {
    const cloned = cloneRole(currentRole);
    // Очищаем identity у клона — клон получит новый при первом сохранении
    delete cloned.rmlIdentity;
    delete cloned.identityMetadata;
    return cloned;
  }, [currentRole]);

  const nextStep = useCallback(() => {
    if (currentStep < 8) setCurrentStep(prev => prev + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  const validateCurrentStep = useCallback((): boolean => {
    switch (currentStep) {
      case 1: // Base Information
        return !!(
          currentRole.name?.trim()        &&
          currentRole.description?.trim() &&
          currentRole.mainGoal?.trim()    &&
          currentRole.status              &&
          currentRole.version?.trim()     &&
          currentRole.category
        );

      case 2: // Visual Portrait
        return !!(currentRole.age?.trim() && currentRole.visualDetails?.trim());

      case 3: // Behavior & Tone
        return !!(currentRole.greeting?.trim());

      case 5: // Journey Sessions
        return (
          currentRole.sessions.length > 0 &&
          currentRole.sessions.every(s => s.title.trim() && s.tasks.length > 0)
        );

      case 8: // Ethics
        if (!currentRole.ethicalRules || !Array.isArray(currentRole.ethicalRules)) {
          return false;
        }
        return currentRole.ethicalRules.every(
          rule => rule && typeof rule === 'object' && rule.rule?.trim() && rule.action,
        );

      default:
        return true;
    }
  }, [currentStep, currentRole]);

  const getStepErrors = useCallback((step: number): string[] => {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!currentRole.name?.trim())        errors.push('Role name is required');
        if (!currentRole.description?.trim()) errors.push('Description is required');
        if (!currentRole.mainGoal?.trim())    errors.push('Main goal is required');
        if (!currentRole.status)              errors.push('Status is required');
        if (!currentRole.version?.trim())     errors.push('Version is required');
        if (!currentRole.category)            errors.push('Category is required');
        if (!currentRole.tags || !Array.isArray(currentRole.tags)) {
          errors.push('Tags must be an array');
        }
        break;

      case 2:
        if (!currentRole.age?.trim())          errors.push('Age is required');
        if (!currentRole.visualDetails?.trim()) errors.push('Visual details are required');
        break;

      case 3:
        if (!currentRole.greeting?.trim()) errors.push('Greeting is required');
        break;

      case 5:
        if (currentRole.sessions.length === 0) {
          errors.push('At least one session is required');
        } else {
          currentRole.sessions.forEach((session, index) => {
            if (!session.title.trim()) {
              errors.push(`Session ${index + 1}: Title is required`);
            }
            if (session.tasks.length === 0) {
              errors.push(`Session ${index + 1}: At least one task is required`);
            }
            if (session.outcomes && !Array.isArray(session.outcomes)) {
              errors.push(`Session ${index + 1}: Outcomes must be an array`);
            }
          });
        }
        break;

      case 8:
        if (!currentRole.ethicalRules || !Array.isArray(currentRole.ethicalRules)) {
          errors.push('Ethical rules must be an array');
        } else {
          currentRole.ethicalRules.forEach((rule, index) => {
            if (!rule.rule?.trim()) {
              errors.push(`Ethical rule ${index + 1}: Rule text is required`);
            }
            if (!rule.action) {
              errors.push(`Ethical rule ${index + 1}: Action (warn/stop/refer) is required`);
            }
          });
        }
        break;
    }

    // Подсказка об Identity-расхождении в Step 1
    if (step === 1 && identityValid === false && currentRole.rmlIdentity?.fullId) {
      errors.push(`⚠️ RML Identity mismatch: ${identityMismatches.join(', ')}`);
    }

    return errors;
  }, [currentRole, identityValid, identityMismatches]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (identityTimeoutRef.current) {
        clearTimeout(identityTimeoutRef.current);
      }
    };
  }, []);

  const value: RoleEditorContextType = {
    currentRole,
    updateRole,
    resetRole,
    cloneCurrentRole,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    validateCurrentStep,
    getStepErrors,
  };

  return (
    <RoleEditorContext.Provider value={value}>
      {children}
    </RoleEditorContext.Provider>
  );
}

export function useRoleEditor() {
  const context = useContext(RoleEditorContext);
  if (!context) {
    throw new Error('useRoleEditor must be used within RoleEditorProvider');
  }
  return context;
}