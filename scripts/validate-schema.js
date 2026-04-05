#!/usr/bin/env node

/**
 * OpenRML Role Validator CLI
 * 
 * Usage:
 *   node scripts/validate-schema.js <file.json>
 *   node scripts/validate-schema.js --all examples/*.json
 * 
 * Examples:
 *   node scripts/validate-schema.js data/my-role.json
 *   node scripts/validate-schema.js --all examples/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load schema
const schemaPath = path.resolve(__dirname, '../src/core/domain/role/role.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

// Setup validator
const ajv = new Ajv({ allErrors: true, strict: true, validateFormats: true });
addFormats(ajv);
const validate = ajv.compile(schema);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    const isValid = validate(data);
    
    return {
      filePath,
      isValid,
      errors: validate.errors || [],
      data,
    };
  } catch (error) {
    return {
      filePath,
      isValid: false,
      errors: [{ message: error.message }],
      parseError: true,
    };
  }
}

function printResult(result) {
  const fileName = path.basename(result.filePath);
  
  if (result.isValid) {
    console.log(`${colorize('green', '✓')} ${fileName} ${colorize('gray', '- valid')}`);
    return true;
  } else {
    console.log(`${colorize('red', '✗')} ${fileName} ${colorize('gray', '- invalid')}`);
    
    if (result.parseError) {
      console.log(colorize('red', `  Parse Error: ${result.errors[0].message}`));
    } else {
      result.errors.forEach((err, idx) => {
        const path = err.instancePath || '/';
        const message = err.message || 'Unknown error';
        console.log(colorize('red', `  ${idx + 1}. ${path} ${message}`));
        
        if (err.params && Object.keys(err.params).length > 0) {
          console.log(colorize('gray', `     ${JSON.stringify(err.params)}`));
        }
      });
    }
    
    return false;
  }
}

function printSummary(results) {
  const total = results.length;
  const valid = results.filter(r => r.isValid).length;
  const invalid = total - valid;
  
  console.log('\n' + '─'.repeat(50));
  console.log(colorize('blue', 'SUMMARY'));
  console.log('─'.repeat(50));
  console.log(`Total files:   ${total}`);
  console.log(colorize('green', `✓ Valid:       ${valid}`));
  
  if (invalid > 0) {
    console.log(colorize('red', `✗ Invalid:     ${invalid}`));
  }
  
  console.log('─'.repeat(50));
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(colorize('yellow', 'Usage:'));
    console.log('  node scripts/validate-schema.js <file.json>');
    console.log('  node scripts/validate-schema.js --all <directory>');
    console.log('\nExamples:');
    console.log('  node scripts/validate-schema.js data/my-role.json');
    console.log('  node scripts/validate-schema.js --all examples/');
    process.exit(1);
  }
  
  let files = [];
  
  if (args[0] === '--all') {
    const dir = args[1] || '.';
    const dirPath = path.resolve(process.cwd(), dir);
    
    if (!fs.existsSync(dirPath)) {
      console.error(colorize('red', `Error: Directory not found: ${dirPath}`));
      process.exit(1);
    }
    
    // Find all JSON files
    const findJsonFiles = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      let jsonFiles = [];
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          jsonFiles = jsonFiles.concat(findJsonFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
          jsonFiles.push(fullPath);
        }
      }
      
      return jsonFiles;
    };
    
    files = findJsonFiles(dirPath);
    
    if (files.length === 0) {
      console.log(colorize('yellow', `No JSON files found in ${dirPath}`));
      process.exit(0);
    }
    
  } else {
    const filePath = path.resolve(process.cwd(), args[0]);
    
    if (!fs.existsSync(filePath)) {
      console.error(colorize('red', `Error: File not found: ${filePath}`));
      process.exit(1);
    }
    
    files = [filePath];
  }
  
  console.log(colorize('blue', `\nValidating ${files.length} file(s)...\n`));
  
  const results = files.map(validateFile);
  results.forEach(printResult);
  
  if (results.length > 1) {
    printSummary(results);
  }
  
  const hasErrors = results.some(r => !r.isValid);
  process.exit(hasErrors ? 1 : 0);
}

main();
