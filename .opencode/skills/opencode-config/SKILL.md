---
name: opencode-config
description: Reference for OpenCode configuration — AGENTS.md, commands, agents, skills, MCP, permissions, LSP, plugins, themes, formatting, and all config options
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: configuration
---

# OpenCode Configuration Reference

Synthetic analysis of all config sections in the OpenCode documentation.

---

## 1. AGENTS.md (Rules)

**File:** `AGENTS.md` in project root or `~/.config/opencode/AGENTS.md` (global).

**Purpose:** Custom instructions injected into every agent session.

**What to include:**
- Build, lint, test commands verbatim
- Architecture overview (key files, dirs)
- Conventions (naming, imports, framework patterns)
- Repetitive task steps (e.g. "after features → update docs + demo + test + build")
- References to external instruction files (see `instructions` in config)

**Precedence:**
1. Project `AGENTS.md` (highest for repo rules)
2. `~/.config/opencode/AGENTS.md` (global, user-wide)
3. `CLAUDE.md` / `~/.claude/CLAUDE.md` (Claude Code compat fallback)

**External references:** Use `opencode.json` `"instructions"` field with glob patterns for modular rules.

---

## 2. Config File

**File:** `opencode.json` or `opencode.jsonc` (project) or `~/.config/opencode/opencode.json` (global).

**Schema:** `https://opencode.ai/config.json`

**Key sections:**

| Section | Purpose |
|---|---|
| `model` | Default model ID (e.g. `anthropic/claude-sonnet-4-5`) |
| `small_model` | Lightweight model for titles/summaries |
| `provider` | Provider options (timeout, apiKey, models) |
| `shell` | Shell for terminal (e.g. `pwsh`, `/bin/zsh`) |
| `tools` | Global tool on/off (deprecated, use `permission`) |
| `permission` | Per-tool permissions: `allow`, `ask`, `deny` |
| `agent` | Custom agent definitions |
| `command` | Custom slash commands |
| `mcp` | MCP server definitions |
| `lsp` | LSP server config |
| `formatter` | Code formatter config |
| `instructions` | Array of external instruction file paths/globs |
| `server` | HTTP server options (port, hostname, mDNS, CORS) |
| `share` | `manual`, `auto`, or `disabled` |
| `compaction` | Context compaction (auto, prune, reserved tokens) |
| `snapshot` | Enable/disable undo snapshots |
| `autoupdate` | `true`, `false`, or `"notify"` |
| `disabled_providers` | Provider allowlist |
| `enabled_providers` | Provider blocklist |
| `experimental` | Unstable options |

**Variable substitution:**
- `{env:VAR_NAME}` → environment variable
- `{file:path/to/file}` → file content (path relative to config or absolute)

**Precedence order (low→high):**
1. Remote `.well-known/opencode`
2. Global `~/.config/opencode/opencode.json`
3. Custom `$OPENCODE_CONFIG`
4. Project `opencode.json`
5. `.opencode/` directories
6. `$OPENCODE_CONFIG_CONTENT`
7. Managed config (admin-enforced)

---

## 3. Commands

**Files:** `.opencode/commands/<name>.md` (project) or `~/.config/opencode/commands/<name>.md` (global).

**Or:** `opencode.json` `"command"` key.

**Format (markdown):**
```markdown
---
description: Short description for TUI autocomplete
agent: build           # optional, which agent runs this
model: anthropic/...   # optional, model override
subtask: true          # optional, force subagent
---

Template content with placeholders:
- $ARGUMENTS — all arguments
- $1, $2, $3 — positional arguments
- !`bash command` — inject shell output
- @filename — include file content
```

**Built-in commands:** `/init`, `/undo`, `/redo`, `/share`, `/help`.

---

## 4. Agents

**Files:** `.opencode/agents/<name>.md` or `~/.config/opencode/agents/<name>.md`.

**Or:** `opencode.json` `"agent"` key.

**Types:**
- `primary` — main agent, switchable via Tab key
- `subagent` — invoked via `@name` or Task tool

**Built-in agents:**
| Agent | Mode | Purpose |
|---|---|---|
| `build` | primary | Full tool access, default |
| `plan` | primary | Read-only, planning/analysis |
| `general` | subagent | Multi-step tasks, full tools |
| `explore` | subagent | Read-only code search |
| `scout` | subagent | External dep research |

**Markdown agent frontmatter:**
```markdown
---
description: What this agent does (required)
mode: subagent | primary | all
model: provider/model-id
temperature: 0.0–1.0
steps: N              # max iterations
hidden: true          # hide from @ menu
color: "#ff6b6b"     # UI color
permission:
  edit: deny | ask | allow
  bash: deny | ask | allow
  task:               # glob patterns for subagent access
    "*": deny
    "my-agent": allow
tools:                # deprecated, use permission
  write: false
---
```

---

## 5. Skills

**Files:** `.opencode/skills/<name>/SKILL.md` or `~/.config/opencode/skills/<name>/SKILL.md`.

**Discovery:** OpenCode searches project `.opencode/skills/` and global `~/.config/opencode/skills/`. Also Claude-compatible paths.

