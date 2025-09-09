import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface VerificationBadgeProps {
    verified: VerificationStatus;
    type: 'name' | 'school';
    lang: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ verified, type, lang }) => {
  const isVerified = verified[type];
  const text: Record<string, Record<string, string>> = {
    en: { name: 'Identity Verified', school: 'School Verified' },
    zh: { name: '实名认证', school: '院校认证' },
  };
  const unverifiedText: Record<string, Record<string, string>> = {
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
