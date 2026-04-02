import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../Components/Layout';
import { places } from '../data/mockData';
import './Planning.css';

const Planning = () => {
  const [step, setStep] = useState(1);
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

  // Mock global data for transport and guides (could be extracted from places or defined here)
  const availableTransports = [
    { id: 't1', name: 'Taxi Privé', type: 'Dacia Logan/Lodgy', price: '200 MAD', icon: '🚕' },
    { id: 't2', name: 'Van Touristique', type: 'Mercedes Sprinter', price: '600 MAD', icon: '🚐' },
    { id: 't3', name: 'Voiture de Luxe', type: 'Range Rover', price: '1500 MAD', icon: '🚗' }
  ];

  const allGuides = places.reduce((acc, p) => {
    if (p.services?.guides) acc.push(...p.services.guides);
    return acc;
  }, []);

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
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        />
                      </div>
                      <div className="input-group">
                        <label>Date de fin</label>
                        <input 
                          type="date" 
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="places-selection">
                      <label className="group-label">Sélectionnez les destinations</label>
                      <div className="places-list">
                        {places.map(place => (
                          <div key={place.id} className="place-item-wrap">
                            <motion.div 
                              whileTap={{ scale: 0.98 }}
                              className={`place-selection-item ${formData.selectedPlaces.includes(place.id) ? 'selected' : ''}`}
                              onClick={() => handlePlaceSelect(place.id)}
                            >
                              <img src={place.image} alt={place.title} />
                              <div className="place-mini-info">
                                <h3>{place.title}</h3>
                                <span>{place.category}</span>
                              </div>
                              <div className="select-check">
                                {formData.selectedPlaces.includes(place.id) ? '✓' : '+'}
                              </div>
                            </motion.div>

                            {/* Activities for chosen place */}
                            <AnimatePresence>
                              {formData.selectedPlaces.includes(place.id) && place.services?.activites && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="activities-sublist"
                                >
                                  {place.services.activites.map(act => (
                                    <div 
                                      key={`${place.id}-${act.name}`}
                                      className={`activity-item ${formData.selectedActivities.some(a => a.id === `${place.id}-${act.name}`) ? 'active' : ''}`}
                                      onClick={() => handleActivitySelect(place.id, act.name)}
                                    >
                                      <span className="act-bullet" />
                                      {act.name}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
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
                        {availableTransports.map(t => (
                          <div 
                            key={t.id}
                            className={`transport-item ${formData.transport?.id === t.id ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, transport: t})}
                          >
                            <span className="t-icon">{t.icon}</span>
                            <div className="t-info">
                              <h4>{t.name}</h4>
                              <p>{t.type}</p>
                              <span className="t-price">{t.price}</span>
                            </div>
                            <div className="t-radio" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="route-inputs">
                      <div className="input-group">
                        <label>De (From)</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Aéroport" 
                          value={formData.routeFrom}
                          onChange={(e) => setFormData({...formData, routeFrom: e.target.value})}
                        />
                      </div>
                      <div className="input-group">
                        <label>À (To)</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Riad Médina" 
                          value={formData.routeTo}
                          onChange={(e) => setFormData({...formData, routeTo: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="guide-selection">
                      <label className="group-label">Choisir un guide (Optionnel)</label>
                      <div className="guides-scroll">
                        {allGuides.map((g, i) => (
                          <div 
                            key={i}
                            className={`guide-mini-card ${formData.guide?.name === g.name ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, guide: formData.guide?.name === g.name ? null : g})}
                          >
                            <div className="guide-avatar">{g.name[0]}</div>
                            <div className="guide-text">
                              <h5>{g.name}</h5>
                              <span className="g-status">Disponible</span>
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
                          {formData.selectedPlaces.map(id => (
                            <span key={id} className="sum-tag">
                              {places.find(p => p.id === id)?.title}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="summary-item">
                        <span className="sum-label">Activités :</span>
                        <div className="sum-tags">
                          {formData.selectedActivities.map(a => (
                            <span key={a.id} className="sum-tag secondary">
                              {a.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="summary-item">
                        <span className="sum-label">Transport :</span>
                        <p>{formData.transport ? `${formData.transport.name} (${formData.routeFrom} → ${formData.routeTo})` : 'Non sélectionné'}</p>
                      </div>

                      <div className="summary-item">
                        <span className="sum-label">Guide :</span>
                        <p>{formData.guide ? formData.guide.name : 'Aucun guide'}</p>
                      </div>
                    </div>

                    <div className="confirmation-notice">
                      <p>En confirmant, vous recevrez une demande de réservation pour tous ces services.</p>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button className="btn-back" onClick={prevStep}>Modifier</button>
                    <button className="btn-confirm" onClick={() => alert('Planning Confirmé !')}>Réserver mon Planning</button>
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
