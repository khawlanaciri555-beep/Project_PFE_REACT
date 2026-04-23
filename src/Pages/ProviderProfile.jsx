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
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', price: '', imageFile: null, imagePreview: null });
  const [addingItem, setAddingItem] = useState(false);

  // Determine provider type (hotel, coop, transport)
  const candidateType = isDashboard ? (user?.role || 'hotel') : type;
  const safeType = (candidateType === 'cooperative' || candidateType === 'coop') ? 'coop' : (candidateType ? candidateType.toLowerCase() : 'hotel');
  const providerType = mockProviderData[safeType] ? safeType : 'hotel';

  useEffect(() => {
    // If we're in the dashboard, fetch the logged-in user's profile
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
              rating: 4.8, 
              reviewsCount: 0,
              location: providerProfile.address || 'Location not set',
              description: providerProfile.description || 'No description provided.',
              images: providerProfile.image 
                ? [providerProfile.image]
                : [mockProviderData.hotel.images[0]],
              gallery: providerProfile.gallery || [],
              features: mockProviderData[providerType]?.features || [],
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
          } else {
             // Fallback for safety
             setData(mockProviderData[providerType]);
          }
        } catch (err) {
          console.error('Failed to fetch dashboard profile', err);
          setData(mockProviderData[providerType]);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardProfile();
    } else {
      // Public view - fetch by type and ID
      const fetchPublicProfile = async () => {
        try {
          setLoading(true);
          let endpoint = '';
          if (providerType === 'hotel') endpoint = `/hotels/${id}`;
          else if (providerType === 'transport') endpoint = `/transports/${id}`;
          else if (providerType === 'coop') endpoint = `/cooperatives/${id}`;
          
          if (!endpoint) throw new Error('Invalid provider type');
          
          const response = await api.get(endpoint);
          const providerProfile = response.data.data || response.data;
          
          setData({
            name: providerProfile.name || 'Provider',
            type: providerProfile.type || 'Provider',
            rating: 4.8, 
            reviewsCount: 0,
            location: providerProfile.address || 'Location not set',
            description: providerProfile.description || 'No description provided.',
            images: providerProfile.image 
              ? [providerProfile.image]
              : [mockProviderData[providerType].images[0]],
            gallery: providerProfile.gallery || [],
            features: mockProviderData[providerType]?.features || [],
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
        } catch (err) {
          console.error('Failed to fetch public profile', err);
          setData(mockProviderData[providerType]);
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
      } catch (err) {
        console.error('Failed to update profile', err);
      }
    }
  };

  const handleUpdateContact = async (field, value) => {
    const updatedContact = { ...data.contact, [field]: value };
    const updatedData = { ...data, contact: updatedContact };
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
        } catch (err) {
          console.error('Failed to update profile contact', err);
        }
      }
  };

  const handleUpdateService = (serviceId, field, value) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === serviceId ? { ...s, [field]: value } : s)
    }));
  };

  const handleServiceImageUpload = async (event, serviceId) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'services');

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.path) {
        handleUpdateService(serviceId, 'image', response.data.path);
        // Note: For a complete implementation, an API call to save the service image to the DB should be added here or in handleUpdateService.
      }
    } catch (err) {
      console.error('Failed to upload service image', err);
    }
  };

  const fileInputRef = React.useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('image', file);
      formData.append('name', data.name || '');
      formData.append('phone', data.contact?.phone || '');
      formData.append('address', data.location || '');
      formData.append('description', data.description || '');
      formData.append('price', data.priceStarts || 0);
      formData.append('type', data.type || '');

      const response = await api.post('/dashboard/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.image) {
        setData(prev => {
          const newImages = [...prev.images];
          newImages[0] = response.data.image;
          return { ...prev, images: newImages };
        });
      }
    } catch (err) {
      console.error('Failed to upload image', err);
    }
  };

  const handleAddService = async () => {
    if (!newItem.title) return alert('Please add a title');
    try {
      setAddingItem(true);
      let imagePath = null;

      // Upload image first if provided
      if (newItem.imageFile) {
        const formData = new FormData();
        formData.append('image', newItem.imageFile);
        formData.append('folder', 'services');
        const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        imagePath = uploadRes.data.path;
      }

      // Get the provider's entity ID from the dashboard profile
      const profileRes = await api.get('/dashboard/profile');
      const providerProfile = profileRes.data.profile;

      const payload = {
        title: newItem.title,
        description: newItem.description || '',
        price: newItem.price || 0,
        image: imagePath,
        ...(providerType === 'hotel' && { hotel_id: providerProfile?.id }),
        ...(providerType === 'coop' && { cooperative_id: providerProfile?.id }),
        ...(providerType === 'transport' && { transport_id: providerProfile?.id }),
      };

      const res = await api.post('/services', payload);
      const created = res.data.data || res.data;

      // Add to local state
      setData(prev => ({
        ...prev,
        services: [...(prev.services || []), {
          id: created.id,
          title: created.title,
          desc: created.description,
          price: created.price,
          image: created.image || imagePath,
        }]
      }));

      // Reset modal
      setShowAddModal(false);
      setNewItem({ title: '', description: '', price: '', imageFile: null, imagePreview: null });
    } catch (err) {
      console.error('Failed to add item', err);
      alert('Error adding item. Please try again.');
    } finally {
      setAddingItem(false);
    }
  };

  const handleAddFeature = () => {
    const label = window.prompt('Enter new feature name:');
    if (label) {
      setData(prev => ({
        ...prev,
        features: [...(prev.features || []), { icon: <FaCheck />, label }]
      }));
    }
  };

  const handleDeleteFeature = (index) => {
    if (!window.confirm('Remove this feature?')) return;
    setData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (isDashboard && id) {
         await api.delete(`/services/${id}`);
      }
      setData(prev => ({
        ...prev,
        services: prev.services.filter(s => s.id !== id)
      }));
    } catch (err) {
      console.error('Failed to delete service', err);
    }
  };

  if (loading) {
    const loaderContent = (
      <div style={{ height: isDashboard ? '50vh' : '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 50, height: 50, border: '4px solid var(--lux-accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
    return isDashboard ? loaderContent : <Layout>{loaderContent}</Layout>;
  }

  if (!data) return null;

  const content = (
    <div className="provider-page" style={isDashboard ? { borderRadius: '24px', overflow: 'hidden' } : {}}>
      {/* HERO SECTION */}
      <section className="provider-hero" style={isDashboard ? { minHeight: '300px' } : {}}>
        <img src={getImageUrl(data.images[0])} alt={data.name} className="provider-hero-img" />
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
               <FaCamera /> Change Cover Photo
            </button>
          </>
        )}
        <div className="provider-hero-overlay">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content"
          >
            <div className="hero-type-badge">{data.type}</div>
            <h1 className="hero-title" style={{ display: 'flex', alignItems: 'center' }}>
              <EditableField isEditMode={isEditMode} value={data.name} onSave={(val) => handleUpdate('name', val)} textComponent="span" />
            </h1>
            <div className="hero-meta" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <span><FaStar style={{ color: 'var(--lux-accent)' }}/> {data.rating} ({data.reviewsCount} reviews)</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} /> 
                <EditableField isEditMode={isEditMode} value={data.location} onSave={(val) => handleUpdate('location', val)} textComponent="span" />
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="provider-container">
        
        {/* LEFT MAIN CONTENT */}
        <div className="provider-main-content">
          
          {/* GALLERY */}
          {((data.gallery && data.gallery.length > 0) || isEditMode) && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Gallery</h2>
                {isEditMode && (
                   <button onClick={() => navigate('/dashboard/images')} style={{ background: 'var(--lux-accent)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaCamera /> Manage Photos
                   </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '200px 200px', gap: '1rem', height: '410px' }}>
                {/* Big photo on the left spanning 2 rows */}
                <div style={{ gridRow: '1 / 3', borderRadius: '16px', overflow: 'hidden' }}>
                  {(data.gallery || [])[0] ? (
                    <img
                      src={getImageUrl(data.gallery[0].url)}
                      alt={data.gallery[0].name || 'Photo 1'}
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
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Add Photo</span>
                    </div>
                  ) : null}
                </div>

                {/* Top-right small photo */}
                <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  {(data.gallery || [])[1] ? (
                    <img
                      src={getImageUrl(data.gallery[1].url)}
                      alt={data.gallery[1].name || 'Photo 2'}
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
                      <FaCamera size={28} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Add Photo</span>
                    </div>
                  ) : null}
                </div>

                {/* Bottom-right small photo */}
                <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  {(data.gallery || [])[2] ? (
                    <img
                      src={getImageUrl(data.gallery[2].url)}
                      alt={data.gallery[2].name || 'Photo 3'}
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
                      <FaCamera size={28} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Add Photo</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          )}

          {/* DESCRIPTION */}
          <section>
            <h2 className="section-title">About the Experience</h2>
            <EditableField 
              isEditMode={isEditMode} 
              value={data.description} 
              onSave={(val) => handleUpdate('description', val)} 
              multiline 
              textComponent="p" 
              className="description-text" 
            />
          </section>

          {/* FEATURES - only show if there are features */}
          {(isEditMode || (data.features && data.features.length > 0)) && (
          <section>
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Amenities & Features
              {isEditMode && <button onClick={handleAddFeature} style={{ fontSize: '0.9rem', color: 'var(--lux-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Feature</button>}
            </h2>
            <div className="features-grid">
              {(data.features || []).map((feat, i) => (
                <div key={i} className="feature-item" style={{ position: 'relative' }}>
                  <span className="feature-icon">{feat.icon || <FaCheck />}</span>
                  <span>{feat.label}</span>
                  {isEditMode && (
                    <button onClick={() => handleDeleteFeature(i)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer', opacity: 0.7 }}><FaTimes /></button>
                  )}
                </div>
              ))}
            </div>
          </section>
          )}

          {/* DYNAMIC SERVICES LIST (Rooms, Cars, Products) */}
          {(isEditMode || (data.services && data.services.length > 0)) && (
          <section>
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {providerType === 'hotel' ? 'Chambres & Suites (Hébergement)' : providerType === 'transport' ? 'Our Fleet & Routes' : 'Artisan Products'}
              {isEditMode && <button onClick={() => setShowAddModal(true)} style={{ fontSize: '0.9rem', color: 'var(--lux-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>+ Add Item</button>}
            </h2>
            <div className="dynamic-lists">
              {data.services.map(svc => (
                <div key={svc.id} className="dynamic-card" style={{ position: 'relative' }}>
                  <img src={getImageUrl(svc.image)} alt={svc.title} className="dynamic-img" />
                  {isEditMode && (
                     <>
                     <label style={{ position: 'absolute', top: '10px', left: '10px', background: '#fff', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                        <FaCamera /> Edit Image
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleServiceImageUpload(e, svc.id)} />
                     </label>
                     <button onClick={() => handleDeleteService(svc.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', color: 'red', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                       <FaTimes /> Remove
                     </button>
                     </>
                  )}
                  <div className="dynamic-info">
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                      <EditableField isEditMode={isEditMode} value={svc.title} onSave={(val) => handleUpdateService(svc.id, 'title', val)} />
                    </h3>
                    <div style={{ color: 'var(--lux-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6, width: '100%' }}>
                      <EditableField isEditMode={isEditMode} value={svc.desc} onSave={(val) => handleUpdateService(svc.id, 'desc', val)} multiline textComponent="p" />
                    </div>
                    <div className="dynamic-price" style={{ display: 'flex', alignItems: 'center' }}>
                      <EditableField isEditMode={isEditMode} value={svc.price} onSave={(val) => handleUpdateService(svc.id, 'price', val)} type="number" />
                      <span style={{ fontSize: '1rem', color: 'var(--lux-text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>MAD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          )}

          {/* REVIEWS */}
          {!isDashboard && (
            <section>
              <h2 className="section-title">Guest Reviews</h2>
              {[1, 2].map((r) => (
                <div key={r} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">M</div>
                    <div>
                      <h4 style={{ margin: 0 }}>Marie Dubois</h4>
                      <div style={{ display: 'flex', gap: '2px', color: 'var(--lux-accent)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'var(--lux-text-muted)', fontSize: '0.9rem' }}>2 weeks ago</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--lux-text)' }}>"An absolutely magical experience. The attention to detail and hospitality was second to none. We will definitely be returning next year!"</p>
                </div>
              ))}
            </section>
          )}

        </div>

        {/* RIGHT SIDEBAR (STICKY CARD) */}
        <div className="booking-card-wrapper">
          <div className="booking-card">
            <h3 className="booking-price" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EditableField isEditMode={isEditMode} value={data.priceStarts} onSave={(val) => handleUpdate('priceStarts', val)} type="number" />
              <span style={{ marginLeft: '0.5rem' }}>MAD</span>
            </h3>
            <span className="booking-subtext">Starts from</span>
            
            <form className="booking-form">
              {type === 'hotel' || type === 'transport' ? (
                <>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="date" className="lux-input" disabled={isEditMode} />
                    {type === 'hotel' && <input type="number" min="1" placeholder="Guests" className="lux-input" style={{ width: '80px' }} disabled={isEditMode} />}
                  </div>
                  <button className="lux-button" onClick={(e) => e.preventDefault()} disabled={isEditMode}>Reserve Now</button>
                </>
              ) : (
                <>
                  <button className="lux-button" onClick={(e) => e.preventDefault()} disabled={isEditMode}>Contact Store</button>
                </>
              )}
              {isEditMode && <p style={{ color: 'var(--lux-accent)', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>Widget Preview</p>}
            </form>
          </div>

          <div className="contact-box">
            <h3 style={{ margin: '0 0 1.5rem 0', fontFamily: 'var(--font-serif)' }}>Contact Info</h3>
            <div className="contact-item" style={{ display: 'flex', alignItems: 'center' }}>
              <FaPhoneAlt style={{ flexShrink: 0 }} /> 
              <EditableField isEditMode={isEditMode} value={data.contact.phone} onSave={(val) => handleUpdateContact('phone', val)} />
            </div>
            <div className="contact-item" style={{ display: 'flex', alignItems: 'center' }}>
              <FaEnvelope style={{ flexShrink: 0 }} /> 
              <EditableField isEditMode={isEditMode} value={data.contact.email} onSave={(val) => handleUpdateContact('email', val)} type="email" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FOR ADDING SERVICE */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Add New Item</h3>
            <input type="text" placeholder="Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="lux-input" />
            <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="lux-input" style={{ minHeight: '100px' }}></textarea>
            <input type="number" placeholder="Price (MAD)" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="lux-input" />
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files[0];
              if (file) {
                setNewItem({...newItem, imageFile: file, imagePreview: URL.createObjectURL(file)});
              }
            }} />
            {newItem.imagePreview && <img src={newItem.imagePreview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.8rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={handleAddService} disabled={addingItem} style={{ flex: 1, padding: '0.8rem', background: 'var(--lux-accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {addingItem ? 'Adding...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return isDashboard ? content : <Layout>{content}</Layout>;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', margin: '2rem' }}>
          <h2>Oops! Something went wrong in the Profile Page.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', background: '#fef2f2', padding: '1rem', borderRadius: '8px' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
             Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedProviderProfile = (props) => (
  <ErrorBoundary>
    <ProviderProfile {...props} />
  </ErrorBoundary>
);

export default ProtectedProviderProfile;
