// src/types/index.ts

export interface VerificationStatus {
  name: boolean;
  school: boolean;
}

export interface BaseUser {
  id: number;
  name: string;
  avatar: string;
  verified: VerificationStatus;
}

export interface Mentor extends BaseUser {
  role: 'mentor';
  university: string;
  major: string;
  category: string;
  region: string;
  price: number;
  experience: string;
  degree: string;
  rating: number;
  reviewCount: number;
  profile: {
    university: string;
    major: string;
    degree: string;
    background: string;
    services: string;
  };
}

export interface AlipayPaymentMethod {
    type: 'alipay';
    bound: boolean;
}

export interface CreditCardPaymentMethod {
    type: 'credit_card';
    bound: true;
    last4: string;
    brand: 'visa' | 'mastercard' | 'amex';
}

export type PaymentMethod = AlipayPaymentMethod | CreditCardPaymentMethod;


export interface Student extends BaseUser {
  role: 'student';
  profile: {
    university: string;
    major: string;
    degree: string;
    background: string;
    needs: string;
  };
  paymentMethods: PaymentMethod[];
}

export type User = Student | Mentor;

export interface Post {
    id: number;
    userId: number;
    name: string;
    avatar: string;
    verified: VerificationStatus;
    university?: string;
    major?: string;
    background: string;
    services?: string;
    target?: string;
    needs?: string;
}

export interface Milestone {
    id: number;
    name: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'completed' | 'locked';
}

export interface PaymentPlan {
    studentId: number;
    mentorId: number;
    studentName: string;
    mentorName: string;
    total: number;
    currency: string;
    milestones: Milestone[];
}

export interface ChatMessage {
  senderId: number;
  text: string;
  timestamp: string;
}

export interface MessageData {
    role: 'user' | 'model';
    text: string;
    isAnalyzing?: boolean;
    analysisResult?: {
        type: 'grammar' | 'originality';
        result: string;
    } | null;
    mentorRecommendation?: Mentor | null;
}

export interface Review {
    id: number;
    reviewerName: string;
    date: string;
    rating: number;
    comment: string;
}