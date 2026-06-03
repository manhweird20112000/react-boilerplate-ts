---
name: review-skills
description: >
  Review workspace skill definitions and custom skill files. Use when the user asks to inspect,
  summarize, critique, or improve skills in `.agents/skills`, `.augment/skills`, or repository
  customization folders. Supports prompts like "review cho tôi các skill".
---

# Review Skills

## When to use this skill

- The user asks to review available skills, explain skill behavior, or audit workspace skill files.
- You need to evaluate whether skill definitions follow project conventions and have clear triggers.
- The request is about `.agents/skills`, `.augment/skills`, or other workspace-level skill/customization assets.

## Review workflow

1. Locate candidate files under `.agents/skills/`, `.augment/skills/`, and any repository scoped skill folders.
2. For each skill file:
   - Read frontmatter: `name`, `description`, `user-invocable`, and any trigger phrases.
   - Identify the primary use case and expected user prompt.
   - Confirm the body explains when to use the skill and what it produces.
   - Check for any missing boundaries, overly broad scope, or unclear wording.
3. Summarize the skill set:
   - What skills exist and what they are for.
   - Which skills are well-defined and which need improvement.
   - Any naming, placement, or description issues.
4. If the skill definition is too vague or incomplete, ask the user for the intended outcome or prompt types.

## Rules

- Review workspace-scoped skills by default; do not assume user-level customization unless explicitly requested.
- Keep the review focused on skill definitions and usage guidance, not on unrelated code.
- Call out missing explicit triggers or unclear outputs.
- Do not modify files automatically as part of the review; provide recommendations instead.

## Quality checks

- The skill has a concise `name` and meaningful `description`.
- The description includes trigger keywords or example prompts.
- The body contains clear usage guidance and boundaries.
- The skill’s location matches its scope.
- There are no silent YAML/frontmatter issues.

## Examples

- User prompt: "review cho tôi các skill" → inspect workspace skill files and summarize their purpose.
- User prompt: "hãy xem lại các skill trong dự án" → identify existing skills, quality, and gaps.
- User prompt: "what custom agents and skills are available" → list and evaluate relevant workspace skill files.
