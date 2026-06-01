## MODIFIED Requirements

### Requirement: Chat UI Layout
WHEN a user opens the application, the system SHALL display a chat interface as a centered modal dialog, activated by a floating action button (FAB).

#### Scenario: Initial page load
- **WHEN** user navigates to the application URL
- **THEN** the system displays a background page with a floating action button (FAB) in the bottom-right corner
- **AND** clicking the FAB opens a centered modal dialog with the chat interface
- **AND** the modal is sized 520×620px, not exceeding 90vw width and 80vh height

#### Scenario: First open auto-introduction
- **WHEN** user opens the modal dialog for the first time in the current session
- **THEN** the system displays an AI self-introduction message in the message area with Markdown formatting
- **AND** the message introduces the AI assistant's name, capabilities, and usage guidance

#### Scenario: Reopen does not repeat introduction
- **WHEN** user closes and reopens the modal dialog within the same session
- **THEN** the system does NOT send the self-introduction message again
- **AND** the previous conversation history is preserved

#### Scenario: Auto-scroll to latest message
- **WHEN** new AI response content arrives
- **THEN** the system automatically scrolls the message area to the bottom

#### Scenario: Close modal dialog
- **WHEN** user clicks the modal overlay backdrop, presses ESC key, or clicks the close button (✕)
- **THEN** the modal dialog closes
- **AND** the background page becomes interactive again

#### Scenario: Open modal dialog
- **WHEN** user clicks the floating action button (FAB)
- **THEN** the modal dialog opens with a scale-in animation
- **AND** a semi-transparent overlay covers the background page
