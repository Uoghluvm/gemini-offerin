import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bot, ShieldCheck } from 'lucide-react';

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

export default HomePage;
