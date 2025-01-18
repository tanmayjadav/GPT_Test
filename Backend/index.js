import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import OpenAI from 'openai'; // Import the OpenAI library
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: 'config.env' });
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure the OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.APIKEY, // Replace with your actual API key
  baseURL: process.env.BASEURL, // Use the hosted API base URL
});

app.post('/api/chat', async (req, res) => {
  try {
    // Extract the request body
    const { model, messages } = req.body;

    if (!model || !messages) {
      return res.status(400).json({ error: 'Model and messages are required.' });
    }

    // Use the OpenAI library to send the request
    const response = await openai.chat.completions.create({
      model,
      messages,
    });

    // Send back the response
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in /api/chat:', error.message);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : 'Internal Server Error';
    res.status(statusCode).json({ error: errorMessage });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
