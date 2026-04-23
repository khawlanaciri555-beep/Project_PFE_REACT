import React, { useContext } from 'react';
import Layout from '../Components/Layout';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMapMarkerAlt, FaCalendarCheck, FaClock } from 'react-icons/fa';
import getImageUrl from '../utils/imageUrl';
import { useNavigate } from 'react-router-dom';
import './MySelection.css';

const MySelection = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="selection-page">
                <div className="selection-header">
                    <div className="max-container">
                        <h1>Ma Sélection</h1>
                        <p>Retrouvez ici tous vos choix pour votre prochain séjour à Marrakech.</p>
                    </div>
                </div>

                <div className="max-container">
                    <div className="selection-grid">
                        <div className="selection-list">
                            <AnimatePresence>
                                {cart.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="empty-state"
                                    >
                                        <div className="empty-icon">🎒</div>
                                        <h2>Votre sélection est vide</h2>
                                        <p>Explorez les lieux et les services pour commencer à planifier votre voyage.</p>
                                        <button onClick={() => navigate('/explore')} className="btn-primary">
                                            Explorer Marrakech
                                        </button>
                                    </motion.div>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div 
                                            key={`${item.type}-${item.id}`}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="selection-card"
                                        >
                                            <div className="card-image-wrap">
                                                <img src={getImageUrl(item.image)} alt={item.title} />
                                                <div className="card-badge">{item.type}</div>
                                            </div>
                                            <div className="card-details">
                                                <div className="card-main">
                                                    <h3>{item.title}</h3>
                                                    <p className="card-loc"><FaMapMarkerAlt /> {item.location || 'Marrakech'}</p>
                                                    <p className="card-desc">{item.description || 'Service sélectionné pour votre voyage.'}</p>
                                                </div>
                                                <div className="card-footer">
                                                    <div className="card-price">
                                                        {item.price > 0 ? (
                                                            <><span>À partir de</span> {item.price} MAD</>
                                                        ) : (
                                                            'Prix sur demande'
                                                        )}
                                                    </div>
                                                    <div className="card-actions">
                                                        <button onClick={() => removeFromCart(item.id, item.type)} className="btn-remove">
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="selection-summary">
                            <div className="summary-card">
                                <h3>Résumé du Voyage</h3>
                                <div className="summary-item">
                                    <span>Éléments sélectionnés</span>
                                    <span>{cart.length}</span>
                                </div>
                                <div className="summary-divider" />
                                <div className="summary-total">
                                    <span>Points d'intérêt</span>
                                    <span>{cart.filter(i => i.type === 'place').length}</span>
                                </div>
                                <div className="summary-total">
                                    <span>Services réservés</span>
                                    <span>{cart.filter(i => i.type !== 'place').length}</span>
                                </div>
                                
                                <button className="btn-book-all" disabled={cart.length === 0}>
                                    Confirmer ma Sélection
                                </button>
                                <p className="summary-note">
                                    <FaClock /> Votre sélection est sauvegardée automatiquement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MySelection;
