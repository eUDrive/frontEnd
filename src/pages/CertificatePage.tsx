import { useState, useEffect } from 'react';
import { certificatesAPI } from '../api/index';
import type { Certificate } from '../api/index';
import { useCart } from "../context/CartContext";
import "./CertificatePage.css";

function CertificatePage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart, removeAllFromCart, isInCart } = useCart();

    // Загрузить сертификаты при монтировании
    useEffect(() => {
        const loadCertificates = async () => {
            try {
                setLoading(true);
                const data = await certificatesAPI.getAll();
                setCertificates(data);
                setError(null);
            } catch (err) {
                console.error('Ошибка загрузки сертификатов:', err);
                setError('Ошибка при загрузке сертификатов');
            } finally {
                setLoading(false);
            }
        };
        
        loadCertificates();
    }, []);

    const handleToggleCart = (certificate: Certificate) => {
        if (isInCart(certificate.id)) {
            removeAllFromCart(certificate.id);
        } else {
            addToCart(certificate as any);
        }
    };

    if (loading) {
        return (
            <div className="certificate-page">
                <div className="certificate-page__header">
                    <h1>Сертификаты</h1>
                </div>
                <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка сертификатов...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="certificate-page">
                <div className="certificate-page__header">
                    <h1>Сертификаты</h1>
                </div>
                <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>
            </div>
        );
    }

    return (
        <div className="certificate-page">
            <div className="certificate-page__header">
                <h1>Сертификаты</h1>
                <p>Выбери скорость для себя или в подарок:</p>
            </div>

            <div className="certificate-grid">
                {certificates.map((c, idx) => (
                    <article key={c.id} className="certificate-card" data-color={idx}>
                        <div className="certificate-card__content">
                            <h3 className="certificate-card__title">{c.name}</h3>
                            <p className="certificate-card__subtitle">{c.description || 'Премиум сертификат'}</p>
                            <p className="certificate-card__description">{c.description}</p>
                            
                            <div className="certificate-card__footer">
                                <span className="certificate-card__price">
                                    {c.price.toLocaleString("ru-RU")} $
                                </span>
                                <button
                                    type="button"
                                    className={`certificate-card__book-btn ${
                                        isInCart(c.id)
                                            ? "certificate-card__book-btn--booked"
                                            : ""
                                    }`}
                                    onClick={() => handleToggleCart(c)}
                                >
                                    {isInCart(c.id)
                                        ? "✓ В корзине"
                                        : "Добавить в корзину"}
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default CertificatePage;
