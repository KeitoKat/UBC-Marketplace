const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * POST /gpt-suggest
 * Request body: {images}
 * Response: {suggestedName}
 * Description: Use GPT to suggest a name for an item
 * If no images are provided, return an 400 error
 * If the images are provided, use GPT to generate a name
 */
router.post('/', async (req, res) => {
  const { images } = req.body;

  try {
    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "In two words, what’s in this image?. Don't include a period at the end",
            },
            { type: 'image_url', image_url: { url: images[0] } },
          ],
        },
      ],
      max_tokens: 300,
    });

    const suggestedName = response.choices[0].message.content;
    res.json({ suggestedName });
  } catch (error) {
    console.error('Error fetching GPT name suggestion:', error);
    res.status(500).json({ message: 'Failed to fetch suggestion' });
  }
});

module.exports = router;
