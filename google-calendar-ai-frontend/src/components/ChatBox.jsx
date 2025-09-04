// import React ,{ useState } from "react";
// import axios from "axios";

// export default function ChatBox() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { role: "user", content: input }];
//     setMessages(newMessages);

//     try {
//       const res = await axios.post("http://localhost:3000/ask", { message: input , thread_id:Math.random().toString(36).substring(7)});
//       setMessages([...newMessages, { role: "ai", content: res.data.reply }]);
//     } catch (error) {
//       console.error(error);
//     }

//     setInput("");
//   };

//   return (
//     <div className="flex flex-col h-[400px]">
//       <div className="flex-1 overflow-y-auto p-2 space-y-2">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`p-2 rounded-lg max-w-xs ${msg.role === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-2 mt-2">
//         <input
//           className="flex-1 border rounded-lg px-3 py-2"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask me about your meetings..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }





import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:3000/ask", {
        message: input,
        thread_id: Math.random().toString(36).substring(7),
      });

      const aiMessage = { role: "ai", content: res.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { role: "ai", content: "Failed to get response." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col flex-1 h-[500px] border rounded-lg overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] p-3 rounded-lg break-words ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800 self-start animate-pulse">
            AI is typing...
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input area fixed at bottom */}
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask me about your meetings..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
