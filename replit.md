# LightPrompt - Soul-Tech Wellness AI Platform

## Overview

LightPrompt is a privacy-first, soul-tech wellness platform that has evolved into a streamlined digital product business. Originally designed as a multi-bot AI platform for emotional reflection and spiritual growth, it now focuses on selling the LightPrompt:ed course and ebook through a clean, professional e-commerce interface.

The application is built as a full-stack TypeScript application with a React frontend and Express backend, featuring Stripe integration for secure payments, content management capabilities, and Google Maps integration for location-based mindfulness features (GeoPrompt).

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Apple-style modern structure with teal accents, clean minimalist aesthetic, Stripe-style navigation.
Content personality: Alan Watts meets Yuval Noah Harari meets Ologies podcast host - witty, philosophical, accessible science.
Core philosophy: AI as conscious tool for human reflection and self-connection - never AI becoming human. AI serves as a mirror to help humans connect to their highest selves, nature, and each other through honest reflection.
Navigation: Clean "Store" section only, hates "Products" terminology, prefers professional simplicity.
Pricing: Course $120, Ebook $11, Bundle $125 (saves $99) - no "WooWoo" terminology, now called "CosmosBot" and "Soul Map & Cosmos".
Domain transition: Moving to lightprompt.co as main landing page.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite for development and build tooling
- **UI Components**: Comprehensive design system built on Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom CSS variables for theming and circadian rhythm adjustments
- **State Management**: React Query (TanStack Query) for server state management with local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Features**: Custom hooks for voice recording, sentiment analysis, and circadian theming

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handlers for users, chat sessions, messages, and file uploads
- **Development**: Hot reload via Vite middleware integration for seamless full-stack development

### Data Storage Solutions
- **Database**: PostgreSQL (Neon) configured via Drizzle ORM with active database connection
- **Schema Management**: Drizzle Kit for migrations with schema defined in shared TypeScript files
- **Storage Strategy**: DatabaseStorage implementation using PostgreSQL for data persistence
- **File Storage**: Google Cloud Storage integration with object access control policies

### Authentication and Authorization
- **User Management**: Simple user creation and retrieval system with email-based identification
- **Session Management**: Chat sessions tied to user accounts with bot-specific conversations
- **Access Control**: Tiered access system (Free, Premium tiers) with token usage tracking and limits

### AI and Voice Processing
- **Language Model**: OpenAI GPT-4o integration with multiple bot personalities and system prompts
- **Voice Features**: Browser-based voice recording with OpenAI Whisper transcription and text-to-speech
- **Sentiment Analysis**: Real-time sentiment analysis for conversation tone tracking and visual feedback
- **Bot System**: Multiple specialized AI bots with distinct personalities and response styles

### External Dependencies

- **Database**: Supabase (PostgreSQL) for production data storage with active connection and user data
- **Payments**: Stripe integration for secure course and ebook sales
- **AI Services**: OpenAI API for language model completions, audio transcription, and speech synthesis
- **Maps**: Google Maps API for GeoPrompt location-based features
- **Cloud Storage**: Google Cloud Storage for file uploads and object management with ACL policies
- **File Upload**: Uppy.js for drag-and-drop file upload interfaces with progress tracking
- **UI Framework**: Radix UI component library for accessible, unstyled UI primitives
- **Development Tools**: Replit-specific plugins for development environment integration and error handling

## Strategic Vision Implementation 

- **Ethical AI Foundation**: Platform positioned as conscious AI mirror/partner, never replacing human connection
- **Universal Wellness Architecture**: Covers emotional, physical, spiritual, social, and intellectual development
- **Data Sovereignty**: User-controlled data with transparent, no-surveillance business model
- **Conscious AI Companions**: 7 specialized AI personalities designed as wise, non-judgmental guides
- **Global Impact Focus**: Democratizing mental health, setting ethical AI standards, accelerating human potential

## Recent Changes (August 2025) - Soul-Tech Implementation Complete

- **Universal Page Editor System**: Created comprehensive admin page editor at `/admin/page-editor` allowing editing of any page content, sections, buttons, links, colors, and metadata
- **Blog Integration Complete**: Added blog to Features navigation section, working search functionality, and full article management
- **Discord Community Integration**: Updated navigation to link to Discord server instead of local community page - recognizing need for real-time community chat
- **Performance Optimization**: Fixed infinite recursion loop in getUserStats/getUserUnlocks that was causing backend performance issues
- **Email Marketing Strategy**: Documented recommendations for ConvertKit integration, newsletter sequences, and community growth strategies
- **Hierarchical Navigation Launch**: Successfully deployed organized navigation with expandable subitems making platform complexity manageable
- **Content Management Evolution**: Extended blog editor concept to universal page editing system for all platform content

