import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageData } from '../../../types';
import Message from './Message';
import TypingIndicator from '../../../components/common/TypingIndicator';

interface WritingAssistantProps {
    lang: string;
}

const WritingAssistant: React.FC<WritingAssistantProps> = ({ lang }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<MessageData | null>(null);

    const handleAnalyze = async (analysisType: 'grammar' | 'originality') => {
        if (!text.trim()) return;
        setIsLoading(true);
        setAnalysisResult(null);

        const prompt = analysisType === 'grammar' 
            ? `Please check the grammar of the following text and provide corrections and suggestions. Text: "${text}"`
            : `Please analyze the originality of the following text. Is it plagiarized? Provide a brief analysis. Text: "${text}"`;

        try {
            // FIX: Initialize GoogleGenAI with apiKey object as per SDK guidelines.
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
            // FIX: Call ai.models.generateContent with the correct model name.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            // FIX: Access the 'text' property directly from the response.
            const resultText = response.text;

            const newResult: MessageData = {
                role: 'model',
                text: '',
                analysisResult: {
                    type: analysisType,
                    result: resultText,
                }
            };
            setAnalysisResult(newResult);
        } catch (error) {
            console.error("Error analyzing text:", error);
            const errorResult: MessageData = {
                role: 'model',
                text: 'Sorry, I encountered an error while analyzing the text.',
                analysisResult: null,
            };
            setAnalysisResult(errorResult);
        } finally {
            setIsLoading(false);
        }
    };

    const labels = {
        en: {
            title: "Writing Assistant",
            description: "Paste your text below to get feedback on grammar, originality, and more.",
            placeholder: "Enter your text here...",
            grammar: "Check Grammar",
            originality: "Check Originality",
            analysis: "Analysis Result"
        },
        zh: {
            title: "写作助手",
            description: "将您的文本粘贴到下方，以获取有关语法、原创性等方面的反馈。",
            placeholder: "在此输入您的文本...",
            grammar: "语法检查",
            originality: "原创性检查",
            analysis: "分析结果"
        }
    }
    const currentLabels = labels[lang as 'en'|'zh'];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{currentLabels.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{currentLabels.description}</p>
            <textarea
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={currentLabels.placeholder}
            />
            <div className="mt-4 flex space-x-2">
                <button 
                    onClick={() => handleAnalyze('grammar')} 
                    disabled={isLoading || !text.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {currentLabels.grammar}
                </button>
                <button 
                    onClick={() => handleAnalyze('originality')} 
                    disabled={isLoading || !text.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                    {currentLabels.originality}
                </button>
            </div>
            
            {(isLoading || analysisResult) && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">{currentLabels.analysis}</h3>
                    {isLoading && <TypingIndicator />}
                    {analysisResult && (
                        <Message message={analysisResult} lang={lang} />
                    )}
                </div>
            )}
        </div>
    );
};

export default WritingAssistant;
