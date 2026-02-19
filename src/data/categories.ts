export type TemplateCategory = 
  | 'health' 
  | 'productivity' 
  | 'daily' 
  | 'finance' 
  | 'relationships' 
  | 'development' 
  | 'technology'
  | 'entertainment';

export interface Category {
  id: TemplateCategory;
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
  subcategories: {
    id: string;
    name: {
      en: string;
      ua: string;
      ru: string;
    };
  }[];
  disclaimer?: {
    en: string;
    ua: string;
    ru: string;
  };
}

export const categories: Category[] = [
  {
    id: 'health',
    name: {
      en: 'Health & Wellbeing',
      ua: 'Здоров\'я та благополуччя',
      ru: 'Здоровье и благополучие'
    },
    description: {
      en: 'Mental health, fitness, nutrition, and stress management',
      ua: 'Ментальне здоров\'я, фітнес, харчування та управління стресом',
      ru: 'Ментальное здоровье, фитнес, питание и управление стрессом'
    },
    icon: '💚',
    subcategories: [
      {
        id: 'mental',
        name: {
          en: 'Mental Health',
          ua: 'Ментальне здоров\'я',
          ru: 'Ментальное здоровье'
        }
      },
      {
        id: 'sleep',
        name: {
          en: 'Sleep & Rest',
          ua: 'Сон та відпочинок',
          ru: 'Сон и отдых'
        }
      },
      {
        id: 'fitness',
        name: {
          en: 'Fitness & Movement',
          ua: 'Фітнес та рух',
          ru: 'Фитнес и движение'
        }
      },
      {
        id: 'nutrition',
        name: {
          en: 'Nutrition & Healthy Lifestyle',
          ua: 'Харчування та ЗОЖ',
          ru: 'Питание и ЗОЖ'
        }
      },
      {
        id: 'stress',
        name: {
          en: 'Stress & Energy Management',
          ua: 'Управління стресом та енергією',
          ru: 'Управление стрессом и энергией'
        }
      }
    ]
  },
  {
    id: 'productivity',
    name: {
      en: 'Productivity & Habits',
      ua: 'Продуктивність та звички',
      ru: 'Продуктивность и привычки'
    },
    description: {
      en: 'Task management, habit building, and focus improvement',
      ua: 'Управління завданнями, формування звичок та покращення концентрації',
      ru: 'Управление задачами, формирование привычек и улучшение концентрации'
    },
    icon: '⚡',
    subcategories: [
      {
        id: 'tasks',
        name: {
          en: 'Task & Time Manager',
          ua: 'Менеджер завдань і часу',
          ru: 'Менеджер задач и времени'
        }
      },
      {
        id: 'habits',
        name: {
          en: 'Habit Building',
          ua: 'Побудова звичок',
          ru: 'Построение привычек'
        }
      },
      {
        id: 'procrastination',
        name: {
          en: 'Anti-Procrastination',
          ua: 'Боротьба з прокрастинацією',
          ru: 'Борьба с прокрастинацией'
        }
      },
      {
        id: 'focus',
        name: {
          en: 'Focus & Concentration',
          ua: 'Фокус та концентрація',
          ru: 'Фокус и концентрация'
        }
      },
      {
        id: 'memory',
        name: {
          en: 'Memory Coach',
          ua: 'Тренер пам\'яті',
          ru: 'Тренер памяти'
        }
      }
    ]
  },
  {
    id: 'daily',
    name: {
      en: 'Daily Life',
      ua: 'Побут та повсякденне життя',
      ru: 'Быт и повседневная жизнь'
    },
    description: {
      en: 'Cooking, home organization, shopping, and daily routines',
      ua: 'Кулінарія, організація дому, покупки та щоденні рутини',
      ru: 'Кулинария, организация дома, покупки и ежедневные рутины'
    },
    icon: '🏠',
    subcategories: [
      {
        id: 'cooking',
        name: {
          en: 'Cooking & Family Meals',
          ua: 'Кулінарія та харчування сім\'ї',
          ru: 'Кулинария и питание семьи'
        }
      },
      {
        id: 'cleaning',
        name: {
          en: 'Cleaning & Home Organization',
          ua: 'Прибирання та організація дому',
          ru: 'Уборка и организация дома'
        }
      },
      {
        id: 'shopping',
        name: {
          en: 'Shopping & Consumer',
          ua: 'Покупки та споживання',
          ru: 'Покупки и потребительство'
        }
      },
      {
        id: 'logistics',
        name: {
          en: 'Logistics & Routes',
          ua: 'Логістика та маршрути',
          ru: 'Логистика и маршруты'
        }
      },
      {
        id: 'minimalism',
        name: {
          en: 'Minimalism & Decluttering',
          ua: 'Мінімалізм та decluttering',
          ru: 'Минимализм и decluttering'
        }
      }
    ]
  },
  {
    id: 'finance',
    name: {
      en: 'Finance & Money',
      ua: 'Фінанси та гроші',
      ru: 'Финансы и деньги'
    },
    description: {
      en: 'Budgeting, savings, debt management, and financial literacy',
      ua: 'Бюджет, заощадження, управління боргами та фінансова грамотність',
      ru: 'Бюджет, накопления, управление долгами и финансовая грамотность'
    },
    icon: '💰',
    subcategories: [
      {
        id: 'budget',
        name: {
          en: 'Budget & Expense Tracking',
          ua: 'Бюджет та облік витрат',
          ru: 'Бюджет и учет расходов'
        }
      },
      {
        id: 'savings',
        name: {
          en: 'Savings & Accumulation',
          ua: 'Заощадження та накопичення',
          ru: 'Накопления и сбережения'
        }
      },
      {
        id: 'debt',
        name: {
          en: 'Debts & Credits',
          ua: 'Борги та кредити',
          ru: 'Долги и кредиты'
        }
      },
      {
        id: 'literacy',
        name: {
          en: 'Financial Literacy',
          ua: 'Фінансова грамотність',
          ru: 'Финансовая грамотность'
        }
      }
    ]
  },
  {
    id: 'relationships',
    name: {
      en: 'Relationships & Family',
      ua: 'Відносини та сім\'я',
      ru: 'Отношения и семья'
    },
    description: {
      en: 'Couple relationships, parenting, family communication, and friendships',
      ua: 'Відносини у парі, батьківство, сімейна комунікація та дружба',
      ru: 'Отношения в паре, родительство, семейная коммуникация и дружба'
    },
    icon: '❤️',
    subcategories: [
      {
        id: 'couple',
        name: {
          en: 'Couple Relationships',
          ua: 'Відносини у парі',
          ru: 'Отношения в паре'
        }
      },
      {
        id: 'parenting',
        name: {
          en: 'Parenting & Education',
          ua: 'Батьківство та виховання',
          ru: 'Родительство и воспитание'
        }
      },
      {
        id: 'communication',
        name: {
          en: 'Family Communication & Conflicts',
          ua: 'Сімейна комунікація та конфлікти',
          ru: 'Семейная коммуникация и конфликты'
        }
      },
      {
        id: 'friendship',
        name: {
          en: 'Friendship & Social Connections',
          ua: 'Дружба та соціальні зв\'язки',
          ru: 'Дружба и социальные связи'
        }
      }
    ]
  },
  {
    id: 'development',
    name: {
      en: 'Personal Development & Learning',
      ua: 'Особистий розвиток та навчання',
      ru: 'Личное развитие и обучение'
    },
    description: {
      en: 'Languages, career growth, reading, creativity, and motivation',
      ua: 'Мови, кар\'єрний ріст, читання, креативність та мотивація',
      ru: 'Языки, карьерный рост, чтение, креативность и мотивация'
    },
    icon: '🎓',
    subcategories: [
      {
        id: 'languages',
        name: {
          en: 'Language Learning',
          ua: 'Вивчення мов',
          ru: 'Изучение языков'
        }
      },
      {
        id: 'career',
        name: {
          en: 'Career Growth',
          ua: 'Кар\'єрний ріст',
          ru: 'Карьерный рост'
        }
      },
      {
        id: 'reading',
        name: {
          en: 'Reading & Self-Education',
          ua: 'Читання та самоосвіта',
          ru: 'Чтение и самообразование'
        }
      },
      {
        id: 'creativity',
        name: {
          en: 'Creativity & Hobbies',
          ua: 'Креативність та хобі',
          ru: 'Креативность и хобби'
        }
      },
      {
        id: 'motivation',
        name: {
          en: 'Motivation & Goals',
          ua: 'Мотивація та цілі',
          ru: 'Мотивация и цели'
        }
      }
    ]
  },
  {
    id: 'technology',
    name: {
      en: 'Technology & Digital Life',
      ua: 'Технології та цифрове життя',
      ru: 'Технологии и цифровая жизнь'
    },
    description: {
      en: 'Digital assistant, online security, apps, and social media balance',
      ua: 'Цифровий помічник, онлайн-безпека, додатки та баланс соцмереж',
      ru: 'Цифровой помощник, онлайн-безопасность, приложения и баланс соцсетей'
    },
    icon: '💻',
    subcategories: [
      {
        id: 'digital',
        name: {
          en: 'Digital Assistant',
          ua: 'Цифровий помічник',
          ru: 'Цифровой помощник'
        }
      },
      {
        id: 'security',
        name: {
          en: 'Online Security',
          ua: 'Онлайн-безпека',
          ru: 'Онлайн-безопасность'
        }
      },
      {
        id: 'apps',
        name: {
          en: 'Productive Apps',
          ua: 'Продуктивні додатки',
          ru: 'Продуктивные приложения'
        }
      },
      {
        id: 'social',
        name: {
          en: 'Social Media & Balance',
          ua: 'Соцмережі та баланс',
          ru: 'Соцсети и баланс'
        }
      }
    ]
  },
  {
    id: 'entertainment',
    name: {
      en: 'Entertainment & Spirituality',
      ua: 'Розваги та духовність',
      ru: 'Развлечения и духовность'
    },
    description: {
      en: 'Astrology, tarot, numerology, and energy practices',
      ua: 'Астрологія, таро, нумерологія та енергетичні практики',
      ru: 'Астрология, таро, нумерология и энергетические практики'
    },
    icon: '✨',
    disclaimer: {
      en: 'For entertainment and inspiration, not a scientific method',
      ua: 'Для розваги та натхнення, не науковий метод',
      ru: 'Для развлечения и вдохновения, не научный метод'
    },
    subcategories: [
      {
        id: 'astrology',
        name: {
          en: 'Astrology',
          ua: 'Астрологія',
          ru: 'Астрология'
        }
      },
      {
        id: 'tarot',
        name: {
          en: 'Tarot & Divination',
          ua: 'Таро та ворожіння',
          ru: 'Таро и гадания'
        }
      },
      {
        id: 'matrix',
        name: {
          en: 'Destiny Matrix',
          ua: 'Матриця долі',
          ru: 'Матрица судьбы'
        }
      },
      {
        id: 'numerology',
        name: {
          en: 'Numerology',
          ua: 'Нумерологія',
          ru: 'Нумерология'
        }
      },
      {
        id: 'lunar',
        name: {
          en: 'Lunar Calendar & Rituals',
          ua: 'Місячний календар та ритуали',
          ru: 'Лунный календарь и ритуалы'
        }
      },
      {
        id: 'crystals',
        name: {
          en: 'Crystals & Energy',
          ua: 'Кристали та енергетика',
          ru: 'Кристаллы и энергетика'
        }
      }
    ]
  }
];

export const getCategoryById = (id: TemplateCategory): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getCategoryName = (id: TemplateCategory, lang: 'en' | 'ua' | 'ru'): string => {
  const category = getCategoryById(id);
  return category ? category.name[lang] : id;
};