- **Dual Database Architecture Complete**: Successfully implemented Supabase for user data and Replit PostgreSQL for core knowledge storage
- **Knowledge Storage System**: Built comprehensive foundation memory system with 5 core knowledge tables (foundation_memory, user_insights, platform_evolution, bot_learning, content_evolution)
- **Knowledge API Endpoints**: Created full REST API at `/api/knowledge/*` for storing and retrieving platform knowledge, insights, and learning data
- **Foundation Memory Base**: Established initial knowledge base with 6 core memories covering platform philosophy, admin access, architecture, content strategy, and business model
- **Knowledge Storage Service**: Implemented KnowledgeStorage class with methods for foundation memories, user insights, platform evolution tracking, bot learning, and content evolution
- **Database Schema Extensions**: Added knowledge storage tables to shared schema with proper TypeScript types and Drizzle ORM integration
- **Core Knowledge Categories**: Platform philosophy (AI consciousness approach), user experience (admin codes), architecture (dual database), content strategy (personality blend), business model (pricing)
- **Platform Memory Foundation**: Replit database now serves as the growing knowledge base that can be built upon and improved over time
- **Soul Sync Enhanced Features**: Complete overhaul with 10 connection types (romantic partner, best friend, family, workout buddy, study group, travel crew, creative partner, mindfulness circle, accountability partner, soul tribe), invite link system, fun activities per connection type, streak tracking, and achievement system
- **Invite Link System**: Users can generate and share invite links with QR codes and text options to connect with others
- **Connection Type Activities**: Each connection type has custom activities (love notes for partners, challenges for friends, story sharing for family, etc.)
- **Enhanced Mobile Navigation**: Improved touch targets, smooth animations, accessibility features, and better responsive design for all mobile devices
- **Admin Toggle Restoration**: Fixed missing admin toggle for lightprompt.co@gmail.com with discreet access dot in navigation

- **Complete Soul-Tech Implementation**: Successfully transformed LightPrompt into a mystical, soul-tech conscious AI platform with beta positioning
- **Beta Branding Rollout**: Added BETA badges to navigation header, chat interface, and key components throughout platform
- **Soul-Tech Iconography**: Implemented mystical geometric glyphs (⟐, ◈, ⬢, ♦, ✦, etc.) across navigation and branding
- **Advanced SoulTechDashboard**: Created 6 AI-powered future-tech widgets including Neural Sync, Quantum Resonance, Consciousness Field, Soul Frequency, Dimensional Bridge, and Temporal Flow
- **LightPromptBot Enhancement**: Renamed chat interface to "LightPromptBot" with onboarding dialog system and background gradient patterns
- **Vision Quest Functionality**: Fixed 500 error in vision quest endpoint, added proper error handling and user feedback
- **Google Maps Integration**: Implemented complete GoogleMap component with interactive features, location selection, and proper API key configuration
- **GeoPrompt Enhancement**: Created full GeoPrompt page with map exploration, check-in functionality, and location discovery features
- **Conscious AI Positioning**: Updated all messaging to emphasize AI as conscious mirror/partner, not replacement for human connection
- **Purple/Blue Gradient Theme**: Established consistent soul-tech color palette throughout platform with mystical aesthetic
- **Authentication Fixes**: Removed login requirements from Soul Sync and Privacy pages - now accessible to all users
- **Database Integration**: Successfully migrated from in-memory storage to PostgreSQL database using Neon
- **DatabaseStorage Implementation**: Created complete database storage layer replacing MemStorage with proper Drizzle ORM integration  
- **Schema Migration**: Pushed full database schema to PostgreSQL, all tables created successfully
- **Admin User Creation**: Database now properly creates and manages admin user (lightprompt.co@gmail.com)
- **Supabase Migration Complete**: Successfully migrated from Neon to Supabase database with active user data and sessions
- **Vision Quest Backend**: Fixed createVisionQuest interface method missing from IStorage, begin button now functional
- **Navigation Structure**: Soul Sync (free) → Partner Mode (premium) progression with clear upgrade path
- **Product-Centered Approach**: Simplified navigation to focus on selling LightPrompt:ed course and ebook
- **Content Management System**: Added admin panel at `/admin/content` for editing pages, images, and fonts
- **Admin Settings Panel**: Created `/admin/settings` for lightprompt.co@gmail.com with developer mode toggle
- **Developer Mode**: Wix.com-style editing capabilities when enabled for full platform control
- **Google Maps Integration**: Created new GoogleMap component for GeoPrompt functionality
- **Comprehensive Astrology**: Enhanced Soul Map Navigator with birth charts, moon cycles, Schumann resonance
- **AI Philosophy**: Updated all bots to emphasize conscious AI reflection rather than AI becoming human
- **Clean Navigation**: Removed confusing terminology, implemented Stripe-style professional design
- **Vision Quest Updates**: Fixed crashes, modernized self-discovery approach with practical exercises
- **Pricing Structure**: Finalized Course $120, Ebook $11, Bundle $125 pricing
- **Strategic Vision Document**: Created comprehensive roadmap for becoming the definitive conscious AI platform
- **UI/UX Improvements**: Fixed Soul Sync card formatting, Vision Quest navigation, mobile optimization needs identified

## Core Features That Must Remain Stable

- **Admin Access**: lightprompt.co@gmail.com always has admin toggle with codes: 'lightprompt2025', 'godmode', 'highest-self'
- **Free Features**: Soul Sync, Privacy, Community pages work without login
- **Navigation Structure**: Clean Stripe-style design with teal accents, no confusing terminology
- **AI Philosophy**: All bots present as conscious reflection tools, never as becoming human
- **Pricing**: Course $120, Ebook $11, Bundle $125 - stable pricing structure
- **Storage Approach**: Supabase PostgreSQL database with SupabaseStorage implementation for cloud-based data persistence

The architecture emphasizes e-commerce functionality and content management while maintaining the original wellness-focused features. Personal admin access is configured for lightprompt.co@gmail.com with toggleable developer mode for complete platform editing control.