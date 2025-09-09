import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { User, ShieldCheck, MessageSquare, Bot, Search, BookOpen, Home, Mail, ChevronDown, CheckCircle, XCircle, LogIn, LogOut, UserPlus, Globe, Users } from 'lucide-react';

import AIHelperPage from './pages/AIHelperPage';
import CommunityPage from './pages/CommunityPage';

// Mock Data - In a real app, this would come from an API
const MOCK_MENTORS = [
  { id: 1, name: 'Zhang Wei (张伟)', university: 'Stanford University', major: 'Computer Science', region: 'USA', price: 150, verified: { name: true, school: true }, avatar: 'https://picsum.photos/id/1027/200/200', experience: 'Tsinghua University alumnus, now at Stanford. Specialized in helping students from Chinese universities with their US CS grad school applications.', degree: 'PhD Candidate' },
  { id: 2, name: 'Li Na (李娜)', university: 'London School of Economics', major: 'Finance', region: 'UK', price: 180, verified: { name: true, school: true }, avatar: 'https://picsum.photos/id/1011/200/200', experience: 'Peking University alum, now at LSE. Expert in G5 university applications for finance and economics majors.', degree: 'MSc' },
  { id: 3, name: 'Wang Fang (王芳)', university: 'University of Toronto', major: 'Data Science', region: 'Canada', price: 120, verified: { name: true, school: false }, avatar: 'https://picsum.photos/id/1012/200/200', experience: 'Fudan University graduate, currently studying Data Science in Toronto. Strong background in Canadian university applications.', degree: 'MSc Candidate' },
  { id: 4, name: 'Liu Yang (刘洋)', university: 'ETH Zurich', major: 'Electrical Engineering', region: 'Europe', price: 160, verified: { name: true, school: true }, avatar: 'https://picsum.photos/id/1013/200/200', experience: 'SJTU alumnus, now at ETH Zurich. Focuses on helping engineering students apply to top European technical universities.', degree: 'PhD' },
  { id: 5, name: 'Chen Jing (陈静)', university: 'National University of Singapore', major: 'Business Analytics', region: 'Asia', price: 130, verified: { name: false, school: false }, avatar: 'https://picsum.photos/id/1015/200/200', experience: 'Graduated from Zhejiang University. Familiar with the application process for top business schools in Singapore and Hong Kong.', degree: 'MSc' },
];

const MOCK_USER = {
  name: 'Alex Chen (Demo Mentor)',
  role: 'mentor',
  avatar: 'https://picsum.photos/id/1005/200/200',
  verified: { name: true, school: true },
  profile: {
    university: 'Carnegie Mellon University',
    major: 'Machine Learning',
    degree: 'PhD Candidate',
    background: 'B.Eng from Shanghai Jiao Tong University. Interned at Google and Microsoft Research. Passionate about helping students navigate the competitive landscape of top-tier CS programs.',
    services: 'Statement of Purpose review, technical interview prep, research interest matching, and comprehensive application strategy.'
  }
};

const MOCK_PAYMENT_PLAN = {
  total: 9000,
  currency: 'CNY',
  milestones: [
    { id: 1, name: 'Statement of Purpose Draft & Polish', amount: 3000, dueDate: '2024-08-30', status: 'pending' },
    { id: 2, name: 'Resume/CV Writing & Review', amount: 3000, dueDate: '2024-09-30', status: 'locked' },
    { id: 3, name: 'Online Application System Guidance', amount: 3000, dueDate: '2024-10-30', status: 'locked' },
  ]
};

// Translations
const translations = {
  en: {
    navHome: 'Home',
    navMentors: 'Mentors',
    navCommunity: 'Community',
    navAIHelper: 'AI Helper',
    navResources: 'Resources',
    navContact: 'Contact Us',
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
    profile: 'My Profile',
    lang: 'Language',
    heroTitle: 'Your Global Education Journey Starts Here',
    heroSubtitle: 'Connect with expert mentors and leverage our AI-powered tools to secure your spot at your dream university.',
    heroCTA: 'Find Your Mentor',
    searchPlaceholder: 'Search by school, major, or region...',
  },
  zh: {
    navHome: '首页',
    navMentors: '寻找导师',
    navCommunity: '交流社区',
    navAIHelper: 'AI 助手',
    navResources: '留学资源',
    navContact: '联系我们',
    login: '登录',
    signup: '注册',
    logout: '登出',
    profile: '个人主页',
    lang: '语言',
    heroTitle: '你的全球教育之旅从这里开始',
    heroSubtitle: '与顶尖导师建立联系，利用我们强大的人工智能工具，成功入读你的梦想大学。',
    heroCTA: '寻找你的导师',
    searchPlaceholder: '按学校、专业或地区搜索...',
  }
};

