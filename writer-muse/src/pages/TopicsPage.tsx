import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, CheckCircle2, Clock } from 'lucide-react'
import { useStore } from '../store/useStore'


export function TopicsPage() {
  const topics = useStore((state) => state.topics)
  const notes = useStore((state) => state.notes)
  const navigate = useNavigate()

  // Helper to find note content by ID (could be optimized)
  const getNoteExcerpt = (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    return note ? note.content.substring(0, 60) + '...' : ''
  }

  return (
    <div className="min-h-full pb-20">
      <header className="pt-12 pb-6 px-6">
        <h1 className="text-3xl font-serif text-slate-900 tracking-tight">
          Topics
          <span className="text-indigo-600">.</span>
        </h1>
        <p className="text-slate-500 mt-2">Ready to be written.</p>
      </header>

      <div className="px-4 mt-4 space-y-4 max-w-md mx-auto">
        {topics.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="inline-flex items-center justify-center p-4 bg-slate-50 rounded-full mb-4">
              <FileText size={32} className="text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-medium mb-1">No topics yet</h3>
            <p className="text-slate-500 text-sm">
              Capture some notes and generate topics to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                onClick={() => navigate(`/write/${topic.id}`)}
                className="group bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-indigo-100 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">
                    {topic.title}
                  </h3>
                  {topic.status === 'completed' ? (
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  ) : topic.status === 'drafting' ? (
                    <Clock size={18} className="text-amber-500 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {topic.sourceNoteIds.slice(0, 3).map(id => {
                    const excerpt = getNoteExcerpt(id)
                    if (!excerpt) return null
                    return (
                      <span key={id} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100 truncate max-w-[120px]">
                        {excerpt}
                      </span>
                    )
                  })}
                </div>
                
                <div className="mt-4 flex items-center text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Writing <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
