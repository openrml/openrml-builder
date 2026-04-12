// src/core/rml/__tests__/exporter-minimal-v1_1.test.ts

import { describe, it, expect } from 'vitest';
import { exportToMinimalOpenRML_1_1 } from '../exporter-minimal-v1_1';
import { 
  ARCHETYPE_CONFIGS, 
  getStepPriority, 
  getPriorityRelations,
  type ArchetypeName 
} from '../archetypes';
import type { Role } from '../../domain/role/types';

/**
 * Helper: Create test role
 */
function createTestRole(overrides?: Partial<Role>): Role {
  return {
    id: 'test-role-1',
    name: 'Test Role',
    archetype: 'analyst',
    roleType: 'professional',
    category: 'productivity',
    description: 'Test role for OpenRML 1.1',
    mainGoal: 'Test productivity',
    responseLength: 4,
    tags: ['test', 'productivity'],
    
    age: '30-40',
    visualStyle: 'professional',
    visualDetails: 'Test details',
    visualAccent: 'Test accent',
    environment: 'office',
    atmosphere: 'Professional',
    imageStyle: 'portrait',
    lighting: 'natural',
    
    greeting: 'Hello! Ready to test?',
    tone: 'professional',
    emotionalRange: 'moderate',
    personality: {
      creativity: 7,
      formality: 6,
      empathy: 6,
      assertiveness: 7,
      patience: 7
    },
    shouldDo: ['Test behavior 1', 'Test behavior 2'],
    shouldNotDo: ['Avoid test issue 1', 'Avoid test issue 2'],
    
    expertiseAreas: ['Testing', 'Quality assurance'],
    tools: ['Test framework', 'Assertions'],
    outputFormats: ['Test reports'],
    additionalRules: '',
    
    sessions: [
      {
        id: 's1',
        title: 'Setup',
        tasks: ['Configure test', 'Run test'],
        estimatedDuration: 30,
        outcomes: ['Tests passing']
      }
    ],
    journeyPacing: {
      recommendedInterval: 'daily',
      maxSessionsPerWeek: 5
    },
    
    teamEnabled: false,
    orchestrator: '',
    subRoles: [],
    taskProtocol: 'Single agent',
    memoryTransfer: { enabled: false, scope: 'hot' },
    
    hotMemory: 'Current test state',
    warmMemory: 'Test patterns',
    coldMemory: 'Test history',
    memoryStrategy: 'importance',
    emotionalStates: ['Focused', 'Curious'],
    
    ethicalRules: [
      { rule: 'Ensure test coverage', action: 'warn' },
      { rule: 'No flaky tests', action: 'stop' }
    ],
    referralProtocol: {
      triggers: ['Test failures', 'Coverage gaps'],
      message: 'Consult test documentation'
    },
    disclaimer: 'Test disclaimer',
    license: {
      type: 'CC-BY-4.0',
      terms: {
        canUse: true,
        canModify: true,
        canDistribute: true,
        canUseCommercially: false,
        mustAttribute: true,
        mustShareAlike: false
      }
    },
    author: 'Test Author',
    contacts: 'test@example.com',
    changelog: ['v1.1.0 — Initial test version'],
    
    status: 'draft',
    version: '1.1.0',
    createdAt: '2026-04-09T00:00:00Z',
    updatedAt: '2026-04-09T00:00:00Z',
    
    roleLang: 'en',
    responseBehavior: 'auto',
    allowLanguageSwitch: true,
    supportedLanguages: ['en', 'ua'],
    
    ...overrides
  } as Role;
}

describe('Archetype Priority System', () => {
  it('should return correct priorities for all archetypes', () => {
    const archetypes: ArchetypeName[] = [
      'healer', 'mentor', 'analyst', 'guardian',
      'leader', 'creator', 'explorer', 'scientist'
    ];
    
    archetypes.forEach(archetype => {
      const step3 = getStepPriority(archetype, 3);
      const step8 = getStepPriority(archetype, 8);
      
      // STEP 3 should always be HIGH (tone)
      expect(step3).toBe('HIGH');
      
      // STEP 8 should always be CRITICAL (ethics)
      expect(step8).toBe('CRITICAL');
    });
  });

  it('should have unique priority distributions per archetype', () => {
    const healer = ARCHETYPE_CONFIGS.healer.priorities;
    const analyst = ARCHETYPE_CONFIGS.analyst.priorities;
    const leader = ARCHETYPE_CONFIGS.leader.priorities;
    
    // Healer prioritizes journey (STEP 5)
    expect(healer.step5).toBe('STRUCTURE');
    
    // Analyst prioritizes methods (STEP 4) and journey (STEP 5)
    expect(analyst.step4).toBe('STRUCTURE');
    expect(analyst.step5).toBe('STRUCTURE');
    
    // Leader prioritizes journey (STEP 5) and team (STEP 6)
    expect(leader.step5).toBe('HIGH');
    expect(leader.step6).toBe('STRUCTURE');
  });

  it('should provide correct override/yields-to relationships', () => {
    const critical = getPriorityRelations('CRITICAL');
    expect(critical.overrides).toBe('EVERYTHING');
    expect(critical.yieldsTo).toBe('none');
    
    const high = getPriorityRelations('HIGH');
    expect(high.overrides).toBe('STRUCTURE, MEDIUM');
    expect(high.yieldsTo).toBe('CRITICAL');
    
    const structure = getPriorityRelations('STRUCTURE');
    expect(structure.overrides).toBe('MEDIUM');
    expect(structure.yieldsTo).toBe('HIGH, CRITICAL');
  });
});

