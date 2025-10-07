# Claude Code Quick Reference

A consolidated summary of key Claude Code features and configurations.

---

## Subagents

**Purpose**: Specialized AI assistants with custom configurations, separate context windows, and specific tool access.

### Key Benefits
- **Context preservation**: Each operates in own context
- **Specialized expertise**: Fine-tuned for specific domains
- **Reusability**: Share across projects and teams
- **Flexible permissions**: Granular tool access control

### Quick Start
```bash
/agents  # Opens subagent management interface
```

### File Format
```markdown
---
name: your-sub-agent-name
description: Description of when this subagent should be invoked
tools: tool1, tool2, tool3  # Optional - inherits all if omitted
model: sonnet  # Optional - sonnet, opus, haiku, or 'inherit'
---

System prompt goes here. Define role, capabilities, and approach.
```

### Locations & Priority
- **Project**: `.claude/agents/` (highest priority)
- **CLI**: `--agents` flag (mid priority, session-specific)
- **User**: `~/.claude/agents/` (lowest priority)

### Key Details
- **Auto-delegation**: Add "use PROACTIVELY" or "MUST BE USED" to `description` for automatic invocation
- **Tool inheritance**: Omit `tools` field to inherit ALL tools (including MCP tools)
- **Model options**: Use `inherit` to match main conversation's model

### Example: Code Reviewer
```markdown
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is simple and readable
- No duplicated code
- Proper error handling
- No exposed secrets
- Input validation
- Test coverage
```

### Best Practices
- Start with Claude-generated agents, then customize
- Design focused subagents with single responsibilities
- Write detailed prompts with specific instructions
- Limit tool access to what's necessary
- Version control project subagents

---

## Models

### Latest Models (Jan 2025)

| Model | Best For | Context | Max Output | Price (Input/Output) |
|-------|----------|---------|------------|---------------------|
| **Sonnet 4.5** | Complex agents & coding | 200K (1M beta) | 64K tokens | $3/$15 per MTok |
| **Opus 4.1** | Specialized complex tasks | 200K | 32K tokens | $15/$75 per MTok |
| **Haiku 3.5** | Fast responses | 200K | 8K tokens | $0.80/$4 per MTok |

### Model Selection
- **Sonnet 4.5**: Highest intelligence, best for agents and coding
- **Opus 4.1**: Superior reasoning for specialized tasks
- **Haiku 3.5**: Blazing speed for simpler tasks

### API Model Names
```
claude-sonnet-4-5-20250929
claude-opus-4-1-20250805
claude-3-5-haiku-20241022
```

### Aliases (auto-update to latest)
```
claude-sonnet-4-5  → claude-sonnet-4-5-20250929
claude-opus-4-1    → claude-opus-4-1-20250805
```

⚠️ **Production**: Use specific versions, not aliases

### Features
- ✅ All models: Multilingual, Vision support
- ✅ Sonnet & Opus: Extended thinking (❌ not on Haiku)
- ✅ All except Haiku 3: Priority tier support

### Advanced Features
- **1M context beta**: Add header `context-1m-2025-08-07` (Sonnet 4.5/4 only)
  - Long context pricing applies >200K tokens
- **Prompt caching**: 90% discount on cache hits
  - 5m cache writes, 1h cache writes, cache hits/refreshes

---

## Slash Commands

### Most Useful Built-in Commands

| Command | Purpose |
|---------|---------|
| `/agents` | Manage custom AI subagents |
| `/memory` | Edit CLAUDE.md memory files |
| `/model` | Select/change AI model |
| `/compact [instructions]` | Compact conversation with optional focus |
| `/cost` | Show token usage statistics |
| `/usage` | Show plan usage limits and rate limits |
| `/permissions` | View/update permissions |
| `/init` | Initialize project with CLAUDE.md |
| `/help` | Get usage help |
| `/rewind` | Rewind conversation and/or code |

### Custom Slash Commands

#### Locations
- **Project**: `.claude/commands/` (shows as "project")
- **Personal**: `~/.claude/commands/` (shows as "user")

