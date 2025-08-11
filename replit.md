# LightPrompt - Soul-Tech Wellness AI Platform

## Overview
LightPrompt is a privacy-first, soul-tech wellness platform evolved into a digital product business. It offers the "LightPrompt:ed" course and ebook through a professional e-commerce interface. Built as a full-stack TypeScript application with React, Express, and PostgreSQL, it features secure payments via Stripe, content management, and location-based mindfulness capabilities (GeoPrompt). The platform aims to be a conscious AI tool for human reflection and self-connection, providing an ethical AI foundation for universal wellness.

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
- The platform adopts a purple/blue gradient theme for a mystical, soul-tech aesthetic where applicable.
- Admin panel at `/admin/content` for editing pages, images, and fonts.
- `/admin/settings` provides a developer mode toggle for `lightprompt.co@gmail.com` for Wix.com-style editing capabilities.

### Feature Specifications
- **Soul Map Explorer**: Interactive astrological birth chart with cosmic aesthetics, accurate sun sign calculation, and expert oracle responses
- **Oracle System**: Fixed JSON parsing bug, now provides complete astrological readings with birth data context and traditional meanings
- **Store Experience**: Redesigned for clear customer journey from "Learn More" to product information pages (`/product-info`).
- **Vision Quest**: Rebuilt with white/black/teal color scheme, featuring interactive challenges with detailed steps and completion tracking.
- **Soul Sync**: Free access, includes 10 connection types, invite link system, custom activities, streak tracking, and achievements.
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