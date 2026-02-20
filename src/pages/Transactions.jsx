import { History, Coins } from 'lucide-react';

// Static mock transactions — replace with real API call when payment backend stores history
const mockTransactions = [
    { id: '1', plan: 'Basic', credits: 7, amount: 'Free', date: 'Account Creation', status: 'success' },
];

const Transactions = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <p className="text-gray-500 mt-1">Your credit purchase history.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Plan</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Credits</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Amount</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {mockTransactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{tx.plan}</td>
                                <td className="px-6 py-4 flex items-center gap-1 text-purple-600">
                                    <Coins size={14} /> {tx.credits}
                                </td>
                                <td className="px-6 py-4 text-gray-600">{tx.amount}</td>
                                <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {tx.status === 'success' ? '✓ Success' : '✗ Failed'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {mockTransactions.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <History size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No transactions yet.</p>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
                Transaction history for real payments will appear here once payment gateway is integrated.
            </p>
        </div>
    );
};

export default Transactions;