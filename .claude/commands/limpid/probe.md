---
description: Discover codebase with intelligent pattern analysis
argument-hint: [--quiet | focus-area]
allowed-tools: Bash(git:*), Bash(find:*), Bash(grep:*), Bash(test:*), Bash(cat:*), Bash(jq:*), Bash(wc:*), Bash(head:*), Bash(mkdir:*), Read, Write
---

# LimpidAI Probe - Discovery & Analysis

Discover project structure and analyze patterns to produce guided artifact.

## Mode Detection

Arguments: $ARGUMENTS

**Mode**: If `$ARGUMENTS` contains `--quiet`, output JSON only (agent mode). Otherwise, verbose user mode.

## Discovery Scripts

### Git Discovery (Primary)
- Total tracked files: !`git ls-files 2>/dev/null | wc -l | tr -d ' '`
- Latest commit: !`git log -1 --format="%H %ai" 2>/dev/null || echo "no-git"`
- Current branch: !`git branch --show-current 2>/dev/null || echo "no-git"`
- Recent changes: !`git diff --name-status HEAD~1..HEAD 2>/dev/null | wc -l | tr -d ' '`

### Project Type Detection
- Node.js: !`test -f package.json && echo "nodejs" || echo ""`
- Package.json exists: !`test -f package.json && echo "yes" || echo "no"`
- Dependencies: !`test -f package.json && cat package.json 2>/dev/null | jq -r '.dependencies | keys[]' 2>/dev/null | head -10 || echo ""`
- DevDependencies: !`test -f package.json && cat package.json 2>/dev/null | jq -r '.devDependencies | keys[]' 2>/dev/null | head -10 || echo ""`
- Rust: !`test -f Cargo.toml && echo "rust" || echo ""`
- Go: !`test -f go.mod && echo "go" || echo ""`
- Python: !`find . -maxdepth 2 -name "*.py" -type f 2>/dev/null | head -1`

### Structure Analysis
- Source directories: !`find . -maxdepth 3 -type d ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/dist/*" ! -path "*/build/*" 2>/dev/null | head -50`
- Feature detection: !`find src -type d -maxdepth 2 2>/dev/null | grep -E "(auth|payment|user|api|profile|admin|dashboard)" | head -20`

### Code Analysis (if src exists)
- TypeScript files: !`find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l | tr -d ' '`
- JavaScript files: !`find src -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l | tr -d ' '`
- Exports sample: !`grep -r "export.*function\|export.*class\|export.*const" src/ 2>/dev/null | head -30`
- Imports sample: !`grep -r "import.*from" src/ 2>/dev/null | head -50`

### Testing
- Test files: !`find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | head -20`
- Test count: !`find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | wc -l | tr -d ' '`

### Config Files
- Configs: !`find . -maxdepth 2 \( -name "*.config.*" -o -name "docker-compose.yml" -o -name ".env.example" -o -name "schema.prisma" -o -name "tsconfig.json" \) 2>/dev/null`

### LimpidAI State
- Context exists: !`test -d .claude/context && echo "has_limpid" || echo "no_limpid"`
- Cache exists: !`test -f .cache/limpid/probe.json && echo "has_cache" || echo "no_cache"`
- Cached hash: !`test -f .cache/limpid/probe.json && cat .cache/limpid/probe.json 2>/dev/null | jq -r '.meta.git_hash' 2>/dev/null || echo "none"`

### Fallback (No Git)
- Total files: !`find . -type f ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/dist/*" ! -path "*/build/*" 2>/dev/null | wc -l | tr -d ' '`

## Intelligence Layer

Based on the discovery scripts above, perform comprehensive analysis:

### 1. Architecture Pattern Detection

Analyze the directory structure from "Source directories" output:

**Patterns to detect**:
- **Feature-based**: Look for `src/{feature-name}/` patterns (auth/, payments/, etc.)
- **Layered**: Look for `src/{layer}/` patterns (controllers/, services/, models/, routes/)
- **Domain-driven**: Look for `src/{domain}/` patterns (user/, product/, order/)
- **Flat**: Look for `src/*.{ts,js,py}` with minimal subdirectories

**Algorithm**:
1. Count folders in src/ directory
2. Identify if names match feature patterns (business domains)
3. Identify if names match layer patterns (technical layers)
4. Determine primary architecture (>60% of structure)
5. Note if hybrid/mixed

### 2. Feature Mapping

For each detected feature folder in "Feature detection" output:

**For each feature**:
1. List all files in the feature folder
2. Extract exports from the "Exports sample" output
3. Extract imports (local only, not node_modules)
4. Find related tests by name matching
5. Check if `.claude/context/features/{name}/` exists

**Build feature map** with:
- location (path to feature)
- files (list of files in feature)
- exports (functions/classes exported)
- imports_from (local dependencies)
- tests (related test files)
- existing_docs (path to docs if they exist)

### 3. Dependency Graph Building

From "Imports sample" output:

**For each import statement**:
1. Parse the import to extract the source file and imported module
2. Filter to local files only (imports starting with `.` or `@/`)
3. Resolve relative paths to absolute within the project
4. Build `depends_on` relationships
5. Reverse to create `used_by` relationships
6. Identify shared utilities (files used by 3+ other files)

