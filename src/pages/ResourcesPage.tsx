import React from 'react';
import StaticPage from '../components/layout/StaticPage';

const ResourcesPage = () => (
    <StaticPage title="Application Resources">
        <h2 className="text-2xl font-semibold">Application Guides</h2>
        <p>Our comprehensive guides cover everything from writing a compelling Statement of Purpose to preparing for interviews.</p>
        <h2 className="text-2xl font-semibold mt-6">University Information</h2>
        <p>Explore detailed profiles of universities, including admission statistics, program details, and campus life.</p>
        <h2 className="text-2xl font-semibold mt-6">Success Stories</h2>
        <p>Read inspiring stories from students who successfully navigated the application process with our mentors.</p>
    </StaticPage>
);

export default ResourcesPage;