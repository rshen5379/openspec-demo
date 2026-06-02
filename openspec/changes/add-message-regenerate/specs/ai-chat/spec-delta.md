## ADDED Requirements

### Requirement: Message Regeneration
WHEN a user is not satisfied with an AI response, the system SHALL provide a regenerate button to re-request the AI with the same conversation context and replace the existing response.

#### Scenario: Regenerate AI response
- **GIVEN** a conversation with at least one AI response
- **WHEN** user clicks the regenerate button on an AI message
- **THEN** the system removes the current AI response content
- **AND** sends the conversation context (up to the user message preceding the AI response) to the AI API
- **AND** streams the new response token by token, replacing the old response in the chat
- **AND** persists the updated conversation to localStorage

#### Scenario: Regenerate button visibility
- **WHEN** user hovers over an AI message bubble
- **THEN** a regenerate button (🔄 icon) appears at the bottom-right of the bubble
- **WHEN** user moves the cursor away from the AI message bubble
- **THEN** the regenerate button disappears

#### Scenario: Regenerate during loading
- **WHEN** a regeneration is in progress
- **THEN** the regenerate button is hidden
- **AND** the input box and send button are disabled
- **AND** a stop button is shown in place of the send button
- **WHEN** the regeneration completes or is stopped
- **THEN** the regenerate button becomes available again

#### Scenario: Regenerate preserves copy functionality
- **WHEN** an AI message has been regenerated
- **THEN** clicking the message bubble still copies the message content to clipboard
- **AND** the "已复制" toast feedback is shown
