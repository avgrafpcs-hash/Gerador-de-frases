export type Category = 
  | 'religiosa' 
  | 'pensadores' 
  | 'filosofos' 
  | 'frames' 
  | 'versos' 
  | 'musicas';

export interface GeneratedContent {
  id: string;
  text: string;
  authorOrSource: string;
  imageSeed: string; // Used to generate a consistent random image
}

export interface AppConfig {
  category: Category | null;
  count: 1 | 2 | 4;
  includeImage: boolean;
  printMode: 'separate' | 'together';
}

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'religiosa', label: 'Religiosa', icon: '🙏' },
  { id: 'pensadores', label: 'Pensadores', icon: '💡' },
  { id: 'filosofos', label: 'Filósofos', icon: '🏛️' },
  { id: 'frames', label: 'Frases Famosas', icon: '🎬' },
  { id: 'versos', label: 'Versos', icon: '📜' },
  { id: 'musicas', label: 'Músicas BR', icon: '🎵' },
];
