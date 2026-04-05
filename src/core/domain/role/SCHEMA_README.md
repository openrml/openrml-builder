# OpenRML Role JSON Schema

## Overview

This directory contains the JSON Schema definition for the OpenRML Role type, enabling validation, documentation, and type safety across the OpenRML ecosystem.

## Files

- **`role.schema.json`** - The canonical JSON Schema (Draft 2020-12) for Role validation
- **`role.schema.ts`** - TypeScript utilities for schema validation and type guards
- **`types.ts`** - TypeScript type definitions for the Role interface

## Quick Start

### Validating a Role

```typescript
import { isValidRole, getRoleValidationErrors } from './role.schema';
import type { Role } from './types';

const role: unknown = loadRoleFromSomewhere();

// Type guard validation
if (isValidRole(role)) {
  // TypeScript now knows 'role' is of type Role
  console.log(role.name);
} else {
  const errors = getRoleValidationErrors(role);
  console.error('Validation failed:', errors);
}
```

### Assert Validation (throws on error)

```typescript
import { assertValidRole } from './role.schema';

try {
  assertValidRole(role);
  // Safe to use role here
  processRole(role);
} catch (error) {
  console.error('Invalid role:', error.message);
}
```

## Schema Structure

The Role schema enforces the complete OpenRML specification across 8 steps:

### Step 1: Base Information
- `id`, `name`, `archetype`, `roleType`
- `status`, `version`, `category`, `tags`
- Language configuration: `roleLang`, `supportedLanguages`, `responseBehavior`

### Step 2: Visual Portrait
- `age`, `visualStyle`, `visualDetails`, `visualAccent`
- `environment`, `atmosphere`, `imageStyle`, `lighting`

### Step 3: Behavior & Tone
- `greeting`, `tone`, `emotionalRange`
- `personality` (creativity, formality, empathy, assertiveness, patience)
- `shouldDo`, `shouldNotDo` guidelines

### Step 4: Expertise
- `expertiseAreas`, `tools`, `outputFormats`
- `additionalRules`

### Step 5: Journey
- `sessions` array with tasks and outcomes
- `journeyPacing` configuration

### Step 6: Team Collaboration
- `teamEnabled`, `orchestrator`, `subRoles`
- `taskProtocol`, `memoryTransfer`

### Step 7: Memory System
- `hotMemory`, `warmMemory`, `coldMemory`
- `memoryStrategy`, `emotionalStates`

### Step 8: Ethics & Versions
- `ethicalRules` with actions (warn/stop/refer)
- `referralProtocol`, `disclaimer`
- `author`, `contacts`, `changelog`
- Optional `license` with terms

### Identity & Metadata
- `rmlIdentity` - Deterministic hashes for content verification
- `identityMetadata` - Generation timestamp and schema version
- `createdAt`, `updatedAt` - Timestamps

## Validation Rules

### Required Fields
All fields listed in the schema's `required` array must be present. This includes all 8 steps of the Role definition.

### String Constraints
- Maximum lengths enforced on text fields
- Pattern validation for IDs and version strings
- Enum validation for categorical fields

### Numeric Constraints
- `responseLength`: 1-10 scale
- `personality` traits: 1-10 scale
- Session durations: minimum 1 minute

### Array Constraints
- `tags`: max 20 items, unique
- `shouldDo`/`shouldNotDo`: minimum 1 item each
- `expertiseAreas`: minimum 1 item

### Object Constraints
- Nested objects validated according to their schemas
- No additional properties allowed (strict validation)

## Schema Versioning

**Current Version:** 1.0.0

The schema follows semantic versioning:
- **Major**: Breaking changes to required fields or types
- **Minor**: New optional fields or enum values
- **Patch**: Documentation, validation improvements

## Integration Examples

### In Use Cases

```typescript
import { assertValidRole } from '@/core/domain/role/role.schema';
import { createRole } from '@/application/use-cases/create-role.use-case';

export async function importRole(data: unknown) {
  // Validate before processing
  assertValidRole(data);
  
  // Now safe to use
  return await createRole(data);
}
```

### In API Endpoints

```typescript
import { getRoleValidationErrors } from '@/core/domain/role/role.schema';

app.post('/api/roles', async (req, res) => {
  const errors = getRoleValidationErrors(req.body);
  
  if (errors) {
    return res.status(400).json({
      error: 'Invalid role data',
      details: errors
    });
  }
  
  // Process valid role
  const role = await saveRole(req.body);
  res.json(role);
});
```

### In Testing

```typescript
import { isValidRole } from '@/core/domain/role/role.schema';
import { mockRole } from '@/tests/fixtures';

describe('Role Creation', () => {
  it('should create a valid role', () => {
    const role = createNewRole();
    expect(isValidRole(role)).toBe(true);
  });
});
```

## Common Validation Errors

### Missing Required Fields
```
Error: Role validation failed: /name is required
```
**Fix:** Ensure all required fields from all 8 steps are present.

### Invalid Enum Value
```
Error: Role validation failed: /archetype must be equal to one of the allowed values
```
**Fix:** Use only values from the enum list (e.g., 'mentor', 'creator', etc.)

### Type Mismatch
```
Error: Role validation failed: /responseLength must be number
```
**Fix:** Ensure numeric fields are numbers, not strings.

### String Length Violation
```
Error: Role validation failed: /name must NOT have more than 200 characters
```
**Fix:** Truncate or shorten the field value.

### Invalid Pattern
```
Error: Role validation failed: /version must match pattern
```
**Fix:** Use semantic versioning format (e.g., "1.0.0")

## Schema Extensions

### Adding Custom Validation

While the schema is strict by default, you can add runtime validation:

```typescript
import { isValidRole } from './role.schema';

function validateBusinessRules(role: Role): string[] {
  const errors: string[] = [];
  
  // Custom business logic
  if (role.teamEnabled && role.subRoles.length === 0) {
    errors.push('Team-enabled roles must have at least one sub-role');
  }
  
  if (role.sessions.length > 0 && !role.journeyPacing) {
    errors.push('Roles with sessions should define journeyPacing');
  }
  
  return errors;
}
```

## IDE Integration

### VS Code

The schema can be referenced in `tsconfig.json` for IntelliSense:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### JSON Files

Reference the schema in JSON role files:

```json
{
  "$schema": "./src/core/domain/role/role.schema.json",
  "id": "my-role",
  "name": "My Role",
  ...
}
```

## Performance Considerations

- Schema compilation happens once at module load
- Validation is fast (microseconds for typical roles)
- Use `isValidRole` for performance-critical paths
- Use `getRoleValidationErrors` for detailed debugging

## Related Documentation

- [OpenRML Specification](../../../docs/openrml-spec.md)
- [Role Type Definitions](./types.ts)
- [Identity System](../../../architecture/ADR-002-deterministic-identity.md)
- [Storage Strategy](../../../architecture/ADR-003-storage-strategy.md)

## Schema URI

The canonical schema URI is:
```
https://openrml.org/schemas/role/1.0.0
```

This URI serves as the unique identifier for the schema version and can be used in `$schema` references.

## Contributing

When modifying the schema:

1. Update the version number in the schema
2. Document changes in this README
3. Update validation tests
4. Verify backward compatibility
5. Update TypeScript types if needed

## License

This schema is part of the OpenRML specification and follows the same license as the main project.
