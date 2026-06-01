## ADDED Requirements

### Requirement: Date Display on Main Page
The system SHALL display the current date on the main page in Chinese localized format (e.g., "2026年5月29日 星期四").

#### Scenario: Page loads with current date
- **WHEN** user navigates to the application URL
- **THEN** the system displays the current date in Chinese format at the top of the main page
- **AND** the format includes year, month, day, and weekday

#### Scenario: Date updates at midnight
- **WHEN** the system time crosses midnight (00:00)
- **THEN** the displayed date automatically updates to the new date
- **AND** no page refresh is required

### Requirement: Date Display Styling
The system SHALL render the date with clear, readable styling that fits the page aesthetic.

#### Scenario: Date appearance
- **WHEN** the date is displayed on the main page
- **THEN** the date text is centered horizontally
- **AND** the font size and color are consistent with the page design
