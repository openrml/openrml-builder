# Multi-Format Export System

## Overview

The OpenRML Builder now supports exporting roles to multiple AI platform formats:

- **OpenRML** (.orml.txt) - Native format with full metadata
- **ChatGPT** (.txt) - Optimized for OpenAI Custom GPTs
- **Claude Project** (.md) - Markdown format for Claude.ai Projects
- **Google Gemini** (.txt) - System instructions for Gemini Gems
- **JSON** (.json) - Machine-readable format for API integrations

## Architecture

### Core Components

```
src/core/export/
├── types.ts                        # Core type definitions
├── strategy-registry.ts            # Strategy registry pattern
├── strategies/
│   ├── base-strategy.ts           # Abstract base class
│   ├── orml-strategy.ts           # Native ORML format
│   ├── gpt-strategy.ts            # ChatGPT format
│   ├── claude-strategy.ts         # Claude Project format
│   ├── gemini-strategy.ts         # Gemini Gem format
│   └── json-strategy.ts           # JSON export
└── index.ts                        # Public API & bootstrap
```

### Strategy Pattern

Each export format is implemented as a separate strategy:

```typescript
interface ExportStrategy {
  format: ExportFormat;
  fileExtension: string;
  mimeType: string;
  
  convert(role: Role, options?: ExportOptions): string;
  validate(role: Role): ValidationResult;
  getMetadata(): FormatMetadata;
}
```

## Usage

### In Code

```typescript
import { ExportRoleUseCase } from '@/application/use-cases/export-role.use-case';

const exportUseCase = new ExportRoleUseCase();

// Export to specific format
const result = exportUseCase.execute({
  role: myRole,
  format: 'gpt',
  download: true,
});

// Get available formats
const formats = exportUseCase.getAvailableFormats();
```

### In UI

The `ExportMenu` component provides a dropdown with all available formats:

```tsx
import { ExportMenu } from '@/components/constructor/ExportMenu';

<ExportMenu role={currentRole} disabled={!currentRole.name} />
```

## Adding New Export Formats

### Step 1: Create Strategy

```typescript
// src/core/export/strategies/my-platform-strategy.ts
import { BaseExportStrategy } from './base-strategy';

export class MyPlatformStrategy extends BaseExportStrategy {
  readonly format = 'my-platform' as const;
  readonly fileExtension = 'txt';
  readonly mimeType = 'text/plain';
  
  convert(role: Role, options?: ExportOptions): string {
    // Implement conversion logic
    return formatted;
  }
  
  getMetadata(): FormatMetadata {
    return {
      name: 'My Platform',
      description: 'Export format for My Platform',
      platform: 'My Platform',
      limitations: [],
    };
  }
}
```

### Step 2: Register Strategy

```typescript
// src/core/export/index.ts
import { MyPlatformStrategy } from './strategies/my-platform-strategy';

export function registerExportStrategies(): void {
  exportRegistry.register(new ORMLExportStrategy());
  exportRegistry.register(new GPTExportStrategy());
  // ... other strategies
  exportRegistry.register(new MyPlatformStrategy()); // ADD THIS
}
```

### Step 3: Update Types

```typescript
// src/core/export/types.ts
export type ExportFormat = 
  | 'orml'
  | 'gpt'
  | 'claude-project'
  | 'gemini'
  | 'json'
  | 'my-platform'; // ADD THIS
```

### Step 4: Update UI Mapping

```typescript
// src/presentation/components/constructor/ExportMenu.tsx
const getFormatEnum = (formatName: string): ExportFormat => {
  const mapping: Record<string, ExportFormat> = {
    'OpenRML': 'orml',
    'ChatGPT Custom Instructions': 'gpt',
    'Claude Project': 'claude-project',
    'Google Gemini Gem': 'gemini',
    'JSON Export': 'json',
    'My Platform': 'my-platform', // ADD THIS
  };
  
  return mapping[formatName] || 'orml';
};
```

## Format-Specific Details

### OpenRML
- **Extension**: `.orml.txt`
- **Use case**: Full-fidelity export with all metadata
- **Limitations**: None

### ChatGPT
- **Extension**: `.txt`
- **Use case**: Custom GPT instructions in OpenAI's GPT Builder
- **Limitations**: 
  - ~8000 character limit
  - No team collaboration
  - Structured sessions are flattened

### Claude Project
- **Extension**: `.md`
- **Use case**: Project Knowledge in Claude.ai
- **Limitations**: 
  - 100KB max file size
  - Markdown format only

### Google Gemini
- **Extension**: `.txt`
- **Use case**: System instructions for Gemini Gems
- **Limitations**: 
  - ~4000 word limit
  - No file attachments

### JSON
- **Extension**: `.json`
- **Use case**: API integrations, programmatic access
- **Limitations**: None

## Validation

Each strategy validates roles before export:

```typescript
const validation = strategy.validate(role);

if (!validation.valid) {
  // Handle errors
  console.error(validation.errors);
}

if (validation.warnings) {
  // Show warnings to user
  console.warn(validation.warnings);
}
```

## Testing

```bash
# Run tests
npm test

# Test specific strategy
npm test -- gpt-strategy.test.ts
```

## Future Enhancements

Potential additions to the export system:

1. **More Platforms**
   - Poe Bot export
   - Character.AI export
   - LLaMA system prompt
   
2. **Advanced Features**
   - Export preview
   - Batch export (multiple formats at once)
   - Custom templates
   - Export history

3. **Quality Improvements**
   - Token counting accuracy
   - Platform-specific optimization
   - Compression strategies

## Troubleshooting

### Export button not working
- Ensure `registerExportStrategies()` is called in `main.tsx`
- Check console for errors

### Format not appearing in dropdown
- Verify strategy is registered in `index.ts`
- Check format mapping in `ExportMenu.tsx`

### Validation errors
- Check role has required fields (name, description)
- Review platform-specific limitations

## Credits

Built with the Strategy Pattern for extensibility and maintainability.
