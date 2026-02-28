import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Check, Zap, Loader, CreditCard, ArrowLeft, ShieldCheck } from 'lucide-react';
import { paymentApi } from '../services/api';

const plans = [
    {
        name: 'Basic',
        price: 'Free',
        credits: 7,
        features: ['7 Uploads', 'Basic File Sharing', 'Email Support'],
        description: 'Perfect for casual users.',
        cta: 'Current Plan',
        disabled: true,
        highlight: false,
    },
    {
        name: 'Premium',
        planKey: 'premium',
        price: '₹499',
        credits: 500,
        features: ['500 Uploads', 'Advanced File Sharing', 'File Analytics', 'Priority Support'],
        description: 'Perfect for power users.',
        cta: 'Upgrade to Premium',
        disabled: false,
        highlight: true,
    },
    {
        name: 'Ultra',
        planKey: 'ultra',
        price: '₹1,999',
        credits: 6000,
        features: ['6000 Uploads', 'Team Sharing', 'Unlimited File Retention', 'Dedicated Support'],
        description: 'Perfect for businesses and teams.',
        cta: 'Go Ultra',
        disabled: false,
        highlight: false,
    },
];

const Subscription = () => {
    const { user } = useUser();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [upiId, setUpiId] = useState('');
    const [paymentStep, setPaymentStep] = useState('plans'); // 'plans' | 'upi' | 'processing' | 'success'
    const [errorMsg, setErrorMsg] = useState('');

    const handleSelectPlan = (plan) => {
        if (plan.disabled) return;
        setSelectedPlan(plan);
        setPaymentStep('upi');
        setUpiId('');
        setErrorMsg('');
    };

    const handlePayment = async () => {
        if (!upiId || !upiId.includes('@')) {
            setErrorMsg('Please enter a valid UPI ID (e.g., name@upi)');
            return;
        }

        setPaymentStep('processing');
        setErrorMsg('');

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Process payment (adds credits in Supabase)
            await paymentApi.processPayment(user.id, selectedPlan.planKey, upiId);

            setPaymentStep('success');
        } catch (err) {
            setErrorMsg(err.message || 'Payment failed. Please try again.');
            setPaymentStep('upi');
        }
    };

    const resetFlow = () => {
        setSelectedPlan(null);
        setPaymentStep('plans');
        setUpiId('');
        setErrorMsg('');
    };

    // ─── UPI Payment Page ───
    if (paymentStep === 'upi' && selectedPlan) {
        return (
            <div className="max-w-md mx-auto">
                <button onClick={resetFlow} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
                    <ArrowLeft size={16} /> Back to plans
                </button>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CreditCard size={28} className="text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Pay for {selectedPlan.name}</h2>
                        <p className="text-3xl font-extrabold text-purple-600 mt-2">{selectedPlan.price}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedPlan.credits} credits will be added</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">UPI ID</label>
                            <input
                                type="text"
                                placeholder="yourname@paytm"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                            />
                        </div>

                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                                {errorMsg}
                            </div>
                        )}

                        <button
                            onClick={handlePayment}
                            className="w-full py-3.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={18} /> Pay {selectedPlan.price}
                        </button>

                        <p className="text-xs text-center text-gray-400">
                            🔒 This is a simulated payment for demonstration purposes.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Processing Screen ───
    if (paymentStep === 'processing') {
        return (
            <div className="max-w-md mx-auto flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Loader size={36} className="text-purple-600 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                <p className="text-gray-500 text-center">Verifying your UPI payment...<br />Please wait.</p>

                <div className="mt-8 w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
            </div>
        );
    }

    // ─── Success Screen ───
    if (paymentStep === 'success' && selectedPlan) {
        return (
            <div className="max-w-md mx-auto flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check size={40} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h2>
                <p className="text-gray-500 text-center mb-2">
                    {selectedPlan.credits} credits have been added to your account.
                </p>
                <p className="text-sm text-gray-400 mb-8">
                    Plan upgraded to <span className="font-semibold text-purple-600 capitalize">{selectedPlan.name}</span>
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                    Continue to Dashboard
                </button>
            </div>
        );
    }

    // ─── Plan Selection (Default) ───
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h1>
                <p className="text-gray-500 mt-1">Get more credits for uploading and sharing files.</p>
            </div>

            {/* Mock Payment Notice */}
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <Zap size={18} className="text-yellow-500 mt-0.5 shrink-0" />
                <p className="text-sm text-yellow-700">
                    <span className="font-semibold">Demo Mode:</span> Payment is simulated. Enter any UPI ID to test the upgrade flow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`flex flex-col rounded-2xl overflow-hidden shadow-sm border transition-transform duration-200
              ${plan.highlight ? 'border-purple-400 scale-105 shadow-lg' : 'border-gray-200'}`}
                    >
                        {plan.highlight && (
                            <div className="bg-purple-600 text-white text-center text-xs font-semibold py-1.5 tracking-wide uppercase">
                                Most Popular
                            </div>
                        )}
                        <div className={`px-6 pt-6 pb-4 ${plan.highlight ? 'bg-purple-50' : 'bg-white'}`}>
                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                            <p className="mt-4">
                                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                {!plan.disabled && <span className="text-gray-400 text-sm ml-1">/ one-time</span>}
                            </p>
                            <p className="text-xs text-purple-600 font-medium mt-1">{plan.credits} uploads included</p>
                        </div>

                        <div className="flex-1 bg-gray-50 px-6 pt-4 pb-6 flex flex-col justify-between">
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <Check size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan)}
                                disabled={plan.disabled}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors duration-200
                    ${plan.disabled
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : plan.highlight
                                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                                            : 'bg-white border border-purple-500 text-purple-600 hover:bg-purple-50'
                                    } disabled:opacity-60`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subscription;