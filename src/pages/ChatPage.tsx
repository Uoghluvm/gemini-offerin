import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_MENTORS, MOCK_CHATS } from '../lib/mockData';
import { Send, ArrowLeft } from 'lucide-react';
import { User, ChatMessage } from '../types';

interface ChatPageProps {
    currentUser: User;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser }) => {
    const { userId } = useParams<{ userId: string }>();
    const otherUserId = userId ? parseInt(userId) : -1;
    const otherUser = MOCK_MENTORS.find(m => m.id === otherUserId);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const getChatHistory = (): ChatMessage[] => {
        const key = [currentUser.id, otherUserId].sort((a,b) => a - b).join('-');
        return MOCK_CHATS[key] || [];
    };
    
    const [messages, setMessages] = useState<ChatMessage[]>(getChatHistory());
    const [input, setInput] = useState('');

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (!otherUser) {
        return <div className="p-8 text-center">User not found.</div>;
    }

    const handleSend = () => {
        if (input.trim() === '') return;
        const newMessage: ChatMessage = {
            senderId: currentUser.id,
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
        setInput('');
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200/80" style={{ height: 'calc(100vh - 8.5rem)', maxHeight: '900px' }}>
                <div className="w-full flex flex-col">
                    <div className="p-4 border-b border-slate-200 flex items-center space-x-4 bg-slate-50/50">
                        <Link to="/mentors" className="text-gray-500 hover:text-gray-800">
                            <ArrowLeft size={20} />
                        </Link>
                        <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full"/>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{otherUser.name}</h2>
                            <p className="text-xs text-gray-500">{otherUser.major}</p>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto bg-slate-100">
                        {messages.map((msg, index) => {
                            const isCurrentUser = msg.senderId === currentUser.id;
                            return (
                                <div key={index} className={`flex items-end gap-3 my-4 ${isCurrentUser ? 'justify-end' : ''}`}>
                                    {!isCurrentUser && <img src={otherUser.avatar} className="w-8 h-8 rounded-full flex-shrink-0"/>}
                                    <div className={`max-w-md p-3 rounded-xl shadow-md ${isCurrentUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'} text-right`}>{msg.timestamp}</p>
                                    </div>
                                    {isCurrentUser && <img src={currentUser.avatar} className="w-8 h-8 rounded-full flex-shrink-0"/>}
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white p-4 border-t border-gray-200">
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
                                placeholder={`Message ${otherUser.name}...`}
                                className="flex-1 bg-transparent p-2 focus:outline-none resize-none"
                                rows={1}
                            />
                            <button
                                onClick={handleSend}
                                disabled={input.trim() === ''}
                                className="bg-blue-600 text-white p-2.5 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                aria-label="Send message"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;