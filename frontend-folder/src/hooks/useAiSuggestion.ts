import { useState } from 'react'

export interface AiSuggestion {
  title: string
  description: string
  tags: string[]
}

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const getApiKey = () =>
  (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_GEMINI_API_KEY

export function useAiSuggestion() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const suggest = async (userInput: string): Promise<AiSuggestion | null> => {
    const apiKey = getApiKey()
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      setError('Gemini API key not configured.')
      return null
    }

    if (!userInput.trim()) {
      setError('Type a brief description of your ad first.')
      return null
    }

    setLoading(true)
    setError('')

    const prompt = `You are an expert advertising copywriter. A user wants to create an ad on a platform called Banner.co where businesses advertise to earn views and engagement.

The user's rough idea: "${userInput}"

Generate compelling ad copy in JSON format with exactly these fields:
- title: A punchy, attention-grabbing headline (max 80 characters)
- description: A persuasive description that drives action (max 180 characters)  
- tags: An array of exactly 5 relevant lowercase tags (single words or short phrases, no # symbol)

Respond with ONLY valid JSON, no markdown, no explanation. Example format:
{"title":"...","description":"...","tags":["tag1","tag2","tag3","tag4","tag5"]}`

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
          },
        }),
      })

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status}`)
      }

      const data = await res.json() as {
        candidates: Array<{
          content: { parts: Array<{ text: string }> }
        }>
      }

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      // Strip any accidental markdown code fences
      const cleaned = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned) as AiSuggestion

      return {
        title: String(parsed.title ?? '').slice(0, 100),
        description: String(parsed.description ?? '').slice(0, 200),
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.slice(0, 5).map((t) => String(t).toLowerCase().replace(/^#/, '').trim())
          : [],
      }
    } catch {
      setError('AI suggestion failed. Try again or write it yourself.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { suggest, loading, error, clearError: () => setError('') }
}
