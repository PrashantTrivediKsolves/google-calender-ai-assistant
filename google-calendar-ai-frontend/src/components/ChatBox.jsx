import React ,{ useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post("http://localhost:3000/ask", { message: input });
      setMessages([...newMessages, { role: "ai", content: res.data.reply }]);
    } catch (error) {
      console.error(error);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-xs ${msg.role === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about your meetings..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
