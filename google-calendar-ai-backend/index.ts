// import readLine from "node:readline/promises";
// import { ChatGroq } from "@langchain/groq";
// import {
//   createEventTool,
//   deleteEventTool,
//   getEventsTool,
//   webSearch,
//   getEmail,
//   updateEventTool,
// } from "./tools";
// import {
//   END,
//   MemorySaver,
//   MessagesAnnotation,
//   StateGraph,
// } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import type { AIMessage } from "@langchain/core/messages";

// const tools = [
//   createEventTool,
//   getEventsTool,
//   deleteEventTool,
//   updateEventTool,
//   webSearch,
//   getEmail,
// ];

// const model = new ChatGroq({
//   model: "openai/gpt-oss-120b",
//   temperature: 0,
// }).bindTools(tools);

// async function callModel(state: typeof MessagesAnnotation.State) {
//   const response = await model.invoke(state.messages);
//   return { messages: [response] };
// }

// function shouldContinue(state: typeof MessagesAnnotation.State) {
//   const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
//   if (lastMessage.tool_calls?.length) {
//     return "tools";
//   }
//   return "__end__";
// }


// const getDemo
// const toolNode = new ToolNode(tools);

// const workflow = new StateGraph(MessagesAnnotation)
//   .addNode("agent", callModel)
//   .addEdge("__start__", "agent")
//   .addNode("tools", toolNode)
//   .addEdge("tools", "agent")
//   .addConditionalEdges("agent", shouldContinue, {
//     __end__: END,
//     tools: "tools",
//   });

// const checkpointer = new MemorySaver();

// const app = workflow.compile({ checkpointer });

const systemPrompt = `You are an smart ai assistant and you name is ${
  process.env.AGENT_NAME
}
                      You help with users to setup meetings on the google calendar and get information from their google calendar.
                      You have access to the following tools:
                      1. create_event: To create an event on the google calendar. Use this tool when user wants to create a meeting on their calendar.
                      2. get_events: To get events from google calendar. Use this tool when user wants to get information about their meetings on their calendar.
                      3. web_search: To search the web for information. Use this tool when user wants to get information about anything on the web.
                      4. delete_event: To delete an event from google calendar. Use this tool when user wants to delete a meeting from their calendar.
                      5. get_email: To get the email of an attendee. Use this tool when user wants to get the email of a specific attendee use this tool when  the user does not provide it.
                      6. update_event: To update an event on the google calendar. Use this tool when user wants to update a meeting on their calendar.
                    Current Date & Time is : ${new Date()
                      .toLocaleString("sv-SE")
                      .replace(" ", "T")} 
                       Current Timezone is : ${
                         Intl.DateTimeFormat().resolvedOptions().timeZone
                       }
`;

// async function main() {
//   const rl = readLine.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   const config = {
//     configurable: {
//       thread_id: "1",
//     },
//   };
//   while (true) {
//     const question = await rl.question("You: ");
//     if (question === "exit") break;
//     const finalState = await app.invoke(
//       {
//         messages: [
//           {
//             role: "system",
//             content: systemPrompt,
//           },
//           {
//             role: "user",
//             content: question,
//           },
//         ],
//       },
//       config
//     );
//     console.log(
//       "AI: ",
//       finalState.messages[finalState.messages.length - 1]?.content
//     );
//   }

//   rl.close();
// }

// main();
import express from "express";
import cors from "cors";
import { ChatGroq } from "@langchain/groq";
// import { calendar } from "./tools";
import {
  createEventTool,
  deleteEventTool,
  getEventsTool,
  webSearch,
  getEmail,
  updateEventTool,
} from "./tools";
import {
  END,
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "@langchain/core/messages";

const tools = [
  createEventTool,
  getEventsTool,
  deleteEventTool,
  updateEventTool,
  webSearch,
  getEmail,
];

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

// function shouldContinue(state: typeof MessagesAnnotation.State) {
//   const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
//   if (lastMessage.tool_calls?.length) {
//     return "tools";
//   }
//   return "__end__";
// }

let toolCallCount = 0;
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls?.length && toolCallCount < 5) {
    toolCallCount++;
    return "tools";
  }
  return "__end__";
}

const toolNode = new ToolNode(tools);

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue, {
    __end__: END,
    tools: "tools",
  });

const checkpointer = new MemorySaver();

const app = workflow.compile({ checkpointer });

// const systemPrompt = `You are a helpful AI assistant named ${
//   process.env.AGENT_NAME || "Assistant"
// }.
// You help users setup meetings on Google Calendar and get information from their Google Calendar.
// You have access to the following tools:
// 1. create_event: Create an event on the user's Google Calendar.
// 2. get_event: Read events from Google Calendar.
// 3. web_search: Search the web for information.
// 4. delete_event: Delete events from Google Calendar.
// 5. get-email: Get an attendee's email from contacts.
// 6. update-event: Update an event on Google Calendar.

// Current Date & Time: ${new Date().toLocaleString("sv-SE").replace(" ", "T")}
// Current Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
// `;

// --- HTTP Server instead of CLI ---
export const http = express();
http.use(cors());
http.use(express.json());

const PORT = Number(process.env.PORT || 3000);

/**
 * POST /ask
 * Body: { message: string, thread_id?: string }
 * Response: { reply: string }
 */
http.post("/ask", async (req, res) => {
  try {
    const { message, thread_id } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Field `message` is required (string)." });
    }

    const config = {
      configurable: {
        thread_id: thread_id ? String(thread_id) : "1",
      },
    };

    const finalState = await app.invoke(
      {
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      config
    );

    // finalState.messages contains the conversation nodes and the last element should be the assistant reply
    const last = finalState.messages[finalState.messages.length - 1];
    const reply = last?.content ?? "Sorry, I couldn't produce a reply.";

    return res.json({ reply });
  } catch (err: any) {
    console.error("Error in /ask:", err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
});

/**
 * Quick health check
 */
http.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// http.get("/events", async (req, res) => {
//   try {
//     const response = await calendar.events.list({
//       calendarId: "primary",
//       timeMin: new Date().toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: "startTime",
//     });
//     res.json(response.data.items);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).json({ error: "Failed to fetch events" });
//   }
// });

http.listen(PORT, () => {
  console.log(`Assistant API listening at http://localhost:${PORT}`);
  console.log("POST /ask with { message } to interact (CORS enabled).");
});
