import { useState } from 'react';
import { getProductionSuggestion } from '../services/api';
import type { ProductionSummary } from '../services/api';
import Loading from '../components/Loading';
import Feedback from '../components/Feedback';
import {
    Cpu, Calculator, DollarSign, Package, AlertCircle
} from 'lucide-react';

function Production() {
    const [data, setData] = useState<ProductionSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    async function handleCalculate() {
        setLoading(true);
        try {
            const result = await getProductionSuggestion();
            setData(result);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error calculating production';
            setFeedback({ message: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    }

    const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    return (
        <div className="space-y-6">
            {feedback && (
                <Feedback message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[#0f172a] text-2xl font-bold">Production Suggestion</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Optimize production based on current stock</p>
                </div>
                <button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 font-semibold disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Calculator size={18} />
                    )}
                    {loading ? 'Calculating...' : 'Calculate Production'}
                </button>
            </div>

            {!data && !loading && (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Cpu size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-[#0f172a] text-lg font-bold mb-2">Ready to Calculate</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Click the button above to analyze your raw material stock and generate optimized production suggestions prioritized by product value.
                    </p>
                </div>
            )}

            {loading && (
                <div className="py-12 flex justify-center">
                    <Loading />
                </div>
            )}

            {data && !loading && (
                <>
                    {/* Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 text-sm">Estimated Total Value</span>
                                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <DollarSign size={16} className="text-emerald-500" />
                                </div>
                            </div>
                            <p className="text-[#0f172a] text-2xl font-bold">{fmt(data.totalValue)}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 text-sm">Products to Produce</span>
                                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Package size={16} className="text-blue-500" />
                                </div>
                            </div>
                            <p className="text-[#0f172a] text-2xl font-bold">{data.suggestions.length}</p>
                        </div>
                    </div>

                    {/* Table card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-[#0f172a]">Suggested Production Plan</h3>
                        </div>

                        {data.suggestions.length === 0 ? (
                            <div className="text-center py-16 text-slate-400">
                                <AlertCircle size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No products can be produced with current stock.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Product</th>
                                            <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Code</th>
                                            <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Unit Price</th>
                                            <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Qty</th>
                                            <th className="text-right px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data.suggestions.map((item) => (
                                            <tr key={item.productId} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-slate-800">{item.productName}</div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                                                        {item.productCode}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600 text-sm">
                                                    {fmt(item.productPrice)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                                                        {item.quantity} units
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <span className="text-emerald-600 font-semibold text-sm">
                                                        {fmt(item.productPrice * item.quantity)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Production;
