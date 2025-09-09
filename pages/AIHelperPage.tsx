import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Clipboard, Check, BrainCircuit, SpellCheck, ThumbsUp, ThumbsDown, Sparkles, PlusCircle, MessageSquare } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// In a real app, you would have a secure way to manage the API key.
// Here we assume it is set in the environment.
const API_KEY = process.env.API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const systemInstruction = `You are an expert AI assistant for students applying to universities abroad. Your name is 'GlobalEd AI'. Your knowledge covers application procedures, university requirements, major details, and visa processes for countries like the USA, UK, Canada, Australia, and top destinations in Europe and Asia. You must provide accurate, helpful, and encouraging advice. When asked for recommendations, always ask clarifying questions about the user's academic background (GPA, test scores), interests, and budget. You can also help draft and refine application essays, personal statements, and resumes. Format your responses clearly using markdown, such as lists and bold text, to improve readability.`;


const TypingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

const Message = ({ message, onAnalyzeRequest }) => {
  const [copied, setCopied] = useState(false);
  const { role, text, isAnalyzing, analysisResult } = message;
  const isUser = role === 'user';
  const isModel = role === 'model';

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
          <Bot size={24} />
        </div>
      )}
      <div className={`max-w-2xl p-4 rounded-xl shadow-sm ${isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
        <div className="prose prose-sm max-w-none">
          <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
        </div>
        {isModel && !isAnalyzing && text && (
          <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-gray-500">
                <button onClick={() => onAnalyzeRequest('grammar', text)} className="flex items-center text-xs hover:text-blue-600"><SpellCheck size={14} className="mr-1"/> Check Grammar</button>
                <button onClick={() => onAnalyzeRequest('originality', text)} className="flex items-center text-xs hover:text-blue-600"><Sparkles size={14} className="mr-1"/> Improve Originality</button>
            </div>
             <button onClick={handleCopy} className="text-gray-400 hover:text-gray-700">
                {copied ? <Check size={16} /> : <Clipboard size={16} />}
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
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
          <User size={24} />
        </div>
      )}
    </div>
  );
};

const AIHelperPage = ({ lang }) => {
  const [messages, setMessages] = useState([
    { role: 'model', text: lang === 'zh' ? '你好！我是 GlobalEd AI 助手。我可以帮助你规划留学申请、选择学校、润色文书等等。你有什么问题吗？' : 'Hello! I am the GlobalEd AI assistant. I can help you with application planning, school selection, essay polishing, and more. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
        const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 150;
        if (isNearBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: isLoading ? 'auto' : 'smooth' });
        }
    }
  }, [messages, isLoading]);

  const handleNewChat = () => {
    setMessages([
        { role: 'model', text: lang === 'zh' ? '新的对话开始了！有什么可以帮你的吗？' : 'New chat started! How can I help?' }
    ]);
    setError('');
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    if (!ai) {
      setError("Gemini API key is not configured. Please set the API_KEY environment variable.");
      return;
    }

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: systemInstruction },
        history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })).filter(m => m.role !== 'system'),
      });

      const result = await chat.sendMessageStream({ message: input });

      let currentText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        currentText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = currentText;
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      setError(lang === 'zh' ? '抱歉，处理您的请求时发生错误。请稍后再试。' : 'Sorry, an error occurred while processing your request. Please try again later.');
      setMessages(prev => [...prev, { role: 'model', text: lang === 'zh' ? '哎呀，出错了！' : 'Oops, something went wrong!' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnalyzeRequest = async (type, textToAnalyze) => {
    if (!ai || isLoading) return;
    
    const messageIndex = messages.findIndex(m => m.text === textToAnalyze);
    if (messageIndex === -1) return;
    
    setMessages(prev => prev.map((msg, index) => index === messageIndex ? { ...msg, isAnalyzing: true, analysisResult: null } : msg));
    setIsLoading(true);

    const prompt = type === 'grammar'
      ? `Please act as an expert proofreader. Correct any grammatical errors, spelling mistakes, and awkward phrasing in the following text. Provide the corrected version and a brief explanation of the key changes.\n\nText: "${textToAnalyze}"`
      : `Analyze the following text for originality and impact, as if it were part of a university application. Does it seem generic or use common clichés? Provide specific, constructive feedback on how to make it more unique, personal, and compelling. Offer alternative phrasing or ideas.\n\nText: "${textToAnalyze}"`;
      
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const resultText = response.text;
        setMessages(prev => prev.map((msg, index) => 
          index === messageIndex 
            ? { ...msg, isAnalyzing: false, analysisResult: { type, result: resultText } } 
            : msg
        ));
    } catch (err) {
        console.error('Analysis error:', err);
        setMessages(prev => prev.map((msg, index) => 
            index === messageIndex 
            ? { ...msg, isAnalyzing: false, analysisResult: { type, result: 'Error performing analysis.' } } 
            : msg
        ));
    } finally {
        setIsLoading(false);
    }
  };

  const suggestionPrompts = {
    en: [
        "How can I find and contact a good mentor?",
        "Help me brainstorm ideas for my Statement of Purpose",
        "Recommend some US universities for a Computer Science Master's",
        "What are the key differences between UK and US applications?",
    ],
    zh: [
        "我如何找到并联系一位合适的导师？",
        "帮我为个人陈述找一些写作灵感",
        "为我推荐一些美国的计算机科学硕士项目",
        "英国和美国的大学申请有什么主要区别？"
    ]
  };
  const handleSuggestionClick = (prompt) => setInput(prompt);

  // Mock chat history
  const MOCK_CHAT_HISTORY = [
    { id: 1, title: lang === 'zh' ? '美国CS硕士申请' : 'US CS Masters Application' },
    { id: 2, title: lang === 'zh' ? '个人陈述头脑风暴' : 'SOP Brainstorming' },
    { id: 3, title: lang === 'zh' ? '英国G5金融专业' : 'UK G5 Finance Major' },
  ];

  return (
    <div className="container mx-auto my-4 h-[calc(100vh-140px)] flex bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-50 border-r flex flex-col">
        <div className="p-4 border-b">
           <button onClick={handleNewChat} className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold">
               <PlusCircle size={16} className="mr-2"/>
               {lang === 'zh' ? '新的对话' : 'New Chat'}
           </button>
        </div>
        <div className="flex-1 overflow-y-auto">
            <nav className="p-2">
                <ul>
                    {MOCK_CHAT_HISTORY.map(chat => (
                        <li key={chat.id}>
                            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-200">
                                <MessageSquare size={16} className="mr-3 text-gray-500"/>
                                <span className="truncate">{chat.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="w-3/4 flex flex-col">
        <div className="p-4 border-b flex items-center space-x-3 bg-white">
            <BrainCircuit size={24} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">{lang === 'zh' ? 'AI 留学助手' : 'AI Study Abroad Helper'}</h1>
        </div>
        <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto bg-gray-100/50">
            {messages.map((msg, index) => (
            <Message key={index} message={msg} onAnalyzeRequest={handleAnalyzeRequest} />
            ))}
            {isLoading && messages[messages.length-1].role === 'user' && <div className="flex items-start gap-4 my-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0"><Bot size={24}/></div>
                <div className="p-4 rounded-xl shadow-sm bg-white text-gray-800"><TypingIndicator /></div>
            </div>}
            <div ref={messagesEndRef} />
        </div>
        
        <div className="bg-white p-4 border-t">
            {messages.length <= 1 && (
            <div className="mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestionPrompts[lang].map((prompt, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(prompt)} className="text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors">
                    {prompt}
                    </button>
                ))}
                </div>
            </div>
            )}

            {error && <p className="mb-2 text-red-500 text-sm">{error}</p>}
            <div className="flex items-center bg-gray-100 rounded-lg p-2">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
                }}
                placeholder={lang === 'zh' ? '在这里输入你的问题...' : 'Type your question here...'}
                className="flex-1 bg-transparent p-2 focus:outline-none resize-none"
                rows={1}
                disabled={isLoading}
            />
            <button
                onClick={handleSend}
                disabled={isLoading || input.trim() === ''}
                className="bg-blue-600 text-white p-2 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
                <Send size={20} />
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIHelperPage;
