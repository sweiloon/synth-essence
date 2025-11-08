<!--
Sync Impact Report:
Version: 1.0.0 → 1.0.1 (patch increment)
Modified principles: None (structure preserved, minor clarifications added)
Added sections: None
Removed sections: None
Templates:
✅ plan-template.md - Constitution Check section perfectly aligned with all 5 principles
✅ spec-template.md - Requirements structure supports constitution requirements
✅ tasks-template.md - Task categorization reflects TypeScript, component architecture, security, and real-time requirements
Follow-up TODOs: None - all systems aligned
-->

# Synth Essence Constitution

## Core Principles

### I. Component-First Architecture
Every UI component must be reusable, accessible, and self-contained. Components MUST follow shadcn/ui patterns with Radix primitives and proper TypeScript definitions. Clear separation between presentation logic and business logic is mandatory - no API calls within UI components.

### II. Type Safety Excellence
TypeScript MUST be strictly enforced with no `any` types except in verified edge cases. All API responses, database schemas, and component props require explicit type definitions. Supabase generated types MUST be used as the source of truth for database interactions.

### III. Real-time by Design
All data mutations must include Supabase real-time subscriptions where user experience benefits from live updates. Avatar details, knowledge files, and training progress require instant synchronization across clients. Subscriptions must be properly cleaned up to prevent memory leaks.

### IV. Authentication-First Security
All routes handling user data MUST verify authentication state. Row Level Security (RLS) policies are mandatory for all Supabase tables. Edge functions MUST validate JWT tokens before processing requests. No sensitive data in client-side storage beyond session tokens.

### V. Progressive Enhancement
Features must work with JavaScript disabled where possible. All forms require proper validation both client-side and server-side. Loading states, error boundaries, and graceful degradation are non-negotiable for user-facing features.

## Quality Standards

All code must pass ESLint validation with the project's strict configuration. React components require proper error boundaries and loading states. Database operations must include proper error handling and transaction rollbacks. Performance budgets: page loads under 3 seconds, bundle size under 2MB total.

## Testing Requirements

Manual testing is required for all authentication flows, real-time subscriptions, and file upload workflows. Edge function integration must be verified in staging environments before production deployment. Database migrations require testing against realistic data volumes.

## Governance

Constitution supersedes all other development practices. All pull requests must demonstrate compliance with authentication, type safety, and component architecture principles. Breaking changes to core principles require team consensus and migration plan documentation. This constitution guides runtime development through adherence to established patterns and security requirements.

**Version**: 1.0.1 | **Ratified**: 2025-01-28 | **Last Amended**: 2025-11-04