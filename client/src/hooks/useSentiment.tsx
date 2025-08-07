import { useState, useCallback } from 'react';

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
}

export function useSentiment() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSentiment = useCallback(async (text: string): Promise<SentimentResult> => {
    setIsAnalyzing(true);
    
    try {
      // Simple client-side sentiment analysis as fallback
      const positiveWords = ['happy', 'good', 'great', 'amazing', 'wonderful', 'love', 'excited', 'grateful', 'joy', 'peaceful'];
      const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'overwhelmed', 'anxious', 'worried'];
      
      const words = text.toLowerCase().split(/\W+/);
      let score = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) score += 10;
        if (negativeWords.includes(word)) score -= 10;
      });
      
      // Normalize score to -100 to 100 range
      score = Math.max(-100, Math.min(100, score));
      
      const sentiment: SentimentResult['sentiment'] = 
        score > 20 ? 'positive' : 
        score < -20 ? 'negative' : 
        'neutral';
      
      return { sentiment, score };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analyzeSentiment, isAnalyzing };
}
