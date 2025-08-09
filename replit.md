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
- **Database**: PostgreSQL configured via Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations with schema defined in shared TypeScript files
- **Storage Strategy**: In-memory storage implementation with interface for easy database integration
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

- **Database**: Supabase (PostgreSQL) for production data storage (currently experiencing connection timeouts)
- **Payments**: Stripe integration for secure course and ebook sales
- **AI Services**: OpenAI API for language model completions, audio transcription, and speech synthesis
- **Maps**: Google Maps API for GeoPrompt location-based features
- **Cloud Storage**: Google Cloud Storage for file uploads and object management with ACL policies
- **File Upload**: Uppy.js for drag-and-drop file upload interfaces with progress tracking
- **UI Framework**: Radix UI component library for accessible, unstyled UI primitives
- **Development Tools**: Replit-specific plugins for development environment integration and error handling

## Recent Changes (August 2025)

- **Product-Centered Approach**: Simplified navigation to focus on selling LightPrompt:ed course and ebook
- **Content Management System**: Added admin panel at `/admin/content` for editing pages, images, and fonts
- **Google Maps Integration**: Created new GoogleMap component for GeoPrompt functionality
- **Database Issues**: Experiencing ETIMEDOUT errors preventing schema migrations (using in-memory storage as fallback)
- **Clean Navigation**: Removed confusing terminology, implemented Stripe-style professional design
- **Pricing Structure**: Finalized Course $120, Ebook $11, Bundle $125 pricing

The architecture emphasizes e-commerce functionality and content management while maintaining the original wellness-focused features. Database connection issues are being worked around with in-memory storage solutions.