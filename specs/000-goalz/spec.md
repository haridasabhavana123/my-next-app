# Feature Specification: Goalz

**Feature Branch**: `000-goalz`  
**Created**: 2025-12-24  
**Status**: Draft  
**Input**: User description: "Initial page setup — Goalz: a two-column goal tracking web app. Left column: current goals with days left; right column: completed goals. Checkbox toggles completion (move or un-complete) or delete permanently. Add new goals via modal (title + date). Highlight goals reaching their end date within 2 days. Modern light theme, fun colours. Persist in localStorage (initial)."

## Summary

Goalz is a lightweight goal-tracking web app. The initial implementation follows a Spec-Driven Development approach: author the spec, implement the P1 (MVP) stories, verify acceptance criteria, then iterate on P2 and P3.

## User Scenarios & Testing (mandatory)

### User Story 1 — Create & View Goals (Priority: P1)

As a user, I want to add a new goal (title + due date) so I can track it until completion.

**Why this priority**: Core value — without adding goals the app has no function.

**Independent Test**: Manually add a new goal via the modal and observe it appears in Current Goals with a correct days-left calculation.

**Acceptance Scenarios:**

1. Given an empty app, When I click "New Goal" and submit title="Finish taxes" and dueDate=2025-12-31, Then the goal appears in the Current Goals column sorted by due date and shows the correct "Xd left" text.
2. Given a goal whose due date is within 2 days, When the page is displayed, Then the goal card is visually highlighted as urgent.
3. Given a goal whose due date is in the past, When the page is displayed, Then the goal shows "Expired" and displays expired styling.

---

### User Story 2 — Complete & Delete Goals (Priority: P1)

As a user, I want to mark goals as complete with a checkbox and delete goals permanently.

**Why**: Ability to mark progress and clear completed items is required for usability.

**Independent Test**: Check a goal's checkbox -> it moves to the Completed column; uncheck in Completed -> it moves back to Current. Delete removes from storage.

**Acceptance Scenarios:**

1. Given a current goal, When I check the checkbox, Then the goal moves to the Completed column and remains persisted.
2. Given a completed goal, When I uncheck the checkbox, Then the goal moves back to Current and remains persisted.
3. Given a goal (current or completed), When I click Delete, Then the goal is removed from the UI and from localStorage.

---

### User Story 3 — Persistence & Local Reload (Priority: P1)

As a user, I want my goals to persist across browser refreshes.

**Acceptance Scenario:**

1. Given I add or update goals, When I reload the page, Then all goals and their complete state persist exactly as before.

---

### User Story 4 — Responsive & Accessible UI (Priority: P2)

As a user on small screens or using a keyboard/screen reader, I want the layout and controls to remain usable and accessible.

**Acceptance Scenarios:**

1. On narrow viewports the layout stacks into a single column maintaining functionality.
2. Modal can be opened/closed with keyboard, inputs have labels, checkboxes and buttons have accessible names.

---

### User Story 5 — Sorting, Validation & Edge Cases (Priority: P2)

As a user, I want goals sorted by due date and prevented from being created with empty title or invalid dates.

**Acceptance Scenarios:**

1. Goals in Current are ordered ascending by due date.
2. The New Goal form requires a non-empty title and a valid date; showing inline validation messages.

---

### Future / Optional (P3)

- Backend sync (per-user persistence)
- Accounts, cross-device sync, notifications, undo for deletes
- Analytics for completed goals and time-to-complete

## Edge Cases

- Timezone handling: due dates are stored as local-date (ISO yyyy-mm-dd) and displayed relative to user's local date.
- Past dates: treated as "Expired"; adding a past date is allowed but should show expired styling.
- Duplicate titles: allowed; consider uniqueness if later required.
- Very long titles: UI should ellipsize or wrap gracefully.
- LocalStorage quota errors should be caught and surfaced as non-blocking warnings.

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: Users MUST be able to create a goal with a title and due date via a modal form.
- **FR-002**: Users MUST see current goals in the left column and completed goals in the right column.
- **FR-003**: Users MUST be able to toggle completion using a checkbox; state change moves the goal between columns.
- **FR-004**: Users MUST be able to delete a goal permanently.
- **FR-005**: The UI MUST highlight goals whose due date is <=2 days from today.
- **FR-006**: Goals MUST persist across page reloads (localStorage for MVP).

### Non-Functional Requirements

- **NFR-001**: The layout MUST be responsive (stacking on small screens).
- **NFR-002**: Controls MUST be accessible (keyboard focusable, labels, ARIA where appropriate).
- **NFR-003**: Visual design should use a modern light theme with fun accent colours.

## Key Entities

- **Goal**: {
  - id: string (client-generated),
  - title: string,
  - dueDate: string (ISO yyyy-mm-dd),
  - completed: boolean,
  - createdAt?: string (ISO datetime)
}

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: Manual verification: P1 acceptance scenarios pass when executed by QA (pass/fail).
- **SC-002**: 100% of goals added remain after page reload (localStorage persistence) during manual tests.
- **SC-003**: Urgent highlight appears for goals with due date <=2 days in all tested timezones (local-device).
- **SC-004**: UI remains usable on mobile widths (≤ 480px) — all core actions available.

## Manual Test Checklist (to be executed after P1 implementation)

1. Add a goal with future date — verify it appears in Current with Xd left.
2. Add a goal due tomorrow — verify urgent styling.
3. Add a goal with yesterday's date — verify it shows "Expired" and expired styling.
4. Check a goal's checkbox — verify it moves to Completed.
5. Uncheck a completed goal — verify it moves back to Current.
6. Delete a goal from either column — verify it's removed and does not reappear after reload.
7. Reload page — verify persistence of all goals and states.
8. Open/close modal via keyboard (Tab, Enter, Esc) — verify accessibility.

## Implementation Notes

- Branch: `000-goalz`  
- Commit messages for P1 should include: `spec: link to specs/000-goalz/spec.md` and `feat(goalz): <short summary>`.
- The initial implementation may use localStorage; later iterations can add a backend sync API.

## Conformance

Implementation MUST follow the repository's `CONSTITUTION.md` principles: no automated test suites are to be added for this feature, any new dependency requires a short rationale in the PR, and changes should prioritize simple UX, small components, and minimal dependencies.

## Files to create/update

- `specs/000-goalz/spec.md` (this file)  
- `src/app/components/GoalApp.tsx` (implementation) — already added in this branch.  
- `src/app/page.tsx` — updated to render `GoalApp`.

---

Prepared by: automation (draft). Reviewers: please update priorities/acceptance criteria if they differ.