#### Basic Example
```bash
# Create /optimize command
mkdir -p .claude/commands
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

#### With Arguments
```markdown
---
argument-hint: [pr-number] [priority] [assignee]
description: Review pull request
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

Use: `/review-pr 456 high alice`

#### With Bash Commands
```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context
- Current git status: !`git status`
- Current git diff: !`git diff HEAD`
- Current branch: !`git branch --show-current`

## Your task
Based on the above changes, create a single git commit.
```

#### Frontmatter Options
- `allowed-tools`: Limit tools (inherits from conversation if omitted)
- `argument-hint`: Show expected arguments
- `description`: Command description
- `model`: Specific model to use
- `disable-model-invocation`: Prevent SlashCommand tool from calling

#### Arguments
- `$ARGUMENTS` - All arguments as single string
- `$1`, `$2`, etc. - Individual positional arguments

#### File References
```markdown
Review the implementation in @src/utils/helpers.js
Compare @src/old-version.js with @src/new-version.js
```

#### MCP Commands
- Pattern: `/mcp__<server-name>__<prompt-name>`
- ⚠️ **Wildcards NOT supported**: Use `mcp__server` (all tools) or exact tool names

#### SlashCommand Tool Limits
- 15K character budget for command descriptions (set via `SLASH_COMMAND_TOOL_CHAR_BUDGET`)
- Requires `description` field in frontmatter to be visible to Claude

---

## Memory Management

### Memory Hierarchy (loaded in order)

| Type | Location | Shared With | Use Case |
|------|----------|-------------|----------|
| **Enterprise** | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS)<br/>`/etc/claude-code/CLAUDE.md` (Linux)<br/>`C:\ProgramData\ClaudeCode\CLAUDE.md` (Windows) | All users in org | Company standards, security policies |
| **Project** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team via git | Project architecture, coding standards |
| **User** | `~/.claude/CLAUDE.md` | Just you (all projects) | Personal preferences |
| **Project Local** | `./CLAUDE.local.md` | Just you (this project) | *(Deprecated)* Personal project settings |

### Quick Add Memory
Start input with `#` to quickly add a memory:
```
# Always use descriptive variable names
```
You'll be prompted to select which memory file to use.

### Edit Memory
```
/memory  # Opens memory files in editor
```

### Initialize Project Memory
```
/init  # Bootstrap CLAUDE.md for your codebase
```

### Imports
CLAUDE.md files can import other files (auto-loaded at launch):

```markdown
See @README for project overview and @package.json for npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
- Individual preferences @~/.claude/my-project-instructions.md
```

- ✅ **Auto-loaded**: Imports processed recursively at launch
- Both relative and absolute paths work
- Max import depth: 5 hops
- Not evaluated inside code spans/blocks
- **Note**: CLAUDE.local.md deprecated; use imports instead

### Memory Lookup
- Recurses up from cwd to root, reading any CLAUDE.md files
- Also discovers CLAUDE.md in subtrees (loaded on-demand)

### Best Practices
- **Be specific**: "Use 2-space indentation" > "Format code properly"
- **Use structure**: Organize with bullets and markdown headings
- **Review periodically**: Update as project evolves
- **Include commands**: Build, test, lint commands to avoid searches
- **Document patterns**: Architecture patterns, naming conventions

---

## Quick Tips

### Efficient Workflows
1. Set up project memory with `/init`
2. Create custom slash commands for repeated tasks
3. Use subagents for specialized tasks (code review, debugging, testing)
4. Choose the right model: Sonnet for most work, Opus for hard problems, Haiku for speed

### Cost Optimization
- Use Haiku 3.5 for simple tasks ($0.80/$4 per MTok)
- Use Sonnet 4.5 for complex work ($3/$15 per MTok)
- Use `/cost` and `/usage` to monitor consumption
- Enable prompt caching for repeated context

### Common Patterns
```bash
# Commit workflow
/git-commit  # If you have this custom command

# Code review after changes
# Use code-reviewer subagent automatically

# Switch models mid-conversation
/model  # Interactive model selection
```
