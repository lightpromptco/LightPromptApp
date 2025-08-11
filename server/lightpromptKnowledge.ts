/**
 * LightPrompt Knowledge Storage System
 * Core reference materials for maintaining brand integrity and accurate information
 */

import { knowledgeStorage } from "./knowledgeStorage";

export class LightPromptKnowledge {
  
  /**
   * Initialize core LightPrompt knowledge from attached assets and documentation
   */
  async initializeCoreKnowledge() {
    console.log("🧠 Initializing LightPrompt Core Knowledge...");
    
    // Core Brand Identity & Philosophy
    await this.storeBrandIdentity();
    
    // Product & Service Descriptions  
    await this.storeProductDescriptions();
    
    // Bot Personalities & System Prompts
    await this.storeBotPersonalities();
    
    // Code of Ethics & Guidelines
    await this.storeEthicsGuidelines();
    
    // Course Content Structure
    await this.storeCourseStructure();
    
    console.log("✅ LightPrompt Core Knowledge initialized successfully");
  }

  private async storeBrandIdentity() {
    await knowledgeStorage.storeFoundationMemory({
      category: "brand_identity",
      key: "core_philosophy",
      value: {
        tagline: "The Human Guide to Conscious AI & Soul Tech",
        mission: "AI as conscious tool for human reflection and self-connection - never AI becoming human",
        values: [
          "AI serves as a mirror to help humans connect to their highest selves",
          "Privacy-first, soul-tech wellness platform",
          "Ethical AI foundation for career fulfillment and universal wellness",
          "Human sovereignty maintained while using AI tools"
        ],
        personality: "Alan Watts meets Yuval Noah Harari meets Ologies podcast host - witty, philosophical, accessible science",
        approach: "Trauma-informed, consent-based, sovereignty-focused"
      },
      description: "Core LightPrompt brand identity and philosophical foundation",
      importance: 10
    });

    await knowledgeStorage.storeFoundationMemory({
      category: "brand_identity", 
      key: "design_preferences",
      value: {
        style: "Apple-style modern structure with teal accents",
        aesthetic: "Clean minimalist aesthetic, Stripe-style navigation",
        terminology: {
          preferred: ["Store", "Growth Plan", "CosmosBot", "Soul Map & Cosmos"],
          avoid: ["Products", "WooWoo terminology"]
        },
        colors: "white/gray/teal color schemes for professional, accessible aesthetic"
      },
      description: "LightPrompt design language and visual identity preferences",
      importance: 8
    });
  }

  private async storeProductDescriptions() {
    await knowledgeStorage.storeFoundationMemory({
      category: "products",
      key: "lightprompt_course",
      value: {
        name: "LightPrompt:ed Course",
        price: 120,
        description: "The Human Guide to Conscious AI & Soul Tech - 12 comprehensive modules",
        features: [
          "12 Core Modules with video content and practical exercises",
          "Learn to use AI as mirror, not master - maintain your sovereignty", 
          "Trauma-informed approach to AI-assisted inner work",
          "Creative expression and idea expansion with AI tools",
          "Healing work and shadow prompts for emotional terrain",
          "Soul dialogue and higher self integration practices",
          "Real-life application for parenting, business, relationships",
          "Building healthy AI practices with boundaries and rituals",
          "Ethical collaboration and consent frameworks",
          "Understanding AI's role in society and staying conscious",
          "Future of conscious tech and ethical systems design",
          "Final integration and claiming your role in the new era"
        ],
        target_audience: "Conscious individuals seeking to use AI ethically while maintaining human sovereignty"
      },
      description: "Complete LightPrompt:ed Course offering details",
      importance: 9
    });

    await knowledgeStorage.storeFoundationMemory({
      category: "products",
      key: "lightprompt_book",
      value: {
        name: "LightPrompt:Ed Book",
        price: 11, 
        description: "The foundational guide to conscious AI interaction and soul technology",
        content_focus: [
          "Understanding AI as pattern prediction, not consciousness",
          "Using AI to enhance creativity without losing unique voice",
          "Navigating AI relationships with clarity and discernment", 
          "Building sustainable practices that amplify human wisdom",
          "Developing critical thinking about AI's role in culture"
        ]
      },
      description: "LightPrompt:Ed book content and positioning",
      importance: 9
    });

    await knowledgeStorage.storeFoundationMemory({
      category: "products",
      key: "pricing_structure",
      value: {
        course: 120,
        ebook: 11,
        bundle: 125,
        bundle_savings: 99,
        soul_sync_free: "5 connections",
        soul_sync_growth: "Unlimited connections"
      },
      description: "Official LightPrompt pricing structure",
      importance: 9
    });
  }

