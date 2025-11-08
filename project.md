# Project Notes - Synth Essence

## Overview
- AvatarHub (Synth Essence) is a Vite + React application for creating, training, and managing AI avatars backed by Supabase auth, storage, and Postgres.
- The product centers on an authenticated dashboard with modules covering avatar creation, knowledge management, chatbot training, image generation, and assorted supporting tooling; several modules ship UI scaffolding that awaits future backend integrations.

## Tech Stack & Tooling
- Frontend: Vite 5 with `@vitejs/plugin-react-swc`, React 18, TypeScript 5.8, React Router 6, TanStack Query 5, React Hook Form, Zod.
- UI/UX: Tailwind CSS (custom theme), shadcn/ui component library (Radix primitives), lucide-react icons, framer-motion animations, Embla carousel, Sonner toasts, CMDK command palette.
- Backend-as-a-service: Supabase for auth, database, storage buckets, generated TypeScript types (`src/integrations/supabase`), and edge functions (Deno).
- AI integrations: Supabase Edge Function `generate-image` wraps the KIE AI Flux API; chatbot training screens currently simulate interactions client-side.
- Tooling: ESLint 9 configuration, PostCSS + tailwindcss-animate, Lovable tagger plugin during development builds.

## Local Development
- Install dependencies: `npm install` (bun lockfile is present but npm scripts are canonical).
- Start dev server: `npm run dev` (Vite serves the app on port 8080 per `vite.config.ts`).
- Build for production: `npm run build` (or `npm run build:dev` to force development mode build).
- Preview production bundle locally: `npm run preview`.
- Static analysis: `npm run lint`.

## Frontend Architecture
### Entry & Routing
- `src/main.tsx` mounts `<App />` inside React strict mode and imports global Tailwind styles.
- `src/App.tsx` wraps the tree with a `QueryClientProvider`, wires the toaster systems, and defines React Router routes under `BrowserRouter`.
- Routes: `/` (marketing landing), `/auth`, `/dashboard`, `/create-avatar` (with optional `:id`), `/avatar/:id`, plus a wildcard `NotFound` route. Protected routes redirect unauthenticated visitors to `/auth`.

### State & Data Management
- `src/hooks/useAuth.tsx` encapsulates Supabase auth listeners and exposes `user`, `session`, `loading`, and auth actions; each hook usage registers its own `onAuthStateChange` subscription.
- TanStack Query is wired globally and currently powers profile/referral queries in settings while leaving headroom for broader data fetching.
- Local component state manages wizard progress, selection, and transient UI flags across the dashboard.
- LocalStorage is used for sticky banner dismissal, marketplace purchase history, chatbot tab/avatar selection, training data drafts (`useTrainingDataCache`), and other temporary client-side persistence.

### Styling & UI
- Tailwind theme (`tailwind.config.ts`) extends color tokens for sidebar, alerts, gradients, and declares global animations (aurora, neural flow, etc.).
- shadcn/ui components live in `src/components/ui`, wrapping Radix primitives with Tailwind styling; custom UI primitives include sticky banners, aurora/grid backgrounds, and upload widgets.
- Animations leverage `framer-motion` and supporting libraries such as `cobe` for interactive visuals on the landing page.

## Feature Areas
### Landing & Marketing Experience
- `src/pages/Landing.tsx` delivers the marketing page with sticky announcement banner, responsive nav, authenticated CTAs, and hero/feature highlights.
- `src/components/landing/FeaturesSection.tsx` renders animated feature cards (globe visualization, tutorial teaser, stacked imagery) driven by motion hooks.

### Authentication
- `src/pages/Auth.tsx` toggles between login, signup, and password reset flows; success relies on `useAuth` state updates rather than explicit callbacks.
- `LoginForm`, `SignupForm`, and `ForgotPasswordForm` implement form UX with React Hook Form-like patterns, Supabase auth calls, and Sonner toasts; Google auth is currently a placeholder toast.
- User metadata (name, phone, referral codes) is captured during signup and persisted via Supabase `profiles` through triggers.

### Dashboard Shell
- `src/pages/Dashboard.tsx` holds the current `activeSection` and renders the selected module inside the shell.
- `src/components/dashboard/Sidebar.tsx` provides responsive navigation (collapse on desktop, slide-in mobile) and exposes callbacks for section changes and logout.
- `DashboardOverview` surfaces shortcuts into other modules alongside onboarding content.

