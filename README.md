# Recipes App

A recipe app built around one question: **what can I cook with what I have?**

Pick the ingredients you have at home and the app ranks the recipes by how many of them each one uses, showing for every recipe how many ingredients you have and how many you are missing. It started as an app for my own kitchen and doubles as a portfolio project, built end to end: database, server logic, authentication, UI and tests. The interface and the recipes are in Polish.

**Live demo:** _add the link after deploying_

**Demo account (read-only):** `demo@recipes.app` / `demo1234`, or use the "Wejdź jako demo" button on the login page.

## Screenshots

> TODO: add a screenshot or GIF of searching by ingredients and one of the add-recipe form once the app is deployed.

## Features

- Browse recipes by meal type (dinner, dessert, supper, snack).
- **Search by the ingredients you have.** Recipes are ranked by matches; each result shows how many ingredients you have (✓) and how many are missing (✗).
- Filter by name and by maximum preparation time. The filters live in the URL, so a filtered view can be shared and the back button works.
- Ingredient families: "pierś z kurczaka" and "udka z kurczaka" both count as "kurczak". Pantry staples (salt, spices, oil) never count as missing.
- Add, edit and delete recipes with a validated form: ingredient autocomplete and drag-and-drop ordering of the steps.
- Registration and login with email and password. The whole app requires a login, and two roles decide who may change data: admins can edit, viewers can only read.
- A one-click, read-only demo account.

## Tech stack

| Area | Tools | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript | Server Components fetch data on the server; types from database to UI |
| Styling and UI | Tailwind CSS 4, shadcn/ui (Base UI primitives) | Accessible building blocks, themed through design tokens |
| Data | PostgreSQL (Supabase), Prisma 7 | Typed queries and versioned migrations; Row-Level Security enabled on every table |
| Forms and validation | React Hook Form, Zod | One Zod schema shared by the form and the Server Action |
| Auth | NextAuth (Auth.js) v5, bcryptjs | Email and password, JWT sessions, role-based access |
| Drag and drop | dnd-kit | Reordering recipe steps |
| Testing | Vitest, React Testing Library | Unit tests for pure logic, component tests with mocked Server Actions |

## Key decisions and trade-offs

**Ranking: most matches first, regardless of recipe size.** Recipes are sorted by the number of ingredients you have, then by the fewest missing, then by title. Recipes with no match at all are hidden. The trade-off is that a big recipe where you have 3 of 6 ingredients beats a 2-ingredient recipe you could cook right now. I accepted that because the result is predictable and easy to explain, and every result shows both counts. Ranking by fewest missing would favour tiny recipes. If a recipe lists two ingredients from the same family (chicken breast and thighs), they count as two matches, because it really needs two things.

**Ingredient families instead of exact names.** Every ingredient can belong to a family (`baseName`), and matching works on the family, so you pick "kurczak" once instead of five cuts. The cost is curation: an ingredient typed into the recipe form has no family until I add it to the seed script, and until then it matches by its own name.

**Pantry staples are excluded from matching.** A separate `isStaple` flag marks salt, spices and oil, so they never show up as missing. I kept it as its own flag instead of reusing the family field, because one field should answer one question: the family says "what is this ingredient", the flag says "do I need to own it". The cost is more manual curation.

**Filters live in the URL.** Name, preparation time and ingredients are search parameters; the server page reads them and builds a single Prisma query, so there is no client state to keep in sync. Filter changes replace the history entry instead of adding one, and the name search is debounced so typing does not trigger a request per keystroke.

**The ranking is a pure function.** The database query only fetches data; all the decisions (matching, filtering, sorting) live in `rankRecipes`, which does not import Prisma and is covered by unit tests without a database. The one rule it cannot test is the exclusion of pantry staples, because that happens in the query.

**Authentication: NextAuth with the smallest possible schema.** Credentials login needs JWT sessions, so the Prisma adapter's `Account`, `Session` and `VerificationToken` tables would stay empty; I use only my own `User` table. Passwords are hashed with `bcryptjs` (pure JavaScript, no native build on serverless hosts). Login errors are deliberately generic so the form does not reveal which emails exist, and a duplicate email is detected from the database's unique constraint instead of check-then-insert, which avoids a race between two simultaneous sign-ups.

