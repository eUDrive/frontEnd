import './Features.css';

function Features() {
    const features = [
        {
            icon: '🚀',
            title: 'Быстрая доставка',
            description: 'Получайте товары за 2-3 дня',
        },
        {
            icon: '💰',
            title: 'Лучшие цены',
            description: 'Гарантированная самая низкая цена',
        },
        {
            icon: '🔒',
            title: 'Безопасность',
            description: 'Защита ваших данных и платежей',
        },
        {
            icon: '⭐',
            title: '5000+ отзывов',
            description: 'Среднее: 4.9 из 5 звёзд',
        },
    ];

    return (
        <section className="features">
            <div className="features-container">
                <h2>Почему выбирают нас?</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
