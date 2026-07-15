# SUPPLY: Intelligent Inventory Dashboard

A Note on Ambiguity: These scenarios are designed to mimic real-world requirements, which can be ambiguous. If a requirement is unclear, please make a reasonable assumption and document it in your System Design Document.

### Scenario B: The Intelligent Inventory Dashboard

- Domain: Supply
- Task: Build an Intelligent Inventory Dashboard to give dealership managers a real-time overview of their vehicle stock.
- Core Requirements:
    1. Inventory Visualization: Display a filterable list of all vehicles in a dealership's inventory (e.g., filter by make, model, age).
    2. Aging Stock Identification: Automatically identify and prominently display "aging stock" (vehicles in inventory for >90 days).
    3. Actionable Insights: Allow a manager to log and persist a status or proposed action for each aging vehicle (e.g., "Price Reduction Planned").

## Assignment Deliverables

Work should be based on the single scenario chosen above.

### Part 1: System Design

Produce a System Design Document that outlines the architectural plan. Format is free choice (e.g., Markdown, PDF, diagram). Must include:

- An architecture diagram.
- A brief description of each component's role.
- An explanation of the data flow.
- A list of chosen technologies with justifications.
- A strategy for observability (e.g., logging, metrics, tracing).
- A dedicated section describing how GenAI was used to assist in the design phase.

### Part 2: Service Implementation (Choice)

Choose one service layer to implement fully: either the backend or the frontend, and mock or stub the other. The implementation should fulfil the acceptance criteria of the chosen scenario for the service layer selected.

- If Backend: Expose a RESTful API and use a persistent database. Mock or stub the client-side layer with a simple test harness, cURL examples, or a basic API contract (e.g., OpenAPI spec).
- If Frontend: Build a web application that demonstrates the full user experience for the scenario. Mock the backend layer using static data, a mock API library, or a local JSON server.
- Build for the future: whichever layer is chosen, design and implementation should consider scalability, performance, reliability, maintainability, and observability.

The user's choice: frontend
