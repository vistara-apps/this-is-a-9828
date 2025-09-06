import { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const useAIPrediction = () => {
  const [loading, setLoading] = useState(false);

  const generatePrediction = async (match) => {
    setLoading(true);
    
    try {
      // If no API key, return mock data
      if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'demo-key') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          prediction: match.aiPrediction,
          confidence: match.aiConfidence,
          reasoning: `Based on recent form analysis, ${match.homeTeam} shows strong attacking capabilities with an average of 2.1 goals per game in their last 5 matches. ${match.awayTeam} has defensive vulnerabilities, conceding 1.4 goals per game away from home. The head-to-head record slightly favors ${match.homeTeam} with 3 wins in the last 5 encounters.`,
          keyFactors: [
            `${match.homeTeam} home advantage (8 wins in last 10 home games)`,
            "Key player availability and recent injury reports",
            "Current league position and momentum",
            "Weather conditions and pitch quality",
            "Historical head-to-head performance"
          ]
        };
      }

      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: "You are an expert football analyst with deep knowledge of team statistics, player performance, and match predictions. Provide detailed, data-driven analysis for football match outcomes."
          },
          {
            role: "user",
            content: `Analyze the upcoming football match between ${match.homeTeam} vs ${match.awayTeam} in ${match.league}. 
            
            Current AI prediction: ${match.aiPrediction} with ${match.aiConfidence}% confidence.
            
            Please provide:
            1. Your prediction for the match outcome
            2. Confidence level (0-100%)
            3. Detailed reasoning (2-3 sentences)
            4. 3-5 key factors influencing the prediction
            
            Format your response as JSON with fields: prediction, confidence, reasoning, keyFactors (array).`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(response);
        return parsed;
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          prediction: match.aiPrediction,
          confidence: match.aiConfidence,
          reasoning: response.slice(0, 200) + "...",
          keyFactors: [
            "Team recent form",
            "Head-to-head record", 
            "Player availability",
            "Home/away advantage"
          ]
        };
      }
    } catch (error) {
      console.error('AI prediction failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { generatePrediction, loading };
};