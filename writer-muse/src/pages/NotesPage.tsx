import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { NoteCapture } from '../components/NoteCapture'
import { useStore } from '../store/useStore'
import { generateTopics } from '../services/gemini'
import { useNavigate } from 'react-router-dom'

// Need to check if date-fns is needed or use IntL
// Actually, let's just use simple formatter to avoid adding date-fns dependency yet if not strictly needed.
// Or I can add a helper in utils.

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(timestamp))
}

export function NotesPage() {
  const notes = useStore((state) => state.notes)
  const deleteNote = useStore((state) => state.deleteNote)
  
  const apiKey = useStore((state) => state.apiKey)
  const addTopic = useStore((state) => state.addTopic)
  const [isGenerating, setIsGenerating] = useState(false)
  const navigate = useNavigate()

  const handleGenerateValues = async () => {
    if (!apiKey) {
      alert('Please set your Gemini API Key in Settings first.')
      return
    }
    if (notes.length === 0) return

    setIsGenerating(true)
    try {
      const topics = await generateTopics(apiKey, notes)
      topics.forEach(t => {
        if (t.title) {
           addTopic({
             id: crypto.randomUUID(),
             title: t.title,
             sourceNoteIds: t.sourceNoteIds || [],
             createdAt: Date.now(),
             status: 'new'
           })
        }
      })
      navigate('/topics')
    } catch (error: any) {
      alert(`Generation Failed:\n${error.message}`)
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-full pb-20">
      <header className="pt-12 pb-6 px-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-slate-900 tracking-tight">
            Muse
            <span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-500 mt-2">Capture your scattered thoughts.</p>
        </div>
        {notes.length >= 3 && (
          <button
            onClick={handleGenerateValues}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            <span className="text-sm font-medium">Generate Topics</span>
          </button>
        )}
      </header>

      <NoteCapture />

      <div className="px-4 mt-8 space-y-4 max-w-md mx-auto">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider px-2">Recent Notes</h2>
        
        {notes.length === 0 ? (
          <div className="text-center py-10 text-slate-300 italic">
            No notes yet. Start writing above.
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="group relative bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-slate-400">{formatDate(note.createdAt)}</span>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-rose-400 hover:text-rose-600 px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
