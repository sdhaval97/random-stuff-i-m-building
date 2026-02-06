import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cn } from '../lib/utils'

export function NoteCapture() {
  const [content, setContent] = useState('')
  const addNote = useStore(state => state.addNote)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!content.trim()) return
    
    addNote(content)
    setContent('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [content])

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Capture a thought..."
          className="w-full min-h-[120px] p-4 pr-12 text-lg bg-white rounded-2xl shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100/50 focus:border-indigo-200 resize-none transition-all placeholder:text-slate-300"
        />
        
        <button
          onClick={() => handleSubmit()}
          disabled={!content.trim()}
          className={cn(
            "absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200",
            content.trim() 
              ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:scale-105" 
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
          )}
        >
          <Send size={18} className={content.trim() ? "translate-x-0.5" : ""} />
        </button>
      </div>
    </div>
  )
}
