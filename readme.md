# Tickets API

This Tickets API written in Node.js using TypeScript.\
The API interacts with a MongoDB database to fetch tickets. \
The database **must** be initialized with a **"ticket_service"** database and **"tickets"** collection.\
In the `app-config.json`  you can modify some configurations if you need.

## Prerequisites

Before running the Tickets API, make sure you have Node.js and MongoDB installed.

## Installation

To get started with the Tickets API, follow the steps below:

1. Clone the repository or download the source code.
2. Open a terminal and navigate to the project's root directory.
3. Run `npm i`to install the dependencies.
4. Run `npm run start` to run the application.

## API Endpoint for GET All Tickets

You can retrieve all tickets using the following API endpoint:

**GET /api/ticket**

This endpoint allows you to retrieve all tickets based on specific parameters. You can include the following query parameters to filter the results:

- **page**: The page number of the results (default: 1).
- **limit**: The maximum number of tickets for a certain page (max: 10).
- **from**: The starting timestamp (in milliseconds) for filtering tickets.
- **to**: The ending timestamp (in milliseconds) for filtering tickets.
- **title**: The ticket title for filtering tickets.
- **content**: The ticket content for filtering tickets.
- **userEmail**: The user email for filtering tickets.