# LimpidAI Assimilate Command
**Command**: `/limpid:assimilate`  
**Version**: 2.0.0

---

## Purpose

Extract knowledge from conversation and write token-efficient context files using probe artifact as guided map.

**Works independently** - no curator needed.

---

## Standalone Usage

```bash
# Document feature
/limpid:assimilate auth

# With refinement
/limpid:assimilate auth "focus on security decisions"

# Update existing
/limpid:assimilate payments "update with Stripe integration"

# Bulk operation
/limpid:assimilate "regenerate all feature docs"

# Extract everything
/limpid:assimilate
```

---

## Command File

**Location**: `.claude/commands/limpid/assimilate.md`

```markdown
---
description: Extract knowledge and write context with guided intelligence
argument-hint: [feature-name] [refinement]
---

# LimpidAI Assimilate - Knowledge Writing

Extract conversation knowledge and write token-efficient context files.

## Check Prerequisites

SPEC exists: !`test -f .claude/context/SPEC.md && echo "exists" || echo "missing"`

**If missing**: Suggest "Run `/limpid:curate` first to set up structure."

## Load Guided Map (Probe Artifact)

Read probe cache: !`cat .cache/limpid/probe.json 2>/dev/null`

**Critical**: This is the guided map that prevents hallucination.

**What it provides**:
- `code_map.features` - Where code lives, what it exports
- `relationships` - Dependencies and cross-references
- `packages.dependencies` - What tech actually exists
- `changes_since_last` - What needs updating
- `gaps.undocumented_features` - Priority list

## Natural Language Intent Parsing

Parse $ARGUMENTS for intent:

### Feature with Refinement
- "feature-name 'focus on X'" → Extract with specific focus
- "feature-name 'update with Y'" → Merge with existing docs
- "feature-name" → Standard full extraction

### Bulk Operations
- "regenerate all X" → Rewrite multiple files
- "condense X to <N lines" → Token-compress specific docs

### Specific Updates
- "add X section to Y" → Targeted addition
- "document the X patterns" → Extract specific topic

### Standard Extraction
- "feature-name" → Full feature documentation
- (empty) → Extract everything relevant from conversation

## Extraction Process

### 1. Read Conversation History

Extract from current conversation:
- **Requirements**: User stories, acceptance criteria
- **Architecture**: Technical design, components, data flow
- **Decisions**: Choices made, rationale, alternatives, trade-offs
- **API**: Endpoints, contracts, data models
- **Domain**: Business rules, terminology

Filter out:
- Tangents and casual chat
- Iteration noise (multiple versions of same idea)
- Meta-discussion about documentation itself

### 2. Apply Guided Intelligence

**Use probe artifact to guide**:

```json
// Conversation mentions "auth"

// Read probe.json:
"code_map.features.auth": {
  "location": "src/auth/",
  "files": ["login.ts", "middleware.ts"],
  "exports": ["login", "validateToken", "authMiddleware"],
  "imports_from": ["utils/hash", "prisma/client"],
  "tests": ["tests/auth/login.test.ts"]
}

// Use this to write accurate docs:
// - Mention specific files: login.ts, middleware.ts
// - Document exports: login, validateToken functions
// - Cross-ref dependencies: utils/hash, prisma client
// - Note tests exist
```

### 3. Verify Against Probe

**Prevent hallucination**:

```
Conversation mentions "Redis for sessions"

Check probe.json:
  "packages.dependencies": {
    // ... no Redis
  }

Action: "Redis mentioned but not in dependencies. Add package first?"
```

**Verify**:
- Tech mentioned exists in `packages`
- Files referenced exist in `code_map`
- Dependencies accurate per `relationships`

### 4. Determine Target Files

Read SPEC.md structure:

```
features/[name]/
  ├── requirements.md
  ├── architecture.md
  └── decisions.md
```

Check probe for existing docs:

```json
"code_map.features.auth": {
  "existing_docs": null  // Create new
}

"code_map.features.payments": {
  "existing_docs": "features/payments/architecture.md"  // Update existing
}
```

**Decision**:
- No existing docs → Create new files
- Existing docs → Update/merge

### 5. Write Token-Efficiently

**Principles**:
- Dense, structured (bullets, tables, key:value)
- Assume AI knowledge (no concept explanations)
- Project-specific only (YOUR implementation)
- 50-200 lines per file
- Cross-reference, never duplicate

**Template adherence**:
Follow SPEC.md templates for consistency

**Apply refinements**:
If $ARGUMENTS has refinement ("focus on security"), prioritize that aspect

### 6. Add Cross-References

**Use relationships from probe**:

```json
"relationships": {
  "src/auth/login.ts": {
    "depends_on": ["utils/hash.ts", "prisma/client"],
    "should_document_with": ["features/auth/"]
  }
}
```

**Write**:
```markdown
# Auth Architecture

