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
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: "You are a strict construction site expense analyzer. Analyze this receipt/invoice. Extract the total amount, categorize it for a construction site, and provide a short note (like the vendor name). EVERYTHING must be interpreted strictly in the context of construction." }
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
    
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return { success: true, data: JSON.parse(cleanText) };
  } catch (error: any) {
    console.error("AI Image Parse Error:", error);
    return { success: false, error: error.message || "Failed to parse image" };
  }
}

export async function parseExpenseFromAudio(base64Audio: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64Audio, mimeType: mimeType.split(';')[0] } },
            { text: "You are a strict construction expense parser. Listen to this construction site worker recording an expense. Extract the amount, categorize it, and summarize what they bought. CRITICAL INSTRUCTION: EVERYTHING they say MUST be interpreted strictly in the context of CONSTRUCTION (e.g. tools, materials, labor, machinery, transport, site expenses). Do not interpret any word as a non-construction item. Write the summary (notes) in the EXACT SAME LANGUAGE that the worker is speaking (e.g., if they speak in Tamil, write the notes in Tamil script). CONTEXT: Expect regional construction terminology (e.g. in Tamil: Sengal/செங்கல் = Bricks, Siment/சிமெண்ட் = Cement, Kambi/கம்பி = Steel/Rebar, Manal/மணல் = Sand, 'man' or 'm-sand' = M-Sand/Sand, Jalli/ஜல்லி = Gravel, Kooli/கூலி = Labor). Do NOT confuse 'Sengal' with the English word 'Single', or 'man'/'manal' with the English word 'man'." }
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
    
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return { success: true, data: JSON.parse(cleanText) };
  } catch (error: any) {
    console.error("AI Audio Parse Error:", error);
    return { success: false, error: error.message || "Failed to parse audio" };
  }
}

const multipleExpensesSchema: Schema = {
  type: Type.OBJECT,
  description: "A wrapper containing a list of expenses.",
  properties: {
    expenses: {
      type: Type.ARRAY,
      description: "A list of expenses extracted from the audio.",
      items: {
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
      }
    }
  },
  required: ["expenses"]
};

export async function parseMultipleExpensesFromAudio(base64Audio: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64Audio, mimeType: mimeType.split(';')[0] } },
            { text: "You are a strict construction expense parser. Listen to this construction site worker recording multiple expenses at once. Extract all the expenses mentioned. For each expense, extract the amount, categorize it, and provide a short note. CRITICAL INSTRUCTION: EVERYTHING they say MUST be interpreted strictly in the context of CONSTRUCTION (e.g. tools, materials, labor, machinery, transport). Do not interpret any word as a non-construction item. Write the notes in the EXACT SAME LANGUAGE that the worker is speaking (e.g., if they speak in Tamil, write the notes in Tamil script). Understand regional construction terminology (e.g. in Tamil: Sengal/செங்கல் = Bricks, Siment/சிமெண்ட் = Cement, Kambi/கம்பி = Steel/Rebar, Manal/மணல் = Sand, 'man' or 'm-sand' = M-Sand/Sand, Jalli/ஜல்லி = Gravel, Kooli/கூலி = Labor). Do NOT confuse 'Sengal' with 'Single', or 'man'/'manal' with the English word 'man'. Return an array of expenses." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: multipleExpensesSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e: any) {
      return { success: false, error: "Failed to parse AI response: " + cleanText.substring(0, 50) };
    }
    
    // In case the AI still returned a raw array despite the object schema
    const finalData = Array.isArray(parsed) ? parsed : (parsed.expenses || []);
    
    return { success: true, data: finalData };
  } catch (error: any) {
    console.error("AI Audio Parse Error (Multiple):", error);
    return { success: false, error: "AI Error: " + (error.message || "Unknown error") };
  }
}