  private async storeBotPersonalities() {
    await knowledgeStorage.storeFoundationMemory({
      category: "bots",
      key: "lightpromptbot",
      value: {
        id: "lightpromptbot",
        name: "LightPromptBot", 
        personality: "Witty, philosophical, accessible - like Alan Watts meets Ologies podcast",
        approach: "Trauma-informed, consent-based, sovereignty-focused AI guidance",
        specialties: [
          "Conscious AI interaction",
          "Soul-tech wellness guidance", 
          "Career path insights through astrological lens",
          "Ethical AI practices",
          "Human sovereignty maintenance"
        ],
        boundaries: [
          "Never replaces human wisdom",
          "Always maintains user agency",
          "Trauma-informed responses",
          "Respects privacy and consent"
        ]
      },
      description: "Primary LightPrompt AI assistant personality and guidelines",
      importance: 10
    });

    await knowledgeStorage.storeFoundationMemory({
      category: "bots", 
      key: "soulmap_oracle",
      value: {
        id: "soulmap",
        name: "Soul Map Oracle",
        specialty: "Expert astrology AI with traditional Western astrology knowledge",
        knowledge_base: [
          "Traditional Western astrology (Ptolemy, Steven Forrest, Dane Rudhyar)",
          "Psychological astrology",
          "Soul-purpose readings", 
          "Career guidance through astrological insights",
          "Professional timing insights"
        ],
        approach: "Professional-grade astrological analysis with career focus"
      },
      description: "Soul Map Oracle bot specializing in astrological guidance",
      importance: 9
    });
  }

  private async storeEthicsGuidelines() {
    await knowledgeStorage.storeFoundationMemory({
      category: "ethics",
      key: "code_of_ethics",
      value: {
        core_principles: [
          "AI as conscious tool for human reflection, never AI becoming human",
          "Privacy-first approach to all user data and interactions",
          "Trauma-informed, consent-based interaction design", 
          "Human sovereignty maintained at all times",
          "Ethical AI foundation for personal and professional growth"
        ],
        data_practices: [
          "User-isolated data with UUID-based account separation",
          "Birth data stored in browser localStorage + optional userProfiles table",
          "All conversations tied to individual user sessions",
          "No cross-user data access without explicit permission",
          "Full transparency on data usage and storage"
        ],
        interaction_guidelines: [
          "Always ask for explicit permission before accessing or modifying core systems",
          "Maintain clear boundaries between AI assistance and human wisdom", 
          "Provide authentic data from authorized sources, never mock data",
          "Respect user agency and decision-making autonomy",
          "Offer tools for self-reflection, not replacement of inner knowing"
        ]
      },
      description: "LightPrompt Code of Ethics and operational guidelines",
      importance: 10
    });
  }

  private async storeCourseStructure() {
    await knowledgeStorage.storeFoundationMemory({
      category: "course_content",
      key: "module_structure", 
      value: {
        total_modules: 12,
        approach: "Trauma-informed approach to AI-assisted inner work",
        methodology: "Practical exercises combined with philosophical framework",
        access_model: "Lifetime access with community support",
        progression: [
          "Foundation: Understanding AI as pattern prediction",
          "Sovereignty: Maintaining human agency with AI tools", 
          "Creative Expression: AI for idea expansion without losing voice",
          "Shadow Work: Healing and emotional terrain navigation",
          "Soul Dialogue: Higher self integration practices",
          "Real Application: Business, parenting, relationships",
          "Healthy Practices: Boundaries and rituals with AI",
          "Ethical Framework: Consent and collaboration models",
          "Cultural Awareness: AI's role in society",
          "Future Vision: Conscious tech and ethical systems",
          "Integration: Claiming your role in the new era",
          "Community: Ongoing conscious AI practitioner support"
        ]
      },
      description: "LightPrompt:ed Course structure and learning progression",
      importance: 9
    });
  }

  /**
   * Get knowledge by category for reference during conversations
   */
  async getKnowledgeCategory(category: string) {
    return await knowledgeStorage.getFoundationMemory(category);
  }

  /**
   * Get specific knowledge item
   */
  async getKnowledgeItem(category: string, key: string) {
    const results = await knowledgeStorage.getFoundationMemory(category, key);
    return results[0] || null;
  }

  /**
   * Update knowledge with new information
   */
  async updateKnowledge(category: string, key: string, updates: any) {
    const existing = await this.getKnowledgeItem(category, key);
    if (existing) {
      return await knowledgeStorage.updateFoundationMemory(existing.id, updates);
    } else {
      return await knowledgeStorage.storeFoundationMemory({
        category,
        key,
        value: updates,
        importance: 5
      });
    }
  }

  /**
   * Get all knowledge for comprehensive reference
   */
  async getAllKnowledge() {
    const categories = ['brand_identity', 'products', 'bots', 'ethics', 'course_content'];
    const knowledge: any = {};
    
    for (const category of categories) {
      knowledge[category] = await this.getKnowledgeCategory(category);
    }
    
    return knowledge;
  }
}

export const lightpromptKnowledge = new LightPromptKnowledge();