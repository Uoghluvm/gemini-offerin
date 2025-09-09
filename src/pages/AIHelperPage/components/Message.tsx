import React, { useState } from 'react';
import { Bot, User, Copy, Pencil, Check } from 'lucide-react';
import { MessageData } from '../../../types';
import MentorRecommendationCard from './MentorRecommendationCard';
import TypingIndicator from '../../../components/common/TypingIndicator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
    message: MessageData;
    lang: string;
    isLoading?: boolean;
    isLastUserMessage?: boolean;
    onEdit?: (text: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, lang, isLoading = false, isLastUserMessage, onEdit }) => {
    const isUser = message.role === 'user';
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const renderAnalysisResult = () => {
        if (!message.analysisResult) return null;
        
        const titles = {
            en: { grammar: 'Grammar Analysis', originality: 'Originality Analysis' },
            zh: { grammar: '语法分析', originality: '原创性分析' },
        };
        const title = titles[lang as 'en'|'zh'][message.analysisResult.type];

        return (
            <div className="mt-2 p-3 border border-gray-200 bg-gray-50 rounded-md">
                <h4 className="font-semibold text-sm text-gray-800 mb-1">{title}</h4>
                <p className="text-sm whitespace-pre-wrap">{message.analysisResult.result}</p>
            </div>
        )
    }

    return (
        <div className={`group flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                    <Bot size={20}/>
                </div>
            )}
            
            <div className={`relative max-w-xl p-3 pb-8 rounded-xl shadow-sm ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                {isLoading ? <TypingIndicator /> : (
                    <div className="prose prose-sm max-w-none text-inherit">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.text}
                       </ReactMarkdown>
                        {message.analysisResult && renderAnalysisResult()}
                        {message.mentorRecommendation && <MentorRecommendationCard mentor={message.mentorRecommendation} lang={lang} />}
                    </div>
                )}
                 {!isLoading && message.text && (
                    <div className={`absolute bottom-1 right-1 hidden group-hover:flex items-center gap-1 p-0.5 rounded-lg shadow ${isUser ? 'bg-blue-600' : 'bg-gray-100'}`}>
                        {isLastUserMessage && onEdit && (
                            <button onClick={() => onEdit(message.text)} className={`p-1.5 rounded-full ${isUser ? 'text-blue-100 hover:bg-blue-700/70' : 'text-gray-500 hover:bg-gray-200'}`}>
                                <Pencil size={14} />
                            </button>
                        )}
                        <button onClick={handleCopy} className={`p-1.5 rounded-full ${isUser ? 'text-blue-100 hover:bg-blue-700/70' : 'text-gray-500 hover:bg-gray-200'}`}>
                            {isCopied ? <Check size={14} className={isUser ? 'text-green-300' : 'text-green-600'}/> : <Copy size={14} />}
                        </button>
                    </div>
                )}
            </div>

            {isUser && (
                 <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white flex-shrink-0">
                    <User size={20}/>
                </div>
            )}
        </div>
    );
};

export default Message;