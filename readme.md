# Chat Mood Analyzer

## Overview

This project is a Chat Mood Analyzer, which evaluates the mood of users based on their messages. It uses WebSockets for real-time communication and updates. The application consists of a backend server to manage WebSocket connections and a frontend built with React and Vite. The mood is analyzed using emojis and a weighted scoring system.

## Features

- Real-time mood analysis based on message content.
- Emoji-based mood scoring with weighted values.
- Persistent user data and message history using localStorage.
- WebSocket-based real-time communication.
- User authentication and message handling.
- AI-generated emoji and communication advice.

## Installation

### Prerequisites

- Node.js
- npm or yarn
- Vite

### Backend Setup

1. Navigate to the backend folder:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the WebSocket and Express server:

    ```bash
    node index.js
    ```

### Frontend Setup

1. Navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the Vite development server:

    ```bash
    npm run dev
    ```

## Usage

1. Start the backend server as described above.
2. Start the frontend development server as described above.
3. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:3000`).
4. Log in with a username to start analyzing your mood based on your messages.
