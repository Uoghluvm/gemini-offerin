import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import StarRating from '../../../components/common/StarRating';
import { Mentor } from '../../../types';

interface MentorRecommendationCardProps {
    mentor: Mentor;
    lang: string;
}

const MentorRecommendationCard: React.FC<MentorRecommendationCardProps> = ({ mentor, lang }) => (
    <div className="mt-4 p-3 border border-blue-200 bg-blue-50 rounded-lg">
        <h4 className="text-xs font-bold text-blue-800 mb-2">{lang === 'zh' ? '为你推荐导师' : 'Mentor Recommendation'}</h4>
        <div className="flex items-center">
            <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-full mr-3"/>
            <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">{mentor.name}</p>
                <p className="text-xs text-gray-600">{mentor.university}</p>
                 <div className="flex items-center mt-1">
                    <StarRating rating={mentor.rating} size={14} />
                    <span className="text-xs text-gray-500 ml-1.5">({mentor.reviewCount})</span>
                </div>
            </div>
             <Link to="/mentors" className="flex items-center text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md font-semibold">
                {lang === 'zh' ? '查看详情' : 'View Profile'} <ExternalLink size={12} className="ml-1.5"/>
             </Link>
        </div>
    </div>
);

export default MentorRecommendationCard;
