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
WHEN the backend receives a chat message, the system SHALL call the AI model API with the specified model (or default) and stream the response to the frontend via Server-Sent Events.

#### Scenario: Successful AI response
- **WHEN** the backend receives a valid chat message and the AI API is available
- **THEN** the system streams the AI response token by token to the frontend
- **AND** the frontend displays each token as it arrives in real-time
- **AND** the stream completes with a "[DONE]" signal

#### Scenario: Successful AI response with specified model
- **WHEN** the backend receives a valid chat message with a specified model
- **THEN** the system calls the OpenAI API with the specified model
- **AND** streams the response token by token to the frontend

#### Scenario: Fallback to default model
- **WHEN** the backend receives a chat message without a model field
- **THEN** the system uses the OPENAI_MODEL environment variable value as the model

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

### Requirement: Chat Message Avatars
WHEN chat messages are displayed, the system SHALL show avatars next to each message to visually distinguish the sender.

#### Scenario: AI message avatar
- **WHEN** an AI (assistant) message is displayed in the chat
- **THEN** the system shows a circular AI avatar (32×32px) to the left of the message bubble
- **AND** the avatar displays a robot icon rendered via CSS/SVG
- **AND** the avatar background color uses the theme's AI accent color

#### Scenario: User message avatar
- **WHEN** a user message is displayed in the chat
- **THEN** the system shows a circular user avatar (32×32px) to the right of the message bubble
- **AND** the avatar displays a person icon rendered via CSS/SVG
- **AND** the avatar background color uses the theme's user accent color

#### Scenario: Typing indicator avatar
- **WHEN** the AI typing indicator is shown
- **THEN** the system shows the same AI avatar to the left of the typing indicator

### Requirement: Message Copy on Click
WHEN a user clicks on any message bubble (user or AI),
the system SHALL copy the plain text content of that message to the clipboard.

#### Scenario: Copy user message
- **WHEN** user clicks on their own message bubble
- **THEN** the system copies the message plain text to the clipboard
- **AND** displays a transient "已复制" feedback near the message
- **AND** the feedback disappears after 1.5 seconds

#### Scenario: Copy AI message
- **WHEN** user clicks on an AI response bubble
- **THEN** the system copies the AI message plain text (Markdown source) to the clipboard
- **AND** displays a transient "已复制" feedback near the message
- **AND** the feedback disappears after 1.5 seconds

#### Scenario: Click during copy feedback
- **WHEN** user clicks a message while the "已复制" feedback is still visible
- **THEN** the system copies the message again and resets the feedback timer

### Requirement: Multi-Session Data Structure
The system SHALL maintain multiple independent chat sessions, each with a unique ID, title, message list, and timestamps, persisted to localStorage under the key .

#### Scenario: New session creation
- **WHEN** the user creates a new session
- **THEN** the system generates a unique session ID (timestamp-based)
- **AND** initializes an empty message list with createdAt and updatedAt set to current time
- **AND** sets the new session as the active session
- **AND** persists the updated session list to localStorage

#### Scenario: Session data structure
- **GIVEN** the  key in localStorage
- **THEN** the data is a JSON object containing  (array) and  (string)
- **AND** each session object has: , , , , 
### Requirement: Session List Sidebar
WHEN the chat dialog is open, the system SHALL display a sidebar on the left side listing all chat sessions.

#### Scenario: Sidebar with sessions
- **WHEN** the user opens the chat dialog
- **THEN** a sidebar is displayed on the left side (200px width)
- **AND** the sidebar lists all sessions in reverse chronological order (most recent first)
- **AND** each session item shows the session title and relative timestamp
- **AND** the active session is visually highlighted

#### Scenario: Empty session list
- **WHEN** the user has no sessions
- **THEN** the sidebar shows only the "新建对话" button
- **AND** clicking it creates a new session automatically

### Requirement: Session Switching
WHEN the user clicks a session in the sidebar, the system SHALL switch to that session and display its messages.

#### Scenario: Switch to another session
- **WHEN** the user clicks a non-active session in the sidebar
- **THEN** the chat area displays the selected session's messages
- **AND** the active session indicator updates
- **AND** the activeSessionId is updated in localStorage

#### Scenario: Switch during generation
- **WHEN** the user switches sessions while an AI response is being generated
- **THEN** the system aborts the current generation
- **AND** switches to the selected session

### Requirement: Session Deletion
WHEN the user deletes a session, the system SHALL remove it from the session list.

#### Scenario: Delete a session
- **WHEN** the user clicks the delete button on a session item
- **THEN** the system removes the session from the list
- **AND** persists the updated session list to localStorage
- **AND** if the deleted session was active, the system switches to the most recent remaining session
- **AND** if no sessions remain, the system creates a new empty session

#### Scenario: Delete the last session
- **WHEN** the user deletes the only remaining session
- **THEN** the system creates a new empty session and makes it active

### Requirement: Session Renaming
WHEN the user double-clicks a session title, the system SHALL allow inline editing of the session name.

