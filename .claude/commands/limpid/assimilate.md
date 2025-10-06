---
description: Extract knowledge and write context with guided intelligence
argument-hint: [feature-name] [refinement]
allowed-tools: Bash(test:*), Bash(find:*), Bash(wc:*), Read, Write, Edit
---

# LimpidAI Assimilate - Knowledge Writing

Extract conversation knowledge and write token-efficient context files using probe artifact as guided map.

## Check Prerequisites

SPEC exists: !`test -f .claude/context/SPEC.md && echo "exists" || echo "missing"`

**If missing**: Suggest running `/limpid:curate` first to set up structure.

## Load Guided Map (Probe Artifact)

Read probe cache: !`test -f .cache/limpid/probe.json && cat .cache/limpid/probe.json 2>/dev/null || echo "{}"`

**Critical**: This is the guided map that prevents hallucination and ensures accuracy.

**Extract from probe artifact**:
- `code_map.features` - Where code lives, what it exports, dependencies
- `relationships` - File dependencies and cross-reference guidance
- `packages.dependencies` - What tech actually exists in the project
- `changes_since_last` - What needs updating
- `gaps.undocumented_features` - Priority features to document
- `tech_stack` - Runtime, database, testing frameworks

## Load SPEC Template

Read SPEC: !`test -f .claude/context/SPEC.md && cat .claude/context/SPEC.md 2>/dev/null || echo ""`

**Extract from SPEC**:
- Directory structure (where to write files)
- Document templates (format to follow)
- Token efficiency targets (50-200 lines)
- Cross-reference patterns

## Natural Language Intent Parsing

User input: $ARGUMENTS

**Parse intent**:

### Feature with Refinement
- Format: `[feature-name] "refinement text"` or `[feature-name] 'refinement text'`
- Example: `auth "focus on security"` → Extract auth feature, emphasize security
- Example: `payments 'update with Stripe'` → Update payments docs with Stripe info

### Feature Only
- Format: `[feature-name]`
- Example: `auth` → Standard full feature documentation

### Bulk Operations
- Contains "regenerate all" → Rewrite multiple features
- Contains "condense" or "optimize" → Token-compress existing docs
- Contains "update all" → Update all existing docs

### Specific Updates
- Contains "add [X] section to [Y]" → Targeted addition
- Contains "document [X] patterns" → Extract specific topic

### Extract Everything (Default)
- Empty or unrecognized → Extract all relevant knowledge from conversation

## Conversation Extraction Process

### 1. Scan Conversation History

Extract knowledge by category from the current conversation:

**Requirements**:
- User stories ("As a [user], I want [capability]...")
- Acceptance criteria
- Feature purposes and goals
- Business requirements

**Architecture**:
- Technical design decisions
- Component structures
- Data flows
- API designs
- Integration patterns

**Decisions**:
- Choices made (what was chosen)
- Rationale (why it was chosen)
- Alternatives considered (what was rejected and why)
- Trade-offs accepted

**Technical Details**:
- Specific implementations
- Code patterns used
- Configuration choices
- Dependencies added

**Domain Knowledge**:
- Business rules
- Terminology
- Concepts
- Workflows

### 2. Filter Out Noise

**Exclude**:
- Casual conversation
- Multiple iterations of same idea (keep latest)
- Meta-discussion about documentation itself
- Off-topic tangents
- Debugging artifacts (unless relevant to decisions)

### 3. Apply Guided Intelligence from Probe

For the target feature (from $ARGUMENTS), read from probe artifact:

**If feature exists in `code_map.features`**:
```json
{
  "location": "src/auth/",
  "files": ["login.ts", "middleware.ts", "oauth.ts"],
  "exports": ["login", "validateToken", "authMiddleware"],
  "imports_from": ["utils/hash", "prisma/client"],
  "tests": ["tests/auth/login.test.ts"],
  "existing_docs": null or "path/to/docs"
}
```

