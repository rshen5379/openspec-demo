## ADDED Requirements

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
