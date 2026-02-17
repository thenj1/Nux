import { useState, useEffect, useCallback } from 'react';
import {
    getProducts,
    searchProductsByName,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductMaterials,
    createProductMaterial,
    deleteProductMaterial,
    getRawMaterials,
} from '../services/api';
import type { Product, ProductMaterial, RawMaterial } from '../services/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Feedback from '../components/Feedback';
import {
    Search, Plus, Edit2, Trash2, Package, Tag, DollarSign, Save, Layers, X
} from 'lucide-react';

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formName, setFormName] = useState('');
    const [formCod, setFormCod] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const [productMaterials, setProductMaterials] = useState<ProductMaterial[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [allRawMaterials, setAllRawMaterials] = useState<RawMaterial[]>([]);
    const [selectedRawMaterialId, setSelectedRawMaterialId] = useState('');
    const [materialQuantity, setMaterialQuantity] = useState('');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const result = searchName.trim()
                ? await searchProductsByName(searchName, page)
                : await getProducts(page);
            setProducts(result.data);
            setTotalPages(result.meta.totalPages);
        } catch {
            setProducts([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [page, searchName]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    function handleOpenCreate() {
        setEditingProduct(null);
        setFormName('');
        setFormCod('');
        setFormPrice('');
        setShowModal(true);
    }

    function handleOpenEdit(product: Product) {
        setEditingProduct(product);
        setFormName(product.name);
        setFormCod(product.cod);
        setFormPrice(String(product.price));
        setShowModal(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, {
                    name: formName,
                    cod: formCod,
                    price: Number(formPrice),
                });
                setFeedback({ message: 'Product updated successfully!', type: 'success' });
            } else {
                await createProduct({ name: formName, cod: formCod, price: Number(formPrice) });
                setFeedback({ message: 'Product created successfully!', type: 'success' });
            }
            setShowModal(false);
            fetchProducts();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error saving product';
            setFeedback({ message: msg, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(product: Product) {
        if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
        try {
            await deleteProduct(product.id);
            setFeedback({ message: 'Product deleted successfully!', type: 'success' });
            if (expandedProductId === product.id) setExpandedProductId(null);
            fetchProducts();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error deleting product';
            setFeedback({ message: msg, type: 'error' });
        }
    }

    async function handleToggleMaterials(productId: number) {
        if (expandedProductId === productId) {
            setExpandedProductId(null);
            return;
        }
        setExpandedProductId(productId);
        setLoadingMaterials(true);
        try {
            const materials = await getProductMaterials(productId);
            setProductMaterials(materials);
        } catch {
            setProductMaterials([]);
        } finally {
            setLoadingMaterials(false);
        }
    }

    async function handleOpenAddMaterial() {
        setShowMaterialModal(true);
        setSelectedRawMaterialId('');
        setMaterialQuantity('');
        try {
            const result = await getRawMaterials(1, 100);
            setAllRawMaterials(result.data);
        } catch {
            setAllRawMaterials([]);
        }
    }

    async function handleAddMaterial(e: React.FormEvent) {
        e.preventDefault();
        if (!expandedProductId) return;
        setSubmitting(true);
        try {
            await createProductMaterial({
                productId: expandedProductId,
                rawMaterialId: Number(selectedRawMaterialId),
                quantity: Number(materialQuantity),
            });
            setFeedback({ message: 'Material added to product!', type: 'success' });
            setShowMaterialModal(false);
            const materials = await getProductMaterials(expandedProductId);
            setProductMaterials(materials);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error adding material';
            setFeedback({ message: msg, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleRemoveMaterial(materialId: number) {
        if (!window.confirm('Remove this material from the product?')) return;
        try {
            await deleteProductMaterial(materialId);
            setFeedback({ message: 'Material removed!', type: 'success' });
            setProductMaterials((prev) => prev.filter((m) => m.id !== materialId));
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error removing material';
            setFeedback({ message: msg, type: 'error' });
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    }

    const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const totalValue = products.reduce((acc, p) => acc + p.price, 0);
    const avgPrice = products.length > 0 ? totalValue / products.length : 0;

    return (
        <div className="space-y-6">
            {feedback && (
                <Feedback message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[#0f172a] text-2xl font-bold">Products</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage your product catalog</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20 font-semibold cursor-pointer"
                >
                    <Plus size={16} />
                    New Product
                </button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-500 text-sm">Total Products</span>
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Package size={16} className="text-blue-500" />
                        </div>
                    </div>
                    <p className="text-[#0f172a] text-2xl font-bold">{loading ? '-' : products.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-500 text-sm">Avg. Price</span>
                        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <DollarSign size={16} className="text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-[#0f172a] text-2xl font-bold">{loading ? '-' : fmt(avgPrice)}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-500 text-sm">Portfolio Value</span>
                        <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Tag size={16} className="text-purple-500" />
                        </div>
                    </div>
                    <p className="text-[#0f172a] text-2xl font-bold">{loading ? '-' : fmt(totalValue)}</p>
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
                                placeholder="Search products by name..."
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                            />
                        </div>
                        <button type="submit" className="hidden">Search</button>
                    </form>
                </div>

                {loading ? (
                    <div className="p-8"><Loading /></div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <Package size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No products found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">ID</th>
                                    <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Name</th>
                                    <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Code</th>
                                    <th className="text-left px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Price</th>
                                    <th className="text-right px-5 py-3.5 text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="text-slate-400 text-sm">#{product.id}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Package size={14} className="text-blue-500" />
                                                </div>
                                                <span className="text-slate-800 text-sm font-medium">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                                                {product.cod}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-emerald-600 text-sm font-semibold">{fmt(product.price)}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => handleToggleMaterials(product.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium cursor-pointer"
                                                >
                                                    <Layers size={13} />
                                                    Materials
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product)}
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

                {/* Pagination */}
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

            {/* Materials Expansion Panel (if any product selected) */}
            {expandedProductId && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Layers size={20} className="text-blue-500" />
                            <h3 className="text-[#0f172a] text-lg font-bold">
                                Raw Materials for {products.find(p => p.id === expandedProductId)?.name}
                            </h3>
                        </div>
                        <button
                            onClick={handleOpenAddMaterial}
                            className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            + Add Material
                        </button>
                    </div>

                    {loadingMaterials ? (
                        <Loading />
                    ) : productMaterials.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Layers size={24} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-slate-500 text-sm">No materials linked to this product yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-100">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600">Material</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600">Code</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600">Qty Needed</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-600">Available Stock</th>
                                        <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {productMaterials.map((pm) => (
                                        <tr key={pm.id} className="bg-white">
                                            <td className="px-4 py-3 text-slate-700 font-medium">{pm.rawMaterial.name}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                                    {pm.rawMaterial.cod}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">{pm.quantity}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${pm.rawMaterial.stock >= pm.quantity
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-red-50 text-red-700'
                                                    }`}>
                                                    {pm.rawMaterial.stock}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleRemoveMaterial(pm.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Remove"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <Modal
                    title={editingProduct ? 'Edit Product' : 'New Product'}
                    onClose={() => setShowModal(false)}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-slate-700 font-medium">Name</label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Product name"
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
                                placeholder="Product code"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm text-slate-700 font-medium">Price (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formPrice}
                                onChange={(e) => setFormPrice(e.target.value)}
                                placeholder="0.00"
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
                                {submitting ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Add Material Modal */}
            {showMaterialModal && (
                <Modal
                    title="Add Raw Material"
                    onClose={() => setShowMaterialModal(false)}
                >
                    <form onSubmit={handleAddMaterial} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-slate-700 font-medium">Raw Material</label>
                            <select
                                value={selectedRawMaterialId}
                                onChange={(e) => setSelectedRawMaterialId(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none"
                                required
                            >
                                <option value="">Select a material...</option>
                                {allRawMaterials.map((rm) => (
                                    <option key={rm.id} value={rm.id}>
                                        {rm.name} ({rm.cod}) - Stock: {rm.stock}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm text-slate-700 font-medium">Quantity Needed</label>
                            <input
                                type="number"
                                min="1"
                                value={materialQuantity}
                                onChange={(e) => setMaterialQuantity(e.target.value)}
                                placeholder="1"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                required
                            />
                        </div>
                        <div className="flex gap-3 mt-6 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowMaterialModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                            >
                                <Plus size={16} />
                                {submitting ? 'Adding...' : 'Add Material'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default Products;
