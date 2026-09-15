# THE DECISION — Development Rules

## 1. General Rule

Build the simplest reliable solution that achieves the educational goal.

Do not add complexity unless it provides a clear benefit.

---

# 2. Technology Rules

Use the existing project stack wherever possible.

Do not replace the existing framework or architecture without a strong reason.

Supabase is the backend.

GitHub is the source-control repository.

---

# 3. Frontend Rules

The frontend must be:

- Mobile-first
- Responsive
- Accessible
- Fast
- Component-based
- Easy to maintain

Prefer reusable components over duplicated UI.

---

# 4. Backend Rules

Use Supabase for backend functionality.

Use:

- Supabase Database
- Supabase Realtime where appropriate
- Supabase authentication/session functionality where appropriate
- Row Level Security

Do not expose private backend credentials.

Never place the Supabase service-role key in frontend code.

---

# 5. Database Rules

Use clear table names.

Use appropriate primary keys.

Use foreign keys where appropriate.

Use timestamps for important records.

Avoid storing unnecessary personal information.

Do not store:

- Passwords in plain text
- Real student identities unless explicitly required
- Phone numbers
- Personal contact information
- Sensitive personal characteristics

---

# 6. Game Data Rules

All candidates must be fictional.

All candidate information must be created specifically for the educational simulation.

Never use real people's resumes.

Never use real hiring decisions.

---

# 7. Bias Demonstration Rules

The purpose is educational.

NEVER tell the player:

"You are biased."

Instead use language such as:

"Did the information influence your decision?"

or:

"Some of the information you received was not relevant to job performance."

The project demonstrates decision influence rather than judging the player.

---

# 8. Sensitive Attribute Rules

Avoid unnecessary use of highly sensitive characteristics.

Do not use the game to judge players based on:

- Religion
- Political beliefs
- Race
- Sexual orientation
- Health conditions
- Real personal identity

If sensitive attributes are discussed academically, use fictional examples and explain their ethical context.

---

# 9. AI Rules

Do NOT build unnecessary real AI/ML.

The educational simulation does not require a machine-learning model.

The project should explain:

DATA
→
PATTERNS
→
ALGORITHM
→
DECISION
→
IMPACT

The word "AI" should not be used merely as decoration.

Any simulated AI behavior must be clearly educational.

Do not claim that the game is a scientifically accurate AI hiring model.

---

# 10. Fairness Rules

Do not present one fairness metric as the universal definition of fairness.

Fairness depends on:

- Context
- Goal
- Data
- Impact
- Stakeholders
- Legal and ethical requirements

The fairness challenge should teach the principle of using relevant information and evaluating outcomes responsibly.

---

# 11. UI Rules

Every screen should answer:

"What should the user do next?"

Avoid unnecessary text.

Use clear buttons.

Use visual hierarchy.

Important actions should be obvious.

---

# 12. Accessibility Rules

Use:

- Readable font sizes
- Good contrast
- Keyboard accessibility where applicable
- Clear focus states
- Descriptive buttons
- Avoid color-only meaning
- Accessible labels

Do not rely exclusively on color to communicate correct/incorrect information.

---

# 13. Animation Rules

Animations should support understanding.

Avoid:

- Excessive animations
- Long loading animations
- Distracting effects
- Animations that block interaction

Animations should be short and purposeful.

---

# 14. Error Handling

Never allow an error to silently fail.

Every important operation should have:

Loading state
↓
Success state
↓
Error state

Example:

"Unable to submit your decision."

"Please try again."

Do not display raw database errors to users.

---

# 15. Network Failure

The application should gracefully handle:

- Slow internet
- Temporary disconnection
- Supabase connection failure
- Realtime interruption

Show:

"Connection interrupted. Reconnecting..."

Do not immediately destroy the player's session.

---

# 16. AI Coding Boundaries

AI coding agents must:

1. Read relevant project files before modifying them.
2. Follow this rules.md file.
3. Follow Architecture.md.
4. Follow PRD requirements.
5. Avoid rewriting unrelated files.
6. Avoid changing dependencies unnecessarily.
7. Avoid deleting working features.
8. Explain significant architectural changes.
9. Test changes where possible.
10. Keep changes focused.

Before creating a new library, check whether the existing stack already provides the required functionality.

---

# 17. Dependency Rules

Do not install a library for a simple feature that can reasonably be implemented with existing tools.

Before adding a dependency:

- Check whether it is necessary.
- Check whether the project already has an equivalent.
- Prefer mature and maintained libraries.
- Avoid duplicate libraries serving the same purpose.

---

# 18. Code Quality Rules

Use:

- Clear naming
- Small reusable functions
- Strong typing where supported
- Consistent formatting
- Meaningful comments only where necessary

Avoid:

- Giant components
- Duplicate logic
- Magic numbers
- Dead code
- Unused imports
- Unused dependencies

---

# 19. Git Rules

Commit meaningful changes.

Recommended format:

feat: add player lobby

feat: implement decision round

feat: add bias reveal

fix: repair realtime synchronization

refactor: simplify game state management

docs: update architecture

Do not commit secrets.

Never commit:

- .env files containing secrets
- API keys
- Service-role keys
- Private credentials

---

# 20. Completion Rule

A feature is not considered complete until:

- UI works
- Mobile layout works
- Error state exists where required
- Backend interaction works where required
- No obvious console errors exist
- Existing features still work
- Code is committed to GitHub

---

# 21. Golden Rule

Do not build technology for the sake of technology.

Build the experience that makes students understand:

"AI decisions are only as responsible as the data, design, evaluation, and people behind them."