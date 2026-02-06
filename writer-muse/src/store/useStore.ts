import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note, Topic } from '../types'

interface AppState {
  notes: Note[];
  topics: Topic[];
  apiKey: string | null;
  setApiKey: (key: string) => void;
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      notes: [],
      topics: [],
      apiKey: null,
      setApiKey: (key) => set({ apiKey: key }),
      addNote: (content) => set((state) => ({
        notes: [
          {
            id: crypto.randomUUID(),
            content,
            createdAt: Date.now(),
          },
          ...state.notes,
        ],
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
      })),
      addTopic: (topic) => set((state) => ({
        topics: [topic, ...state.topics],
      })),
      updateTopic: (id, updates) => set((state) => ({
        topics: state.topics.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),
    }),
    {
      name: 'writer-muse-storage',
    }
  )
)
