# Tone Picker Text Tool

This is a solution for the Fiddle Engineering Intern Take Home Test. It's a tool that allows users to adjust the tone of their text using a 2x2 picker interface, with the power of Mistral AI.

**[Link to Deployed App](https://tone-picker-ochre.vercel.app/)**

**[Link to Video Recording](https://www.loom.com/share/cd2fd3fa167f40e9b5604af242d202d2?sid=c4bfb004-1671-4d79-9872-3c06a2b574fc)**

## Core Functionality

- **Text Editor:** A simple and clean editor to write and edit text.
- **Tone Picker:** A 2x2 matrix to adjust the text's tone (e.g., formal to casual).
- **Undo/Redo:** Functionality to track and revert changes.
- **Responsive UI:** A smooth and responsive interface that works on different screen sizes.

## Technical Requirements

### Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components.
- **AI:** [Mistral AI](https://mistral.ai/), Ai SDK by vercel
- **Animation:** Motion
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Deployment:** [Vercel](https://vercel.com/)

### Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ManojBuilds/tone-picker.git
    cd tone-picker
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Mistral AI API key:

    ```
    MISTRAL_API_KEY=your_mistral_api_key
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Brief Explanation

### Technical Architecture Decisions

The project is built with Next.js, which was chosen for its powerful features like server-side rendering, API routes, and a great developer experience. This allowed for a lightweight backend to be implemented within the same framework, fulfilling the requirement for a separate backend to manage API security.

The backend is a simple API route in Next.js (`src/app/api/tone/route.ts`) that handles requests to the Mistral AI API. This approach keeps the API key secure on the server-side and allows for future implementation of caching strategies.

For the frontend, React with TypeScript was the natural choice for building a modern and type-safe user interface. Tailwind CSS with shadcn/ui components was used for styling to quickly build a clean and responsive design.

### State Management

State is managed using Zustand, a small, fast, and scalable state-management solution. It's used to handle the text content, the selected tone, and the history for undo/redo functionality.

The `useToneStore` creates a store that holds the application's state. The undo/redo functionality is implemented by keeping a history of text revisions. When a user changes the text or applies a new tone, a new revision is added to the history. The `undo` and `redo` actions simply move the pointer to the previous or next revision in the history, respectively.

The `persist` middleware from Zustand is used to store the text and revision history in the browser's local storage. This preserves the user's data across sessions, fulfilling the optional persistence requirement.

### Error Handling

Error handling is implemented on both the client and server sides.

- **Client-side:** The application uses `try...catch` blocks when making API calls to the backend. If an error occurs, it is stored in the Zustand store and displayed to the user through a toast notification (using the `sonner` library). This provides clear visual feedback to the user in case of an error.

- **Server-side:** The Next.js API route includes error handling for the Mistral AI API calls. It gracefully handles API failures and edge cases like network errors or invalid API responses. If an error occurs on the server, a proper error response with a relevant status code is sent back to the client.
