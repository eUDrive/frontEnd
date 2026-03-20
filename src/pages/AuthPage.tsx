import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { getOAuthProvider, generateOAuthUrl, generateRandomState } from '../utils/oauth';
import './AuthPage.css';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isLoading, error, isSuccess, clearError } = useAuth();

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
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setSignupErrors({});
    try {
      await signup(signupEmail, signupPassword, signupName);
    } catch (err) {
      // Error is handled in context
    }
  };

  /**
   * Handle OAuth login
   */
  const handleOAuthLogin = (providerName: string) => {
    const provider = getOAuthProvider(providerName);
    if (!provider) return;

    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = generateRandomState();

    // Store state in sessionStorage for verification on callback
    sessionStorage.setItem('oauth_state', state);

    const oauthUrl = generateOAuthUrl(provider, redirectUri, state);
    window.location.href = oauthUrl;
  };

  if (isSuccess) {
    return (
      <div className="auth-page auth-page--success">
        <div className="success-message">
          <h2>✓ Authentication Successful</h2>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Authentication</h1>
          <p>Secure access to your account</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
            onClick={() => setIsLogin(true)}
            disabled={isLoading}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'auth-tab--active' : ''}`}
            onClick={() => setIsLogin(false)}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Login Form */}
        {isLogin && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                className={loginErrors.email ? 'input-error' : ''}
              />
              {loginErrors.email && (
                <span className="error-message">{loginErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
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
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {!isLogin && (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Enter your name"
                disabled={isLoading}
                className={signupErrors.name ? 'input-error' : ''}
              />
              {signupErrors.name && (
                <span className="error-message">{signupErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                className={signupErrors.email ? 'input-error' : ''}
              />
              {signupErrors.email && (
                <span className="error-message">{signupErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Create a strong password"
                disabled={isLoading}
                className={signupErrors.password ? 'input-error' : ''}
              />
              {signupErrors.password && (
                <span className="error-message">{signupErrors.password}</span>
              )}
              <small className="password-hint">
                Password must contain at least 8 characters, including uppercase, lowercase, and numbers.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <input
                id="signup-confirm-password"
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="auth-footer">
          <small>
            By continuing, you agree to our{' '}
            <a href="#terms" className="link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" className="link">
              Privacy Policy
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};
