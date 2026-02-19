// /src/core/domain/role/enums.ts
export type Archetype = 
  | 'mentor'      // M
  | 'creator'     // C
  | 'analyst'     // A
  | 'healer'      // H
  | 'explorer'    // E
  | 'advisor'     // V
  | 'negotiator'  // N
  | 'caregiver';  // G

export type Category =
  | 'health'       // H
  | 'productivity' // P
  | 'daily'        // D
  | 'finance'      // F
  | 'relationships' // R
  | 'development'  // V
  | 'technology'   // T
  | 'entertainment'; // E

export type RoleStatus = 'draft' | 'published' | 'archived';
export type RoleType = 'professional' | 'personal' | 'educational' | 'creative';