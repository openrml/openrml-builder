// КОПИРУЕМ ДОСЛОВНО из старого src/app/data/templatePreviews.ts
import { TemplateCategory } from './categories';

export interface TemplatePreview {
  id: string;
  category: TemplateCategory;
  subcategory?: string;
  name: {
    en: string;
    ua: string;
    ru: string;
  };
  description: {
    en: string;
    ua: string;
    ru: string;
  };
  icon: string;
  tags: string[];
  isPopular?: boolean;
  color?: string;
}

export const templatePreviews: TemplatePreview[] = [
  // Health & Wellbeing (5 templates)
  {
    id: 'mental-health',
    category: 'health',
    subcategory: 'mental',
    name: {
      en: 'Mental Health Guide',
      ua: 'Гід з ментального здоров\'я',
      ru: 'Гид по ментальному здоровью'
    },
    description: {
      en: 'Support for stress, anxiety, and emotional wellbeing',
      ua: 'Підтримка при стресі, тривозі та емоційному благополуччі',
      ru: 'Поддержка при стрессе, тревоге и эмоциональном благополучии'
    },
    icon: '🧘',
    tags: ['stress', 'anxiety', 'mindfulness', 'mental health'],
    isPopular: true,
    color: 'green'
  },
  {
    id: 'fitness-coach',
    category: 'health',
    subcategory: 'fitness',
    name: {
      en: 'Fitness Coach',
      ua: 'Фітнес-тренер',
      ru: 'Фитнес-тренер'
    },
    description: {
      en: 'Workout plans, motivation, and fitness guidance',
      ua: 'Плани тренувань, мотивація та фітнес-консультації',
      ru: 'Планы тренировок, мотивация и фитнес-консультации'
    },
    icon: '💪',
    tags: ['fitness', 'workout', 'health', 'exercise'],
    isPopular: true,
    color: 'green'
  },
  {
    id: 'nutrition-advisor',
    category: 'health',
    subcategory: 'nutrition',
    name: {
      en: 'Nutrition Advisor',
      ua: 'Консультант з харчування',
      ru: 'Консультант по питанию'
    },
    description: {
      en: 'Healthy eating habits and meal planning',
      ua: 'Здорові харчові звички та планування раціону',
      ru: 'Здоровые пищевые привычки и планирование рациона'
    },
    icon: '🥗',
    tags: ['nutrition', 'diet', 'healthy eating', 'meal planning'],
    color: 'green'
  },
  {
    id: 'sleep-optimizer',
    category: 'health',
    subcategory: 'sleep',
    name: {
      en: 'Sleep Optimizer',
      ua: 'Оптимізатор сну',
      ru: 'Оптимизатор сна'
    },
    description: {
      en: 'Better sleep quality and healthy sleep routines',
      ua: 'Краща якість сну та здорові режими сну',
      ru: 'Лучшее качество сна и здоровые режимы сна'
    },
    icon: '😴',
    tags: ['sleep', 'rest', 'insomnia', 'bedtime'],
    color: 'green'
  },
  {
    id: 'stress-manager',
    category: 'health',
    subcategory: 'stress',
    name: {
      en: 'Stress Manager',
      ua: 'Менеджер стресу',
      ru: 'Менеджер стресса'
    },
    description: {
      en: 'Stress reduction and energy management techniques',
      ua: 'Техніки зниження стресу та управління енергією',
      ru: 'Техники снижения стресса и управления энергией'
    },
    icon: '🌊',
    tags: ['stress', 'relaxation', 'energy', 'burnout'],
    color: 'green'
  },

  // Productivity & Habits (5 templates)
  {
    id: 'task-manager',
    category: 'productivity',
    subcategory: 'tasks',
    name: {
      en: 'Task Manager Pro',
      ua: 'Менеджер завдань Про',
      ru: 'Менеджер задач Про'
    },
    description: {
      en: 'Organize tasks, set priorities, and manage time effectively',
      ua: 'Організуйте завдання, встановлюйте пріоритети та ефективно керуйте часом',
      ru: 'Организуйте задачи, устанавливайте приоритеты и эффективно управляйте временем'
    },
    icon: '✅',
    tags: ['tasks', 'productivity', 'time management', 'organization'],
    isPopular: true,
    color: 'indigo'
  },
  {
    id: 'habit-builder',
    category: 'productivity',
    subcategory: 'habits',
    name: {
      en: 'Habit Builder',
      ua: 'Будівельник звичок',
      ru: 'Строитель привычек'
    },
    description: {
      en: 'Build positive habits and break bad ones',
      ua: 'Формуйте позитивні звички та позбувайтеся поганих',
      ru: 'Формируйте позитивные привычки и избавляйтесь от плохих'
    },
    icon: '🎯',
    tags: ['habits', 'routine', 'self-improvement', 'discipline'],
    isPopular: true,
    color: 'indigo'
  },
  {
    id: 'anti-procrastination',
    category: 'productivity',
    subcategory: 'procrastination',
    name: {
      en: 'Anti-Procrastination Coach',
      ua: 'Коуч проти прокрастинації',
      ru: 'Коуч против прокрастинации'
    },
    description: {
      en: 'Overcome procrastination and start taking action',
      ua: 'Подолайте прокрастинацію та почніть діяти',
      ru: 'Преодолейте прокрастинацию и начните действовать'
    },
    icon: '🚀',
    tags: ['procrastination', 'motivation', 'action', 'productivity'],
    color: 'indigo'
  },
  {
    id: 'focus-master',
    category: 'productivity',
    subcategory: 'focus',
    name: {
      en: 'Focus Master',
      ua: 'Майстер фокусу',
      ru: 'Мастер фокуса'
    },
    description: {
      en: 'Improve concentration and deep work capabilities',
      ua: 'Покращте концентрацію та здатність до глибокої роботи',
      ru: 'Улучшите концентрацию и способность к глубокой работе'
    },
    icon: '🎯',
    tags: ['focus', 'concentration', 'deep work', 'attention'],
    color: 'indigo'
  },
  {
    id: 'memory-coach',
    category: 'productivity',
    subcategory: 'memory',
    name: {
      en: 'Memory Coach',
      ua: 'Коуч пам\'яті',
      ru: 'Коуч памяти'
    },
    description: {
      en: 'Enhance memory and learning techniques',
      ua: 'Покращте пам\'ять та техніки навчання',
      ru: 'Улучшите память и техники обучения'
    },
    icon: '🧠',
    tags: ['memory', 'learning', 'mnemonics', 'retention'],
    color: 'indigo'
  },

  // Daily Life (4 templates)
  {
    id: 'home-organizer',
    category: 'daily',
    subcategory: 'cleaning',
    name: {
      en: 'Home Organizer',
      ua: 'Організатор дому',
      ru: 'Организатор дома'
    },
    description: {
      en: 'Clean, organized, and peaceful home environment',
      ua: 'Чистий, організований та мирний домашній простір',
      ru: 'Чистое, организованное и мирное домашнее пространство'
    },
    icon: '🏠',
    tags: ['home', 'cleaning', 'organization', 'decluttering'],
    isPopular: true,
    color: 'amber'
  },
  {
    id: 'meal-planner',
    category: 'daily',
    subcategory: 'cooking',
    name: {
      en: 'Meal Planner',
      ua: 'Планувальник меню',
      ru: 'Планировщик меню'
    },
    description: {
      en: 'Weekly meal planning and cooking inspiration',
      ua: 'Планування тижневого меню та кулінарне натхнення',
      ru: 'Планирование недельного меню и кулинарное вдохновение'
    },
    icon: '🍳',
    tags: ['cooking', 'meals', 'recipes', 'planning'],
    color: 'amber'
  },
  {
    id: 'shopping-assistant',
    category: 'daily',
    subcategory: 'shopping',
    name: {
      en: 'Smart Shopping Assistant',
      ua: 'Розумний помічник для покупок',
      ru: 'Умный помощник для покупок'
    },
    description: {
      en: 'Smart purchases and budget-friendly shopping',
      ua: 'Розумні покупки та економний шопінг',
      ru: 'Умные покупки и экономный шопинг'
    },
    icon: '🛒',
    tags: ['shopping', 'budget', 'consumer', 'savings'],
    color: 'amber'
  },
  {
    id: 'minimalism-guide',
    category: 'daily',
    subcategory: 'minimalism',
    name: {
      en: 'Minimalism Guide',
      ua: 'Гід з мінімалізму',
      ru: 'Гид по минимализму'
    },
    description: {
      en: 'Declutter life and embrace minimalist lifestyle',
      ua: 'Позбудьтеся зайвого та прийміть мінімалістичний стиль життя',
      ru: 'Избавьтесь от лишнего и примите минималистичный стиль жизни'
    },
    icon: '✨',
    tags: ['minimalism', 'declutter', 'simplicity', 'lifestyle'],
    color: 'amber'
  },

  // Finance & Money (4 templates)
  {
    id: 'financial-advisor',
    category: 'finance',
    subcategory: 'budget',
    name: {
      en: 'Financial Advisor',
      ua: 'Фінансовий радник',
      ru: 'Финансовый советник'
    },
    description: {
      en: 'Budget planning, saving strategies, and financial goals',
      ua: 'Планування бюджету, стратегії заощадження та фінансові цілі',
      ru: 'Планирование бюджета, стратегии накопления и финансовые цели'
    },
    icon: '💰',
    tags: ['finance', 'budget', 'money', 'savings'],
    isPopular: true,
    color: 'emerald'
  },
  {
    id: 'savings-coach',
    category: 'finance',
    subcategory: 'savings',
    name: {
      en: 'Savings Coach',
      ua: 'Коуч зі заощаджень',
      ru: 'Коуч по накоплениям'
    },
    description: {
      en: 'Build emergency fund and achieve savings goals',
      ua: 'Створіть фонд на екстрені випадки та досягніть цілей заощаджень',
      ru: 'Создайте фонд на экстренные случаи и достигните целей накоплений'
    },
    icon: '🏦',
    tags: ['savings', 'emergency fund', 'goals', 'finance'],
    color: 'emerald'
  },
  {
    id: 'debt-manager',
    category: 'finance',
    subcategory: 'debt',
    name: {
      en: 'Debt Freedom Coach',
      ua: 'Коуч зі звільнення від боргів',
      ru: 'Коуч по освобождению от долгов'
    },
    description: {
      en: 'Pay off debts and achieve financial freedom',
      ua: 'Виплатіть борги та досягніть фінансової свободи',
      ru: 'Выплатите долги и достигните финансовой свободы'
    },
    icon: '💳',
    tags: ['debt', 'loans', 'credit', 'freedom'],
    color: 'emerald'
  },
  {
    id: 'money-literacy',
    category: 'finance',
    subcategory: 'literacy',
    name: {
      en: 'Money Literacy Teacher',
      ua: 'Вчитель фінансової грамотності',
      ru: 'Учитель финансовой грамотности'
    },
    description: {
      en: 'Learn money management and financial basics',
      ua: 'Вивчіть управління грошима та фінансові основи',
      ru: 'Изучите управление деньгами и финансовые основы'
    },
    icon: '📚',
    tags: ['education', 'finance', 'literacy', 'money'],
    color: 'emerald'
  },

  // Relationships & Family (3 templates)
  {
    id: 'relationship-coach',
    category: 'relationships',
    subcategory: 'couple',
    name: {
      en: 'Relationship Coach',
      ua: 'Коуч відносин',
      ru: 'Коуч отношений'
    },
    description: {
      en: 'Improve communication and strengthen relationships',
      ua: 'Покращте комунікацію та зміцніть відносини',
      ru: 'Улучшите коммуникацию и укрепите отношения'
    },
    icon: '💑',
    tags: ['relationships', 'love', 'communication', 'couple'],
    color: 'pink'
  },
  {
    id: 'parenting-guide',
    category: 'relationships',
    subcategory: 'parenting',
    name: {
      en: 'Parenting Guide',
      ua: 'Гід з батьківства',
      ru: 'Гид по родительству'
    },
    description: {
      en: 'Positive parenting and child development support',
      ua: 'Позитивне батьківство та підтримка розвитку дитини',
      ru: 'Позитивное родительство и поддержка развития ребенка'
    },
    icon: '👨‍👩‍👧',
    tags: ['parenting', 'children', 'family', 'education'],
    color: 'pink'
  },
  {
    id: 'family-mediator',
    category: 'relationships',
    subcategory: 'communication',
    name: {
      en: 'Family Mediator',
      ua: 'Сімейний медіатор',
      ru: 'Семейный медиатор'
    },
    description: {
      en: 'Resolve conflicts and improve family communication',
      ua: 'Вирішуйте конфлікти та покращте сімейну комунікацію',
      ru: 'Решайте конфликты и улучшайте семейную коммуникацию'
    },
    icon: '🤝',
    tags: ['family', 'conflicts', 'mediation', 'communication'],
    color: 'pink'
  },

  // Personal Development (5 templates)
  {
    id: 'career-coach',
    category: 'development',
    subcategory: 'career',
    name: {
      en: 'Career Coach',
      ua: 'Кар\'єрний коуч',
      ru: 'Карьерный коуч'
    },
    description: {
      en: 'Career growth, job search, and interview preparation',
      ua: 'Кар\'єрний ріст, пошук роботи та підготовка до співбесід',
      ru: 'Карьерный рост, поиск работы и подготовка к собеседованиям'
    },
    icon: '👔',
    tags: ['career', 'job', 'interview', 'growth'],
    isPopular: true,
    color: 'purple'
  },
  {
    id: 'language-tutor',
    category: 'development',
    subcategory: 'languages',
    name: {
      en: 'Language Learning Tutor',
      ua: 'Репетитор з вивчення мов',
      ru: 'Репетитор по изучению языков'
    },
    description: {
      en: 'Practice languages and improve fluency',
      ua: 'Практикуйте мови та покращте вільність мовлення',
      ru: 'Практикуйте языки и улучшайте беглость речи'
    },
    icon: '🗣️',
    tags: ['languages', 'learning', 'education', 'practice'],
    color: 'purple'
  },
  {
    id: 'reading-coach',
    category: 'development',
    subcategory: 'reading',
    name: {
      en: 'Reading Coach',
      ua: 'Коуч з читання',
      ru: 'Коуч по чтению'
    },
    description: {
      en: 'Build reading habit and discover great books',
      ua: 'Сформуйте звичку читання та відкрийте чудові книги',
      ru: 'Сформируйте привычку чтения и откройте замечательные книги'
    },
    icon: '📖',
    tags: ['reading', 'books', 'learning', 'habit'],
    color: 'purple'
  },
  {
    id: 'creativity-mentor',
    category: 'development',
    subcategory: 'creativity',
    name: {
      en: 'Creativity Mentor',
      ua: 'Ментор креативності',
      ru: 'Ментор креативности'
    },
    description: {
      en: 'Unlock creativity and explore artistic hobbies',
      ua: 'Розкрийте креативність та досліджуйте мистецькі хобі',
      ru: 'Раскройте креативность и исследуйте художественные хобби'
    },
    icon: '🎨',
    tags: ['creativity', 'art', 'hobbies', 'expression'],
    color: 'purple'
  },
  {
    id: 'motivation-coach',
    category: 'development',
    subcategory: 'motivation',
    name: {
      en: 'Motivation Coach',
      ua: 'Коуч мотивації',
      ru: 'Коуч мотивации'
    },
    description: {
      en: 'Set goals and stay motivated to achieve them',
      ua: 'Встановлюйте цілі та залишайтесь мотивованими для їх досягнення',
      ru: 'Устанавливайте цели и оставайтесь мотивированными для их достижения'
    },
    icon: '🔥',
    tags: ['motivation', 'goals', 'achievement', 'inspiration'],
    color: 'purple'
  },

  // Technology & Digital Life (4 templates)
  {
    id: 'digital-assistant',
    category: 'technology',
    subcategory: 'digital',
    name: {
      en: 'Digital Assistant',
      ua: 'Цифровий помічник',
      ru: 'Цифровой помощник'
    },
    description: {
      en: 'Technology help, software guidance, and digital tools',
      ua: 'Допомога з технологіями, керування ПЗ та цифровими інструментами',
      ru: 'Помощь с технологиями, управление ПО и цифровыми инструментами'
    },
    icon: '💻',
    tags: ['technology', 'software', 'digital', 'help'],
    isPopular: true,
    color: 'blue'
  },
  {
    id: 'security-expert',
    category: 'technology',
    subcategory: 'security',
    name: {
      en: 'Online Security Expert',
      ua: 'Експерт онлайн-безпеки',
      ru: 'Эксперт онлайн-безопасности'
    },
    description: {
      en: 'Protect your privacy and stay safe online',
      ua: 'Захистіть свою приватність та залишайтесь у безпеці онлайн',
      ru: 'Защитите свою приватность и оставайтесь в безопасности онлайн'
    },
    icon: '🔒',
    tags: ['security', 'privacy', 'safety', 'protection'],
    color: 'blue'
  },
  {
    id: 'app-advisor',
    category: 'technology',
    subcategory: 'apps',
    name: {
      en: 'Productivity Apps Advisor',
      ua: 'Радник з продуктивних додатків',
      ru: 'Советник по продуктивным приложениям'
    },
    description: {
      en: 'Find and master the best productivity apps',
      ua: 'Знайдіть та опануйте найкращі додатки для продуктивності',
      ru: 'Найдите и освойте лучшие приложения для продуктивности'
    },
    icon: '📱',
    tags: ['apps', 'productivity', 'tools', 'software'],
    color: 'blue'
  },
  {
    id: 'social-balance',
    category: 'technology',
    subcategory: 'social',
    name: {
      en: 'Social Media Balance Coach',
      ua: 'Коуч балансу соцмереж',
      ru: 'Коуч баланса соцсетей'
    },
    description: {
      en: 'Healthy social media habits and digital wellbeing',
      ua: 'Здорові звички соцмереж та цифрове благополуччя',
      ru: 'Здоровые привычки соцсетей и цифровое благополучие'
    },
    icon: '📵',
    tags: ['social media', 'balance', 'digital detox', 'wellbeing'],
    color: 'blue'
  },

  // Entertainment & Spirituality (6 templates)
  {
    id: 'astrology-guide',
    category: 'entertainment',
    subcategory: 'astrology',
    name: {
      en: 'Astrology Guide',
      ua: 'Астрологічний гід',
      ru: 'Астрологический гид'
    },
    description: {
      en: 'Explore your birth chart and astrological insights',
      ua: 'Досліджуйте свою натальну карту та астрологічні інсайти',
      ru: 'Исследуйте свою натальную карту и астрологические инсайты'
    },
    icon: '♈',
    tags: ['astrology', 'zodiac', 'horoscope', 'stars'],
    color: 'violet'
  },
  {
    id: 'tarot-reader',
    category: 'entertainment',
    subcategory: 'tarot',
    name: {
      en: 'Tarot Reader',
      ua: 'Таро-консультант',
      ru: 'Таро-консультант'
    },
    description: {
      en: 'Tarot readings and divination guidance',
      ua: 'Читання Таро та ворожіння',
      ru: 'Чтение Таро и гадания'
    },
    icon: '🔮',
    tags: ['tarot', 'divination', 'cards', 'fortune'],
    color: 'violet'
  },
  {
    id: 'numerology-expert',
    category: 'entertainment',
    subcategory: 'numerology',
    name: {
      en: 'Numerology Expert',
      ua: 'Експерт нумерології',
      ru: 'Эксперт нумерологии'
    },
    description: {
      en: 'Discover your life path through numbers',
      ua: 'Відкрийте свій життєвий шлях через числа',
      ru: 'Откройте свой жизненный путь через числа'
    },
    icon: '🔢',
    tags: ['numerology', 'numbers', 'life path', 'destiny'],
    color: 'violet'
  },
  {
    id: 'matrix-decoder',
    category: 'entertainment',
    subcategory: 'matrix',
    name: {
      en: 'Destiny Matrix Decoder',
      ua: 'Декодер матриці долі',
      ru: 'Декодер матрицы судьбы'
    },
    description: {
      en: 'Decode your destiny matrix and life purpose',
      ua: 'Розшифруйте свою матрицю долі та життєву мету',
      ru: 'Расшифруйте свою матрицу судьбы и жизненную цель'
    },
    icon: '⭐',
    tags: ['matrix', 'destiny', 'purpose', 'arcana'],
    color: 'violet'
  },
  {
    id: 'lunar-guide',
    category: 'entertainment',
    subcategory: 'lunar',
    name: {
      en: 'Lunar Calendar Guide',
      ua: 'Гід місячного календаря',
      ru: 'Гид лунного календаря'
    },
    description: {
      en: 'Moon phases, rituals, and lunar wisdom',
      ua: 'Фази місяця, ритуали та місячна мудрість',
      ru: 'Фазы луны, ритуалы и лунная мудрость'
    },
    icon: '🌙',
    tags: ['moon', 'lunar', 'phases', 'rituals'],
    color: 'violet'
  },
  {
    id: 'crystal-healer',
    category: 'entertainment',
    subcategory: 'crystals',
    name: {
      en: 'Crystal Energy Guide',
      ua: 'Гід кристальної енергії',
      ru: 'Гид кристальной энергии'
    },
    description: {
      en: 'Crystal properties and energy work',
      ua: 'Властивості кристалів та енергетична робота',
      ru: 'Свойства кристаллов и энергетическая работа'
    },
    icon: '💎',
    tags: ['crystals', 'energy', 'healing', 'stones'],
    color: 'violet'
  }
  // ... ВСЕ 36 ШАБЛОНОВ ДОСЛОВНО ИЗ СТАРОГО ФАЙЛА
];

// Helper functions
export const getTemplatesByCategory = (category: TemplateCategory): TemplatePreview[] => {
  return templatePreviews.filter(t => t.category === category);
};

export const getPopularTemplates = (): TemplatePreview[] => {
  return templatePreviews.filter(t => t.isPopular);
};

export const searchTemplates = (query: string): TemplatePreview[] => {
  const lowerQuery = query.toLowerCase();
  return templatePreviews.filter(t => 
    t.tags.some(tag => tag.includes(lowerQuery)) ||
    t.name.en.toLowerCase().includes(lowerQuery) ||
    t.name.ua.toLowerCase().includes(lowerQuery) ||
    t.name.ru.toLowerCase().includes(lowerQuery)
  );
};

export const getTemplatePreviewById = (id: string): TemplatePreview | undefined => {
  return templatePreviews.find(t => t.id === id);
};