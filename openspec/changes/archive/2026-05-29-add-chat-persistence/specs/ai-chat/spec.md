## ADDED Requirements

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

## MODIFIED Requirements

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
