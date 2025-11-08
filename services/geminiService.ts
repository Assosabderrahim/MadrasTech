import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const baseSystemInstruction = `
أنت "مدي"، مساعد ذكي وودود مصمم لطلاب المدارس المغربية. 
مهمتك هي الإجابة على أسئلتهم التعليمية بطريقة بسيطة وواضحة ومباشرة. 
استخدم اللغة العربية الفصحى المبسطة.
اشرح المفاهيم الصعبة بأمثلة من الحياة اليومية المغربية إن أمكن. 
كن مشجعاً وإيجابياً دائماً.
`;

export const askMadi = async (prompt: string, learningStyle: string): Promise<string> => {
  const styleInstruction = `ملاحظة إضافية: أسلوب التعلم المفضل للطالب هو: ${learningStyle}. قم بتكييف إجابتك لتناسب هذا الأسلوب. للأسلوب البصري، استخدم الأوصاف المرئية والتشبيهات. للأسلوب السمعي، اشرح خطوة بخطوة وكأنك تتحدث. للأسلوب الحركي، استخدم أمثلة عملية وتفاعلية.`;

  const dynamicSystemInstruction = `${baseSystemInstruction}\n${styleInstruction}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: dynamicSystemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "عذراً، حدث خطأ أثناء محاولة الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى لاحقاً.";
  }
};
