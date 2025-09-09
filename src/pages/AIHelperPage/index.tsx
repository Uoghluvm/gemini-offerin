import React, { useState, useEffect } from 'react';
import { PenSquare } from 'lucide-react';
import AIChatView from './components/AIChatView';
import WritingStudio from './components/WritingStudio';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import { Conversation, MessageData, Mentor } from '../../types';
import { MOCK_MENTORS } from '../../lib/mockData';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

interface AIHelperPageProps {
    lang: string;
}

const initialConversations: Conversation[] = [
    {
        id: '1',
        title: 'UK vs. Canada for Data Science',
        messages: [
            { role: 'user', text: 'I\'m trying to decide between the UK and Canada for my Master\'s in Data Science. I have a background in computer science from Fudan. What are the pros and cons?' },
            { role: 'model', text: 'Excellent question. Both countries offer fantastic programs. Let\'s break it down:\n\n**United Kingdom (UK):**\n*   **Pros:** Shorter (usually 1-year) Master\'s programs, which means lower tuition and living costs overall. Home to world-class universities like Cambridge, Oxford, Imperial, and UCL. Strong ties to the European tech and finance hubs.\n*   **Cons:** The post-study work visa (Graduate Route) is typically for 2 years, which can be a tighter timeline for job searching compared to Canada.\n\n**Canada:**\n*   **Pros:** More straightforward and longer post-graduation work permits (PGWP), often up to 3 years, which can lead to a clearer path to permanent residency. Strong and growing tech hubs in Toronto, Vancouver, and Montreal. Known for its high quality of life.\n*   **Cons:** Master\'s programs are often longer (1.5-2 years), leading to higher overall costs. The top university choices might be slightly less concentrated than in the UK.\n\nFor a Fudan CS graduate, you\'d be a strong candidate for top programs in both countries. Have you considered which city or specific program type (e.g., research vs. professional) you prefer?' }
        ]
    },
    {
        id: '2',
        title: 'SOP Brainstorming',
        messages: [
            { role: 'user', text: 'I need to write my Statement of Purpose for a US MSCS program, but I\'m stuck. I have good grades and a decent internship, but I don\'t know how to make my story compelling.' },
            { role: 'model', text: 'That\'s a very common challenge. A great SOP isn\'t just a list of accomplishments; it\'s a narrative that connects your past experiences to your future goals. Let\'s start by brainstorming.\n\nCould you tell me about a specific project from your internship or a university course that you found particularly challenging or exciting? What was the problem, and how did you contribute to solving it?' }
        ]
    }
];


const AIHelperPage: React.FC<AIHelperPageProps> = ({ lang }) => {
    const [mode, setMode] = useState<'chat' | 'writing'>('chat');
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [activeConversationId, setActiveConversationId] = useState<string>('1');
    const [isLoading, setIsLoading] = useState(false);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const handleNewChat = () => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [
                { role: 'model', text: lang === 'zh' ? '你好！我是您的AI助手。今天我能如何帮助您规划留学申请？' : 'Hello! I am your AI Helper. How can I assist you with your university applications today?' }
            ]
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
    };

    const handleSendMessage = async (messageText: string) => {
        if (!activeConversationId) return;

        const userMessage: MessageData = { role: 'user', text: messageText };

        // Immediately update UI with user's message
        const updatedConversations = conversations.map(c =>
            c.id === activeConversationId
                ? { ...c, messages: [...c.messages, userMessage] }
                : c
        );
        setConversations(updatedConversations);
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

            const systemInstruction = lang === 'zh'
                ? '你是一位专业的留学申请AI助手。你的任务是回答用户关于留学规划的问题，并根据我们提供的导师列表，在对话内容与导师专业领域匹配时，推荐最合适的一位导师。'
                : 'You are an expert AI assistant for university applications. Your task is to answer user questions about application planning and, when the conversation matches a mentor\'s expertise from the list we provide, recommend the most suitable one.';
            
            const mentorInfo = MOCK_MENTORS.map(m => `ID: ${m.id}, Name: ${m.name}, University: ${m.university}, Major: ${m.major}, Specialties: ${m.experience}`).join('\n');
            const fullPrompt = `${systemInstruction}\n\nHere is the list of available mentors:\n${mentorInfo}\n\nNow, please answer the user's question:\n"""${messageText}"""`;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    response: { type: Type.STRING, description: 'Your conversational response to the user.' },
                    recommendedMentorId: { type: Type.INTEGER, description: 'The ID of the most suitable mentor to recommend, or 0 if no one is a clear match.', nullable: true }
                },
                required: ['response']
            };

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                }
            });
            
            const responseData = JSON.parse(response.text);

            let mentorRecommendation: Mentor | null = null;
            if (responseData.recommendedMentorId) {
                mentorRecommendation = MOCK_MENTORS.find(m => m.id === responseData.recommendedMentorId) || null;
            }

            const modelMessage: MessageData = {
                role: 'model',
                text: responseData.response,
                mentorRecommendation: mentorRecommendation,
            };
            
            const finalConversations = conversations.map(c => {
                 if (c.id === activeConversationId) {
                    const currentMessages = c.messages.some(m => m.role === 'user') ? c.messages : [];
                    const updatedMessages = [...currentMessages, userMessage, modelMessage];
                     // Generate a title for new chats
                     if (c.title === 'New Chat') {
                         // In a real app, you might make another API call for a title,
                         // but here we'll just use the first user message.
                          return { ...c, messages: updatedMessages, title: messageText.substring(0, 40) + (messageText.length > 40 ? '...' : '') };
                     }
                    return { ...c, messages: updatedMessages };
                }
                return c;
            });
            setConversations(finalConversations);

        } catch (error) {
            console.error("Error generating content:", error);
            const errorMessage: MessageData = {
                role: 'model',
                text: "Sorry, I encountered an error. Please try again."
            };
             setConversations(prev => prev.map(c =>
                c.id === activeConversationId
                    ? { ...c, messages: [...c.messages, errorMessage] }
                    : c
            ));
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex-grow flex items-start justify-center p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200/80 w-full max-w-7xl mx-auto h-[80vh] max-h-[900px]">
                <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50 flex flex-col">
                    <div className="p-4 border-b">
                         <div className="flex space-x-1 p-1 bg-gray-200 rounded-lg">
                            <button 
                                onClick={() => setMode('chat')}
                                className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'chat' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                            >
                                AI Chat
                            </button>
                             <button 
                                onClick={() => setMode('writing')}
                                className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'writing' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                            >
                                AI Writing Studio
                            </button>
                         </div>
                    </div>
                   
                    {mode === 'chat' && (
                       <ChatHistorySidebar
                            conversations={conversations}
                            activeConversationId={activeConversationId}
                            onNewChat={handleNewChat}
                            onSelectChat={setActiveConversationId}
                        />
                    )}
                </aside>
                <main className="flex-1 flex flex-col overflow-hidden">
                    {mode === 'chat' && activeConversation && (
                        <AIChatView
                            key={activeConversationId}
                            lang={lang}
                            conversation={activeConversation}
                            isLoading={isLoading}
                            onSendMessage={handleSendMessage}
                        />
                    )}
                     {mode === 'writing' && <WritingStudio lang={lang} />}
                </main>
            </div>
        </div>
    );
};

export default AIHelperPage;