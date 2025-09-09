import React, { useState } from 'react';
import { MOCK_USER, MOCK_PAYMENT_PLAN } from '../lib/mockData';
import { VerificationBadge } from '../components/VerificationBadge';

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

export default ProfilePage;
