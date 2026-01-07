import { GoogleGenAI } from "@google/genai";

/**
 * AI 상담원 기능 (백엔드 서비스 레이어)
 * process.env.API_KEY를 사용하여 보안을 유지하며 AI 인스턴스를 생성합니다.
 */
export async function askTaekwondoMentor(question: string) {
  try {
    // API 키는 반드시 process.env.API_KEY에서만 가져와야 함
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: "당신은 '연세효 태권도 AI 멘토'입니다. 학부모님들께 친절하고 전문적으로 태권도 교육의 가치를 설명해주세요. 한국어로만 답변하며, 자세한 상담은 010-9393-4033으로 안내하세요.",
      },
    });

    // .text property를 직접 참조하여 결과 반환
    return response.text || "죄송합니다. 답변을 생성하지 못했습니다.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "현재 상담이 폭주 중입니다. 잠시 후 다시 시도하시거나 도장으로 직접 전화 문의 부탁드립니다.";
  }
}
