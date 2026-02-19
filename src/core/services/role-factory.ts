// src/core/services/role-factory.ts
import { 
  Role, 
  SubRole, 
  Session,
  RoleStatus,
  Category
} from '../domain/role/types';
// ❌ Удален импорт IdentityService


// Вспомогательная функция для генерации ID
function generateId(): string {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Создание пустой сессии
export function createEmptySession(): Session {
  return {
    id: generateId(),
    title: '',
    tasks: []
  };
}

// Создание пустой подроли
export function createEmptySubRole(): SubRole {
  return {
    id: generateId(),
    name: '',
    description: ''
  };
}

// Основная функция создания пустой роли (БЕЗ Identity)
export function createEmptyRole(): Role {
  const now = new Date().toISOString();
  
  return {
    // === STEP 1: BASE INFORMATION ===
    id: generateId(),
    name: '',
    archetype: 'mentor',
    roleType: 'personal',
    description: '',
    mainGoal: '',
    responseLength: 4,

    // P0: Метаданные
    status: 'draft' as RoleStatus,
    version: '0.9.0',
    category: 'productivity' as Category,
    tags: [],

    // === STEP 2: VISUAL PORTRAIT ===
    age: '',
    visualStyle: 'professional',
    visualDetails: '',
    visualAccent: '',
    environment: 'digital',
    atmosphere: '',
    imageStyle: 'portrait',
    lighting: 'natural',

    // === STEP 3: BEHAVIOR & TONE ===
    greeting: '',
    tone: 'friendly',
    emotionalRange: 'moderate',
    personality: {
      creativity: 5,
      formality: 5,
      empathy: 5,
      assertiveness: 5,
      patience: 5,
    },
    shouldDo: [],
    shouldNotDo: [],

    // === STEP 4: EXPERTISE & RULES ===
    expertiseAreas: [],
    tools: [],
    outputFormats: [],
    additionalRules: '',

    // === STEP 5: JOURNEY SESSIONS ===
    sessions: [createEmptySession()],

    // === STEP 6: TEAM COLLABORATION ===
    teamEnabled: false,
    orchestrator: '',
    subRoles: [],
    taskProtocol: '',

    // === STEP 7: MEMORY SYSTEM ===
    hotMemory: '',
    warmMemory: '',
    coldMemory: '',
    memoryStrategy: 'semantic',
    emotionalStates: [],

    // === STEP 8: ETHICS & VERSIONS ===
    ethicalRules: [],
    disclaimer: 'This AI assistant is for informational purposes only and does not replace professional advice. Users should exercise their own judgment and seek qualified professionals for important decisions.',
    author: '',
    contacts: '',
    changelog: [],

    // ❌ Удалено поле rmlIdentity

    // === META DATA ===
    createdAt: now,
    updatedAt: now,
  };
}

// ❌ Удалена функция createRoleWithIdentity

// Альтернативная функция для совместимости
export function createEmptyRoleFallback(): Role {
  return createEmptyRole();
}

// Экспорт roleTemplates для совместимости с templateLoader.ts
export const roleTemplates = {
  empty: createEmptyRole(),
  
  // Шаблоны БЕЗ Identity (просто роли с предустановленными полями)
  mentalHealth: (() => {
    const role = createEmptyRole();
    role.name = 'Mental Health Guide';
    role.archetype = 'healer';
    role.category = 'health';
    role.description = 'Supportive guide for stress management and emotional well-being';
    role.greeting = "Hello, I'm here to support your mental health journey. How can I help you today?";
    role.ethicalRules = [
      { rule: 'For mental health crises, suggest contacting a professional', action: 'refer' },
      { rule: 'Do not diagnose medical conditions', action: 'stop' },
      { rule: 'Provide general wellness information only', action: 'warn' }
    ];
    return role;
  })(),
  
  fitnessCoach: (() => {
    const role = createEmptyRole();
    role.name = 'Fitness Coach';
    role.archetype = 'mentor';
    role.category = 'health';
    role.description = 'Personal fitness trainer for workout plans and motivation';
    role.greeting = "Welcome! Ready to start your fitness journey?";
    role.ethicalRules = [
      { rule: 'Consult a doctor before starting new exercise programs', action: 'warn' },
      { rule: 'Do not provide medical advice for injuries', action: 'stop' }
    ];
    return role;
  })(),
  
  financialAdvisor: (() => {
    const role = createEmptyRole();
    role.name = 'Financial Advisor';
    role.archetype = 'analyst';
    role.category = 'finance';
    role.description = 'Personal finance expert for budgeting and financial planning';
    role.greeting = "Hello, I'm here to help with your financial planning. What are your goals?";
    role.ethicalRules = [
      { rule: 'This is not professional financial advice', action: 'warn' },
      { rule: 'Consult a certified financial planner for major decisions', action: 'refer' }
    ];
    return role;
  })(),
  
  // ✅ Добавляем шаблон для тестирования домена
  careerMentor: (() => {
    const role = createEmptyRole();
    role.name = 'Career Mentor';
    role.archetype = 'mentor';
    role.category = 'productivity';
    role.description = 'Professional career guidance and development';
    role.greeting = "Hello! I'm here to help with your career journey.";
    return role;
  })()
};

// Функция для создания демо-роли (БЕЗ Identity)
export function createSampleRole(): Role {
  const role = createEmptyRole();
  
  // STEP 1: Base Information
  role.name = 'AI Career Mentor';
  role.archetype = 'mentor';
  role.roleType = 'professional';
  role.description = 'An experienced AI mentor helping with career guidance and skill development';
  role.mainGoal = 'Help users achieve their career goals through personalized guidance';
  role.responseLength = 5;
  role.status = 'published';
  role.category = 'productivity';
  role.tags = ['career', 'mentoring', 'professional-development'];

  // STEP 2: Visual Portrait
  role.age = '35-45';
  role.visualStyle = 'professional';
  role.visualDetails = 'Wise and approachable appearance, professional attire';
  role.visualAccent = 'Modern office with books and technology';
  role.environment = 'office';
  role.atmosphere = 'Inspiring';
  role.imageStyle = 'portrait';
  role.lighting = 'natural';

  // STEP 3: Behavior & Tone
  role.greeting = 'Hello! I\'m here to help you navigate your career journey. How can I assist you today?';
  role.tone = 'professional';
  role.emotionalRange = 'moderate';
  role.personality = {
    creativity: 7,
    formality: 6,
    empathy: 8,
    assertiveness: 5,
    patience: 9,
  };
  role.shouldDo = [
    'Provide actionable advice',
    'Ask clarifying questions',
    'Encourage skill development',
    'Offer practical solutions'
  ];
  role.shouldNotDo = [
    'Make unrealistic promises',
    'Discourage exploration',
    'Provide legal advice',
    'Share personal information'
  ];

  // STEP 4: Expertise & Rules
  role.expertiseAreas = [
    'Career planning',
    'Skill assessment',
    'Interview preparation',
    'Professional development'
  ];
  role.tools = [
    'Career assessment tools',
    'Skill gap analysis',
    'Progress tracking',
    'Resource recommendations'
  ];
  role.outputFormats = [
    'Action plans',
    'Skill development roadmaps',
    'Progress reports',
    'Recommendation lists'
  ];
  role.additionalRules = 'Always verify industry-specific information and encourage professional verification when needed';

  // STEP 5: Journey Sessions
  role.sessions = [
    {
      id: generateId(),
      title: 'Career Assessment',
      tasks: [
        'Evaluate current skills',
        'Identify career goals',
        'Analyze market trends',
        'Create initial roadmap'
      ],
      outcomes: [
        'Clear understanding of current position',
        'Defined career objectives',
        'Initial action plan'
      ]
    },
    {
      id: generateId(),
      title: 'Skill Development',
      tasks: [
        'Identify skill gaps',
        'Recommend learning resources',
        'Set learning milestones',
        'Track progress'
      ],
      outcomes: [
        'Personalized learning path',
        'Progress tracking system',
        'Skill improvement plan'
      ]
    }
  ];

  // STEP 6: Team Collaboration
  role.teamEnabled = false;
  role.orchestrator = '';
  role.subRoles = [];
  role.taskProtocol = '';

  // STEP 7: Memory System
  role.hotMemory = 'Recent career discussions and goals';
  role.warmMemory = 'Skill development progress and preferences';
  role.coldMemory = 'Long-term career journey and achievements';
  role.memoryStrategy = 'importance';
  role.emotionalStates = [
    'Motivated',
    'Uncertain',
    'Confident',
    'Overwhelmed',
    'Satisfied'
  ];

  // STEP 8: Ethics & Versions
  role.ethicalRules = [
    { rule: 'Maintain confidentiality of user information', action: 'stop' },
    { rule: 'Avoid discrimination based on any factors', action: 'stop' },
    { rule: 'Provide balanced and realistic career advice', action: 'warn' },
    { rule: 'Refer to HR professionals for workplace conflicts', action: 'refer' }
  ];
  
  role.disclaimer = 'This AI provides career guidance based on general principles. For specific legal, financial, or employment advice, consult qualified professionals.';
  role.author = 'OpenRML Builder';
  role.contacts = 'support@openrml.org';
  role.changelog = [
    `${new Date().toISOString().split('T')[0]} - v1.0: Initial career mentor role`,
    `${new Date().toISOString().split('T')[0]} - v1.1: Added memory system`,
    `${new Date().toISOString().split('T')[0]} - v1.2: Enhanced session structure with outcomes`
  ];

  // ❌ Удалена генерация Identity
  
  return role;
}

// Функция для клонирования роли (БЕЗ Identity)
export function cloneRole(role: Role): Role {
  const cloned = {
    ...role,
    id: generateId(),
    name: `${role.name} (Copy)`,
    status: 'draft' as RoleStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sessions: role.sessions.map(session => ({
      ...session,
      id: generateId()
    })),
    subRoles: role.subRoles.map(subRole => ({
      ...subRole,
      id: generateId()
    }))
    // ❌ Удалена логика с Identity
  };
  
  // Добавляем запись в changelog
  cloned.changelog = [
    ...cloned.changelog,
    `${new Date().toISOString()} - Cloned from original role`
  ];
  
  return cloned;
}

// Функция для сброса роли к значениям по умолчанию
export function resetRole(role: Role): Role {
  const emptyRole = createEmptyRole();
  return {
    ...emptyRole,
    id: role.id,
    createdAt: role.createdAt,
    updatedAt: new Date().toISOString()
  };
}

// Функция для проверки, является ли роль "пустой"
export function isEmptyRole(role: Role): boolean {
  const emptyRole = createEmptyRole();
  
  const isDefault = 
    role.name === emptyRole.name &&
    role.archetype === emptyRole.archetype &&
    role.roleType === emptyRole.roleType &&
    role.description === emptyRole.description &&
    role.mainGoal === emptyRole.mainGoal &&
    role.responseLength === emptyRole.responseLength &&
    role.greeting === emptyRole.greeting &&
    role.sessions.length === emptyRole.sessions.length;
  
  return isDefault;
}

// Функция для создания роли из JSON (БЕЗ Identity)
export function createRoleFromJSON(json: string): Role {
  try {
    const parsed = JSON.parse(json);
    const role = createEmptyRole();
    
    const merged = {
      ...role,
      ...parsed,
      id: parsed.id || role.id,
      name: parsed.name || role.name,
      status: parsed.status || role.status,
      version: parsed.version || role.version,
      category: parsed.category || role.category,
      createdAt: parsed.createdAt || role.createdAt,
      updatedAt: parsed.updatedAt || role.updatedAt,
      personality: {
        ...role.personality,
        ...(parsed.personality || {})
      },
      sessions: Array.isArray(parsed.sessions) 
        ? parsed.sessions.map((session: any) => ({
            id: session.id || generateId(),
            title: session.title || '',
            tasks: Array.isArray(session.tasks) ? session.tasks : [],
            outcomes: Array.isArray(session.outcomes) ? session.outcomes : []
          }))
        : role.sessions,
      subRoles: Array.isArray(parsed.subRoles)
        ? parsed.subRoles.map((subRole: any) => ({
            id: subRole.id || generateId(),
            name: subRole.name || '',
            description: subRole.description || ''
          }))
        : role.subRoles,
      ethicalRules: Array.isArray(parsed.ethicalRules)
        ? parsed.ethicalRules.map((rule: any) => ({
            rule: rule.rule || '',
            action: ['warn', 'stop', 'refer'].includes(rule.action) ? rule.action : 'warn'
          }))
        : role.ethicalRules
    };
    
    // ❌ Удалена валидация Identity
    
    return merged;
  } catch (error) {
    console.error('Error parsing role from JSON:', error);
    return createEmptyRole();
  }
}

// Функция валидации роли (БЕЗ проверки Identity)
export function validateRole(role: Role): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!role.name || role.name.trim() === '') {
    errors.push('Role name is required');
  }

  if (!role.description || role.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!role.mainGoal || role.mainGoal.trim() === '') {
    errors.push('Main goal is required');
  }

  if (!role.status) {
    errors.push('Status is required');
  }
  
  if (!role.version || role.version.trim() === '') {
    errors.push('Version is required');
  }
  
  if (!role.category) {
    errors.push('Category is required');
  }

  if (role.responseLength < 1 || role.responseLength > 7) {
    errors.push('Response length must be between 1 and 7');
  }

  const traits = ['creativity', 'formality', 'empathy', 'assertiveness', 'patience'] as const;
  for (const trait of traits) {
    const value = role.personality[trait];
    if (value < 0 || value > 10 || isNaN(value)) {
      errors.push(`${trait} must be between 0 and 10`);
    }
  }

  if (role.sessions.length === 0) {
    errors.push('At least one session is required');
  }

  for (const session of role.sessions) {
    if (!session.title || session.title.trim() === '') {
      errors.push('Session title is required');
    }
  }

  if (role.ethicalRules && Array.isArray(role.ethicalRules)) {
    for (const rule of role.ethicalRules) {
      if (!rule.rule || rule.rule.trim() === '') {
        errors.push('Ethical rule text is required');
      }
      if (!['warn', 'stop', 'refer'].includes(rule.action)) {
        errors.push(`Invalid ethical rule action: ${rule.action}. Must be warn, stop, or refer.`);
      }
    }
  }

  if (role.teamEnabled) {
    if (!role.orchestrator || role.orchestrator.trim() === '') {
      errors.push('Orchestrator is required when team is enabled');
    }
    if (role.subRoles.length === 0) {
      errors.push('At least one sub-role is required when team is enabled');
    }
  }

  // ❌ Удалена проверка Identity для published ролей
  // ❌ Удалена проверка целостности Identity

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Функция для получения следующего шага
export function getNextIncompleteStep(role: Role): number {
  const steps = [
    () => !role.name || !role.description || !role.mainGoal || !role.status || !role.version || !role.category,
    () => !role.age || !role.visualDetails || !role.atmosphere,
    () => !role.greeting || role.shouldDo.length === 0,
    () => role.expertiseAreas.length === 0 || role.tools.length === 0,
    () => role.sessions.length === 0 || role.sessions.some(s => !s.title || s.tasks.length === 0),
    () => false,
    () => !role.hotMemory || !role.warmMemory || !role.coldMemory,
    () => role.ethicalRules.length === 0 || !role.disclaimer
  ];

  for (let i = 0; i < steps.length; i++) {
    if (steps[i]()) {
      return i + 1;
    }
  }

  return 1;
}

// ❌ Удалена функция updateRoleIdentity

// Экспортируем все функции
export default {
  createEmptyRole,
  createEmptyRoleFallback,
  createSampleRole,
  cloneRole,
  resetRole,
  isEmptyRole,
  createRoleFromJSON,
  validateRole,
  getNextIncompleteStep,
  roleTemplates
};