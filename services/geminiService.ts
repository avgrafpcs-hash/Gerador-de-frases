
import { GoogleGenAI, Type } from "@google/genai";
import { Category, GeneratedContent } from "../types";

export const generateContent = async (
  category: Category,
  count: number,
  keyword?: string
): Promise<GeneratedContent[]> => {
  
  const apiKey = process.env.API_KEY;

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

  // Lógica Especial para GIBI (Geração de Imagem)
  if (category === 'gibi') {
    const results: GeneratedContent[] = [];
    
    // O prompt de imagem utiliza a palavra-chave se fornecida
    const temaDesejado = keyword || "um dia engraçado na vida de um gato";
    
    const imagePrompt = `
      Crie uma história em quadrinhos (gibi) curta baseada no seguinte TEMA: ${temaDesejado}.

      Regras obrigatórias:
      - Estilo cartoon extremamente simples
      - Traços pretos grossos e bem definidos
      - Alto contraste (preto no branco)
      - Sem sombras, sem degradê, sem cinza
      - Sem texturas
      - Fundo totalmente branco
      - Personagens com poucos detalhes (olhos simples, boca em traço)
      - Cenários mínimos ou vazios
      - Desenho legível mesmo em baixa resolução

      Formato da história:
      - 4 quadros verticais organizados em uma única coluna
      - Um quadro abaixo do outro
      - Cada quadro com borda preta grossa
      - Apenas 1 personagem principal
      - Ações claras e exageradas

      Texto:
      - Balões grandes e simples
      - Frases curtas (máximo 5 palavras) em Português
      - Fonte simples e grossa
      - Texto sempre em preto

      Composição:
      - Quadros centralizados
      - Personagem ocupando a maior parte do quadro
      - Muito espaço em branco
      
      IMPORTANTE: A saída deve ser APENAS uma imagem em preto e branco puro.
    `;

    try {
      // Geramos um por um baseado no count solicitado
      for (let i = 0; i < count; i++) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: imagePrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "9:16"
            }
          }
        });

        let imageUrl = "";
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }

        results.push({
          id: `gibi-${Date.now()}-${i}`,
          text: "", // O texto está dentro da imagem
          authorOrSource: `Gibi IA: ${temaDesejado}`,
          imageSeed: "comic",
          imageUrl: imageUrl
        });
      }
      return results;
    } catch (error) {
      console.error("Erro na geração de Gibi:", error);
      return [{ id: 'err', text: "Erro ao gerar Gibi.", authorOrSource: "Sistema", imageSeed: "error" }];
    }
  }

  // Lógica para categorias de Texto (Original)
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
      promptContext = "frases curtas icônicas do cinema";
      break;
    case 'versos':
      promptContext = "poemas curtos ou haicais";
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
      promptContext = "desafios matemáticos ou lógica";
      extraInstructions = "Problema em 'text', resultado em 'answer'.";
      break;
    case 'megasena':
      promptContext = "jogo da sorte Mega-Sena (6 num 01-60)";
      break;
    case 'quina':
      promptContext = "jogo da sorte Quina (5 num 01-80)";
      break;
    case 'lotofacil':
      promptContext = "jogo da sorte Lotofácil (15 num 01-25)";
      break;
    case 'curiosidades':
      promptContext = "fatos curiosos ('Você sabia?')";
      break;
    case 'historinhas':
      promptContext = "historinhas infantis educativas";
      break;
    case 'biblico':
      promptContext = "passagens bíblicas com reflexão";
      break;
  }

  const keywordPrompt = keyword ? `\nFoque o conteúdo no tema: "${keyword}".` : "";

  const prompt = `
    Gere ${count} itens de: ${promptContext}.${keywordPrompt}
    ${extraInstructions}
    Retorne APENAS JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    return [{ id: 'err', text: "Erro ao gerar conteúdo.", authorOrSource: "Erro", imageSeed: "error" }];
  }
};
