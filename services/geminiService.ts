import { GoogleGenAI, Type } from "@google/genai";
import { Category, GeneratedContent } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';

export const generateContent = async (
  category: Category,
  count: number
): Promise<GeneratedContent[]> => {
  if (!apiKey) {
    console.error("API Key is missing");
    // Return mock data if no API key to prevent crash during dev without env
    return Array.from({ length: count }).map((_, i) => ({
      id: `mock-${i}`,
      text: "Erro: Configure a API Key no arquivo .env para gerar conteúdo real.",
      authorOrSource: "Sistema",
      imageSeed: "error"
    }));
  }

  const ai = new GoogleGenAI({ apiKey });

  let promptContext = "";
  switch (category) {
    case 'religiosa':
      promptContext = "mensagens curtas religiosas ou versículos bíblicos inspiradores";
      break;
    case 'pensadores':
      promptContext = "frases curtas e impactantes de grandes pensadores mundiais";
      break;
    case 'filosofos':
      promptContext = "citações profundas de filósofos famosos (ex: Sócrates, Platão, Nietzsche)";
      break;
    case 'frames':
      promptContext = "frases icônicas de filmes ou cultura pop";
      break;
    case 'versos':
      promptContext = "pequenos poemas ou versos românticos/inspiradores";
      break;
    case 'musicas':
      promptContext = "trechos marcantes de letras de músicas populares brasileiras (MPB, Rock, Samba)";
      break;
  }

  const prompt = `
    Gere ${count} ${promptContext}.
    O texto deve ser em Português do Brasil.
    Para cada item, forneça o texto principal, o autor/fonte, e uma palavra-chave (seed) em inglês para buscar uma imagem abstrata relacionada.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              authorOrSource: { type: Type.STRING },
              imageSeed: { type: Type.STRING, description: "A single english keyword for image generation (e.g. 'peace', 'sun', 'thought')" }
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
      text: "Ocorreu um erro ao conectar com a IA. Tente novamente.",
      authorOrSource: "Sistema",
      imageSeed: "error"
    }));
  }
};
