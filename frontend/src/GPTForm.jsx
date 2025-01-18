// Import necessary modules
import React, { useState } from 'react';
import axios from 'axios';

const GPTForm = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // State to store history
  const server = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post(`${server}/api/chat`, {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: input }
        ],
      });

      const reply = res.data.choices[0].message.content;
      setResponse(reply);
      setHistory((prevHistory) => [...prevHistory, { input, reply }]); // Update history
    } catch (error) {
      console.error('Error fetching GPT response:', error);
      setResponse('Failed to fetch response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-5xl p-6 max-h-screen">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-center text-black">ChatGPT Proxy</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows="5"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none"
          />
          <button
            type="submit"
            disabled={loading || !input}
            className={`w-full p-2 text-white rounded-md ${loading || !input ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Loading...' : 'Send'}
          </button>
        </form>

        {response && (
          <div className="mt-4 p-4 bg-gray-50 border rounded-md h-96 overflow-y-auto">
            <p className="text-black whitespace-pre-line">{response}</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-black mb-2">Conversation History</h2>
            <div className="bg-gray-50 border rounded-md p-4 h-64 overflow-y-auto">
              {history.map((entry, index) => (
                <div key={index} className="mb-4">
                  <p className="text-black font-bold">User:</p>
                  <p className="text-black whitespace-pre-line mb-2">{entry.input}</p>
                  <p className="text-black font-bold">GPT:</p>
                  <p className="text-black whitespace-pre-line">{entry.reply}</p>
                  <hr className="my-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GPTForm;
