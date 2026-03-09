import { Link } from 'react-router-dom';
import './CTA.css';

function CTA() {
    return (
        <section className="cta">
            <div className="cta-container">
                <h2>Готовы начать?</h2>
                <p>Откройте для себя тысячи товаров с лучшими предложениями</p>
                <Link to="/catalog" className="cta-button">
                    Перейти в каталог
                </Link>
            </div>
        </section>
    );
}

export default CTA;
