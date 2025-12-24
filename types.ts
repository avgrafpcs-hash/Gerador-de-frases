
export type Category = 
  | 'religiosa' 
  | 'pensadores' 
  | 'filosofos' 
  | 'frames' 
  | 'versos' 
  | 'musicas' 
  | 'piadas' 
  | 'charadas' 
  | 'curiosidades'
  | 'historinhas'
  | 'biblico'
  | 'matematica'
  | 'megasena'
  | 'quina'
  | 'lotofacil';

export interface GeneratedContent {
  id: string;
  text: string;
  authorOrSource: string;
  imageSeed: string;
  translation?: string; // For English songs
  answer?: string;      // For Riddles (Charadas)
}

export interface AppConfig {
  category: Category | null;
  count: 1 | 2 | 4;
  includeImage: boolean;
}

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'religiosa', label: 'Religiosa', icon: '✚' },
  { id: 'pensadores', label: 'Pensadores', icon: '✍' },
  { id: 'filosofos', label: 'Filósofos', icon: '⚖' },
  { id: 'frames', label: 'Famosas', icon: '★' },
  { id: 'versos', label: 'Versos', icon: '¶' },
  { id: 'musicas', label: 'Músicas', icon: '♫' },
  { id: 'piadas', label: 'Piadas', icon: '☺' },
  { id: 'charadas', label: 'Charadas', icon: '❔' },
  { id: 'matematica', label: 'Matemática', icon: '🔢' },
  { id: 'megasena', label: 'Mega-Sena', icon: '🍀' },
  { id: 'quina', label: 'Quina', icon: '💰' },
  { id: 'lotofacil', label: 'Lotofácil', icon: '🎲' },
  { id: 'curiosidades', label: 'Curiosidades', icon: '🔎' },
  { id: 'historinhas', label: 'Histórinhas', icon: '🧸' },
  { id: 'biblico', label: 'Palavra de Fé', icon: '📖' },
];
