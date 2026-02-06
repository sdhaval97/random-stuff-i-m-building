import { useState } from 'react'
import { Settings as SettingsIcon, X, Check } from 'lucide-react'
import { useStore } from '../store/useStore'


export function Settings() {
  const [isOpen, setIsOpen] = useState(false)
  const apiKey = useStore(state => state.apiKey)
  const setApiKey = useStore(state => state.setApiKey)
  const [inputKey, setInputKey] = useState(apiKey || '')
  
  // Seed Data Logic
  const addNote = useStore(state => state.addNote)
  
  const handleSeedData = () => {
    const randomNotes = [
      "The smell of rain on dry earth (Petrichor) always reminds me of childhood summers.",
      "Why do we say 'hang up' the phone even though we tap a button now?",
      "The concept of 'Sonder': realizing everyone has a life as complex as yours.",
      "Idea for a story: A world where sleep is illegal and people buy 'dreams' as drugs.",
      "Tech minimalism vs. feature creep: The struggle of modern software.",
      "Blue light glasses are just rose-colored glasses for the digital age.",
      "What if cats are actually the ones documenting our behavior for an alien zoo?",
      "The silence of snow falling at night is the loudest silence I know.",
      "Coffee shops are just libraries where you're allowed to talk and pay $5 for bean water.",
      "Productivity is often just productive procrastination."
    ]
    
    randomNotes.forEach(note => addNote(note))
    alert('Added 10 random notes for testing!')
    setIsOpen(false)
  }

  const handleSave = () => {
    setApiKey(inputKey)
    setIsOpen(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        title="Settings"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Required for topic generation. stored locally.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Save Settings
              </button>

              <hr className="border-slate-100 my-4" />
              
              <button
                onClick={handleSeedData}
                className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Seed 10 Random Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
