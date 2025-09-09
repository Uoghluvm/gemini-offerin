import React from 'react';
import { Bot, User } from 'lucide-react';
import { MessageData } from '../../../types';
import MentorRecommendationCard from './MentorRecommendationCard';
import TypingIndicator from '../../../components/common/TypingIndicator';

interface MessageProps {
    message: MessageData;
    lang: string;
    isLoading?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, lang, isLoading = false }) => {
    const isUser = message.role === 'user';

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
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                    <Bot size={20}/>
                </div>
            )}

            <div className={`max-w-xl p-3 rounded-xl shadow-md ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                {isLoading ? <TypingIndicator /> : (
                    <>
                        {message.text && <p className="text-sm">{message.text}</p>}
                        {message.analysisResult && renderAnalysisResult()}
                        {message.mentorRecommendation && <MentorRecommendationCard mentor={message.mentorRecommendation} lang={lang} />}
                    </>
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
