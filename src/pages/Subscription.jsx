import { useState } from 'react';
import { Check, Zap, Loader } from 'lucide-react';
import { useApiClient, paymentApi } from '../services/api';

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
    const authApi = useApiClient();
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [successPlan, setSuccessPlan] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleUpgrade = async (plan) => {
        if (plan.disabled) return;
        setLoadingPlan(plan.planKey);
        setErrorMsg('');

        try {
            // Step 1: Create mock order
            const orderRes = await paymentApi.createOrder(authApi, plan.planKey);
            const { orderId } = orderRes.data;

            // Step 2: Simulate payment confirmation (in production, open payment gateway here)
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Step 3: Verify and add credits
            await paymentApi.verify(authApi, orderId, plan.planKey);

            setSuccessPlan(plan.planKey);
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Payment failed. Please try again.');
        } finally {
            setLoadingPlan(null);
        }
    };

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
                    <span className="font-semibold">Demo Mode:</span> Payment is simulated. Clicking "Upgrade" will add real credits to your account for testing.
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

                            {successPlan === plan.planKey ? (
                                <div className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold">
                                    <Check size={18} /> Credits Added!
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade(plan)}
                                    disabled={plan.disabled || loadingPlan === plan.planKey}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors duration-200
                    ${plan.disabled
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : plan.highlight
                                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                                : 'bg-white border border-purple-500 text-purple-600 hover:bg-purple-50'
                                        } disabled:opacity-60`}
                                >
                                    {loadingPlan === plan.planKey ? (
                                        <><Loader size={16} className="animate-spin" /> Processing...</>
                                    ) : plan.cta}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {errorMsg && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                    {errorMsg}
                </div>
            )}
        </div>
    );
};

export default Subscription;