import React, { useState } from 'react';
import { User } from '../../../types';

interface NewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (content: string) => void;
    currentUser: User;
    lang: string;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onSubmit, currentUser }) => {
    const [content, setContent] = useState('');
    if (!isOpen) return null;

    const isMentor = currentUser.role === 'mentor';
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(content);
        setContent('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{isMentor ? 'Offer Mentorship' : 'Seek Mentorship'}</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={isMentor ? 'Describe the services you offer...' : 'Describe what you need help with...'}
                        required
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPostModal;
