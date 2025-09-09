import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PAYMENT_PLAN } from '../../lib/mockData';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { AlertTriangle, Wallet, CheckCircle, CreditCard, Plus } from 'lucide-react';
import PaymentModal from '../../components/payment/PaymentModal';
import AlipayBindModal from './components/AlipayBindModal';
import AddCardModal from './components/AddCardModal';
import { User, Milestone, PaymentPlan, Student, PaymentMethod, CreditCardPaymentMethod } from '../../types';

interface ProfilePageProps {
  lang: string;
  currentUser: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ lang, currentUser }) => {
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>(MOCK_PAYMENT_PLAN);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBindAlipayModalOpen, setIsBindAlipayModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    currentUser.role === 'student' ? (currentUser as Student).paymentMethods : []
  );

  const handleReleasePaymentClick = (milestone: Milestone) => {
    if (currentUser.role === 'student') {
        if (paymentMethods && paymentMethods.length > 0) {
            setSelectedMilestone(milestone);
            setIsPaymentModalOpen(true);
        } else {
            alert('Please add a payment method first.');
        }
    }
  };

  const handlePaymentConfirm = () => {
    if (!selectedMilestone) return;
    
    setPaymentPlan(prev => {
        const updatedMilestones = [...prev.milestones];
        const currentMilestoneIndex = updatedMilestones.findIndex(m => m.id === selectedMilestone.id);

        if (currentMilestoneIndex !== -1) {
            updatedMilestones[currentMilestoneIndex].status = 'completed';
            if (currentMilestoneIndex + 1 < updatedMilestones.length) {
                updatedMilestones[currentMilestoneIndex + 1].status = 'pending';
            }
        }
        return { ...prev, milestones: updatedMilestones };
    });

    setIsPaymentModalOpen(false);
    setSelectedMilestone(null);
    alert('Payment confirmed! Funds have been released to the mentor. Thank you!');
  };

  const handleBindAlipaySuccess = () => {
    if (!paymentMethods.some(p => p.type === 'alipay')) {
        setPaymentMethods(prev => [...prev, { type: 'alipay', bound: true }]);
    }
    setIsBindAlipayModalOpen(false);
  };
  
  const handleAddCardSuccess = (card: Omit<CreditCardPaymentMethod, 'type' | 'bound'>) => {
      const newCard: CreditCardPaymentMethod = { ...card, type: 'credit_card', bound: true };
      setPaymentMethods(prev => [...prev, newCard]);
      setIsAddCardModalOpen(false);
  };

  const getStatusPill = (status: Milestone['status']) => {
    switch(status) {
      case 'completed': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Completed</span>;
      case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>;
      case 'locked': return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Locked</span>;
      default: return null;
    }
  };
  
  const isVerified = currentUser.verified.name && currentUser.verified.school;
  const ALIPAY_LOGO_URL = 'https://gw.alipayobjects.com/mdn/member_frontWeb/afts/img/A*uh_QRK0_i9sAAAAAAAAAAABkARQnAQ';

  const hasAlipay = paymentMethods.some(p => p.type === 'alipay' && p.bound);
  
  const getCardBrandName = (brand: 'visa' | 'mastercard' | 'amex') => {
      const names = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express' };
      return names[brand];
  }

  return (
    <>
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-start">
          <img className="h-32 w-32 rounded-full object-cover" src={currentUser.avatar} alt={currentUser.name} />
          <div className="ml-0 md:ml-8 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
            <div className="flex space-x-2 mt-2">
              <VerificationBadge verified={currentUser.verified} type="name" lang={lang} />
              <VerificationBadge verified={currentUser.verified} type="school" lang={lang} />
            </div>
            <p className="text-gray-600 mt-2 capitalize">{currentUser.role}</p>
          </div>
        </div>
        
        {!isVerified && (
             <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                <AlertTriangle className="text-yellow-500 mr-3 flex-shrink-0"/>
                <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800">Account Verification Required</h3>
                    <p className="text-sm text-yellow-700">Verify your identity and academic background to gain full access and build trust within the community.</p>
                </div>
                <Link to="/verification" className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-600">
                    Apply Now
                </Link>
             </div>
        )}

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Post Preview</h2>
          <div className="p-4 border rounded-md bg-gray-50 text-gray-700">
             {currentUser.role === 'mentor' && 'profile' in currentUser ? (
                <>
                    <p className="font-semibold">Offering Mentorship for {currentUser.profile.major} at {currentUser.profile.university}</p>
                    <p className="text-sm mt-2"><span className="font-semibold">Background:</span> {currentUser.profile.background}</p>
                    <p className="text-sm mt-2"><span className="font-semibold">Services:</span> {currentUser.profile.services}</p>
                </>
             ) : currentUser.role === 'student' ? (
                <>
                    <p className="font-semibold">Seeking Mentorship for {currentUser.profile.major}</p>
                    <p className="text-sm mt-2"><span className="font-semibold">Background:</span> {currentUser.profile.background}</p>
                    <p className="text-sm mt-2"><span className="font-semibold">Needs:</span> {currentUser.profile.needs}</p>
                </>
             ) : null}
          </div>
        </div>
        
        {currentUser.role === 'student' && (
             <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Methods</h2>
                <div className="space-y-3">
                    {paymentMethods.length === 0 && <p className="text-gray-500 text-sm">No payment methods added.</p>}
                    {paymentMethods.map((method, index) => (
                        <div key={index} className="p-3 border rounded-md flex items-center bg-gray-50">
                            {method.type === 'alipay' ? (
                                <img src={ALIPAY_LOGO_URL} alt="Alipay" className="h-8 mr-4"/>
                            ) : (
                                <CreditCard size={28} className="text-gray-600 mr-4"/>
                            )}
                             <div>
                                <p className="font-semibold">{method.type === 'alipay' ? 'Alipay' : `${getCardBrandName((method as CreditCardPaymentMethod).brand)} ending in ${(method as CreditCardPaymentMethod).last4}`}</p>
                                <span className="text-xs text-green-600 flex items-center"><CheckCircle size={14} className="mr-1"/>Bound Successfully</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex space-x-3 pt-2">
                        {!hasAlipay && (
                           <button onClick={() => setIsBindAlipayModalOpen(true)} className="flex items-center text-sm font-semibold bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                               <img src={ALIPAY_LOGO_URL} alt="Alipay" className="h-5 mr-2"/> Bind Alipay
                            </button>
                        )}
                        <button onClick={() => setIsAddCardModalOpen(true)} className="flex items-center text-sm font-semibold bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                           <Plus size={16} className="mr-2"/> Add Credit Card
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Service Payment Plan {currentUser.role === 'student' ? `with ${paymentPlan.mentorName}` : `with ${paymentPlan.studentName}`}
          </h2>
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
                    {currentUser.role === 'student' && milestone.status === 'pending' && (
                      <button 
                        onClick={() => handleReleasePaymentClick(milestone)} 
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 disabled:bg-gray-400"
                        disabled={paymentMethods.length === 0}
                        title={paymentMethods.length === 0 ? "Please add a payment method first" : ""}
                      >
                        Confirm & Release Funds
                      </button>
                    )}
                    {currentUser.role === 'mentor' && milestone.status === 'pending' && (
                        <span className="text-sm text-gray-500 italic">Pending student confirmation</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    {currentUser.role === 'student' && (
        <>
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                milestone={selectedMilestone}
                onConfirm={handlePaymentConfirm}
                boundMethods={paymentMethods}
            />
            <AlipayBindModal
                isOpen={isBindAlipayModalOpen}
                onClose={() => setIsBindAlipayModalOpen(false)}
                onSuccess={handleBindAlipaySuccess}
            />
            <AddCardModal 
                isOpen={isAddCardModalOpen}
                onClose={() => setIsAddCardModalOpen(false)}
                onAddCard={handleAddCardSuccess}
            />
        </>
    )}
    </>
  );
};

export default ProfilePage;
