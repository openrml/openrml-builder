// src/core/export/index.ts

import { exportRegistry } from './strategy-registry';
import { ORMLExportStrategy } from './strategies/orml-strategy';
import { GPTExportStrategy } from './strategies/gpt-strategy';
import { ClaudeProjectStrategy } from './strategies/claude-strategy';
import { GeminiExportStrategy } from './strategies/gemini-strategy';
import { JSONExportStrategy } from './strategies/json-strategy';

/**
 * Register all export strategies on app initialization
 * Call this once in your app entry point (main.tsx)
 */
export function registerExportStrategies(): void {
  exportRegistry.register(new ORMLExportStrategy());
  exportRegistry.register(new GPTExportStrategy());
  exportRegistry.register(new ClaudeProjectStrategy());
  exportRegistry.register(new GeminiExportStrategy());
  exportRegistry.register(new JSONExportStrategy());
}

// Re-export everything needed by consumers
export { exportRegistry } from './strategy-registry';
export type { 
  ExportFormat, 
  ExportOptions, 
  ExportStrategy,
  ValidationResult,
  FormatMetadata,
} from './types';
