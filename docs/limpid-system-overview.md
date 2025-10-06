# LimpidAI System Overview
**Version**: 0.0.0  
**Status**: Design Complete

---

## Vision

Lightweight, intelligent context management for Claude Code using:
- **3 independent commands**: probe, curate, assimilate
- **Optional orchestrator**: @curator for complex workflows
- **Intelligent discovery**: Pattern analysis, not just file listing
- **Token-optimized docs**: 5x more efficient, AI-consumable
- **Self-organizing**: SPEC.md defines structure dynamically

---

## Core Philosophy

> "Commands are autonomous. Curator orchestrates when needed. Probe guides everything."

### Key Principles

1. **Commands work standalone** - No dependencies, run independently
2. **Curator is optional** - Only for orchestration + token efficiency
3. **Probe produces intelligence** - Guided artifact prevents hallucination
4. **Token-conscious** - 50-200 lines per file, dense and structured
5. **Git-aware** - Fast discovery, change tracking

---

## System Architecture

### The Components

```
User/Main Claude
    │
    ├──→ /limpid:probe (standalone)
    ├──→ /limpid:curate (standalone)
    ├──→ /limpid:assimilate (standalone)
    │
    └──→ @curator (optional orchestrator)
           │
           ├─→ Can invoke commands via SlashCommand tool
           └─→ Adds: orchestration + token efficiency
```

### When to Use What

**Use commands directly**:
```bash
# Check what changed
/limpid:probe

# Set up structure
/limpid:curate

# Document feature
/limpid:assimilate auth
```

**Use curator when**:
- Complex multi-step workflows
- Need intelligent chaining
- Want token-optimized writing
- Large context updates

---

## Directory Structure

```
.claude/
├── commands/
│   └── limpid/
│       ├── probe.md       # Discovery + analysis
│       ├── curate.md      # SPEC + structure
│       └── assimilate.md  # Knowledge writing
│
├── agents/
│   └── curator.md         # Optional orchestrator
│
└── context/               # Knowledge base (COMMITTED)
    ├── SPEC.md           # Framework rules
    ├── README.md         # System docs
    └── [structure per SPEC.md]

.cache/                    # Local cache (GITIGNORED)
└── limpid/
    └── probe.json        # Guided artifact
```

---

## The 3 Commands

### `/limpid:probe` - Discovery & Analysis

**Purpose**: Discover codebase, analyze patterns, produce guided artifact

**Standalone use**:
```bash
# Check project state
/limpid:probe

# Agent mode (JSON only)
/limpid:probe --quiet

# Focused analysis
/limpid:probe "analyze API structure"
```

**What it produces**:
- Cached guided artifact (`.cache/limpid/probe.json`)
- Architecture patterns detected
- Feature mapping with dependencies
- Gap analysis
- Change tracking

**Key feature**: Intelligence layer - not just file listing

See: `limpid-probe-command.md`

---

### `/limpid:curate` - Organization & Structure

**Purpose**: Install SPEC.md, create/validate structure

**Standalone use**:
```bash
# Initial setup
/limpid:curate

# Modify SPEC
/limpid:curate "add deployment section"

# Change framework
/limpid:curate "migrate to API framework"
```

**What it does**:
- Reads probe cache (suggests probe if missing)
- Installs appropriate SPEC.md
- Creates directory structure
- Validates compliance
- Handles natural language SPEC modifications

See: `limpid-curate-command.md`

---

### `/limpid:assimilate` - Knowledge Writing

**Purpose**: Extract conversation knowledge, write context files

**Standalone use**:
```bash
# Document feature
/limpid:assimilate auth

# With refinement
/limpid:assimilate auth "focus on security"

# Bulk operation
/limpid:assimilate "regenerate all docs"
```

**What it does**:
- Extracts from conversation history
- Uses probe artifact for guidance (file locations, dependencies)
- Writes token-efficient docs
- Handles natural language refinements
- Prevents hallucination via probe verification

See: `limpid-assimilate-command.md`

---

## The Curator Agent (Optional)

### Purpose

Optional orchestrator for:
- Complex multi-command workflows
- Intelligent decision-making
- Token-optimized writing
- Proactive context maintenance

### When Curator Helps

**Scenario 1: First-time setup**
```bash
@curator "set up LimpidAI"

# Curator chains:
# 1. /limpid:probe
# 2. /limpid:curate
# 3. Reports: System ready
```

**Scenario 2: Large update**
```bash
@curator "update all context after auth refactor"

# Curator:
# 1. /limpid:probe --quiet
# 2. Analyzes changes
# 3. /limpid:assimilate (multiple features)
# 4. Token-optimizes output
```

