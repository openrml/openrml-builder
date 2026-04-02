// src/core/export/strategy-registry.ts

import type { ExportStrategy, ExportFormat, FormatMetadata } from './types';

/**
 * Registry for export strategies
 * Manages available export formats and their implementations
 */
export class ExportStrategyRegistry {
  private strategies = new Map<ExportFormat, ExportStrategy>();
  
  /**
   * Register a new export strategy
   */
  register(strategy: ExportStrategy): void {
    this.strategies.set(strategy.format, strategy);
  }
  
  /**
   * Get strategy for specific format
   */
  getStrategy(format: ExportFormat): ExportStrategy {
    const strategy = this.strategies.get(format);
    
    if (!strategy) {
      throw new Error(`Export strategy not found for format: ${format}`);
    }
    
    return strategy;
  }
  
  /**
   * Get all available export formats
   */
  getAllFormats(): ExportFormat[] {
    return Array.from(this.strategies.keys());
  }
  
  /**
   * Get metadata for all available strategies
   */
  getAvailableStrategies(): FormatMetadata[] {
    return Array.from(this.strategies.values()).map(strategy => 
      strategy.getMetadata()
    );
  }
  
  /**
   * Check if format is supported
   */
  hasFormat(format: ExportFormat): boolean {
    return this.strategies.has(format);
  }
}

/**
 * Global singleton registry instance
 */
export const exportRegistry = new ExportStrategyRegistry();
