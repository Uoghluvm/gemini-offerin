import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, FileText, PlusCircle } from 'lucide-react';
import { MessageData } from '../../types';
import Message from './components/Message';
import WritingAssistant from './components/WritingAssistant';
import { MOCK_MENTORS } from '../../lib/mockData';

interface AIHelperPageProps {
    lang: string;
}

const ChatAssistant: React.FC<{ lang: string }> = ({ lang }) => {
    const initialMessages: MessageData[] = [
        { role: 'model', text: 'Hello! How can I help you with your university applications today?' }
    ];
    
    const [messages, setMessages] = useState<MessageData[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleNewChat = () => {
        setMessages(initialMessages);
    };

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: MessageData = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // FIX: Initialize GoogleGenAI with apiKey object as per SDK guidelines.
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
            // FIX: Call ai.models.generateContent with the correct model name and config.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: input,
                config: {
                    systemInstruction: 'You are an expert AI assistant for students applying to universities abroad. Your goal is to be helpful and supportive. If the user asks for a mentor, you should recommend one. When you recommend a mentor, respond with the text "Here is a mentor I recommend:" followed by the JSON string for one mentor object. Choose a random mentor from this list: ' + JSON.stringify(MOCK_MENTORS),
                }
            });

            // FIX: Access the 'text' property directly from the response.
            let responseText = response.text;
            
            let modelMessage: MessageData = { role: 'model', text: responseText };

            // Check if the response contains a mentor recommendation
            const mentorRegex = /Here is a mentor I recommend: (\{.*\})/;
            const match = responseText.match(mentorRegex);

            if (match && match[1]) {
                try {
                    const mentorJson = JSON.parse(match[1]);
                    modelMessage.text = responseText.replace(mentorRegex, '').trim();
                    modelMessage.mentorRecommendation = mentorJson;
                } catch (e) {
                    console.error("Failed to parse mentor JSON:", e);
                }
            }

            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: MessageData = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 20rem)', minHeight: '400px', maxHeight: '700px' }}>
            <div className="p-3 border-b border-gray-200 flex justify-end items-center bg-gray-50/50 rounded-t-lg">
                <button 
                    onClick={handleNewChat} 
                    className="flex items-center text-sm font-semibold bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50"
                >
                    <PlusCircle size={16} className="mr-2"/>
                    {lang === 'zh' ? '新对话' : 'New Chat'}
                </button>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-slate-100">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} lang={lang} />
                ))}
                {isLoading && <Message message={{role: 'model', text: ''}} lang={lang} isLoading={true}/>}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={lang === 'zh' ? '输入您的问题...' : "Ask anything about applications..."}
                        className="flex-1 bg-transparent p-2 focus:outline-none resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || input.trim() === ''}
                        className="bg-blue-600 text-white p-2.5 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                        aria-label="Send message"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AIHelperPage: React.FC<AIHelperPageProps> = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('chat');
    
    const tabs = {
        en: { chat: 'Chat Assistant', writing: 'Writing Assistant' },
        zh: { chat: 'AI 聊天助手', writing: '写作助手' },
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{lang === 'zh' ? 'AI 助手' : 'AI Helper'}</h1>
            
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`${
                            activeTab === 'chat'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Bot size={16} className="mr-2" />
                        {tabs[lang as 'en' | 'zh'].chat}
                    </button>
                    <button
                        onClick={() => setActiveTab('writing')}
                        className={`${
                            activeTab === 'writing'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <FileText size={16} className="mr-2" />
                        {tabs[lang as 'en' | 'zh'].writing}
                    </button>
                </nav>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                {activeTab === 'chat' ? <ChatAssistant lang={lang} /> : <WritingAssistant lang={lang} />}
            </div>
        </div>
    );
};

export default AIHelperPage;