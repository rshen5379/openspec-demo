## Requirements
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
WHEN a user sends multiple messages in the same session, the system SHALL maintain conversation context by sending prior message history to the AI model, and persist messages across page reloads.

#### Scenario: Follow-up question with context
- **WHEN** user has previously asked "什么是机器学习？" and the AI responded
- **AND** user sends "它和深度学习有什么区别？"
- **THEN** the system includes the prior question and answer in the API request
- **AND** the AI response references the previous context

#### Scenario: New conversation clears persisted history
- **WHEN** user clicks the "New Chat" button
- **THEN** the system clears the conversation history in memory
- **AND** the system clears the persisted history from localStorage
- **AND** the welcome message is shown again

#### Scenario: Context restored after reload
- **WHEN** user reloads the page and sends a new message
- **THEN** the system includes all previously persisted messages in the API request
- **AND** the AI response considers the full conversation context

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
WHEN a user opens the application, the system SHALL display a chat interface as a centered modal dialog, activated by a floating action button (FAB).

#### Scenario: Initial page load
- **WHEN** user navigates to the application URL
- **THEN** the system displays a background page with a floating action button (FAB) in the bottom-right corner
- **AND** clicking the FAB opens a centered modal dialog with the chat interface
- **AND** the modal is sized 520×620px, not exceeding 90vw width and 80vh height
- **AND** the message area shows a welcome message when no messages exist
- **AND** the main page content (title, description, date) remains visible behind the overlay

#### Scenario: Close modal dialog
- **WHEN** user clicks the modal overlay backdrop, presses ESC key, or clicks the close button (✕)
- **THEN** the modal dialog closes
- **AND** the background page becomes interactive again

#### Scenario: Open modal dialog
- **WHEN** user clicks the floating action button (FAB)
- **THEN** the modal dialog opens with a scale-in animation
- **AND** a semi-transparent overlay covers the background page

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

### Requirement: Theme Toggle Control
WHEN a user clicks the theme toggle button in the header,
the system SHALL switch between dark mode and light mode immediately.

#### Scenario: Switch from dark to light
- **WHEN** the current theme is dark mode and the user clicks the theme toggle button
- **THEN** the system switches to light mode
- **AND** all UI colors update immediately without page reload
- **AND** the toggle button icon changes to reflect the current mode

#### Scenario: Switch from light to dark
- **WHEN** the current theme is light mode and the user clicks the theme toggle button
- **THEN** the system switches to dark mode
- **AND** all UI colors update immediately without page reload

### Requirement: Theme Persistence
WHEN a user selects a theme,
the system SHALL persist the choice to localStorage and restore it on next visit.

#### Scenario: Theme persists across sessions
- **WHEN** the user has selected light mode and closes the browser and revisits the application
- **THEN** the system restores light mode
- **AND** the toggle button shows the correct state

#### Scenario: No prior theme selection with light system preference
- **WHEN** the user has never manually selected a theme and the system preference is light mode (prefers-color-scheme: light)
- **THEN** the system uses light mode

#### Scenario: No prior selection with dark system preference
- **WHEN** the user has never manually selected a theme and the system preference is dark mode (prefers-color-scheme: dark)
- **THEN** the system uses dark mode

### Requirement: Chat History Persistence
The system SHALL persist chat message history to localStorage and restore it on page reload.

#### Scenario: Messages persist after page reload
- **WHEN** user has sent messages in a conversation and reloads the page
- **THEN** the system restores the previous message history from localStorage
- **AND** the user can continue the conversation with full context

#### Scenario: First-time user sees welcome message
- **WHEN** user opens the application for the first time with no saved history
- **THEN** the system displays the AI welcome message
- **AND** the welcome message is also saved to localStorage

