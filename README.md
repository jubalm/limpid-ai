# LimpidAI

**Version 0.0.0** - Genesis Release

Lightweight, intelligent context management system for [Claude Code](https://docs.claude.com/en/docs/claude-code).

---

## What is LimpidAI?

LimpidAI helps Claude Code understand your codebase through:
- **Intelligent discovery** - Pattern analysis, not just file listing
- **Token-optimized docs** - 5x more efficient context
- **Self-organizing** - Dynamic structure via SPEC.md
- **Git-aware** - Fast discovery and change tracking

Built on 3 independent commands + optional orchestrator.

---

## Quick Start

### Installation

#### Option 1: npx (Recommended)

Navigate to your project and run:
```bash
npx github:jubalm/limpid-ai
```

This will copy the `.claude/` directory to your current project.

#### Option 2: Manual Installation

Copy the `.claude/` directory manually:
```bash
git clone https://github.com/jubalm/limpid-ai.git
cp -r limpid-ai/.claude/ /path/to/your/project/.claude/
rm -rf limpid-ai
```

### Usage

Once installed, navigate to your project and run:
```bash
/limpid:probe        # Discover your codebase
/limpid:curate       # Set up structure
/limpid:assimilate   # Document features
```

Or use the orchestrator for complex workflows:
```bash
@curator "set up LimpidAI"
```

---

## The System

### 3 Commands (Work Independently)

| Command | Purpose | Example |
|---------|---------|---------|
| `/limpid:probe` | Discover & analyze codebase | `/limpid:probe` |
| `/limpid:curate` | Set up structure & SPEC | `/limpid:curate` |
| `/limpid:assimilate` | Write context docs | `/limpid:assimilate auth` |

### Optional Orchestrator

**@curator** - Use for complex workflows, intelligent chaining, and token-optimized writing.

```bash
@curator "update all context after auth refactor"
```

---

## Key Features

- **Commands work standalone** - No dependencies between them
- **Probe produces intelligence** - Guided artifact prevents hallucination
- **Token-conscious** - 50-200 lines per file, dense and structured
- **Optional orchestration** - Curator adds intelligence when needed
- **Git-native** - Leverages git for fast discovery

---

## Project Structure

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
└── context/               # Knowledge base (auto-created)
    ├── SPEC.md           # Framework rules
    └── [your docs]       # Generated context

.cache/limpid/            # Local cache (gitignored)
└── probe.json            # Guided artifact
```

---

## Documentation

Detailed docs in `/docs`:
- `limpid-system-overview.md` - Complete system architecture
- `limpid-probe-command.md` - Discovery & intelligence algorithms
- `limpid-curate-command.md` - Organization & SPEC management
- `limpid-assimilate-command.md` - Knowledge writing patterns
- `limpid-curator-agent.md` - Orchestration (optional)

---

## Philosophy

> "Commands are autonomous. Curator orchestrates when needed. Probe guides everything."

1. **Commands work standalone** - Run independently, no coupling
2. **Curator is optional** - Only for orchestration + efficiency
3. **Probe produces intelligence** - Guided artifact prevents hallucination
4. **Token-conscious** - Every token counts
5. **Git-aware** - Fast, native discovery

---

## Example Workflows

### Check what changed
```bash
/limpid:probe
# Output: "✓ 12 auth files modified. 2 undocumented features."
```

### Bootstrap new project
```bash
@curator "set up LimpidAI"
# Curator runs: probe → curate → reports ready
```

### Document a feature
```bash
/limpid:assimilate payments "focus on Stripe integration"
```

---

## License

MIT License - Free to use, modify, and distribute.

---

## Name Origin

**limpid** (adj.) - *clear, transparent, easily understood*

The system makes context organization clear and transparent.
