# AI Readiness Skill

A skill that generates a complete suite of AI readiness files for any website — in a single command. Install it into Claude, Cursor, Windsurf, GitHub Copilot, Gemini, Codex, or any other AI agent with one `npx` command.

**Created by:** Russ Wittmann  
**Company:** [Silverback Marketing](https://silverbackmarketing.com)  
**Version:** 1.0.0

---

## Install

### Quick install (any agent) — `npx`

```bash
# Global skill install → ~/.agents/skills/ AND ~/.claude/skills/ (default)
npx @silverbackmarketing/ai-readiness install

# AGENTS.md — the cross-agent standard (Cursor, Codex & others)
npx @silverbackmarketing/ai-readiness install --agent agents

# Both at once (recommended)
npx @silverbackmarketing/ai-readiness install --all
```

Primary targets:

| Target | Installs to |
|---|---|
| `skills` | `~/.agents/skills/ai-readiness/` **and** `~/.claude/skills/ai-readiness/` (full skill — `SKILL.md` + scripts + references) |
| `agents` | `./AGENTS.md` — the standard read by Cursor, Codex, and a growing list of agents (adds a delimited block, keeps your existing content) |
| `claude` | `~/.claude/skills/ai-readiness/` only |

For prompt-based agents, **`AGENTS.md` is the default and recommended target** — most modern agents now read it. Tool-specific files remain available if you prefer them:

| Opt-in target | Installs to |
|---|---|
| `cursor` | `./.cursor/rules/ai-readiness.mdc` |
| `windsurf` | `./.windsurf/rules/ai-readiness.md` |
| `copilot` | `./.github/copilot-instructions.md` (delimited block) |
| `gemini` | `./GEMINI.md` (delimited block) |
| `generic` | `./ai-readiness.SKILL.md` (paste into any system prompt) |

Non-Claude targets install into the current directory, so run the command from your project root. `--all` installs Claude + `AGENTS.md`. Add `--force` to overwrite, or `--dir <path>` to change the target. Shared-file installs insert a marked block and update it in place on re-run, so they never clobber your other instructions.

### Other install options

- **Claude Cowork one-click:** download and open [`ai-readiness.skill`](ai-readiness.skill).
- **Any AI, manually:** copy [`SKILL.md`](SKILL.md) into the assistant's system prompt or custom instructions.

After installing, trigger it with `/ai-readiness yoursite.com` in Claude, or just ask any agent: *"create AI readiness files for yoursite.com."*

---

## What It Does

Run `/ai-readiness yoursite.com` and the AI will research the site, classify its industry, and generate 18 production-ready files that tell AI systems (ChatGPT, Claude, Gemini, Perplexity, and others) exactly what the site is, what it offers, and where to send users.

When deployed to a web root, these files improve how a site appears in AI-generated answers, summaries, and recommendations — a must-have for any business that wants to show up in the AI-driven web.

---

## The 18 Files Generated

| # | File | Purpose |
|---|------|---------|
| 1 | `ai.txt` | Primary AI identity declaration |
| 2 | `llms.txt` | Concise LLM-readable site summary |
| 3 | `llms-full.txt` | Comprehensive LLM knowledge base |
| 4 | `ai-sitemap.xml` | AI-optimized sitemap |
| 5 | `sitemap.md` | Human-readable sitemap for AI context |
| 6 | `ai-entities.json` | Structured entity definitions |
| 7 | `ai-intent.json` | User intent and query mappings |
| 8 | `ai-schema.json` | Schema.org structured data |
| 9 | `rag-index.json` | RAG retrieval knowledge base |
| 10 | `rag-index.jsonl` | JSONL format for embedding pipelines |
| 11 | `ai-disclosure.txt` | AI content transparency statement |
| 12 | `training-data-policy.txt` | Data usage and training policy |
| 13 | `.well-known/ai-plugin.json` | Plugin manifest for AI agents |
| 14 | `structured-data-guide.md` | Implementation guide for developers |
| 15 | `manifest.json` | Web app manifest |
| 16 | `deployment-checklist.md` | Step-by-step deployment guide |
| 17 | `README.md` | Project documentation |
| 18 | `robots.txt` | AI crawler directives |

---

## Usage

In Claude Cowork, type:

```
/ai-readiness yoursite.com
```

Or use natural language:

```
create AI readiness files for acmecorp.com
make my site AI-ready: hubspot.com
generate llms.txt for shopify.com
```

Claude will:
1. Run 10+ targeted searches to research the site
2. Classify the site type (SaaS, e-commerce, education, healthcare, etc.)
3. Generate all 18 files tailored to that industry
4. Save everything to a folder named after the domain in your workspace

---

## Reference Documentation

The [`references/file-specs.md`](references/file-specs.md) file contains the detailed specification for each of the 18 files — required structure, key fields, and condensed examples. It is loaded automatically when the skill runs.

The [`scripts/gen_jsonl.py`](scripts/gen_jsonl.py) utility converts `rag-index.json` to `rag-index.jsonl` format for use with embedding pipelines:

```bash
python3 scripts/gen_jsonl.py rag-index.json rag-index.jsonl
```

---

## PDF Guides

The [`docs/`](docs/) folder contains PDF reference guides explaining each file in plain English and technical detail:

| Guide | Audience | Files Covered |
|-------|----------|---------------|
| [AI Readiness Guide — With Plugin](docs/ai-readiness-guide-with-plugin.pdf) | General / Non-technical | All 17 files incl. ai-plugin.json |
| [AI Readiness Guide — No Plugin](docs/ai-readiness-guide-no-plugin.pdf) | General / Non-technical | 16 files excl. ai-plugin.json |
| [Developer Reference — With Plugin](docs/ai-readiness-guide-dev-with-plugin.pdf) | Web Developers | All 17 files, compact technical format |
| [Developer Reference — No Plugin](docs/ai-readiness-guide-dev-no-plugin.pdf) | Web Developers | 16 files, compact technical format |

---

## Skill File Structure

```
ai-readiness/
├── ai-readiness.skill          ← Claude Cowork installable skill (download & open)
├── SKILL.md                    ← Raw skill definition — works in any AI assistant
├── README.md                   ← This file
├── references/
│   └── file-specs.md           ← Detailed specs for all 18 output files
├── scripts/
│   └── gen_jsonl.py            ← JSONL generator utility
└── docs/
    ├── ai-readiness-guide-with-plugin.pdf
    ├── ai-readiness-guide-no-plugin.pdf
    ├── ai-readiness-guide-dev-with-plugin.pdf
    └── ai-readiness-guide-dev-no-plugin.pdf
```

---

## About Silverback Marketing

Silverback Marketing is a full-service digital marketing agency helping businesses grow through strategy, content, and technology. This skill was built as part of Silverback's AI-readiness service offering — helping clients get found in the age of AI search.

[silverbackmarketing.com](https://silverbackmarketing.com)

---

## License

MIT — free to use, modify, and distribute with attribution.
