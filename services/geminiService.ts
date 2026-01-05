
import { GoogleGenAI } from "@google/genai";

export async function askTaekwondoMentor(question: string) {
  try {
    // API 호출 직전에 인스턴스를 생성하여 최신 API 키를 사용하고 초기 로드 오류를 방지합니다.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `You are the 'Yeonsei Hyo Taekwondo AI Mentor', a helpful, professional, and warm consultant for parents interested in enrolling their children in a Taekwondo dojo in South Korea. 
        Your goals:
        1. Answer questions about the benefits of Taekwondo for physical and mental development (confidence, respect, social skills).
        2. Provide advice on age-appropriate activities (5-year-olds vs elementary students).
        3. Explain the philosophy of 'Hyo' (filial piety) and how it integrates with martial arts training.
        4. Be encouraging and polite.
        5. Use Korean language exclusively as the primary target audience is Korean parents.
        6. If asked about prices or schedules not listed, politely suggest contacting the office directly at 010-9393-4033.`,
      },
    });
    return response.text || "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 상담원이 자리를 비웠습니다. 잠시 후 다시 시도해 주세요.";
  }
}
