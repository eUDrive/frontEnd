import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import './AuthPage.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isLoading, error, clearError } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  // Clear error when switching tabs
  useEffect(() => {
    if (error) clearError();
  }, [isLogin, clearError, error]);

  useEffect(() => {
    if (!isOpen) {
      setLoginEmail('');
      setLoginPassword('');
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setLoginErrors({});
      setSignupErrors({});
    }
  }, [isOpen]);

  /**
   * Handle login form submission
   */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Validate fields
    const emailValidation = validateEmail(loginEmail);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }

    const passwordValidation = validatePassword(loginPassword);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err) {
      // Error is handled in context
    }
  };

  /**
   * Handle signup form submission
   */
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Validate fields
    const nameValidation = validateName(signupName);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message;
    }

    const emailValidation = validateEmail(signupEmail);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }

    const passwordValidation = validatePassword(signupPassword);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setSignupErrors({});
    try {
      await signup(signupEmail, signupPassword, signupName);
      onClose();
    } catch (err) {
      // Error is handled in context
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-header">
          <h1>Вход в аккаунт</h1>
          <p>Безопасный доступ к вашему профилю</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
            onClick={() => setIsLogin(true)}
            disabled={isLoading}
          >
            Вход
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'auth-tab--active' : ''}`}
            onClick={() => setIsLogin(false)}
            disabled={isLoading}
          >
            Регистрация
          </button>
        </div>

        {/* Error message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Login Form */}
        {isLogin && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="E-mail адрес"
                disabled={isLoading}
                className={loginErrors.email ? 'input-error' : ''}
              />
              {loginErrors.email && (
                <span className="error-message">{loginErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Пароль"
                disabled={isLoading}
                className={loginErrors.password ? 'input-error' : ''}
              />
              {loginErrors.password && (
                <span className="error-message">{loginErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Вход'}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {!isLogin && (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <input
                id="signup-name"
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Полное имя"
                disabled={isLoading}
                className={signupErrors.name ? 'input-error' : ''}
              />
              {signupErrors.name && (
                <span className="error-message">{signupErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <input
                id="signup-email"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="E-mail адрес"
                disabled={isLoading}
                className={signupErrors.email ? 'input-error' : ''}
              />
              {signupErrors.email && (
                <span className="error-message">{signupErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <input
                id="signup-password"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Пароль (минимум 8 символов)"
                disabled={isLoading}
                className={signupErrors.password ? 'input-error' : ''}
              />
              {signupErrors.password && (
                <span className="error-message">{signupErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <input
                id="signup-confirm-password"
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                placeholder="Подтвердите пароль"
                disabled={isLoading}
                className={signupErrors.confirmPassword ? 'input-error' : ''}
              />
              {signupErrors.confirmPassword && (
                <span className="error-message">{signupErrors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="auth-footer">
          <small>
            Продолжая, вы соглашаетесь с нашими{' '}
            <a href="#terms" className="link">
              Условиями обслуживания
            </a>{' '}
            и{' '}
            <a href="#privacy" className="link">
              Политикой конфиденциальности
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

// Legacy AuthPage component for backward compatibility
export const AuthPage: React.FC = () => {
  return <AuthModal isOpen={true} onClose={() => window.history.back()} />;
};
