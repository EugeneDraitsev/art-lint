import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, CritiquePoint } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to convert a file to a Base64 string suitable for the API.
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes the drawing for critique (Text only).
 */
export const analyzeDrawingText = async (base64Image: string, mimeType: string, lessonContext?: string): Promise<{ critique: string; points: CritiquePoint[]; exercises: string[] }> => {
  const modelId = "gemini-2.5-flash"; // Optimized for text/multimodal analysis

  const contextPrompt = lessonContext 
    ? `CONTEXT: The student is submitting homework for the lesson: "${lessonContext}". Evaluate them specifically on how well they applied the concepts of this lesson.`
    : '';

  const prompt = `
    Analyze this student's drawing strictly. 
    ${contextPrompt}
    
    Focus on:
    1. Perspective (vanishing points, horizon line, depth)
    2. Anatomy and Proportions (if applicable)
    3. Line Quality (confidence, weight)
    4. Light and Shadow (values, light source consistency)

    Provide a JSON response.
    Ensure "critique" is a concise paragraph (under 100 words).
    Ensure "points" has 3-5 specific feedback items.
    Ensure "exercises" lists 3 actionable practice tasks.
    DO NOT return the image data in the response.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      critique: { type: Type.STRING },
      points: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
          }
        }
      },
      exercises: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more analytical/structured output
        maxOutputTokens: 2000,
        systemInstruction: "You are a world-class art teacher. Output strictly valid JSON. Do not use Markdown code blocks. Keep responses concise and focused on art improvement."
      }
    });

    let text = response.text || "{}";
    
    // Robust cleanup for markdown code blocks (e.g. ```json ... ```)
    if (text.includes("```")) {
      text = text.replace(/```json/g, "").replace(/```/g, "");
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis Error:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Received malformed analysis from Gemini. Please try again.");
    }
    throw error;
  }
};

/**
 * Generates the "Teacher Overlay" - Original image with red correction lines.
 */
export const generateOverlay = async (base64Image: string, mimeType: string, lessonContext?: string): Promise<string | null> => {
  const modelId = "gemini-2.5-flash-image";

  const contextPrompt = lessonContext 
    ? `The student is practicing: "${lessonContext}". Mark mistakes relevant to this lesson.`
    : '';

  const prompt = `
    You are a strict art teacher grading a student's homework.
    Output the EXACT SAME IMAGE but draw BRIGHT RED CORRECTION LINES over it to highlight mistakes.
    ${contextPrompt}
    1. Draw perspective lines (vanishing points) in RED if the perspective is off.
    2. Circle anatomical errors in RED.
    3. Draw arrows indicating where light should be coming from if shading is wrong.
    DO NOT change the style, composition, or content of the drawing. Just add the red teacher's markings on top.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Overlay Generation Error:", error);
    return null;
  }
};

/**
 * Generates a "Structure Guide" - Breakdown of geometric shapes.
 */
export const generateStructureGuide = async (base64Image: string, mimeType: string, lessonContext?: string): Promise<string | null> => {
  const modelId = "gemini-2.5-flash-image"; 

  const contextPrompt = lessonContext 
    ? `Emphasize the specific structures taught in: "${lessonContext}".`
    : '';

  const prompt = `
    Create an educational "How to Draw" diagram overlay for this image.
    ${contextPrompt}
    
    Instructions:
    1. Analyze the subjects in the image.
    2. Draw a geometric wireframe (construction lines) OVER the original image to show how it is built.
    3. Use simple 3D shapes: spheres for heads/joints, cylinders for limbs, cubes for boxes.
    4. Use BRIGHT BLUE or RED lines for the wireframe so it stands out against the original drawing.
    5. The goal is to teach the student the underlying 3D structure of their drawing.
    
    Output the image with the wireframe overlay.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Structure Guide Generation Error:", error);
    return null;
  }
};


/**
 * Generates a "Fixed" version of the drawing (Image to Image).
 */
export const generateFixedVersion = async (base64Image: string, mimeType: string, lessonContext?: string): Promise<string | null> => {
  const modelId = "gemini-2.5-flash-image";

  const contextPrompt = lessonContext 
    ? `Ensure the fixed version perfectly demonstrates the technique from: "${lessonContext}".`
    : '';

  const prompt = `
    Act as a master artist.
    Redraw the provided image to fix technical errors.
    ${contextPrompt}
    
    Instructions:
    1. Fix perspective issues.
    2. Fix anatomical proportion errors.
    3. Keep the EXACT same style, character, and composition. Do not change the subject.
    4. This should look like the "polished" version of the student's sketch.
    
    Output the fixed image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};