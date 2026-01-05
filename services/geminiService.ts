
import { GoogleGenAI } from "@google/genai";

export async function askTaekwondoMentor(question: string) {
  try {
    // process 객체가 정의되어 있는지 확인하여 환경 에러 방지
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    
    if (!apiKey) {
      console.warn("API Key is missing");
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
