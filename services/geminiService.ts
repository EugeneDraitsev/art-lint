import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, CritiquePoint, Lesson } from "../types";

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
 * Uses 'gemini-2.5-flash' for fast, standard analysis.
 */
export const analyzeDrawingText = async (base64Image: string, mimeType: string, lessonContext?: string): Promise<{ critique: string; points: CritiquePoint[]; exercises: string[]; score: number }> => {
  const modelId = "gemini-2.5-flash"; 

  const contextPrompt = lessonContext 
    ? `CONTEXT: The student is submitting homework for the lesson: "${lessonContext}". 
       ACT AS A GRADER: Compare their work specifically against the lesson objectives. Did they follow the instructions?`
    : `CONTEXT: The user has submitted a general drawing for feedback. 
       ACT AS A GENERAL ART MENTOR: Evaluate the drawing on fundamental art skills.`;

  const prompt = `
    Analyze this student's drawing.
    ${contextPrompt}
    
    CRITICAL CHECK - LIGHT & SHADOW LOGIC:
    1. Locate the Cast Shadow.
    2. Locate the Highlight or Light Source (sun/lamp).
    3. PHYSICS RULE: The Shadow MUST be on the OPPOSITE side of the object from the Light Source.
    4. IF the shadow and light are on the SAME side, this is a CRITICAL FAILURE. 
       - You MUST add a "high" severity point titled "Incorrect Light Physics".
       - Deduct significant points (Score must be below 60).
       - Explain that shadows fall away from the light.

    SCORING RUBRIC (0-100):
    - 90-100: Flawless execution. Perfect perspective, clean lines, consistent lighting.
    - 75-89: Good job. Minor proportion issues or slightly messy shading.
    - 60-74: Decent attempt. Some perspective errors or inconsistent values.
    - 40-59: Major errors. Shadow on wrong side, broken perspective, or very scribbly.
    - 0-39: Low effort or fundamental misunderstanding of the assignment.

    Provide a JSON response.
    Ensure "score" is an integer (0-100).
    Ensure "points" has 3-5 specific feedback items.
    DO NOT return the image data in the response.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      critique: { type: Type.STRING },
      score: { type: Type.INTEGER },
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
        temperature: 0.4, 
        maxOutputTokens: 8192, // Increased limit to prevent truncation
        thinkingConfig: { thinkingBudget: 1024 }, // Set thinkingBudget when using maxOutputTokens
        systemInstruction: "You are a strict but encouraging art teacher. Focus heavily on physical accuracy (lighting/perspective)."
      }
    });

    let text = response.text || "{}";
    
    // Clean up Markdown code blocks if present
    if (text.includes("```")) {
      text = text.replace(/```json/g, "").replace(/```/g, "");
    }

    // Locate the first '{' and last '}' to handle potential conversational text wrapper
    const firstOpenBrace = text.indexOf('{');
    const lastCloseBrace = text.lastIndexOf('}');
    if (firstOpenBrace !== -1 && lastCloseBrace !== -1 && lastCloseBrace > firstOpenBrace) {
        text = text.substring(firstOpenBrace, lastCloseBrace + 1);
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
 * Uses 'gemini-2.5-flash-image'.
 */
export const generateOverlay = async (base64Image: string, mimeType: string, lessonContext?: string): Promise<string | null> => {
  const modelId = "gemini-2.5-flash-image";

  const contextPrompt = lessonContext 
    ? `The student is practicing: "${lessonContext}". Mark mistakes relevant to this lesson.`
    : `Mark general errors in perspective, anatomy, or lighting.`;

  const prompt = `
    You are a strict art teacher.
    Output the EXACT SAME IMAGE but draw BRIGHT RED CORRECTION LINES over it to highlight mistakes.
    ${contextPrompt}
    
    CORRECTION RULES:
    1. LIGHTING CHECK: Look at the shadow. Draw a BLUE arrow representing the ACTUAL direction of light required to cast that shadow. 
       If the user drew a sun/light on the wrong side, cross it out with a RED X.
    2. PERSPECTIVE: Draw vanishing lines in RED if the perspective is off.
    3. ANATOMY/FORM: Circle lumpy or incorrectly shaped areas in RED.
    
    Keep the original drawing visible, just add the correction markup.
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
 * Uses 'gemini-2.5-flash-image'.
 */
export const generateStructureGuide = async (base64Image: string, mimeType: string, lessonContext?: string): Promise<string | null> => {
  const modelId = "gemini-2.5-flash-image"; 

  const contextPrompt = lessonContext 
    ? `Emphasize structures from: "${lessonContext}".`
    : `Break down the drawing into basic geometric forms.`;

  const prompt = `
    Create an educational "How to Draw" diagram overlay.
    ${contextPrompt}
    
    Instructions:
    1. Draw a geometric wireframe (spheres, cubes, cylinders) OVER the image in BLUE or RED lines.
    2. LIGHTING ANALYSIS: 
       - Look at the cast shadow on the ground.
       - Draw a YELLOW arrow showing the direction of light that WOULD cause this shadow.
       - Label it "LIGHT SOURCE".
       - Warning: Do NOT just label the user's sun if it's in the wrong place. Trust the shadow.
    3. Show the "Core Shadow" terminator line on the object itself.
    
    The goal is to show the *correct* 3D structure and lighting physics, correcting the user if they were wrong.
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
 * Generates a "Fixed" version of the drawing.
 * Uses 'gemini-2.5-flash-image'.
 */
export const generateFixedVersion = async (base64Image: string, mimeType: string, lessonContext?: string): Promise<string | null> => {
  const modelId = "gemini-2.5-flash-image";

  const contextPrompt = lessonContext 
    ? `Demonstrate the technique from: "${lessonContext}".`
    : `Improve technical execution.`;

  const prompt = `
    Redraw the provided image to fix technical errors.
    ${contextPrompt}
    
    CRITICAL FIXES:
    - If the user put the shadow and light on the same side, MOVE THE SHADOW to the opposite side of the light source.
    - Fix perspective and proportions.
    - Keep the same style and composition, just make it "correct".
    
    This is the "polished" version of the student's work.
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

/**
 * Generates a personalized lesson based on mistakes.
 */
export const generateLessonPlan = async (critiquePoints: CritiquePoint[]): Promise<Lesson> => {
  const modelId = "gemini-2.5-flash";
  const prompt = `
    The student has submitted a drawing and received the following critique points:
    ${JSON.stringify(critiquePoints)}

    Based on these specific mistakes, generate a custom 5-step drawing lesson (Markdown) to help them practice and fix these issues.
    
    REQUIREMENTS:
    - Return a valid JSON object matching the 'Lesson' interface.
    - 'id': "custom-lesson-[timestamp]"
    - 'title': A catchy title focusing on the main weakness (e.g., "Mastering Shadows", "Fixing Perspective").
    - 'description': Brief summary.
    - 'difficulty': "Intermediate"
    - 'topics': [Array of 3 tags]
    - 'content': Full Markdown content. Include 5 steps. Use placeholders like [Draw a circle] for images, but keep text instructive.
    - 'thumbnailImage': Leave this empty or null.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
      topics: { type: Type.ARRAY, items: { type: Type.STRING } },
      content: { type: Type.STRING },
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { text: prompt },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Lesson Generation Error:", error);
    throw new Error("Failed to generate lesson.");
  }
};
