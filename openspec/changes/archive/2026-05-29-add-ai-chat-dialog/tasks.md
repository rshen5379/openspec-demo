## 1. Project Setup

- [x] 1.1 Initialize root package.json and workspace structure (frontend + backend)
- [x] 1.2 Initialize React + Vite frontend project with dependencies (react, marked, highlight.js)
- [x] 1.3 Initialize Node.js + Express backend project with dependencies (express, openai, cors, dotenv)

## 2. Backend Implementation

- [x] 2.1 Create AI service module with OpenAI SDK integration and streaming support
- [x] 2.2 Create POST /api/chat SSE endpoint with conversation context management
- [x] 2.3 Add error handling for timeout, API errors, and empty messages

## 3. Frontend Implementation

- [x] 3.1 Create ChatApp component with message list and input area
- [x] 3.2 Implement message sending and SSE stream receiving logic
- [x] 3.3 Implement Markdown rendering with code highlighting and copy button
- [x] 3.4 Add auto-scroll to latest message behavior
- [x] 3.5 Add loading state indicator and send button disable during response

## 4. Integration & Polish

- [x] 4.1 Add "New Chat" button to clear conversation history
- [x] 4.2 Add welcome message on initial load
- [x] 4.3 Create .env.example with required environment variables
- [x] 4.4 End-to-end test: send message → receive streaming AI response
