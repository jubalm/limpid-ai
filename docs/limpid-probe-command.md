# LimpidAI Probe Command
**Command**: `/limpid:probe`  
**Version**: 0.0.0

---

## Purpose

Discover codebase structure and analyze patterns to produce intelligent guided artifact.

**Not just**: File listing  
**But**: Pattern detection, relationship mapping, gap analysis, change tracking

---

## Standalone Usage

```bash
# User mode (verbose output)
/limpid:probe

# Agent mode (JSON only)
/limpid:probe --quiet

# Focused analysis
/limpid:probe "analyze API structure"
```

**Works independently** - no curator needed.

---

## Command File

**Location**: `.claude/commands/limpid/probe.md`

**Key Configuration**:
- **Arguments**: `[--quiet | focus-area]`
- **Tools**: `Bash(git:*)`, `Bash(find:*)`, `Bash(grep:*)`, `Bash(test:*)`, `Bash(cat:*)`, `Bash(jq:*)`
- **Approach**: Git-first discovery with bash scripts, followed by intelligent analysis
- **Output**: JSON artifact cached to `.cache/limpid/probe.json`

**Intelligence Algorithms** (detailed in command file):
1. Architecture pattern detection (feature-based, layered, domain-driven, flat)
2. Feature mapping with dependencies
3. Dependency graph building
4. Shared code detection
5. Testing pattern analysis
6. Gap detection (undocumented, orphaned, missing tests)
7. Change impact analysis (vs cached state)

---

## Output Modes

### User Mode (Default)

Friendly summary with visual indicators:

```
✓ Probed successfully

Project: React/TypeScript web-app (feature-based architecture)
Files: 247 total, 235 tracked
Cache: Changed (12 files modified since last probe)

Features detected:
  • auth (src/auth/) - 4 files, undocumented
  • payments (src/payments/) - 3 files, has docs

Shared code: utils/ (hash, logger)

Gaps:
  ⚠ 2 undocumented features
  ⚠ 3 files missing tests
  ⚠ 1 orphaned file

Recommendations:
  → Run /limpid:curate to set up structure
  → Run /limpid:assimilate auth to document auth feature

Cache saved: .cache/limpid/probe.json
```

---

### Agent Mode (`--quiet`)

JSON artifact only, no explanations:

```json
{
  "meta": {...},
  "project": {...},
  // ... full artifact
}
```

**Use case**: When curator or other agents invoke probe, they get pure data without verbose output.

---

## Usage Examples

### Example 1: Initial Discovery

```bash
/limpid:probe

# Output:
# ✓ React/TS web-app detected
# 2 features found (auth, payments)
# No LimpidAI setup detected
# Next: Run /limpid:curate
```

---

### Example 2: Check Changes

```bash
# After modifying code
/limpid:probe

# Output:
# ✓ Cache updated
# 12 files modified in auth feature
# Recommendation: Update features/auth/ docs
```

---

### Example 3: Agent Integration

```bash
# Curator uses probe
@curator → invokes /limpid:probe --quiet
          → receives JSON
          → makes decisions based on artifact
```

---

## How Others Use Probe Artifact

### Curate Uses It

```json
// Reads probe.json
"project.architecture": "feature-based"
→ Installs feature-folder SPEC

"tech_stack.database": ["prisma"]
→ SPEC includes data model sections

"gaps.undocumented_features": ["auth"]
→ Priority list for documentation
```

---

### Assimilate Uses It (The Guided Map)

```json
// Conversation: "document auth flow"

// Reads probe.json
"code_map.features.auth": {
  "files": ["login.ts", "middleware.ts"],
  "exports": ["login", "validateToken"],
  "imports_from": ["utils/hash"]
}

// Writes features/auth/architecture.md mentioning:
// - login and validateToken functions
// - Cross-ref to architecture/shared.md for hash utility
```

**Prevents hallucination**:
```
// Conversation mentions Redis

// Checks probe.json
"packages.dependencies": {...} // No Redis

// Assimilate: "Redis not detected. Add dependency first?"
```

---

### Curator Uses It

```json
// Invokes probe --quiet

"changes_since_last": {
  "modified": ["src/auth/login.ts"],
  "affected_features": ["auth"]
}

// Curator decides:
// → Skip curate (structure exists)
// → Invoke assimilate to update auth docs
```

---

## Key Features

### 1. Git-First Strategy
- Fast baseline with `git ls-files`
- Change tracking via git diff
- Fallback to filesystem if no git

### 2. Pattern Detection
- Not just file listing
- Infers architecture style
- Detects feature boundaries

### 3. Relationship Mapping
- Builds dependency graph
- Identifies shared code
- Maps file → feature → docs

### 4. Gap Analysis
- Finds undocumented code
- Detects orphaned files
- Tracks missing tests

### 5. Change Awareness
- Compares with cache
- Identifies affected features
- Suggests doc updates

---

## Implementation Notes

### Bash Script Guidelines

1. **Handle missing commands**:
   ```bash
   test -f package.json && cat package.json | jq ...
   # Falls back gracefully if jq not installed
   ```

2. **Suppress errors**:
   ```bash
   grep -r "export" src/ 2>/dev/null
   # Prevents noise if src/ doesn't exist
   ```

3. **Limit output**:
   ```bash
   git ls-files | head -100
   # Don't overwhelm with thousands of files
   ```

### Analysis Guidelines

1. **Handle edge cases**:
   - Empty projects
   - No git repository
   - Missing dependencies

2. **Infer intelligently**:
   - Default to "flat" if can't determine architecture
   - Mark as "unknown" rather than guess

3. **Cache management**:
   - Always include timestamp
   - Git hash for change detection
   - Graceful if cache missing

---

## Why This Matters

**Without intelligent probe**:
- Assimilate guesses file locations
- Cross-references break
- Mentions tech not in project
- Documentation inaccurate

**With intelligent probe**:
- Assimilate knows exactly where code lives
- Cross-references accurate
- Verifies tech exists
- Documentation precise

**This is LimpidAI's differentiator** - guided intelligence, not guessing.

---

## Related

- System overview: `limpid-system-overview.md`
- Uses probe artifact: `limpid-curate-command.md`, `limpid-assimilate-command.md`
- Orchestrates probe: `limpid-curator-agent.md`