## Dependencies
- Password hashing: See architecture/shared.md#hashing
- User model: See domain/user.md
```

### 7. Validate

Check:
- SPEC compliance (files in right locations)
- Cross-references valid (linked files exist)
- No content duplication
- Token efficiency (50-200 line target)

## Feature/Instructions
$ARGUMENTS

## Output

Report:
- Intent understood
- Probe guidance used (what was verified)
- Files created/updated (with paths)
- Knowledge extracted (categories)
- Cross-references added
- Token efficiency (line counts)
- Verification performed
```

---

## The Guided Map Advantage

### Without Probe Artifact (Guessing)

```
Conversation: "Document auth with JWT"

Assimilate guesses:
- Where auth code is (maybe src/auth/?)
- What functions exist (login? authenticate?)
- What it depends on (probably bcrypt?)
- Whether to create or update (no idea)

Result: Inaccurate, might hallucinate
```

---

### With Probe Artifact (Guided)

```
Conversation: "Document auth with JWT"

Assimilate reads probe.json:
- Location: src/auth/
- Files: login.ts, middleware.ts, oauth.ts
- Exports: login, validateToken, authMiddleware, oauthCallback
- Dependencies: utils/hash, next-auth, prisma/client
- Tests: tests/auth/login.test.ts
- Existing docs: null (create new)
- JWT in packages? Check: No "jsonwebtoken" found

Result: 
1. Accurate file documentation
2. Mentions real functions
3. Cross-refs actual dependencies
4. Warns: "JWT mentioned but jsonwebtoken not in dependencies. Add package?"
```

---

## Output Examples

### Feature Documentation

```
✓ Probe artifact loaded

Feature: auth
Intent: Standard documentation

Guided by probe:
  • Location: src/auth/
  • Functions: login, validateToken, authMiddleware
  • Dependencies: utils/hash, prisma/client
  • No existing docs (creating new)

Verification:
  ✓ All mentioned tech exists in packages
  ✓ Dependencies match code_map

Created:
  ✓ features/auth/requirements.md (87 lines)
  ✓ features/auth/architecture.md (156 lines)
  ✓ features/auth/decisions.md (64 lines)

Cross-references added:
  • architecture/shared.md#hashing
  • domain/user.md#user-model

Token efficiency: 307 lines total (avg 102 lines/file)
```

---

### Update Existing

```
✓ Probe artifact loaded

Feature: payments
Intent: Update with Stripe integration

Guided by probe:
  • Existing docs: features/payments/architecture.md
  • New code detected: stripe.ts, webhook.ts
  • New exports: createPayment, handleWebhook

Updated:
  ✓ features/payments/architecture.md
    - Added Stripe integration section
    - Documented webhook handling
    - Updated dependencies
    - Previous: 142 lines → Now: 178 lines

Cross-references maintained:
  ✓ All links still valid

Token efficiency: Within target (178 lines)
```

---

### Verification Warning

```
✓ Probe artifact loaded

Feature: auth
Intent: Standard documentation

⚠ Verification issue:
  Conversation mentions "Redis for sessions"
  Probe shows: No Redis in packages.dependencies

Question: Redis not detected in project dependencies. 
Should I:
  a) Document Redis anyway (you'll add it later)
  b) Skip Redis mentions until package added
  c) Proceed with alternative (in-memory sessions)

Please clarify before continuing.
```

---

## Usage Examples

### Example 1: New Feature

```bash
# After discussing auth feature
/limpid:assimilate auth

# Assimilate:
# 1. Reads conversation
# 2. Loads probe artifact
# 3. Verifies tech exists
# 4. Creates features/auth/
# 5. Writes token-efficient docs
```

---

### Example 2: With Refinement

```bash
/limpid:assimilate auth "focus on security decisions"

# Extracts only security-related content:
# - Authentication methods chosen
# - Password hashing approach
# - Session management decisions
# - Security trade-offs
```

---

### Example 3: Update Existing

```bash
# After Stripe integration discussion
/limpid:assimilate payments "update with Stripe integration"

# Assimilate:
# 1. Reads existing features/payments/architecture.md
# 2. Extracts Stripe-related content
# 3. Merges with existing (preserves structure)
# 4. Updates cross-references
```

---

### Example 4: Bulk Regeneration

