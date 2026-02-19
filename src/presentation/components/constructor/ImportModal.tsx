// src/presentation/components/constructor/ImportModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  X, AlertTriangle, Check,
  Shield, FileText, Layers, ChevronRight,
} from 'lucide-react';
import { LicenseBadge } from './licensing/LicenseBadge';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { ImportRMLOutputV2, StepKey, StepImportData } from '../../../application/use-cases/import-rml.use-case';

type ImportMode = 'full' | 'steps';

// Метаданные для каждого шага: иконка и краткое описание полей
const STEP_META: Record<StepKey, { emoji: string; shortDesc: string }> = {
  1: { emoji: '⚙️', shortDesc: 'Name, archetype, category, version' },
  2: { emoji: '🎨', shortDesc: 'Age, visual style, environment' },
  3: { emoji: '🧠', shortDesc: 'Greeting, tone, personality traits' },
  4: { emoji: '📚', shortDesc: 'Expertise areas, tools, output formats' },
  5: { emoji: '🗺️', shortDesc: 'Sessions, journey pacing' },
  6: { emoji: '👥', shortDesc: 'Team mode, sub-roles, orchestrator' },
  7: { emoji: '💾', shortDesc: 'Hot / warm / cold memory' },
  8: { emoji: '⚖️', shortDesc: 'Ethical rules, disclaimer, license' },
};

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Расширенный результат с разбивкой по шагам (или null пока файл не выбран) */
  importResult: ImportRMLOutputV2 | null;
  /** Вызывается с выбранным режимом и набором шагов для применения */
  onConfirm: (mode: ImportMode, selectedSteps: Set<StepKey>) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  importResult,
  onConfirm,
}) => {
  const [mode, setMode] = useState<ImportMode>('full');
  const [selectedSteps, setSelectedSteps] = useState<Set<StepKey>>(new Set());

  // При открытии нового файла: сброс к "все шаги с данными выбраны"
  useEffect(() => {
    if (importResult) {
      setSelectedSteps(
        new Set(importResult.steps.filter(s => s.hasData).map(s => s.step))
      );
      setMode('full');
    }
  }, [importResult]);

  if (!isOpen) return null;

  const role        = importResult?.role;
  const hasWarnings = (importResult?.warnings?.length ?? 0) > 0;
  const hasErrors   = (importResult?.errors?.length ?? 0) > 0;

  // ── Хелперы статус-баннера ────────────────────────────────────────────────────

  const getStatusIcon = () => {
    if (!importResult?.isValid) return <X className="w-5 h-5 text-[hsl(var(--color-destructive))]" />;
    if (hasErrors)              return <AlertTriangle className="w-5 h-5 text-[hsl(var(--color-destructive))]" />;
    if (hasWarnings)            return <AlertTriangle className="w-5 h-5 text-[hsl(var(--color-warning))]" />;
    return <Check className="w-5 h-5 text-[hsl(var(--color-success))]" />;
  };

  const getStatusColor = () => {
    if (!importResult?.isValid || hasErrors) return 'bg-[hsl(var(--color-destructive-light))] border-[hsl(var(--color-destructive))]/30';
    if (hasWarnings)                         return 'bg-[hsl(var(--color-warning-light))] border-[hsl(var(--color-warning))]/30';
    return 'bg-[hsl(var(--color-success-light))] border-[hsl(var(--color-success))]/30';
  };

  const getStatusTitle = () => {
    if (!importResult?.isValid) return 'Import Failed';
    if (hasErrors)              return 'Import Failed';
    if (hasWarnings)            return 'Ready with Warnings';
    return 'Ready to Import';
  };

  // ── Управление выбором шагов ──────────────────────────────────────────────────

  const toggleStep = (step: StepKey) => {
    setSelectedSteps(prev => {
      const next = new Set(prev);
      next.has(step) ? next.delete(step) : next.add(step);
      return next;
    });
  };

  const toggleAll = () => {
    const allAvailable = (importResult?.steps ?? [])
      .filter(s => s.hasData)
      .map(s => s.step);
    setSelectedSteps(
      selectedSteps.size === allAvailable.length
        ? new Set()
        : new Set(allAvailable)
    );
  };

  const availableCount = (importResult?.steps ?? []).filter(s => s.hasData).length;
  const allSelected    = selectedSteps.size === availableCount && availableCount > 0;
  const canConfirm     = importResult?.isValid && (mode === 'full' || selectedSteps.size > 0);

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-[hsl(var(--color-background))]/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[hsl(var(--color-background))] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-[hsl(var(--color-border))] flex items-center justify-between bg-gradient-to-r from-[hsl(var(--color-muted))] to-[hsl(var(--color-background))]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[hsl(var(--color-primary-light))] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[hsl(var(--color-primary))]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))]">Import Role</h3>
              <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Review imported role details</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {importResult && role && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {/* Status Banner */}
            <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
              <div className="flex items-start gap-3">
                {getStatusIcon()}
                <div className="flex-1">
                  <div className="font-medium">{getStatusTitle()}</div>
                  <div className="text-sm mt-1 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{role.name || 'Unnamed Role'}</span>
                    <Badge variant={role.status === 'published' ? 'default' : 'secondary'}>
                      {role.status || 'draft'}
                    </Badge>
                    <Badge variant="outline">v{role.version || '0.9.0'}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* License Preview */}
            {role.license && (
              <Card className="border-[hsl(var(--color-primary))]/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-[hsl(var(--color-primary))]" />
                    <h4 className="text-sm font-semibold">License</h4>
                  </div>
                  <LicenseBadge licenseInfo={role.license} compact />
                </CardContent>
              </Card>
            )}

            {/* ── Import Mode Toggle ── */}
            <div>
              <p className="text-sm font-semibold text-[hsl(var(--color-foreground))]/80 mb-2">Import mode</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('full')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    mode === 'full'
                      ? 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] border-[hsl(var(--color-primary))] shadow-sm'
                      : 'bg-[hsl(var(--color-background))] text-[hsl(var(--color-muted-foreground))] border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))]/30'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Import everything
                </button>
                <button
                  onClick={() => setMode('steps')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    mode === 'steps'
                      ? 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] border-[hsl(var(--color-primary))] shadow-sm'
                      : 'bg-[hsl(var(--color-background))] text-[hsl(var(--color-muted-foreground))] border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))]/30'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Choose steps
                </button>
              </div>
            </div>

            {/* ── Step Selector (только в режиме steps) ── */}
            {mode === 'steps' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                    {selectedSteps.size} of {availableCount} steps selected
                  </p>
                  <button
                    onClick={toggleAll}
                    className="text-xs text-[hsl(var(--color-primary))] hover:underline"
                  >
                    {allSelected ? 'Deselect all' : 'Select all'}
                  </button>
                </div>

                <div className="space-y-2">
                  {importResult.steps.map((stepData: StepImportData) => {
                    const meta       = STEP_META[stepData.step];
                    const isSelected = selectedSteps.has(stepData.step);
                    const isDisabled = !stepData.hasData;

                    return (
                      <label
                        key={stepData.step}
                        className={`flex items-center gap-3 p-3 rounded-lg border select-none transition-all ${
                          isDisabled
                            ? 'opacity-40 cursor-not-allowed bg-[hsl(var(--color-muted))] border-[hsl(var(--color-border))]'
                            : isSelected
                            ? 'bg-[hsl(var(--color-primary-light))] border-[hsl(var(--color-primary))]/30 cursor-pointer'
                            : 'bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-border))]/80 cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => !isDisabled && toggleStep(stepData.step)}
                          className="rounded accent-[hsl(var(--color-primary))]"
                        />
                        <span className="text-xl leading-none">{meta.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[hsl(var(--color-foreground))]">
                            Step {stepData.step}: {stepData.label}
                          </div>
                          <div className="text-xs text-[hsl(var(--color-muted-foreground))] truncate">
                            {isDisabled ? 'No data in file' : meta.shortDesc}
                          </div>
                        </div>
                        {stepData.warnings.length > 0 && (
                          <div
                            title={stepData.warnings.join('\n')}
                            className="flex items-center gap-1 text-[hsl(var(--color-warning))] flex-shrink-0"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="text-xs">{stepData.warnings.length}</span>
                          </div>
                        )}
                        {isSelected && !isDisabled && (
                          <ChevronRight className="w-4 h-4 text-[hsl(var(--color-primary))]/50 flex-shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {selectedSteps.size === 0 && (
                  <p className="text-xs text-center text-[hsl(var(--color-muted-foreground))] mt-3">
                    Select at least one step to import
                  </p>
                )}
              </div>
            )}

            {/* ── Tabs: Warnings / Details ── */}
            <Tabs defaultValue="warnings" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="warnings" className="relative">
                  Warnings
                  {hasWarnings && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[hsl(var(--color-warning))] rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="details">Role Details</TabsTrigger>
              </TabsList>

              {/* Warnings Tab */}
              <TabsContent value="warnings" className="space-y-3 mt-4">
                {importResult.errors?.map((error: string, index: number) => (
                  <div
                    key={`error-${index}`}
                    className="flex items-start gap-2 text-sm p-3 bg-[hsl(var(--color-destructive-light))] border border-[hsl(var(--color-destructive))]/30 rounded-lg"
                  >
                    <X className="w-4 h-4 text-[hsl(var(--color-destructive))] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium text-[hsl(var(--color-destructive))]">Error:</span>
                      <span className="text-[hsl(var(--color-destructive))]/80 ml-2">{error}</span>
                    </div>
                  </div>
                ))}

                {importResult.warnings?.map((warning: string, index: number) => (
                  <div
                    key={`warning-${index}`}
                    className="flex items-start gap-2 text-sm p-3 bg-[hsl(var(--color-warning-light))] border border-[hsl(var(--color-warning))]/30 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 text-[hsl(var(--color-warning))] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium text-[hsl(var(--color-warning))]">Warning:</span>
                      <span className="text-[hsl(var(--color-warning))]/80 ml-2">{warning}</span>
                    </div>
                  </div>
                ))}

                {!hasErrors && !hasWarnings && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Check className="w-12 h-12 text-[hsl(var(--color-success))] mb-3" />
                    <h4 className="font-medium text-[hsl(var(--color-success))]">No Issues Found</h4>
                    <p className="text-sm text-[hsl(var(--color-success))]/80 mt-1">
                      Role parsed successfully with all validations passed
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Role Details Tab */}
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-[hsl(var(--color-muted-foreground))]">Archetype</dt>
                        <dd className="font-medium mt-1 capitalize">{role.archetype}</dd>
                      </div>
                      <div>
                        <dt className="text-[hsl(var(--color-muted-foreground))]">Category</dt>
                        <dd className="font-medium mt-1 capitalize">{role.category || 'productivity'}</dd>
                      </div>
                      <div>
                        <dt className="text-[hsl(var(--color-muted-foreground))]">Role Type</dt>
                        <dd className="font-medium mt-1 capitalize">{role.roleType}</dd>
                      </div>
                      <div>
                        <dt className="text-[hsl(var(--color-muted-foreground))]">Response Length</dt>
                        <dd className="font-medium mt-1">{role.responseLength}/7</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-[hsl(var(--color-muted-foreground))]">Description</dt>
                        <dd className="font-medium mt-1">{role.description || '—'}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-[hsl(var(--color-muted-foreground))]">Main Goal</dt>
                        <dd className="font-medium mt-1">{role.mainGoal || '—'}</dd>
                      </div>
                      {role.tags && role.tags.length > 0 && (
                        <div className="col-span-2">
                          <dt className="text-[hsl(var(--color-muted-foreground))]">Tags</dt>
                          <dd className="flex flex-wrap gap-1 mt-1">
                            {role.tags.map((tag: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </dd>
                        </div>
                      )}
                      {role.license && (
                        <div className="col-span-2">
                          <dt className="text-[hsl(var(--color-muted-foreground))]">License</dt>
                          <dd className="font-medium mt-1">{role.license.type}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-muted))] flex items-center justify-between gap-3">
          <div className="text-xs text-[hsl(var(--color-muted-foreground))]">
            {mode === 'steps' && canConfirm && (
              <>Importing {selectedSteps.size} step{selectedSteps.size !== 1 ? 's' : ''}</>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="gap-2">
              Cancel
            </Button>
            {importResult?.isValid && (
              <Button
                onClick={() => onConfirm(mode, selectedSteps)}
                disabled={!canConfirm}
                className="gap-2 bg-[hsl(var(--color-success))] hover:bg-[hsl(var(--color-success-hover))] text-[hsl(var(--color-success-foreground))] disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {mode === 'full'
                  ? 'Import Role'
                  : `Import ${selectedSteps.size} step${selectedSteps.size !== 1 ? 's' : ''}`
                }
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};