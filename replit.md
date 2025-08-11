# LightPrompt - Soul-Tech Wellness AI Platform

## Overview
LightPrompt is a privacy-first, soul-tech wellness platform evolved into a digital product business focused on career path guidance through astrological insights. The platform now integrates VibeMatch and SoulSync concepts to help users discover their optimal career direction through professional-grade astrological analysis. Built as a full-stack TypeScript application with React, Express, and PostgreSQL, it features secure payments via Stripe, comprehensive career guidance systems, and location-based mindfulness capabilities (GeoPrompt). The platform aims to be a conscious AI tool for human reflection and professional alignment, providing an ethical AI foundation for career fulfillment and universal wellness.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preferences: Apple-style modern structure with teal accents, clean minimalist aesthetic, Stripe-style navigation.
Content personality: Alan Watts meets Yuval Noah Harari meets Ologies podcast host - witty, philosophical, accessible science.
Core philosophy: AI as conscious tool for human reflection and self-connection - never AI becoming human. AI serves as a mirror to help humans connect to their highest selves, nature, and each other through honest reflection.
**ABSOLUTE DATA INTEGRITY MANDATE: LightPrompt is 1000000% honest - ALL data must be real user data from authenticated sources. NO mock data, placeholder data, fake data, or synthetic fallbacks EVER. Every metric, connection, wellness data point, astrological calculation, and user profile element must be sourced from actual database queries and authentic user input.**
Navigation: Clean "Store" section only, hates "Products" terminology, prefers professional simplicity.
Pricing: Course $120, Ebook $11, Bundle $125 (saves $99) - no "WooWoo" terminology, now called "CosmosBot" and "Soul Map & Cosmos".
Domain transition: Moving to lightprompt.co as main landing page.
Soul Sync Architecture: Operates like Apple Health for sharing wellness data, NOT requiring authentication for basic functionality. Spotify-style authentication ONLY for invite recipients. Soul Sync is its own dedicated page with connected user cards, separate from Soul Map page.

## CRITICAL: CORE DATA PROTECTION POLICY
**NEVER modify, delete, or alter any of the following core LightPrompt systems without explicit user permission:**
- User authentication system and user data (users table, sessions, messages)
- Payment/billing system (Stripe integration, user tiers, access codes)
- Course content and access controls (course materials, user profiles)
- Astrology/Soul Map core functionality and calculations
- Bot personalities and system prompts (LightPromptBot, SoulMap Oracle, etc.)
- Database schema for existing production tables
- Admin access controls and security settings
- Email marketing integrations (SendGrid, ConvertKit)
- Existing API routes that power core functionality
- **LightPrompt Knowledge System** - Core reference materials for brand integrity

**Only work on:**
- New features explicitly requested by user
- UI/styling improvements that don't change functionality
- Bug fixes that restore intended behavior
- Performance optimizations that don't change core logic

**Before making ANY changes to core systems, ALWAYS ask for explicit permission.**

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, Vite
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom CSS variables for theming and circadian rhythm adjustments
- **State Management**: React Query for server state; local React state for UI interactions
- **Routing**: Wouter for client-side routing
- **Real-time Features**: Custom hooks for voice recording, sentiment analysis, and circadian theming

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API for users, chat sessions, messages, and file uploads
- **Development**: Hot reload via Vite middleware integration

### Data Storage
- **Database**: PostgreSQL (Supabase) via Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations  
- **Storage Strategy**: DatabaseStorage implementation for data persistence
- **File Storage**: Google Cloud Storage with object access control
- **Privacy Architecture**: User-isolated data with UUID-based account separation
- **Birth Data**: Stored in browser localStorage + optional userProfiles table (user-specific only)
- **Chat Privacy**: All conversations tied to individual user sessions, no cross-user data access
- **DATA INTEGRITY GUARANTEE**: Every data point displayed to users must be sourced from authenticated database queries - zero tolerance for mock, placeholder, or synthetic data. Real user connections, real wellness metrics, real astrological calculations, real profile data only.

### Authentication and Authorization
- **User Management**: Simple user creation and retrieval with email-based identification
- **Session Management**: Chat sessions tied to user accounts with bot-specific conversations
- **Access Control**: Tiered access (Free, Premium) with token usage tracking; admin toggle for `lightprompt.co@gmail.com` with specific codes (`lightprompt2025`, `godmode`, `highest-self`).

