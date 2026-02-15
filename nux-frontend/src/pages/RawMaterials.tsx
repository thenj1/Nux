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

    async function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        try {
            await deleteRawMaterial(id);
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

    function getStockClass(stock: number): string {
        return stock <= 10 ? 'stock-badge stock-low' : 'stock-badge stock-ok';
    }

    return (
        <div className="page">
            <h1 className="page-title">Raw Materials</h1>

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
                <button className="btn btn-primary" onClick={handleOpenCreate}>+ New Material</button>
            </div>

            {loading ? (
                <Loading />
            ) : materials.length === 0 ? (
                <p className="empty-message">No materials found.</p>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((material) => (
                                    <tr key={material.id}>
                                        <td>{material.id}</td>
                                        <td>{material.name}</td>
                                        <td><span className="badge">{material.cod}</span></td>
                                        <td>
                                            <span className={getStockClass(material.stock)}>{material.stock}</span>
                                        </td>
                                        <td className="actions-cell">
                                            <button className="btn btn-small btn-primary" onClick={() => handleOpenEdit(material)}>Edit</button>
                                            <button className="btn btn-small btn-danger" onClick={() => handleDelete(material.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="cards-mobile">
                        {materials.map((material) => (
                            <div key={material.id} className="card">
                                <div className="card-header">
                                    <h3>{material.name}</h3>
                                    <span className="badge">{material.cod}</span>
                                </div>
                                <p className="card-stock">
                                    Stock: <span className={getStockClass(material.stock)}>{material.stock}</span>
                                </p>
                                <div className="card-actions">
                                    <button className="btn btn-small btn-primary" onClick={() => handleOpenEdit(material)}>Edit</button>
                                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(material.id)}>Delete</button>
                                </div>
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
                <Modal title={editingMaterial ? 'Edit Material' : 'New Material'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="materialName">Name</label>
                            <input id="materialName" type="text" className="input" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="materialCod">Code</label>
                            <input id="materialCod" type="text" className="input" value={formCod} onChange={(e) => setFormCod(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="materialStock">Stock</label>
                            <input id="materialStock" type="number" className="input" min="0" value={formStock} onChange={(e) => setFormStock(e.target.value)} required />
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
        </div>
    );
}

export default RawMaterials;
