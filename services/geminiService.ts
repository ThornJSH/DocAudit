
import { GoogleGenAI } from "@google/genai";
import { AnalysisMode } from '../types';
import { SYSTEM_PROMPTS } from '../constants';

const API_KEY = process.env.API_KEY;

export const analyzeDocument = async (text: string, mode: AnalysisMode): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const systemInstruction = SYSTEM_PROMPTS[mode];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `다음 문서를 분석해 주세요:\n\n${text}`,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    return response.text || "분석 결과를 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("문서 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};