**Use this to**:
- Know exact file locations (don't guess)
- Document actual exports (don't hallucinate functions)
- Add accurate cross-references to dependencies
- Know whether to create new or update existing docs
- Mention real test files

### 4. Verify Against Probe (Prevent Hallucination)

Before writing any technical claim, verify against probe:

**Tech Stack Verification**:
- Conversation mentions "Redis" → Check `packages.dependencies` for Redis
- Conversation mentions "JWT" → Check for jsonwebtoken or similar
- If not found → Ask user or note as "planned addition"

**File Verification**:
- Conversation mentions "auth.ts" → Check `code_map` for actual file
- If file doesn't exist → Note as "to be created" or skip

**Dependency Verification**:
- Cross-references → Check against `relationships` for accuracy
- Shared utilities → Verify from `code_map.shared`

### 5. Determine Target Files

From SPEC structure, determine where to write:

**Example for feature-based**:
- `features/[feature-name]/requirements.md`
- `features/[feature-name]/architecture.md`
- `features/[feature-name]/decisions.md`

**Check if docs exist**:
- From probe: `code_map.features.[name].existing_docs`
- If exists → Update/merge
- If null → Create new

## Token-Efficient Writing

### Principles

**Target**: 50-200 lines per file

**Style**:
- Dense, structured (bullets, tables, key:value)
- Assume AI knowledge (no concept explanations)
- Project-specific only (document YOUR choices, not general concepts)
- Cross-reference instead of duplicate
- Facts over prose

**Bad** (verbose, 300+ lines):
```markdown
Authentication is a critical part of our application that allows
users to securely access their accounts. We've implemented a robust
authentication system using industry-standard practices.

Our system uses JSON Web Tokens (JWT) for maintaining user sessions.
JWT is a standard defined in RFC 7519 that allows us to create
stateless authentication...
[continues with concept explanations]
```

**Good** (dense, 156 lines):
```markdown
# Auth Architecture

**Method**: JWT (RS256, httpOnly cookies)
**Storage**: Redis sessions, 7d TTL
**Dependencies**: next-auth, prisma, bcrypt

## Flow
Login → Validate → Generate JWT → Store session → Return cookies
Request → Extract JWT → Validate → Check Redis → Allow/Deny

## Components
- login.ts: Credential validation, JWT generation
- middleware.ts: Token validation, session checks
- oauth.ts: OAuth providers (Google, GitHub)

## Decisions
- JWT vs sessions: Stateless API requirement
  Alternative: Full sessions (rejected - scaling concerns)
- Redis sessions: Fast lookup + blacklist support
  Alternative: DB sessions (rejected - latency)

## Dependencies
See: architecture/shared.md#hashing
See: domain/user.md
```

### Template Adherence

Follow SPEC.md templates for consistency:
- Use required sections
- Match format (bullets, tables, etc.)
- Stay within line targets

### Apply Refinements

If $ARGUMENTS contains refinement (e.g., "focus on security"):
- Prioritize that aspect in the documentation
- Extract more details about that topic
- May reduce other sections to stay within line targets

## Cross-Reference Addition

Use `relationships` from probe artifact:

**Example**:
```json
"src/auth/login.ts": {
  "depends_on": ["utils/hash.ts", "prisma/client"],
  "should_document_with": ["features/auth/"]
}
```

**Write in docs**:
```markdown
## Dependencies
- Password hashing: See architecture/shared.md#hashing
- User model: See domain/user.md
```

## Validation Before Writing

**Check**:
1. SPEC compliance (files in right locations)
2. All mentioned tech exists in probe's `packages`
3. All mentioned files exist in probe's `code_map`
4. Cross-references point to valid files
5. No content duplication with other docs
6. Token efficiency (50-200 line target)

**If verification fails**:
- Ask user for clarification
- Note as "planned" rather than "implemented"
- Suggest adding missing dependencies

## Write Documentation

### Create New Files

For each document to create:
1. Ensure directory exists: !`mkdir -p .claude/context/features/[feature-name]`
2. Write file following template and principles
3. Track line count

### Update Existing Files

For existing documentation:
1. Read current content
2. Identify what to add/update
3. Merge new knowledge with existing (preserve structure)
4. Update cross-references if needed
5. Ensure token efficiency maintained

## Output

### Success (Feature Documentation)
```
✓ Probe artifact loaded

Feature: [feature-name]
Intent: [parsed intent - standard|focus on X|update with Y]

Guided by probe:
  • Location: [path]
  • Functions: [list of actual exports]
  • Dependencies: [actual dependencies]
  • Status: [creating new | updating existing]

Verification:
  ✓ All mentioned tech exists in packages
  ✓ Dependencies match code_map
  ✓ File locations verified

Created/Updated:
  ✓ features/[name]/requirements.md ([N] lines)
  ✓ features/[name]/architecture.md ([N] lines)
  ✓ features/[name]/decisions.md ([N] lines)

Cross-references added:
  • [cross-ref 1]
  • [cross-ref 2]

Token efficiency: [total] lines total (avg [N] lines/file)
```

### Success (Update Existing)
```
✓ Probe artifact loaded

Feature: [feature-name]
Intent: Update with [refinement]

Guided by probe:
  • Existing docs: [path]
  • New code detected: [files]
  • New exports: [functions]

Updated:
  ✓ features/[name]/architecture.md
    - Added [new section]
    - Updated dependencies
    - Previous: [N] lines → Now: [M] lines

Cross-references maintained:
  ✓ All links still valid

Token efficiency: Within target ([N] lines)
```

### Warning (Verification Issue)
```
✓ Probe artifact loaded

Feature: [feature-name]

⚠ Verification issue:
  Conversation mentions "[tech]"
  Probe shows: Not in packages.dependencies

Question: [Tech] not detected in project dependencies.
Should I:
  a) Document anyway (you'll add it later)
  b) Skip mentions until package added
  c) Note as "planned addition"

Please clarify before continuing.
```

### Suggestion (No SPEC)
```
⚠ No SPEC.md found

Suggestion: Run /limpid:curate first to set up structure.

Cannot proceed without structure definition.
```

### Success (Bulk Operation)
```
✓ Probe artifact loaded

Intent: Regenerate all feature docs

Features processed:
  ✓ auth ([N] lines)
  ✓ payments ([N] lines)
  ✓ notifications ([N] lines)

Total: [N] files created/updated
Token efficiency: Avg [N] lines/file
```

## Instructions

1. Check for SPEC.md, suggest curate if missing
2. Load probe artifact (guided map) - critical for accuracy
3. Load SPEC.md for templates and structure
4. Parse user arguments for intent and target feature
5. Scan conversation history and extract relevant knowledge
6. Filter out noise and iteration artifacts
7. For target feature, read probe artifact details (location, exports, dependencies)
8. Verify all technical claims against probe (prevent hallucination)
9. Determine target files based on SPEC structure
10. Check if docs exist (create new vs update)
11. Write token-efficiently following principles (50-200 lines)
12. Add accurate cross-references from relationships
13. Validate before writing (SPEC compliance, tech exists, no duplication)
14. Create/update documentation files
15. Report what was created/updated with line counts and verification status

Focus on accuracy guided by probe artifact. Never hallucinate file locations, functions, or technologies. Verify everything against the probe cache.

This is LimpidAI's core value: guided accuracy, not guessing.
