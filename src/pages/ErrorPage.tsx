import React from 'react'
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-content">
          <div className="error-code">404</div>
          
          <div className="error-image-wrapper">
            <img 
              src={new URL('../../public/assets/error_image.jpeg', import.meta.url).href}
              alt="Ошибка - страница не найдена"
              className="error-image"
            />
          </div>

          <h1 className="error-title">Oops!</h1>
          <p className="error-message">К сожалению, такой страницы не существует.</p>
          <p className="error-description">Возможно, вы перешли по неправильной ссылке или страница была удалена.</p>

          <button className="error-button" onClick={handleGoHome}>
            ← Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;