CONSTITUTION — Project Principles

Purpose
-------
This document declares the project's guiding principles for code quality, UX, layout responsiveness, and dependency policy. These principles are authoritative for this repository.

Authoritative Rules
-------------------
- Absolutely no tests, no integration tests and no e2e test. This MUST supersede any other guidance in this repository.
- The project MUST use the following library versions as defined in `package.json`:
  - Next.js: 16.1.1
  - React: 19.2.3
  - Tailwind CSS: ^4

Principles
----------

1) Clean Code
- Keep functions and components small, single-responsibility, and well-named.
- Prefer explicit, readable code over clever one-liners.
- Use consistent formatting and types; prefer clear types for props and params.
- Prefer composition over inheritance; extract shared logic into utilities with minimal surface area.

2) Simple UX
- Design for the common case first; remove friction for the main user flow.
- Use clear, concise copy and visible affordances (buttons, labels, feedback).
- Keep interactions predictable and accessible; keyboard focus and ARIA where appropriate.

3) Responsive Design
- Start mobile-first: base styles target small screens and scale up using breakpoints.
- Use Tailwind utility classes and responsive tokens to keep layout predictable.
- Test layouts at multiple widths and ensure content order and spacing remain clear.

4) Minimal Dependencies
- Add dependencies only when the benefit clearly outweighs maintenance cost.
- Prefer small, well-maintained libraries; avoid large frameworks beyond Next/React/Tailwind unless necessary.
- Whenever possible, implement small behaviors in-house rather than introducing a dependency.

Enforcement & PR Guidance
-------------------------
- All PRs should include a short rationale when adding dependencies or making substantial UX changes.
- Linting and formatting are allowed to keep code consistent; do not add automated test suites.
- Reviewers should verify the "no tests" rule is upheld for new code and that dependencies align with the minimal-deps principle.

Notes
-----
- This constitution is intentionally concise and prescriptive. For exceptions, the "Absolutely no tests" clause is final and non-negotiable within this repository.
