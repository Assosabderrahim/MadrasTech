import { GoogleGenAI } from "@google/genai";
import type { SchoolClass, Student } from '../types';

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

export const generateBookDescription = async (title: string, author: string): Promise<string> => {
    const prompt = `أنت أمين مكتبة خبير. اكتب وصفاً موجزاً وجذاباً (حوالي 3-4 جمل) لكتاب بعنوان '${title}' للمؤلف '${author}'. يجب أن يكون الوصف مناسباً للطلاب ويشجعهم على القراءة.`;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating book description:", error);
        return "لا يمكن إنشاء وصف لهذا الكتاب حالياً.";
    }
};

export const generateBookFirstPage = async (title: string, author: string): Promise<string> => {
    const prompt = `تخيل أنك المؤلف '${author}'. اكتب الصفحة الأولى من كتابك '${title}'. يجب أن تكون البداية مشوقة وتجذب القارئ لمتابعة القصة. اجعلها حوالي 150 كلمة.`;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating book first page:", error);
        return "لا يمكن إنشاء محتوى القراءة لهذا الكتاب حالياً.";
    }
};

export const analyzeSchoolPerformance = async (classes: SchoolClass[]): Promise<string> => {
    // 1. Process data to get key metrics
    const allStudents: Student[] = classes.flatMap(c => c.students);
    const totalStudents = allStudents.length;

    if (totalStudents === 0) {
        return "لا يوجد طلاب لتحليل أدائهم.";
    }

    // Performance Analysis
    const allGrades = allStudents.flatMap(s => s.grades.map(g => g.grade));
    const averageGrade = allGrades.length > 0 ? allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length : 0;
    
    const studentAverages = allStudents.map(student => {
        const totalGrade = student.grades.reduce((sum, g) => sum + g.grade, 0);
        const avg = student.grades.length > 0 ? totalGrade / student.grades.length : 0;
        return { name: student.name, average: avg, attendance: student.attendance };
    }).sort((a, b) => b.average - a.average);

    const topStudents = studentAverages.slice(0, 3);
    const lowPerformingStudents = studentAverages.filter(s => s.average < 10).sort((a,b) => a.average - b.average).slice(0, 3);

    // Attendance Analysis
    const totalAbsences = allStudents.reduce((sum, s) => sum + s.attendance.absent, 0);
    const totalPresences = allStudents.reduce((sum, s) => sum + s.attendance.present, 0);
    const overallAttendanceRate = (totalPresences + totalAbsences) > 0 ? (totalPresences / (totalPresences + totalAbsences)) * 100 : 100;

    const studentsWithHighAbsences = allStudents.filter(s => s.attendance.absent > 10)
                                              .sort((a, b) => b.attendance.absent - a.attendance.absent)
                                              .slice(0, 3);

    // 2. Construct the prompt
    const prompt = `
أنت مستشار تعليمي خبير لمدير مدرسة في المغرب. لقد تم تزويدك بالبيانات التالية حول أداء المدرسة. مهمتك هي تحليل هذه البيانات وتقديم تقرير موجز وتوصيات عملية للمدير.

**ملخص البيانات:**
- إجمالي عدد التلاميذ: ${totalStudents}
- متوسط النقط العام: ${averageGrade.toFixed(2)}/20
- نسبة الحضور الإجمالية: ${overallAttendanceRate.toFixed(2)}%

**أبرز التلاميذ أداءً (أعلى معدل):**
${topStudents.map(s => `- ${s.name} (المعدل: ${s.average.toFixed(2)})`).join('\n')}

**تلاميذ قد يحتاجون لدعم إضافي (أقل معدل):**
${lowPerformingStudents.map(s => `- ${s.name} (المعدل: ${s.average.toFixed(2)})`).join('\n')}

**تلاميذ لديهم غياب مرتفع (أكثر من 10 أيام):**
${studentsWithHighAbsences.map(s => `- ${s.name} (${s.attendance.absent} يوم غياب)`).join('\n')}

**المطلوب منك:**
1.  **تحليل الأداء الدراسي:** قدم ملخصًا عامًا عن المستوى الدراسي للتلاميذ بناءً على البيانات.
2.  **تحليل الحضور والغياب:** علّق على وضع الحضور في المدرسة.
3.  **توصيات للمدير:** قدم 3-4 توصيات عملية ومحددة يمكن للمدير اتخاذها لتحسين الأداء العام ومعالجة المشاكل الملاحظة (مثل دعم التلاميذ المتعثرين أو تحسين نسبة الحضور).
4.  **إدارة الواجهة:** قدم نصيحة موجزة للمدير حول كيفية استخدام لوحة التحكم هذه (مثلاً: "استخدم قسم 'إدارة المستخدمين' لمتابعة حسابات الأساتذة" أو "راجع 'سجل التغييرات' لمراقبة الأنشطة الإدارية").

استخدم لغة واضحة، مهنية، ومنظمة في شكل نقاط مع عناوين بارزة.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for school analysis:", error);
        return "عذراً، حدث خطأ أثناء تحليل البيانات. يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.";
    }
};