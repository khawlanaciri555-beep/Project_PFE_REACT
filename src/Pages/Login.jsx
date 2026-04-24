import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaSun, FaMoon } from 'react-icons/fa';
import LanguageSwitcher from '../Components/LanguageSwitcher/LanguageSwitcher';
import './Auth.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

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
        <div className="auth-page login-page-custom">
            <div className="login-full-bg">
                <img src="/background/bglogin .jpeg" alt="Background" />
                <div className="login-bg-overlay" />
            </div>

            {/* Content Container */}
            <div className="login-content-container">
                {/* Left Side: Welcome Text */}
                <div className="login-welcome-side">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/home" className="login-brand-minimal">
                            <span className="brand-dot">✦</span>
                            <span>VibKech</span>
                        </Link>
                        <h1 className="welcome-title">{t('auth.login.subtitle').split(' ')[0]} <br/> {t('auth.login.subtitle').split(' ').slice(1).join(' ')}</h1>
                        <p className="welcome-desc">{t('auth.login.description')}</p>
                        
                        <div className="login-social-icons">
                            <button className="social-icon-btn"><FaSun /></button>
                            <button className="social-icon-btn"><FaMoon /></button>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Login Form */}
                <div className="login-form-side">
                    <motion.div 
                        className="login-glass-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="auth-top-controls-inline">
                            <button onClick={toggleTheme} className="theme-toggle-btn-minimal">
                                {isDarkMode ? <FaSun color="#F59E0B" /> : <FaMoon />}
                            </button>
                            <LanguageSwitcher />
                        </div>

                        <div className="form-header-minimal">
                            <h2>{t('auth.login.title')}</h2>
                        </div>

                        {error && (
                            <div className="login-error-msg-minimal">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="minimal-form">
                            <div className="minimal-group">
                                <label>{t('auth.login.email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="minimal-group">
                                <label>{t('auth.login.password')}</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="minimal-pass-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '🙈' : '👁'}
                                </button>
                            </div>

                            <div className="minimal-form-options">
                                <label className="remember-me">
                                    <input type="checkbox" /> {t('auth.login.rememberMe') || 'Remember Me'}
                                </label>
                                <a href="#" className="forgot-link">{t('auth.login.forgotPassword')}</a>
                            </div>

                            <button type="submit" className="minimal-submit-btn" disabled={loading}>
                                {loading ? t('common.loading') : t('auth.login.submit')}
                            </button>
                        </form>

                        <p className="minimal-footer">
                            {t('auth.login.noAccount')}{' '}
                            <Link to="/register">{t('auth.login.register')}</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
