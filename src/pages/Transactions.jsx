import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { History, Coins } from 'lucide-react';
import { transactionApi } from '../services/api';

const Transactions = () => {
    const { user } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        transactionApi.list(user.id)
            .then(data => setTransactions(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <p className="text-gray-500 mt-1">Your credit purchase history.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="space-y-3 p-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <History size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No transactions yet.</p>
                        <p className="text-sm mt-1">Upgrade your plan to see transactions here.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Plan</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Credits</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Amount</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">UPI</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800 capitalize">{tx.plan}</td>
                                    <td className="px-6 py-4 flex items-center gap-1 text-purple-600">
                                        <Coins size={14} /> {tx.credits}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{tx.amount}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{tx.upi_id || '-'}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
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
                )}
            </div>
        </div>
    );
};

export default Transactions;