---
description: Organize structure with SPEC management
argument-hint: [natural-language-instruction]
allowed-tools: Bash(test:*), Bash(find:*), Bash(mkdir:*), Bash(wc:*), Read, Write, Edit
---

# LimpidAI Curate - Organization & Structure

Install SPEC.md, create structure, maintain organization.

## Check Prerequisites

Probe cache exists: !`test -f .cache/limpid/probe.json && echo "exists" || echo "missing"`

**If missing**: Strongly suggest running `/limpid:probe` first for optimal setup, but can proceed with limited functionality.

## Load Probe Artifact

Read probe cache: !`test -f .cache/limpid/probe.json && cat .cache/limpid/probe.json 2>/dev/null || echo "{}"`

**Extract key information**:
- `project.type` and `project.architecture` - determines SPEC framework
- `project.framework` - influences SPEC sections
- `tech_stack` - database, testing sections
- `code_map.features` - what to create structure for
- `gaps.undocumented_features` - priority features
- `project.has_limpid` - whether structure exists

## Natural Language Intent Parsing

User input: $ARGUMENTS

**Parse intent from arguments**:

### SPEC Modifications
- Contains "add [X] section" → Extend SPEC with new section
- Contains "remove [X]" → Edit SPEC to remove section
- Contains "migrate to [X] framework" → Replace SPEC entirely

### Structure Operations
- Contains "validate" → Check compliance only, don't create
- Contains "optimize" → Token-compress existing docs
- Contains "reorganize" → Restructure per SPEC

### Template Updates
- Contains "update [X] template" → Modify specific template in SPEC

### Default (no args or unrecognized)
- Standard curation: bootstrap if needed, validate if exists

## SPEC Framework Selection

Based on `project.architecture` and `project.type` from probe:

### Web App + Feature-based
```markdown
# LimpidAI Framework Specification
## Web Application (Feature-Based)

### Directory Structure

.claude/context/
├── SPEC.md                    # This file
├── README.md                  # System documentation
│
├── project/                   # Project-level context
│   ├── vision.md             # Product vision
│   ├── constraints.md        # Technical constraints
│   └── decisions.md          # Architectural decisions
│
├── architecture/              # System architecture
│   ├── overview.md           # High-level design
│   ├── patterns.md           # Design patterns
│   └── shared.md             # Shared utilities
│
├── features/                  # Feature documentation
│   └── [feature-name]/
│       ├── requirements.md   # What it does
│       ├── architecture.md   # How it's built
│       └── decisions.md      # Key choices
│
└── domain/                    # Domain knowledge
    ├── concepts.md           # Core concepts
    └── terminology.md        # Ubiquitous language

### Document Templates

#### features/[name]/requirements.md
**Purpose**: What the feature does and why
**Format**: User stories, acceptance criteria
**Target**: 50-100 lines

#### features/[name]/architecture.md
**Purpose**: Technical implementation
**Format**: Components, data flow, dependencies
**Target**: 100-150 lines

#### features/[name]/decisions.md
**Purpose**: Key technical choices
**Format**: Decision, rationale, alternatives
**Target**: 50-100 lines

### Token Efficiency Guidelines

**Target**: 50-200 lines per file
**Principles**:
- Assume AI knowledge (no concept explanations)
- Project-specific only (YOUR implementation)
- Dense, structured (bullets, tables, key:value)
- Cross-reference, never duplicate

### Cross-Reference Patterns

See: [file]#[section]
Related: [file]
Depends: [file]
```

### API + Layered
```markdown
# LimpidAI Framework Specification
## API (Layered Architecture)

### Directory Structure

.claude/context/
├── SPEC.md
├── README.md
│
├── project/
│   ├── vision.md
│   └── constraints.md
│
├── api/                       # API layer
│   ├── endpoints.md          # Endpoint definitions
│   ├── contracts.md          # Request/response schemas
│   └── middleware.md         # Middleware docs
│
├── services/                  # Service layer
│   └── [service-name]/
│       └── architecture.md
│
├── data/                      # Data layer
│   ├── models.md             # Data models
│   └── migrations.md         # Schema changes
│
└── domain/
    └── concepts.md

[Similar templates and guidelines...]
```

### CLI/Library + Flat
```markdown
# LimpidAI Framework Specification
## CLI/Library (Flat Architecture)

### Directory Structure

.claude/context/
├── SPEC.md
├── README.md
│
├── project/
│   └── vision.md
│
├── architecture/
│   ├── overview.md
│   └── modules.md            # Module documentation
│
└── api/                       # Public API
    └── reference.md          # API reference

[Simpler templates...]
```

**Selection algorithm**:
1. If `architecture == "feature-based"` → Use Web App SPEC
2. If `architecture == "layered"` → Use API SPEC
3. If `architecture == "flat"` or `type == "cli|library"` → Use CLI/Library SPEC
4. If unknown → Default to Web App SPEC (most flexible)

