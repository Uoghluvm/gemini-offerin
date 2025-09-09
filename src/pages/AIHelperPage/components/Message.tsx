import React, { useState } from 'react';
import { Bot, User, Clipboard, Check, SpellCheck, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageData } from '../../../types';
import MentorRecommendationCard from './MentorRecommendationCard';
import TypingIndicator from '../../../components/common/TypingIndicator';

interface MessageProps {
    message: MessageData;
    onAnalyzeRequest: (type: 'grammar' | 'originality', text: string) => void;
    lang: string;
}

const Message: React.FC<MessageProps> = ({ message, onAnalyzeRequest, lang }) => {
  const [copied, setCopied] = useState(false);
  const { role, text, isAnalyzing, analysisResult, mentorRecommendation } = message;
  const isUser = role === 'user';
  const isModel = role === 'model';

  const handleCopy = () => {
    if (text) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className={`flex items-start gap-4 my-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
          <Bot size={24} />
        </div>
      )}
      <div className={`max-w-2xl p-4 rounded-xl shadow-md ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
        <div className="prose prose-sm max-w-none">
          {text && <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>}
        </div>
         {mentorRecommendation && (
            <MentorRecommendationCard mentor={mentorRecommendation} lang={lang} />
         )}
        {isModel && !isAnalyzing && text && (
          <div className="mt-3 pt-2 border-t border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-gray-500">
                <button onClick={() => onAnalyzeRequest('grammar', text)} className="flex items-center text-xs hover:text-blue-600 transition-colors"><SpellCheck size={14} className="mr-1"/> Check Grammar</button>
                <button onClick={() => onAnalyzeRequest('originality', text)} className="flex items-center text-xs hover:text-blue-600 transition-colors"><Sparkles size={14} className="mr-1"/> Improve Originality</button>
            </div>
             <button onClick={handleCopy} className="text-gray-400 hover:text-gray-700 transition-colors">
                {copied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
            </button>
          </div>
        )}
        {isAnalyzing && <div className="mt-2"><TypingIndicator /></div>}
        {analysisResult && (
           <div className="mt-3 pt-3 border-t border-blue-200">
               <h4 className="text-xs font-bold text-blue-700 mb-1">{analysisResult.type === 'grammar' ? 'Grammar & Style Check' : 'Originality Feedback'}</h4>
               <div className="prose prose-sm max-w-none text-gray-700 bg-blue-50 p-3 rounded-md">
                 <Markdown remarkPlugins={[remarkGfm]}>{analysisResult.result}</Markdown>
               </div>
           </div>
        )}
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0 shadow-md">
          <User size={24} />
        </div>
      )}
    </div>
  );
};

export default Message;