**Scenario 3: Proactive (automatic)**
```
Main Claude detects 15 file changes
→ Invokes @curator automatically
→ Curator chains probe → assimilate
→ Context stays current
```

### When to Skip Curator

```bash
# Just checking state
/limpid:probe

# Simple setup
/limpid:curate

# Single feature
/limpid:assimilate payments
```

See: `limpid-curator-agent.md`

---

## Key Artifacts

### Probe Artifact (`.cache/limpid/probe.json`)

**Purpose**: Guided map for intelligent decisions

**Contains**:
- Project type, architecture, tech stack
- Code map (features, shared code, relationships)
- Gap detection (undocumented, orphaned, missing tests)
- Change tracking (what modified, what needs updates)

**Used by**:
- **Curate**: Choose SPEC, validate structure
- **Assimilate**: Know file locations, verify tech, add cross-refs
- **Curator**: Make intelligent decisions

**Why critical**: Prevents hallucination, enables accurate documentation

---

### SPEC.md (`.claude/context/SPEC.md`)

**Purpose**: Framework rules for context organization

**Defines**:
- Directory structure
- Document templates
- Token efficiency guidelines
- Cross-reference patterns

**Used by**:
- **Curate**: Install/validate structure
- **Assimilate**: Follow templates, map knowledge
- **Curator**: Understand organization

**Portable**: Copy to reuse framework across projects

---

## Token Efficiency

### The Problem

Traditional docs: 847 lines, ~3,400 tokens (explains concepts AI knows)

### The Solution

LimpidAI docs: 156 lines, ~620 tokens (project-specific only)

**Result**: 5.4x more efficient = load 5 features instead of 1

### Writing Principles

1. **Assume AI knowledge**: No tutorials
2. **Dense over verbose**: Facts, not stories
3. **Structured data**: Bullets, tables, key:value
4. **Project-specific**: YOUR choices only
5. **Cross-reference**: Never duplicate
6. **50-200 lines**: Focused per file

---

## Workflows

### Workflow 1: Check What Changed

```bash
# Standalone
/limpid:probe

# Output: "✓ 12 auth files modified. 2 undocumented features."
```

---

### Workflow 2: Bootstrap Project

```bash
# Option A: Manual
/limpid:probe
/limpid:curate

# Option B: Orchestrated
@curator "set up LimpidAI"
```

---

### Workflow 3: Document Feature

```bash
# Standalone
/limpid:assimilate payments

# With refinement
/limpid:assimilate payments "focus on Stripe integration"

# Orchestrated (for token efficiency)
@curator "document payments with optimal structure"
```

---

### Workflow 4: Proactive Maintenance

```
# [User modifies 15 files]

# Main Claude detects changes
# Automatically: @curator invoked
# Curator: chains probe → assimilate
# Result: Context updated automatically
```

---

## Quick Reference

### Commands (Standalone)

| Command | Purpose | Example |
|---------|---------|---------|
| `/limpid:probe` | Discover & analyze | `/limpid:probe` |
| `/limpid:curate` | Setup structure | `/limpid:curate` |
| `/limpid:assimilate` | Write docs | `/limpid:assimilate auth` |

### Agent (Orchestrator)

| Use Case | Command |
|----------|---------|
| Complex workflow | `@curator "set up system"` |
| Large update | `@curator "update all docs"` |
| Automatic | (invoked by Claude Code) |

### Artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| Probe cache | `.cache/limpid/probe.json` | Guided map |
| SPEC | `.claude/context/SPEC.md` | Framework rules |
| Context | `.claude/context/` | Knowledge base |

---

## Success Metrics

System working when:
- ✅ Commands work independently
- ✅ Probe guides assimilate (no hallucination)
- ✅ Token efficiency maintained (50-200 lines)
- ✅ Context stays current
- ✅ Curator optional, not required

---

## Implementation Order

1. **probe.md** - Foundation (discovery + intelligence)
2. **curate.md** - Structure (SPEC + organization)
3. **assimilate.md** - Content (knowledge writing)
4. **curator.md** - Orchestration (optional, last)

---

## Related Documents

- `limpid-probe-command.md` - Probe discovery + intelligence algorithms
- `limpid-curate-command.md` - Curate organization + SPEC management
- `limpid-assimilate-command.md` - Assimilate knowledge writing
- `limpid-curator-agent.md` - Curator orchestration (optional)

---

**Name Origin**: **limpid** (adj.) - clear, transparent, easily understood

The system makes context organization clear and transparent.
