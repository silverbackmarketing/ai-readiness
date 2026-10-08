#!/usr/bin/env node
import { install, AGENT_NAMES } from "../src/install.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf8"));

const HELP = `
ai-readiness v${pkg.version}
Install the AI readiness skill into Claude or any other AI agent.

USAGE
  npx @silverbackmarketing/ai-readiness <command> [options]

COMMANDS
  install                 Install the skill (default: ~/.agents/skills + ~/.claude/skills)
  help                    Show this help

INSTALL OPTIONS
  --agent <name>          Install for one target: ${AGENT_NAMES.join(", ")}
  --all                   Install global skill + AGENTS.md (recommended)
  --dir <path>            Override the target directory
  --force                 Overwrite an existing install

WHERE IT INSTALLS
  skills     ~/.agents/skills/ + ~/.claude/skills/   (default; full skill)
  agents     ./AGENTS.md  ← standard read by Cursor, Codex & others
  claude     ~/.claude/skills/ only

  Opt-in, tool-specific targets:
  cursor     ./.cursor/rules/ai-readiness.mdc
  windsurf   ./.windsurf/rules/ai-readiness.md
  copilot    ./.github/copilot-instructions.md   (adds a delimited block)
  gemini     ./GEMINI.md                          (adds a delimited block)
  generic    ./ai-readiness.SKILL.md              (paste into any system prompt)

EXAMPLES
  npx @silverbackmarketing/ai-readiness install            # ~/.agents/skills
  npx @silverbackmarketing/ai-readiness install --agent agents   # AGENTS.md
  npx @silverbackmarketing/ai-readiness install --all      # skill + AGENTS.md

After installing, use the skill:
  /ai-readiness yoursite.com        (Claude / Cowork)
  ask your agent to "create AI readiness files for yoursite.com"
`;

function parseFlags(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (key === "force" || key === "all") {
        flags[key] = true;
      } else {
        flags[key] = argv[++i];
      }
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

async function main() {
  const [, , cmd, ...rest] = process.argv;
  const { flags } = parseFlags(rest);

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    console.log(HELP);
    return;
  }

  switch (cmd) {
    case "install":
      await install({
        dir: flags.dir,
        force: !!flags.force,
        agent: flags.agent,
        all: !!flags.all,
      });
      break;
    default:
      console.error(`Unknown command: ${cmd}\n`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
