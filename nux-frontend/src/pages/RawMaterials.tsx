import { useState, useEffect, useCallback } from 'react';
import {
    getRawMaterials,
    searchRawMaterialsByName,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
} from '../services/api';
import type { RawMaterial } from '../services/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Feedback from '../components/Feedback';
import {
    Search, Plus, Edit2, Trash2, FlaskConical, AlertTriangle, Package, Save
} from 'lucide-react';

function RawMaterials() {
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
    const [formName, setFormName] = useState('');
    const [formCod, setFormCod] = useState('');
    const [formStock, setFormStock] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const result = searchName.trim()
                ? await searchRawMaterialsByName(searchName, page)
                : await getRawMaterials(page);
            setMaterials(result.data);
            setTotalPages(result.meta.totalPages);
        } catch {
            setMaterials([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [page, searchName]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    function handleOpenCreate() {
        setEditingMaterial(null);
        setFormName('');
        setFormCod('');
        setFormStock('');
        setShowModal(true);
    }

    function handleOpenEdit(material: RawMaterial) {
        setEditingMaterial(material);
        setFormName(material.name);
        setFormCod(material.cod);
        setFormStock(String(material.stock));
        setShowModal(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingMaterial) {
                await updateRawMaterial(editingMaterial.id, {
                    name: formName,
                    cod: formCod,
                    stock: Number(formStock),
                });
                setFeedback({ message: 'Material updated successfully!', type: 'success' });
            } else {
                await createRawMaterial({ name: formName, cod: formCod, stock: Number(formStock) });
                setFeedback({ message: 'Material created successfully!', type: 'success' });
            }
            setShowModal(false);
            fetchMaterials();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error saving material';
            setFeedback({ message: msg, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(material: RawMaterial) {
        if (!window.confirm(`Are you sure you want to delete "${material.name}"?`)) return;
        try {
            await deleteRawMaterial(material.id);
            setFeedback({ message: 'Material deleted successfully!', type: 'success' });
            fetchMaterials();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error deleting material';
            setFeedback({ message: msg, type: 'error' });
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPage(1);
        fetchMaterials();
    }

    const lowStockCount = materials.filter(m => m.stock <= 10).length;
    const totalStock = materials.reduce((acc, m) => acc + m.stock, 0);

    return (
        <div className="space-y-6">
            {feedback && (
                <Feedback message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[#0f172a] text-2xl font-bold">Raw Materials</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Inventory management</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 font-semibold cursor-pointer"
                >
                    <Plus size={16} />
                    New Material
                </button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-500 text-sm">Total Materials</span>
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <FlaskConical size={16} className="text-blue-500" />
                        </div>
                    </div>
                    <p className="text-[#0f172a] text-2xl font-bold">{loading ? '-' : materials.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-500 text-sm">Low Stock Items</span>
                        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={16} className="text-amber-500" />
                        </div>
                    </div>
                    <p className="text-[#0f172a] text-2xl font-bold">{loading ? '-' : lowStockCount}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-500 text-sm">Total Stock Units</span>
                        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Package size={16} className="text-indigo-500" />
                        </div>
                    </div>
                    <p className="text-[#0f172a] text-2xl font-bold">{loading ? '-' : totalStock}</p>
                </div>
            </div>

            {/* Table card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Search bar */}
                <div className="p-4 border-b border-slate-100">
                    <form onSubmit={handleSearch} className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Search materials by name..."
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                            />
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="p-8"><Loading /></div>
                ) : materials.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <FlaskConical size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No materials found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">ID</th>
                                    <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Name</th>
                                    <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Code</th>
                                    <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Stock</th>
                                    <th className="text-right px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {materials.map((material) => (
                                    <tr key={material.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="text-slate-400 text-sm">#{material.id}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FlaskConical size={14} className="text-blue-500" />
                                                </div>
                                                <span className="text-slate-800 text-sm font-medium">{material.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                                                {material.cod}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${material.stock <= 10
                                                    ? 'bg-amber-50 text-amber-700'
                                                    : 'bg-emerald-50 text-emerald-700'
                                                }`}>
                                                {material.stock}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => handleOpenEdit(material)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(material)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                        <span className="text-slate-400 text-sm">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <Modal
                    title={editingMaterial ? 'Edit Material' : 'New Material'}
                    onClose={() => setShowModal(false)}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-slate-700 font-medium">Name</label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Material name"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm text-slate-700 font-medium">Code</label>
                            <input
                                type="text"
                                value={formCod}
                                onChange={(e) => setFormCod(e.target.value)}
                                placeholder="Material code"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm text-slate-700 font-medium">Stock</label>
                            <input
                                type="number"
                                min="0"
                                value={formStock}
                                onChange={(e) => setFormStock(e.target.value)}
                                placeholder="0"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                required
                            />
                        </div>
                        <div className="flex gap-3 mt-6 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                            >
                                <Save size={16} />
                                {submitting ? 'Saving...' : 'Save Material'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default RawMaterials;
