# Copilot Instructions for Pharmacy School Study App

## Project Overview
This is a cross-platform desktop application with cloud synchronization designed for pharmacy students to enhance studying and extract important information from pharmaceutical content. Built with modern web technologies for desktop deployment, with future iOS expansion planned.

## Technology Stack (Gold Standard)
- **Desktop Framework**: Electron with React/TypeScript for cross-platform native desktop experience
- **Frontend**: React 18+ with Vite for fast development and modern tooling
- **State Management**: Zustand for lightweight, scalable state management
- **UI Framework**: Tailwind CSS + Radix UI for accessible, customizable components
- **Backend**: Node.js with Fastify or Express, deployed on cloud infrastructure
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Cloud Services**: AWS/Vercel for hosting, S3 for file storage, Redis for caching
- **Authentication**: Auth0 or Supabase Auth for secure user management
- **Real-time Sync**: WebSockets or Server-Sent Events for live data synchronization

## Core Features & Architecture
- **Study Materials Management**: Digital flashcards, drug information databases, and clinical scenarios
- **Information Extraction**: AI-powered tools to identify and organize key pharmaceutical concepts
- **Interactive Learning**: Adaptive quizzes, case studies, and practice exams with spaced repetition
- **Cloud Synchronization**: Real-time sync across devices with offline-first capability
- **Progress Analytics**: Detailed performance tracking with visual insights and learning path optimization

## Development Guidelines

### Drug Information Standards
- Always use generic drug names as primary identifiers, with brand names as aliases
- Include essential drug properties: mechanism of action, indications, contraindications, side effects
- Follow FDA-approved labeling and clinical guidelines for drug information
- Implement proper drug interaction checking and safety warnings

### Data Structure Conventions
```
Drug Entity:
{
  id: string (generic name in snake_case)
  genericName: string
  brandNames: string[]
  classification: string[]
  mechanismOfAction: string
  indications: string[]
  contraindications: string[]
  sideEffects: string[]
  interactions: string[]
}
```

### Educational Content Patterns
- Structure learning modules by therapeutic areas (cardiovascular, infectious disease, etc.)
- Use spaced repetition algorithms for flashcard systems
- Implement difficulty progression based on student performance
- Include clinical context and real-world applications in examples

### Development Workflow
- **Build System**: Vite for fast development builds, Electron Builder for desktop packaging
- **Package Manager**: pnpm for efficient dependency management and monorepo structure
- **Code Quality**: ESLint + Prettier + Husky for consistent code formatting and pre-commit hooks
- **Type Safety**: Strict TypeScript configuration with path mapping for clean imports

### User Experience Priorities
- **Desktop-first design** with native OS integration (menu bar, notifications, keyboard shortcuts)
- **Offline-first architecture** with automatic cloud sync when online
- **Quick search** with fuzzy matching across all drug and disease databases
- **Accessibility compliance** following WCAG 2.1 guidelines for diverse learning needs
- **Dark/light theme support** for extended study sessions

### Testing Approach
- **Unit Tests**: Vitest for fast, modern unit testing of business logic
- **Integration Tests**: Playwright for end-to-end desktop app testing
- **Component Tests**: React Testing Library for UI component validation
- **API Tests**: Supertest for backend endpoint validation
- **Content Validation**: Custom tests to ensure medical accuracy and data integrity

### Key Dependencies & Tools
```json
{
  "desktop": ["electron", "electron-builder", "electron-updater"],
  "frontend": ["react", "typescript", "vite", "tailwindcss", "@radix-ui/react-*"],
  "state": ["zustand", "@tanstack/react-query", "immer"],
  "medical": ["rxnorm-js", "fhir", "clinical-taxonomy"],
  "charts": ["recharts", "d3", "@visx/visx"],
  "utils": ["date-fns", "lodash-es", "zod", "nanoid"]
}
```

## Project Structure (Monorepo)
```
apps/
├── desktop/            # Electron main process and renderer
│   ├── src/
│   │   ├── main/       # Electron main process
│   │   ├── renderer/   # React frontend
│   │   └── preload/    # Electron preload scripts
├── api/                # Node.js backend API
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # Business logic
│   │   └── db/         # Database models and migrations
packages/
├── shared/             # Shared types, utilities, and constants
├── ui/                 # Reusable UI components
└── medical-data/       # Drug databases and medical content
```

## Content Guidelines
- Verify all medical information against authoritative sources
- Include proper attribution for clinical guidelines and drug information
- Use evidence-based practice standards in clinical scenarios
- Maintain version control for medical content updates and corrections

## Security & Compliance
- No storage of personal health information (PHI)
- Implement proper data encryption for user study progress
- Follow educational privacy standards (FERPA compliance if applicable)
- Regular updates to drug information databases for accuracy