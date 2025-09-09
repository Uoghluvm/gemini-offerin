import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_MENTORS, MOCK_REVIEWS } from '../lib/mockData';
import { VerificationBadge } from '../components/common/VerificationBadge';
import StarRating from '../components/common/StarRating';
import { ArrowLeft, MessageSquare, GraduationCap, Briefcase, Globe, Star, MessageCircle } from 'lucide-react';
import { Review } from '../types';

interface MentorProfilePageProps {
  lang: string;
}

const MentorProfilePage: React.FC<MentorProfilePageProps> = ({ lang }) => {
    const { mentorId } = useParams<{ mentorId: string }>();
    const mentor = MOCK_MENTORS.find(m => m.id === Number(mentorId));
    const reviews = MOCK_REVIEWS[Number(mentorId)] || [];

    if (!mentor) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <h1 className="text-2xl font-bold">Mentor not found.</h1>
                <Link to="/mentors" className="text-blue-600 hover:underline mt-4 inline-block">Back to search</Link>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-50">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-6">
                    <Link to="/mentors" className="flex items-center text-sm text-gray-600 hover:text-blue-600 font-semibold">
                        <ArrowLeft size={16} className="mr-2"/> Back to All Mentors
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                            <div className="text-center">
                                <img className="h-32 w-32 rounded-full object-cover mx-auto mb-4" src={mentor.avatar} alt={mentor.name}/>
                                <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                                <p className="text-gray-600">{mentor.profile.university} - {mentor.profile.degree}</p>
                                 <div className="flex items-center justify-center mt-2">
                                    <StarRating rating={mentor.rating} />
                                    <span className="text-sm text-gray-500 ml-2">({mentor.reviewCount} reviews)</span>
                                </div>
                            </div>
                            <div className="flex justify-center space-x-2 my-4">
                                <VerificationBadge verified={mentor.verified} type="name" lang={lang} />
                                <VerificationBadge verified={mentor.verified} type="school" lang={lang} />
                            </div>
                            <div className="text-center mt-6">
                                <p className="text-3xl font-bold text-blue-600">${mentor.price}<span className="text-lg font-normal text-gray-500">/hr</span></p>
                                <Link to={`/chat/${mentor.id}`} className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-md font-semibold flex items-center justify-center">
                                    <MessageSquare size={18} className="mr-2"/> Contact Mentor
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Details & Reviews */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
                            <p className="text-gray-700 leading-relaxed">{mentor.profile.background}</p>
                            
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center"><GraduationCap size={16} className="text-gray-500 mr-3"/><span className="font-semibold mr-2">Major:</span> {mentor.profile.major}</div>
                                <div className="flex items-center"><Briefcase size={16} className="text-gray-500 mr-3"/><span className="font-semibold mr-2">Degree:</span> {mentor.profile.degree}</div>
                                <div className="flex items-center"><Globe size={16} className="text-gray-500 mr-3"/><span className="font-semibold mr-2">Region:</span> {mentor.region}</div>
                            </div>

                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Services Offered</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    {mentor.profile.services.split(',').map((service, index) => (
                                        <li key={index}>{service.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md mt-8">
                            <div className="flex items-center mb-6">
                                <Star size={22} className="text-yellow-500 mr-3"/>
                                <h2 className="text-2xl font-bold text-gray-800">Student Reviews</h2>
                            </div>
                            {reviews.length > 0 ? (
                                <ul className="space-y-6">
                                    {reviews.map((review: Review) => (
                                        <li key={review.id} className="border-b pb-6 last:border-b-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 mr-3">
                                                        <MessageCircle size={20}/>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{review.reviewerName}</p>
                                                        <p className="text-xs text-gray-500">{review.date}</p>
                                                    </div>
                                                </div>
                                                <StarRating rating={review.rating}/>
                                            </div>
                                            <p className="text-gray-700 text-sm">{review.comment}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No reviews yet for this mentor.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorProfilePage;