import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { MOCK_MENTOR_USER, MOCK_STUDENT_USER } from '../lib/mockData';
import { User, Post } from '../types';
import PostCard from './CommunityPage/components/PostCard';
import NewPostModal from './CommunityPage/components/NewPostModal';

interface CommunityPageProps {
    lang: string;
    currentUser: User;
}

const MOCK_MENTOR_POSTS_INITIAL: Post[] = [
    { id: 1, userId: 1, name: 'Alex Chen', avatar: 'https://picsum.photos/id/1005/200/200', university: 'Carnegie Mellon University', major: 'Machine Learning', verified: { name: true, school: true }, background: 'B.Eng from SJTU. Interned at Google & MSRA.', services: 'SOP review, technical interview prep, research matching.'},
    { id: 2, userId: 2, name: 'Emily White', avatar: 'https://picsum.photos/id/1028/200/200', university: 'University of Oxford', major: 'Philosophy, Politics and Economics (PPE)', verified: { name: true, school: true }, background: 'Graduated top of my class from Peking University. Received offers from both Oxford and Cambridge.', services: 'Personal statement crafting, interview coaching for Oxbridge.'},
];

const MOCK_STUDENT_POSTS_INITIAL: Post[] = [
    { id: 3, userId: 21, name: 'Sophia Chen', avatar: 'https://picsum.photos/id/1016/200/200', target: 'USA, Computer Science (MS)', verified: { name: true, school: false }, background: 'B.Sc. in Software Engineering from Fudan University, GPA 3.8/4.0.', needs: 'Looking for guidance on my Statement of Purpose for top-tier US MSCS programs and advice on choosing between research-focused vs. professional master\'s.'},
    { id: 4, userId: 22, name: 'David Li', avatar: 'https://picsum.photos/id/1018/200/200', target: 'UK, Finance (MSc)', verified: { name: true, school: false }, background: 'B.A. in Economics from Renmin University, GPA 3.7/4.0, GMAT 740.', needs: 'Seeking a mentor with experience applying to LSE, Imperial, or similar top UK schools for finance. Need help tailoring my CV and preparing for Kira Talent video interviews.'}
];

const CommunityPage: React.FC<CommunityPageProps> = ({ lang, currentUser }) => {
    const [activeTab, setActiveTab] = useState('students');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentPosts, setStudentPosts] = useState<Post[]>(MOCK_STUDENT_POSTS_INITIAL);
    const [mentorPosts, setMentorPosts] = useState<Post[]>(MOCK_MENTOR_POSTS_INITIAL);

    const handleNewPostSubmit = (content: string) => {
        const newPostBase = {
            id: Date.now(),
            userId: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            verified: currentUser.verified,
        };

        if (currentUser.role === 'student') {
            const studentPost: Post = {
                ...newPostBase,
                target: 'Newly Specified Target', // In a real form, this would be an input
                background: currentUser.profile.background,
                needs: content,
            };
            setStudentPosts([studentPost, ...studentPosts]);
            setActiveTab('students');
        } else if (currentUser.role === 'mentor' && currentUser.profile) {
            const mentorPost: Post = {
                ...newPostBase,
                university: currentUser.profile.university,
                major: currentUser.profile.major,
                background: currentUser.profile.background,
                services: content,
            };
            setMentorPosts([mentorPost, ...mentorPosts]);
            setActiveTab('mentors');
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <NewPostModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleNewPostSubmit}
                currentUser={currentUser}
                lang={lang}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Community Hub</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold">
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
                        {studentPosts.map(post => <PostCard key={post.id} post={post} type="student" lang={lang} />)}
                    </div>
                )}
                {activeTab === 'mentors' && (
                     <div>
                        {mentorPosts.map(post => <PostCard key={post.id} post={post} type="mentor" lang={lang} />)}
                    </div>
                )}
            </div>

        </div>
    );
};

export default CommunityPage;