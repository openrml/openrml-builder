import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/language.context';
import { useNavigation } from '../../contexts/navigation.context';
import { useRoleEditor } from '../../contexts/role-editor.context';
import { useStorage } from '../../contexts/storage.context';
import {
  ImportRMLUseCase,
  ImportRMLOutputV2,
  StepKey,
} from '../../../application/use-cases/import-rml.use-case';
import { ExportRMLUseCase } from '../../../application/use-cases/export-rml.use-case';
import { SaveRoleUseCase } from '../../../application/use-cases/save-role.use-case';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Save, FileDown, FileUp, Home, Check, AlertTriangle, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

// Импортируем шаги
import { Step1Base } from './steps/Step1Base';
import { Step2Portrait } from './steps/Step2Portrait';
import { Step3Behavior } from './steps/Step3Behavior';
import { Step4Expertise } from './steps/Step4Expertise';
import { Step5Journey } from './steps/Step5Journey';
import { Step6Team } from './steps/Step6Team';
import { Step7Memory } from './steps/Step7Memory';
import { Step8Ethics } from './steps/Step8Ethics';
import { LivePreview } from './LivePreview';
import { ImportModal } from './ImportModal';

export const Constructor: React.FC = () => {
  const { t } = useLanguage();
  const { setView } = useNavigation();
  const { currentRole, updateRole, currentStep, setCurrentStep, nextStep, prevStep, validateCurrentStep } = useRoleEditor();
  const { saveRole } = useStorage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting]     = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult]   = useState<ImportRMLOutputV2 | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPreview, setShowPreview]     = useState(window.innerWidth > 1024);

  const totalSteps = 8;
  const progress   = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, label: t('step1') || 'Base Info',  component: Step1Base },
    { number: 2, label: t('step2') || 'Portrait',   component: Step2Portrait },
    { number: 3, label: t('step3') || 'Behavior',   component: Step3Behavior },
    { number: 4, label: t('step4') || 'Expertise',  component: Step4Expertise },
    { number: 5, label: t('step5') || 'Journey',    component: Step5Journey },
    { number: 6, label: t('step6') || 'Team',       component: Step6Team },
    { number: 7, label: t('step7') || 'Memory',     component: Step7Memory },
    { number: 8, label: t('step8') || 'Ethics',     component: Step8Ethics },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  // Обработчик изменения размера окна
  React.useEffect(() => {
    const handleResize = () => {
      setShowPreview(window.innerWidth > 1024);
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    try {
      const useCase = new SaveRoleUseCase();
      const result  = await useCase.execute({ role: currentRole });

      if (result.success) {
        await saveRole(result.savedRole);
        toast.success(`${t('roleSaved') || 'Role saved'}: ${currentRole.name}`);
      } else {
        toast.error(t('saveError') || 'Save error', {
          description: result.errors.join(', '),
        });
      }
    } catch {
      toast.error(t('saveError') || 'Save error');
    }
  };

  const handleExport = () => {
    const useCase = new ExportRMLUseCase();
    useCase.execute({ role: currentRole, download: true });
    toast.success(`${t('roleExported') || 'Role exported'}: ${currentRole.name}`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const content = await file.text();
      const useCase = new ImportRMLUseCase();
      // Используем executeBySteps() для получения данных по шагам
      const result  = useCase.executeBySteps({ fileContent: content });

      setImportResult(result);
      setShowImportModal(true);

      if (!result.isValid) {
        toast.error(t('importError') || 'Import error', {
          description: result.errors[0],
        });
      }
    } catch {
      toast.error(t('importError') || 'Import error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Принимает режим и набор выбранных шагов от ImportModal
  const handleImportConfirm = (
    mode: 'full' | 'steps',
    selectedSteps: Set<StepKey>,
  ) => {
    if (!importResult?.isValid || !importResult.role) return;

    if (mode === 'full') {
      // Старое поведение: полная замена роли
      updateRole(importResult.role);
      setCurrentStep(1);
      toast.success(`${t('importSuccess') || 'Import success'}: ${importResult.role.name}`);
    } else {
      // Новое: применяем только поля выбранных шагов, остальное не трогаем
      const partialUpdate = ImportRMLUseCase.mergeSelectedSteps(
        currentRole,
        importResult.steps,
        selectedSteps,
      );
      updateRole(partialUpdate);

      // Переходим к первому из выбранных шагов
      const firstStep = Math.min(...Array.from(selectedSteps)) as StepKey;
      setCurrentStep(firstStep);

      const stepLabels = importResult.steps
        .filter(s => selectedSteps.has(s.step))
        .map(s => s.label)
        .join(', ');

      toast.success(
        `${t('importSuccess') || 'Import success'}: ${importResult.role.name}`,
        { description: `Steps applied: ${stepLabels}` },
      );
    }

    setShowImportModal(false);
    setImportResult(null);
  };

  const handleFinish = async () => {
    if (validateCurrentStep()) {
      await handleSave();
      setView('dashboard');
      toast.success(`${t('roleCompleted') || 'Role completed'}: ${currentRole.name}`);
    } else {
      toast.error(t('validationError') || 'Validation error', {
        description: t('pleaseCompleteRequiredFields') || 'Please complete required fields',
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-from))] via-[hsl(var(--gradient-via))] to-[hsl(var(--gradient-to))]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[hsl(var(--color-border))]/50 bg-[hsl(var(--color-background))]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[hsl(var(--color-background))]/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          {/* Верхняя строка */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('dashboard')}
                className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('backToDashboard') || 'Back to Dashboard'}</span>
                <span className="inline sm:hidden">Back</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-8 px-2"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>

            <div className="text-xs sm:text-sm font-medium text-[hsl(var(--color-muted-foreground))]">
              {t('step') || 'Step'} {currentStep} {t('of') || 'of'} {totalSteps}
            </div>

            <div className="flex gap-1 sm:gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.rml.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportClick}
                className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">{t('importing') || 'Importing'}</span>
                    <span className="sm:hidden">Imp</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('import') || 'Import'}</span>
                    <span className="sm:hidden">Imp</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
              >
                <FileDown className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('export') || 'Export'}</span>
                <span className="sm:hidden">Exp</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden h-8 w-8 p-0"
              >
                {showPreview ? '📱' : '👁️'}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-3 sm:mb-4">
            <Progress value={progress} className="h-1.5 sm:h-2" />
            <div className="flex justify-between text-xs sm:text-sm text-[hsl(var(--color-muted-foreground))]">
              <span>{Math.round(progress)}% {t('completed') || 'completed'}</span>
              <span className="font-medium text-[hsl(var(--color-primary))] truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                {currentRole.name || t('untitledRole') || 'Untitled Role'}
              </span>
            </div>
          </div>

          {/* Step Navigation — Desktop */}
          <div className="hidden lg:flex gap-2 mt-4 overflow-x-auto pb-2">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  currentStep === step.number
                    ? 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))]'
                    : currentStep > step.number
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))]'
                }`}
              >
                {step.number}. {step.label}
              </button>
            ))}
          </div>

          {/* Step Navigation — Mobile */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-3 p-3 bg-[hsl(var(--color-background))] border rounded-lg shadow-lg">
              <div className="grid grid-cols-2 gap-2">
                {steps.map((step) => (
                  <button
                    key={step.number}
                    onClick={() => {
                      setCurrentStep(step.number);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      currentStep === step.number
                        ? 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))]'
                        : currentStep > step.number
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))]'
                    }`}
                  >
                    {step.number}. {step.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportResult(null);
        }}
        importResult={importResult}
        onConfirm={handleImportConfirm}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
        <div className={`grid ${showPreview ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4 sm:gap-6 lg:gap-8`}>
          {/* Left: Form */}
          <div className={`bg-[hsl(var(--color-background))] rounded-lg shadow-sm border-2 border-[hsl(var(--color-border))] p-4 sm:p-6 lg:p-8 ${
            showPreview ? 'md:order-1' : ''
          }`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[hsl(var(--color-foreground))]">
                {t('step') || 'Step'} {currentStep}: {steps[currentStep - 1]?.label}
              </h2>

              {!validateCurrentStep() && (
                <div className="flex items-center gap-1 sm:gap-2 text-amber-600 text-xs sm:text-sm">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t('requiredFieldsMissing') || 'Required fields missing'}</span>
                  <span className="inline sm:hidden">Required</span>
                </div>
              )}
            </div>

            <CurrentStepComponent role={currentRole} onChange={updateRole} />

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="gap-1 sm:gap-2 order-2 sm:order-1"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t('previous') || 'Previous'}
                </Button>
              )}

              <div className="flex gap-2 sm:gap-3 order-1 sm:order-2 sm:ml-auto">
                <Button onClick={handleSave} variant="outline" className="gap-1 sm:gap-2">
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t('save') || 'Save'}</span>
                  <span className="inline sm:hidden">Save</span>
                </Button>

                <Button
                  variant={currentStep < totalSteps ? 'default' : 'success'}
                  onClick={currentStep < totalSteps ? nextStep : handleFinish}
                  disabled={!validateCurrentStep()}
                  className="gap-1 sm:gap-2"
                >
                  {currentStep < totalSteps ? (
                    <>
                      <span className="hidden sm:inline">{t('next') || 'Next'}</span>
                      <span className="inline sm:hidden">Next</span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                  ) : (
                    <>
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{t('finish') || 'Finish'}</span>
                      <span className="inline sm:hidden">Done</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          {showPreview && (
            <div className="md:sticky md:top-24 h-fit max-h-[calc(100vh-8rem)] md:order-2">
              <LivePreview role={currentRole} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};