import './Testimonials.css';

function Testimonials() {
    const testimonials = [
        {
            name: 'Иван Петров',
            role: 'Менеджер',
            text: 'Отличный сервис! Быстро, надёжно и качественно. Рекомендую всем!',
            rating: 5,
        },
        {
            name: 'Мария Сидорова',
            role: 'Дизайнер',
            text: 'Лучший магазин, который я когда-либо видел. Огромный выбор товаров.',
            rating: 5,
        },
        {
            name: 'Александр Кузнецов',
            role: 'Инженер',
            text: 'Спасибо за отличную работу! Буду обязательно заказывать ещё.',
            rating: 4,
        },
    ];

    return (
        <section className="testimonials">
            <div className="testimonials-container">
                <h2>Отзывы клиентов</h2>
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="rating">
                                {Array(testimonial.rating).fill('⭐').join('')}
                            </div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-author">
                                <h4>{testimonial.name}</h4>
                                <p>{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
