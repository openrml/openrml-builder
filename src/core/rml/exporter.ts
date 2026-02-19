// src/core/rml/exporter.ts
import { Role } from '../domain/role/types';

export const exportRoleToText = (role: Role): string => {
  const sections: string[] = [];

// ========== ACTIVATION INSTRUCTIONS ==========
sections.push('Activate role from RML below:');
sections.push('1. ADOPT personality, goals, and behavior from STEPS 1–3.');
sections.push('2. FOLLOW the journey in STEP 5:');
sections.push('   - Start with Session 1 (or current session if continuing)');
sections.push('   - Complete all tasks in current session');
sections.push('   - When done, ask: "Ready for next session, or explore current topic deeper?"');
sections.push('3. ENFORCE boundaries and ethics from STEP 8 with highest priority.');
sections.push('4. USE memory from STEP 7 if available');
sections.push('5. Before responding, VERIFY no ethical or scope violation.');
sections.push('6. START with defined greeting');
sections.push('');
sections.push('READY. Starting:');
sections.push('');
  // ================================================

  sections.push('═══════════════════════════════════════════════════');
  
  // 🆕 RML IDENTITY BLOCK
  if (role.rmlIdentity?.fullId) {
    sections.push(`RML ${role.version || '1.0.0'} — ${role.name} [${role.status || 'draft'}]`);
    sections.push(`IDENTITY: ${role.rmlIdentity.fullId}`);
    if (role.rmlIdentity.reference) {
      sections.push(`REFERENCE: ${role.rmlIdentity.reference}`);
    }
    sections.push(`ARCHETYPE: ${role.archetype || 'mentor'}`);
    sections.push(`CATEGORY: ${role.category || 'productivity'}`);
    sections.push(`STATUS: ${role.status || 'draft'}`);
    sections.push(`AUTHOR: ${role.author || 'anonymous'}`);
    sections.push(`CREATED: ${role.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}`);
    sections.push(`UPDATED: ${role.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0]}`);
    sections.push('═══════════════════════════════════════════════════');
    sections.push('');
    
    sections.push('📋 STEP 1: BASE INFORMATION');
    sections.push('─────────────────────────────────────────────────');
    sections.push(`Role Name: ${role.name}`);
    sections.push(`Status: ${role.status || 'draft'}`);
    sections.push(`Version: ${role.version || '1.0.0'}`);
    sections.push(`Category: ${role.category || 'productivity'}`);
    sections.push(`Archetype: ${role.archetype}`);
    sections.push(`Role Type: ${role.roleType}`);
    sections.push(`Description: ${role.description}`);
    sections.push(`Main Goal: ${role.mainGoal}`);
    sections.push(`Response Length: ${role.responseLength}/7`);
    
    if (role.tags && role.tags.length > 0) {
      sections.push(`Tags: ${role.tags.join(', ')}`);
    }
    sections.push('');
  } else {
    sections.push(`RML ${role.version || '1.0.0'} — ${role.name} [${role.status || 'draft'}]`);
    sections.push('═══════════════════════════════════════════════════');
    sections.push('');
    
    sections.push('📋 STEP 1: BASE INFORMATION');
    sections.push('─────────────────────────────────────────────────');
    sections.push(`Role Name: ${role.name}`);
    sections.push(`Status: ${role.status || 'draft'}`);
    sections.push(`Version: ${role.version || '1.0.0'}`);
    sections.push(`Category: ${role.category || 'productivity'}`);
    sections.push(`Archetype: ${role.archetype}`);
    sections.push(`Role Type: ${role.roleType}`);
    sections.push(`Description: ${role.description}`);
    sections.push(`Main Goal: ${role.mainGoal}`);
    sections.push(`Response Length: ${role.responseLength}/7`);
    
    if (role.tags && role.tags.length > 0) {
      sections.push(`Tags: ${role.tags.join(', ')}`);
    }
    sections.push('');
  }

  // Step 2: Portrait
  sections.push('🎨 STEP 2: VISUAL PORTRAIT');
  sections.push('─────────────────────────────────────────────────');
  sections.push(`Age: ${role.age}`);
  sections.push(`Visual Style: ${role.visualStyle}`);
  sections.push(`Key Details: ${role.visualDetails}`);
  sections.push(`Visual Accent: ${role.visualAccent}`);
  sections.push(`Environment: ${role.environment}`);
  sections.push(`Atmosphere: ${role.atmosphere}`);
  sections.push(`Image Style: ${role.imageStyle}`);
  sections.push(`Lighting: ${role.lighting}`);
  sections.push('');

  // Step 3: Behavior
  sections.push('💬 STEP 3: BEHAVIOR & TONE');
  sections.push('─────────────────────────────────────────────────');
  sections.push(`Greeting: ${role.greeting}`);
  sections.push(`Base Tone: ${role.tone}`);
  sections.push(`Emotional Range: ${role.emotionalRange}`);
  sections.push('');
  sections.push('Personality Traits:');
  sections.push(`  Creativity: ${role.personality.creativity}/10`);
  sections.push(`  Formality: ${role.personality.formality}/10`);
  sections.push(`  Empathy: ${role.personality.empathy}/10`);
  sections.push(`  Assertiveness: ${role.personality.assertiveness}/10`);
  sections.push(`  Patience: ${role.personality.patience}/10`);
  sections.push('');
  
  if (role.shouldDo.length > 0) {
    sections.push('Should Do:');
    role.shouldDo.forEach(item => sections.push(`  ✓ ${item}`));
    sections.push('');
  }
  
  if (role.shouldNotDo.length > 0) {
    sections.push('Should Not Do:');
    role.shouldNotDo.forEach(item => sections.push(`  ✗ ${item}`));
    sections.push('');
  }

  // Step 4: Expertise
  sections.push('🎯 STEP 4: EXPERTISE & RULES');
  sections.push('─────────────────────────────────────────────────');
  
  if (role.expertiseAreas.length > 0) {
    sections.push('Expertise Areas:');
    role.expertiseAreas.forEach(area => sections.push(`  • ${area}`));
    sections.push('');
  }
  
  if (role.tools.length > 0) {
    sections.push('Tools & Methods:');
    role.tools.forEach(tool => sections.push(`  • ${tool}`));
    sections.push('');
  }
  
  if (role.outputFormats.length > 0) {
    sections.push('Output Formats:');
    role.outputFormats.forEach(format => sections.push(`  • ${format}`));
    sections.push('');
  }
  
  if (role.additionalRules) {
    sections.push(`Additional Rules: ${role.additionalRules}`);
    sections.push('');
  }

  // Step 5: Journey
  sections.push('🗺️ STEP 5: JOURNEY SESSIONS');
  sections.push('─────────────────────────────────────────────────');
  
  if (role.sessions.length > 0) {
    role.sessions.forEach((session, idx) => {
      sections.push(`Session ${idx + 1}: ${session.title}`);
      if (session.estimatedDuration) {
        sections.push(`  Duration: ${session.estimatedDuration} min`);
      }
      session.tasks.forEach(task => sections.push(`  ✓ ${task}`));
      if (session.outcomes && session.outcomes.length > 0) {
        sections.push('  Expected Outcomes:');
        session.outcomes.forEach(outcome => sections.push(`    • ${outcome}`));
      }
      sections.push('');
    });
  } else {
    sections.push('No journey sessions defined.');
    sections.push('');
  }

  if (role.journeyPacing) {
    sections.push('⏱️ JOURNEY PACING');
    sections.push('─────────────────────────────────────────────────');
    if (role.journeyPacing.recommendedInterval) {
      sections.push(`Recommended Interval: ${role.journeyPacing.recommendedInterval}`);
    }
    if (role.journeyPacing.maxSessionsPerWeek) {
      sections.push(`Max Sessions/Week: ${role.journeyPacing.maxSessionsPerWeek}`);
    }
    sections.push('');
  }

  sections.push('👥 STEP 6: TEAM COLLABORATION');
  sections.push('─────────────────────────────────────────────────');
  
  if (role.teamEnabled) {
    sections.push(`Team Enabled: Yes`);
    sections.push(`Orchestrator: ${role.orchestrator}`);
    sections.push('');
    
    if (role.subRoles.length > 0) {
      sections.push('Sub-roles:');
      role.subRoles.forEach(subRole => {
        sections.push(`  • ${subRole.name} — ${subRole.description}`);
      });
      sections.push('');
    }
    
    sections.push(`Task Protocol: ${role.taskProtocol}`);
    sections.push('');
    
    if (role.memoryTransfer?.enabled) {
      sections.push(`Memory Transfer: ${role.memoryTransfer.scope} memory`);
      sections.push('');
    }
  } else {
    sections.push('Team Enabled: No');
    sections.push('Orchestrator: N/A');
    sections.push('');
    sections.push('Sub-roles: None');
    sections.push('');
    sections.push('Task Protocol: This role operates as single-agent advisor.');
    sections.push('');
  }

  // Step 7: Memory
  sections.push('🧠 STEP 7: MEMORY SYSTEM');
  sections.push('─────────────────────────────────────────────────');
  sections.push(`Hot Memory: ${role.hotMemory}`);
  sections.push(`Warm Memory: ${role.warmMemory}`);
  sections.push(`Cold Memory: ${role.coldMemory}`);
  sections.push(`Memory Strategy: ${role.memoryStrategy}`);
  sections.push('');
  
  if (role.emotionalStates.length > 0) {
    sections.push('Emotional States Tracked:');
    role.emotionalStates.forEach(state => sections.push(`  • ${state}`));
    sections.push('');
  }

  // Step 8: Ethics
  sections.push('⚖️ STEP 8: ETHICS & VERSIONS');
  sections.push('─────────────────────────────────────────────────');
  
  if (role.ethicalRules && role.ethicalRules.length > 0) {
    sections.push('Ethical Rules:');
    role.ethicalRules.forEach(rule => {
      sections.push(`  ✓ [${rule.action.toUpperCase()}] ${rule.rule}`);
    });
    sections.push('');
  }
  
  if (role.referralProtocol) {
    sections.push('🔄 REFERRAL PROTOCOL');
    sections.push('─────────────────────────────────────────────────');
    if (role.referralProtocol.triggers.length > 0) {
      sections.push('Triggers:');
      role.referralProtocol.triggers.forEach(trigger => 
        sections.push(`  • ${trigger}`)
      );
      sections.push('');
    }
    if (role.referralProtocol.message) {
      sections.push(`Message: ${role.referralProtocol.message}`);
      sections.push('');
    }
  }
  
  sections.push(`Disclaimer: ${role.disclaimer}`);
  sections.push('');
  
  if (role.license) {
    sections.push('📜 LICENSE DETAILS');
    sections.push('─────────────────────────────────────────────────');
    sections.push(`License Type: ${role.license.type}`);
    sections.push('');
    
    const terms = role.license.terms;
    const licenseLines: string[] = [];
    
    if (terms.canUse) licenseLines.push('Can be used');
    if (terms.canModify) licenseLines.push('Can be modified');
    if (terms.canDistribute) licenseLines.push('Can be distributed');
    
    if (terms.canUseCommercially) {
      licenseLines.push('Can be used for commercial purposes');
    } else {
      licenseLines.push('Cannot be used for commercial purposes');
    }
    
    if (terms.mustAttribute) licenseLines.push('Must attribute the author');
    if (terms.mustShareAlike) licenseLines.push('Derivative works must use the same license');
    
    licenseLines.forEach(line => sections.push(line));
    
    if (role.license.attribution) {
      sections.push('');
      sections.push(`Attribution: ${role.license.attribution}`);
    }
    
    if (role.license.expiresAt) {
      sections.push(`Valid until: ${role.license.expiresAt}`);
    }
    sections.push('');
  }
  
  if (role.author) {
    sections.push(`Author: ${role.author}`);
  }
  if (role.contacts) {
    sections.push(`Contacts: ${role.contacts}`);
  }
  sections.push('');
  
  if (role.changelog.length > 0) {
    sections.push('Version History:');
    role.changelog.forEach(entry => sections.push(`  ${entry}`));
    sections.push('');
  }

  sections.push('═══════════════════════════════════════════════════');
  sections.push(`Created: ${new Date(role.createdAt).toLocaleDateString()}`);
  sections.push(`Updated: ${new Date(role.updatedAt).toLocaleDateString()}`);
  sections.push('═══════════════════════════════════════════════════');

  return sections.join('\n');
};

export const downloadRole = (role: Role): void => {
  const content = exportRoleToText(role);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${role.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_role.rml.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
