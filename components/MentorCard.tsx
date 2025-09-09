import React from 'react';
import { VerificationBadge } from './VerificationBadge';

const MentorCard = ({ mentor, lang }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
    <div className="p-6">
      <div className="flex items-center">
        <img className="h-16 w-16 rounded-full object-cover" src={mentor.avatar} alt={mentor.name} />
        <div className="ml-4">
          <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
          <div className="flex space-x-2 mt-1">
            <VerificationBadge verified={mentor.verified} type="name" lang={lang} />
            <VerificationBadge verified={mentor.verified} type="school" lang={lang} />
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <p><span className="font-semibold">University:</span> {mentor.university}</p>
        <p><span className="font-semibold">Degree:</span> {mentor.degree}</p>
        <p><span className="font-semibold">Major:</span> {mentor.major}</p>
        <p><span className="font-semibold">Region:</span> {mentor.region}</p>
        <p className="pt-2 italic">"{mentor.experience}"</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl font-bold text-blue-600">${mentor.price}<span className="text-sm font-normal text-gray-500">/hr</span></p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold">Contact Mentor</button>
      </div>
    </div>
  </div>
);

export default MentorCard;
