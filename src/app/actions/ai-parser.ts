"use server";

import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The expected output schema for the LLM
const expenseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    amount: {
      type: Type.NUMBER,
      description: "The total expense amount. Output as a clean number."
    },
    category: {
      type: Type.STRING,
      description: "Must be exactly one of: MATERIALS, LABOR, TRANSPORT, EQUIPMENT, OTHER",
      enum: ["MATERIALS", "LABOR", "TRANSPORT", "EQUIPMENT", "OTHER"]
    },
    notes: {
      type: Type.STRING,
      description: "A short description of what was purchased or the vendor name. Keep it concise."
    }
  },
  required: ["amount", "category"]
};

export async function parseExpenseFromImage(base64Image: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: "Analyze this receipt/invoice. Extract the total amount, categorize it for a construction site, and provide a short note (like the vendor name)." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: expenseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return { success: true, data: JSON.parse(text) };
  } catch (error: any) {
    console.error("AI Image Parse Error:", error);
    return { success: false, error: error.message || "Failed to parse image" };
  }
}

export async function parseExpenseFromAudio(base64Audio: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64Audio, mimeType } },
            { text: "Listen to this construction site worker recording an expense. Extract the amount, categorize it, and summarize what they bought. CRITICAL: Write the summary (notes) in the EXACT SAME LANGUAGE that the worker is speaking (e.g., if they speak in Tamil, write the notes in Tamil script). CONTEXT: Expect regional construction terminology (e.g. in Tamil: Sengal/செங்கல் = Bricks, Siment/சிமெண்ட் = Cement, Kambi/கம்பி = Steel/Rebar, Manal/மணல் = Sand, Jalli/ஜல்லி = Gravel). Do NOT confuse 'Sengal' with the English word 'Single'." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: expenseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return { success: true, data: JSON.parse(text) };
  } catch (error: any) {
    console.error("AI Audio Parse Error:", error);
    return { success: false, error: error.message || "Failed to parse audio" };
  }
}
