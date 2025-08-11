import { Router } from 'express';

const router = Router();

// Content database - This represents all the actual content from your site
const CONTENT_DATABASE = {
  metadata: {
    siteName: 'LightPrompt',
    tagline: 'Conscious AI for Human Reflection & Soul-Tech Wellness',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  navigation: {
    mainMenu: [
      { label: 'Home', path: '/', active: true },
      { label: 'Chat', path: '/chat', active: true },
      { label: 'Soul Map', path: '/soul-map-explorer', active: true },
      { label: 'Vision Quest', path: '/vision-quest', active: true },
      { label: 'Store', path: '/store', active: true },
      { label: 'Community', path: '/community', active: true },
      { label: 'Dashboard', path: '/dashboard', active: true }
    ],
    footerLinks: [
      { label: 'Privacy', path: '/privacy' },
      { label: 'Help', path: '/help' },
      { label: 'Admin', path: '/admin' }
    ]
  },

  bots: [
    {
      id: 'cosmosbot',
      name: 'CosmosBot',
      description: 'Your cosmic guide for astrological insights and universal wisdom',
      systemPrompt: 'You are CosmosBot, a wise astrological guide with deep knowledge of cosmic patterns...',
      active: true
    },
    {
      id: 'soul-oracle',
      name: 'Soul Map Oracle', 
      description: 'Expert astrologer specializing in birth chart analysis and soul purpose',
      systemPrompt: 'You are the Soul Map Oracle, a master astrologer with expertise in Western astrology...',
      active: true
    },
    {
      id: 'vision-guide',
      name: 'Vision Quest Guide',
      description: 'Guide for personal transformation and self-discovery journeys',
      systemPrompt: 'You are a Vision Quest Guide, helping users navigate transformative journeys...',
      active: true
    }
  ],

  products: [
    {
      id: 'soul-map-course',
      name: 'Soul Map & Cosmos',
      price: 120,
      description: 'Comprehensive course in astrological self-discovery and cosmic alignment',
      features: ['Full birth chart analysis', 'Planetary transit guidance', 'Career path insights', 'Relationship compatibility'],
      type: 'course',
      active: true
    },
    {
      id: 'lightprompt-ebook',
      name: 'LightPrompted: The Human Guide to Conscious AI & Soul Tech',
      price: 11,
      description: 'Essential guide to conscious AI integration and soul-tech wellness',
      features: ['AI consciousness framework', 'Soul-tech practices', 'Ethical AI guidelines', 'Personal integration tools'],
      type: 'ebook', 
      active: true
    },
    {
      id: 'bundle',
      name: 'Complete Soul-Tech Bundle',
      price: 125,
      originalPrice: 131,
      description: 'Everything you need for conscious AI and soul-tech mastery',
      features: ['Soul Map & Cosmos course', 'LightPrompted ebook', 'Bonus meditation guides', 'Community access'],
      type: 'bundle',
      active: true
    }
  ],

  features: {
    'soul-map': {
      title: 'Soul Map Explorer',
      description: 'Professional-grade astrological birth chart analysis with career guidance',
      benefits: ['Accurate planetary positions', 'Traditional astrological wisdom', 'Career path recommendations', 'VibeMatch compatibility scoring']
    },
    'vision-quest': {
      title: 'Vision Quest Journey',
      description: 'Transformative self-discovery through ancient wisdom and modern psychology',
      stages: ['Preparation', 'Solitude', 'Integration', 'Return'],
      benefits: ['Personal growth tracking', 'Guided meditation practices', 'Reflection exercises', 'Community support']
    },
    'geoprompt': {
      title: 'GeoPrompt Check-ins',
      description: 'Location-based mindfulness and environmental connection',
      benefits: ['Google Maps integration', 'Location-aware reflections', 'Environmental mindfulness', 'Geographic insights']
    }
  },

  settings: {
    ai: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2000,
      systemInstructions: 'You are a conscious AI assistant focused on human reflection and growth'
    },
    privacy: {
      dataRetention: '90 days',
      analyticsEnabled: false,
      voiceDataStorage: true,
      conversationHistory: true
    },
    ui: {
      theme: 'auto', // light, dark, auto
      circadianMode: true,
      animationsEnabled: true,
      compactMode: false
    }
  }
};

// Get all content
router.get('/content', (req, res) => {
  res.json(CONTENT_DATABASE);
});

// Get specific content section
router.get('/content/:section', (req, res) => {
  const section = CONTENT_DATABASE[req.params.section];
  if (!section) {
    return res.status(404).json({ error: 'Content section not found' });
  }
  res.json(section);
});

// Update content section
router.put('/content/:section', (req, res) => {
  if (!CONTENT_DATABASE[req.params.section]) {
    return res.status(404).json({ error: 'Content section not found' });
  }
  
  CONTENT_DATABASE[req.params.section] = {
    ...CONTENT_DATABASE[req.params.section],
    ...req.body
  };
  
  res.json(CONTENT_DATABASE[req.params.section]);
});

// Update specific content item
router.put('/content/:section/:itemId', (req, res) => {
  const section = CONTENT_DATABASE[req.params.section];
  if (!section) {
    return res.status(404).json({ error: 'Content section not found' });
  }
  
  if (Array.isArray(section)) {
    const itemIndex = section.findIndex(item => item.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Content item not found' });
    }
    
    section[itemIndex] = {
      ...section[itemIndex],
      ...req.body,
      id: req.params.itemId // Preserve ID
    };
    
    res.json(section[itemIndex]);
  } else {
    // Handle object-based sections
    if (section[req.params.itemId]) {
      section[req.params.itemId] = {
        ...section[req.params.itemId],
        ...req.body
      };
      res.json(section[req.params.itemId]);
    } else {
      res.status(404).json({ error: 'Content item not found' });
    }
  }
});

export default router;