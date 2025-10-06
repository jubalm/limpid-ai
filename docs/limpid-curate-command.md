# LimpidAI Curate Command
**Command**: `/limpid:curate`  
**Version**: 0.0.0

---

## Purpose

Install SPEC.md framework, create/validate directory structure, maintain organization.

**Works independently** - no curator needed.

---

## Standalone Usage

```bash
# Initial setup
/limpid:curate

# Modify SPEC
/limpid:curate "add deployment section"

# Change framework
/limpid:curate "migrate to API framework"

# Validate only
/limpid:curate "validate structure"
```

---

## Command File

**Location**: `.claude/commands/limpid/curate.md`

````markdown
---
description: Organize structure with SPEC management
argument-hint: [natural-language-instruction]
allowed-tools: Bash(test:*), Bash(find:*), Read, Write, CreateFile, StrReplace
---

# LimpidAI Curate - Organization & Structure

Install SPEC.md, create structure, maintain organization.

## Check Prerequisites

Probe cache: !`test -f .cache/limpid/probe.json && echo "exists" || echo "missing"`

**If missing**: Suggest "Run `/limpid:probe` first for optimal setup."

## Load Probe Artifact

Read cache: !`cat .cache/limpid/probe.json 2>/dev/null`

**Key information**:
- `project.type` and `project.architecture`
- `tech_stack` details
- `code_map` for structure understanding
- `gaps.undocumented_features`

## Natural Language Intent Parsing

Parse $ARGUMENTS for user intent:

### SPEC Modifications
- "add X section" → Extend SPEC structure
- "remove Y from templates" → Edit SPEC templates
- "migrate to Z framework" → Replace SPEC entirely

### Structure Operations
- "validate" → Check compliance only
- "optimize" → Token-compress existing docs
- "reorganize" → Restructure per SPEC

### Template Updates
- "update X template with Y" → Modify specific template

## Standard Curation (No specific intent)

### 1. Determine Framework

Based on probe artifact:

**Web App + Feature-based**:
```
features/[name]/
  ├── requirements.md
  ├── architecture.md
  └── decisions.md
architecture/
  └── patterns.md
```

**API + Layered**:
```
api/
  ├── endpoints.md
  └── contracts.md
services/[name]/
  └── architecture.md
data/
  └── models.md
```

**Mobile**:
```
screens/[name]/
  └── requirements.md
components/[name]/
  └── design.md
navigation/
  └── flow.md
```

### 2. Bootstrap (If no LimpidAI)

Create:
- `.claude/context/` directory
- `SPEC.md` (chosen framework)
- `README.md` (system documentation)
- Directory structure per SPEC

### 3. Validate (If LimpidAI exists)

Check:
- Structure matches SPEC?
- Missing directories?
- Oversized files (>300 lines)?
- Token optimization needed?

### 4. Maintain

- Optimize verbose docs (>300 lines)
- Add missing sections
- Fix broken cross-references
- Ensure 50-200 line targets

## User Instruction
$ARGUMENTS

## Output

Report:
- Probe cache status
- Intent understood (if natural language)
- Framework selected/validated
- Actions taken
- Structure created/validated
- Issues found (if any)
- Recommendations
````

---

## What It Does

### 1. Reads Probe Artifact

```bash
# Loads .cache/limpid/probe.json
{
  "project": {
    "type": "web-app",
    "architecture": "feature-based"
  },
  "tech_stack": {
    "database": ["prisma"]
  },
  "gaps": {
    "undocumented_features": ["auth", "payments"]
  }
}
```

**Uses this to**:
- Choose appropriate SPEC framework
- Understand existing structure
- Prioritize what to document

---

### 2. Installs SPEC.md

**Example Web-App SPEC**:

````markdown
# LimpidAI Framework Specification
## Web Application (Feature-Based)

### Directory Structure

```
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
│   └── patterns.md           # Design patterns
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
```

### Document Templates

#### features/[name]/requirements.md
```
# [Feature Name] Requirements

**Status**: [planned|in-progress|complete]
**Owner**: [team/person]

## Purpose
[One-line what and why]

## User Stories
- As [user], I want [capability] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

#### features/[name]/architecture.md
```
# [Feature Name] Architecture

**Tech Stack**: [relevant tech]
**Dependencies**: [what it depends on]

## Components
- Component 1: [purpose]

## Data Flow
[How data moves]

## Key Decisions
- Decision: [what]
  Rationale: [why]
  Alternative: [what was considered]
```

### Token Efficiency Guidelines

**Target**: 50-200 lines per file

**Principles**:
- Assume AI knowledge (no tutorials)
- Project-specific only
- Dense, structured (bullets, tables)
- Cross-reference, never duplicate

### Cross-Reference Patterns

```markdown
See: architecture/patterns.md
Related: features/auth/architecture.md
Depends: domain/concepts.md#user-model
```
````

---

### 2.5. Creates/Updates CLAUDE.md Bootstrap

Creates or updates `.claude/CLAUDE.md` to auto-load context system in every session:

```markdown
@context/SPEC.md
@context/README.md
```

This gives Claude:
- Complete context structure map (from SPEC)
- Management command knowledge (from README)
- Intelligent context navigation without loading all files

---

### 3. Creates Directory Structure

```bash
mkdir -p .claude/context/project
mkdir -p .claude/context/architecture
mkdir -p .claude/context/features
mkdir -p .claude/context/domain
```

Populates with:
- Empty template files
- Or stub content if probe shows existing features

---

### 4. Validates Existing Structure

```bash
# Check compliance
find .claude/context -name "*.md"

