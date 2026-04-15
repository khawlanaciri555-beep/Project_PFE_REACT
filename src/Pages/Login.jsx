import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Auth.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(credentials);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page login-page">
            {/* Left Panel — decorative */}
            <div className="login-left-panel">
                <div className="login-panel-overlay" />
                <div className="login-panel-content">
                    <div className="login-brand">
                        <span className="login-brand-icon">✦</span>
                        <span className="login-brand-name">VibKech</span>
                    </div>
                    <h2 className="login-panel-title">
                        Welcome Back to<br />
                        <em>the Red City</em>
                    </h2>
                    <p className="login-panel-desc">
                        Sign in to continue your Marrakech journey — 
                        discover hidden riads, vibrant souks, and timeless experiences.
                    </p>
                    <div className="login-panel-stats">
                        <div className="lp-stat">
                            <span>800+</span>
                            <small>Monuments</small>
                        </div>
                        <div className="lp-stat-divider" />
                        <div className="lp-stat">
                            <span>10M+</span>
                            <small>Tourists / Year</small>
                        </div>
                        <div className="lp-stat-divider" />
                        <div className="lp-stat">
                            <span>UNESCO</span>
                            <small>Heritage</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — form */}
            <div className="login-right-panel">
                <div className="login-form-card">
                    {/* Header */}
                    <div className="login-form-header">
                        <div className="login-form-eyebrow">
                            <span className="lf-line" />
                            <span>SECURE LOGIN</span>
                            <span className="lf-line" />
                        </div>
                        <h1>{t('auth.login.title')}</h1>
                        <p>{t('auth.login.title')}</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="login-error-msg">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email */}
                        <div className="floating-group">
                            <span className="input-icon">✉</span>
                            <input
                                className="floating-input"
                                type="email"
                                name="email"
                                placeholder=" "
                                value={credentials.email}
                                onChange={handleChange}
                                required
                                id="login-email"
                            />
                            <label className="floating-label" htmlFor="login-email">
                                {t('auth.login.email')}
                            </label>
                        </div>

                        {/* Password */}
                        <div className="floating-group">
                            <span className="input-icon">🔒</span>
                            <input
                                className="floating-input"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder=" "
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                id="login-password"
                            />
                            <label className="floating-label" htmlFor="login-password">
                                {t('auth.login.password')}
                            </label>
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>

                        {/* Forgot password */}
                        <div className="login-forgot">
                            <a href="#" id="forgot-password-link">Mot de passe oublié ?</a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                            id="login-submit-btn"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" />
                                    {t('common.loading')}
                                </>
                            ) : (
                                <>
                                    {t('auth.login.submit')}
                                    <span style={{ fontSize: '1.1rem' }}>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="login-divider">
                        <span />
                        <small>—</small>
                        <span />
                    </div>

                    {/* Social placeholders */}
                    <div className="login-social">
                        <button className="social-btn" id="google-login-btn">🌐 Google</button>
                        <button className="social-btn" id="facebook-login-btn">f Facebook</button>
                    </div>

                    {/* Footer */}
                    <p className="login-form-footer">
                        {t('auth.login.noAccount')}{' '}
                        <Link to="/register" id="go-to-register">{t('auth.login.register')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