#### Scenario: Rename a session
- **WHEN** the user double-clicks a session title in the sidebar
- **THEN** the title text becomes an editable input field
- **AND** pressing Enter or clicking outside saves the new title
- **AND** pressing Escape cancels the edit and restores the original title
- **AND** the updated title is persisted to localStorage

### Requirement: Auto Title Generation
WHEN a new session receives its first user message, the system SHALL automatically set the session title.

#### Scenario: Auto title from first message
- **WHEN** the user sends the first message in a session that has the default title "新对话"
- **THEN** the system sets the session title to the first 20 characters of the user message
- **AND** if the message is longer than 20 characters, the title is truncated with "..."
- **AND** the sidebar updates to show the new title

### Requirement: Sidebar Toggle
WHEN the user clicks the sidebar toggle button, the system SHALL collapse or expand the session sidebar.

#### Scenario: Toggle sidebar visibility
- **WHEN** the user clicks the sidebar toggle button
- **THEN** the sidebar collapses to a narrow strip showing only the toggle button
- **AND** clicking again expands the sidebar to its full width

#### Scenario: Small screen default behavior
- **WHEN** the viewport width is less than 640px
- **THEN** the sidebar defaults to collapsed state

### Requirement: Legacy Data Migration
WHEN the application loads and detects the legacy  key without , the system SHALL migrate the old data to the new format.

#### Scenario: Migrate existing single conversation
- **WHEN** the application loads and  exists in localStorage
- **AND**  does not exist
- **THEN** the system creates a new session with the existing messages
- **AND** sets the title to "迁移的对话" if messages exist, or "新对话" if empty
- **AND** saves the new format under - **AND** removes the old  key

#### Scenario: No legacy data
- **WHEN** the application loads and neither key exists
- **THEN** the system initializes with a single empty new session

### Requirement: Multi-Session Data Structure
The system SHALL maintain multiple independent chat sessions, each with a unique ID, title, message list, and timestamps, persisted to localStorage under the key `ai-chat-sessions`.

#### Scenario: New session creation
- **WHEN** the user creates a new session
- **THEN** the system generates a unique session ID (timestamp-based)
- **AND** initializes an empty message list with createdAt and updatedAt set to current time
- **AND** sets the new session as the active session
- **AND** persists the updated session list to localStorage

#### Scenario: Session data structure
- **GIVEN** the `ai-chat-sessions` key in localStorage
- **THEN** the data is a JSON object containing `sessions` (array) and `activeSessionId` (string)
- **AND** each session object has: `id`, `title`, `messages`, `createdAt`, `updatedAt`

### Requirement: Session List Sidebar
WHEN the chat dialog is open, the system SHALL display a sidebar on the left side listing all chat sessions.

#### Scenario: Sidebar with sessions
- **WHEN** the user opens the chat dialog
- **THEN** a sidebar is displayed on the left side (200px width)
- **AND** the sidebar lists all sessions in reverse chronological order (most recent first)
- **AND** each session item shows the session title and relative timestamp
- **AND** the active session is visually highlighted

#### Scenario: Empty session list
- **WHEN** the user has no sessions
- **THEN** the sidebar shows only the "新建对话" button
- **AND** clicking it creates a new session automatically

### Requirement: Session Switching
WHEN the user clicks a session in the sidebar, the system SHALL switch to that session and display its messages.

#### Scenario: Switch to another session
- **WHEN** the user clicks a non-active session in the sidebar
- **THEN** the chat area displays the selected session's messages
- **AND** the active session indicator updates
- **AND** the activeSessionId is updated in localStorage

#### Scenario: Switch during generation
- **WHEN** the user switches sessions while an AI response is being generated
- **THEN** the system aborts the current generation
- **AND** switches to the selected session

### Requirement: Session Deletion
WHEN the user deletes a session, the system SHALL remove it from the session list.

#### Scenario: Delete a session
- **WHEN** the user clicks the delete button on a session item
- **THEN** the system removes the session from the list
- **AND** persists the updated session list to localStorage
- **AND** if the deleted session was active, the system switches to the most recent remaining session
- **AND** if no sessions remain, the system creates a new empty session

#### Scenario: Delete the last session
- **WHEN** the user deletes the only remaining session
- **THEN** the system creates a new empty session and makes it active

### Requirement: Session Renaming
WHEN the user double-clicks a session title, the system SHALL allow inline editing of the session name.

#### Scenario: Rename a session
- **WHEN** the user double-clicks a session title in the sidebar
- **THEN** the title text becomes an editable input field
- **AND** pressing Enter or clicking outside saves the new title
- **AND** pressing Escape cancels the edit and restores the original title
- **AND** the updated title is persisted to localStorage

### Requirement: Auto Title Generation
WHEN a new session receives its first user message, the system SHALL automatically set the session title.

#### Scenario: Auto title from first message
- **WHEN** the user sends the first message in a session that has the default title "新对话"
- **THEN** the system sets the session title to the first 20 characters of the user message
- **AND** if the message is longer than 20 characters, the title is truncated with "..."
- **AND** the sidebar updates to show the new title

