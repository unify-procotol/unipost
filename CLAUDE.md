# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Development commands:
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

UniPost is a multilingual content management platform built with Next.js 15 that integrates with Ghost CMS and provides AI-powered translation services.

### Core Architecture

The application uses a layered architecture with the URPC framework:

**URPC Layer** (`src/api.ts`):
- Main API configuration using `@unilab/urpc-next`
- Defines the UnipostPlugin with entities and adapters
- Handles PostgreSQL database connections
- Manages AI translation processing workflow

**Entities** (`src/entities/`):
- `ProjectEntity` - Represents Ghost CMS projects with configuration
- `PostEntity` - Represents blog posts with translation states

**Adapters** (`src/adapters/`):
- `ProjectAdapter` - Manages project CRUD and Ghost CMS integration
- `PostAdapter` - Handles post operations and translation workflows
- `PostgresAdapter` - Base adapter for database operations

**API Routes** (`src/app/api/`):
- `[...urpc]/route.ts` - Main URPC endpoint handler
- `subscribe/route.ts` - Email subscription management
- `process/route.ts` - Background translation processing
- `og/route.tsx` - Dynamic OpenGraph image generation

### Key Features

**Ghost CMS Integration**:
- Fetches posts via Ghost Content API
- Publishes translated content via Ghost Admin API
- Maintains synchronization between Ghost and local database

**AI Translation Pipeline**:
- Posts start in "pending" status after Ghost sync
- AI translation via OpenAI GPT models (`src/lib/i18n.ts`)
- Translated posts move to "translated" status
- Background processing handles translation queue

**Multilingual Routing**:
- Dynamic routes via `[prefix]/page.tsx` and `[prefix]/[...params]/page.tsx`
- Language-specific content serving based on project configuration
- SEO optimization with locale-specific metadata

### Database Schema

Projects table contains Ghost CMS credentials and locale configuration.
Posts table tracks translation status and stores multilingual content.

### Configuration

**Next.js Config** (`next.config.ts`):
- Custom asset prefix for production deployment
- CORS headers for API access
- Image optimization with multiple remote domains
- Transpilation of `@unilab/urpc` packages

**TypeScript**:
- Path mapping with `@/*` for `src/*`
- Strict mode enabled
- ES2017 target for compatibility

### Development Notes

When working with URPC entities, ensure adapters are properly registered in the plugin configuration. Translation processing is handled asynchronously - check the `process()` function in `src/api.ts` for the workflow logic.

The application uses Tailwind CSS for styling and includes performance monitoring components for production optimization.