// Components
const Header = ({ lang, setLang, loggedIn, setLoggedIn, t }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

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
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1">
                <a href="#" onClick={(e) => { e.preventDefault(); setLang('en'); setLangMenuOpen(false); }} className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${lang === 'en' ? 'font-bold' : ''}`}>English</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setLang('zh'); setLangMenuOpen(false); }} className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${lang === 'zh' ? 'font-bold' : ''}`}>中文</a>
              </div>
            )}
          </div>
          {loggedIn ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="focus:outline-none">
                <img className="h-9 w-9 rounded-full object-cover" src={MOCK_USER.avatar} alt="User avatar" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User size={16} className="mr-2" />{t('profile')}</Link>
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

const Footer = () => (
  <footer className="bg-gray-800 text-white mt-12">
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-blue-400">GlobalEd</h3>
          <p className="mt-2 text-gray-400 text-sm">Your partner in global education.</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
            <li><Link to="/mentors" className="text-gray-400 hover:text-white">Mentors</Link></li>
            <li><Link to="/community" className="text-gray-400 hover:text-white">Community</Link></li>
            <li><Link to="/ai-helper" className="text-gray-400 hover:text-white">AI Helper</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
           <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-center"><Mail size={16} className="mr-2"/> contact@globaled.com</li>
           </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} GlobalEd Mentor. All rights reserved.
      </div>
    </div>
  </footer>
);

export const VerificationBadge = ({ verified, type, lang }) => {
  const isVerified = verified[type];
  const text = {
    en: { name: 'Identity Verified', school: 'School Verified' },
    zh: { name: '实名认证', school: '院校认证' },
  };
  const unverifiedText = {
    en: { name: 'Identity Unverified', school: 'School Unverified' },
    zh: { name: '实名未认证', school: '院校未认证' },
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
      {isVerified ? <CheckCircle size={14} className="mr-1 text-green-600" /> : <XCircle size={14} className="mr-1 text-gray-500" />}
      {isVerified ? text[lang][type] : unverifiedText[lang][type]}
    </span>
  );
};

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

// Pages
const HomePage = ({ t }) => (
  <div>
    <section className="bg-blue-50 py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t('heroTitle')}</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
        <Link to="/mentors" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition duration-300">{t('heroCTA')}</Link>
      </div>
    </section>
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Mentors & Community</h3>
            <p className="text-gray-600">Connect with verified mentors and peers from top universities worldwide.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Bot className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Assistant</h3>
            <p className="text-gray-600">Get personalized school recommendations and application planning.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Milestone-based payments ensure you only pay for completed work.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const FindMentorPage = ({ lang, t }) => {
  const [mentors, setMentors] = useState(MOCK_MENTORS);
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

const ProfilePage = ({ lang }) => {
  const [paymentPlan, setPaymentPlan] = useState(MOCK_PAYMENT_PLAN);

  const releasePayment = (milestoneId) => {
    setPaymentPlan(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestoneId ? { ...m, status: 'completed' } : m
      )
    }));
  };

  const getStatusPill = (status) => {
    switch(status) {
      case 'completed': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Completed</span>;
      case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>;
      case 'locked': return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Locked</span>;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-start">
          <img className="h-32 w-32 rounded-full object-cover" src={MOCK_USER.avatar} alt={MOCK_USER.name} />
          <div className="ml-0 md:ml-8 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">{MOCK_USER.name}</h1>
            <div className="flex space-x-2 mt-2">
              <VerificationBadge verified={MOCK_USER.verified} type="name" lang={lang} />
              <VerificationBadge verified={MOCK_USER.verified} type="school" lang={lang} />
            </div>
            <p className="text-gray-600 mt-2 capitalize">{MOCK_USER.role}</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Mentor Post</h2>
          <div className="p-4 border rounded-md bg-gray-50 text-gray-700">
            <p className="font-semibold">Offering Mentorship for {MOCK_USER.profile.major} at {MOCK_USER.profile.university}</p>
            <p className="text-sm mt-2"><span className="font-semibold">Background:</span> {MOCK_USER.profile.background}</p>
            <p className="text-sm mt-2"><span className="font-semibold">Services:</span> {MOCK_USER.profile.services}</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Service Payment Plan with Sophia Chen</h2>
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-baseline mb-4">
              <p className="text-lg font-semibold">Total Service Fee:</p>
              <p className="text-2xl font-bold text-blue-600">{paymentPlan.total} {paymentPlan.currency}</p>
            </div>
            <ul className="space-y-4">
              {paymentPlan.milestones.map(milestone => (
                <li key={milestone.id} className="p-4 bg-gray-50 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <p className="font-semibold">{milestone.name}</p>
                    <p className="text-sm text-gray-500">Due: {milestone.dueDate} | Amount: {milestone.amount} {paymentPlan.currency}</p>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <div className="mr-4">{getStatusPill(milestone.status)}</div>
                    {milestone.status === 'pending' && (
                      <button onClick={() => releasePayment(milestone.id)} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">Confirm & Release Funds</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaticPage = ({ title, children }) => (
    <div className="container mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
            <div className="prose max-w-none text-gray-700">
                {children}
            </div>
        </div>
    </div>
);

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


const ContactPage = () => (
    <StaticPage title="Contact Us">
       <p>Have questions? We'd love to hear from you. Reach out to us via the methods below.</p>
       <p><strong>Email:</strong> contact@globaled.com</p>
       <p><strong>Phone:</strong> +1 (555) 123-4567</p>
    </StaticPage>
);


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
