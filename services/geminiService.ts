import { GoogleGenAI, Type } from "@google/genai";
import { Category, GeneratedContent } from "../types";

export const generateContent = async (
  category: Category,
  count: number
): Promise<GeneratedContent[]> => {
  
  // Robust API Key retrieval to prevent crashes
  const getApiKey = () => {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) return process.env.API_KEY;
    // Check standard Vite/framework env vars if process.env is missing/empty
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.REACT_APP_API_KEY) return import.meta.env.REACT_APP_API_KEY;
    return '';
  };

  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("API Key not found. Configure API_KEY in Vercel environment variables.");
    return Array.from({ length: count }).map((_, i) => ({
      id: `mock-${i}`,
      text: "ERRO: Chave API não configurada. Adicione API_KEY nas variáveis de ambiente do Vercel.",
      authorOrSource: "Sistema",
      imageSeed: "error"
    }));
  }

  const ai = new GoogleGenAI({ apiKey });

  let promptContext = "";
  switch (category) {
    case 'religiosa':
      promptContext = "mensagens bíblicas de esperança, fé e gratidão, ou versículos curtos e poderosos";
      break;
    case 'pensadores':
      promptContext = "frases de impacto sobre sucesso, liderança e vida de grandes pensadores mundiais";
      break;
    case 'filosofos':
      promptContext = "citações profundas e reflexivas de filósofos históricos (ex: Estoicismo, Gregos, Modernos)";
      break;
    case 'frames':
      promptContext = "frases icônicas e inesquecíveis do cinema e da cultura pop";
      break;
    case 'versos':
      promptContext = "poemas curtos, haicais ou versos românticos e inspiradores";
      break;
    case 'musicas':
      promptContext = "trechos emocionantes de músicas brasileiras famosas (MPB, Rock Nacional, Samba)";
      break;
  }

  // Add randomness to the prompt to ensure "unlimited" feeling
  const randomizers = ["raras", "pouco conhecidas", "clássicas", "motivacionais", "reflexivas", "filosóficas"];
  const randomStyle = randomizers[Math.floor(Math.random() * randomizers.length)];

  const prompt = `
    Você é um gerador de conteúdo criativo. Gere ${count} ${promptContext}.
    Estilo desejado: ${randomStyle}.
    IMPORTANTE: Evite frases clichês ou muito repetitivas. Busque variedade.
    O texto deve ser em Português do Brasil.
    Para cada item, forneça:
    1. O texto principal (máximo 200 caracteres para caber no papel).
    2. O autor ou fonte.
    3. Uma palavra-chave EM INGLÊS (imageSeed) que represente a emoção ou tema da frase para gerar uma imagem abstrata.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.2, // High temperature for maximum variety and creativity
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              authorOrSource: { type: Type.STRING },
              imageSeed: { type: Type.STRING }
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
      imageSeed: item.imageSeed || 'abstract'
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return Array.from({ length: count }).map((_, i) => ({
      id: `err-${i}`,
      text: "Ocorreu um erro momentâneo na IA. Por favor, tente novamente em alguns segundos.",
      authorOrSource: "Erro de Conexão",
      imageSeed: "error"
    }));
  }
};