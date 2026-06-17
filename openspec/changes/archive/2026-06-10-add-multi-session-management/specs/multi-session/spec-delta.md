# Spec Delta: multi-session-management

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Chat UI Layout
WHEN a user opens the application, the system SHALL display a chat interface as a centered modal dialog with a session sidebar, activated by a floating action button (FAB).

#### Scenario: Initial page load
- **WHEN** user navigates to the application URL
- **THEN** the system displays a background page with a floating action button (FAB) in the bottom-right corner
- **AND** clicking the FAB opens a centered modal dialog with the chat interface
- **AND** the modal is sized 720x620px, not exceeding 90vw width and 80vh height
- **AND** the modal contains a session sidebar (200px) on the left and the chat area on the right
- **AND** the message area shows a welcome message when no messages exist in the active session
- **AND** the main page content (title, description, date) remains visible behind the overlay

#### Scenario: Close modal dialog
- **WHEN** user presses ESC key or clicks the close button
- **THEN** the modal dialog closes
- **AND** the background page becomes interactive again

#### Scenario: Open modal dialog
- **WHEN** user clicks the floating action button (FAB)
- **THEN** the modal dialog opens with a scale-in animation
- **AND** a semi-transparent overlay covers the background page

### Requirement: Chat History Persistence
The system SHALL persist all chat sessions and their messages to localStorage and restore them on page reload.

#### Scenario: Messages persist after page reload
- **WHEN** user has sent messages in multiple sessions and reloads the page
- **THEN** the system restores all sessions from localStorage
- **AND** the active session is restored with its full message history
- **AND** the sidebar displays all sessions

#### Scenario: First-time user sees welcome message
- **WHEN** user opens the application for the first time with no saved data
- **THEN** the system creates a new empty session
- **AND** displays the AI welcome message in that session
- **AND** the welcome message is also saved to that session's messages in localStorage

### Requirement: Multi-turn Conversation Context
WHEN a user sends multiple messages in the same session, the system SHALL maintain conversation context by sending prior message history of the active session to the AI model.

#### Scenario: Follow-up question with context
- **WHEN** user has previously asked "什么是机器学习？" in the current session and the AI responded
- **AND** user sends "它和深度学习有什么区别？"
- **THEN** the system includes only the current session's prior question and answer in the API request
- **AND** the AI response references the previous context within that session

#### Scenario: Switching sessions does not mix context
- **WHEN** user has messages in Session A and switches to Session B
- **AND** sends a new message in Session B
- **THEN** the system sends only Session B's message history to the API
- **AND** no messages from Session A are included

#### Scenario: New conversation creates new session
- **WHEN** user clicks the "新对话" button
- **THEN** the system creates a new empty session and switches to it
- **AND** the previous session remains in the sidebar with its history intact
- **AND** the welcome message is shown in the new session
