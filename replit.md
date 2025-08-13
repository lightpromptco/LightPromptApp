# LightPrompt - Soul-Tech Wellness AI Platform

## Overview
LightPrompt is a privacy-first, soul-tech wellness platform evolved into a digital product business focused on career path guidance through astrological insights. The platform now integrates VibeMatch and SoulSync concepts to help users discover their optimal career direction through professional-grade astrological analysis. Built as a full-stack TypeScript application with React, Express, and PostgreSQL, it features secure payments via Stripe, comprehensive career guidance systems, and location-based mindfulness capabilities (GeoPrompt). The platform aims to be a conscious AI tool for human reflection and professional alignment, providing an ethical AI foundation for career fulfillment and universal wellness.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preferences: Apple-style modern structure with teal accents, clean minimalist aesthetic, Stripe-style navigation.
Content personality: Alan Watts meets Yuval Noah Harari meets Ologies podcast host - witty, philosophical, accessible science.
Core philosophy: AI as conscious tool for human reflection and self-connection - never AI becoming human. AI serves as a mirror to help humans connect to their highest selves, nature, and each other through honest reflection.
Navigation: Clean "Store" section only, hates "Products" terminology, prefers professional simplicity.
Pricing: Course $120, Ebook $11, Bundle $125 (saves $99) - no "WooWoo" terminology, now called "CosmosBot" and "Soul Map & Cosmos".
Domain transition: Moving to lightprompt.co as main landing page.

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

### Recent Implementation Updates (August 2025)
- **Store & Pricing Complete**: Restored original book ($11), course ($120), and bundle ($125) pricing with Stripe payment integration for both one-time purchases and subscriptions
- **Astronomical Integration Fixed**: Real-time moon phases and planetary positions working correctly through `/api/astro/now` endpoint
- **Soul Map Birth Chart**: Implemented robust fallback system for birth chart calculations, now working with `/api/birth-chart` endpoint
- **Payment Success Page**: Created comprehensive onboarding flow with product-specific guidance at `/payment-success`
- **VibeMatch Settings Complete (August 13, 2025)**: Fully implemented Instagram-style settings page with complete Supabase integration across 6 sections - Profile Information, VibeMatch Profile, Notifications, Privacy & Security, Appearance, and Account. All settings persist to database with comprehensive user profiling system.
- **Enhanced Location System (August 13, 2025)**: Implemented privacy-first location handling with 30-minute browser caching, optional profile storage, real-time permission status badges, and smart coordinate management for location-based features like weather, air quality, and circadian data
- Daily Oracle redesigned with modern white/amber gradient design, accessible at `/daily-oracle` standalone page
- Admin panel at `/admin/content` for editing pages, images, and fonts

### Feature Specifications
- **Soul Map Explorer**: Interactive astrological birth chart with cosmic aesthetics, accurate sun sign calculation, and expert oracle responses. Streamlined interface with Aquarius Soul Summary integrated at top, eliminating duplicate information throughout sidebar and redundant sections.
- **Career Path Guidance**: Integrated VibeMatch and SoulSync systems providing personalized career direction based on astrological analysis, including ideal careers, natural talents, work styles, and professional timing insights
- **Oracle System**: Fixed JSON parsing bug, now provides complete astrological readings with birth data context and traditional meanings, enhanced with career-focused guidance
- **Enhanced Birth Chart Report**: Updated with actual birth chart data from Cafe Astrology PDF for accurate planetary positions - Capricorn Rising 14°16', Sun Aquarius 28°01' in 2nd House, Moon Leo 15°27' in 7th House
- **Clean UI Design**: Completely removed Daily Oracle from all interface sections, consolidated sun sign information into single cosmic blueprint display, eliminated all duplicate content for streamlined user experience.
- **VibeMatch System**: Complete resonance-based connection platform with emotional tone matching, values alignment, archetypes, and intentions. Features comprehensive settings page with Instagram-style interface and full Supabase database integration.
- **VibeMatch Score**: Algorithmic compatibility assessment between current path and astrological potential (1-100 scale) based on planetary alignments
- **SoulSync Areas**: Deep alignment guidance connecting personal values with professional fulfillment through astrological insights
- **Complete Settings System**: Instagram-style settings page with 6 comprehensive sections (Profile, VibeMatch, Notifications, Privacy, Appearance, Account) - all data persists to Supabase with real-time updates and photo upload functionality.
- **Store Experience**: Redesigned for clear customer journey from "Learn More" to product information pages (`/product-info`).
- **Vision Quest**: Rebuilt with white/black/teal color scheme, featuring interactive challenges with detailed steps and completion tracking.
- **GeoPrompt**: Google Maps integration for location-based mindfulness with map exploration and check-in functionality.
- **Admin Access**: `lightprompt.co@gmail.com` has developer mode for full platform control.
- **Content Management System**: Admin panel for editing any page content, sections, buttons, links, colors, and metadata.
- **Blog Integration**: Full article management and search functionality.

## External Dependencies
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **AI Services**: OpenAI API (GPT-4o, Whisper)
- **Maps**: Google Maps API
- **Cloud Storage**: Google Cloud Storage
- **File Upload**: Uppy.js
- **UI Framework**: Radix UI