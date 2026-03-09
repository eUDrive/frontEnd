import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-info">
                    <h2>UDrive</h2>
                    <p className="footer-location">
                        📍 Nürburgring Nordschleife, Германия
                    </p>
                    <p className="footer-copyright">
                        © 2026 UDrive
                    </p>
                </div>

                <div className="footer-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12833.008385472138!2d6.924809094401049!3d50.3406025759259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bfad1f9faa5837%3A0xe564a5e5605ae5f3!2sN%C3%BCrburgring%20Nordschleife%2C%2053518%20Quiddelbach%2C%20Germany!5e0!3m2!1sen!2s!4v1773051723581!5m2!1sen!2s"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Nürburgring Location"
                        allowFullScreen
                    />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
