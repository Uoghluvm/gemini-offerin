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
    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
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
    <div className={`flex items-start gap-4 my-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
          <Bot size={24} />
        </div>
      )}
      <div className={`max-w-2xl p-4 rounded-xl shadow-md ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
        <div className="prose prose-sm max-w-none">
          <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
        </div>
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

const AIHelperPage = ({ lang }) => {
  const [messages, setMessages] = useState([
    { role: 'model', text: lang === 'zh' ? '你好！我是 GlobalEd AI 助手。我可以帮助你规划留学申请、选择学校、润色文书等等。你有什么问题吗？' : 'Hello! I am the GlobalEd AI assistant. I can help you with application planning, school selection, essay polishing, and more. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [activeChatId, setActiveChatId] = useState(1);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 150;
      if (isNearBottom) {
        // Using scrollTo is a more direct way to control the chat container's scroll position,
        // ensuring the main page's scrollbar is not affected.
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: isLoading ? 'auto' : 'smooth',
        });
      }
    }
  }, [messages, isLoading]);

  const handleNewChat = () => {
    setActiveChatId(null);
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
        "How can I find a good mentor?",
        "Help brainstorm my Statement of Purpose",
        "Recommend US universities for CompSci",
        "Key differences: UK vs US applications?",
    ],
    zh: [
        "如何找到并联系一位合适的导师？",
        "帮我为个人陈述找一些灵感",
        "推荐美国的计算机科学硕士项目",
        "英国和美国申请有什么主要区别？"
    ]
  };
  const handleSuggestionClick = (prompt) => {
    setInput(prompt);
    // Focus the textarea after setting the input
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.focus();
  };

  const MOCK_CHAT_HISTORY = [
    { id: 1, title: lang === 'zh' ? '美国CS硕士申请规划' : 'US CS Masters Application Plan' },
    { id: 2, title: lang === 'zh' ? '个人陈述头脑风暴' : 'SOP Brainstorming Session' },
    { id: 3, title: lang === 'zh' ? '英国G5金融专业对比' : 'UK G5 Finance Major Comparison' },
    { id: 4, title: lang === 'zh' ? '如何准备托福考试' : 'How to Prepare for TOEFL' },
    { id: 5, title: lang === 'zh' ? '加拿大签证材料清单' : 'Canada Visa Document Checklist' },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200/80" style={{ height: 'calc(100vh - 8.5rem)', maxHeight: '900px' }}>
        {/* Sidebar */}
        <div className="w-1/4 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <button onClick={handleNewChat} className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm hover:shadow-md">
                <PlusCircle size={16} className="mr-2"/>
                {lang === 'zh' ? '新的对话' : 'New Chat'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
              <nav className="p-2">
                  <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{lang === 'zh' ? '最近的对话' : 'Recent Chats'}</h3>
                  <ul>
                      {MOCK_CHAT_HISTORY.map(chat => (
                          <li key={chat.id}>
                              <a href="#" onClick={(e) => { e.preventDefault(); setActiveChatId(chat.id); }} className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${activeChatId === chat.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-200'}`}>
                                  <MessageSquare size={16} className="mr-3 text-slate-500"/>
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
          <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50/50">
              <BrainCircuit size={24} className="text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">{lang === 'zh' ? 'AI 留学助手' : 'AI Study Abroad Helper'}</h1>
          </div>
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto bg-slate-100">
              {messages.map((msg, index) => (
              <Message key={index} message={msg} onAnalyzeRequest={handleAnalyzeRequest} />
              ))}
              {isLoading && messages[messages.length-1].role === 'user' && <div className="flex items-start gap-4 my-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white flex-shrink-0 shadow-md"><Bot size={24}/></div>
                  <div className="p-4 rounded-xl shadow-md bg-white text-gray-800 rounded-bl-none"><TypingIndicator /></div>
              </div>}
          </div>
          
          <div className="bg-white p-4 border-t border-gray-200">
              {messages.length <= 1 && (
              <div className="mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestionPrompts[lang].map((prompt, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(prompt)} className="text-left p-3 bg-slate-100 hover:bg-slate-200/70 rounded-lg text-sm text-slate-700 transition-colors flex items-center">
                        <Sparkles size={16} className="mr-3 text-blue-500 flex-shrink-0"/>
                        <span>{prompt}</span>
                      </button>
                  ))}
                  </div>
              </div>
              )}

              {error && <p className="mb-2 text-red-500 text-sm">{error}</p>}
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
                  placeholder={lang === 'zh' ? '在这里输入你的问题...' : 'Type your question here...'}
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
      </div>
    </div>
  );
};

export default AIHelperPage;