# PharmSchoolEasy 💊

> **Making Pharmacy School Easy - Modern Desktop Study Application**

A next-generation cross-platform desktop application designed to simplify pharmaceutical education through AI-powered learning tools, interactive drug databases, and adaptive study systems.

![PharmSchoolEasy Demo](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=PharmSchoolEasy+Study+App)

## 🌟 Vision

PharmSchoolEasy transforms the pharmacy school experience by combining cutting-edge technology with evidence-based educational practices. Our mission is to make pharmacy education accessible, engaging, and effective for every student.

## ✨ Why PharmSchoolEasy?

### 🎯 **Built for Pharmacy Students**

- Designed specifically for PharmD curriculum requirements
- Covers all major therapeutic areas and drug classifications
- Aligned with NAPLEX and state board exam standards

### 🧠 **Intelligent Learning System**

- AI-powered information extraction from pharmaceutical content
- Adaptive spaced repetition algorithms for optimal retention
- Personalized study paths based on individual progress and weaknesses

### 💊 **Comprehensive Drug Database**

- Complete drug profiles with mechanisms, interactions, and clinical data
- FDA-compliant labeling and safety information
- Advanced search with fuzzy matching across all databases
- Clinical decision support tools

### 🎨 **Premium User Experience**

- Modern glassmorphism UI with dark/light themes
- Desktop-first design with native OS integration
- Offline-first architecture with cloud synchronization
- Intuitive navigation designed for extended study sessions

### 📊 **Advanced Analytics**

- Detailed performance tracking with visual insights
- Learning weakness identification and targeted recommendations
- Progress visualization across therapeutic areas
- Study time optimization and scheduling

## 🏗️ Architecture

### Technology Stack

Following modern development best practices:

- **Desktop Framework**: Electron for cross-platform native experience
- **Frontend**: React 18+ with TypeScript and Vite
- **UI Framework**: Tailwind CSS + Radix UI components
- **State Management**: Zustand for lightweight, scalable state
- **Backend**: Node.js with Fastify, PostgreSQL, and Prisma ORM
- **Cloud Services**: AWS/Vercel with real-time synchronization
- **Package Manager**: pnpm for efficient monorepo management

### Project Structure

```bash
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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/jacksonbarger/pharmschooleasy.git
cd pharmschooleasy

# Install dependencies
pnpm install

# Start development server
pnpm dev:desktop
```

### Development Commands

```bash
# Desktop development
pnpm dev:desktop          # Start Electron app in dev mode
pnpm build:desktop        # Build desktop app for production
pnpm package:desktop      # Package for distribution

# Backend development
pnpm dev:api             # Start API server
pnpm build:api           # Build API for production

# Code quality
pnpm lint                # Run ESLint
pnpm format              # Format code with Prettier
pnpm test                # Run test suite
```

## 🎯 Target Audience

### Primary Users

- **P1-P4 PharmD Students**: Core curriculum support and exam preparation
- **Pre-pharmacy Students**: Foundation building and prerequisite mastery
- **Pharmacy Residents**: Advanced clinical knowledge and board preparation

### Secondary Users

- **Practicing Pharmacists**: Continuing education and knowledge updates
- **Pharmacy Technicians**: Certification exam preparation
- **Pharmacy Educators**: Teaching tools and student progress tracking

## 🏥 Medical & Educational Standards

PharmSchoolEasy maintains the highest standards:

- **FDA Compliance**: Drug labeling and clinical guidelines
- **Evidence-Based**: All content verified against authoritative sources
- **Educational Privacy**: FERPA compliance where applicable
- **Regular Updates**: Continuous medical content accuracy verification
- **Accessibility**: WCAG 2.1 guidelines for inclusive learning

## 🔮 Development Roadmap

### Phase 1: Foundation (Q1 2026) - Current

- ✅ Project architecture and development environment
- ✅ Modern UI system with glassmorphism design
- 🔄 Core study modules and flashcard system
- 🔄 Drug database integration and search functionality

### Phase 2: AI-Enhanced Learning (Q2 2026)

- 📅 AI-powered content extraction from textbooks and guidelines
- 📅 Adaptive spaced repetition with performance analytics
- 📅 Clinical scenario simulations and case studies
- 📅 NAPLEX-style practice exams with detailed explanations

### Phase 3: Cloud & Collaboration (Q3 2026)

- 📅 Real-time cloud synchronization across devices
- 📅 Study group collaboration and shared resources
- 📅 Educational institution integration
- 📅 Instructor dashboard for progress monitoring

### Phase 4: Mobile & Advanced Features (Q4 2026)

- 📅 iOS companion app for mobile studying
- 📅 Offline-first architecture with smart caching
- 📅 Professional continuing education modules
- 📅 Advanced clinical decision support tools

## 💡 Key Features in Development

### Smart Study System

- **Adaptive Learning**: AI adjusts difficulty based on performance
- **Spaced Repetition**: Optimized review scheduling for long-term retention
- **Weakness Detection**: Identifies knowledge gaps and provides targeted practice
- **Progress Prediction**: Estimates readiness for exams and board certification

### Drug Information System

Following pharmaceutical standards:

```typescript
// Drug entity structure
interface DrugProfile {
  id: string;                    // Generic name (snake_case)
  genericName: string;
  brandNames: string[];
  classification: string[];
  mechanismOfAction: string;
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  interactions: DrugInteraction[];
  clinicalPearls: string[];
}
```

## 🤝 Contributing

We welcome contributions from the pharmacy education community!

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow our coding standards (ESLint + Prettier + TypeScript)
4. Verify medical content accuracy against authoritative sources
5. Submit a pull request with detailed description

### Content Guidelines

- Use generic drug names as primary identifiers
- Verify all medical information against FDA-approved sources
- Include proper attribution for clinical guidelines
- Follow evidence-based practice standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Pharmacy students and educators for invaluable feedback
- Clinical guidelines and pharmaceutical database contributors
- Open source community and modern web technology ecosystem
- FDA and other regulatory bodies for authoritative drug information

## 📧 Contact & Support

- **Project Lead**: [Jackson Barger](mailto:dbarger488023@student.wmcarey.edu)
- **Issues**: [GitHub Issues](https://github.com/jacksonbarger/pharmschooleasy/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/jacksonbarger/pharmschooleasy/discussions)
- **Documentation**: [Wiki](https://github.com/jacksonbarger/pharmschooleasy/wiki)

---

**Making Pharmacy School Easy, One Student at a Time** 🎓💊
