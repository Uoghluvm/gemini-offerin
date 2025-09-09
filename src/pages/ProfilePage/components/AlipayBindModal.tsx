import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface AlipayBindModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AlipayBindModal: React.FC<AlipayBindModalProps> = ({ isOpen, onClose, onSuccess }) => {

    if (!isOpen) return null;

    const ALIPAY_LOGO_URL = 'https://gw.alipayobjects.com/mdn/member_frontWeb/afts/img/A*uh_QRK0_i9sAAAAAAAAAAABkARQnAQ';
    const MOCK_QR_CODE_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GlobalEdAlipayAuth';

    const handleConfirm = () => {
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
                <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center">
                        <img src={ALIPAY_LOGO_URL} alt="Alipay" className="h-6 mr-3"/>
                        <h2 className="text-xl font-bold text-gray-800">Bind Alipay Account</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        Please scan the QR code with your Alipay app to authorize binding.
                    </p>
                    <div className="flex justify-center p-4 bg-gray-100 rounded-md">
                        <img src={MOCK_QR_CODE_URL} alt="QR Code" className="w-40 h-40"/>
                    </div>
                    <button onClick={handleConfirm} className="w-full mt-4 flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <CheckCircle size={18} className="mr-2"/>
                        I have completed the authorization
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlipayBindModal;
