# LimpidAI Assimilate Command
**Command**: `/limpid:assimilate`  
**Version**: 0.0.0

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

**Key Configuration**:
- **Arguments**: `[feature-name] [refinement]`
- **Tools**: File operations (`Read`, `Write`, `Edit`)
- **Approach**: Probe-guided knowledge extraction from conversation
- **Prerequisites**: Suggests `/limpid:curate` if SPEC missing

**Supported Intents** (natural language):
- Feature extraction: "auth", "auth 'focus on security'"
- Bulk operations: "regenerate all feature docs"
- Targeted updates: "add testing section to auth"
- Token optimization: "condense X to <200 lines"

**Extraction Process**:
1. Read conversation history (filter noise, extract knowledge)
2. Apply guided intelligence using probe artifact
3. Verify against probe (prevent hallucination)
4. Determine target files (create vs update)
5. Write token-efficiently (50-200 lines, dense structure)
6. Add cross-references (from probe relationships)
7. Validate (SPEC compliance, no duplication)

**The Guided Map Advantage**: Uses probe artifact to know exact file locations, real exports, actual dependencies - prevents guessing and hallucination.

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

````markdown
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
````

### vs Verbose

````markdown
# Authentication Architecture

Authentication is a critical part of our application that allows users 
to securely access their accounts. We've implemented a robust 
authentication system using industry-standard practices.

Our system uses JSON Web Tokens (JWT) for maintaining user sessions. 
JWT is a standard defined in RFC 7519 that allows us to create 
stateless authentication. The token contains claims about the user 
which are encoded in base64...

[continues for 847 lines]
````

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
