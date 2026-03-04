import { Link } from "react-router-dom";
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      {/* Фон — фото трассы Нюрбургринг */}
      <div className="hero__overlay" />

      <div className="hero__content">
        {/* Заголовок */}
        <h1>Почувствуй трек.<br />Арендуй гоночный болид.</h1>

        {/* Подзаголовок */}
        <p>
          Аренда гоночных автомобилей на Nürburgring Nordschleife.
        </p>

        {/* Кнопка — скроллит к каталогу */}
        <Link to="/catalog">
          <button className="hero__btn">Выбрать авто</button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;