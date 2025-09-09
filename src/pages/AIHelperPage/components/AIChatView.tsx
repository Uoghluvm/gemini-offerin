import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Message from './Message';
import { Conversation } from '../../../types';

interface AIChatViewProps {
    lang: string;
    conversation: Conversation;
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const AIChatView: React.FC<AIChatViewProps> = ({ lang, conversation, isLoading, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [conversation.messages, isLoading]);

    const handleSend = () => {
        if (input.trim() === '' || isLoading) return;
        onSendMessage(input);
        setInput('');
    };

    const handleEdit = (text: string) => {
        setInput(text);
        inputRef.current?.focus();
    };
    
    // Find the index of the absolute last message that was sent by the user
    const lastUserMessageIndex = conversation.messages.map(m => m.role).lastIndexOf('user');

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 p-6 overflow-y-auto">
                {conversation.messages.map((msg, index) => (
                    <Message
                        key={`${conversation.id}-${index}`}
                        message={msg}
                        lang={lang}
                        isLastUserMessage={index === lastUserMessageIndex}
                        onEdit={handleEdit}
                    />
                ))}
                {isLoading && <Message message={{ role: 'model', text: '' }} lang={lang} isLoading={true} />}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={lang === 'zh' ? '询问任何关于申请的问题...' : 'Ask me anything about your application...'}
                        className="flex-1 bg-transparent p-2 focus:outline-none resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={input.trim() === '' || isLoading}
                        className="bg-blue-600 text-white p-2.5 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                        aria-label="Send message"
                    >
                        <Send size={20} />
                    </button>
                </div>
                 <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-2">
                    <p>Powered by Gemini</p>
                </div>
            </div>
        </div>
    );
};

export default AIChatView;
