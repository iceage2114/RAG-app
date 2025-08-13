// Add this to your backend server (the one running on localhost:8000)
const OpenAI = require('openai');

// Initialize OpenAI (make sure to install: npm install openai)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add this to your .env file
});

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 150,
      messages: [
        {
          role: 'system',
          content: 'You are an assistant for a website that advises on mechanical and bodywork repairs, and car servicing. Try to answer the user\'s question as best as you can. Be helpful, concise, and focus on practical automotive advice.'
        },
        ...messages
      ],
    });

    res.json({
      response: response.choices[0].message.content,
      messages: messages
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: 'Failed to process chat request',
      message: error.message
    });
  }
});