# AGENTS.md

## Project overview
This repository is a Node.js Express REST API for a restaurant ordering and delivery application. The app uses CommonJS modules, MongoDB with Mongoose, and a layered structure under `src/`:

- `src/routes/` defines HTTP endpoints
- `src/controllers/` handles request/response flow
- `src/services/` contains business logic
- `src/models/` defines MongoDB schemas
- `src/middleware/` contains auth, validation, and error handling
- `src/validators/` contains Joi validation rules
- `test/` contains API tests

## Commands
- `npm test` — run the test suite
- `npm start` — start the API server
- `npm run seed:admin` — seed the initial admin account

## Working conventions
- Follow the existing architecture: route -> controller -> service -> model.
- Preserve API contracts and request/response shapes unless the user explicitly asks for a change.
- Keep validation and auth patterns aligned with the current middleware and validators.
- Prefer narrow, targeted edits over broad refactors.
- If documentation is needed, keep it brief and reference the relevant project files rather than duplicating existing info.

## Safety rules for agents
- Do not modify application code or project files unless the user explicitly asks for it.
- Respect the user’s instruction to avoid editing the codebase.
- If a task only requires explanation, investigation, or guidance, do not change files.
- When proposing changes, explain the impact and ask for confirmation before making edits.

## Typical workflow
1. Read the relevant route/controller/service/model files before making a suggestion.
2. Reproduce or inspect the issue in the existing tests or API flow.
3. Keep the fix minimal and consistent with the current patterns.
4. Validate with the smallest relevant command, usually `npm test`.

## Notes
This project is intentionally simple and convention-driven. The best way to be productive here is to stay within the existing structure and avoid unnecessary changes.