### Avatar Creation Workflow
- `src/pages/CreateAvatar.tsx` implements a five-step wizard (Details, Personality, Backstory, Hidden Rules, Knowledge Base) with validation, progress meter, unsaved-change protection, and Supabase integration.
- Step components under `src/components/avatar-creation/` manage image uploads (Supabase storage), personality tag selection, template-driven text insertion, and knowledge file management.
- Saving creates or updates `avatars` rows and, when creating, uploads deferred knowledge files to the `knowledge-base` bucket before inserting metadata.

### Avatar Management & Detail
- `src/components/dashboard/sections/MyAvatarSection.tsx` fetches active avatars for the user, loads knowledge files, enables soft delete via `soft_delete_avatar`, and routes to detail/edit/training views.
- `src/pages/AvatarDetail.tsx` displays a detailed avatar profile with media, metadata tabs, knowledge file list, and real-time updates via Supabase channels.
- `AvatarAssignSection` currently uses mock data to outline future assignment workflows with QR code sharing.

### Knowledge Base
- Wizard and chatbot knowledge components load/upload/delete PDF knowledge files, relying on Supabase storage and the `avatar_knowledge_files` table.
- Both components subscribe to Supabase realtime changes to reflect updates initiated elsewhere.

### Chatbot Training Suite
- `src/components/dashboard/sections/ChatbotSection.tsx` orchestrates avatar selection (dropdown backed by Supabase), training UI tabs, and state transitions.
- `SimplifiedTrainingInterface` caches combined prompts and uploaded assets locally and simulates training results.
- `TestChat` renders a conversation simulator that prevents interaction while training is flagged active.
- `VersionControl` and related components read/write version history to localStorage pending backend persistence.

### Image Generator
- `src/components/dashboard/sections/ImagesSection.tsx` combines prompt capture, optional image upload, progress polling, gallery, favorite flags, and collection management.
- Supabase edge functions power the flow: `generate-image` starts/polls KIE AI Flux tasks, `save-generated-image` records results, `manage-images` handles listing/favorite/delete, and `manage-collections` manages user-defined collections.
- Generated images (and uploaded bases) are stored under `ai-images/` in the public `avatars` bucket.

### Voice, Learning Path, and Supporting Modules
- `TTSSection` supplies UI scaffolding for voice selection, parameter tuning, cloning, and sample export (backend integration pending).
- `LearningPathSection` visualizes mocked version history and training metrics for avatar evolution.
- `AvatarSection` provides placeholder cards for avatar generation/editing tools.
- `BillingSection` shows static plan info, transaction history, and a detailed pricing view toggle.

### Marketplace & Templates
- `MarketplaceSection` renders a searchable, filterable grid backed by static avatar data (`src/data/avatarData.ts`), persists purchases locally, and links to avatar detail pages.
- `avatar_templates` table feeds backstory/hidden rule templates consumed by the creation wizard.

### Settings & Profile
- `SettingsSection` uses tabs for profile management (`UserProfile` fetches/updates Supabase `profiles` and uploads avatar images), referral system (`ReferralSection` validates codes and updates `profiles`), and placeholder API key storage.
- API key management currently stores mock data client-side; future work will need secure persistence.

## Supabase Backend
### Database Tables
- `profiles`: mirrors user metadata (name, email, phone, referral_code, referrer_code, avatar_url) with triggers provisioning on auth signup.
- `avatars`: stores persona attributes, media, linguistic traits, backstory, hidden rules, and soft-delete fields (`status`, `deleted_at`, `scheduled_hard_delete_at`, etc.).
- `avatar_knowledge_files`: metadata for uploaded PDFs (path, size, content_type, linkage, soft-delete columns).
- `avatar_templates`: shared templates for backstory and hidden rule generation, readable to all users.
- `deleted_avatars`: view populated with soft-deleted avatars and countdown to hard delete.
- `generated_images`, `image_collections`, `image_collection_items`: tables supporting the AI image gallery and user-defined collections with appropriate RLS.
- Indexes exist on user/status combinations and scheduled delete timestamps to support queries and cleanup jobs.

### Functions & Triggers
- `handle_new_user` trigger auto-inserts into `profiles` with generated referral codes (via `generate_referral_code`) when an auth user is created.
- `soft_delete_avatar` and `restore_avatar` manage 90-day soft delete workflows for avatars and related knowledge files.
- `cleanup_hard_delete_avatars` purges avatars and knowledge files whose `scheduled_hard_delete_at` deadline has passed (intended for cron invocation).
- `refresh_deleted_avatars_view` repopulates the `deleted_avatars` view after changes (called by soft delete/restore flows).
- Functions are granted to the `authenticated` role where appropriate; `refresh_deleted_avatars_view` requires `service_role`.

