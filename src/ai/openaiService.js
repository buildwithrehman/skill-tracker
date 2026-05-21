export async function generateCompletion(prompt, userApiKey, systemPrompt = "You are a senior engineering mentor.") {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || userApiKey;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is missing. Please add it to your .env file or Settings.');
  }

  const response = await fetch('/api/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo', // Switched to 3.5 for universal access
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
