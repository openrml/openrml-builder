# 🐛 BUGFIX: Export System - Expertise Areas Handling

## Issue Description

**Problem:** Export to GPT, Claude, and Gemini formats fails when `expertiseAreas` is a string array instead of object array.

**Root Cause:** The code expected `expertiseAreas` to always be an array of objects with `title` and `description` properties, but the Constructor can create roles with simple string arrays.

**Affected Files:**
- `src/core/export/strategies/gpt-strategy.ts`
- `src/core/export/strategies/claude-strategy.ts`
- `src/core/export/strategies/gemini-strategy.ts`

## Error Examples

### Before Fix:

**Input:**
```json
"expertiseAreas": [
  "Task prioritization",
  "Time management",
  "Project planning"
]
```

**Output (GPT):**
```
EXPERTISE:
• undefined: undefined
• undefined: undefined
• undefined: undefined
```

### After Fix:

**Output (GPT):**
```
EXPERTISE:
• Task prioritization
• Time management
• Project planning
```

## Solution

Added type checking to handle both formats:
1. String array: `["Task prioritization", "Time management"]`
2. Object array: `[{ title: "Task prioritization", description: "..." }]`

## Changes Made

### 1. GPT Strategy (`gpt-strategy.ts`)

**Before:**
```typescript
role.expertiseAreas.forEach(area => {
  sections.push(`• ${area.title}: ${area.description}`);
});
```

**After:**
```typescript
role.expertiseAreas.forEach(area => {
  if (typeof area === 'string') {
    sections.push(`• ${area}`);
  } else if (area.title) {
    sections.push(`• ${area.title}: ${area.description || ''}`);
  }
});
```

### 2. Claude Strategy (`claude-strategy.ts`)

**Before:**
```typescript
role.expertiseAreas.forEach(area => {
  sections.push(`### ${area.title}`);
  sections.push(area.description);
  // ...
});
```

**After:**
```typescript
role.expertiseAreas.forEach(area => {
  if (typeof area === 'string') {
    sections.push(`### ${area}`);
    sections.push('');
  } else if (area.title) {
    sections.push(`### ${area.title}`);
    sections.push(area.description || '');
    // ...
  }
});
```

### 3. Gemini Strategy (`gemini-strategy.ts`)

**Before:**
```typescript
role.expertiseAreas.forEach(area => {
  sections.push(`• ${area.title}: ${this.truncateText(area.description, 200)}`);
});
```

**After:**
```typescript
role.expertiseAreas.forEach(area => {
  if (typeof area === 'string') {
    sections.push(`• ${area}`);
  } else if (area.title) {
    const desc = area.description ? this.truncateText(area.description, 200) : '';
    sections.push(`• ${area.title}${desc ? ': ' + desc : ''}`);
  }
});
```

## Testing

### Test Case 1: String Array
```typescript
const role = {
  expertiseAreas: [
    "Task prioritization",
    "Time management"
  ]
};
```

**Expected Output (GPT):**
```
EXPERTISE:
• Task prioritization
• Time management
```

✅ **PASS**

### Test Case 2: Object Array
```typescript
const role = {
  expertiseAreas: [
    { title: "Task prioritization", description: "Expert in prioritizing tasks" },
    { title: "Time management", description: "Skilled at managing time" }
  ]
};
```

**Expected Output (GPT):**
```
EXPERTISE:
• Task prioritization: Expert in prioritizing tasks
• Time management: Skilled at managing time
```

✅ **PASS**

### Test Case 3: Mixed Array (Edge Case)
```typescript
const role = {
  expertiseAreas: [
    "Simple expertise",
    { title: "Complex expertise", description: "With description" }
  ]
};
```

**Expected Output (GPT):**
```
EXPERTISE:
• Simple expertise
• Complex expertise: With description
```

✅ **PASS**

## Verification Steps

1. Create role with string array expertise:
   ```typescript
   expertiseAreas: ["Task A", "Task B", "Task C"]
   ```

2. Export to each format:
   - GPT: Should show bullet list with strings
   - Claude: Should show H3 headers with strings
   - Gemini: Should show bullet list with strings

3. Create role with object array expertise:
   ```typescript
   expertiseAreas: [
     { title: "Task A", description: "Description A" }
   ]
   ```

4. Export to each format:
   - GPT: Should show "Task A: Description A"
   - Claude: Should show H3 with description below
   - Gemini: Should show "Task A: Description A"

## Impact

- ✅ No breaking changes
- ✅ Backward compatible with both formats
- ✅ Handles edge cases gracefully
- ✅ All existing tests still pass

## Files Modified

1. `src/core/export/strategies/gpt-strategy.ts` - Line 61-66
2. `src/core/export/strategies/claude-strategy.ts` - Line 58-85
3. `src/core/export/strategies/gemini-strategy.ts` - Line 32-42

## Status

✅ **FIXED** - Ready for production

## Date

2026-03-29
