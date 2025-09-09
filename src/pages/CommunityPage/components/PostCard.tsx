import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, UserPlus } from 'lucide-react';
import { VerificationBadge } from '../../../components/common/VerificationBadge';
import { Post } from '../../../types';

interface PostCardProps {
    post: Post;
    type: 'student' | 'mentor';
    lang: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, type, lang }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-6">
            <div className="flex items-start">
                <img className="h-14 w-14 rounded-full object-cover mr-4" src={post.avatar} alt={post.name}/>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{post.name}</h3>
                             <div className="flex space-x-2 mt-1">
                                <VerificationBadge verified={post.verified} type="name" lang={lang} />
                                <VerificationBadge verified={post.verified} type="school" lang={lang} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button onClick={() => alert(`'Add Friend' for ${post.name} clicked. Not implemented.`)} className="flex items-center text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md">
                                 <UserPlus size={16} className="mr-1.5"/> Add Friend
                             </button>
                             <Link to={`/chat/${post.userId}`} className="flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md">
                                 <MessageSquare size={16} className="mr-1.5"/> Chat
                             </Link>
                        </div>
                    </div>
                     <div className="mt-3 text-sm text-gray-700 space-y-2 border-t pt-3">
                         {type === 'mentor' ? (
                             <>
                                <p><span className="font-semibold text-gray-500">University:</span> {post.university} - {post.major}</p>
                                <p><span className="font-semibold text-gray-500">Background:</span> {post.background}</p>
                                <p><span className="font-semibold text-gray-500">Can Help With:</span> {post.services}</p>
                             </>
                         ) : (
                            <>
                                <p><span className="font-semibold text-gray-500">Target:</span> {post.target}</p>
                                <p><span className="font-semibold text-gray-500">Background:</span> {post.background}</p>
                                <p><span className="font-semibold text-gray-500">Seeking Help With:</span> {post.needs}</p>
                            </>
                         )}
                     </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard;
