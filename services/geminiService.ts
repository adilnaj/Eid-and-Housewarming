
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getConciergeResponse = async (query: string, eventDetails: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Query: "${query}"\n\nEvent Context: ${JSON.stringify(eventDetails)}. Answer as a high-end, polite concierge. Keep it concise and chic.`,
      config: {
        systemInstruction: "You are the LuxeInvite Virtual Concierge. You are sophisticated, helpful, and speak with a touch of luxury. You assist guests with event-related questions.",
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't process that request. How may I assist you further?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The concierge is momentarily unavailable, but we look forward to seeing you.";
  }
};

export const generateThankYouMessage = async (reservation: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a one-sentence elegant thank you message for ${reservation.name} who is attending with ${reservation.guests} guests.`,
      config: {
        systemInstruction: "You are a world-class hospitality manager. Write short, beautiful, and welcoming thank you notes.",
      }
    });
    return response.text;
  } catch (error) {
    return "Thank you for your reservation. We look forward to welcoming you.";
  }
};
