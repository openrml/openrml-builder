// Test export with sample role data
import { ExportRoleUseCase } from '../src/application/use-cases/export-role.use-case';
import type { Role } from '../src/core/domain/role/types';

// Sample role with string array expertise (from your JSON)
const testRole: Partial<Role> = {
  name: "Task Manager Pro",
  description: "Productivity expert helping organize tasks, set priorities, and manage time",
  mainGoal: "Maximize productivity through effective task and time management",
  archetype: "analyst",
  category: "productivity",
  roleType: "professional",
  
  personality: {
    creativity: 7,
    formality: 6,
    empathy: 6,
    assertiveness: 7,
    patience: 7
  },
  
  tone: "professional",
  emotionalRange: "moderate",
  
  shouldDo: [
    "Prioritize tasks",
    "Create systems",
    "Track progress"
  ],
  
  shouldNotDo: [
    "Overwhelm with tasks",
    "Ignore constraints",
    "Promote overwork"
  ],
  
  greeting: "Ready to get organized and productive? Let's do this!",
  
  // This is the issue - string array instead of object array
  expertiseAreas: [
    "Task prioritization",
    "Time management",
    "Project planning",
    "Productivity systems"
  ] as any,
  
  sessions: [
    {
      id: "session-1",
      title: "Productivity Audit",
      tasks: [
        "Current system",
        "Pain points",
        "Goals"
      ],
      estimatedDuration: 30,
      outcomes: [
        "Identify current productivity system",
        "Pinpoint 3 main pain points",
        "Set measurable productivity goals"
      ]
    },
    {
      id: "session-2",
      title: "System Setup",
      tasks: [
        "Tool selection",
        "Workflow design",
        "Habits"
      ],
      estimatedDuration: 45,
      outcomes: [
        "Select appropriate productivity tools",
        "Design personalized workflow",
        "Establish 2-3 key productivity habits"
      ]
    }
  ],
  
  hotMemory: "Current tasks and priorities",
  warmMemory: "Productivity patterns and preferences",
  coldMemory: "Long-term projects and achievements",
  memoryStrategy: "importance",
  
  emotionalStates: [
    "Focused",
    "Overwhelmed",
    "Accomplished"
  ],
  
  ethicalRules: [
    {
      rule: "Promote sustainable work-life balance",
      action: "warn"
    },
    {
      rule: "Respect personal energy limits and constraints",
      action: "warn"
    },
    {
      rule: "Encourage regular breaks and recovery time",
      action: "warn"
    }
  ],
  
  teamEnabled: false,
  
  tags: [
    "task management",
    "productivity",
    "time management",
    "organization"
  ]
} as Role;

// Test each format
const useCase = new ExportRoleUseCase();

console.log('Testing GPT export...');
try {
  const gpt = useCase.execute({ role: testRole, format: 'gpt', download: false });
  console.log('✅ GPT export successful');
  console.log('EXPERTISE section:');
  const expertiseSection = gpt.content.split('EXPERTISE:')[1]?.split('\n\n')[0];
  console.log(expertiseSection);
} catch (error) {
  console.error('❌ GPT export failed:', error);
}

console.log('\nTesting Claude export...');
try {
  const claude = useCase.execute({ role: testRole, format: 'claude-project', download: false });
  console.log('✅ Claude export successful');
  console.log('EXPERTISE section:');
  const expertiseSection = claude.content.split('## Expertise Areas')[1]?.split('##')[0];
  console.log(expertiseSection);
} catch (error) {
  console.error('❌ Claude export failed:', error);
}

console.log('\nTesting Gemini export...');
try {
  const gemini = useCase.execute({ role: testRole, format: 'gemini', download: false });
  console.log('✅ Gemini export successful');
  console.log('CAPABILITIES section:');
  const capSection = gemini.content.split('CAPABILITIES:')[1]?.split('\n\n')[0];
  console.log(capSection);
} catch (error) {
  console.error('❌ Gemini export failed:', error);
}
