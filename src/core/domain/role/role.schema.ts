// src/core/domain/role/role.schema.ts

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import roleSchema from './role.schema.json';
import type { Role } from './types';

/**
 * AJV validator instance for Role schema validation
 */
const ajv = new Ajv({
  allErrors: true,
  strict: false,  // Изменено: отключаем strict mode для совместимости
  validateFormats: true,
});

// Add format validators (date-time, etc.)
addFormats(ajv);

/**
 * Compiled validation function
 */
export const validateRole = ajv.compile(roleSchema);

/**
 * Validates a Role object against the JSON Schema
 * @param role - Role object to validate
 * @returns Validation result with errors if invalid
 */
export function isValidRole(role: unknown): role is Role {
  return validateRole(role);
}

/**
 * Validates a Role and throws an error if invalid
 * @param role - Role object to validate
 * @throws Error with validation errors if invalid
 */
export function assertValidRole(role: unknown): asserts role is Role {
  if (!validateRole(role)) {
    const errors = validateRole.errors?.map(err => 
      `${err.instancePath} ${err.message}`
    ).join(', ') || 'Unknown validation error';
    
    throw new Error(`Role validation failed: ${errors}`);
  }
}

/**
 * Gets detailed validation errors for a Role
 * @param role - Role object to validate
 * @returns Array of validation error messages, or null if valid
 */
export function getRoleValidationErrors(role: unknown): string[] | null {
  if (validateRole(role)) {
    return null;
  }
  
  return validateRole.errors?.map(err => ({
    path: err.instancePath,
    message: err.message || 'Validation error',
    params: err.params,
  })).map(e => 
    `${e.path || 'root'}: ${e.message}${
      Object.keys(e.params).length > 0 
        ? ` (${JSON.stringify(e.params)})` 
        : ''
    }`
  ) || ['Unknown validation error'];
}

/**
 * Schema metadata
 */
export const ROLE_SCHEMA_VERSION = '1.0.0';
export const ROLE_SCHEMA_ID = 'https://openrml.org/schemas/role/1.0.0';

/**
 * Export the raw schema for reference
 */
export { roleSchema };