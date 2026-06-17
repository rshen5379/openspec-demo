## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: AI Streaming Response
WHEN the backend receives a chat message, the system SHALL call the AI model API with the specified model (or default) and stream the response to the frontend via Server-Sent Events.

#### Scenario: Successful AI response with specified model
GIVEN the backend receives a valid chat message with `"model": "gpt-4o"`
WHEN the AI API is available
THEN the system calls the OpenAI API with model "gpt-4o"
AND streams the response token by token to the frontend

#### Scenario: Fallback to default model
GIVEN the backend receives a chat message without a `model` field
WHEN the AI API is available
THEN the system uses the `OPENAI_MODEL` environment variable value as the model
AND streams the response normally

#### Scenario: Unavailable model requested
GIVEN the backend receives a chat message with `"model": "nonexistent-model"`
WHEN the OpenAI API returns an error
THEN the system displays error message "模型不可用，请切换其他模型"
AND the user's message remains in chat history
