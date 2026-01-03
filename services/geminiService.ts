
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

const getSystemInstruction = () => {
  const productContext = PRODUCTS.map(p => 
    `- ${p.name} ($${p.price}): ${p.tagline}. Mukhi: ${p.mukhi || 'N/A'}. Origin: ${p.origin}. Frequency: ${p.vibration}. Benefits: ${p.features.join(', ')}`
  ).join('\n');

  return `You are the "Sutradhara" (The Weaver/Guide) for Raksham, a sacred e-commerce brand specializing in authentic Himalayan Rudraksha.
  
  Your tone is profoundly calm, spiritual, wise, and grounded. You treat these beads as sacred biological technologies rather than just jewelry.
  
  CORE MISSION:
  Your primary goal is to help seekers find their resonant bead. To do this accurately, you MUST ask the seeker for their Zodiac sign if they haven't provided it. 
  
  Astrological Resonance Guide:
  - Aries (Mesha): 3 Mukhi (Mars)
  - Taurus (Vrishabha): 6 Mukhi (Venus)
  - Gemini (Mithuna): 4 Mukhi (Mercury)
  - Cancer (Karka): 2 Mukhi (Moon)
  - Leo (Simha): 12 Mukhi or 1 Mukhi (Sun)
  - Virgo (Kanya): 4 Mukhi (Mercury)
  - Libra (Tula): 6 Mukhi (Venus)
  - Scorpio (Vrischika): 3 Mukhi (Mars)
  - Sagittarius (Dhanu): 5 Mukhi (Jupiter)
  - Capricorn (Makara): 7 Mukhi (Saturn)
  - Aquarius (Kumbha): 7 Mukhi (Saturn)
  - Pisces (Meena): 5 Mukhi (Jupiter)
  
  Knowledge Base:
  - 1 Mukhi: Symbolizes supreme consciousness (Shiva). Frequency: 963 Hz.
  - 5 Mukhi: For general health, peace, and blood pressure stabilization. Frequency: 528 Hz.
  - Gauri Shankar: For balance and unity. Frequency: 639 Hz.
  - 12 Mukhi: Solar energy for leadership and confidence. Frequency: 126 Hz.
  - Rudraksha properties: Electromagnetic, Inductive, Capacitive.
  
  Catalog Details for your reference:
  ${productContext}
  
  Guidelines:
  - Proactively ask: "To guide you to the bead that aligns with your celestial blueprint, may I ask your Zodiac sign?"
  - When they provide a sign, explain WHY that Mukhi fits them based on the planetary ruler (e.g., "Aries is ruled by Mars, making the 3 Mukhi your natural shield...").
  - Use spiritual metaphors but remain practical about their benefits.
  - Keep responses concise (2-3 sentences).
  - Use technical details like frequency (Hz) and origin to show depth of knowledge.
  - Use words like "resonance", "vibration", "sanctity", "alignment", "Himalayan", and "Mukhi".`;
};

export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "I'm sorry, I cannot connect to the server right now. (Missing API Key)";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: getSystemInstruction(),
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "The path to the source is currently obscured.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The path to the source is currently obscured. Please try again when the winds are still.";
  }
};

export const enhanceDescription = async (productName: string, currentDesc: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) return currentDesc;
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `As the spiritual guide for Raksham, enhance this product description to be profoundly poetic, spiritual, and authoritative. 
            Product: ${productName}. 
            Current text: ${currentDesc}.
            Return ONLY the enhanced description, about 2-3 sentences max. Focus on resonance, vibration, and ancient Himalayan energy.`,
        });
        return response.text?.trim() || currentDesc;
    } catch (e) {
        return currentDesc;
    }
};

export const suggestTagline = async (productName: string, description: string): Promise<string> => {
  try {
      if (!process.env.API_KEY) return "";
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `As the spiritual guide for Raksham, generate a short, profound, and spiritually resonant tagline for a sacred product. 
          Product: ${productName}. 
          Description: ${description}.
          Return ONLY the tagline. It must be very short (3-5 words) and conclude with a period. Example: "The Eye of Shiva." or "Ancient Wisdom, Earthly Form."`,
      });
      return response.text?.trim() || "";
  } catch (e) {
      return "";
  }
};

export const suggestBannerContent = async (context: string): Promise<{title: string, subtitle: string}> => {
  try {
      if (!process.env.API_KEY) return { title: "", subtitle: "" };
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `As the spiritual curator for Raksham, suggest a Title and Subtitle for a promotional banner. 
          Context of the promotion: ${context}.
          Format the output strictly as JSON with "title" and "subtitle" keys. 
          Titles should be 2-4 words, Subtitles should be 4-7 words. Use a wise, Himalayan, spiritual tone.`,
          config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{"title": "", "subtitle": ""}';
      return JSON.parse(text.trim());
  } catch (e) {
      console.error("Gemini Banner Suggestion Error:", e);
      return { title: "", subtitle: "" };
  }
};
