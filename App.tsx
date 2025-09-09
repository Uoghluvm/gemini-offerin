import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FindMentorPage from './pages/FindMentorPage';
import CommunityPage from './pages/CommunityPage';
import AIHelperPage from './pages/AIHelperPage';
import ProfilePage from './pages/ProfilePage';
import ResourcesPage from './pages/ResourcesPage';
import ContactPage from './pages/ContactPage';

import { translations } from './lib/translations';

const App = () => {
  const [lang, setLang] = useState('en');
  // Default to logged in with the demo account
  const [loggedIn, setLoggedIn] = useState(true);
  const t = useCallback((key) => translations[lang][key] || key, [lang]);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header lang={lang} setLang={setLang} loggedIn={loggedIn} setLoggedIn={setLoggedIn} t={t} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage t={t}/>} />
            <Route path="/mentors" element={<FindMentorPage lang={lang} t={t}/>} />
            <Route path="/community" element={<CommunityPage lang={lang} />} />
            <Route path="/ai-helper" element={<AIHelperPage lang={lang} />} />
            <Route path="/profile" element={<ProfilePage lang={lang} />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
