# Project Setup Guide

## Cloning the Project

1. Clone the project repository into your desired directory:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

## Running the Frontend

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies and start the development server:
   ```bash
   npm i
   npm run dev
   ```

## Starting the Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies and start the server:
   ```bash
   npm i
   node --watch server.js
   ```

## Database Setup

1. Ensure you have MySQL Workbench 8.0 CE installed.
2. Open `server/db.js` and provide your database connection credentials.
3. To initialize the tables, navigate to the `server/createTable` directory and run each file separately. For example:
   ```bash
   node initAdminTable.js
   ```