### AI and Voice Processing
- **Language Model**: OpenAI GPT-4o with multiple bot personalities and system prompts
- **Soul Map Oracle**: Expert astrology AI with traditional Western astrology knowledge, psychological astrology, and soul-purpose readings
- **Astrological Accuracy**: Precise sun sign calculation from birth dates, established astrological traditions (Ptolemy, Steven Forrest, Dane Rudhyar)
- **Voice Features**: Browser-based voice recording with OpenAI Whisper transcription and text-to-speech
- **Sentiment Analysis**: Real-time sentiment analysis for conversation tone
- **Bot System**: Multiple specialized AI bots with distinct personalities

### UI/UX Decisions
- Clean, minimalist aesthetic with Apple-style modern structure and teal accents.
- Stripe-style navigation focusing on e-commerce.
- The platform now uses clean white/gray/amber color schemes for a professional, accessible aesthetic.

- Admin panel at `/admin/content` for editing pages, images, and fonts.
- `/admin/settings` provides a developer mode toggle for `lightprompt.co@gmail.com` for Wix.com-style editing capabilities.

### Feature Specifications
- **Soul Map Explorer**: Interactive astrological birth chart with cosmic aesthetics, accurate sun sign calculation, and expert oracle responses. Streamlined interface with Aquarius Soul Summary integrated at top, eliminating duplicate information throughout sidebar and redundant sections.
- **Career Path Guidance**: Integrated VibeMatch and SoulSync systems providing personalized career direction based on astrological analysis, including ideal careers, natural talents, work styles, and professional timing insights
- **Oracle System**: Fixed JSON parsing bug, now provides complete astrological readings with birth data context and traditional meanings, enhanced with career-focused guidance
- **Enhanced Birth Chart Report**: Updated with actual birth chart data from Cafe Astrology PDF for accurate planetary positions - Capricorn Rising 14°16', Sun Aquarius 28°01' in 2nd House, Moon Leo 15°27' in 7th House
- **Clean UI Design**: Completely removed Daily Oracle from all interface sections, consolidated sun sign information into single cosmic blueprint display, eliminated all duplicate content for streamlined user experience.
- **VibeMatch Score**: Algorithmic compatibility assessment between current path and astrological potential (1-100 scale) based on planetary alignments
- **SoulSync Areas**: Deep alignment guidance connecting personal values with professional fulfillment through astrological insights
- **Store Experience**: Redesigned for clear customer journey from "Learn More" to product information pages (`/product-info`).
- **Vision Quest**: Rebuilt with white/black/teal color scheme, featuring interactive challenges with detailed steps and completion tracking.
- **GeoPrompt**: Google Maps integration for location-based mindfulness with map exploration and check-in functionality.
- **Admin Access**: `lightprompt.co@gmail.com` has developer mode for full platform control.
- **Content Management System**: Admin panel for editing any page content, sections, buttons, links, colors, and metadata.
- **Blog Integration**: Full article management and search functionality.
- **LightPrompt Knowledge System**: Comprehensive core reference database storing brand identity, product descriptions, bot personalities, ethics guidelines, and course content. Prevents misinformation and maintains brand integrity through systematic knowledge storage accessible at `/admin/knowledge` and via API endpoints (`/api/knowledge/:category/:key`).

### Advanced Developer Features (Power User Tools)
- **Cosmic Debug Console** (`/cosmic-debug`): Real-time system monitoring, astrological calculation debugging, API performance metrics, and live data visualization for technical analysis
- **API Explorer** (`/api-explorer`): Interactive API documentation and testing interface with request/response analysis, cURL generation, endpoint testing, and comprehensive API schema exploration
- **Database Viewer** (`/data-viewer`): Complete database structure explorer with live data viewing, query analytics, table relationships, and sensitive data masking capabilities
- **Visual Page Editor** (`/admin/page-editor`): Advanced content management with drag-and-drop editing, live preview, and WYSIWYG capabilities for non-technical content updates
- **DevTools Menu**: Terminal-style developer navigation accessible to admin users, providing quick access to all technical tools and system monitoring features
- **Enhanced Soul Map Explorer**: Advanced mode with technical data overlays, calculation breakdowns, and detailed astrological computation analysis for power users

## External Dependencies
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **AI Services**: OpenAI API (GPT-4o, Whisper)
- **Maps**: Google Maps API
- **Cloud Storage**: Google Cloud Storage
- **File Upload**: Uppy.js
- **UI Framework**: Radix UI