import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Note, Topic } from '../types'

export async function generateTopics(apiKey: string, notes: Note[]): Promise<Partial<Topic>[]> {
  const genAI = new GoogleGenerativeAI(apiKey)
  // Using gemini-1.5-flash-001 as it's a stable version tag
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' })

  if (notes.length === 0) return []

  // Prepare context from notes
  const notesText = notes
    .slice(0, 50) // Limit to recent 50 notes to avoid huge context, or use all if small
    .map(n => `- [${n.content}] (ID: ${n.id})`)
    .join('\n')

  const prompt = `
  You are a creative muse for a writer. Analyze the following raw notes and generate 5 compelling topic ideas for blog posts or tweets.
  
  Notes:
  ${notesText}
  
  Output MUST be a valid JSON array of objects with the following structure:
  [
    {
      "title": "Topic Title",
      "sourceNoteIds": ["id1", "id2"] // IDs of notes that inspired this.
    }
  ]
  
  Do not include markdown formatting like \`\`\`json. Just the raw JSON array.
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Simple cleanup if model adds markdown blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()
    
    const parsed = JSON.parse(cleanText) as Array<{ title: string, sourceNoteIds: string[] }>
    
    return parsed.map(t => ({
      ...t,
      createdAt: Date.now(),
      status: 'new'
    }))
  } catch (error: any) {
    console.error('Error generating topics:', error)
    const errorMessage = error?.message || 'Unknown error'
    throw new Error(`Gemini API Error: ${errorMessage}`)
  }
}
