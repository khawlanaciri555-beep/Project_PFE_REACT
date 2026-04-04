import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../Components/Layout';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaChevronRight, FaChevronLeft, FaCheckCircle, FaCar, FaUserTie } from 'react-icons/fa';
import './Planning.css';

const Planning = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState([]);
  const [formData, setFormData] = useState({
    selectedPlaces: [],
    selectedActivities: [],
    startDate: '',
    endDate: '',
    transport: null,
    routeFrom: '',
    routeTo: '',
    guide: null
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setAllServices(response.data);
    } catch (err) {
      console.error('Failed to load services for planning', err);
    } finally {
      setLoading(false);
    }
  };

  const destinations = allServices.filter(s => s.type === 'Activity' || s.type === 'Experience');
  const transports = allServices.filter(s => s.type === 'Transport');
  const guides = allServices.filter(s => s.type === 'Guide');

  const handlePlaceSelect = (placeId) => {
    const isSelected = formData.selectedPlaces.includes(placeId);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedPlaces: formData.selectedPlaces.filter(id => id !== placeId),
        // Remove related activities
        selectedActivities: formData.selectedActivities.filter(act => act.placeId !== placeId)
      });
    } else {
      setFormData({
        ...formData,
        selectedPlaces: [...formData.selectedPlaces, placeId]
      });
    }
  };

  const handleActivitySelect = (placeId, activityName) => {
    const activityKey = `${placeId}-${activityName}`;
    const isSelected = formData.selectedActivities.some(a => a.id === activityKey);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedActivities: formData.selectedActivities.filter(a => a.id !== activityKey)
      });
    } else {
      setFormData({
        ...formData,
        selectedActivities: [...formData.selectedActivities, { id: activityKey, placeId, name: activityName }]
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Layout>
      <div className="planning-page">
        <div className="bg-pattern" />

        <div className="max-container">
          <div className="planning-header">
            <span className="section-eyebrow">ORGANISEZ VOTRE VOYAGE</span>
            <h1 className="planning-title">Planificateur de Voyage Wizard</h1>

            {/* Step Indicator */}
            <div className="step-indicator">
              <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
              <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
              <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>
          </div>

          <div className="planning-card">
            <AnimatePresence mode="wait">
              {/* STEP 1: Places & Activities */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="step-content"
                >
                  <div className="step-section">
                    <h2 className="step-section-title">1. Choisissez vos lieux & dates</h2>

                    <div className="date-inputs">
                      <div className="input-group">
                        <label>Date de début</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label>Date de fin</label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="places-selection">
                      <label className="group-label">Sélectionnez les destinations</label>
                      <div className="places-list">
                        {destinations.map(place => (
                          <div key={place.id} className="place-item-wrap">
                            <motion.div
                              whileTap={{ scale: 0.98 }}
                              className={`place-selection-item ${formData.selectedPlaces.some(p => p.id === place.id) ? 'selected' : ''}`}
                              onClick={() => {
                                 const isSelected = formData.selectedPlaces.some(p => p.id === place.id);
                                 if (isSelected) {
                                   setFormData({ ...formData, selectedPlaces: formData.selectedPlaces.filter(p => p.id !== place.id) });
                                 } else {
                                   setFormData({ ...formData, selectedPlaces: [...formData.selectedPlaces, place] });
                                 }
                              }}
                            >
                              <img src={place.image || '/logo picter/placeholder.jpg'} alt={place.title} />
                              <div className="place-mini-info">
                                <h3>{place.title}</h3>
                                <span>{place.category || place.type}</span>
                              </div>
                              <div className="select-check">
                                {formData.selectedPlaces.some(p => p.id === place.id) ? '✓' : '+'}
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="step-actions">
                    <div />
                    <button
                      className="btn-next"
                      onClick={nextStep}
                      disabled={formData.selectedPlaces.length === 0 || !formData.startDate}
                    >
                      Continuer
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Transport & Guide */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="step-content"
                >
                  <div className="step-section">
                    <h2 className="step-section-title">2. Moyens de transports & Guides</h2>

                    <div className="transport-selection">
                      <label className="group-label">Transport</label>
                      <div className="transport-grid">
                        {transports.map(t => (
                          <div
                            key={t.id}
                            className={`transport-item ${formData.transport?.id === t.id ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, transport: t })}
                          >
                            <span className="t-icon"><FaCar /></span>
                            <div className="t-info">
                              <h4>{t.title}</h4>
                              <p>{t.type || 'Chauffeur Privé'}</p>
                              <span className="t-price">{t.price}</span>
                            </div>
                            <div className="t-radio" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="route-inputs">
                      <div className="input-group">
                        <label>Lieu de départ</label>
                        <input
                          type="text"
                          placeholder="Ex: Aéroport de Marrakech"
                          value={formData.routeFrom}
                          onChange={(e) => setFormData({ ...formData, routeFrom: e.target.value })}
                        />
                      </div>
                      <div className="input-group">
                        <label>Lieu d'arrivée</label>
                        <input
                          type="text"
                          placeholder="Ex: Riad Dar El Bacha"
                          value={formData.routeTo}
                          onChange={(e) => setFormData({ ...formData, routeTo: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="guide-selection">
                      <label className="group-label">Choisir un guide (Optionnel)</label>
                      <div className="guides-scroll">
                        {guides.map((g, i) => (
                          <div
                            key={g.id}
                            className={`guide-mini-card ${formData.guide?.id === g.id ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, guide: formData.guide?.id === g.id ? null : g })}
                          >
                            <div className="guide-avatar"><FaUserTie /></div>
                            <div className="guide-text">
                              <h5>{g.title}</h5>
                              <span className="g-status">{g.price} / jour</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button className="btn-back" onClick={prevStep}>Retour</button>
                    <button
                      className="btn-next"
                      onClick={nextStep}
                    >
                      Récapitulatif
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Summary */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="step-content"
                >
                  <div className="step-section">
                    <h2 className="step-section-title">3. Résumé de votre Planning</h2>

                    <div className="summary-list">
                      <div className="summary-item">
                        <span className="sum-label">Dates :</span>
                        <p>Du {formData.startDate} au {formData.endDate || '?'}</p>
                      </div>

                      <div className="summary-item">
                        <span className="sum-label">Lieux sélectionnés :</span>
                        <div className="sum-tags">
                          {formData.selectedPlaces.map(p => (
                            <span key={p.id} className="sum-tag">
                              {p.title}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="summary-item">
                        <span className="sum-label">Transport :</span>
                        <p>{formData.transport ? `${formData.transport.title} (${formData.routeFrom} → ${formData.routeTo})` : 'Non sélectionné'}</p>
                      </div>

                      <div className="summary-item">
                        <span className="sum-label">Guide :</span>
                        <p>{formData.guide ? formData.guide.title : 'Aucun guide'}</p>
                      </div>
                    </div>

                    <div className="confirmation-notice">
                      <p>En confirmant, vous recevrez une demande de réservation pour tous ces services.</p>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button className="btn-back" onClick={prevStep}>Modifier</button>
                    <button className="btn-confirm" onClick={async () => {
                        try {
                          await api.post('/itineraries', formData);
                          alert('Planning Confirmé ! Vos réservations ont été envoyées.');
                          navigate('/dashboard/my-bookings');
                        } catch (err) {
                           alert('Une erreur est survenue lors de la réservation.');
                        }
                    }}>Réserver mon Planning</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Planning;
