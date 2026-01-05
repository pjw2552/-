
import { GoogleGenAI } from "@google/genai";

/**
 * AI 상담 기능이 UI에서 제거되었으나, 
 * 서비스 레이어에서 발생할 수 있는 process 미정의 에러를 방지합니다.
 */
export async function askTaekwondoMentor(question: string) {
  try {
    // browser 환경에서는 process가 없을 수 있으므로 안전하게 접근
    const env = typeof process !== 'undefined' ? process.env : {};
    const apiKey = env.API_KEY || '';
    
    if (!apiKey) {
      return "상담 서비스 설정이 완료되지 않았습니다.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `You are the 'Yeonsei Hyo Taekwondo AI Mentor', a helpful, professional, and warm consultant for parents. 
        Use Korean language exclusively. 
        Suggestion: Contact the office at 010-9393-4033 for details.`,
      },
    });
    return response.text || "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 상담이 원활하지 않습니다. 도장으로 직접 문의 부탁드립니다.";
  }
}