### Requirement: Sidebar Toggle
WHEN the user clicks the sidebar toggle button, the system SHALL collapse or expand the session sidebar.

#### Scenario: Toggle sidebar visibility
- **WHEN** the user clicks the sidebar toggle button
- **THEN** the sidebar collapses to a narrow strip showing only the toggle button
- **AND** clicking again expands the sidebar to its full width
- **AND** the sidebar state is persisted to localStorage

#### Scenario: Small screen default behavior
- **WHEN** the viewport width is less than 640px
- **THEN** the sidebar defaults to collapsed state
- **AND** when expanded, the sidebar overlays the chat area rather than pushing it

### Requirement: Legacy Data Migration
WHEN the application loads and detects the legacy `ai-chat-messages` key without `ai-chat-sessions`, the system SHALL migrate the old data to the new format.

#### Scenario: Migrate existing single conversation
- **WHEN** the application loads and `ai-chat-messages` exists in localStorage
- **AND** `ai-chat-sessions` does not exist
- **THEN** the system creates a new session with the existing messages
- **AND** sets the title to "迁移的对话" if messages exist, or "新对话" if empty
- **AND** saves the new format under `ai-chat-sessions`
- **AND** removes the old `ai-chat-messages` key

#### Scenario: No legacy data
- **WHEN** the application loads and neither key exists
- **THEN** the system initializes with a single empty new session

### Requirement: Model List API
WHEN the frontend requests the available models,
the system SHALL return a list of model identifiers configured via the `AVAILABLE_MODELS` environment variable.

#### Scenario: Fetch available models
GIVEN the environment variable `AVAILABLE_MODELS` is set to `glm-5,gpt-4o,gpt-4o-mini`
WHEN the frontend sends a `GET /api/models` request
THEN the system returns a JSON array `["glm-5", "gpt-4o", "gpt-4o-mini"]`

#### Scenario: No AVAILABLE_MODELS configured
GIVEN the environment variable `AVAILABLE_MODELS` is not set
WHEN the frontend sends a `GET /api/models` request
THEN the system returns a JSON array containing only the default `OPENAI_MODEL` value

#### Scenario: Model list with display names
GIVEN the environment variable `AVAILABLE_MODELS` is set to `glm-5,gpt-4o,gpt-4o-mini`
WHEN the frontend sends a `GET /api/models` request
THEN each model entry includes `id` (model identifier) and `name` (display name)
AND the response format is `[{"id": "glm-5", "name": "GLM-5"}, {"id": "gpt-4o", "name": "GPT-4o"}, {"id": "gpt-4o-mini", "name": "GPT-4o Mini"}]`

### Requirement: Model Selector UI
WHEN the user opens the sidebar, the system SHALL display a model selector dropdown at the bottom of the sidebar, allowing the user to choose the AI model for the current session.

#### Scenario: Display model selector
GIVEN the application has loaded and fetched the available model list
WHEN the user opens the sidebar
THEN a dropdown selector is visible at the bottom of the sidebar
AND it shows the current session's selected model as the active option
AND all available models are listed as selectable options

#### Scenario: Switch model for current session
GIVEN the user is in a session with model "glm-5" selected
WHEN the user selects "gpt-4o" from the model dropdown
THEN the current session's model is updated to "gpt-4o"
AND subsequent messages in this session use the "gpt-4o" model
AND the session's `updatedAt` timestamp is refreshed

#### Scenario: Model selector reflects session model on switch
GIVEN session A uses "glm-5" and session B uses "gpt-4o"
WHEN the user switches from session A to session B
THEN the model selector updates to show "gpt-4o"

### Requirement: Per-Session Model Persistence
WHEN a user selects a model for a session, the system SHALL persist the model choice within the session data in localStorage.

#### Scenario: Model persists across page reload
GIVEN the user has selected "gpt-4o" for a session and reloads the page
WHEN the page loads and sessions are restored
THEN the session's model is "gpt-4o"
AND the model selector shows "gpt-4o"

#### Scenario: New session inherits last used model
GIVEN the user's most recent session used "gpt-4o"
WHEN the user creates a new session
THEN the new session's default model is "gpt-4o"

#### Scenario: First session uses default model
GIVEN there are no existing sessions and the user opens the app for the first time
WHEN a new session is created
THEN the session's default model is the first model from the available models list

### Requirement: Dynamic Model in Chat Request
WHEN the frontend sends a chat message, the system SHALL pass the session's selected model to the backend API.

#### Scenario: Send message with selected model
GIVEN the current session has model "gpt-4o" selected
WHEN the user sends a message
THEN the frontend includes `"model": "gpt-4o"` in the `POST /api/chat` request body

#### Scenario: Backend uses requested model
GIVEN the backend receives a `POST /api/chat` request with `"model": "gpt-4o"`
WHEN the backend processes the request
THEN it uses "gpt-4o" as the model for the OpenAI API call
AND streams the response to the frontend
