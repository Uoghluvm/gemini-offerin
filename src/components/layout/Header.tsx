import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { User, LogOut, UserPlus, LogIn, Globe, ChevronDown, Repeat } from 'lucide-react';
import { MOCK_STUDENT_USER, MOCK_MENTOR_USER } from '../../lib/mockData';
import { User as UserType } from '../../types';

interface HeaderProps {
    lang: string;
    setLang: (lang: string) => void;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    t: (key: string) => string;
    currentUser: UserType;
    setCurrentUser: (user: UserType) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, loggedIn, setLoggedIn, t, currentUser, setCurrentUser }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  
  const handleUserSwitch = () => {
      if (currentUser.role === 'student') {
          setCurrentUser(MOCK_MENTOR_USER);
      } else {
          setCurrentUser(MOCK_STUDENT_USER);
      }
      setUserMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">GlobalEd</Link>
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink to="/" className={({ isActive }) => `text-gray-600 hover:text-blue-600 ${isActive ? 'text-blue-600 font-semibold' : ''}`}>{t('navHome')}</NavLink>
          <NavLink to="/mentors" className={({ isActive }) => `text-gray-600 hover:text-blue-600 ${isActive ? 'text-blue-600 font-semibold' : ''}`}>{t('navMentors')}</NavLink>
          <NavLink to="/community" className={({ isActive }) => `text-gray-600 hover:text-blue-600 ${isActive ? 'text-blue-600 font-semibold' : ''}`}>{t('navCommunity')}</NavLink>
          <NavLink to="/ai-helper" className={({ isActive }) => `text-gray-600 hover:text-blue-600 ${isActive ? 'text-blue-600 font-semibold' : ''}`}>{t('navAIHelper')}</NavLink>
          <NavLink to="/resources" className={({ isActive }) => `text-gray-600 hover:text-blue-600 ${isActive ? 'text-blue-600 font-semibold' : ''}`}>{t('navResources')}</NavLink>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center text-gray-600 hover:text-blue-600">
              <Globe size={20} />
              <ChevronDown size={16} />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" onClick={(e) => { e.preventDefault(); setLang('en'); setLangMenuOpen(false); }} className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${lang === 'en' ? 'font-bold' : ''}`}>English</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setLang('zh'); setLangMenuOpen(false); }} className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${lang === 'zh' ? 'font-bold' : ''}`}>中文</a>
              </div>
            )}
          </div>
          {loggedIn ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="focus:outline-none">
                <img className="h-9 w-9 rounded-full object-cover" src={currentUser.avatar} alt="User avatar" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="capitalize">{currentUser.role}</p>
                  </div>
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User size={16} className="mr-2" />{t('profile')}</Link>
                  <button onClick={handleUserSwitch} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Repeat size={16} className="mr-2" />Switch to {currentUser.role === 'student' ? 'Mentor' : 'Student'} View</button>
                  <a href="#" onClick={(e) => { e.preventDefault(); setLoggedIn(false); setUserMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><LogOut size={16} className="mr-2" />{t('logout')}</a>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <button onClick={() => setLoggedIn(true)} className="text-gray-600 hover:text-blue-600"><LogIn size={20} className="inline mr-1"/>{t('login')}</button>
              <button onClick={() => setLoggedIn(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"><UserPlus size={16} className="mr-2"/>{t('signup')}</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
