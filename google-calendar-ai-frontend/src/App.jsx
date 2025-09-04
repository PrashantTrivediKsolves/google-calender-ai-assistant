import React ,{ useState } from "react";
import ChatBox from "./components/ChatBox";
import EventModal from "./components/EventModal";
import { motion } from "framer-motion";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:3000/auth"; // Backend auth route
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">AI Calendar Assistant</h1>
        {!isConnected ? (
          <button
            onClick={handleGoogleAuth}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Connect Google Account
          </button>
        ) : (
          <p className="text-green-600 font-semibold">Connected ✅</p>
        )}
      </header>

      <motion.main
        className="flex flex-col md:flex-row p-6 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
          <ChatBox />
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <EventModal />
        </div>
      </motion.main>
    </div>
  );
}

// import React, { useState } from "react";
// import ChatBox from "./components/ChatBox";
// import EventModal from "./components/EventModal";
// import { motion } from "framer-motion";

// export default function App() {
//   const [isConnected, setIsConnected] = useState(false);

//   const handleGoogleAuth = () => {
//     window.location.href = "http://localhost:3000/auth"; // Backend auth route
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Header */}
//       <header className="bg-white shadow-md p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-blue-600">AI Calendar Assistant</h1>
//         {!isConnected ? (
//           <button
//             onClick={handleGoogleAuth}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Connect Google Account
//           </button>
//         ) : (
//           <p className="text-green-600 font-semibold">Connected ✅</p>
//         )}
//       </header>

//       {/* Main content */}
//       <motion.main
//         className="flex flex-col md:flex-row p-6 gap-6 flex-1"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         {/* AI Chat */}
//         <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6 flex flex-col">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">AI Assistant</h2>
//           <ChatBox />
//         </div>

//         {/* Events */}
//         <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6 flex flex-col">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">Upcoming Events</h2>
//           <EventModal />
//         </div>
//       </motion.main>
//     </div>
//   );
// }
