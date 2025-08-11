import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI content generation for the Universal Editor
router.post('/ai/generate-content', async (req, res) => {
  try {
    const { type, context } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured' 
      });
    }

    let prompt = '';
    let maxTokens = 200;

    switch (type) {
      case 'marketing-copy':
        prompt = `Generate compelling marketing copy for a page called "${context.pageName}" with description "${context.pageDescription}". The copy should be engaging, benefit-focused, and persuasive. Make it 2-3 sentences that highlight value proposition.`;
        maxTokens = 150;
        break;

      case 'feature-list':
        prompt = `Generate a list of 4-6 key features for "${context.pageName}" - ${context.pageDescription}. Format as bullet points with brief descriptions. Focus on benefits that would matter to users of a conscious AI and soul-tech wellness platform.`;
        maxTokens = 200;
        break;

      case 'testimonial':
        prompt = `Generate a realistic testimonial for "${context.pageName}" from a satisfied user of a conscious AI and soul-tech wellness platform. Include specific benefits they experienced and make it feel authentic and personal. 2-3 sentences max.`;
        maxTokens = 150;
        break;

      case 'hero-section':
        prompt = `Generate a compelling hero section headline and subheadline for "${context.pageName}". The headline should be punchy and memorable (6-8 words), the subheadline should explain the value (10-15 words). This is for a conscious AI platform focused on human reflection and soul-tech wellness.`;
        maxTokens = 100;
        break;

      case 'call-to-action':
        prompt = `Generate 3 different call-to-action button texts for "${context.pageName}". They should be action-oriented and compelling for users interested in conscious AI and personal growth. Format as a simple list.`;
        maxTokens = 80;
        break;

      default:
        prompt = `Generate relevant content for a "${type}" section on a page called "${context.pageName}". Keep it concise and relevant to conscious AI and soul-tech wellness.`;
        maxTokens = 150;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter and content creator for conscious AI and soul-tech wellness platforms. Your writing is engaging, authentic, and focused on human reflection and personal growth. Avoid overly spiritual or 'woo-woo' language - keep it grounded and accessible."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    });

    const content = response.choices[0].message.content?.trim() || 'Generated content';
    
    // Generate helpful suggestions for the user
    const suggestions = await generateContentSuggestions(type, content);

    res.json({
      content,
      suggestions,
      type,
      metadata: {
        generated: new Date().toISOString(),
        model: 'gpt-4o',
        prompt: prompt.substring(0, 100) + '...'
      }
    });

  } catch (error) {
    console.error('AI content generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
});

// Generate optimization suggestions for content
router.post('/ai/optimize-content', async (req, res) => {
  try {
    const { content, type, goal } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured' 
      });
    }

    const prompt = `Analyze this ${type} content and provide 3 specific suggestions to improve it for ${goal || 'better user engagement'}:

"${content}"

Focus on:
1. Clarity and readability
2. Emotional resonance 
3. Action-oriented language

Provide concrete, actionable suggestions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content optimization expert specializing in conscious AI and wellness platforms. Provide specific, actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.5
    });

    const suggestions = response.choices[0].message.content?.trim() || 'No suggestions generated';

    res.json({
      suggestions: suggestions.split('\n').filter(s => s.trim()),
      originalContent: content,
      optimizedFor: goal || 'user engagement'
    });

  } catch (error) {
    console.error('AI optimization error:', error);
    res.status(500).json({ 
      error: 'Failed to optimize content',
      details: error.message 
    });
  }
});

async function generateContentSuggestions(type: string, content: string): Promise<string[]> {
  const suggestions = {
    'marketing-copy': [
      'Consider adding social proof or statistics',
      'Test different emotional hooks',
      'Experiment with urgency or scarcity elements'
    ],
    'feature-list': [
      'Focus on user benefits over features',
      'Use action-oriented language',
      'Consider grouping related features together'
    ],
    'testimonial': [
      'Include specific metrics or outcomes',
      'Add context about the user\'s background',
      'Consider formatting as a quote with attribution'
    ],
    'hero-section': [
      'Test the headline with different audiences',
      'Consider A/B testing different value propositions',
      'Ensure the subheading supports the main headline'
    ],
    'call-to-action': [
      'Use action verbs to create urgency',
      'Test different color schemes',
      'Consider personalizing based on user segment'
    ]
  };

  return suggestions[type] || [
    'Test different versions with your audience',
    'Monitor engagement metrics',
    'Consider personalizing for different user segments'
  ];
}

export default router;