export type Language = 'en' | 'ua';

export const translations = {
  en: {
    // Header
    appName: 'OpenRML Builder',
    backToDashboard: '← Back to Dashboard',
    step: 'Step',
    of: 'of',
    import: '📥 Import .txt',
    export: '📤 Export RML',
    completed: 'completed',

    // Dashboard
    dashboardTitle: '🎯 Prompts Are Dust. Roles Are Palaces',
    dashboardSubtitle: 'Create structured AI roles, not scattered prompts. One file. Infinite applications.',
    startFromScratch: 'Start from Scratch',
    browseTemplates: 'Browse Templates',
    stepBuilder: '8-step guided builder',
    templatesCount: 'templates',
    exportFeature: 'Export to OpenRML format',
    templateLibrary: 'Template Library',
    templateLibrarySubtitle: 'Jumpstart your AI Role with pre-built templates',
    searchTemplates: 'Search templates...',
    popular: 'Popular',
    allTemplates: 'All Templates',
    noTemplatesFound: 'No templates found',
    showAllTemplates: 'Show all templates',
    useTemplate: 'Use Template',
    noDescription: 'No description',
    myRoles: 'My AI Roles',
    myRolesSubtitle: 'Your created and imported AI assistant roles',
    rolesCount: 'roles',
    untitledRole: 'Untitled Role',
    updated: 'Updated',
    created: 'Created',
    edit: 'Edit',
    duplicate: 'Duplicate',
    noRolesCreated: 'No AI roles created yet',
    createFirstRole: 'Create your first AI role',
    createYourRole: '🎯 CREATE YOUR AI ROLE',
    personalizedAssistant: 'Personalized assistant for any task',
    startCreating: 'START CREATING →',
    templates: '📚 TEMPLATES',
    exportRole: 'Export',
    delete: 'Delete',

    // Steps
    step1: 'Base',
    step2: 'Portrait',
    step3: 'Behavior',
    step4: 'Expertise',
    step5: 'Journey',
    step6: 'Team',
    step7: 'Memory',
    step8: 'Ethics',

    // Step 1: Base Info
    roleName: 'Role Name',
    archetype: 'Archetype',
    roleType: 'Role Type',
    description: 'Description',
    mainGoal: 'Main Goal',
    responseLength: 'Response Length',
    short: 'Short',
    long: 'Long',
    
    // Archetypes
    mentor: 'Mentor',
    creator: 'Creator',
    analyst: 'Analyst',
    healer: 'Healer',
    scientist: 'Scientist',
    leader: 'Leader',
    explorer: 'Explorer',
    guardian: 'Guardian',

    // Role Types
    professional: 'Professional',
    personal: 'Personal',
    educational: 'Educational',
    creative: 'Creative',

    // Step 2: Portrait
    personalData: 'Personal Data',
    name: 'Name',
    age: 'Age',
    years: 'years',
    visualAppearance: 'Visual Appearance',
    style: 'Style',
    keyDetails: 'Key Details',
    visualAccent: 'Visual Accent',
    environment: 'Environment',
    atmosphere: 'Atmosphere',
    technical: 'Technical',
    imageStyle: 'Image Style',
    lighting: 'Lighting',
    previewDescription: 'Preview Description',
    tokens: 'Tokens',
    good: 'Good',

    // Visual Styles
    professionalStyle: 'Professional',
    casualStyle: 'Casual',
    creativeStyle: 'Creative',
    academicStyle: 'Academic',

    // Environments
    office: 'Modern Office',
    hospital: 'Hospital',
    business: 'Business',
    library: 'Library',
    studio: 'Studio',
    home: 'Home',
    digital: 'Digital',

    // Image Styles
    portrait: 'Portrait',
    professionalPhoto: 'Professional',
    illustration: 'Illustration',
    digitalArt: 'Digital Art',

    // Lighting
    natural: 'Natural',
    studioLight: 'Studio',
    soft: 'Soft',
    dramatic: 'Dramatic',

    // Step 3: Behavior
    greeting: 'Greeting',
    baseTone: 'Base Tone',
    emotionalRange: 'Emotional Range',
    personalityTraits: 'Personality Traits',
    behaviorRules: 'Behavior Rules',
    shouldDo: 'What should do',
    shouldNotDo: 'What should not do',
    addRule: 'Add rule',
    addRestriction: 'Add restriction',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    positiveBehaviors: 'Positive behaviors to encourage',
    restrictions: 'Behaviors to avoid',
    remove: 'Remove',
    addRulePlaceholder: "What the role should do (e.g., 'Ask clarifying questions')...",
    addRestrictionPlaceholder: "What the role should NOT do (e.g., 'Provide medical advice')...",

    // Tones
    professionalTone: 'Professional',
    friendlyTone: 'Friendly',
    formalTone: 'Formal',
    informalTone: 'Informal',
    empatheticTone: 'Empathetic',
    enthusiasticTone: 'Enthusiastic',

    // Emotional Range
    minimal: 'Minimal',
    moderate: 'Moderate',
    expressive: 'Expressive',

    // Personality
    creativity: 'Creativity',
    formality: 'Formality',
    empathy: 'Empathy',
    assertiveness: 'Assertiveness',
    patience: 'Patience',

    // Step 4: Expertise
    expertiseAreas: 'Expertise Areas',
    toolsAndMethods: 'Tools and Methods',
    outputFormats: 'Output Formats',
    additionalRules: 'Additional Rules',
    addArea: 'Add area',
    addTool: 'Add tool',
    addFormat: 'Add format',
    expertisePlaceholder: "Add area of expertise...",
    toolsPlaceholder: "Add tool or method...",
    formatsPlaceholder: "Add output format...",
    characters: 'characters',
    rulesPlaceholder: "Any additional rules, constraints, or guidelines...",

    // Step 5: Journey
    journeyProgram: 'Journey Program',
    session: 'Session',
    addSession: 'Add session',
    editAll: 'Edit all',
    sessionTitlePlaceholder: "New session title...",
    sessionTip: "Sessions represent stages in the user's journey with your AI role",

    // Step 6: Team
    teamMode: 'Team Mode',
    enableTeam: 'Enable team collaboration',
    orchestrator: 'Orchestrator (main role)',
    subRoles: 'Sub-roles in team',
    addSubRole: 'Add sub-role',
    taskProtocol: 'Task Transfer Protocol',
    roles: 'roles',
    teamModeDisabled: 'Team mode is disabled',

    // Step 7: Memory
    hotMemory: 'Hot Memory (Operational)',
    warmMemory: 'Warm Memory (Medium-term)',
    coldMemory: 'Cold Memory (Long-term)',
    memoryStrategy: 'Memory Compression Strategy',
    emotionalStates: 'Tracked Emotional States',
    addState: 'Add state',
    semanticDescription: 'Preserves key meanings and concepts',
    chronologicalDescription: 'Organizes by timeline and sequence',
    importanceDescription: 'Prioritizes important events and data',

    // Memory Strategies
    semantic: 'Semantic (preserves key meanings)',
    chronological: 'Chronological (by timeline)',
    importance: 'By importance (priority to important events)',
    emotional: 'Emotional (focus on emotions)',

    // Step 8: Ethics
    ethicalRules: 'Ethical Rules',
    disclaimer: 'Disclaimer',
    authorAndContacts: 'Author and Contacts',
    author: 'Author',
    contacts: 'Contacts',
    versionHistory: 'Version History (Changelog)',
    addToChangelog: 'Add to changelog',

    // Buttons
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish',
    save: 'Save',
    cancel: 'Cancel',

    // Templates
    template1: '💻 Digital Assistant',
    template1desc: 'Technology for everyone',
    template2: '🏠 Home Organizer',
    template2desc: 'Cleaning and order',
    template3: '💰 Financial Advisor',
    template3desc: 'Budget and savings',
    template4: '🧘 Mental Health Guide',
    template4desc: 'Stress and meditation',
    template5: '🍎 Health Coach',
    template5desc: 'Nutrition and exercise',
    template6: '👨‍👩‍👧‍👦 Family Mediator',
    template6desc: 'Communication and conflicts',
    template7: '🎓 Educational Assistant',
    template7desc: 'Study and exams',
    template8: '🛒 Consumer Expert',
    template8desc: 'Shopping and comparisons',
    template9: '🚗 Logistics Helper',
    template9desc: 'Routes and time',
    template10: '🌱 Plant Guide',
    template10desc: 'Plant care',

    // Toast messages
    roleSaved: 'Role saved',
    saveError: 'Save error',
    importError: 'Import error',
    importSuccess: 'Import success',
    roleCompleted: 'Role completed',
    validationError: 'Validation error',
    pleaseCompleteRequiredFields: 'Please complete required fields',
    importing: 'Importing',
    requiredFieldsMissing: 'Required fields missing',

    // Validation
    required: 'This field is required',
    charactersRemaining: 'characters remaining',
    
    // Additional missing keys
    emotionalDescription: 'Focuses on emotional experiences',
    states: 'states',
    emotionalStatesHint: 'Track these emotional states to better understand user needs',
    roleCreated: 'Role created successfully',
    templateLoaded: 'Template loaded',
    templateLoadError: 'Failed to load template',
    roleExported: 'Role exported',
    deleteConfirmation: 'Are you sure you want to delete this role?',
    roleDeleted: 'Role deleted successfully',
    deleteError: 'Failed to delete role',
    roleDuplicated: 'Role duplicated',
    
    // Visual style key
    visualStyle: 'Visual Style',
  },

  ua: {
    // Header
    appName: 'OpenRML Builder',
    backToDashboard: '← Назад до панелі',
    step: 'Крок',
    of: 'з',
    import: '📥 Імпорт .txt',
    export: '📤 Експорт RML',
    completed: 'завершено',

    // Dashboard
    dashboardTitle: '🎯 Промпти — це Пил. Ролі — це Палаци',
    dashboardSubtitle: 'Створюй структуровані ролі AI, а не промпти. Один файл. Безмежність застосувань',
    startFromScratch: 'Почати з нуля',
    browseTemplates: 'Переглянути шаблони',
    stepBuilder: '8-кроковий конструктор',
    templatesCount: 'шаблонів',
    exportFeature: 'Експорт у формат OpenRML',
    templateLibrary: 'Бібліотека шаблонів',
    templateLibrarySubtitle: 'Почніть роботу з AI Роллю за допомогою готових шаблонів',
    searchTemplates: 'Пошук шаблонів...',
    popular: 'Популярні',
    allTemplates: 'Усі шаблони',
    noTemplatesFound: 'Шаблони не знайдено',
    showAllTemplates: 'Показати всі шаблони',
    useTemplate: 'Використати шаблон',
    noDescription: 'Без опису',
    myRoles: 'Мої AI Ролі',
    myRolesSubtitle: 'Створені та імпортовані вами ролі AI-асистента',
    rolesCount: 'ролей',
    untitledRole: 'Роль без назви',
    updated: 'Оновлено',
    created: 'Створено',
    edit: 'Редагувати',
    duplicate: 'Дублювати',
    noRolesCreated: 'Ще не створено жодної AI ролі',
    createFirstRole: 'Створіть свою першу AI роль',
    createYourRole: '🎯 СТВОРИ СВОЮ AI-РОЛЬ',
    personalizedAssistant: 'Персоналізований помічник для будь-яких завдань',
    startCreating: 'ПОЧАТИ СТВОРЕННЯ →',
    templates: '📚 ШАБЛОНИ',
    exportRole: 'Експорт',
    delete: 'Видалити',

    // Steps
    step1: 'База',
    step2: 'Портрет',
    step3: 'Поведінка',
    step4: 'Експертиза',
    step5: 'Journey',
    step6: 'Команда',
    step7: 'Пам\'ять',
    step8: 'Етика',

    // Step 1: Base Info
    roleName: 'Назва ролі',
    archetype: 'Архетип',
    roleType: 'Тип ролі',
    description: 'Опис',
    mainGoal: 'Головна мета',
    responseLength: 'Довжина відповіді',
    short: 'Коротко',
    long: 'Довго',
    
    // Archetypes
    mentor: 'Ментор',
    creator: 'Креатор',
    analyst: 'Аналітик',
    healer: 'Цілитель',
    scientist: 'Вчений',
    leader: 'Лідер',
    explorer: 'Дослідник',
    guardian: 'Захисник',

    // Role Types
    professional: 'Професійна',
    personal: 'Особиста',
    educational: 'Освітня',
    creative: 'Креативна',

    // Step 2: Portrait
    personalData: 'Особисті дані',
    name: 'Ім\'я',
    age: 'Вік',
    years: 'років',
    visualAppearance: 'Зовнішній вигляд',
    style: 'Стиль',
    keyDetails: 'Ключові деталі',
    visualAccent: 'Візуальний акцент',
    environment: 'Оточення',
    atmosphere: 'Атмосфера',
    technical: 'Технічні',
    imageStyle: 'Стиль зображення',
    lighting: 'Освітлення',
    previewDescription: 'Превью опису',
    tokens: 'Токени',
    good: 'Добре',

    // Visual Styles
    professionalStyle: 'Професійний',
    casualStyle: 'Повсякденний',
    creativeStyle: 'Креативний',
    academicStyle: 'Академічний',

    // Environments
    office: 'Сучасний офіс',
    hospital: 'Лікарня',
    business: 'Бізнес',
    library: 'Бібліотека',
    studio: 'Студія',
    home: 'Дім',
    digital: 'Цифрове',

    // Image Styles
    portrait: 'Портрет',
    professionalPhoto: 'Професійний',
    illustration: 'Ілюстрація',
    digitalArt: 'Цифрове мистецтво',

    // Lighting
    natural: 'Природне',
    studioLight: 'Студійне',
    soft: 'М\'яке',
    dramatic: 'Драматичне',

    // Step 3: Behavior
    greeting: 'Привітання',
    baseTone: 'Базовий тон',
    emotionalRange: 'Емоційний діапазон',
    personalityTraits: 'Риси особистості',
    behaviorRules: 'Правила поведінки',
    shouldDo: 'Що повинна робити',
    shouldNotDo: 'Що не повинна робити',
    addRule: 'Додати правило',
    addRestriction: 'Додати обмеження',
    low: 'Низький',
    medium: 'Середній',
    high: 'Високий',
    positiveBehaviors: 'Позитивна поведінка для заохочення',
    restrictions: 'Поведінка, якої слід уникати',
    remove: 'Видалити',
    addRulePlaceholder: "Що роль повинна робити (наприклад, 'Задавати уточнюючі питання')...",
    addRestrictionPlaceholder: "Що роль НЕ повинна робити (наприклад, 'Надавати медичні поради')...",

    // Tones
    professionalTone: 'Професійний',
    friendlyTone: 'Дружелюбний',
    formalTone: 'Формальний',
    informalTone: 'Неформальний',
    empatheticTone: 'Емпатичний',
    enthusiasticTone: 'Ентузіастичний',

    // Emotional Range
    minimal: 'Мінімальний',
    moderate: 'Помірний',
    expressive: 'Виразний',

    // Personality
    creativity: 'Креативність',
    formality: 'Формальність',
    empathy: 'Емпатія',
    assertiveness: 'Напористість',
    patience: 'Терпіння',

    // Step 4: Expertise
    expertiseAreas: 'Області експертизи',
    toolsAndMethods: 'Інструменти та методи',
    outputFormats: 'Формати виводу',
    additionalRules: 'Додаткові правила',
    addArea: 'Додати область',
    addTool: 'Додати інструмент',
    addFormat: 'Додати формат',
    expertisePlaceholder: "Додати область експертизи...",
    toolsPlaceholder: "Додати інструмент або метод...",
    formatsPlaceholder: "Додати формат виводу...",
    characters: 'символів',
    rulesPlaceholder: "Будь-які додаткові правила, обмеження або інструкції...",

    // Step 5: Journey
    journeyProgram: 'Програма Journey',
    session: 'Сесія',
    addSession: 'Додати сесію',
    editAll: 'Редагувати все',
    sessionTitlePlaceholder: "Нова назва сесії...",
    sessionTip: "Сесії представляють етапи в подорожі користувача з вашою AI роллю",

    // Step 6: Team
    teamMode: 'Режим команди',
    enableTeam: 'Увімкнути командну роботу',
    orchestrator: 'Оркестратор (головна роль)',
    subRoles: 'Суб-ролі в команді',
    addSubRole: 'Додати суб-роль',
    taskProtocol: 'Протокол передачі завдань',
    roles: 'ролей',
    teamModeDisabled: 'Режим команди вимкнено',

    // Step 7: Memory
    hotMemory: 'Гаряча пам\'ять (Оперативна)',
    warmMemory: 'Тепла пам\'ять (Середньострокова)',
    coldMemory: 'Холодна пам\'ять (Довгострокова)',
    memoryStrategy: 'Стратегія стиснення пам\'яті',
    emotionalStates: 'Відстежувані емоційні стани',
    addState: 'Додати стан',
    semanticDescription: 'Зберігає ключові значення та концепції',
    chronologicalDescription: 'Організовує за хронологією та послідовністю',
    importanceDescription: 'Пріоритезує важливі події та дані',

    // Memory Strategies
    semantic: 'Семантична (зберігає ключові смисли)',
    chronological: 'Хронологічна (по часовій шкалі)',
    importance: 'По важливості (пріоритет важливим подіям)',
    emotional: 'Емоційна (фокус на емоціях)',

    // Step 8: Ethics
    ethicalRules: 'Етичні правила',
    disclaimer: 'Відмова від відповідальності',
    authorAndContacts: 'Автор та контакти',
    author: 'Автор',
    contacts: 'Контакти',
    versionHistory: 'Історія версій (Changelog)',
    addToChangelog: 'Додати до changelog',

    // Buttons
    previous: 'Назад',
    next: 'Далі',
    finish: 'Завершити',
    save: 'Зберегти',
    cancel: 'Скасувати',

    // Templates
    template1: '💻 Цифровий помічник',
    template1desc: 'Технології для всіх',
    template2: '🏠 Домашній організатор',
    template2desc: 'Прибирання та порядок',
    template3: '💰 Фінансовий радник',
    template3desc: 'Бюджет та накопичення',
    template4: '🧘 Гід ментального здоров\'я',
    template4desc: 'Стрес та медитація',
    template5: '🍎 ЗСЖ тренер',
    template5desc: 'Харчування та вправи',
    template6: '👨‍👩‍👧‍👦 Сімейний медіатор',
    template6desc: 'Спілкування та конфлікти',
    template7: '🎓 Освітній помічник',
    template7desc: 'Навчання та іспити',
    template8: '🛒 Споживчий експерт',
    template8desc: 'Покупки та порівняння',
    template9: '🚗 Помічник з логістики',
    template9desc: 'Маршрути та час',
    template10: '🌱 Гід по рослинах',
    template10desc: 'Догляд за рослинами',

    // Toast messages
    roleSaved: 'Роль збережено',
    saveError: 'Помилка збереження',
    importError: 'Помилка імпорту',
    importSuccess: 'Імпорт успішний',
    roleCompleted: 'Роль завершена',
    validationError: 'Помилка валідації',
    pleaseCompleteRequiredFields: 'Будь ласка, заповніть обов\'язкові поля',
    importing: 'Імпортування',
    requiredFieldsMissing: 'Відсутні обов\'язкові поля',

    // Validation
    required: 'Це поле обов\'язкове',
    charactersRemaining: 'символів залишилось',
    
    // Additional missing keys
    emotionalDescription: 'Фокусується на емоційних переживаннях',
    states: 'станів',
    emotionalStatesHint: 'Відстежуйте ці емоційні стани для кращого розуміння потреб користувача',
    roleCreated: 'Роль успішно створена',
    templateLoaded: 'Шаблон завантажено',
    templateLoadError: 'Не вдалося завантажити шаблон',
    roleExported: 'Роль експортовано',
    deleteConfirmation: 'Ви впевнені, що хочете видалити цю роль?',
    roleDeleted: 'Роль успішно видалена',
    deleteError: 'Не вдалося видалити роль',
    roleDuplicated: 'Роль продубльована',
    
    // Visual style key
    visualStyle: 'Візуальний стиль',
  },
};

export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return translations[lang]?.[key] || translations.en[key];
};