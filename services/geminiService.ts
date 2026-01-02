
import { GoogleGenAI, Type } from "@google/genai";
import { Crashout, WrappedStats, CrashCategory } from "../types";

// Get API key from Vite environment variables
const GOOGLE_AI_KEY = import.meta.env.VITE_GOOGLE_AI_KEY || '';
const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_KEY });

// Local fallback responses
const getLocalFallbackResponse = (category: string) => {
  const fallbackQuotes: Record<string, string> = {
    'Academics': 'The library is closed, but the tears are forever.',
    'Love Life': 'It\'s giving "situationship" energy.',
    'Annoying People': 'The audacity is actually impressive.',
    'Family': 'Family drama? Groundbreaking.',
    'Stress / Overthinking': 'Brain is currently buffering...',
    'Silly / Random': 'The chaos is unmatched, honestly.',
    'Other': 'The vibes are... not vibing.'
  };

  return {
    funnyQuote: fallbackQuotes[category] || 'The chaos is off the charts.',
    dramaLevel: Math.floor(Math.random() * 10) + 1
  };
};

export const getAIFeedback = async (description: string, category: string): Promise<{ funnyQuote: string, dramaLevel: number }> => {
  // If no API key is set, return a local fallback response
  if (!GOOGLE_AI_KEY) {
    console.warn('No Google AI API key found. Using fallback response.');
    return getLocalFallbackResponse(category);
  }

  try {
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The user just logged a crashout in the category "${category}".
    Description: "${description}"
    
    Your job as the "CRASHOUT Brain" is to:
    1. Provide a funny, Gen-Z friendly, slightly dramatic quote about this situation. (e.g. "It's giving main character syndrome")
    2. Rate the drama level from 1 to 10.
    
    Rules:
    - Keep it fun and chaotic. 
    - No medical or mental health advice.
    - Max 10 words for the quote.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          funnyQuote: { type: Type.STRING },
          dramaLevel: { type: Type.NUMBER }
        },
        required: ["funnyQuote", "dramaLevel"]
      }
    }
  });

    try {
      const data = JSON.parse(response.text || '{}');
      return {
        funnyQuote: data.funnyQuote || 'The chaos is palpable.',
        dramaLevel: typeof data.dramaLevel === 'number' ? Math.min(10, Math.max(1, data.dramaLevel)) : 5
      };
    } catch (e) {
      console.error('Error parsing AI response:', e);
      return getLocalFallbackResponse(category);
    }
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    return getLocalFallbackResponse(category);
  }
};

export const generateWrapped = async (history: Crashout[]): Promise<WrappedStats> => {
  const total = history.length;
  const categoryCounts = history.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat as CrashCategory);

  const topCategory = sortedCategories[0] || 'Other';
  const secondTopCategory = sortedCategories[1] || 'Silly / Random';

  const dayCounts = history.reduce((acc, curr) => {
    const day = new Date(curr.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostActiveDay = Object.entries(dayCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown Day';

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a CRASHOUT Wrapped summary for this user data:
    - Total crashouts this month: ${total}
    - Top category: ${topCategory}
    - Second top category: ${secondTopCategory}
    - Most active crashout day: ${mostActiveDay}

    Rules:
    - Tone: Fun, slightly dramatic, short sentences, Gen-Z style.
    - Format as JSON with: headline, statLines, closingLine, and chaosScore.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          statLines: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          closingLine: { type: Type.STRING },
          chaosScore: { type: Type.NUMBER }
        },
        required: ["headline", "statLines", "closingLine", "chaosScore"]
      }
    }
  });

  try {
    const aiData = JSON.parse(response.text || '{}');
    return {
      totalCrashouts: total,
      topCategory,
      secondTopCategory,
      mostActiveDay,
      chaosScore: aiData.chaosScore || 88,
      headline: aiData.headline,
      statLines: aiData.statLines,
      closingLine: aiData.closingLine
    };
  } catch (e) {
    return {
      totalCrashouts: total,
      topCategory,
      secondTopCategory,
      mostActiveDay,
      chaosScore: 99,
      headline: "You really did that, huh?",
      statLines: [`${total} total moments of pure chaos.`],
      closingLine: "Your aura is actually terrifying right now."
    };
  }
};
