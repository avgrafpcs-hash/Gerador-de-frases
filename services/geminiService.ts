import { GoogleGenAI, Type } from "@google/genai";
import { Category, GeneratedContent } from "../types";

export const generateContent = async (
  category: Category,
  count: number
): Promise<GeneratedContent[]> => {
  
  const getApiKey = () => {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) return process.env.API_KEY;
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.REACT_APP_API_KEY) return import.meta.env.REACT_APP_API_KEY;
    return '';
  };

  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("API Key not found.");
    return Array.from({ length: count }).map((_, i) => ({
      id: `mock-${i}`,
      text: "ERRO: Chave API não configurada. Adicione VITE_API_KEY nas variáveis de ambiente.",
      authorOrSource: "Sistema",
      imageSeed: "error"
    }));
  }

  const ai = new GoogleGenAI({ apiKey });

  let promptContext = "";
  let extraInstructions = "";

  switch (category) {
    case 'religiosa':
      promptContext = "mensagens bíblicas de esperança, fé e gratidão";
      break;
    case 'pensadores':
      promptContext = "frases de impacto sobre sucesso e liderança";
      break;
    case 'filosofos':
      promptContext = "citações profundas e reflexivas de filósofos";
      break;
    case 'frames':
      promptContext = "frases icônicas do cinema e cultura pop";
      break;
    case 'versos':
      promptContext = "poemas curtos ou haicais inspiradores";
      break;
    case 'musicas':
      promptContext = "trechos de músicas famosas (Nacionais ou Internacionais Clássicas).";
      extraInstructions = "Se a música for em Inglês, VOCÊ DEVE fornecer a tradução reduzida no campo 'translation'. Se for em português, deixe 'translation' vazio.";
      break;
    case 'piadas':
      promptContext = "piadas curtas e inteligentes (sem conteúdo ofensivo)";
      break;
    case 'charadas':
      promptContext = "charadas ou 'o que é o que é' desafiadoras";
      extraInstructions = "Coloque a pergunta no campo 'text' e a resposta curta no campo 'answer'.";
      break;
    case 'curiosidades':
      promptContext = "fatos curiosos e interessantes sobre o mundo ('Você sabia?')";
      break;
  }

  const prompt = `
    Gere ${count} itens de: ${promptContext}.
    ${extraInstructions}
    
    REGRAS:
    1. Texto principal curto (max 180 caracteres).
    2. Variedade total (não repita temas).
    3. 'imageSeed': uma palavra-chave em Inglês para gerar imagem.
    4. 'authorOrSource': Autor, Banda ou Fonte.
    
    Retorne APENAS JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              authorOrSource: { type: Type.STRING },
              imageSeed: { type: Type.STRING },
              translation: { type: Type.STRING, nullable: true },
              answer: { type: Type.STRING, nullable: true }
            },
            required: ["text", "authorOrSource", "imageSeed"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const data = JSON.parse(jsonText) as any[];

    return data.map((item, index) => ({
      id: `gen-${Date.now()}-${index}`,
      text: item.text,
      authorOrSource: item.authorOrSource,
      imageSeed: item.imageSeed || 'abstract',
      translation: item.translation,
      answer: item.answer
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return Array.from({ length: count }).map((_, i) => ({
      id: `err-${i}`,
      text: "Erro ao conectar com a IA. Tente novamente.",
      authorOrSource: "Erro",
      imageSeed: "error"
    }));
  }
};