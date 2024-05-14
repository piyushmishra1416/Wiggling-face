import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";

const MyComponent = () => {
  const [message, setMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;

        if (!apiKey) {
          throw new Error("API key not found");
        }

        const groq = new Groq({
          dangerouslyAllowBrowser: true,
          apiKey: apiKey,
        });

        const chatCompletion = await groq.chat.completions.create({
          messages: conversationHistory,
          model: "llama3-8b-8192",
        });

        const completionMessage =
          chatCompletion.choices[0]?.message?.content || "";
        setResponse(completionMessage);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Fetch data whenever conversation history changes
    if (conversationHistory.length > 0) {
      fetchData();
    }
  }, [conversationHistory]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Add user's message to conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: `make a joke about ${message}` },
    ];
    setConversationHistory(updatedHistory);

    // Clear input field after submitting
    setMessage("");
  };

  return (
    <div className="bg-black h-screen flex flex-col justify-center items-center text-center text-white">
      <h1 className="text-6xl font-bold mb-[10%]"> Wiggling Face</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-md mx-auto">
        <label className="mb-4 text-lg font-bold">
          Prompt:
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Time to wiggle now"
            className="border border-gray-300 px-4 py-2 text-black rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
        >
          Send
        </button>
      </form>
      {conversationHistory.map((item, index) => (
        <div key={index} >
          {item.role === "user" ? (
            <p className="font-bold">User: {item.content}</p>
          ) : (
            <p>Response: {item.content}</p>
          )}
        </div>
      ))}
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default MyComponent;
