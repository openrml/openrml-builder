// src/core/domain/role/role.schema.test.ts

import { describe, it, expect } from 'vitest';
import { 
  isValidRole, 
  assertValidRole, 
  getRoleValidationErrors,
  ROLE_SCHEMA_VERSION 
} from './role.schema';
import type { Role } from './types';

describe('Role JSON Schema Validation', () => {
  const createValidRole = (): Role => ({
    id: 'test-role-123',
    name: 'Test Role',
    archetype: 'mentor',
    roleType: 'educational',
    description: 'A test role for validation',
    mainGoal: 'Test the validation system',
    responseLength: 5,
    roleLang: 'en',
    
    status: 'draft',
    version: '1.0.0',
    category: 'development',
    tags: ['test', 'validation'],
    
    age: '30-40',
    visualStyle: 'professional',
    visualDetails: 'Professional appearance',
    visualAccent: 'Glasses',
    environment: 'office',
    atmosphere: 'Focused and calm',
    imageStyle: 'professional',
    lighting: 'studio',
    
    greeting: 'Hello! I am your test role.',
    tone: 'professional',
    emotionalRange: 'moderate',
    personality: {
      creativity: 7,
      formality: 6,
      empathy: 8,
      assertiveness: 7,
      patience: 9,
    },
    shouldDo: ['Be helpful', 'Validate inputs'],
    shouldNotDo: ['Make assumptions', 'Skip validation'],
    
    expertiseAreas: ['Testing', 'Validation'],
    tools: ['Jest', 'Vitest'],
    outputFormats: ['JSON', 'Text'],
    additionalRules: 'Always validate before processing',
    
    sessions: [
      {
        id: 'session-1',
        title: 'Introduction',
        tasks: ['Learn basics', 'Setup environment'],
        estimatedDuration: 30,
        outcomes: ['Understanding of basics'],
      },
    ],
    
    teamEnabled: false,
    orchestrator: 'N/A',
    subRoles: [],
    taskProtocol: 'Single agent operation',
    
    hotMemory: 'Current context',
    warmMemory: 'Recent history',
    coldMemory: 'Long-term knowledge',
    memoryStrategy: 'semantic',
    emotionalStates: ['focused', 'confused'],
    
    ethicalRules: [
      { rule: 'Respect privacy', action: 'stop' },
      { rule: 'Verify sources', action: 'warn' },
    ],
    disclaimer: 'This is a test role',
    author: 'Test Author',
    contacts: 'test@example.com',
    changelog: ['1.0.0: Initial version'],
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  describe('Valid Role Objects', () => {
    it('should validate a complete valid role', () => {
      const role = createValidRole();
      expect(isValidRole(role)).toBe(true);
      expect(getRoleValidationErrors(role)).toBeNull();
    });

    it('should not throw for valid role with assertValidRole', () => {
      const role = createValidRole();
      expect(() => assertValidRole(role)).not.toThrow();
    });

    it('should validate role with optional fields', () => {
      const role = createValidRole();
      role.supportedLanguages = ['en', 'ua', 'es'];
      role.responseBehavior = 'auto';
      role.allowLanguageSwitch = true;
      role.journeyPacing = {
        recommendedInterval: 'weekly',
        maxSessionsPerWeek: 3,
      };
      role.memoryTransfer = {
        enabled: true,
        scope: 'warm',
      };
      role.referralProtocol = {
        triggers: ['Medical emergency', 'Legal issue'],
        message: 'Please consult a professional',
      };
      role.license = {
        type: 'CC-BY-4.0',
        terms: {
          canUse: true,
          canModify: true,
          canDistribute: true,
          canUseCommercially: true,
          mustAttribute: true,
          mustShareAlike: false,
        },
        attribution: 'Test Author',
      };
      
      expect(isValidRole(role)).toBe(true);
    });

    it('should validate role with RML identity', () => {
      const role = createValidRole();
      role.rmlIdentity = {
        fullId: 'ORML/CT/1.0.0/3d0b/4327/5287/167f/237c/e3c9/f4a8/b610',
        reference: 'orml://test-author/test-role/1.0.0',
        baseHash: '3d0b',
        visualHash: '4327',
        toneHash: '5287',
        expertiseHash: '167f',
        journeyHash: '237c',
        teamHash: 'e3c9',
        memoryHash: 'f4a8',
        ethicsHash: 'b610',
      };
      role.identityMetadata = {
        generatedAt: new Date().toISOString(),
        schemaVersion: '1.0',
        canonical: true,
      };
      
      expect(isValidRole(role)).toBe(true);
    });
  });

  describe('Invalid Role Objects', () => {
    it('should reject role with missing required field', () => {
      const role = createValidRole();
      delete (role as any).name;
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors).not.toBeNull();
      expect(errors?.[0]).toContain('name');
    });

    it('should reject role with invalid archetype', () => {
      const role = createValidRole();
      (role as any).archetype = 'invalid-archetype';
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('archetype');
    });

    it('should reject role with invalid version format', () => {
      const role = createValidRole();
      role.version = 'not-a-version';
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('version');
    });

    it('should reject role with responseLength out of range', () => {
      const role = createValidRole();
      role.responseLength = 15;
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('responseLength');
    });

    it('should reject role with personality trait out of range', () => {
      const role = createValidRole();
      role.personality.creativity = 11;
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('creativity');
    });

    it('should reject role with empty shouldDo array', () => {
      const role = createValidRole();
      role.shouldDo = [];
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('shouldDo');
    });

    it('should reject role with too many tags', () => {
      const role = createValidRole();
      role.tags = Array(25).fill('tag');
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('tags');
    });

    it('should reject role with invalid date format', () => {
      const role = createValidRole();
      role.createdAt = 'not-a-date';
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('createdAt');
    });

    it('should throw with assertValidRole on invalid role', () => {
      const role = createValidRole();
      delete (role as any).name;
      
      expect(() => assertValidRole(role)).toThrow('Role validation failed');
    });

    it('should reject role with invalid ethical action', () => {
      const role = createValidRole();
      (role.ethicalRules[0] as any).action = 'invalid-action';
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('action');
    });

    it('should reject role with session missing required fields', () => {
      const role = createValidRole();
      delete (role.sessions[0] as any).title;
      
      expect(isValidRole(role)).toBe(false);
      const errors = getRoleValidationErrors(role);
      expect(errors?.[0]).toContain('title');
    });
  });

  describe('String Length Constraints', () => {
    it('should reject name longer than 200 characters', () => {
      const role = createValidRole();
      role.name = 'a'.repeat(201);
      
      expect(isValidRole(role)).toBe(false);
    });

    it('should reject description longer than 1000 characters', () => {
      const role = createValidRole();
      role.description = 'a'.repeat(1001);
      
      expect(isValidRole(role)).toBe(false);
    });

    it('should reject additionalRules longer than 2000 characters', () => {
      const role = createValidRole();
      role.additionalRules = 'a'.repeat(2001);
      
      expect(isValidRole(role)).toBe(false);
    });
  });

  describe('Enum Validations', () => {
    it('should accept all valid archetypes', () => {
      const archetypes = [
        'mentor', 'creator', 'analyst', 'healer', 
        'scientist', 'leader', 'explorer', 'guardian',
        'advisor', 'negotiator', 'caregiver'
      ];
      
      archetypes.forEach(archetype => {
        const role = createValidRole();
        role.archetype = archetype as any;
        expect(isValidRole(role)).toBe(true);
      });
    });

    it('should accept all valid categories', () => {
      const categories = [
        'health', 'productivity', 'daily', 'finance',
        'relationships', 'development', 'technology', 'entertainment'
      ];
      
      categories.forEach(category => {
        const role = createValidRole();
        role.category = category as any;
        expect(isValidRole(role)).toBe(true);
      });
    });

    it('should accept all valid license types', () => {
      const licenses = [
        'CC-BY-4.0', 'CC-BY-SA-4.0', 'CC-BY-NC-4.0',
        'CC-BY-NC-SA-4.0', 'CC-BY-ND-4.0', 'CC-BY-NC-ND-4.0', 'CUSTOM'
      ];
      
      licenses.forEach(licenseType => {
        const role = createValidRole();
        role.license = {
          type: licenseType as any,
          terms: {
            canUse: true,
            canModify: true,
            canDistribute: true,
            canUseCommercially: true,
            mustAttribute: true,
            mustShareAlike: false,
          },
        };
        expect(isValidRole(role)).toBe(true);
      });
    });
  });

  describe('Pattern Validations', () => {
    it('should validate correct RML identity patterns', () => {
      const role = createValidRole();
      role.rmlIdentity = {
        fullId: 'ORML/AB/1.2.3/1234/5678/90ab/cdef/1234/5678/90ab/cdef',
        reference: 'orml://author-name/role-name/1.2.3',
        baseHash: 'abcd',
      };
      
      expect(isValidRole(role)).toBe(true);
    });

    it('should reject invalid RML identity pattern', () => {
      const role = createValidRole();
      role.rmlIdentity = {
        fullId: 'invalid-format',
      };
      
      expect(isValidRole(role)).toBe(false);
    });

    it('should validate semantic version pattern', () => {
      const versions = ['1.0.0', '2.3.4', '0.0.1', '1.0.0-alpha', '1.0.0+build.123'];
      
      versions.forEach(version => {
        const role = createValidRole();
        role.version = version;
        expect(isValidRole(role)).toBe(true);
      });
    });
  });

  describe('Schema Metadata', () => {
    it('should have correct schema version', () => {
      expect(ROLE_SCHEMA_VERSION).toBe('1.0.0');
    });
  });

  describe('Complex Nested Objects', () => {
    it('should validate complex journey pacing', () => {
      const role = createValidRole();
      role.journeyPacing = {
        recommendedInterval: 'Every 2-3 days',
        maxSessionsPerWeek: 5,
      };
      
      expect(isValidRole(role)).toBe(true);
    });

    it('should validate memory transfer configuration', () => {
      const role = createValidRole();
      role.memoryTransfer = {
        enabled: true,
        scope: 'full',
      };
      
      expect(isValidRole(role)).toBe(true);
    });

    it('should reject memory transfer with invalid scope', () => {
      const role = createValidRole();
      role.memoryTransfer = {
        enabled: true,
        scope: 'invalid' as any,
      };
      
      expect(isValidRole(role)).toBe(false);
    });

    it('should validate sub-roles structure', () => {
      const role = createValidRole();
      role.teamEnabled = true;
      role.subRoles = [
        {
          id: 'sub-1',
          name: 'Sub Role 1',
          description: 'First sub-role',
        },
        {
          id: 'sub-2',
          name: 'Sub Role 2',
          description: 'Second sub-role',
        },
      ];
      
      expect(isValidRole(role)).toBe(true);
    });
  });
});
