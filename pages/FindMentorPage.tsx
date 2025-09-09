import React, { useState } from 'react';
import { MOCK_MENTORS } from '../lib/mockData';
import MentorCard from '../components/MentorCard';

const FindMentorPage = ({ lang, t }) => {
  const [filters, setFilters] = useState({ region: '', major: '', degree: '', search: '' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredMentors = MOCK_MENTORS.filter(mentor => {
    return (
      (filters.region === '' || mentor.region === filters.region) &&
      (filters.degree === '' || mentor.degree === filters.degree) &&
      (filters.major === '' || mentor.major.toLowerCase().includes(filters.major.toLowerCase())) &&
      (filters.search === '' || 
       mentor.name.toLowerCase().includes(filters.search.toLowerCase()) || 
       mentor.university.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const regions = [...new Set(MOCK_MENTORS.map(m => m.region))];
  const majors = [...new Set(MOCK_MENTORS.map(m => m.major))];
  const degrees = [...new Set(MOCK_MENTORS.map(m => m.degree))];


  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Mentor</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" name="search" placeholder={t('searchPlaceholder')} value={filters.search} onChange={handleFilterChange} className="p-2 border rounded-md" />
          <select name="region" value={filters.region} onChange={handleFilterChange} className="p-2 border rounded-md bg-white">
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
           <select name="degree" value={filters.degree} onChange={handleFilterChange} className="p-2 border rounded-md bg-white">
            <option value="">All Degrees</option>
            {degrees.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
           <select name="major" value={filters.major} onChange={handleFilterChange} className="p-2 border rounded-md bg-white">
            <option value="">All Majors</option>
            {majors.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} lang={lang} />)}
      </div>
    </div>
  );
};

export default FindMentorPage;
