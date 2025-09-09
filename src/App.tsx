import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/HomePage/index';
import FindMentorPage from './pages/FindMentorPage/index';
import CommunityPage from './pages/CommunityPage/index';
import AIHelperPage from './pages/AIHelperPage/index';
import ProfilePage from './pages/ProfilePage/index';
import ResourcesPage from './pages/ResourcesPage/index';
import ContactPage from './pages/ContactPage/index';
import ChatPage from './pages/ChatPage/index';
import VerificationPage from './pages/VerificationPage/index';
import MentorProfilePage from './pages/MentorProfilePage';

import { translations } from './lib/translations';
import { MOCK_STUDENT_USER, MOCK_MENTOR_USER } from './lib/mockData';
import { User } from './types';

const App = () => {
  const [lang, setLang] = useState('en');
  const [loggedIn, setLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_STUDENT_USER);
  
  const t = useCallback((key: string) => translations[lang][key] || key, [lang]);

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header 
          lang={lang} 
          setLang={setLang} 
          loggedIn={loggedIn} 
          setLoggedIn={setLoggedIn} 
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          t={t} 
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage t={t}/>} />
            <Route path="/mentors" element={<FindMentorPage lang={lang} t={t} currentUser={currentUser} />} />
            <Route path="/mentor/:mentorId" element={<MentorProfilePage lang={lang} />} />
            <Route path="/community" element={<CommunityPage lang={lang} currentUser={currentUser} />} />
            <Route path="/ai-helper" element={<AIHelperPage lang={lang} />} />
            <Route path="/profile" element={<ProfilePage lang={lang} currentUser={currentUser} />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/chat/:userId" element={<ChatPage currentUser={currentUser} />} />
            <Route path="/verification" element={<VerificationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;