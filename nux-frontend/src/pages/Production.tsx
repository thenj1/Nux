import { useState } from 'react';
import { getProductionSuggestion } from '../services/api';
import type { ProductionSummary } from '../services/api';
import Loading from '../components/Loading';
import Feedback from '../components/Feedback';

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

    return (
        <div className="page">
            <h1 className="page-title">Production Suggestion</h1>
            <p className="page-subtitle">
                Calculate which products can be produced with the current raw material stock.
                Products with higher value are prioritized.
            </p>

            {feedback && (
                <Feedback message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />
            )}

            <div className="action-bar">
                <button className="btn btn-primary btn-large" onClick={handleCalculate} disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate Production'}
                </button>
            </div>

            {loading && <Loading />}

            {data && !loading && (
                <>
                    <div className="total-card">
                        <p className="total-label">Estimated Total Value</p>
                        <p className="total-value">R$ {data.totalValue.toFixed(2)}</p>
                        <p className="total-info">{data.suggestions.length} product(s) can be produced</p>
                    </div>

                    {data.suggestions.length === 0 ? (
                        <p className="empty-message">No products can be produced with current stock.</p>
                    ) : (
                        <>
                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Code</th>
                                            <th>Unit Price</th>
                                            <th>Qty Produceable</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.suggestions.map((item) => (
                                            <tr key={item.productId}>
                                                <td><strong>{item.productName}</strong></td>
                                                <td><span className="badge">{item.productCode}</span></td>
                                                <td>R$ {item.productPrice.toFixed(2)}</td>
                                                <td><span className="qty-badge">{item.quantity}</span></td>
                                                <td className="price">R$ {(item.productPrice * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="cards-mobile">
                                {data.suggestions.map((item) => (
                                    <div key={item.productId} className="card">
                                        <div className="card-header">
                                            <h3>{item.productName}</h3>
                                            <span className="badge">{item.productCode}</span>
                                        </div>
                                        <div className="card-details">
                                            <p>Unit Price: <strong>R$ {item.productPrice.toFixed(2)}</strong></p>
                                            <p>Quantity: <span className="qty-badge">{item.quantity}</span></p>
                                            <p className="card-price">Subtotal: <strong>R$ {(item.productPrice * item.quantity).toFixed(2)}</strong></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Production;
