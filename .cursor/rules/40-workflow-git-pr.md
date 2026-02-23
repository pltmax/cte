---
description: "Pre-commit verification and Git workflow"
alwaysApply: true
---

# Git & PR Workflow

- **Pre-Commit Check:** Before committing, you must verify the build. Run `npm run build` (frontend) or `pytest` (backend) if relevant. Do not commit broken code.
- **Atomic Commits:** One feature/fix per commit. No "monolith" commits.
- **Conventional Commits:** Use `feat:`, `fix:`, `docs:`, or `refactor:`.
- **Automated PR:** Once verified:
  1. Commit changes.
  2. Create PR via `gh pr create` (or output text if `gh` is missing).
  3. **PR Template:**
     - **Summary:** Concise what/why.
     - **Test Plan:** Precise steps to verify (e.g., "Run `make dev`, login, check `/dashboard`").