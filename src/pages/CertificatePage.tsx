import { certificates } from "../data/certificates";

function CertificatePage() {
    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
            <div>
                <h1>Сертификаты</h1>
                <p>Выбери скорость для себя или в подарок</p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "16px",
                    marginTop: "16px",
                }}
            >
                {certificates.map((c) => (
                    <div
                        key={c.id}
                        style={{ border: "1px solid #000", padding: "16px" }}
                    >
                        <h3 style={{ marginTop: 0 }}>{c.title}</h3>
                        <p><strong>Длительность:</strong> {c.duration}</p>
                        <p>{c.description}</p>
                        <p><strong>Цена:</strong> {c.price} $</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CertificatePage;