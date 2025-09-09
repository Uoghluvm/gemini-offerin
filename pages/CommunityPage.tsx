import React, { useState } from 'react';
import { User, MessageSquare, UserPlus, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { VerificationBadge } from '../App';

const MOCK_MENTOR_POSTS = [
    { id: 1, name: 'Alex Chen', avatar: 'https://picsum.photos/id/1005/200/200', university: 'Carnegie Mellon University', major: 'Machine Learning', verified: { name: true, school: true }, background: 'B.Eng from SJTU. Interned at Google & MSRA.', services: 'SOP review, technical interview prep, research matching.'},
    { id: 2, name: 'Emily White', avatar: 'https://picsum.photos/id/1028/200/200', university: 'University of Oxford', major: 'Philosophy, Politics and Economics (PPE)', verified: { name: true, school: true }, background: 'Graduated top of my class from Peking University. Received offers from both Oxford and Cambridge.', services: 'Personal statement crafting, interview coaching for Oxbridge.'},
];

const MOCK_STUDENT_POSTS = [
    { id: 1, name: 'Sophia Chen', avatar: 'https://picsum.photos/id/1016/200/200', target: 'USA, Computer Science (MS)', verified: { name: true, school: false }, background: 'B.Sc. in Software Engineering from Fudan University, GPA 3.8/4.0.', needs: 'Looking for guidance on my Statement of Purpose for top-tier US MSCS programs and advice on choosing between research-focused vs. professional master\'s.'},
    { id:2, name: 'David Li', avatar: 'https://picsum.photos/id/1018/200/200', target: 'UK, Finance (MSc)', verified: { name: true, school: false }, background: 'B.A. in Economics from Renmin University, GPA 3.7/4.0, GMAT 740.', needs: 'Seeking a mentor with experience applying to LSE, Imperial, or similar top UK schools for finance. Need help tailoring my CV and preparing for Kira Talent video interviews.'}
]

const PostCard = ({ post, type, lang }) => {
    const isMentorPost = type === 'mentor';
    
    const handleActionClick = (action) => {
        alert(`${action} button clicked for ${post.name}. This feature would be implemented in a full application.`);
    }

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
                             <button onClick={() => handleActionClick('Add Friend')} className="flex items-center text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md">
                                 <UserPlus size={16} className="mr-1.5"/> Add Friend
                             </button>
                             <button onClick={() => handleActionClick('Chat')} className="flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md">
                                 <MessageSquare size={16} className="mr-1.5"/> Chat
                             </button>
                        </div>
                    </div>
                     <div className="mt-3 text-sm text-gray-700 space-y-2 border-t pt-3">
                         {isMentorPost ? (
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


const CommunityPage = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('students'); // 'students' or 'mentors'

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Community Hub</h1>
                <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold">
                    <PlusCircle size={20} className="mr-2"/> Create New Post
                </button>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`${
                            activeTab === 'students'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        {lang === 'zh' ? '寻找导师 (学生发帖)' : 'Seeking Help (Find a Mentor)'}
                    </button>
                    <button
                        onClick={() => setActiveTab('mentors')}
                        className={`${
                            activeTab === 'mentors'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        aria-current={activeTab === 'mentors' ? 'page' : undefined}
                    >
                        {lang === 'zh' ? '寻找学生 (导师发帖)' : 'Offering Help (Find a Student)'}
                    </button>
                </nav>
            </div>
            
            <div>
                {activeTab === 'students' && (
                    <div>
                        {MOCK_STUDENT_POSTS.map(post => <PostCard key={post.id} post={post} type="student" lang={lang} />)}
                    </div>
                )}
                {activeTab === 'mentors' && (
                     <div>
                        {MOCK_MENTOR_POSTS.map(post => <PostCard key={post.id} post={post} type="mentor" lang={lang} />)}
                    </div>
                )}
            </div>

        </div>
    );
};

export default CommunityPage;
