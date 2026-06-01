## ADDED Requirements

### Requirement: Stop Generation Control
The system SHALL allow users to stop AI response generation mid-stream by clicking a stop button.

#### Scenario: Stop button appears during generation
- **WHEN** the AI is generating a response (loading state is active)
- **THEN** the system displays a "停止" button in place of the "发送" button
- **AND** the "停止" button is styled distinctly from the "发送" button

#### Scenario: User clicks stop during generation
- **WHEN** the user clicks the "停止" button while the AI is generating
- **THEN** the system immediately aborts the streaming request
- **AND** the partially generated content is preserved in the chat
- **AND** the loading state is cleared
- **AND** the input box and "发送" button become active again

#### Scenario: Resume conversation after stopping
- **WHEN** the user has stopped generation and sends a new message
- **THEN** the system processes the new message normally
- **AND** the previous partial response remains in the chat history