### 4. Shared Code Detection

**Find files used by multiple features**:
1. Look for common directories: utils/, lib/, components/, shared/, common/
2. Identify which features import from these directories
3. Mark as "shared" if used by 3+ features or multiple feature areas

### 5. Testing Pattern Analysis

From "Test files" output:

**Determine pattern**:
- **Colocated**: Tests in same directory as source (e.g., `auth.ts` + `auth.test.ts`)
- **Separate**: Tests in dedicated `tests/` or `__tests__/` directories
- **Mixed**: Combination of both

**Calculate coverage**:
- Compare test file count to source file count
- Mark as: full (>80%), partial (30-80%), sparse (<30%)

### 6. Gap Detection

**Identify gaps**:
1. **Undocumented features**: Features in code but not in `.claude/context/features/`
2. **Orphaned files**: Files with no imports/exports (check imports/exports output)
3. **Missing tests**: Source files without corresponding test files

### 7. Change Impact Analysis

If cache exists (check "Cached hash" output):

**Compare with current state**:
1. Compare current git hash with cached hash
2. If different, run: `git diff --name-status {cached_hash}..HEAD`
3. Map changed files to affected features
4. Identify which documentation files need updates

## Cache Directory Setup

Before writing artifact, ensure cache directory exists:

**Create cache directory**: !`mkdir -p .cache/limpid`

## Output Artifact Construction

Build a JSON artifact with the following structure:

```json
{
  "meta": {
    "timestamp": "[current ISO timestamp]",
    "git_hash": "[from git log output or 'no-git']",
    "cache_status": "[changed|unchanged|new]",
    "diff_summary": "[number] files modified"
  },
  "project": {
    "type": "[web-app|api|mobile|cli|library|monorepo]",
    "framework": "[detected framework: react|nextjs|express|fastapi|etc]",
    "language": ["[primary languages detected]"],
    "architecture": "[feature-based|layered|domain-driven|flat]",
    "has_limpid": [true|false],
    "root": "[absolute path to project]"
  },
  "tech_stack": {
    "runtime": "[node|python|rust|go]@[version]",
    "package_manager": "[npm|yarn|pnpm|cargo|go|pip]",
    "database": ["[detected database tools]"],
    "testing": ["[detected test frameworks]"]
  },
  "packages": {
    "dependencies": {
      "[package-name]": "[version]"
    },
    "dev_dependencies": {
      "[package-name]": "[version]"
    }
  },
  "code_map": {
    "features": {
      "[feature-name]": {
        "location": "[path]",
        "files": ["[file1]", "[file2]"],
        "exports": ["[export1]", "[export2]"],
        "imports_from": ["[dep1]", "[dep2]"],
        "used_by": ["[file1]"],
        "tests": ["[test files]"],
        "existing_docs": "[path or null]"
      }
    },
    "shared": {
      "[directory]": {
        "files": ["[file1]", "[file2]"],
        "used_by_features": ["[feature1]", "[feature2]"]
      }
    }
  },
  "relationships": {
    "[file-path]": {
      "depends_on": ["[dependency paths]"],
      "used_by": ["[dependent paths]"],
      "should_document_with": ["[suggested docs location]"]
    }
  },
  "gaps": {
    "undocumented_features": ["[feature names]"],
    "orphaned_files": ["[file paths]"],
    "missing_tests": ["[file paths]"]
  },
  "changes_since_last": {
    "modified": ["[file paths]"],
    "affected_features": ["[feature names]"],
    "needs_doc_update": ["[doc paths]"]
  },
  "stats": {
    "total_files": 0,
    "tracked_files": 0,
    "by_extension": {"ts": 0, "js": 0}
  }
}
```

**Write artifact** to `.cache/limpid/probe.json`

## Output Formatting

### If `--quiet` in arguments (Agent Mode):
- Output ONLY the JSON artifact content
- No explanations, no verbose text
- Just the raw JSON for agent consumption

### Otherwise (User Mode):
Present a friendly summary:

```
✓ Probed successfully

Project: [framework]/[language] [project-type] ([architecture] architecture)
Files: [total] total, [tracked] tracked
Cache: [Changed (N files) | Unchanged | New]

Features detected:
  • [feature1] ([location]) - [N] files[, undocumented | , has docs]
  • [feature2] ([location]) - [N] files[, undocumented | , has docs]

Shared code: [directories and file counts]

Gaps:
  ⚠ [N] undocumented features
  ⚠ [N] files missing tests
  ⚠ [N] orphaned files

Recommendations:
  → Run /limpid:curate to set up structure (if no LimpidAI)
  → Run /limpid:assimilate [feature] to document features

Cache saved: .cache/limpid/probe.json
```

## Instructions

1. Analyze all discovery script outputs above
2. Apply the intelligence layer algorithms
3. Build the complete JSON artifact
4. Create `.cache/limpid/` directory if needed
5. Write artifact to `.cache/limpid/probe.json`
6. Output in appropriate format based on `$ARGUMENTS` mode
7. If errors occur during discovery, handle gracefully and note in artifact

Focus on accuracy and completeness. The probe artifact is the foundation for curate and assimilate commands.
