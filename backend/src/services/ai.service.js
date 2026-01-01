import { model } from '../config/gemini.js';
import { SYSTEM_INSTRUCTION } from './kb.service.js';

export const generateAIResponse = async (history, userMessage) => {
  try {
    // 1. Format history for Gemini (Role: 'user' | 'model')
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // 2. Ensure history starts with user (Gemini requirement)
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    // 3. Inject System Instruction via a Chat Session starts
    // (Note: gemini-1.5-flash supports systemInstruction in config, 
    // but for simple chat, prepending to history is often more stable)
    
    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("AI Service Error:", error);
    return "I'm having trouble processing that right now.";
  }
};