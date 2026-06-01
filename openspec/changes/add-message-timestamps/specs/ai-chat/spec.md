### Requirement: Chat Message Timestamps
WHEN chat messages are displayed, the system SHALL show a timestamp indicating when each message was sent.

#### Scenario: User message timestamp
- **WHEN** a user sends a message
- **THEN** the system records the current time with the message
- **AND** displays the time below the message bubble in HH:mm format

#### Scenario: AI message timestamp
- **WHEN** an AI response completes
- **THEN** the system records the completion time with the message
- **AND** displays the time below the message bubble in HH:mm format

#### Scenario: Timestamps persist across reloads
- **WHEN** messages with timestamps are saved to localStorage and restored
- **THEN** the original timestamps are preserved and displayed correctly
