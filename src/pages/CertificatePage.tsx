import { useState } from "react";
import { certificates } from "../data/certificates";
import "./CertificatePage.css";

function CertificatePage() {
    const [bookedIds, setBookedIds] = useState<number[]>([]);

    const toggleBooked = (id: number) => {
        setBookedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
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
                                        bookedIds.includes(c.id)
                                            ? "certificate-card__book-btn--booked"
                                            : ""
                                    }`}
                                    onClick={() => toggleBooked(c.id)}
                                >
                                    {bookedIds.includes(c.id)
                                        ? "✓ Забронировано"
                                        : "Забронировать"}
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