```bash
/limpid:assimilate "regenerate all feature docs with new template"

# Assimilate:
# 1. Reads SPEC.md (new template)
# 2. For each feature in probe.code_map:
#    - Reads existing docs
#    - Rewrites following new template
#    - Preserves content, updates structure
```

---

## How It Uses Probe Artifact

### File Location Guidance

```json
"code_map.features.auth.location": "src/auth/"

→ Knows where auth code lives
→ Writes to features/auth/ (per SPEC)
```

---

### Function Documentation

```json
"code_map.features.auth.exports": [
  "login", "validateToken", "authMiddleware"
]

→ Documents these specific functions
→ Doesn't hallucinate non-existent functions
```

---

### Cross-Reference Accuracy

```json
"relationships": {
  "src/auth/login.ts": {
    "depends_on": ["utils/hash.ts"]
  }
}

→ Adds: "See: architecture/shared.md#hashing"
→ Accurate cross-reference, not guessed
```

---

### Tech Verification

```json
"packages.dependencies": {
  "bcrypt": "5.x",
  "jsonwebtoken": "9.x"
}

→ Conversation mentions JWT ✓
→ Package exists ✓
→ Document with confidence
```

---

### Change Detection

```json
"changes_since_last.modified": ["src/auth/login.ts"]

→ Knows login.ts changed
→ Updates features/auth/architecture.md login section
→ Preserves other sections
```

---

## Token Efficiency

### Target: 50-200 lines per file

**Example Output**:

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
- oauth.ts: OAuth provider integration (Google, GitHub)

## Decisions
- JWT vs sessions: Stateless API requirement
  Alternative: Full sessions (rejected - scaling)
- Redis sessions: Fast lookup + blacklist support
  Alternative: DB sessions (rejected - latency)

## Dependencies
- Password hashing: See architecture/shared.md#hashing
- User model: See domain/user.md

**Lines**: 156 (within target)
```

### vs Verbose

```markdown
# Authentication Architecture

Authentication is a critical part of our application that allows users 
to securely access their accounts. We've implemented a robust 
authentication system using industry-standard practices.

Our system uses JSON Web Tokens (JWT) for maintaining user sessions. 
JWT is a standard defined in RFC 7519 that allows us to create 
stateless authentication. The token contains claims about the user 
which are encoded in base64...

[continues for 847 lines]
```

**LimpidAI**: 5.4x more efficient

---

## Natural Language Examples

```bash
# Focus extraction
/limpid:assimilate auth "focus on security"
/limpid:assimilate payments "focus on error handling"

# Update modes
/limpid:assimilate auth "update with OAuth changes"
/limpid:assimilate payments "add Stripe webhook docs"

# Regeneration
/limpid:assimilate "regenerate auth docs"
/limpid:assimilate "condense all docs to <200 lines"

# Targeted additions
/limpid:assimilate "add testing section to auth"
/limpid:assimilate "document error handling patterns"
```

---

## Key Features

### 1. Guided Intelligence
Uses probe artifact to know exactly where code lives, what it does

### 2. Verification
Checks that mentioned tech exists before documenting

### 3. Token Efficiency
Writes dense, structured, AI-optimized documentation

### 4. Natural Language
Understands refinements and bulk operations

### 5. Accuracy
Prevents hallucination through probe verification

---

## Implementation Notes

### Conversation Extraction

1. **Scan full conversation history**
2. **Identify relevant messages** (filter meta-discussion)
3. **Extract by category** (requirements, architecture, decisions)
4. **Deduplicate** (remove iteration noise)
5. **Structure** (organize for template)

### Probe Integration

1. **Load artifact** before extraction
2. **Use as reference** during writing
3. **Verify claims** against artifact
4. **Add cross-refs** from relationships
5. **Check existing docs** to update vs create

### Token Optimization

1. **No concept explanations**
2. **Structured over prose**
3. **Project-specific only**
4. **Cross-reference, don't duplicate**
5. **Target 50-200 lines**

---

## Why This Matters

**Without probe guidance**:
- Guesses file locations
- Hallucinates functions
- Mentions tech not in project
- Breaks cross-references
- Inaccurate documentation

**With probe guidance**:
- Knows exact locations
- Documents real functions
- Verifies tech exists
- Accurate cross-references
- Precise documentation

**This is LimpidAI's core value** - guided accuracy, not guessing.

---

## Related

- System overview: `limpid-system-overview.md`
- Reads artifact: `limpid-probe-command.md`
- Follows structure: `limpid-curate-command.md`
- May be orchestrated by: `limpid-curator-agent.md`
