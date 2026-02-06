export interface Note {
  id: string;
  content: string;
  createdAt: number;
}

export interface Topic {
  id: string;
  title: string;
  sourceNoteIds: string[];
  createdAt: number;
  status: 'new' | 'drafting' | 'completed';
  content?: string; // The draft content
}
