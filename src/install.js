import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const SKILL_NAME = "ai-readiness";

// Files/folders that make up the full Claude skill payload.
const SKILL_PAYLOAD = ["SKILL.md", "scripts", "references"];

const BEGIN = "<!-- BEGIN ai-readiness skill -->";
const END = "<!-- END ai-readiness skill -->";

// ---------------------------------------------------------------------------
// Supported agents
// ---------------------------------------------------------------------------
// type "skilldir": full skill folder (SKILL.md + scripts + references) under a
//                  global skills directory.
// type "file":     a dedicated instruction file written into the project.
// type "section":  a shared instruction file the agent already reads; we add /
//                  update a delimited block so existing content is preserved.
const AGENTS = {
  skills: {
    label: "Global skills (~/.agents/skills + ~/.claude/skills)",
    type: "skilldir",
    bases: () => [
      join(homedir(), ".agents", "skills"),
      join(homedir(), ".claude", "skills"),
    ],
  },
  claude: {
    label: "Claude only (~/.claude/skills)",
    type: "skilldir",
    bases: () => [join(homedir(), ".claude", "skills")],
  },
  // The cross-agent standard. AGENTS.md is read by Cursor, Codex, and a growing
  // list of agents — this is the default for everything except Claude.
  agents: {
    label: "AGENTS.md (cross-agent standard)",
    type: "section",
    rel: "AGENTS.md",
  },
  // ---- Opt-in, tool-specific targets (use --agent <name>) ----
  cursor: {
    label: "Cursor (tool-specific rule)",
    type: "file",
    rel: join(".cursor", "rules", "ai-readiness.mdc"),
    frontmatter:
      "---\ndescription: Generate AI readiness files (llms.txt, ai.txt, schema, RAG index) for any website\nalwaysApply: false\n---\n\n",
  },
  windsurf: {
    label: "Windsurf (tool-specific rule)",
    type: "file",
    rel: join(".windsurf", "rules", "ai-readiness.md"),
  },
  copilot: {
    label: "GitHub Copilot (tool-specific file)",
    type: "section",
    rel: join(".github", "copilot-instructions.md"),
  },
  gemini: {
    label: "Gemini CLI (tool-specific file)",
    type: "section",
    rel: "GEMINI.md",
  },
  generic: {
    label: "Generic (paste into any system prompt)",
    type: "file",
    rel: "ai-readiness.SKILL.md",
  },
};

export const AGENT_NAMES = Object.keys(AGENTS);

// Default target set for `--all`: the global skills dir + the AGENTS.md standard.
const DEFAULT_ALL = ["skills", "agents"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function skillBody() {
  // Strip the YAML frontmatter; non-Claude agents only need the instructions.
  const raw = readFileSync(join(PKG_ROOT, "SKILL.md"), "utf8");
  const m = raw.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? raw.slice(m[0].length).trimStart() : raw;
}

function installSkillDir(agent, { dir, force }) {
  const bases = dir ? [dir] : agent.bases();
  return bases.map((base) => {
    const target = join(base, SKILL_NAME);
    if (existsSync(target)) {
      if (!force) return { ok: false, target, reason: "exists" };
      rmSync(target, { recursive: true, force: true });
    }
    mkdirSync(target, { recursive: true });
    for (const item of SKILL_PAYLOAD) {
      const src = join(PKG_ROOT, item);
      if (existsSync(src)) cpSync(src, join(target, item), { recursive: true });
    }
    return { ok: true, target };
  });
}

function installFile(agent, { dir, force }) {
  const base = dir || process.cwd();
  const target = join(base, agent.rel);
  if (existsSync(target) && !force) {
    return { ok: false, target, reason: "exists" };
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, (agent.frontmatter || "") + skillBody());
  return { ok: true, target };
}

function installSection(agent, { dir }) {
  const base = dir || process.cwd();
  const target = join(base, agent.rel);
  const block = `${BEGIN}\n${skillBody()}\n${END}\n`;
  let existing = existsSync(target) ? readFileSync(target, "utf8") : "";
  if (existing.includes(BEGIN) && existing.includes(END)) {
    // Replace the existing block in place.
    existing = existing.replace(
      new RegExp(`${BEGIN}[\\s\\S]*?${END}\\n?`),
      block
    );
  } else {
    existing = existing.trim();
    existing = existing ? `${existing}\n\n${block}` : block;
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, existing);
  return { ok: true, target };
}

function installOne(name, opts) {
  const agent = AGENTS[name];
  let res;
  if (agent.type === "skilldir") res = installSkillDir(agent, opts);
  else if (agent.type === "section") res = installSection(agent, opts);
  else res = installFile(agent, opts);
  return Array.isArray(res) ? res : [res]; // always an array of results
}

// ---------------------------------------------------------------------------
// Public entry
// ---------------------------------------------------------------------------
export async function install({ dir, force, agent, all } = {}) {
  let targets;
  if (all) {
    targets = DEFAULT_ALL;
  } else if (agent) {
    if (!AGENTS[agent]) {
      console.error(
        `Unknown agent "${agent}". Supported: ${AGENT_NAMES.join(", ")}, all.`
      );
      process.exit(1);
    }
    targets = [agent];
  } else {
    targets = ["skills"];
  }

  let version = "1.0.0";
  try {
    version = JSON.parse(
      readFileSync(join(PKG_ROOT, "package.json"), "utf8")
    ).version;
  } catch {}

  console.log(`ai-readiness skill v${version}\n`);

  let any = false;
  for (const name of targets) {
    const results = installOne(name, { dir, force });
    const ok = results.filter((r) => r.ok);
    const skipped = results.filter((r) => !r.ok && r.reason === "exists");
    if (ok.length) {
      any = true;
      console.log(`✓ ${AGENTS[name].label}`);
      for (const r of ok) console.log(`    ${r.target}`);
    }
    for (const r of skipped) {
      console.log(
        `• ${AGENTS[name].label} — already present, skipped\n    ${r.target}  (use --force to overwrite)`
      );
    }
  }

  if (any) {
    console.log(
      `\nDone. In Claude/Cowork use:  /ai-readiness yoursite.com\n` +
        `In other agents, the instructions are loaded automatically from the file above.`
    );
  }
}
