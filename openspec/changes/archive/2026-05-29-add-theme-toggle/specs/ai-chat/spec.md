## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Chat UI Layout
WHEN a user opens the application, the system SHALL display a chat interface with colors determined by the active theme (dark or light).

#### Scenario: Initial page load with dark theme
- **WHEN** the active theme is dark mode and user navigates to the application URL
- **THEN** the system displays the chat interface with dark background and light text
- **AND** the message area shows a welcome message
- **AND** the input box is focused and ready for input

#### Scenario: Initial page load with light theme
- **WHEN** the active theme is light mode and user navigates to the application URL
- **THEN** the system displays the chat interface with light background and dark text
- **AND** the message area shows a welcome message
- **AND** the input box is focused and ready for input

#### Scenario: Auto-scroll to latest message
- **WHEN** new AI response content arrives
- **THEN** the system automatically scrolls the message area to the bottom
