require('dotenv').config();

const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for the API key
});

async function detectLabels(path) {
  try {
    // Ensure the image exists

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'List the ingridens on the fridge in a arrey',
            },
            {
              type: 'image_url',
              image_url: {
                url: path,
              },
            },
          ],
        },
      ],
    });
    const final_message = response.choices[0].message.content;

    // Find the indices of the '[' and ']' characters
    const startIndex = final_message.indexOf('[') + 1;
    const endIndex = final_message.indexOf(']');

    // Extract the substring between the brackets
    const extractedText = final_message.substring(startIndex, endIndex);

    const itemsArray = extractedText
      .split(/",\s*\n?/)
      .map((item) => item.replace(/("|"$)/g, ''));

    return itemsArray;
  } catch (error) {
    console.error('Error in detectLabels:', error.message);
    throw new Error('Error processing the image');
  }
}

module.exports = detectLabels;