**One validation schema, checked twice.** The same Zod schema runs in the form (for instant feedback) and again in the Server Action, because a Server Action is a public endpoint that can be called without the form. Client validation is UX; server validation is security.

**Access control in layers.** The whole app sits behind a login (`proxy.ts`, the Next.js 16 successor to middleware), with only `/login` and `/register` public. Two roles, `admin` and `viewer` (the default), decide who may change data. The real gate is the role check inside the Server Actions; pages redirect viewers away from edit screens and the UI hides the buttons, but hiding a button is not authorization. The trade-off is that the role is copied into the JWT at login, so a role change takes effect only after logging in again.

**A public demo account.** Its credentials are in this README on purpose: it is a `viewer`, so knowing the password gives no write access. Recruiters can try the search without registering and without being able to change the data.

**Row-Level Security on every table.** Supabase exposes tables through an automatic REST API, so a table without RLS is readable by anyone with the project URL. All tables have RLS enabled with no policies; the app itself connects with a database role that bypasses RLS, so it is unaffected.

## Getting started

### Prerequisites

- Node.js 20.9 or newer
- A PostgreSQL database (the app was developed against Supabase's free tier)

### Install and configure

```bash
git clone https://github.com/MagdaN93/recipesApp.git
cd recipesApp
npm install
```

`npm install` also generates the typed Prisma client into `app/generated/prisma` (a `postinstall` script runs `prisma generate`), so you do not need to do that by hand.

Copy `.env.example` to `.env` and fill in the two values:

- `DATABASE_URL`: your Postgres connection string
- `AUTH_SECRET`: a random string, for example from `openssl rand -base64 33`

### Set up the database

```bash
npx prisma migrate deploy
npx tsx prisma/seed-common-ingredients.ts
npx tsx prisma/seed-demo-user.ts
```

- `migrate deploy` creates the tables from the migrations in `prisma/migrations` (use `npx prisma migrate dev` while changing the schema).
- The first seed script adds about 120 common ingredients, with their families and pantry staples. The second creates the read-only demo account. Both can be run again safely.

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The whole app requires a login, so use the demo account above or register a new one.

New accounts are **viewers** and can only read. To get an **admin** (who can add, edit and delete recipes), register, then open `npx prisma studio`, find your row in the `User` table and set `role` to `admin`. Log out and in again, because the role is stored in the session token.

## Testing

```bash
npm test          # watch mode
npm run test:run  # single run
```

What is covered:

- **Ranking logic** (`app/recipes/ranking.test.ts`): matching by ingredient family, sorting, tie-breaks, exclusion of recipes with no matches.
- **Validation schemas** (`app/auth/schema.test.ts`): registration and login rules, including which field an error is attached to.
- **Email normalisation** (`app/tools/normalizeEmail.test.ts`).
- **Login form** (`app/components/LoginForm.test.tsx`): client-side validation, submitting to the Server Action, showing a server error. The Server Actions are mocked, so no database is needed.

## Project structure

```text
app/
  api/auth/         NextAuth route handler
  auth/             sign-up, login and logout Server Actions, Zod schemas, role check
  components/       forms, search panel, navigation
  recipes/          pages, Server Actions, database queries, ranking logic
  login/, register/ auth pages
  lib/prisma.ts     Prisma client
  tools/            small helpers (debounce, email normalisation)
components/ui/      shadcn/ui primitives
prisma/             schema, migrations, seed scripts
auth.ts             NextAuth configuration (provider, session callbacks, roles)
proxy.ts            route protection: everything except /login and /register needs a session
```

## What I would do next

- **Favourites.** Per-user saved recipes would be the natural use of the login (a join table between users and recipes, following the pattern already used for recipe ingredients).
- **Fresher roles.** Re-read the role from the database for sensitive actions, or use database sessions, so a role change does not need a new login.
- **Move the ranking into SQL.** Today the app fetches the recipes of one meal type and ranks them in JavaScript. That is fine for hundreds of recipes, but a database query with a `GROUP BY` would scale much further.
- **Account hardening.** Rate limiting on login and registration, email verification and password reset (which needs an email service).
- **End-to-end tests.** Unit and component tests cover the logic and one form; a Playwright test would cover the staples filter in the query and the access rules.
- **Language-aware sorting.** Sort titles with an explicit Polish locale instead of the environment's default.
