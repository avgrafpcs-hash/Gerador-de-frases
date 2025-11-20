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
    return Array.from({ length: count }).map((_, i) => ({
      id: `mock-${i}`,
      text: "Erro: Configure a API Key no painel da Vercel (Environment Variables) para ativar a IA.",
      authorOrSource: "Sistema",
      imageSeed: "error"
    }));
  }

  const ai = new GoogleGenAI({ apiKey });

  let promptContext = "";
  switch (category) {
    case 'religiosa':
      promptContext = "versículos bíblicos de conforto, salmos de gratidão ou frases curtas de fé e esperança";
      break;
    case 'pensadores':
      promptContext = "frases impactantes de grandes pensadores, cientistas ou líderes mundiais (ex: Einstein, Gandhi, Churchill)";
      break;
    case 'filosofos':
      promptContext = "citações profundas e reflexivas da filosofia clássica e moderna (ex: Estoicismo, Sócrates, Nietzsche)";
      break;
    case 'frames':
      promptContext = "frases icônicas e inesquecíveis de grandes filmes do cinema e cultura pop";
      break;
    case 'versos':
      promptContext = "poemas curtos, haicais ou versos literários sobre amor, vida e resiliência";
      break;
    case 'musicas':
      promptContext = "trechos emocionantes de letras de músicas brasileiras (MPB, Rock Nacional, Samba, Bossa Nova)";
      break;
  }

  const prompt = `
    Atue como um curador criativo para impressões térmicas de "Mensagens do Dia".
    Gere ${count} itens ÚNICOS e VARIADOS sobre: ${promptContext}.
    
    DIRETRIZES:
    1. Idioma: Português do Brasil.
    2. Tamanho: O texto deve ser curto e impactante para caber em papel 80mm (máximo 2-3 frases curtas).
    3. Variedade: Evite repetir as frases mais óbvias. Busque pérolas escondidas e inspiradoras.
    4. Imagem: Para cada frase, forneça uma palavra-chave em INGLÊS (imageSeed) que represente a emoção abstrata da frase (ex: 'hope', 'mountain', 'coffee', 'rain').
    
    Retorne APENAS o JSON puro.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.1, // High temperature for more randomness and "unlimited" variety
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              authorOrSource: { type: Type.STRING },
              imageSeed: { type: Type.STRING, description: "English keyword for image generation" }
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
      text: "O tráfego está alto ou houve um erro na conexão. Tente novamente em instantes.",
      authorOrSource: "Sistema",
      imageSeed: "error"
    }));
  }
};