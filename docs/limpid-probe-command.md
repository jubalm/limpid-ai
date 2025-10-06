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

```markdown
---
description: Discover codebase with intelligent pattern analysis
argument-hint: [--quiet | focus-area]
allowed-tools: Bash(git:*), Bash(find:*), Bash(grep:*), Bash(test:*), Bash(cat:*), Bash(jq:*)
---

# LimpidAI Probe - Discovery & Analysis

Discover project structure and analyze patterns to produce guided artifact.

## Discovery Scripts (Pre-execution)

### Git Discovery (Primary)
- File count: !`git ls-files | wc -l`
- Latest commit: !`git log -1 --format="%H %ai"`
- Recent changes: !`git diff --name-status HEAD~1..HEAD | wc -l`

### Project Type Detection
- Node: !`test -f package.json && cat package.json | jq -r '.dependencies | keys[]' | head -10`
- Rust: !`test -f Cargo.toml && echo "rust"`
- Go: !`test -f go.mod && echo "go"`  
- Python: !`find . -maxdepth 2 -name "*.py" | head -1`

### Structure Analysis
- Directories: !`find . -maxdepth 3 -type d ! -path "*/node_modules/*" ! -path "*/.git/*"`
- Feature detection: !`find src -type d -maxdepth 2 2>/dev/null | grep -E "(auth|payment|user|api|profile)"`

### Code Analysis
- Exports: !`grep -r "export.*function\|export.*class" src/ 2>/dev/null | head -30`
- Imports: !`grep -r "import.*from" src/ 2>/dev/null | head -50`

### Testing
- Test files: !`find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | head -20`

### Dependencies  
- Packages: !`test -f package.json && cat package.json | jq '.dependencies, .devDependencies' 2>/dev/null`
- Cargo: !`test -f Cargo.toml && grep "^\[dependencies\]" -A 20 Cargo.toml 2>/dev/null`

### Config Files
- Configs: !`find . -maxdepth 2 \( -name "*.config.*" -o -name "docker-compose.yml" -o -name ".env.example" -o -name "schema.prisma" \) 2>/dev/null`

### LimpidAI State
- Context exists: !`test -d .claude/context && echo "has_limpid" || echo "no_limpid"`
- Cache exists: !`test -f .cache/limpid/probe.json && echo "has_cache" || echo "no_cache"`
- Cached hash: !`test -f .cache/limpid/probe.json && cat .cache/limpid/probe.json | jq -r '.git_hash' 2>/dev/null || echo "none"`

### Fallback (No Git)
- Total files: !`find . -type f ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/dist/*" 2>/dev/null | wc -l`

## Intelligence Layer

Based on discovery scripts above, perform analysis:

### 1. Architecture Pattern Detection

Analyze directory structure to infer architecture:

**Patterns**:
- Feature-based: `src/{feature-name}/` (auth/, payments/)
- Layered: `src/{layer}/` (controllers/, services/, models/)
- Domain-driven: `src/{domain}/` (user/, product/, order/)
- Flat: `src/*.{ts,js,py}`

**Algorithm**:
1. Count folders matching each pattern
2. Identify primary (>60% of structure)
3. Detect hybrid if mixed

**Output**: `project.architecture = "feature-based"`

---

### 2. Feature Mapping

For each detected feature folder:

**Steps**:
1. List all files in folder
2. Extract exports from grep results
3. Extract imports (local only, not node_modules)
4. Find related tests (by name matching)
5. Check `.claude/context/features/{name}/` for existing docs

**Output**:
```json
"features": {
  "auth": {
    "location": "src/auth/",
    "files": ["login.ts", "middleware.ts"],
    "exports": ["login", "validateToken"],
    "imports_from": ["utils/hash", "prisma/client"],
    "used_by": [], // populated by dependency graph
    "tests": ["tests/auth/login.test.ts"],
    "existing_docs": null
  }
}
```

---

### 3. Dependency Graph Building

For each source file:

**Steps**:
1. Extract all import statements
2. Filter to local files (starts with `.` or `@/`)
3. Resolve relative paths to absolute
4. Build `depends_on` list
5. Reverse to create `used_by` list
6. Identify shared (used by 3+ features)

**Output**:
```json
"relationships": {
  "src/auth/login.ts": {
    "depends_on": ["utils/hash.ts", "prisma/client"],
    "used_by": ["api/auth.ts"],
    "should_document_with": ["features/auth/"]
  },
  "utils/hash.ts": {
    "depends_on": ["bcrypt"],
    "used_by": ["auth/login.ts", "auth/register.ts"],
    "should_document_with": ["architecture/shared.md"]
  }
}
```

---

### 4. Shared Code Detection

Find files used by multiple features:

**Steps**:
1. Filter `relationships` where `used_by.length >= 3`
2. Group by directory (utils/, components/, lib/)
3. Identify which features use each shared file

**Output**:
```json
"shared": {
  "utils/": {
    "files": ["hash.ts", "logger.ts"],
    "used_by_features": ["auth", "payments", "notifications"]
  }
}
```

---

### 5. Testing Pattern Analysis

Analyze test organization:

**Steps**:
1. Check test file locations
2. Count colocated (same dir as source) vs separate (tests/ dir)
3. Calculate coverage ratio

**Patterns**:
- Colocated: `auth.ts` + `auth.test.ts` in same folder
- Separate: `src/` vs `tests/` directories
- Mixed: combination

**Output**:
```json
"testing": {
  "pattern": "colocated|separate|mixed",
  "coverage": "full|partial|sparse",
  "test_dirs": ["src/", "tests/"]
}
```

---

### 6. Gap Detection

Compare code vs documentation:

**Gaps**:
1. **Undocumented features**: Code exists, no `.claude/context/features/{name}/`
2. **Orphaned files**: No imports/exports, not used anywhere
3. **Missing tests**: Source file has no corresponding test

**Output**:
```json
"gaps": {
  "undocumented_features": ["auth", "payments"],
  "orphaned_files": ["src/legacy/old-auth.ts"],
  "missing_tests": ["src/utils/email.ts"]
}
```

---

### 7. Change Impact Analysis

If cache exists, compare with current state:

**Steps**:
1. Compare git hash (current vs cached)
2. If different: `git diff --name-status`
3. Map changed files → affected features
4. Identify docs needing updates

**Output**:
```json
"changes_since_last": {
  "modified": ["src/auth/login.ts"],
  "affected_features": ["auth"],
  "needs_doc_update": ["features/auth/architecture.md"]
}
```

---

## Output Artifact

**Cached to**: `.cache/limpid/probe.json`

```json
{
  "meta": {
    "timestamp": "2025-10-06T12:00:00Z",
    "git_hash": "abc123",
    "cache_status": "changed|unchanged|new",
    "diff_summary": "12 files modified"
  },
  
  "project": {
    "type": "web-app|api|mobile|cli",
    "framework": "react|nextjs|express|fastapi",
    "language": ["typescript"],
    "architecture": "feature-based|layered|domain-driven|flat",
    "has_limpid": true,
    "root": "/path/to/project"
  },
  
  "tech_stack": {
    "runtime": "node@20.x",
    "package_manager": "npm|yarn|pnpm",
    "database": ["prisma", "postgres"],
    "testing": ["vitest"]
  },
  
  "packages": {
    "dependencies": {
      "react": "18.2.0",
      "prisma": "5.x"
    },
    "dev_dependencies": {
      "vitest": "1.x"
    }
  },
  
  "code_map": {
    "features": {
      "auth": {
        "location": "src/auth/",
        "files": ["login.ts", "middleware.ts"],
        "exports": ["login", "validateToken"],
        "imports_from": ["utils/hash", "prisma/client"],
        "used_by": ["api/routes.ts"],
        "tests": ["tests/auth/login.test.ts"],
        "existing_docs": null
      }
    },
    "shared": {
      "utils/": {
        "files": ["hash.ts", "logger.ts"],
        "used_by_features": ["auth", "payments"]
      }
    }
  },
  
  "relationships": {
    "src/auth/login.ts": {
      "depends_on": ["utils/hash.ts"],
      "used_by": ["api/auth.ts"],
      "should_document_with": ["features/auth/"]
    }
  },
  
  "gaps": {
    "undocumented_features": ["auth"],
    "orphaned_files": ["src/legacy/old.ts"],
    "missing_tests": ["utils/email.ts"]
  },
  
  "changes_since_last": {
    "modified": ["src/auth/login.ts"],
    "affected_features": ["auth"],
    "needs_doc_update": []
  },
  
  "stats": {
    "total_files": 247,
    "tracked_files": 235,
    "by_extension": {"ts": 120, "tsx": 45}
  }
}
```

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
