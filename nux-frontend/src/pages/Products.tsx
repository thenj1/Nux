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

    async function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            setFeedback({ message: 'Product deleted successfully!', type: 'success' });
            if (expandedProductId === id) setExpandedProductId(null);
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

    return (
        <div className="page">
            <h1 className="page-title">Products</h1>

            {feedback && (
                <Feedback message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
            )}

            <div className="action-bar">
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search by name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                    {searchName && (
                        <button type="button" className="btn btn-secondary" onClick={() => { setSearchName(''); setPage(1); }}>
                            Clear
                        </button>
                    )}
                </form>
                <button className="btn btn-primary" onClick={handleOpenCreate}>+ New Product</button>
            </div>

            {loading ? (
                <Loading />
            ) : products.length === 0 ? (
                <p className="empty-message">No products found.</p>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td><span className="badge">{product.cod}</span></td>
                                        <td className="price">R$ {product.price.toFixed(2)}</td>
                                        <td className="actions-cell">
                                            <button className="btn btn-small btn-secondary" onClick={() => handleToggleMaterials(product.id)}>
                                                Materials
                                            </button>
                                            <button className="btn btn-small btn-primary" onClick={() => handleOpenEdit(product)}>Edit</button>
                                            <button className="btn btn-small btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {expandedProductId && (
                        <div className="materials-container">
                            <div className="materials-header">
                                <h3>Raw Materials - {products.find(p => p.id === expandedProductId)?.name}</h3>
                                <button className="btn btn-small btn-primary" onClick={handleOpenAddMaterial}>+ Add Material</button>
                            </div>
                            {loadingMaterials ? (
                                <Loading />
                            ) : productMaterials.length === 0 ? (
                                <p className="empty-message">No materials associated yet.</p>
                            ) : (
                                <table className="table table-inner">
                                    <thead>
                                        <tr>
                                            <th>Material</th>
                                            <th>Code</th>
                                            <th>Qty Needed</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productMaterials.map((pm) => (
                                            <tr key={pm.id}>
                                                <td>{pm.rawMaterial.name}</td>
                                                <td><span className="badge">{pm.rawMaterial.cod}</span></td>
                                                <td>{pm.quantity}</td>
                                                <td>{pm.rawMaterial.stock}</td>
                                                <td>
                                                    <button className="btn btn-small btn-danger" onClick={() => handleRemoveMaterial(pm.id)}>Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    <div className="cards-mobile">
                        {products.map((product) => (
                            <div key={product.id} className="card">
                                <div className="card-header">
                                    <h3>{product.name}</h3>
                                    <span className="badge">{product.cod}</span>
                                </div>
                                <p className="card-price">R$ {product.price.toFixed(2)}</p>
                                <div className="card-actions">
                                    <button className="btn btn-small btn-secondary" onClick={() => handleToggleMaterials(product.id)}>Materials</button>
                                    <button className="btn btn-small btn-primary" onClick={() => handleOpenEdit(product)}>Edit</button>
                                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                                </div>
                                {expandedProductId === product.id && (
                                    <div className="materials-container card-materials">
                                        <div className="materials-header">
                                            <h4>Raw Materials</h4>
                                            <button className="btn btn-small btn-primary" onClick={handleOpenAddMaterial}>+ Add</button>
                                        </div>
                                        {loadingMaterials ? (
                                            <Loading />
                                        ) : productMaterials.length === 0 ? (
                                            <p className="empty-message">No materials associated.</p>
                                        ) : (
                                            productMaterials.map((pm) => (
                                                <div key={pm.id} className="material-item">
                                                    <div>
                                                        <strong>{pm.rawMaterial.name}</strong> ({pm.rawMaterial.cod})
                                                    </div>
                                                    <div>
                                                        Qty: {pm.quantity} | Stock: {pm.rawMaterial.stock}
                                                        <button className="btn btn-small btn-danger" onClick={() => handleRemoveMaterial(pm.id)}>X</button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                            Previous
                        </button>
                        <span className="pagination-info">Page {page} of {totalPages}</span>
                        <button className="btn btn-secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                            Next
                        </button>
                    </div>
                </>
            )}

            {showModal && (
                <Modal title={editingProduct ? 'Edit Product' : 'New Product'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="productName">Name</label>
                            <input id="productName" type="text" className="input" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="productCod">Code</label>
                            <input id="productCod" type="text" className="input" value={formCod} onChange={(e) => setFormCod(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="productPrice">Price (R$)</label>
                            <input id="productPrice" type="number" className="input" step="0.01" min="0" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} required />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {showMaterialModal && (
                <Modal title="Add Raw Material" onClose={() => setShowMaterialModal(false)}>
                    <form onSubmit={handleAddMaterial}>
                        <div className="form-group">
                            <label htmlFor="materialSelect">Raw Material</label>
                            <select id="materialSelect" className="input" value={selectedRawMaterialId} onChange={(e) => setSelectedRawMaterialId(e.target.value)} required>
                                <option value="">Select a material...</option>
                                {allRawMaterials.map((rm) => (
                                    <option key={rm.id} value={rm.id}>
                                        {rm.name} ({rm.cod}) - Stock: {rm.stock}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="materialQty">Quantity Needed</label>
                            <input id="materialQty" type="number" className="input" min="1" value={materialQuantity} onChange={(e) => setMaterialQuantity(e.target.value)} required />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowMaterialModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default Products;
