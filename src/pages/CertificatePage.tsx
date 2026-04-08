import { certificates } from "../data/certificates";
import { useCart } from "../context/CartContext";
import "./CertificatePage.css";

function CertificatePage() {
    const { addToCart, removeAllFromCart, isInCart } = useCart();

    const handleToggleCart = (certificate: typeof certificates[0]) => {
        if (isInCart(certificate.id)) {
            removeAllFromCart(certificate.id);
        } else {
            addToCart(certificate);
        }
    };

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
                            <h3 className="certificate-card__title">{c.title}</h3>
                            <p className="certificate-card__subtitle">{c.duration}</p>
                            <p className="certificate-card__description">{c.description}</p>
                            
                            <ul className="certificate-card__includes">
                                {c.includes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            
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
