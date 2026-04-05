// src/application/use-cases/validate-role.use-case.ts

import { 
  isValidRole, 
  getRoleValidationErrors,
  assertValidRole 
} from '@/core/domain/role/role.schema';
import type { Role } from '@/core/domain/role/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[] | null;
  role?: Role;
}

/**
 * Validates a role object and returns detailed validation result
 * 
 * @param data - Unknown data to validate as Role
 * @returns ValidationResult with validation status and errors
 * 
 * @example
 * ```typescript
 * const result = validateRoleUseCase(importedData);
 * if (result.isValid) {
 *   // Safe to use result.role
 *   await saveRole(result.role);
 * } else {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateRoleUseCase(data: unknown): ValidationResult {
  if (isValidRole(data)) {
    return {
      isValid: true,
      errors: null,
      role: data,
    };
  }

  const errors = getRoleValidationErrors(data);
  return {
    isValid: false,
    errors,
  };
}

/**
 * Validates a role and throws if invalid
 * Useful for pipelines where you want to fail fast
 * 
 * @param data - Unknown data to validate as Role
 * @returns Validated Role object
 * @throws Error if validation fails
 * 
 * @example
 * ```typescript
 * try {
 *   const role = validateRoleStrictUseCase(importedData);
 *   await processRole(role);
 * } catch (error) {
 *   showErrorToUser(error.message);
 * }
 * ```
 */
export function validateRoleStrictUseCase(data: unknown): Role {
  assertValidRole(data);
  return data;
}

/**
 * Validates multiple roles and returns results for each
 * 
 * @param roles - Array of unknown data to validate
 * @returns Array of validation results
 * 
 * @example
 * ```typescript
 * const results = validateMultipleRolesUseCase(importedRoles);
 * const valid = results.filter(r => r.isValid).map(r => r.role);
 * const invalid = results.filter(r => !r.isValid);
 * 
 * console.log(`${valid.length} valid, ${invalid.length} invalid`);
 * ```
 */
export function validateMultipleRolesUseCase(
  roles: unknown[]
): ValidationResult[] {
  return roles.map(role => validateRoleUseCase(role));
}

/**
 * Validates a role with business rules in addition to schema validation
 * 
 * @param data - Unknown data to validate
 * @returns ValidationResult with schema and business rule errors
 */
export function validateRoleWithBusinessRulesUseCase(
  data: unknown
): ValidationResult {
  // First, validate against schema
  const schemaResult = validateRoleUseCase(data);
  
  if (!schemaResult.isValid || !schemaResult.role) {
    return schemaResult;
  }

  const role = schemaResult.role;
  const businessErrors: string[] = [];

  // Business Rule 1: Team-enabled roles must have sub-roles
  if (role.teamEnabled && role.subRoles.length === 0) {
    businessErrors.push(
      'Business Rule Violation: Team-enabled roles must have at least one sub-role'
    );
  }

  // Business Rule 2: Roles with sessions should have journey pacing
  if (role.sessions.length > 0 && !role.journeyPacing) {
    businessErrors.push(
      'Business Rule Violation: Roles with journey sessions should define journeyPacing'
    );
  }

  // Business Rule 3: Published roles should have proper versioning
  if (role.status === 'published' && !role.version.match(/^\d+\.\d+\.\d+$/)) {
    businessErrors.push(
      'Business Rule Violation: Published roles must use semantic versioning (e.g., 1.0.0)'
    );
  }

  // Business Rule 4: Roles with memory transfer must be team-enabled
  if (role.memoryTransfer?.enabled && !role.teamEnabled) {
    businessErrors.push(
      'Business Rule Violation: Memory transfer requires team collaboration to be enabled'
    );
  }

  // Business Rule 5: Ethical rules with "refer" action should have referral protocol
  const hasReferAction = role.ethicalRules.some(rule => rule.action === 'refer');
  if (hasReferAction && !role.referralProtocol) {
    businessErrors.push(
      'Business Rule Violation: Roles with "refer" ethical actions must define a referralProtocol'
    );
  }

  if (businessErrors.length > 0) {
    return {
      isValid: false,
      errors: businessErrors,
      role,
    };
  }

  return {
    isValid: true,
    errors: null,
    role,
  };
}
