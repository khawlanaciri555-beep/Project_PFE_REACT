import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../Components/Layout';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaChevronRight, FaChevronLeft, FaCheckCircle, FaCar, FaStar } from 'react-icons/fa';
import ServiceMap from '../Components/Explore/ServiceMap';
import './Planning.css';

const Planning = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [services, setServices] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [transports, setTransports] = useState([]);
  const [filters, setFilters] = useState({ budget: 5000, category: 'All' });
  
  const [formData, setFormData] = useState({
    selectedPlaces: [],
    selectedActivities: [],
    startDate: '',
    endDate: '',
    selectedHotel: null,
    selectedTransport: null,
    routeFrom: '',
    routeTo: ''
  });

  // Calculate duration in nights
  const nights = formData.startDate && formData.endDate 
    ? Math.max(0, Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)))
    : 0;

  // Real-time Budget Calculation
  const totalBudget = (formData.selectedActivities.reduce((acc, curr) => acc + curr.price, 0)) +
    (formData.selectedHotel ? formData.selectedHotel.price * nights : 0) +
    (formData.selectedTransport ? parseInt(formData.selectedTransport.price || 0) : 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [placesRes, servicesRes, hotelsRes, transportsRes] = await Promise.all([
          api.get('/places'),
          api.get('/services'),
          api.get('/hotels'),
          api.get('/transports')
        ]);
        setPlaces(placesRes.data.data || placesRes.data);
        setServices(servicesRes.data.data || servicesRes.data);
        setHotels(hotelsRes.data.data || hotelsRes.data);
        setTransports(transportsRes.data.data || transportsRes.data);
      } catch (err) {
        console.error('Failed to load planning data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextStep = () => {
    if (step === 1 && (!formData.startDate || !formData.endDate || formData.selectedPlaces.length === 0)) {
        alert('Veuillez remplir les dates et choisir au moins un lieu.');
        return;
    }
    if (step === 1 && nights <= 0) {
        alert('La date de fin doit être après la date de début.');
        return;
    }
    setStep(step + 1);
  };
  
  const prevStep = () => setStep(step - 1);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <Layout>
      <div className="planning-page premium-theme">
        <div className="bg-pattern" />

        {/* Floating Budget Summary */}
        <motion.div 
          className="floating-budget-bar"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="budget-content">
             <div className="budget-info">
                <span>ESTIMATION TOTAL</span>
                <h3>{totalBudget} MAD</h3>
             </div>
             <div className="budget-stats">
                <div className="stat-item"><FaMapMarkerAlt /> {formData.selectedPlaces.length} Lieux</div>
                <div className="stat-item"><FaCalendarAlt /> {nights} Nuits</div>
             </div>
             <button className="budget-next-btn" onClick={nextStep}>
               {step === 4 ? 'Confirmer' : 'Suivant'} <FaChevronRight />
             </button>
          </div>
        </motion.div>

        <div className="max-container">
          <div className="planning-header">
            <span className="section-eyebrow">CONCIERGERIE VibKech</span>
            <h1 className="planning-title premium-font">Créez votre évasion de luxe</h1>

            {/* Step Indicator (Stepper) */}
            <div className="stepper-wrapper">
              <div className="stepper">
                {[
                  { id: 1, label: 'Destinations' },
                  { id: 2, label: 'Expériences' },
                  { id: 3, label: 'Hébergement' },
                  { id: 4, label: 'Signature' }
                ].map((s) => (
                  <React.Fragment key={s.id}>
                    <div className={`step-item ${step >= s.id ? 'active' : ''} ${step === s.id ? 'current' : ''}`}>
                      <div className="step-number">{step > s.id ? '✓' : s.id}</div>
                      <span className="step-label">{s.label}</span>
                    </div>
                    {s.id < 4 && <div className={`step-progress ${step > s.id ? 'active' : ''}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="planning-card">
            {loading ? (
              <div className="premium-loader-container">
                 <div className="premium-loader"></div>
                 <p>Préparation de votre évasion...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
              {/* STEP 1: Destinations & Dates */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                  className="step-content"
                >
                  <motion.div variants={itemVariants} className="step-section">
                    <h2 className="step-section-title premium-font">Où et quand commence l'aventure ?</h2>

                    <div className="date-inputs-premium">
                      <div className="input-group-premium">
                        <label><FaCalendarAlt /> Arrivée</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                      </div>
                      <div className="input-group-premium">
                        <label><FaCalendarAlt /> Départ</label>
                        <input
                          type="date"
                          value={formData.endDate}
                          min={formData.startDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                      </div>
                      <div className="nights-badge">
                         <span>{nights} nuits</span>
                      </div>
                    </div>

                    <div className="places-selection">
                      <label className="group-label">Destinations de Rêve</label>
                      <motion.div variants={containerVariants} className="places-grid-premium">
                        {Array.isArray(places) && places.map(place => (
                          <motion.div
                            key={place.id}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`place-card-premium ${formData.selectedPlaces.some(p => p.id === place.id) ? 'selected' : ''}`}
                            onClick={() => {
                               const isSelected = formData.selectedPlaces.some(p => p.id === place.id);
                               if (isSelected) {
                                 setFormData({ ...formData, selectedPlaces: formData.selectedPlaces.filter(p => p.id !== place.id) });
                               } else {
                                 setFormData({ ...formData, selectedPlaces: [...formData.selectedPlaces, place] });
                               }
                            }}
                          >
                            <div className="place-card-img-premium">
                              <img src={place.image || '/logo picter/placeholder.jpg'} alt={place.name} />
                              <div className="premium-overlay" />
                              <div className="selection-indicator">
                                {formData.selectedPlaces.some(p => p.id === place.id) ? <FaCheckCircle /> : <div className="plus-icon">+</div>}
                              </div>
                              <div className="place-badge">{place.category || 'Medina'}</div>
                            </div>
                            <div className="place-card-body-premium">
                              <h3>{place.name}</h3>
                              <p><FaMapMarkerAlt /> {place.address?.split(',')[0] || 'Marrakech'}</p>
                            </div>
                          </motion.div>
                        ))}
                        {(!places || places.length === 0) && (
                          <div className="no-data-msg">Aucune destination trouvée.</div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  <div className="step-actions">
                    <div />
                    <button className="btn-premium-next" onClick={nextStep}>
                      Continuer <FaChevronRight />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Experiences */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                  className="step-content"
                >
                  <motion.div variants={itemVariants} className="step-section">
                    <div className="section-header-premium">
                      <h2 className="step-section-title premium-font">Expériences sur mesure</h2>
                      <div className="discovery-chips">
                         {['All', 'Activity', 'Experience', 'Tour', 'Workshop'].map((cat, idx) => (
                           <motion.button 
                             key={cat} 
                             variants={itemVariants}
                             className={`discovery-chip ${filters.category === cat ? 'active' : ''}`}
                             onClick={() => setFilters({...filters, category: cat})}
                           >
                             {cat === 'All' ? 'Tout' : cat}
                           </motion.button>
                         ))}
                      </div>
                    </div>

                    <div className="budget-discovery">
                       <div className="budget-label">
                          <label>Votre budget par activité</label>
                          <span>{filters.budget} MAD</span>
                       </div>
                       <input 
                         type="range" 
                         min="100" 
                         max="10000" 
                         step="100" 
                         className="premium-slider"
                         value={filters.budget} 
                         onChange={(e) => setFilters({...filters, budget: parseInt(e.target.value)})} 
                       />
                    </div>

                    <motion.div variants={containerVariants} className="activities-grid-premium">
                      {services
                        .filter(s => (filters.category === 'All' || s.type === filters.category) && s.price <= filters.budget)
                        .map(service => (
                          <motion.div 
                            key={service.id} 
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            className={`activity-card-premium ${formData.selectedActivities.some(a => a.id === service.id) ? 'selected' : ''}`}
                          >
                            <div className="act-img-wrap">
                               <img src={service.image || '/logo picter/placeholder.jpg'} alt={service.title} />
                               <span className="act-tag">{service.type}</span>
                            </div>
                            <div className="act-info-premium">
                              <h4>{service.title}</h4>
                              <div className="act-details">
                                 <span className="act-price-label">{service.price} MAD</span>
                                 <div className="act-rating-premium">★ {service.rating}</div>
                              </div>
                              <button 
                                className={`act-toggle-btn ${formData.selectedActivities.some(a => a.id === service.id) ? 'active' : ''}`}
                                onClick={() => {
                                  const isSelected = formData.selectedActivities.some(a => a.id === service.id);
                                  if (isSelected) {
                                    setFormData({...formData, selectedActivities: formData.selectedActivities.filter(a => a.id !== service.id)});
                                  } else {
                                    setFormData({...formData, selectedActivities: [...formData.selectedActivities, service]});
                                  }
                                }}
                              >
                                {formData.selectedActivities.some(a => a.id === service.id) ? 'Sélectionné' : 'Réserver'}
                              </button>
                            </div>
                          </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  <div className="step-actions">
                    <button className="btn-premium-back" onClick={prevStep}><FaChevronLeft /> Retour</button>
                    <button className="btn-premium-next" onClick={nextStep}>Suivant <FaChevronRight /></button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Logistics */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                  className="step-content"
                >
                  <motion.div variants={itemVariants} className="step-section">
                    <h2 className="step-section-title premium-font">Hébergement & Logistique</h2>
                    
                    <div className="logistics-split">
                      <div className="hotel-premium-section">
                        <label className="group-label">Retraites de Luxe</label>
                        <div className="hotels-premium-scroll">
                          {hotels.map(hotel => (
                            <motion.div 
                              key={hotel.id} 
                              variants={itemVariants}
                              whileHover={{ y: -5 }}
                              className={`hotel-card-premium ${formData.selectedHotel?.id === hotel.id ? 'active' : ''}`}
                              onClick={() => setFormData({...formData, selectedHotel: hotel})}
                            >
                              <div className="h-img-wrap">
                                 <img src={hotel.image || '/logo picter/placeholder.jpg'} alt={hotel.name} />
                                 <div className="h-badge-premium">{hotel.type || 'Boutique'}</div>
                              </div>
                              <div className="hotel-info-premium">
                                <h5>{hotel.name}</h5>
                                <div className="h-details-premium">
                                   <span className="h-rating">★ {hotel.rating || 4.8}</span>
                                   <span className="h-price-night">{hotel.price} MAD/nuit</span>
                                </div>
                                <button className="h-select-btn">
                                  {formData.selectedHotel?.id === hotel.id ? 'Sélectionné' : 'Réserver'}
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="transport-premium-section">
                        <label className="group-label">Mobilité Élégante</label>
                        <div className="transport-list-premium">
                          {transports.map(t => (
                            <motion.div 
                              key={t.id} 
                              variants={itemVariants}
                              className={`transport-row-premium ${formData.selectedTransport?.id === t.id ? 'active' : ''}`}
                              onClick={() => setFormData({...formData, selectedTransport: t})}
                            >
                              <div className="t-icon-premium"><FaCar /></div>
                              <div className="t-content-premium">
                                <h5>{t.title}</h5>
                                <p>{t.type}</p>
                              </div>
                              <div className="t-price-premium">{t.price} MAD</div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {(formData.selectedTransport?.type === 'Chauffeur' || formData.selectedTransport?.type === 'Transfert') && (
                          <motion.div variants={itemVariants} className="route-premium-inputs">
                            <input 
                              placeholder="Lieu de ramassage"
                              value={formData.routeFrom}
                              onChange={(e) => setFormData({...formData, routeFrom: e.target.value})}
                            />
                            <input 
                              placeholder="Destination finale"
                              value={formData.routeTo}
                              onChange={(e) => setFormData({...formData, routeTo: e.target.value})}
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <div className="step-actions">
                    <button className="btn-premium-back" onClick={prevStep}><FaChevronLeft /> Précédent</button>
                    <button className="btn-premium-next" onClick={nextStep}>Signature <FaChevronRight /></button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Signature Itinerary */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                  className="step-content"
                >
                  <motion.div variants={itemVariants} className="step-section">
                    <h2 className="step-section-title premium-font">Votre Itinaire Signature</h2>
                    
                    <div className="itinerary-grid-premium">
                      <div className="itinerary-summary-card">
                        <div className="premium-scroll-box">
                            <div className="sum-section">
                               <span className="sum-label-premium"><FaCalendarAlt /> Chronologie</span>
                               <p>Du {formData.startDate} au {formData.endDate} ({nights} nuits)</p>
                            </div>
                            <div className="sum-section">
                               <span className="sum-label-premium"><FaMapMarkerAlt /> Destinations</span>
                               <div className="sum-chips-premium">
                                 {formData.selectedPlaces.map(p => <span key={p.id}>{p.name}</span>)}
                               </div>
                            </div>
                            <div className="sum-section">
                               <span className="sum-label-premium">Expériences Choisies</span>
                               <div className="sum-activities-list">
                                 {formData.selectedActivities.map(a => (
                                   <div key={a.id} className="sum-act-item">
                                      <span>{a.title}</span>
                                      <b>{a.price} MAD</b>
                                   </div>
                                 ))}
                               </div>
                            </div>
                            <div className="sum-section">
                               <span className="sum-label-premium">Hébergement Prestige</span>
                               <p>{formData.selectedHotel ? formData.selectedHotel.name : 'Veuillez sélectionner un hôtel'}</p>
                            </div>
                        </div>
                        <div className="itinerary-total-premium">
                           <span>INVESTISSEMENT TOTAL</span>
                           <h3>{totalBudget} MAD</h3>
                        </div>
                      </div>

                      <div className="itinerary-map-premium">
                        <div className="map-glass-wrap">
                          <ServiceMap items={formData.selectedPlaces.map(p => {
                             const [lat, lng] = p.coordinates ? p.coordinates.split(',').map(c => parseFloat(c.trim())) : [31.6295, -7.9811];
                             return {
                               ...p,
                               title: p.name,
                               lat: lat,
                               lng: lng
                             };
                          })} />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="step-actions">
                    <button className="btn-premium-back" onClick={prevStep}>Ajuster</button>
                    <button className="btn-premium-confirm" onClick={async () => {
                        try {
                          const payload = {
                             ...formData,
                             hotel_id: formData.selectedHotel?.id,
                             transport_id: formData.selectedTransport?.id,
                             activities: formData.selectedActivities.map(a => a.id)
                          };
                          await api.post('/itineraries', payload);
                          alert('Félicitations ! Votre voyage de luxe est planifié.');
                          navigate('/dashboard/my-bookings');
                        } catch (err) {
                           alert('Erreur lors de la confirmation.');
                        }
                    }}>Confirmer mon Évasion</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Planning;