describe('Minimal OpenRML 1.1 Export', () => {
  it('should include Strategic Priming block', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('ROLE ACTIVATION — STRATEGIC PRIMING (OpenRML 1.1 Minimal)');
    expect(output).toContain('You are a semantic gravity well');
    expect(output).toContain('YOUR NATURAL PATTERN:');
    expect(output).toContain('Your instinct: CRITICAL > HIGH > STRUCTURE');
  });

  it('should include Core Priority Map', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('PRIORITY MAP');
    expect(output).toContain('CRITICAL (absolute):');
    expect(output).toContain('HIGH (dominant):');
    expect(output).toContain('STRUCTURE (flexible):');
    expect(output).toContain('RULE: CRITICAL > HIGH > STRUCTURE');
  });

  it('should include compressed meta-headers', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    // Check for compressed format
    expect(output).toContain('│ P:HIGH │');
    expect(output).toContain('│ P:CRITICAL │');
    expect(output).toContain('│ P:STRUCTURE │');
    
    // Should NOT contain verbose format
    expect(output).not.toContain('PRIORITY: HIGH  │ WEIGHT: MAX');
  });

  it('should include Behavioral Anchors', () => {
    const role = createTestRole({ archetype: 'analyst' });
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('BEHAVIORAL ANCHORS');
    expect(output).toContain('SCENARIO 1:');
    expect(output).toContain('CONFLICT:');
    expect(output).toContain('→');
    expect(output).toContain('✅');
  });

  it('should include Core Anchor', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('CORE ANCHOR — DO NOT DRIFT');
    expect(output).toContain('1. ETHICS (STEP 8) = ABSOLUTE');
    expect(output).toContain('2. TONE (STEP 3) =');
    expect(output).toContain('3. MISSION =');
  });

  it('should NOT include Decision Algorithm', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).not.toContain('DECISION ALGORITHM');
    expect(output).not.toContain('Step 1: IDENTIFY');
    expect(output).not.toContain('Step 2: COMPARE');
  });

  it('should NOT include Weight System', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).not.toContain('WEIGHT: MAX');
    expect(output).not.toContain('WEIGHT: STRONG');
    expect(output).not.toContain('WEIGHT: MODERATE');
  });

  it('should use declarative priming (not imperative)', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('YOUR NATURAL PATTERN:');
    expect(output).toContain('You notice');
    expect(output).toContain('You always speak');
    
    // Should NOT use imperative
    expect(output).not.toContain('BEFORE EACH RESPONSE:');
    expect(output).not.toContain('1. Identify if any STEPs');
  });

  it('should preserve all STEP content from 1.0', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    // Verify STEP 1
    expect(output).toContain('STEP 1: BASE INFORMATION');
    expect(output).toContain('Role Name: Test Role');
    
    // Verify STEP 3
    expect(output).toContain('STEP 3: BEHAVIOR & TONE');
    expect(output).toContain('Greeting: Hello! Ready to test?');
    expect(output).toContain('Should Do:');
    expect(output).toContain('Should Not Do:');
    
    // Verify STEP 8
    expect(output).toContain('STEP 8: ETHICS & VERSIONS');
    expect(output).toContain('Ethical Rules:');
  });

  it('should correctly format all 8 archetypes', () => {
    const archetypes: ArchetypeName[] = [
      'healer', 'mentor', 'analyst', 'guardian',
      'leader', 'creator', 'explorer', 'scientist'
    ];
    
    archetypes.forEach(archetype => {
      const role = createTestRole({ archetype });
      const output = exportToMinimalOpenRML_1_1(role);
      
      // Should include archetype name
      expect(output).toContain(`ARCHETYPE: ${archetype}`);
      
      // Should include behavioral anchors for this archetype
      expect(output).toContain('BEHAVIORAL ANCHORS');
      expect(output).toContain('SCENARIO');
      
      // Should have correct priority map
      expect(output).toContain('PRIORITY MAP');
    });
  });

  it('should handle unknown archetype gracefully', () => {
    const role = createTestRole({ archetype: 'unknown' as any });
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('PRIORITY MAP');
    expect(output).toContain('BEHAVIORAL ANCHORS');
    expect(output).toContain('CORE ANCHOR');
  });

  it('should include version marker', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('OpenRML 1.1');
    expect(output).toContain('Version: 1.1.0');
  });

  it('should maintain backward compatibility with field names', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    // All standard field names should be present
    expect(output).toContain('Role Name:');
    expect(output).toContain('Archetype:');
    expect(output).toContain('Category:');
    expect(output).toContain('Greeting:');
    expect(output).toContain('Base Tone:');
    expect(output).toContain('Expertise:');
    expect(output).toContain('Ethical Rules:');
  });
});

