import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../Components/Layout';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaCalendarAlt, FaChevronRight, FaChevronLeft, FaCheckCircle, FaCar, FaInfoCircle, FaPlane } from 'react-icons/fa';
import ServiceMap from '../Components/Explore/ServiceMap';
import getImageUrl from '../utils/imageUrl';
import './Planning.css';

const Planning = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const [showDescription, setShowDescription] = useState(null);
  const [selectedGalleryService, setSelectedGalleryService] = useState(null);
  const [isFlying, setIsFlying] = useState(false);

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
        alert(t('planning.step1.title'));
        return;
    }
    if (step === 1 && nights <= 0) {
        alert(t('planning.step1.title'));
        return;
    }
    setIsFlying(true);
    setStep(step + 1);
    setTimeout(() => setIsFlying(false), 2000);
  };
  
  const prevStep = () => {
    setIsFlying(true);
    setStep(step - 1);
    setTimeout(() => setIsFlying(false), 2000);
  };

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

  const steps = [
    { id: 1, label: t('planning.steps.destinations') },
    { id: 2, label: t('planning.steps.experiences') },
    { id: 3, label: t('planning.steps.accommodation') },
    { id: 4, label: t('planning.steps.signature') },
  ];

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
                <span>{t('planning.budget.total')}</span>
                <h3>{totalBudget} {t('common.mad')}</h3>
             </div>
             <div className="budget-stats">
                <div className="stat-item"><FaMapMarkerAlt /> {formData.selectedPlaces.length} {t('planning.budget.places')}</div>
                <div className="stat-item"><FaCalendarAlt /> {nights} {t('planning.budget.nights')}</div>
             </div>
             <button className="budget-next-btn" onClick={nextStep}>
               {step === 4 ? t('planning.step4.confirm') : t('planning.budget.next')} <FaChevronRight />
             </button>
          </div>
        </motion.div>

        <div className="max-container">
          <div className="planning-header">
            <span className="section-eyebrow">{t('planning.eyebrow')}</span>
            <h1 className="planning-title premium-font">{t('planning.title')}</h1>

            {/* Step Indicator (Stepper) */}
            <div className="stepper-wrapper">
              <div className="stepper">
                {/* Internal path for perfect alignment */}
                <div className="stepper-inner-path">
                  {/* Animated Airplane - Only visible during flight */}
                    <motion.div 
                      className="stepper-plane"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        left: `${(step - 1) * 33.333}%`,
                        opacity: isFlying ? [0, 1, 1, 0] : 0,
                        scale: isFlying ? [0, 1.2, 1.2, 0] : 0,
                        rotate: 0,
                        y: 0,
                      }}
                      transition={{ 
                        duration: 2, 
                        ease: [0.45, 0.05, 0.55, 0.95], // Premium smooth easing
                        times: [0, 0.15, 0.85, 1]
                      }}
                    >
                      <FaPlane className="pro-plane-icon" />
                      {/* Suble Trail Effect */}
                      <motion.div 
                        className="plane-trail" 
                        animate={{ opacity: isFlying ? [0, 0.4, 0] : 0, scaleX: isFlying ? [0, 1, 0] : 0 }}
                      />
                    </motion.div>
                </div>

                {steps.map((s) => (
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
                 <p>{t('common.loading')}</p>
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
                    <h2 className="step-section-title premium-font">{t('planning.step1.title')}</h2>

                    <div className="date-inputs-premium">
                      <div className="input-group-premium">
                        <label><FaCalendarAlt /> {t('planning.step1.arrival')}</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                      </div>
                      <div className="input-group-premium">
                        <label><FaCalendarAlt /> {t('planning.step1.departure')}</label>
                        <input
                          type="date"
                          value={formData.endDate}
                          min={formData.startDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                      </div>
                      <div className="nights-badge">
                         <span>{nights} {t('planning.step1.nights')}</span>
                      </div>
                    </div>

                    <div className="places-selection">
                      <label className="group-label">{t('planning.step1.dreamDestinations')}</label>
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
                              <img src={getImageUrl(place.image) || '/logo picter/placeholder.jpg'} alt={place.name || place.title} />
                              <div className="premium-overlay" />
                              <div className="selection-indicator">
                                {formData.selectedPlaces.some(p => p.id === place.id) ? <FaCheckCircle /> : <div className="plus-icon">+</div>}
                              </div>
                              <div className="place-badge">{place.category || 'Medina'}</div>
                            </div>
                            <div className="place-card-body-premium">
                              <h3>{place.name || place.title}</h3>
                              <div className="card-footer-premium">
                                <p><FaMapMarkerAlt /> {place.address?.split(',')[0] || 'Marrakech'}</p>
                                <div className="description-wrapper-premium">
                                  <motion.div 
                                    className="description-btn-premium"
                                    whileHover={{ scale: 1.2, rotate: 15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowDescription(showDescription?.id === place.id ? null : place);
                                    }}
                                  >
                                    <FaInfoCircle />
                                  </motion.div>

                                  <AnimatePresence>
                                    {showDescription?.id === place.id && (
                                      <motion.div 
                                        className="description-bubble-premium"
                                        initial={{ opacity: 0, scale: 0.5, y: 20, x: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, y: 20, x: 20 }}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="bubble-content">
                                          <button className="close-bubble-btn" onClick={() => setShowDescription(null)}>&times;</button>
                                          <p>{place.description || "Découvrez l'essence de cet endroit magnifique, imprégné d'histoire et de culture marocaine."}</p>
                                        </div>
                                        <div className="bubble-arrow" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {(!places || places.length === 0) && (
                          <div className="no-data-msg">{t('explore.noResults')}</div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  <div className="step-actions">
                    <div />
                    <button className="btn-premium-next" onClick={nextStep}>
                      {t('planning.step1.continue')} <FaChevronRight />
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
                      <h2 className="step-section-title premium-font">{t('planning.step2.title')}</h2>
                      <div className="discovery-chips">
                         {['All', 'Activity', 'Experience', 'Tour', 'Workshop'].map((cat) => (
                           <motion.button 
                             key={cat} 
                             variants={itemVariants}
                             className={`discovery-chip ${filters.category === cat ? 'active' : ''}`}
                             onClick={() => setFilters({...filters, category: cat})}
                           >
                             {cat === 'All' ? t('planning.step2.all') : cat}
                           </motion.button>
                         ))}
                      </div>
                    </div>

                    <div className="budget-discovery">
                       <div className="budget-label">
                          <label>{t('planning.step2.budget')}</label>
                          <span>{filters.budget} {t('common.mad')}</span>
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
                               <img src={getImageUrl(service.image) || '/logo picter/placeholder.jpg'} alt={service.title} />
                               <span className="act-tag">{service.type}</span>
                            </div>
                            <div className="act-info-premium">
                              <h4>{service.title}</h4>
                              <div className="act-details">
                                 <span className="act-price-label">{service.price} {t('common.mad')}</span>
                                 <div className="act-rating-premium">★ {service.rating}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                {(service.gallery || service.image) && (
                                  <button 
                                    className="act-details-btn-premium"
                                    onClick={() => setSelectedGalleryService({
                                      ...service,
                                      gallery: service.gallery || [service.image]
                                    })}
                                  >
                                    Détails
                                  </button>
                                )}
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
                                  {formData.selectedActivities.some(a => a.id === service.id) ? t('planning.step2.selected') : t('planning.step2.book')}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  <div className="step-actions">
                    <button className="btn-premium-back" onClick={prevStep}><FaChevronLeft /> {t('common.back')}</button>
                    <button className="btn-premium-next" onClick={nextStep}>{t('planning.step2.next')} <FaChevronRight /></button>
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
                    <h2 className="step-section-title premium-font">{t('planning.step3.title')}</h2>
                    
                    <div className="logistics-split">
                      <div className="hotel-premium-section">
                        <label className="group-label">{t('planning.step3.luxuryRetreats')}</label>
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
                                 <div className="h-badge-premium">{hotel.type === 'riad' ? 'Riad' : 'Hôtel'}</div>
                              </div>
                              <div className="hotel-info-premium">
                                <h5>{hotel.name}</h5>
                                <div className="h-details-premium">
                                   <span className="h-rating">★ {hotel.rating || 4.8}</span>
                                   <span className="h-price-night">{hotel.price} {t('common.perNight')}</span>
                                </div>
                                <button className="h-select-btn">
                                  {formData.selectedHotel?.id === hotel.id ? t('planning.step2.selected') : t('planning.step2.book')}
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="transport-premium-section">
                        <label className="group-label">{t('planning.step3.elegantMobility')}</label>
                        <div className="transport-list-premium">
                          {transports.map(t_item => (
                            <motion.div 
                              key={t_item.id} 
                              variants={itemVariants}
                              className={`transport-row-premium ${formData.selectedTransport?.id === t_item.id ? 'active' : ''}`}
                              onClick={() => setFormData({...formData, selectedTransport: t_item})}
                            >
                              <div className="t-icon-premium"><FaCar /></div>
                              <div className="t-content-premium">
                                <h5>{t_item.title}</h5>
                                <p>{t_item.type}</p>
                              </div>
                              <div className="t-price-premium">{t_item.price} {t('common.mad')}</div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {(formData.selectedTransport?.type === 'Chauffeur' || formData.selectedTransport?.type === 'Transfert') && (
                          <motion.div variants={itemVariants} className="route-premium-inputs">
                            <input 
                              placeholder={t('planning.step3.pickupLocation')}
                              value={formData.routeFrom}
                              onChange={(e) => setFormData({...formData, routeFrom: e.target.value})}
                            />
                            <input 
                              placeholder={t('planning.step3.finalDestination')}
                              value={formData.routeTo}
                              onChange={(e) => setFormData({...formData, routeTo: e.target.value})}
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <div className="step-actions">
                    <button className="btn-premium-back" onClick={prevStep}><FaChevronLeft /> {t('planning.step3.previous')}</button>
                    <button className="btn-premium-next" onClick={nextStep}>{t('planning.step3.signature')} <FaChevronRight /></button>
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
                    <h2 className="step-section-title premium-font">{t('planning.step4.title')}</h2>
                    
                    <div className="itinerary-grid-premium">
                      <div className="itinerary-summary-card">
                        <div className="premium-scroll-box">
                            <div className="sum-section">
                               <span className="sum-label-premium"><FaCalendarAlt /> {t('planning.step4.timeline')}</span>
                               <p>{formData.startDate} → {formData.endDate} ({nights} {t('planning.step1.nights')})</p>
                            </div>
                            <div className="sum-section">
                               <span className="sum-label-premium"><FaMapMarkerAlt /> {t('planning.step4.destinations')}</span>
                               <div className="sum-chips-premium">
                                 {formData.selectedPlaces.map(p => <span key={p.id}>{p.name}</span>)}
                               </div>
                            </div>
                            <div className="sum-section">
                               <span className="sum-label-premium">{t('planning.step4.experiences')}</span>
                               <div className="sum-activities-list">
                                 {formData.selectedActivities.map(a => (
                                   <div key={a.id} className="sum-act-item">
                                      <span>{a.title}</span>
                                      <b>{a.price} {t('common.mad')}</b>
                                   </div>
                                 ))}
                               </div>
                            </div>
                            <div className="sum-section">
                               <span className="sum-label-premium">{t('planning.step4.accommodation')}</span>
                               <p>{formData.selectedHotel ? formData.selectedHotel.name : t('planning.step4.noHotel')}</p>
                            </div>
                        </div>
                        <div className="itinerary-total-premium">
                           <span>{t('planning.step4.totalInvestment')}</span>
                           <h3>{totalBudget} {t('common.mad')}</h3>
                        </div>
                      </div>

                      <div className="itinerary-map-premium">
                        <div className="map-glass-wrap">
                          <ServiceMap items={formData.selectedPlaces.map(p => {
                             const [lat, lng] = p.coordinates ? p.coordinates.split(',').map(c => parseFloat(c.trim())) : [31.6295, -7.9811];
                             return { ...p, title: p.name, lat, lng };
                          })} />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="step-actions">
                    <button className="btn-premium-back" onClick={prevStep}>{t('planning.step4.adjust')}</button>
                    <button className="btn-premium-confirm" onClick={async () => {
                        try {
                          const payload = {
                             ...formData,
                             hotel_id: formData.selectedHotel?.id,
                             transport_id: formData.selectedTransport?.id,
                             activities: formData.selectedActivities.map(a => a.id)
                          };
                          await api.post('/itineraries', payload);
                          alert(t('planning.step4.confirmSuccess'));
                          navigate('/dashboard/my-bookings');
                        } catch (err) {
                           alert(t('planning.step4.confirmError'));
                        }
                    }}>{t('planning.step4.confirm')}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </div>
        </div>
        <AnimatePresence>
          {selectedGalleryService && (
            <motion.div 
              className="gallery-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGalleryService(null)}
              style={{ zIndex: 3000 }}
            >
              <motion.div 
                className="gallery-modal-content"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-gallery-btn" onClick={() => setSelectedGalleryService(null)}>&times;</button>
                <h2 className="gallery-modal-title">{selectedGalleryService.title}</h2>
                <div className="gallery-grid-main">
                  {selectedGalleryService.gallery.slice(0, 4).map((img, i) => (
                    <div key={i} className={`gallery-item-wrap item-${i}`}>
                      <img src={getImageUrl(img)} alt={`Gallery ${i}`} />
                    </div>
                  ))}
                </div>
                <p className="gallery-modal-desc">{selectedGalleryService.description}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Planning;