## Standard Curation Flow

### If LimpidAI doesn't exist (`has_limpid == false`)

**Bootstrap operations**:

1. Create directory structure: !`mkdir -p .claude/context`
2. Generate appropriate SPEC.md based on selection above
3. Create README.md with system documentation
4. Create directory structure per SPEC:
   - !`mkdir -p .claude/context/project`
   - !`mkdir -p .claude/context/architecture`
   - !`mkdir -p .claude/context/features` (for web-app/feature-based)
   - !`mkdir -p .claude/context/domain`
   - Additional directories based on framework

5. For each undocumented feature from probe:
   - Create feature directory: !`mkdir -p .claude/context/features/[feature-name]`
   - Create stub files (empty or with template headers)

6. Create initial README.md:
```markdown
# LimpidAI Context System

This directory contains AI-optimized context documentation for this project.

## Structure

[List directories and their purposes based on SPEC]

## Usage

- `/limpid:probe` - Discover codebase changes
- `/limpid:curate` - Validate structure
- `/limpid:assimilate [feature]` - Document features

## Token Efficiency

All documents target 50-200 lines for optimal AI consumption.
```

7. Create or update .claude/CLAUDE.md:
   - If missing: Create with imports
   - If exists: Ensure imports are present
   ```markdown
   @context/SPEC.md
   @context/README.md
   ```
   This ensures context system auto-loads in future sessions.

### If LimpidAI exists (`has_limpid == true`)

**Validation operations**:

1. Read existing SPEC.md
2. Check directory structure compliance:
   - List expected directories from SPEC
   - List actual directories: !`find .claude/context -type d -maxdepth 2`
   - Compare and report missing/extra directories

3. Check file sizes for token efficiency:
   - Find oversized files: !`find .claude/context -name "*.md" -type f -exec wc -l {} \; | awk '$1 > 300 {print $2, $1}'`
   - Report files needing optimization

4. Validate cross-references:
   - Scan for broken links (references to non-existent files)

5. Report issues and compliance status

## Natural Language Instruction Handling

### Add Section
If args contain "add [X] section":
1. Read current SPEC.md
2. Add new section to directory structure
3. Add template for the section
4. Update SPEC.md
5. Create directory: !`mkdir -p .claude/context/[new-section]`

### Migrate Framework
If args contain "migrate to [X]":
1. Read current structure and docs
2. Generate new SPEC for target framework
3. Create new directory structure
4. Move/reorganize existing docs
5. Update SPEC.md
6. Report migration steps completed

### Validate Only
If args contain "validate":
1. Skip creation operations
2. Only perform validation checks
3. Report compliance and issues

### Optimize
If args contain "optimize":
1. Find files >200 lines
2. For each, rewrite to be more token-efficient
3. Maintain content, compress prose
4. Report optimization results

## Output

### Success (Bootstrap)
```
✓ Probe cache loaded ([project-type], [architecture])

Framework selected: [framework-name]

Created:
  ✓ .claude/context/SPEC.md
  ✓ .claude/context/README.md
  ✓ .claude/CLAUDE.md (created/updated)
  ✓ .claude/context/project/
  ✓ .claude/context/architecture/
  ✓ .claude/context/features/
  ✓ .claude/context/domain/

Feature directories created:
  • features/[feature1]/
  • features/[feature2]/

Structure initialized per SPEC.

Next steps:
  → Run /limpid:assimilate [feature] to document features
```

### Success (Validation)
```
✓ Probe cache loaded

Structure validation:
  ✓ SPEC.md exists ([framework] framework)
  ✓ All required directories present
  ✓ [N] feature folders
  ⚠ [N] files exceed 200 lines (consider optimizing)
  ⚠ [N] missing directories (if any)

Token optimization suggestions:
  • [file-path] ([N] lines → target <200)

Structure compliant. Ready for assimilation.
```

### Warning (No Probe Cache)
```
⚠ No probe cache found

Suggestion: Run /limpid:probe first for optimal structure setup.

Proceeding with default configuration...
[continue with bootstrap using defaults]
```

### Success (Natural Language)
```
✓ Probe cache loaded

Intent: "[parsed intent]"

Actions taken:
  ✓ [action 1]
  ✓ [action 2]

Modified:
  • SPEC.md - [what changed]
  • [directories created/modified]

Structure updated.
```

## Instructions

1. Check for probe cache, suggest running probe if missing
2. Load probe artifact (if exists) to understand project
3. Parse user arguments for intent (natural language or default)
4. Select appropriate SPEC framework based on architecture
5. If bootstrapping: Create full structure, SPEC.md, README.md
6. If validating: Check compliance, report issues
7. If natural language: Parse intent and execute appropriate operations
8. Handle edge cases gracefully (missing directories, permissions, etc.)
9. Output clear status with next steps

Focus on creating a clean, token-efficient structure that follows the SPEC principles.
