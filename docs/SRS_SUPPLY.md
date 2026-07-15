# SRS-SUPPLY: Intelligent Inventory Dashboard

## Purpose

This SRS defines the requirements for an Intelligent Inventory Dashboard that gives dealership managers a real-time overview of their vehicle stock.

## Scope

**In Scope:**
- **Inventory Visualization**: Filterable list of all vehicles in a dealership's inventory (e.g., by make, model, age)
- **Aging Stock Identification**: Prominent flagging of vehicles in inventory over 90 days
- **Actionable Insights**: Persisted status or proposed action per aging vehicle (e.g., "Price Reduction Planned")

**Out of Scope:**
- **Backend Persistence**: deferred, mocked with static data for this frontend-focused initiative; real persistent API is future work

## Definitions, Acronyms, and Abbreviations

- **Actionable Insights**: A manager-recorded status or proposed action tied to an aging vehicle; each submission is persisted as a new, immutable record, forming a history
- **Aging Stock**: Vehicles that have been in inventory for more than 90 days
- **Aging Vehicle**: An individual vehicle that has been in inventory for more than 90 days
- **Current Status**: An aging vehicle's most recently logged Actionable Insight; prior records remain unchanged and are not overwritten
- **Price Reduction Planned**: An example aging-vehicle status meaning the manager plans to discount its price
- **Real-Time**: Reflects current inventory state without manual refresh
- **VIN**: Vehicle Identification Number — the standard unique identifier for a vehicle
- **Vehicle Stock**: The set of vehicles currently in a dealership's inventory

## Product Perspective

The Intelligent Inventory Dashboard is an entirely new product with no existing system it replaces or integrates with. It provides dealership managers a dedicated, real-time view of vehicle stock that does not currently exist.

## User Characteristics

- **Dealership Manager**: Non-technical business user, experienced with everyday business software (spreadsheets, dealership management tools), expects an intuitive UI requiring no training

## Constraints

- **Product** MUST be delivered as a web application
- **Backend Layer** MUST be mocked using static data, a mock API library, or a local JSON server
- **Backend Layer** MUST NOT use a persistent database

## Assumptions

- **Single-Dealership Scope**: assumed that the dashboard serves one dealership's inventory at a time, not multiple locations
- **Mock Data Fidelity**: assumed that mocked/static data is representative enough of real inventory data to validate the UX
- **Inventory Scale**: assumed the dataset can reach millions of records, requiring server-side paging and filtering, not full client loads

## Dependencies

- N/A

## Functional Requirements

- System SHALL display a paginated list of vehicles in the dealership's inventory
- System SHALL request each page of the inventory list from the backend, not the entire inventory
- System SHALL support filtering the inventory list by make, model, and age
- System SHALL apply make/model/age filters server-side, returning only matching results for the requested page
- System SHALL filter by age using preset ranges: 0–30, 31–60, 61–90, and >90 days in inventory
- System SHALL identify vehicles in inventory for more than 90 days as aging stock
- System SHALL prominently display aging stock within the inventory list
- System SHALL display a server-computed total count of aging stock, without requiring the full inventory to be loaded
- WHEN a manager submits a status or proposed action for an aging vehicle, System SHALL persist it as a new record, without modifying any previously logged record for that vehicle
- System SHALL display an aging vehicle's most recently logged action as its current status

## Non-functional Requirements

- **Learnability** (Usability): New dealership managers SHALL be able to complete core tasks (view inventory, view aging stock, log a status) without training
- **Logging** (Observability): System SHALL log key user actions (view, filter, aging-vehicle action) with timestamp
- **Time Behaviour** (Performance): Each paginated request SHALL render within 2 seconds for up to 500 vehicles, regardless of total size
- **Adaptability** (Portability): System SHALL render correctly on Chrome, Edge, and Safari
- **Adaptability** (Portability): System SHALL adapt layout for desktop, tablet, and mobile screen widths

## Other Requirements

- N/A

## References

- N/A
