import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { Milestone, PaymentMethod } from '../../types';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    milestone: Milestone | null;
    onConfirm: () => void;
    boundMethods?: PaymentMethod[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, milestone, onConfirm, boundMethods = [] }) => {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [view, setView] = useState<'select' | 'form' | 'qr'>('select');

    if (!isOpen || !milestone) return null;

    const handleConfirm = () => {
        onConfirm();
        resetState();
    };

    const resetState = () => {
        onClose();
        setSelectedMethod(null);
        setView('select');
    }
    
    const ALIPAY_LOGO_URL = 'https://gw.alipayobjects.com/mdn/member_frontWeb/afts/img/A*uh_QRK0_i9sAAAAAAAAAAABkARQnAQ';
    const WECHAT_PAY_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/WeChat_Pay_Logo.svg/2560px-WeChat_Pay_Logo.svg.png';
    const MOCK_QR_CODE_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GlobalEdPaymentForMilestone' + milestone.id;

    const getBrandName = (brand: 'visa' | 'mastercard' | 'amex') => {
        const names = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express' };
        return names[brand];
    }
    
    const renderBoundMethodList = () => (
        <div className="mt-4">
             <p className="text-sm font-semibold text-center text-gray-700 mb-3">Choose a saved payment method:</p>
             <div className="space-y-3">
                 {boundMethods.map((method, index) => (
                     <button key={index} onClick={handleConfirm} className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                         {method.type === 'alipay' ? (
                             <img src={ALIPAY_LOGO_URL} alt="Alipay" className="h-6 mr-4"/>
                         ) : (
                            <CreditCard size={24} className="mr-4 text-gray-600"/>
                         )}
                         <span className="font-semibold text-gray-700">
                             {method.type === 'alipay' ? 'Alipay' : `${getBrandName(method.brand)} ending in ${method.last4}`}
                         </span>
                     </button>
                 ))}
             </div>
        </div>
    );

    const renderGenericMethodList = () => (
         <div className="mt-4">
            <p className="text-sm font-semibold text-center text-gray-700 mb-3">Choose a payment method:</p>
            <div className="space-y-3">
                <button onClick={() => { setSelectedMethod('alipay'); setView('qr'); }} className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <img src={ALIPAY_LOGO_URL} alt="Alipay" className="h-6 mr-4"/>
                    <span className="font-semibold text-gray-700">Alipay (支付宝)</span>
                </button>
                <button onClick={() => { setSelectedMethod('wechat'); setView('qr'); }} className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <img src={WECHAT_PAY_LOGO_URL} alt="WeChat Pay" className="h-5 mr-4"/>
                    <span className="font-semibold text-gray-700">WeChat Pay (微信支付)</span>
                </button>
                <button onClick={() => { setSelectedMethod('credit_card'); setView('form'); }} className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                     <CreditCard size={24} className="mr-4 text-gray-600"/>
                    <span className="font-semibold text-gray-700">Credit or Debit Card</span>
                </button>
            </div>
        </div>
    );
    
    const renderQrView = () => (
        <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
            Please scan the QR code using {' '}
            <span className="font-semibold">{selectedMethod === 'alipay' ? 'Alipay' : 'WeChat Pay'}</span>
            </p>
            <div className="flex justify-center p-4 bg-gray-100 rounded-md">
                <img src={MOCK_QR_CODE_URL} alt="QR Code" className="w-40 h-40"/>
            </div>
            <button onClick={handleConfirm} className="w-full mt-4 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <CheckCircle size={18} className="mr-2"/> I have completed the payment
            </button>
             <button onClick={() => setView('select')} className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800">
                Choose another method
            </button>
        </div>
    );
    
    const renderCardFormView = () => (
        <div className="mt-4">
             <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="space-y-4">
                 <div>
                     <label htmlFor="card-number" className="block text-xs font-medium text-gray-700">Card Number</label>
                     <div className="mt-1 relative">
                        <input type="text" id="card-number" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="•••• •••• •••• 1234"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><CreditCard className="h-5 w-5 text-gray-400"/></div>
                     </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label htmlFor="expiry-date" className="block text-xs font-medium text-gray-700">Expiry Date</label>
                         <input type="text" id="expiry-date" className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="MM / YY"/>
                     </div>
                      <div>
                         <label htmlFor="cvc" className="block text-xs font-medium text-gray-700">CVC</label>
                         <input type="text" id="cvc" className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="•••"/>
                     </div>
                 </div>
                 <button type="submit" className="w-full mt-4 flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <Lock size={16} className="mr-2"/>
                    Pay ¥{milestone.amount.toFixed(2)}
                </button>
                <button type="button" onClick={() => setView('select')} className="w-full mt-2 text-sm text-center text-gray-600 hover:text-gray-800">
                    &larr; Back to payment options
                </button>
             </form>
        </div>
    );

    const renderContent = () => {
        if (boundMethods.length > 0) return renderBoundMethodList();

        switch(view) {
            case 'select': return renderGenericMethodList();
            case 'qr': return renderQrView();
            case 'form': return renderCardFormView();
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800">Confirm Payment</h2>
                    <button onClick={resetState} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-600">You are about to release payment for:</p>
                    <p className="font-semibold text-gray-800 mt-1">{milestone.name}</p>
                    <p className="text-3xl font-bold text-blue-600 text-center my-4">
                        ¥{milestone.amount.toFixed(2)}
                    </p>
                </div>
                
                {renderContent()}
            </div>
        </div>
    );
};

export default PaymentModal;