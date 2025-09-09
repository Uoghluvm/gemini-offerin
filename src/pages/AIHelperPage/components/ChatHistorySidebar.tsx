import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { Conversation } from '../../../types';

interface ChatHistorySidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
    conversations,
    activeConversationId,
    onNewChat,
    onSelectChat,
}) => {
    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-4">
                 <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                >
                    <Plus size={18} className="mr-2" />
                    New Chat
                </button>
            </div>
            <nav className="flex-1 px-2 space-y-1">
                {conversations.map((convo) => (
                    <button
                        key={convo.id}
                        onClick={() => onSelectChat(convo.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-left ${
                            convo.id === activeConversationId
                                ? 'bg-blue-100 text-blue-800'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <MessageSquare size={16} className="mr-3 flex-shrink-0" />
                        <span className="truncate flex-1">{convo.title}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default ChatHistorySidebar;
