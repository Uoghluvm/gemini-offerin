import React, { useState, useMemo } from 'react';
import { MOCK_MENTORS } from '../../lib/mockData';
import MentorCard from '../../components/mentor/MentorCard';
import { User } from '../../types';

interface FindMentorPageProps {
  lang: string;
  t: (key: string) => string;
  currentUser: User;
}

const FindMentorPage: React.FC<FindMentorPageProps> = ({ lang, t, currentUser }) => {
  const [filters, setFilters] = useState({ region: '', major: '', search: '' });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const { filteredMentors, regions, majors } = useMemo(() => {
    const mentorsToList = MOCK_MENTORS.filter(mentor => mentor.id !== currentUser.id);

    const filtered = mentorsToList.filter(mentor => {
      return (
        (filters.region === '' || mentor.region === filters.region) &&
        (filters.major === '' || mentor.major === filters.major) &&
        (filters.search === '' || 
         mentor.name.toLowerCase().includes(filters.search.toLowerCase()) || 
         mentor.university.toLowerCase().includes(filters.search.toLowerCase()))
      );
    });

    return {
      filteredMentors: filtered,
      regions: [...new Set(mentorsToList.map(m => m.region))],
      majors: [...new Set(mentorsToList.map(m => m.major))],
    };
  }, [filters, currentUser]);
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Mentor</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 sticky top-20 z-40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" name="search" placeholder={t('searchPlaceholder')} value={filters.search} onChange={handleFilterChange} className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none col-span-1 md:col-span-2" />
          <select name="region" value={filters.region} onChange={handleFilterChange} className="p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
           <select name="major" value={filters.major} onChange={handleFilterChange} className="p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Majors</option>
            {majors.sort().map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.length > 0 ? (
          filteredMentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} lang={lang} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">No mentors found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FindMentorPage;