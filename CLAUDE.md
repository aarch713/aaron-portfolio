# aaron-portfolio

Live: none  <!-- Atlas risk policy: no live branch or target; rules/common/agents.md § Atlas -->

Door: Developer

Every session in this repository runs as the `Developer` operation agent. Claude Code starts the
session as that agent through the project setting `agent` in `.claude/settings.json`. Codex reads
`~/.codex/agents/Developer.md` when it sees the `Door:` line. Contract:
`Core_agent/rules/common/agents.md § Door binding`.
