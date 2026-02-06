import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useStore } from '../store/useStore'
import { cn } from '../lib/utils'

export function WritingPage() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const topics = useStore((state) => state.topics)
  const notes = useStore((state) => state.notes)
  const updateTopic = useStore((state) => state.updateTopic)
  
  const topic = topics.find((t) => t.id === topicId)
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    if (topic?.content) {
      setContent(topic.content)
    }
  }, [topic])

  if (!topic) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Topic not found.</p>
        <button onClick={() => navigate('/topics')} className="text-indigo-600 hover:underline mt-2">
          Back to Topics
        </button>
      </div>
    )
  }

  const handleSave = () => {
    updateTopic(topic.id, { 
      content,
      status: content.trim() ? 'drafting' : 'new'
    })
  }

  // Auto-save every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (content !== topic.content) {
        handleSave()
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [content, topic.content])

  const relevantNotes = notes.filter(n => topic.sourceNoteIds.includes(n.id))

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="h-16 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/topics')} className="text-slate-400 hover:text-slate-600">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-slate-700 max-w-[200px] truncate">{topic.title}</h2>
            <span className="text-[10px] text-slate-400 capitalize">{topic.status}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className={cn(
              "p-2 rounded-lg text-sm font-medium transition-colors",
              isPreview ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button 
            onClick={handleSave}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
            title="Save"
          >
            <Save size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Helper Panel (Notes) - Hidden on mobile if focus is writing, usually toggleable or stacked. 
            For MVP, let's make it a collapsible sidebar or just show at top/bottom. 
            Actually, let's keep it simple: Split view on desktop, Tabs/Toggle on mobile?
            Let's do a simple split for now, robust enough.
        */}
        <div className="w-80 border-r border-slate-200 bg-white overflow-y-auto hidden md:block p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Inspiration Sources</h3>
          <div className="space-y-4">
            {relevantNotes.map(note => (
              <div key={note.id} className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">
                {note.content}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
           {/* Mobile Notes Toggle could go here */}
           
           {isPreview ? (
             <div className="flex-1 overflow-y-auto p-8 prose prose-slate max-w-3xl mx-auto">
               <ReactMarkdown>{content}</ReactMarkdown>
             </div>
           ) : (
             <textarea
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="Start writing..."
               className="flex-1 w-full h-full p-8 resize-none focus:outline-none text-lg text-slate-800 leading-relaxed font-serif"
             />
           )}
        </div>
      </div>
    </div>
  )
}