**SKILL.md frontmatter (YAML):**
```yaml
---
name: skill-name        # required, lowercase hyphenated
description: What it does (required, 1–1024 chars)
license: MIT           # optional
compatibility: opencode # optional
metadata:              # optional, string→string
  audience: developers
---
```

**Name rules:** `^[a-z0-9]+(-[a-z0-9]+)*$` (1–64 chars, hyphens only, no leading/trailing `--`).

**Permissions:** Control via `opencode.json`:
```json
"permission": { "skill": { "*": "allow", "internal-*": "deny" } }
```

---

## 6. MCP Servers

**File:** `opencode.json` `"mcp"` key.

**Types:** `stdio` (local process, stdin/stdout) or `remote` (HTTP/S URL).

**Example:**
```json
{
  "mcp": {
    "my-server": {
      "type": "stdio",
      "command": "python3",
      "args": ["server.py"],
      "env": { "KEY": "value" }
    },
    "remote-api": {
      "type": "remote",
      "url": "https://api.example.com/mcp",
      "headers": { "Authorization": "Bearer token" }
    }
  }
}
```

**Config within commands:** `mcpServers` key in `opencode.json` (legacy) or `mcp` key.

---

## 7. LSP Servers

**File:** `opencode.json` `"lsp"` key.

**Values:**
- `true` — enable all built-in LSPs
- `false` — disable
- Object — configure per-language

**Example:**
```json
{
  "lsp": {
    "typescript": { "disabled": true },
    "rust-analyzer": { "disabled": false }
  }
}
```

---

## 8. Permissions

**File:** `opencode.json` `"permission"` key.

**Actions per key:** `allow`, `ask`, `deny`.

**Keys:** `read`, `edit`, `glob`, `grep`, `list`, `bash`, `task`, `webfetch`, `websearch`, `lsp`, `skill`, `question`, `todowrite`, `external_directory`, `doom_loop`.

**Fine-grained bash:**
```json
"bash": {
  "*": "ask",
  "git status *": "allow",
  "npm test": "allow"
}
```

**Per-agent override:**
```json
"agent": {
  "plan": { "permission": { "edit": "deny" } }
}
```

---

## 9. Formatters

**File:** `opencode.json` `"formatter"` key.

**Values:**
- `true` — enable built-in formatters
- `false` — disable
- Object — custom formatter definitions

**Custom formatter:**
```json
{
  "custom-prettier": {
    "command": ["npx", "prettier", "--write", "$FILE"],
    "extensions": [".js", ".ts"],
    "environment": { "NODE_ENV": "development" }
  }
}
```

---

## 10. Themes

**File:** `tui.json` or `~/.config/opencode/tui.json`.

**Key:** `"theme": "tokyonight"`

---

## 11. Keybinds

**File:** `tui.json` → `"keybinds"` key.

**Common binds:** `command_list`, `switch_agent`, `session_child_first`, `session_parent`.

---

## 12. TUI (Terminal UI)

**File:** `tui.json`.

**Options:** `scroll_speed`, `scroll_acceleration`, `diff_style`, `mouse`, `attention` (notifications/sound).

---

## 13. Providers

**File:** `opencode.json` `"provider"` key.

**Options per provider:** `timeout` (ms), `chunkTimeout` (ms), `setCacheKey`, `apiKey`.

**Format:** `"provider/model-id"` (e.g. `anthropic/claude-sonnet-4-5`).

---

## 14. Modes (Legacy)

**Directory:** `.opencode/modes/` or `~/.config/opencode/modes/`.

Defines reusable prompt modes (now superseded by agents).

---

## 15. Plugins

**Directory:** `.opencode/plugins/`.

**npm plugins:** List in `opencode.json` `"plugin"` array.

---

## 16. Custom Tools

**Directory:** `.opencode/tools/`.

Custom tool definitions with prompt templates for the agent.

---

## 17. File Hierarchy Summary

```
~/.config/opencode/
├── opencode.json          # global config
├── tui.json               # TUI settings
├── AGENTS.md              # global rules
├── agents/                # custom agents
├── commands/              # custom commands
├── modes/                 # modes (legacy)
├── plugins/               # plugins
├── skills/                # reusable skill definitions
│   └── <name>/SKILL.md
├── themes/                # theme files
└── tools/                 # custom tools

.opencode/                 # project-local (in repo)
├── agents/
├── commands/
├── modes/
├── plugins/
├── skills/
│   └── <name>/SKILL.md
├── themes/
└── tools/
```

---

## 18. Key Patterns

- **Configs merge, not replace** — later sources override conflicting keys
- **Directories use plural** (`agents/`, `commands/`, `skills/`, etc.)
- **Skills are lazy-loaded** — agent reads name+desc, loads full SKILL.md via `skill()` tool
- **Skill loading can be controlled** per agent with `permission.skill`
- **Commands can be subagents** with `agent:` frontmatter or `subtask: true`
- **File references in prompts** use `@path` syntax
- **Shell injection in commands** uses `` !`cmd` `` syntax
