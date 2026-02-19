// src/core/domain/role/types.ts
export type Language = 'en' | 'ua' | 'ru';
export type Archetype = 'mentor' | 'creator' | 'analyst' | 'healer' | 'scientist' | 'leader' | 'explorer' | 'guardian';
export type RoleType = 'professional' | 'personal' | 'educational' | 'creative';
export type ResponseLength = number;
export type VisualStyle = 'professional' | 'casual' | 'creative' | 'academic';
export type Environment = 'office' | 'hospital' | 'business' | 'library' | 'studio' | 'home' | 'digital';
export type ImageStyle = 'portrait' | 'professional' | 'illustration' | 'digital-art';
export type Lighting = 'natural' | 'studio' | 'soft' | 'dramatic';
export type Tone = 'professional' | 'friendly' | 'formal' | 'informal' | 'empathetic' | 'enthusiastic';
export type EmotionalRange = 'minimal' | 'moderate' | 'expressive';
export type MemoryStrategy = 'semantic' | 'chronological' | 'importance' | 'emotional';

// P0: Новые типы
export type RoleStatus = 'draft' | 'published';
export type Category = 'health' | 'productivity' | 'daily' | 'finance' | 'relationships' | 'development' | 'technology' | 'entertainment';
export type EthicalAction = 'warn' | 'stop' | 'refer';

// Лицензирование (стандартные Creative Commons)
export type LicenseType = 
  | 'CC-BY-4.0'
  | 'CC-BY-SA-4.0'
  | 'CC-BY-NC-4.0'
  | 'CC-BY-NC-SA-4.0'
  | 'CC-BY-ND-4.0'      // Добавлено
  | 'CC-BY-NC-ND-4.0'   // Добавлено
  | 'CUSTOM';

// P0: Journey Pacing
export interface JourneyPacing {
  recommendedInterval?: string;
  maxSessionsPerWeek?: number;
}

// P0: Ethical Rule с действием
export interface EthicalRule {
  rule: string;
  action: EthicalAction;
}

// P0: Referral Protocol
export interface ReferralProtocol {
  triggers: string[];
  message: string;
}

// P0: Memory Transfer
export interface MemoryTransfer {
  enabled: boolean;
  scope: 'hot' | 'warm' | 'full';
}

// Лицензионная информация
export interface LicenseTerms {
  canUse: boolean;
  canModify: boolean;
  canDistribute: boolean;
  canUseCommercially: boolean;
  mustAttribute: boolean;
  mustShareAlike: boolean;
}

export interface LicenseInfo {
  type: LicenseType;
  terms: LicenseTerms;
  attribution?: string;
  expiresAt?: string;
}

export interface PersonalityTrait {
  creativity: number;
  formality: number;
  empathy: number;
  assertiveness: number;
  patience: number;
}

// P0: Расширенная Session
export interface Session {
  id: string;
  title: string;
  tasks: string[];
  estimatedDuration?: number;
  outcomes?: string[];
}

export interface SubRole {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  // Step 1: Base Info
  id: string;
  name: string;
  archetype: Archetype;
  roleType: RoleType;
  description: string;
  mainGoal: string;
  responseLength: ResponseLength;

  // P0: Метаданные для публикации
  status: RoleStatus;
  version: string;
  category: Category;
  tags: string[];

  // Step 2: Portrait
  age: string;
  visualStyle: VisualStyle;
  visualDetails: string;
  visualAccent: string;
  environment: Environment;
  atmosphere: string;
  imageStyle: ImageStyle;
  lighting: Lighting;

  // Step 3: Behavior
  greeting: string;
  tone: Tone;
  emotionalRange: EmotionalRange;
  personality: PersonalityTrait;
  shouldDo: string[];
  shouldNotDo: string[];

  // Step 4: Expertise
  expertiseAreas: string[];
  tools: string[];
  outputFormats: string[];
  additionalRules: string;

  // Step 5: Journey
  sessions: Session[];
  journeyPacing?: JourneyPacing;

  // Step 6: Team
  teamEnabled: boolean;
  orchestrator: string;
  subRoles: SubRole[];
  taskProtocol: string;
  memoryTransfer?: MemoryTransfer;

  // Step 7: Memory
  hotMemory: string;
  warmMemory: string;
  coldMemory: string;
  memoryStrategy: MemoryStrategy;
  emotionalStates: string[];

  // Step 8: Ethics
  ethicalRules: EthicalRule[];
  referralProtocol?: ReferralProtocol;
  disclaimer: string;
  author: string;
  contacts: string;
  changelog: string[];
  
  // License
  license?: LicenseInfo;
  
  // RML Identity
  rmlIdentity?: {
    fullId?: string;
    reference?: string;
    baseHash?: string;
    visualHash?: string;
    toneHash?: string;
    expertiseHash?: string;
    journeyHash?: string;
    teamHash?: string;
    memoryHash?: string;
    ethicsHash?: string;
  };
  
  identityMetadata?: {
    generatedAt: string;
    schemaVersion: '1.0';
    canonical: boolean;
  };

  // Meta
  createdAt: string;
  updatedAt: string;
}