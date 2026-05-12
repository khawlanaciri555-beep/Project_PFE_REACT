import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaCoffee, 
  FaCar, FaSpa, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaCheck, FaPen, FaTimes, FaCamera
} from 'react-icons/fa';
import Layout from '../Components/Layout';
import './ProviderProfile.css';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import getImageUrl from '../utils/imageUrl';

const mockProviderData = {
  hotel: {
    name: "Riad Al-Andalus",
    type: "Luxury Riad",
    rating: 4.9,
    reviewsCount: 128,
    location: "Medina, Marrakech",
    description: "Experience the authentic magic of Marrakech in our 18th-century restored Riad. Featuring stunning Andalusian architecture, a serene central courtyard with a mosaic pool, and breathtaking rooftop views of the Atlas Mountains. Perfect for romantic getaways and culturally immersive stays.",
    images: [
      "https://images.unsplash.com/photo-1542314831-c6a4d14b9868",
      "https://images.unsplash.com/photo-1549488344-c1146313f8c8",
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70",
      "https://images.unsplash.com/photo-1558000143-a60d6943b177",
      "https://images.unsplash.com/photo-1489659092419-5d4750a9fc7e"
    ],
    features: [
      { icon: <FaWifi />, label: "Free High-Speed WiFi" },
      { icon: <FaSwimmingPool />, label: "Courtyard Pool" },
      { icon: <FaCoffee />, label: "Traditional Breakfast" },
      { icon: <FaSpa />, label: "Hammam & Spa" }
    ],
    services: [
      { id: 1, title: "Royal Suite", desc: "Spacious suite with private terrace and authentic Moroccan decor.", price: 1200, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461" },
      { id: 2, title: "Standard Room", desc: "Cozy room overlooking the central courtyard pool.", price: 600, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a" }
    ],
    priceStarts: 600,
    contact: { phone: "+212 600 123 456", email: "contact@riad-alandalus.com" }
  },
  transport: {
    name: "Atlas Premium Transfers",
    type: "Private Transport",
    rating: 4.7,
    reviewsCount: 84,
    location: "Gueliz, Marrakech",
    description: "Professional and luxurious transportation services across Morocco. Our fleet of modern, air-conditioned vehicles and experienced bilingual drivers ensure a safe and comfortable journey, whether it's an airport transfer or a multi-day desert expedition.",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
      "https://images.unsplash.com/photo-1502877338535-494e51ef18ba",
    ],
    features: [
      { icon: <FaCar />, label: "Luxury Vehicles" },
      { icon: <FaWifi />, label: "On-board WiFi" },
      { icon: <FaCheck />, label: "Bilingual Drivers" }
    ],
    services: [
      { id: 1, title: "Airport Transfer (Premium)", desc: "Meet & Greet VIP service at Menara Airport.", price: 250, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2" },
      { id: 2, title: "Agafay Desert Excursion", desc: "Half-day private 4x4 trip to Agafay desert.", price: 800, image: "https://images.unsplash.com/photo-1502877338535-494e51ef18ba" }
    ],
    priceStarts: 250,
    contact: { phone: "+212 611 223 344", email: "book@atlastransfers.ma" }
  },
  coop: {
    name: "Argania Gold Cooperative",
    type: "Artisan Cooperative",
    rating: 4.9,
    reviewsCount: 312,
    location: "Ourika Valley",
    description: "Empowering local Berber women through the sustainable production of premium organic Argan oil. Visit us to witness the traditional extraction process, enjoy a tasting session, and support fair trade practices while purchasing the purest cosmetics directly from the source.",
    images: [
      "https://images.unsplash.com/photo-1599839619722-39751411ea6f",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273"
    ],
    features: [
      { icon: <FaCheck />, label: "100% Organic Certified" },
      { icon: <FaCheck />, label: "Fair Trade" },
      { icon: <FaCheck />, label: "Guided Tours" }
    ],
    services: [
      { id: 1, title: "Pure Cosmetic Argan Oil", desc: "100ml cold-pressed organic oil for skin and hair.", price: 150, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b" },
      { id: 2, title: "Amlou (Berber Nutella)", desc: "Traditional spread of almonds, argan oil, and honey. 250g.", price: 90, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273" }
    ],
    priceStarts: 90,
    contact: { phone: "+212 524 998 877", email: "contact@arganiacooop.com" }
  }
};

const EditableField = ({ isEditMode, value, onSave, multiline, type = "text", textComponent = "span", className = "", style = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const Component = textComponent;

  if (!isEditMode) return <Component className={className} style={{...style}}>{value}</Component>;

  if (isEditing) {
    return (
      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'flex-start', width: multiline ? '100%' : 'auto', zIndex: 10 }}>
        {multiline ? (
          <textarea 
            value={tempValue} 
            onChange={e => setTempValue(e.target.value)} 
            style={{ width: '100%', minHeight: '120px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: 'inherit' }} 
            autoFocus 
          />
        ) : (
          <input 
            type={type} 
            value={tempValue} 
            onChange={e => setTempValue(e.target.value)} 
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: 'inherit', width: 'auto' }} 
            autoFocus 
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <button onClick={() => { onSave(tempValue); setIsEditing(false); }} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.4rem', cursor: 'pointer' }}><FaCheck size={12} /></button>
          <button onClick={() => { setTempValue(value); setIsEditing(false); }} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.4rem', cursor: 'pointer' }}><FaTimes size={12} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="editable-group" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: multiline ? '100%' : 'auto' }}>
      <Component className={className} style={{...style, display: 'inline-block'}}>{value}</Component>
      <button 
        onClick={() => setIsEditing(true)} 
        className="edit-btn" 
        style={{ 
          background: 'var(--lux-accent, #cda434)', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer', 
          marginLeft: '0.5rem',
          flexShrink: 0,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
        title="Edit"
      >
        <FaPen size={12} />
      </button>
    </div>
  );
};
const ProviderProfile = ({ isDashboard = false, isEditMode = false }) => {
  const { t } = useTranslation();
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', price: '', imageFile: null, imagePreview: null });
  const [addingItem, setAddingItem] = useState(false);
  const [bookingData, setBookingData] = useState({ serviceId: '', startDate: '', endDate: '' });
  const [isBooking, setIsBooking] = useState(false);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  // Determine provider type
  const candidateType = isDashboard ? (user?.role || 'hotel') : type;
  const safeType = (candidateType === 'cooperative' || candidateType === 'coop') ? 'coop' : (candidateType ? candidateType.toLowerCase() : 'hotel');
  const providerType = mockProviderData[safeType] ? safeType : 'hotel';

  useEffect(() => {
    // ... (Keep existing useEffect logic for fetching data)
    if (isDashboard) {
      const fetchDashboardProfile = async () => {
        try {
          setLoading(true);
          const response = await api.get('/dashboard/profile');
          const { user: userData, profile: providerProfile } = response.data;
          
          if (providerProfile) {
            setData({
              name: userData.name,
              type: providerProfile.type || 'Provider',
              rating: 4.9, 
              reviewsCount: 124,
              location: providerProfile.address || 'Location not set',
              description: providerProfile.description || 'No description provided.',
              images: providerProfile.image ? [providerProfile.image] : [],
              gallery: providerProfile.gallery || [],
              features: providerProfile.features || [
                { icon: <FaWifi />, label: "WiFi" },
                { icon: <FaCoffee />, label: "Breakfast" }
              ],
              services: providerProfile.services ? providerProfile.services.filter(s => !s.is_deleted).map(s => ({
                id: s.id,
                title: s.title,
                desc: s.description,
                price: s.price,
                image: s.image
              })) : [],
              priceStarts: providerProfile.price || 0,
              contact: { 
                phone: providerProfile.phone || 'No phone', 
                email: providerProfile.email || userData.email 
              }
            });
          }
        } catch (err) {
          console.error('Failed to fetch dashboard profile', err);
          setData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardProfile();
    } else {
      const fetchPublicProfile = async () => {
        try {
          setLoading(true);
          let endpoint = '';
          if (providerType === 'hotel') endpoint = `/hotels/${id}`;
          else if (providerType === 'transport') endpoint = `/transports/${id}`;
          else if (providerType === 'coop') endpoint = `/cooperatives/${id}`;
          
          const response = await api.get(endpoint);
          const providerProfile = response.data.data || response.data;
          
          if (providerProfile) {
            setData({
              name: providerProfile.name || providerProfile.user?.name || 'Provider',
              type: providerProfile.type || 'Provider',
              rating: 4.9, 
              reviewsCount: 124,
              location: providerProfile.address || 'Location not set',
              description: providerProfile.description || 'No description provided.',
              images: providerProfile.image ? [providerProfile.image] : [],
              gallery: providerProfile.gallery || [],
              features: providerProfile.features || [], 
              services: providerProfile.services ? providerProfile.services.filter(s => !s.is_deleted).map(s => ({
                id: s.id,
                title: s.title,
                desc: s.description,
                price: s.price,
                image: s.image
              })) : [],
              priceStarts: providerProfile.price || 0,
              contact: { 
                phone: providerProfile.phone || 'No phone', 
                email: providerProfile.email || 'No email'
              }
            });
          }
        } catch (err) {
          console.error('Failed to fetch public profile', err);
          setData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPublicProfile();
    }
  }, [isDashboard, providerType, id]);

  const handleUpdate = async (field, value) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    if (isDashboard) {
      try {
        await api.put('/dashboard/profile', {
          name: updatedData.name,
          phone: updatedData.contact.phone,
          address: updatedData.location,
          description: updatedData.description,
          price: updatedData.priceStarts,
          type: updatedData.type
        });
      } catch (err) { console.error(err); }
    }
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!bookingData.serviceId || !bookingData.startDate || !bookingData.endDate) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    try {
      setIsBooking(true);
      await api.post('/bookings', {
        service_id: bookingData.serviceId,
        user_id: user.id,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate
      });
      alert('Réservation effectuée avec succès !');
      setBookingData({ serviceId: '', startDate: '', endDate: '' });
    } catch (err) {
      alert('Erreur lors de la réservation.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--lux-accent)' }}
          >
            Chargement...
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    const errorContent = (
      <div style={{ height: isDashboard ? '50vh' : '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <FaTimes size={48} style={{ color: '#ef4444' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>{t('provider.profileNotFound')}</h2>
        <p style={{ color: 'var(--lux-text-muted)' }}>{t('provider.profileNotFoundDesc')}</p>
        <button onClick={() => navigate('/home')} style={{ padding: '0.8rem 1.5rem', background: 'var(--lux-accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
           {t('places.backHome')}
        </button>
      </div>
    );
    return isDashboard ? errorContent : <Layout>{errorContent}</Layout>;
  }

  const mainContent = (
    <div className="provider-page">
      {/* HERO SECTION - CHIC REVEAL */}
      <section className="provider-hero">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={getImageUrl(data.images[0])} 
          alt={data.name} 
          className="provider-hero-img" 
        />
        {isEditMode && (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            <button 
              className="edit-hero-img-btn" 
              onClick={() => fileInputRef.current?.click()}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#fff', color: '#333', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
            >
               <FaCamera /> {t('provider.hero.changeCover', 'Change Cover')}
            </button>
          </>
        )}
        <div className="provider-hero-overlay">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-content"
          >
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="hero-type-badge">
              {data.type}
            </motion.div>
            <h1 className="hero-title">
              <EditableField isEditMode={isEditMode} value={data.name} onSave={(val) => handleUpdate('name', val)} />
            </h1>
            <div className="hero-meta" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <span><FaStar style={{ color: 'var(--lux-accent)' }}/> {data.rating} ({data.reviewsCount} {t('provider.hero.reviews', 'reviews')})</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} /> 
                <EditableField isEditMode={isEditMode} value={data.location} onSave={(val) => handleUpdate('location', val)} textComponent="span" />
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="provider-container">
        <div className="provider-main-content">
          
          {/* GALLERY */}
          {((data.gallery && data.gallery.length > 0) || isEditMode) && (
            <motion.section 
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
              viewport={{ once: true, margin: "-50px" }}
              whileInView="visible"
              initial="hidden"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>{t('provider.gallery.title', 'Exclusive Gallery')}</h2>
                {isEditMode && (
                   <button onClick={() => navigate('/dashboard/images')} style={{ background: 'var(--lux-accent)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaCamera /> {t('provider.gallery.manage', 'Manage photos')}
                   </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '200px 200px', gap: '1rem', height: '410px' }}>
                {/* Big photo on the left spanning 2 rows */}
                <div style={{ gridRow: '1 / 3', borderRadius: '16px', overflow: 'hidden' }}>
                  {(data.gallery || [])[0] ? (
                    <img
                      src={getImageUrl(typeof data.gallery[0] === 'string' ? data.gallery[0] : data.gallery[0].url)}
                      alt={typeof data.gallery[0] === 'string' ? 'Photo 1' : (data.gallery[0].name || 'Photo 1')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : isEditMode ? (
                    <div
                      onClick={() => navigate('/dashboard/images')}
                      style={{ width: '100%', height: '100%', background: '#faf9f7', border: '2px dashed #d4c5a9', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '0.5rem', color: '#b8a98a', transition: '0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--lux-accent)'; e.currentTarget.style.color = 'var(--lux-accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#d4c5a9'; e.currentTarget.style.color = '#b8a98a'; }}
                    >
                      <FaCamera size={36} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t('provider.gallery.add', 'Add photos')}</span>
                    </div>
                  ) : null}
                </div>
                {/* Small photos on the right */}
                <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  {(data.gallery || [])[1] ? (
                     <img src={getImageUrl(typeof data.gallery[1] === 'string' ? data.gallery[1] : data.gallery[1].url)} alt="Gallery 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <div style={{ width: '100%', height: '100%', background: '#faf9f7' }} />}
                </div>
                <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  {(data.gallery || [])[2] ? (
                     <img src={getImageUrl(typeof data.gallery[2] === 'string' ? data.gallery[2] : data.gallery[2].url)} alt="Gallery 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <div style={{ width: '100%', height: '100%', background: '#faf9f7' }} />}
                </div>
              </div>
            </motion.section>
          )}

          {/* ABOUT */}
          <motion.section 
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
            viewport={{ once: true, margin: "-50px" }}
            whileInView="visible"
            initial="hidden"
          >
            <h2 className="section-title">{t('provider.about', 'About')}</h2>
            <div className="glass-card" style={{ padding: '2rem' }}>
               <EditableField 
                 isEditMode={isEditMode} 
                 value={data.description} 
                 onSave={(val) => handleUpdate('description', val)} 
                 multiline 
                 textComponent="p" 
                 className="description-text" 
                 style={{ margin: 0 }}
               />
            </div>
          </motion.section>

          {/* FEATURES */}
          {(isEditMode || (data.features && data.features.length > 0)) && (
          <motion.section 
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
            viewport={{ once: true, margin: "-50px" }}
            whileInView="visible"
            initial="hidden"
          >
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {t('provider.amenities.title', 'Amenities & Services')}
              {isEditMode && <button onClick={handleAddFeature} style={{ fontSize: '0.9rem', color: 'var(--lux-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>+ {t('provider.amenities.add', 'Add')}</button>}
            </h2>
            <div className="features-grid">
              {(data.features || []).map((feat, i) => (
                <motion.div 
                  key={i} 
                  className="feature-item" 
                  style={{ position: 'relative' }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="feature-icon">{feat.icon || <FaCheck />}</span>
                  <span>{feat.label}</span>
                  {isEditMode && (
                    <button onClick={() => handleDeleteFeature(i)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer', opacity: 0.7 }}><FaTimes /> {t('provider.amenities.remove', 'Remove')}</button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
          )}

          {/* SERVICES LIST */}
          {(isEditMode || (data.services && data.services.length > 0)) && (
          <motion.section 
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
            viewport={{ once: true, margin: "-50px" }}
            whileInView="visible"
            initial="hidden"
          >
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {providerType === 'hotel' ? t('provider.services.accommodation', 'Rooms & Suites') : providerType === 'transport' ? t('provider.services.transport', 'Available Rides') : t('provider.services.coop', 'Products')}
              {isEditMode && <button onClick={() => setShowAddModal(true)} style={{ fontSize: '0.9rem', color: 'var(--lux-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>+ {t('provider.services.addItem', 'Add service')}</button>}
            </h2>
            <div className="dynamic-lists">
              {data.services.map((svc) => (
                <motion.div key={svc.id} variants={fadeInUp} whileHover={{ y: -10 }} className="dynamic-card">
                  <div className="dynamic-img-wrapper">
                    <img src={getImageUrl(svc.image)} alt={svc.title} className="dynamic-img" />
                    {isEditMode && (
                      <div className="edit-overlay">
                         <label className="edit-img-icon">
                           <FaCamera /> <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleServiceImageUpload(e, svc.id)} />
                         </label>
                         <button onClick={() => handleDeleteService(svc.id)} className="delete-img-icon"><FaTimes /></button>
                      </div>
                    )}
                  </div>
                  <div className="dynamic-info">
                    <h3><EditableField isEditMode={isEditMode} value={svc.title} onSave={(val) => handleUpdateService(svc.id, 'title', val)} /></h3>
                    <div style={{ margin: '0.5rem 0' }}><EditableField isEditMode={isEditMode} value={svc.desc} onSave={(val) => handleUpdateService(svc.id, 'desc', val)} multiline textComponent="p" /></div>
                    <div className="dynamic-price">
                      <EditableField isEditMode={isEditMode} value={svc.price} onSave={(val) => handleUpdateService(svc.id, 'price', val)} type="number" /> <span>MAD</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="booking-card-wrapper">
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="booking-card">
            <h3 className="booking-price">
              <EditableField isEditMode={isEditMode} value={data.priceStarts} onSave={(val) => handleUpdate('priceStarts', val)} type="number" /> <span>MAD</span>
            </h3>
            <p className="booking-subtext">{t('provider.booking.startsFrom', 'Starts from')}</p>
            
            <form className="booking-form" onSubmit={handleReserve}>
              <div className="lux-input-group">
                <label><FaCalendarAlt /> {t('provider.booking.dates', 'Dates')}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="date" className="lux-input" value={bookingData.startDate} onChange={e => setBookingData({...bookingData, startDate: e.target.value})} disabled={isEditMode} required />
                  <input type="date" className="lux-input" value={bookingData.endDate} onChange={e => setBookingData({...bookingData, endDate: e.target.value})} disabled={isEditMode} required />
                </div>
              </div>
              <div className="lux-input-group">
                <label><FaStar /> {t('provider.booking.service', 'Service')}</label>
                <select className="lux-input" value={bookingData.serviceId} onChange={e => setBookingData({...bookingData, serviceId: e.target.value})} disabled={isEditMode} required>
                  <option value="">{t('provider.booking.selectService', 'Choisir un service...')}</option>
                  {data.services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <button type="submit" className="lux-button" disabled={isBooking || isEditMode}>
                {isBooking ? t('common.loading', 'Réservation en cours...') : t('provider.booking.reserve', 'Réserver maintenant')}
              </button>
            </form>

            <div className="contact-item" style={{ display: 'flex', alignItems: 'center' }}>
              <FaPhoneAlt style={{ flexShrink: 0 }} /> 
              <EditableField isEditMode={isEditMode} value={data.contact.phone} onSave={(val) => handleUpdateContact('phone', val)} />
=======
            <div className="contact-box" style={{ marginTop: '2rem' }}>
              <div className="contact-item"><FaPhoneAlt /> <EditableField isEditMode={isEditMode} value={data.contact.phone} onSave={(val) => handleUpdateContact('phone', val)} /></div>
              <div className="contact-item"><FaEnvelope /> <EditableField isEditMode={isEditMode} value={data.contact.email} onSave={(val) => handleUpdateContact('email', val)} /></div>
>>>>>>> 742e84c (verstion final)
            </div>
          </motion.div>
        </aside>
      </div>

      {/* MODAL ADD SERVICE */}
      {showAddModal && (
        <div className="modal-overlay">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content">
            <h3>Nouveau Service</h3>
            <input type="text" placeholder="Titre" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="lux-input" />
            <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="lux-input" />
            <input type="number" placeholder="Prix" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="lux-input" />
            <input type="file" onChange={e => setNewItem({...newItem, imageFile: e.target.files[0]})} />
            <div style={{ display: 'flex', gap: '1rem' }}>
               <button onClick={() => setShowAddModal(false)} className="lux-button secondary">Annuler</button>
               <button onClick={handleAddService} disabled={addingItem} className="lux-button">{addingItem ? "Enregistrement..." : "Ajouter"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  return isDashboard ? mainContent : <Layout>{mainContent}</Layout>;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <div style={{ padding: '4rem', textAlign: 'center' }}><h2>Une erreur est survenue.</h2><button onClick={() => window.location.reload()}>Recharger</button></div>;
    return this.props.children;
  }
}

const ProtectedProviderProfile = (props) => (
  <ErrorBoundary>
    <ProviderProfile {...props} />
  </ErrorBoundary>
);

export default ProtectedProviderProfile;
