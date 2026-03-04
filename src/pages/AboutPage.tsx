import './AboutPage.css';

function AboutPage() {
    return (
        <div className="about-page">
            <div className="about-header">
                <h1>О нас</h1>
                <p>Ваш путь к легендарному Нюрбургрингу</p>
            </div>

            <div className="about-content">
                <section className="about-section">
                    <h2>🏁 Кто мы</h2>
                    <p>
                        eUDrive — это премиальный сервис аренды гоночных автомобилей на легендарной трассе 
                        Nürburgring Nordschleife в Германии. Мы предлагаем уникальную возможность 
                        почувствовать себя настоящим гонщиком за рулем мощнейших спортивных машин.
                    </p>
                </section>

                <section className="about-section">
                    <h2>🚗 Что мы предлагаем</h2>
                    <ul>
                        <li>Аренда премиальных спортивных автомобилей</li>
                        <li>Профессиональные инструкторы</li>
                        <li>Гибкие пакеты (6 или 12 кругов)</li>
                        <li>Полное страхование и техподдержка</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>🏆 Почему мы</h2>
                    <ul>
                        <li>Более 500 довольных клиентов</li>
                        <li>Новейший автопарк 2021-2023 годов</li>
                        <li>Безопасность — наш приоритет</li>
                        <li>Незабываемые впечатления гарантированы</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;
