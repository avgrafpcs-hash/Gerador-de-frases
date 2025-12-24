
import { GoogleGenAI, Type } from "@google/genai";
import { Category, GeneratedContent } from "../types";

export const generateContent = async (
  category: Category,
  count: number,
  keyword?: string
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
      text: "ERRO: Chave API não configurada.",
      authorOrSource: "Sistema",
      imageSeed: "error"
    }));
  }

  const ai = new GoogleGenAI({ apiKey });

  let promptContext = "";
  let extraInstructions = "";

  switch (category) {
    case 'religiosa':
      promptContext = "mensagens bíblicas curtas de esperança, fé e gratidão";
      break;
    case 'pensadores':
      promptContext = "frases curtas de impacto sobre sucesso e liderança";
      break;
    case 'filosofos':
      promptContext = "citações curtas profundas e reflexivas de filósofos";
      break;
    case 'frames':
      promptContext = "frases curtas icônicas do cinema e cultura pop";
      break;
    case 'versos':
      promptContext = "poemas curtos ou haicais inspiradores";
      break;
    case 'musicas':
      promptContext = "trechos curtos de músicas famosas.";
      extraInstructions = "Se em Inglês, forneça tradução no campo 'translation'.";
      break;
    case 'piadas':
      promptContext = "piadas curtas e inteligentes";
      break;
    case 'charadas':
      promptContext = "charadas desafiadoras";
      extraInstructions = "Pergunta em 'text', resposta em 'answer'.";
      break;
    case 'matematica':
      promptContext = "desafios matemáticos divertidos ou lógica";
      extraInstructions = "Problema em 'text', resultado em 'answer'.";
      break;
    case 'megasena':
      promptContext = "um jogo da sorte para a Mega-Sena";
      extraInstructions = "Gere 6 números únicos entre 01 e 60. Formate os números com zeros à esquerda (ex: 05, 12, 44) e espaços amplos entre eles. No campo 'authorOrSource', escreva uma frase curta de boa sorte.";
      break;
    case 'quina':
      promptContext = "um jogo da sorte para a Quina";
      extraInstructions = "Gere 5 números únicos entre 01 e 80. Formate os números com zeros à esquerda e espaços. No campo 'authorOrSource', escreva uma frase curta de boa sorte.";
      break;
    case 'lotofacil':
      promptContext = "um jogo da sorte para a Lotofácil";
      extraInstructions = "Gere 15 números únicos entre 01 e 25. Formate os números em 3 linhas de 5 números para caber bem no papel 80mm. No campo 'authorOrSource', escreva uma frase curta de boa sorte.";
      break;
    case 'curiosidades':
      promptContext = "fatos curiosos e interessantes ('Você sabia?')";
      break;
    case 'historinhas':
      promptContext = "historinhas infantis educativas (12 a 20 linhas)";
      break;
    case 'biblico':
      promptContext = "passagens bíblicas motivacionais com reflexão";
      break;
  }

  const keywordPrompt = keyword ? `\nFoque o conteúdo no tema: "${keyword}".` : "";

  const prompt = `
    Você é um especialista em conteúdo para impressoras térmicas 80mm.
    Gere ${count} itens de: ${promptContext}.${keywordPrompt}
    ${extraInstructions}
    
    REGRAS GERAIS:
    1. Texto curto e impacto visual.
    2. 'imageSeed': uma palavra em Inglês para ícone/imagem.
    3. 'authorOrSource': Fonte, Autor ou Desejo de Sorte.
    4. Nunca repita números no mesmo jogo de loteria.
    
    Retorne APENAS JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0,
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
    if (!jsonText) throw new Error("No response");

    const data = JSON.parse(jsonText) as any[];

    return data.map((item, index) => ({
      id: `gen-${Date.now()}-${index}`,
      text: item.text,
      authorOrSource: item.authorOrSource,
      imageSeed: item.imageSeed || 'luck',
      translation: item.translation,
      answer: item.answer
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return Array.from({ length: count }).map((_, i) => ({
      id: `err-${i}`,
      text: "Erro ao gerar números. Tente novamente.",
      authorOrSource: "Erro",
      imageSeed: "error"
    }));
  }
};