### Storage Buckets
- `avatars` (public): hosts user avatar images, generated images, and profile pictures; file size limit increased to 50 MB and public read policy enabled.
- `knowledge-base` (private): stores training PDFs in a `{userId}/{avatarId}/` hierarchy with RLS restricting access to the owner.

### Edge Functions
- `generate-image`: validates JWT, calls KIE AI Flux API, returns task IDs, and supports progress polling.
- `save-generated-image`: persists finished generations to `generated_images`.
- `manage-images`: CRUD interface for generated images (list, toggle favorite, delete) and cascade cleanup of collection items.
- `manage-collections`: creates collections, manages membership, and fetches collection contents.
- All edge functions instantiate a Supabase client with the service role key, verify JWTs, and run in Deno deployed via Supabase.

## Realtime & Client Persistence
- Supabase realtime channels update avatar details, knowledge files, and wizard steps when editing existing avatars.
- LocalStorage is leveraged for UX continuity (training data cache, banner dismissal, marketplace purchases, chatbot context).

## Dependencies
- Data & networking: `@supabase/supabase-js`, `@tanstack/react-query`, `react-router-dom`, `react-hook-form`, `zod`, `date-fns`.
- UI/animation: `lucide-react`, `@radix-ui/react-*` suite (via shadcn), `framer-motion`, `embla-carousel-react`, `cobe`, `sonner`.
- Utilities: `class-variance-authority`, `clsx`, `tailwind-merge`, `vaul`, `cmdk`, `input-otp`.
- Dev tooling: `@eslint/js`, `typescript-eslint`, `tailwindcss`, `postcss`, `lovable-tagger`.

## Known Issues / Bugs
1. `Dashboard` ignores `location.search`, so navigation that relies on `?section=…` (e.g., from Create Avatar or avatar detail) never updates the active view (`src/pages/Dashboard.tsx:23` to `src/pages/Dashboard.tsx:33`).
2. Quick action shortcuts in the overview point to non-existent section IDs (`'avatars'` and `'learning'`), leaving those buttons inert (`src/components/dashboard/DashboardOverview.tsx:40` to `src/components/dashboard/DashboardOverview.tsx:83`).
3. `AvatarDetail` redirects to `/dashboard?section=my-avatars`, which does not match the actual section key (`my-avatar`) and compounds the query-string issue (`src/pages/AvatarDetail.tsx:134` and `src/pages/AvatarDetail.tsx:165`).
4. Knowledge base loaders fetch all records without filtering soft-deleted entries, so recently deleted files can leak back into the UI (`src/components/avatar-creation/KnowledgeBaseStep.tsx:60` to `src/components/avatar-creation/KnowledgeBaseStep.tsx:66` and `src/components/chatbot-training/KnowledgeBase.tsx:88` to `src/components/chatbot-training/KnowledgeBase.tsx:92`).

## Potential Enhancements / Open Questions
- Consolidate `useAuth` into a context/provider to avoid duplicating Supabase auth listeners across every hook usage.
- Implement backend-backed data for `AvatarAssignSection`, TTS training, learning path stats, billing, and API key management (currently mocked or placeholder UIs).
- Add server-side cleanup of uploaded avatar images when users delete them to avoid orphaned storage objects (partial logic exists for knowledge files).
- Expand React Query usage (or custom hooks) for other Supabase interactions to standardize caching and error handling.
- Introduce form validation schemas (Zod/React Hook Form) for Create Avatar steps beyond current minimal checks.

## Environment & Secrets
- Client bundles include the Supabase anon key (publishable); environment variables are expected via Vite (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Edge functions require `SUPABASE_SERVICE_ROLE_KEY` and `KIE_AI_API_KEY` (for KIE AI Flux) to be configured in the Supabase project settings.
- Storage buckets (`avatars`, `knowledge-base`) must exist with the policies defined in migrations.

## Testing & QA
- No automated tests are present (unit, integration, or end-to-end). Manual verification is required for authentication flows, Supabase operations, and edge function interactions.
- Adding regression coverage around the avatar creation wizard, knowledge management, and image generation endpoints is recommended before significant refactors.

