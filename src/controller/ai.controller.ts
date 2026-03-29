import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from 'express';
import config from '../config';


const getAISuggestions = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    if (!config.gemini_api_key) {
      console.error("CRITICAL: GEMINI_API_KEY is missing in your config/env!");
      return res.status(500).json({ success: false, message: 'Gemini API key is not configured inside the server.' });
    }

    // 1. Initialise Gemini with safety check
    const genAI = new GoogleGenerativeAI(config.gemini_api_key);
    
    // Switch to gemini-1.5-flash as gemini-pro is being deprecated on some v1beta routes
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    console.log("AI prompt received:", prompt);

    // 2. Generate content (Modern approach)
    const result = await model.generateContent(prompt);
    
    // In the latest SDK, result.response.text() is the way to get text
    const aiResponse = result.response.text();

    if (!aiResponse) {
      throw new Error("Gemini returned empty text response");
    }

    // 3. Send back the answer
    res.status(200).json({
      success: true,
      message: "Got AI response successfully.",
      data: aiResponse,
    });
  } catch (err: any) {
    console.error("--- AI ASSISTANT ERROR ---");
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'AI Assistant failed to generate a response.',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

export const aiController = {
  getAISuggestions,
};