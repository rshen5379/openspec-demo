## ADDED Requirements

### Requirement: Chat Message Submission
The system SHALL allow users to type a message in an input box and submit it to the backend API.

#### Scenario: Submit a text message
- **WHEN** user types "什么是机器学习？" in the input box and presses Enter or clicks the send button
- **THEN** the system displays the user message in the chat history
- **AND** sends the message to the backend API

#### Scenario: Submit empty message
- **WHEN** user clicks send with an empty or whitespace-only input
- **THEN** the system SHALL NOT send any request
- **AND** the input box remains focused

### Requirement: AI Streaming Response
WHEN the backend receives a chat message, the system SHALL call the AI model API and stream the response to the frontend via Server-Sent Events.

#### Scenario: Successful AI response
- **WHEN** the backend receives a valid chat message and the AI API is available
- **THEN** the system streams the AI response token by token to the frontend
- **AND** the frontend displays each token as it arrives in real-time
- **AND** the stream completes with a "[DONE]" signal

#### Scenario: AI API timeout
- **WHEN** the AI API does not respond within 60 seconds
- **THEN** the system displays error message "AI 服务响应超时，请重试"
- **AND** the user can retry

#### Scenario: AI API error
- **WHEN** the AI API returns a 4xx or 5xx error
- **THEN** the system displays error message "AI 服务暂时不可用，请稍后重试"
- **AND** the user's original question remains in chat history

### Requirement: Multi-turn Conversation Context
WHEN a user sends multiple messages in the same session, the system SHALL maintain conversation context by sending prior message history to the AI model.

#### Scenario: Follow-up question with context
- **WHEN** user has previously asked "什么是机器学习？" and the AI responded
- **AND** user sends "它和深度学习有什么区别？"
- **THEN** the system includes the prior question and answer in the API request
- **AND** the AI response references the previous context

#### Scenario: New conversation
- **WHEN** user clicks the "New Chat" button
- **THEN** the system clears the conversation history
- **AND** starts a fresh session with no prior context

### Requirement: Markdown Rendering
WHEN the AI returns a response containing Markdown syntax, the system SHALL render it as formatted HTML.

#### Scenario: Response with code block
- **WHEN** AI returns a response containing a code block with language identifier
- **THEN** the code block is displayed with syntax highlighting
- **AND** a copy button is available for the code block

#### Scenario: Response with formatted text
- **WHEN** AI returns a response with headers, bold, lists, and links
- **THEN** all Markdown formatting is correctly rendered as styled HTML

### Requirement: Chat UI Layout
WHEN a user opens the application, the system SHALL display a chat interface with message area, input box, and send button.

#### Scenario: Initial page load
- **WHEN** user navigates to the application URL
- **THEN** the system displays a centered chat interface
- **AND** the message area shows a welcome message
- **AND** the input box is focused and ready for input

#### Scenario: Auto-scroll to latest message
- **WHEN** new AI response content arrives
- **THEN** the system automatically scrolls the message area to the bottom

### Requirement: Loading State Indication
WHEN a message has been sent and the AI is generating a response, the system SHALL indicate the loading state to the user.

#### Scenario: Loading indicator during response
- **WHEN** user submits a message and the AI is processing
- **THEN** a typing indicator or loading animation is displayed below the user message
- **AND** the send button is disabled to prevent duplicate submissions

#### Scenario: Loading clears on completion
- **WHEN** the AI response completes or errors
- **THEN** the loading indicator is removed
- **AND** the send button is re-enabled
