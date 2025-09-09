import React from 'react';
import { Link } from 'react-router-dom';
import { VerificationBadge } from '../common/VerificationBadge';
import StarRating from '../common/StarRating';
import { Mentor } from '../../types';

interface MentorCardProps {
    mentor: Mentor;
    lang: string;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, lang }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col group">
    <Link to={`/mentor/${mentor.id}`} className="block p-6 flex-grow group-hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center mb-4">
            <img className="h-16 w-16 rounded-full object-cover" src={mentor.avatar} alt={mentor.name} />
            <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
            <div className="flex items-center mt-1">
                <StarRating rating={mentor.rating} />
                <span className="text-xs text-gray-500 ml-2">({mentor.reviewCount} reviews)</span>
            </div>
            </div>
        </div>
        <div className="flex space-x-2 mb-4">
                <VerificationBadge verified={mentor.verified} type="name" lang={lang} />
                <VerificationBadge verified={mentor.verified} type="school" lang={lang} />
        </div>
        <div className="text-sm text-gray-600 space-y-2">
            <p><span className="font-semibold">University:</span> {mentor.university}</p>
            <p><span className="font-semibold">Degree:</span> {mentor.degree}</p>
            <p><span className="font-semibold">Major:</span> {mentor.major}</p>
            <p><span className="font-semibold">Region:</span> {mentor.region}</p>
            <p className="pt-2 italic">"{mentor.experience}"</p>
        </div>
    </Link>
    <div className="p-6 bg-gray-50 flex justify-between items-center border-t">
      <p className="text-xl font-bold text-blue-600">${mentor.price}<span className="text-sm font-normal text-gray-500">/hr</span></p>
      <Link to={`/chat/${mentor.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold">
        Contact Mentor
      </Link>
    </div>
  </div>
);

export default MentorCard;
