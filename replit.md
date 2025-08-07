# LightPrompt - Soul-Tech Wellness AI Platform

## Overview

LightPrompt is a privacy-first, multi-bot AI platform for soul-tech wellness. The application provides users with AI companions for emotional reflection, body awareness, and spiritual growth through conversational interfaces. The core platform features a main reflection bot (LightPromptBot) with additional specialized bots for wellness tracking, progress visualization, and inner training exercises.

The application is built as a full-stack TypeScript application with a React frontend and Express backend, designed to provide real-time emotional tone analysis, voice interactions, and personalized AI responses based on user sentiment and conversation patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

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

- **Database**: Neon Database (PostgreSQL) via `@neondatabase/serverless` for production data storage
- **AI Services**: OpenAI API for language model completions, audio transcription, and speech synthesis
- **Cloud Storage**: Google Cloud Storage for file uploads and object management with ACL policies
- **File Upload**: Uppy.js for drag-and-drop file upload interfaces with progress tracking
- **UI Framework**: Radix UI component library for accessible, unstyled UI primitives
- **Development Tools**: Replit-specific plugins for development environment integration and error handling

The architecture emphasizes modularity and type safety throughout the stack, with shared TypeScript schemas ensuring consistency between frontend and backend. The design supports real-time interactions while maintaining clean separation between data persistence, business logic, and presentation layers.