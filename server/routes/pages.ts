import { Router } from 'express';

const router = Router();

// Real page data from your existing application
const PAGES_DATABASE = [
  {
    id: 'home',
    title: 'LightPrompt - Conscious AI for Human Connection',
    route: '/',
    description: 'Main landing page showcasing LightPrompt\'s soul-tech wellness platform',
    sections: [
      {
        id: 'hero-1',
        type: 'header',
        content: 'LightPrompt',
        styles: { fontSize: '48px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '-webkit-background-clip': 'text', color: 'transparent' }
      },
      {
        id: 'hero-subtitle',
        type: 'text',
        content: 'Conscious AI for Human Reflection & Soul-Tech Wellness',
        styles: { fontSize: '24px', textAlign: 'center', color: '#6b7280', marginBottom: '40px' }
      },
      {
        id: 'main-cta',
        type: 'button',
        content: 'Start Your Journey',
        styles: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '16px 32px', fontSize: '18px', borderRadius: '12px', border: 'none' },
        metadata: { link: '/chat' }
      }
    ],
    globalStyles: {
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }
  },
  {
    id: 'chat',
    title: 'AI Chat - LightPrompt',
    route: '/chat',
    description: 'Main chat interface for interacting with specialized AI bots',
    sections: [
      {
        id: 'chat-header',
        type: 'header',
        content: 'Connect with Your AI Guides',
        styles: { fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }
      },
      {
        id: 'bot-selection',
        type: 'text',
        content: 'Choose from specialized bots: CosmosBot, Soul Map Oracle, Vision Quest Guide, and more',
        styles: { fontSize: '16px', textAlign: 'center', color: '#6b7280', marginBottom: '30px' }
      }
    ],
    globalStyles: { backgroundColor: '#f9fafb' }
  },
  {
    id: 'dashboard',
    title: 'Wellness Dashboard - LightPrompt',
    route: '/dashboard',
    description: 'Personal wellness tracking and soul-tech analytics',
    sections: [
      {
        id: 'dashboard-title',
        type: 'header',
        content: 'Your Wellness Journey',
        styles: { fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }
      },
      {
        id: 'metrics-intro',
        type: 'text',
        content: 'Track your progress across mindfulness, soul alignment, and personal growth metrics',
        styles: { fontSize: '16px', color: '#6b7280', marginBottom: '32px' }
      }
    ],
    globalStyles: { backgroundColor: '#ffffff' }
  },
  {
    id: 'soul-map',
    title: 'Soul Map Explorer - Astrological Insights',
    route: '/soul-map-explorer',
    description: 'Interactive astrological birth chart analysis and cosmic guidance',
    sections: [
      {
        id: 'soul-map-title',
        type: 'header',
        content: 'Soul Map Explorer',
        styles: { fontSize: '42px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', color: '#4c1d95' }
      },
      {
        id: 'astro-subtitle',
        type: 'text',
        content: 'Discover your cosmic blueprint through professional-grade astrological analysis',
        styles: { fontSize: '18px', textAlign: 'center', color: '#6b7280', marginBottom: '40px' }
      },
      {
        id: 'birth-chart-section',
        type: 'text',
        content: 'Generate accurate birth charts, explore planetary positions, and receive personalized insights',
        styles: { fontSize: '16px', color: '#374151', textAlign: 'center' }
      }
    ],
    globalStyles: { backgroundColor: '#faf5ff' }
  },
  {
    id: 'vision-quest',
    title: 'Vision Quest - Personal Growth Journey',
    route: '/vision-quest',
    description: 'Guided journey for self-discovery and personal transformation',
    sections: [
      {
        id: 'vq-title',
        type: 'header',
        content: 'Vision Quest',
        styles: { fontSize: '40px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#059669' }
      },
      {
        id: 'vq-description',
        type: 'text',
        content: 'Embark on a transformative journey of self-discovery through ancient wisdom and modern psychology',
        styles: { fontSize: '18px', textAlign: 'center', color: '#6b7280', marginBottom: '36px' }
      },
      {
        id: 'stages-intro',
        type: 'text',
        content: 'Navigate through carefully designed stages: Preparation, Solitude, Integration, and Return',
        styles: { fontSize: '16px', color: '#374151' }
      }
    ],
    globalStyles: { backgroundColor: '#f0fdf4' }
  },
  {
    id: 'geoprompt',
    title: 'GeoPrompt - Location-Based Mindfulness',
    route: '/geoprompt',
    description: 'Location-aware mindfulness and reflection with Google Maps integration',
    sections: [
      {
        id: 'geo-title',
        type: 'header',
        content: 'GeoPrompt',
        styles: { fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', color: '#2563eb' }
      },
      {
        id: 'geo-subtitle',
        type: 'text',
        content: 'Connect with your environment through location-based mindfulness and reflection',
        styles: { fontSize: '16px', textAlign: 'center', color: '#6b7280', marginBottom: '32px' }
      }
    ],
    globalStyles: { backgroundColor: '#f0f9ff' }
  },
  {
    id: 'plans',
    title: 'Pricing Plans - LightPrompt',
    route: '/plans',
    description: 'Subscription tiers and pricing for LightPrompt features',
    sections: [
      {
        id: 'plans-title',
        type: 'header',
        content: 'Choose Your Path',
        styles: { fontSize: '38px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }
      },
      {
        id: 'plans-subtitle',
        type: 'text',
        content: 'Unlock the full potential of conscious AI and soul-tech wellness',
        styles: { fontSize: '18px', textAlign: 'center', color: '#6b7280', marginBottom: '48px' }
      },
      {
        id: 'free-plan',
        type: 'text',
        content: 'Free Explorer - $0/forever - 5 AI conversations per day, Basic Soul Map access',
        styles: { fontSize: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' }
      },
      {
        id: 'premium-plan',
        type: 'text',
        content: 'Soul Seeker - $29/month - Unlimited conversations, Full Soul Map, Advanced Vision Quest',
        styles: { fontSize: '16px', padding: '16px', border: '2px solid #8b5cf6', borderRadius: '8px', marginBottom: '16px', backgroundColor: '#f3f4f6' }
      }
    ],
    globalStyles: { backgroundColor: '#ffffff' }
  },
  {
    id: 'store',
    title: 'LightPrompt Store - Conscious AI Tools',
    route: '/store',
    description: 'Digital products including courses and ebooks for conscious AI exploration',
    sections: [
      {
        id: 'store-title',
        type: 'header',
        content: 'LightPrompt Store',
        styles: { fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }
      },
      {
        id: 'store-subtitle',
        type: 'text',
        content: 'Explore our curated collection of conscious AI tools, courses, and wisdom resources',
        styles: { fontSize: '16px', textAlign: 'center', color: '#6b7280', marginBottom: '40px' }
      },
      {
        id: 'featured-course',
        type: 'text',
        content: 'Featured: Soul Map & Cosmos Course - $120 - Comprehensive astrological guidance and cosmic wisdom',
        styles: { fontSize: '16px', padding: '20px', border: '2px solid #f59e0b', borderRadius: '12px', backgroundColor: '#fef3c7' }
      }
    ],
    globalStyles: { backgroundColor: '#fffbeb' }
  },
  {
    id: 'community',
    title: 'Community - LightPrompt',
    route: '/community',
    description: 'Connect with like-minded individuals on the conscious AI journey',
    sections: [
      {
        id: 'community-title',
        type: 'header',
        content: 'LightPrompt Community',
        styles: { fontSize: '34px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', color: '#dc2626' }
      },
      {
        id: 'community-description',
        type: 'text',
        content: 'Join discussions, share insights, and connect with others exploring conscious AI and soul-tech wellness',
        styles: { fontSize: '16px', textAlign: 'center', color: '#6b7280', marginBottom: '32px' }
      }
    ],
    globalStyles: { backgroundColor: '#fef2f2' }
  },
  {
    id: 'challenges',
    title: 'Wellness Challenges - LightPrompt',
    route: '/challenges',
    description: 'Participate in guided wellness challenges and track your progress',
    sections: [
      {
        id: 'challenges-title',
        type: 'header',
        content: 'Wellness Challenges',
        styles: { fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#7c3aed' }
      },
      {
        id: 'challenges-intro',
        type: 'text',
        content: 'Transform your daily habits through structured challenges designed for holistic wellness',
        styles: { fontSize: '16px', textAlign: 'center', color: '#6b7280', marginBottom: '32px' }
      }
    ],
    globalStyles: { backgroundColor: '#f5f3ff' }
  },
  {
    id: 'privacy',
    title: 'Privacy Settings - LightPrompt',
    route: '/privacy',
    description: 'Manage your privacy settings and data preferences',
    sections: [
      {
        id: 'privacy-title',
        type: 'header',
        content: 'Privacy & Data Settings',
        styles: { fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }
      },
      {
        id: 'privacy-intro',
        type: 'text',
        content: 'Control your data, privacy preferences, and consent settings for a personalized experience',
        styles: { fontSize: '16px', color: '#6b7280', marginBottom: '32px' }
      }
    ],
    globalStyles: { backgroundColor: '#f9fafb' }
  }
];

// Get all pages
router.get('/pages', (req, res) => {
  res.json(PAGES_DATABASE);
});

// Get single page by ID
router.get('/pages/:id', (req, res) => {
  const page = PAGES_DATABASE.find(p => p.id === req.params.id);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  res.json(page);
});

// Update page
router.put('/pages/:id', (req, res) => {
  const pageIndex = PAGES_DATABASE.findIndex(p => p.id === req.params.id);
  if (pageIndex === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  PAGES_DATABASE[pageIndex] = {
    ...PAGES_DATABASE[pageIndex],
    ...req.body,
    id: req.params.id // Preserve ID
  };
  
  res.json(PAGES_DATABASE[pageIndex]);
});

// Create new page
router.post('/pages', (req, res) => {
  const newPage = {
    id: req.body.id || `page-${Date.now()}`,
    title: req.body.title || 'New Page',
    route: req.body.route || '/new-page',
    description: req.body.description || 'A new page',
    sections: req.body.sections || [],
    globalStyles: req.body.globalStyles || {}
  };
  
  PAGES_DATABASE.push(newPage);
  res.json(newPage);
});

// Delete page
router.delete('/pages/:id', (req, res) => {
  const pageIndex = PAGES_DATABASE.findIndex(p => p.id === req.params.id);
  if (pageIndex === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  PAGES_DATABASE.splice(pageIndex, 1);
  res.json({ message: 'Page deleted successfully' });
});

export default router;