# Compare with SPEC structure
# Report mismatches
```

**Validation checks**:
- Missing directories from SPEC
- Files in wrong locations
- Oversized files (>300 lines)
- Missing templates

---

### 5. Handles Natural Language

```bash
/limpid:curate "add deployment section"

# Curate:
# 1. Reads current SPEC.md
# 2. Adds deployment/ to structure
# 3. Creates deployment template
# 4. Updates SPEC.md
```

---

## Output Examples

### First-Time Setup

```
✓ Probe cache loaded (React/TS web-app, feature-based)

Framework selected: web-app (feature-based architecture)

Created:
  ✓ .claude/context/SPEC.md
  ✓ .claude/context/README.md
  ✓ .claude/context/project/
  ✓ .claude/context/architecture/
  ✓ .claude/context/features/
  ✓ .claude/context/domain/

Structure initialized per SPEC.

Detected features: auth, payments (undocumented)
Next: Run /limpid:assimilate to document features
```

---

### Validation

```
✓ Probe cache loaded

Structure validation:
  ✓ SPEC.md exists (web-app framework)
  ✓ All directories present
  ✓ 8 feature folders
  ⚠ 2 files exceed 300 lines (consider splitting)

Token optimization suggestions:
  • features/auth/architecture.md (347 lines → target <200)
  • architecture/patterns.md (412 lines → consider splitting)

Structure compliant. Ready for assimilation.
```

---

### SPEC Modification

```
✓ Probe cache loaded

Natural language: "add deployment section"

Modified SPEC.md:
  ✓ Added deployment/ to structure
  ✓ Created template: deployment/strategy.md

Updated structure:
  ✓ mkdir .claude/context/deployment/
  ✓ Created deployment/strategy.md (stub)

SPEC updated. Structure extended.
```

---

## Usage Examples

### Example 1: Bootstrap

```bash
# First time
/limpid:probe
/limpid:curate

# Output:
# ✓ Web-app SPEC installed
# ✓ Structure created
# Ready for assimilation
```

---

### Example 2: Framework Migration

```bash
/limpid:curate "migrate to API framework"

# Curate:
# 1. Backs up current SPEC
# 2. Installs API SPEC
# 3. Restructures existing docs
# 4. Updates cross-references
```

---

### Example 3: Validation

```bash
# After manual changes
/limpid:curate "validate structure"

# Output:
# ✓ Structure matches SPEC
# ⚠ 1 file oversized
# ⚠ 2 broken cross-references
```

---

## How It Uses Probe Artifact

```json
// From probe.json

"project.architecture": "feature-based"
→ Chooses feature-folder SPEC template

"tech_stack.database": ["prisma"]
→ SPEC includes data model sections

"code_map.shared.utils/"
→ SPEC defines architecture/shared.md

"gaps.undocumented_features": ["auth"]
→ Creates features/auth/ structure preemptively
```

---

## SPEC.md Portability

**Reusable across projects**:

```bash
# Project A (web app)
cp ~/specs/web-app-spec.md project-a/.claude/context/SPEC.md

# Project B (API)
cp ~/specs/api-spec.md project-b/.claude/context/SPEC.md
```

**Same system, different frameworks.**

---

## Natural Language Examples

```bash
# Extend structure
/limpid:curate "add testing section"
/limpid:curate "add deployment docs"

# Modify templates
/limpid:curate "remove estimations from requirements template"
/limpid:curate "add acceptance criteria to features"

# Restructure
/limpid:curate "migrate to API framework"
/limpid:curate "switch to domain-driven structure"

# Optimize
/limpid:curate "optimize all docs for token efficiency"
/limpid:curate "condense architecture docs"

# Validate
/limpid:curate "validate structure"
/limpid:curate "check compliance"
```

---

## Key Features

### 1. Probe-Aware
Reads cache to make intelligent framework choice

### 2. Framework Flexibility
Supports multiple SPEC templates (web, API, mobile, custom)

### 3. Natural Language
Understands intent, modifies structure accordingly

### 4. Validation
Checks compliance, identifies issues

### 5. Token Optimization
Enforces 50-200 line targets, suggests splits

---

## Implementation Notes

### SPEC Templates

Maintain library of SPEC templates:
- `web-app-spec.md` - Feature-based web applications
- `api-spec.md` - Backend APIs (layered)
- `mobile-spec.md` - Mobile apps (screen-based)
- `monorepo-spec.md` - Multi-package repositories

### Bootstrap Strategy

1. **Detect** project type from probe
2. **Select** appropriate SPEC template
3. **Install** SPEC.md + README.md
4. **Create** directory structure
5. **Populate** with templates or stubs

### Validation Strategy

1. **Read** SPEC.md structure definition
2. **Scan** `.claude/context/` filesystem
3. **Compare** expected vs actual
4. **Report** discrepancies
5. **Suggest** fixes

---

## Why This Matters

**Without curate**:
- Manually create structure
- Inconsistent organization
- No framework guidance
- Hard to scale

**With curate**:
- Automatic structure setup
- Framework-driven consistency
- Natural language modifications
- Easy validation

---

## Related

- System overview: `limpid-system-overview.md`
- Reads artifact: `limpid-probe-command.md`
- Follows structure: `limpid-assimilate-command.md`
- May be orchestrated by: `limpid-curator-agent.md`
