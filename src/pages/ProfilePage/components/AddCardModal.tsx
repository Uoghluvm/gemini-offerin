import React, { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { CreditCardPaymentMethod } from '../../../types';

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCard: (card: Omit<CreditCardPaymentMethod, 'type' | 'bound'>) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAddCard }) => {
    const [cardNumber, setCardNumber] = useState('');

    if (!isOpen) return null;
    
    const getCardBrand = (num: string): 'visa' | 'mastercard' | 'amex' => {
        if (num.startsWith('4')) return 'visa';
        if (num.startsWith('5')) return 'mastercard';
        if (num.startsWith('3')) return 'amex';
        return 'visa'; // Default
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const last4 = cardNumber.slice(-4);
        const brand = getCardBrand(cardNumber);
        onAddCard({ last4, brand });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800">Add a New Card</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">Name on Card</label>
                            <input type="text" id="card-name" className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
                            <div className="mt-1 relative">
                                <input 
                                    type="text" 
                                    id="card-number" 
                                    className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="•••• •••• •••• ••••"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    required 
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><CreditCard className="h-5 w-5 text-gray-400"/></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input type="text" id="expiry-date" className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="MM / YY" required/>
                            </div>
                            <div>
                                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                                <input type="text" id="cvc" className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="•••" required/>
                            </div>
                        </div>
                        <button type="submit" className="w-full mt-4 flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Lock size={16} className="mr-2"/>
                            Add Card
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCardModal;