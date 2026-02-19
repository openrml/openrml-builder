import { Role } from '../../core/domain/role/types';
import { createEmptyRole } from '../../core/services/role-factory';

// Health templates
import { mentalHealthTemplate, fitnessCoachTemplate } from './health-templates';
import { nutritionAdvisorTemplate, sleepOptimizerTemplate, stressManagerTemplate } from './health-templates';

// Productivity templates
import { taskManagerTemplate, habitBuilderTemplate } from './productivity-templates';
import { antiProcrastinationTemplate, focusMasterTemplate, memoryCoachTemplate } from './productivity-templates';

// Daily life templates
import { homeOrganizerTemplate, mealPlannerTemplate } from './daily-templates';
import { shoppingAssistantTemplate, minimalismGuideTemplate } from './daily-templates';

// Finance templates
import { financialAdvisorTemplate, savingsCoachTemplate } from './finance-templates';
import { debtManagerTemplate, moneyLiteracyTemplate } from './finance-templates';

// Relationships templates
import { relationshipCoachTemplate, parentingGuideTemplate } from './relationships-templates';
import { familyMediatorTemplate } from './relationships-templates';

// Development templates
import { careerCoachTemplate, languageTutorTemplate } from './development-templates';
import { readingCoachTemplate, creativityMentorTemplate, motivationCoachTemplate } from './development-templates';

// Technology templates
import { digitalAssistantTemplate, securityExpertTemplate } from './technology-templates';
import { appAdvisorTemplate, socialBalanceTemplate } from './technology-templates';

// Entertainment templates
import { astrologyGuideTemplate, tarotReaderTemplate } from './entertainment-templates';
import { numerologyExpertTemplate, matrixDecoderTemplate } from './entertainment-templates';
import { lunarGuideTemplate, crystalHealerTemplate } from './entertainment-templates';

// Map всех шаблонов
const templateMap: Record<string, Partial<Role>> = {
  // Health & Wellbeing
  'mental-health': mentalHealthTemplate,
  'fitness-coach': fitnessCoachTemplate,
  'nutrition-advisor': nutritionAdvisorTemplate,
  'sleep-optimizer': sleepOptimizerTemplate,
  'stress-manager': stressManagerTemplate,
  
  // Productivity & Habits
  'task-manager': taskManagerTemplate,
  'habit-builder': habitBuilderTemplate,
  'anti-procrastination': antiProcrastinationTemplate,
  'focus-master': focusMasterTemplate,
  'memory-coach': memoryCoachTemplate,
  
  // Daily Life
  'home-organizer': homeOrganizerTemplate,
  'meal-planner': mealPlannerTemplate,
  'shopping-assistant': shoppingAssistantTemplate,
  'minimalism-guide': minimalismGuideTemplate,
  
  // Finance & Money
  'financial-advisor': financialAdvisorTemplate,
  'savings-coach': savingsCoachTemplate,
  'debt-manager': debtManagerTemplate,
  'money-literacy': moneyLiteracyTemplate,
  
  // Relationships & Family
  'relationship-coach': relationshipCoachTemplate,
  'parenting-guide': parentingGuideTemplate,
  'family-mediator': familyMediatorTemplate,
  
  // Personal Development
  'career-coach': careerCoachTemplate,
  'language-tutor': languageTutorTemplate,
  'reading-coach': readingCoachTemplate,
  'creativity-mentor': creativityMentorTemplate,
  'motivation-coach': motivationCoachTemplate,
  
  // Technology & Digital
  'digital-assistant': digitalAssistantTemplate,
  'security-expert': securityExpertTemplate,
  'app-advisor': appAdvisorTemplate,
  'social-balance': socialBalanceTemplate,
  
  // Entertainment & Spirituality
  'astrology-guide': astrologyGuideTemplate,
  'tarot-reader': tarotReaderTemplate,
  'numerology-expert': numerologyExpertTemplate,
  'matrix-decoder': matrixDecoderTemplate,
  'lunar-guide': lunarGuideTemplate,
  'crystal-healer': crystalHealerTemplate,
};

export async function getTemplateById(id: string): Promise<Role | null> {
  const templateData = templateMap[id];
  
  if (!templateData) {
    return null;
  }
  
  // Создаём полную роль на основе шаблона
  const role = createEmptyRole();
  
  // Объединяем с данными шаблона
  const mergedRole: Role = {
    ...role,
    ...templateData,
    id: `template-${id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return mergedRole;
}

export async function getTemplatesByCategory(_category: string): Promise<Role[]> {
  // Фильтруем шаблоны по категории
  const categoryTemplateIds = Object.keys(templateMap).filter(_id => {
    // Здесь нужно определить категорию шаблона
    // Временно возвращаем все
    return true;
  });
  
  const templates: Role[] = [];
  
  for (const id of categoryTemplateIds.slice(0, 5)) { // Берем первые 5
    const template = await getTemplateById(id);
    if (template) {
      templates.push(template);
    }
  }
  
  return templates;
}

export async function getAllTemplates(): Promise<Role[]> {
  const templates: Role[] = [];
  
  for (const id of Object.keys(templateMap)) {
    const template = await getTemplateById(id);
    if (template) {
      templates.push(template);
    }
  }
  
  return templates;
}