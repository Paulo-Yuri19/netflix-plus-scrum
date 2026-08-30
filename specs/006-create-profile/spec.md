# Feature Specification: Profile Creation

**Feature Branch**: `006-create-profile`

**Created**: 2026-08-30

**Status**: Draft

**Input**: User description: "Implementar a US-006 — Criação de Perfil do Netflix+. Usuário autenticado informa um nome de perfil; a interface atribui um avatar padrão; o perfil é persistido, exibido em um cartão e se torna o perfil ativo. Nome vazio não é aceito. Editar, excluir e perfil infantil são histórias separadas e ficam fora deste recorte."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticated User Creates a Profile (Priority: P1)

An authenticated user reaches the profiles screen and wants to create a profile with a name, so the platform knows who is using it.

**Why this priority**: Without at least one profile, the account cannot proceed to any content-related feature (search, details, playback in Sprint 3 all depend on an active profile). This is the single story of Sprint 2 that Sprint 3 directly depends on.

**Independent Test**: Can be fully tested by logging in (or registering, which auto-logs-in), reaching the profiles screen, typing a name, submitting, and seeing the profile card appear as active.

**Acceptance Scenarios**:

1. **Given** an authenticated user is on the profiles screen with no profiles yet, **When** they type a valid name (1+ non-whitespace character) and click "Create Profile", **Then** a profile card appears with that name, a default avatar, and is marked as the active profile.

2. **Given** a user has just created a profile, **When** they refresh the page, **Then** the profile card is still there and still marked active.

3. **Given** a user leaves the name field empty (or only whitespace), **When** they click "Create Profile", **Then** an error message is shown: "This field is required." and no profile is created.

4. **Given** a user already has one or more profiles, **When** they create another one, **Then** the new profile becomes the active profile and its card is added alongside the existing ones (existing profiles are not removed or altered).

5. **Given** a visitor who is not logged in opens the profiles screen directly, **When** the page loads, **Then** they are redirected to the login page.

---

### Edge Cases

- What happens if the name is only spaces (e.g. "   ")? → Treated the same as empty: rejected with "This field is required." (matches the trim-then-validate pattern already used for name/email in `auth.js`).
- What happens if two profiles on the same account have the exact same name? → Allowed. Profiles are distinguished internally by id, not by name uniqueness — the spec for this story does not require unique names.
- What happens to profiles if a different account logs in on the same browser? → Profiles MUST be scoped to the account that created them; a second account must not see or create profiles inside the first account's list.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show a "create profile" form (name field + submit button) on the profiles screen.
- **FR-002**: System MUST require the profiles screen to have an authenticated user; unauthenticated visitors MUST be redirected to the login page.
- **FR-003**: System MUST validate that the profile name is not empty after trimming whitespace, and show "This field is required." otherwise.
- **FR-004**: System MUST assign a default avatar to every new profile automatically (no avatar upload or selection in this story).
- **FR-005**: System MUST persist the profile associated with the currently authenticated account, so it survives a page reload.
- **FR-006**: System MUST scope profiles per account — one account's profiles MUST NOT appear for a different account.
- **FR-007**: System MUST display every profile belonging to the current account as a card (name + avatar).
- **FR-008**: System MUST mark the profile just created as the active profile, and visually distinguish the active card from the others.
- **FR-009**: System MUST keep previously created profiles unchanged when a new one is added.

### Key Entities

- **Profile**: `id`, `accountId` (the owning user's id), `name` (1+ char after trim), `avatar` (system-assigned default), `createdAt`. Belongs to exactly one User Account (from US-001).
- **Active Profile**: a reference (profile id) to which profile is currently selected for the logged-in account; used by later stories (US-011/015/016) but only written here.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can go from an empty profiles screen to having an active, visible profile card in a single form submission.
- **SC-002**: Profiles and the active-profile selection survive a full page reload.
- **SC-003**: Two different accounts on the same browser never see each other's profiles.

## Assumptions

- The profiles screen is the page users land on after login/registration — this reuses the existing `/dashboard.html` redirect target already coded in `register.js` (and expected by the login feature), rather than introducing a new URL.
- "Default avatar" is generated by the system (e.g., an initial letter on a colored circle) — no image upload, no avatar picker. Those belong to future story US-010 (Alterar Avatar), out of scope here.
- Only one profile can be active at a time per account; switching the active profile between *existing* profiles (a "select profile" interaction) is not required by this story, since every newly created profile already becomes active per FR-008. A future story may add explicit profile switching.
- No child-profile rules, editing, or deletion — out of scope per ProductBacklog.md (US-007, US-008, US-009 are separate future stories).
