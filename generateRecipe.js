const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey:
    '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', // Use environment variable for the API key
});

async function generateRecipe(ingredients) {
  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Ensure this is a valid model name
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant who generates recipes based on the ingredients available.',
          },
          {
            role: 'user',
            content: `I have the following ingredients in my fridge: ${ingredients.join(', ')}. Can you suggest a recipe?`,
          },
        ],
        max_tokens: 600,
      });

      // Log the full response for inspection
      //   console.log('OpenAI Response:', JSON.stringify(response, null, 2));

      // Extract the content from the message object
      if (response.choices && response.choices.length > 0) {
        const messageContent = response.choices[0].message.content;
        console.log('Extracted Recipe:', messageContent); // Log the extracted recipe
        return messageContent.trim();
      } else {
        throw new Error('No choices found in the OpenAI response');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      attempt++;
    }
  }
  throw new Error('Failed to generate recipe after multiple attempts');
}

module.exports = generateRecipe;
