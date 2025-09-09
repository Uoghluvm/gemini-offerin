# GlobalEd Mentor: AI-Powered Study Abroad Platform

## 1. Project Overview

GlobalEd Mentor is a one-stop platform for students applying to study abroad. It combines mentor consultation, an AI assistant for intelligent planning, a comprehensive resource library, and a user community. Key features include mentor matching, application planning, AI chat powered by the Gemini API, and secure milestone-based payments.

## 2. Tech Stack

*   **Frontend Framework:** [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI:** [Google Gemini API (`@google/genai`)](https://ai.google.dev/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)

## 3. Project Structure

The project follows a standard component-based architecture. Here is a breakdown of the key files and directories:

```
.
├── README.md             # This file. Project documentation.
├── index.html            # Main HTML entry point, loads scripts and styles.
├── index.tsx             # Mounts the React application to the DOM.
├── metadata.json         # Contains application metadata.
└── src/
    ├── App.tsx           # Root component, handles routing and global state.
    ├── components/       # Reusable UI components shared across the app.
    │   ├── common/       # Generic components (e.g., StarRating, VerificationBadge).
    │   ├── layout/       # Structural components (Header, Footer).
    │   ├── mentor/       # Mentor-related components (MentorCard).
    │   └── payment/      # Payment-related components (PaymentModal).
    ├── lib/              # Helper libraries, constants, and mock data.
    │   ├── mockData.ts   # Mock data for users, mentors, chats, etc.
    │   └── translations.ts # Language strings for i18n (en, zh).
    ├── pages/            # Top-level page components for each route.
    │   ├── HomePage/
    │   ├── FindMentorPage/
    │   ├── AIHelperPage/ # Contains the core Gemini API logic.
    │   ├── ProfilePage/
    │   └── ... (other pages)
    └── types/
        └── index.ts      # TypeScript type definitions for the entire app.
```

## 4. Core Features & Implementation

The application is divided into several pages, each representing a core feature.

### A. Routing and Global State (`src/App.tsx`)

This is the heart of the application. It uses `react-router-dom` to manage navigation and holds the "global" state for the logged-in user, language, and authentication status.

```tsx
// src/App.tsx

const App = () => {
  // Global state for language, login status, and current user
  const [lang, setLang] = useState('en');
  const [loggedIn, setLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_STUDENT_USER);

  // ...

  return (
    <HashRouter>
      {/* ... Header and Footer ... */}
      <main className="flex-grow">
        <Routes>
          {/* All application routes are defined here */}
          <Route path="/" element={<HomePage t={t}/>} />
          <Route path="/mentors" element={<FindMentorPage lang={lang} t={t} currentUser={currentUser} />} />
          <Route path="/ai-helper" element={<AIHelperPage lang={lang} />} />
          <Route path="/profile" element={<ProfilePage lang={lang} currentUser={currentUser} />} />
          {/* ... other routes */}
        </Routes>
      </main>
    </HashRouter>
  );
};
```

### B. AI Helper with Gemini API (`src/pages/AIHelperPage/index.tsx`)

This is the most complex feature. It uses the `@google/genai` library to provide an intelligent chat assistant. The core logic is in the `handleSendMessage` function.

**How it works:**
1.  **System Instruction:** It provides a detailed system instruction to the Gemini model, telling it to act as an expert study abroad assistant.
2.  **Mentor Data:** It injects the list of available mentors into the prompt so the AI can make informed recommendations.
3.  **JSON Output:** It requests a structured JSON response from the model using `responseSchema`. This ensures the AI's answer is predictable and includes a text response and an optional `recommendedMentorId`.
4.  **UI Update:** When the response is received, it's parsed, and the UI is updated with the AI's message and a `MentorRecommendationCard` if a mentor was recommended.

```tsx
// src/pages/AIHelperPage/index.tsx
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { MOCK_MENTORS } from '../../lib/mockData';
import { MessageData } from '../../types';


const handleSendMessage = async (messageText: string) => {
    // ... setup code ...
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

        // 1. Construct the prompt with system instructions and mentor data
        const systemInstruction = 'You are an expert AI assistant...';
        const mentorInfo = MOCK_MENTORS.map(m => `ID: ${m.id}, Name: ${m.name}, Specialties: ${m.experience}`).join('\n');
        const fullPrompt = `${systemInstruction}\n\nMentors:\n${mentorInfo}\n\nUser Question:\n"""${messageText}"""`;

        // 2. Define the expected JSON schema for the response
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                response: { type: Type.STRING },
                recommendedMentorId: { type: Type.INTEGER, nullable: true }
            },
            required: ['response']
        };

        // 3. Call the Gemini API
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });
        
        // 4. Parse the response and update the UI
        const responseData = JSON.parse(response.text);
        const mentorRecommendation = MOCK_MENTORS.find(m => m.id === responseData.recommendedMentorId);
        const modelMessage: MessageData = {
            role: 'model',
            text: responseData.response,
            mentorRecommendation: mentorRecommendation || null,
        };
        // ... update state with the new message
    } catch (error) {
        // ... handle errors
    } finally {
        // ... stop loading
    }
};
```

### C. User Profiles & Payments (`src/pages/ProfilePage/index.tsx`)

This page displays user information and manages the milestone-based payment plan. For students, it also includes logic for adding payment methods (`Alipay`, `Credit Card`) via modals. The payment flow is designed to be secure, with students releasing funds only after a milestone is completed to their satisfaction.

### D. Data Handling (`src/lib/mockData.ts` and `src/types/index.ts`)

Currently, all data is mocked and stored in `src/lib/mockData.ts`. This makes development fast and predictable. The data structures are strictly typed in `src/types/index.ts`. To connect to a real backend, you would replace the calls to the mock data with `fetch` or `axios` requests to your API endpoints. The component-based structure means you'd only need to change the data-fetching logic, not the UI components themselves.

## 5. Getting Started

To run this project locally, you would typically follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Set Up Environment Variables:**
    Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    API_KEY=your_gemini_api_key_here
    ```
3.  **Run the Development Server:**
    ```bash
    npm start
    ```
    This will open the application in your browser, usually at `http://localhost:3000`.
