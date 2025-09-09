import React from 'react';
import { ShieldCheck, UploadCloud, Mail } from 'lucide-react';

const VerificationPage = () => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Verification application submitted! Our team will review your documents and get back to you within 3-5 business days.');
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-blue-600 mr-4"/>
                    <h1 className="text-3xl font-bold text-gray-800">Account Verification</h1>
                </div>
                <p className="text-gray-600 mb-6">
                    Please provide the following information to verify your identity and academic background. This helps build a trusted community for everyone.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="identity-doc" className="block text-sm font-medium text-gray-700">
                            Identity Document (Passport, National ID)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="school-email" className="block text-sm font-medium text-gray-700">
                            Official University Email Address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="school-email"
                                id="school-email"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2"
                                placeholder="you@example.edu"
                                required
                            />
                        </div>
                         <p className="mt-2 text-xs text-gray-500">We will send a verification link to this email address to confirm your affiliation with the university.</p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Submit for Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerificationPage;