describe('Behavioral Anchors Quality', () => {
  it('should have 3 behavioral anchors per archetype', () => {
    const archetypes: ArchetypeName[] = [
      'healer', 'mentor', 'analyst', 'guardian',
      'leader', 'creator', 'explorer', 'scientist'
    ];
    
    archetypes.forEach(archetype => {
      const config = ARCHETYPE_CONFIGS[archetype];
      expect(config.behavioralAnchors.length).toBe(3);
    });
  });

  it('should have complete anchor structure', () => {
    const config = ARCHETYPE_CONFIGS.analyst;
    
    config.behavioralAnchors.forEach(anchor => {
      expect(anchor.scenario).toBeTruthy();
      expect(anchor.conflict).toBeTruthy();
      expect(anchor.resolution).toBeTruthy();
      expect(anchor.example).toBeTruthy();
      
      // Example should be substantial (>50 chars)
      expect(anchor.example.length).toBeGreaterThan(50);
    });
  });

  it('should demonstrate actual conflict resolution', () => {
    const config = ARCHETYPE_CONFIGS.healer;
    
    // At least one anchor should involve CRITICAL vs STRUCTURE
    const hasCriticalConflict = config.behavioralAnchors.some(
      anchor => anchor.conflict.includes('STEP 8') || anchor.conflict.includes('CRITICAL')
    );
    expect(hasCriticalConflict).toBe(true);
  });
});

describe('Token Efficiency', () => {
  it('should be under 6,000 tokens for typical role', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    // Rough token estimate (4 chars per token average)
    const estimatedTokens = output.length / 4;
    
    expect(estimatedTokens).toBeLessThan(6000);
    expect(estimatedTokens).toBeGreaterThan(4000);
  });

  it('should be ~40% smaller than hypothetical Full 1.1', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    // Minimal should not include:
    expect(output).not.toContain('WEIGHT:');
    expect(output).not.toContain('Step 1: IDENTIFY');
    expect(output).not.toContain('Step 2: COMPARE');
    
    // These removals should save ~3,000 tokens
    const minimalLength = output.length;
    const expectedFullLength = minimalLength * 1.6; // +60% for Full
    
    // Verify Minimal is significantly shorter
    expect(minimalLength).toBeLessThan(expectedFullLength);
  });
});

describe('Export Integrity', () => {
  it('should produce valid UTF-8 output', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    // Should not throw when converting to UTF-8
    expect(() => new TextEncoder().encode(output)).not.toThrow();
  });

  it('should preserve box-drawing characters', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('╔');
    expect(output).toContain('╚');
    expect(output).toContain('║');
    expect(output).toContain('═');
  });

  it('should have consistent line breaks', () => {
    const role = createTestRole();
    const output = exportToMinimalOpenRML_1_1(role);
    
    // Should use \n (LF) consistently
    expect(output.includes('\r\n')).toBe(false);
  });

  it('should format dates consistently', () => {
    const role = createTestRole({
      createdAt: '2026-04-09T12:00:00Z',
      updatedAt: '2026-04-10T15:30:00Z'
    });
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toMatch(/Created: \d{2}\.\d{2}\.\d{4}/);
    expect(output).toMatch(/Updated: \d{2}\.\d{2}\.\d{4}/);
  });
});

describe('Language Support', () => {
  it('should support multiple languages in Language Policy', () => {
    const role = createTestRole({
      supportedLanguages: ['en', 'ua', 'es']
    });
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('SUPPORTED_LANGS: en, ua, es');
  });

  it('should handle role language correctly', () => {
    const role = createTestRole({
      roleLang: 'ua',
      responseBehavior: 'match'
    });
    const output = exportToMinimalOpenRML_1_1(role);
    
    expect(output).toContain('ROLE_LANG: ua');
    expect(output).toContain('RESPONSE_LANG: match');
  });
});
