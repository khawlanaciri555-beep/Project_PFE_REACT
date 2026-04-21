import React, { useState, useContext } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaBell, FaCamera, FaSave, FaCheckCircle, FaTrash } from 'react-icons/fa';
import ProviderProfile from '../ProviderProfile';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('account');
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Ahmed El Amrani',
    email: user?.email || 'ahmed@example.com',
    phone: '+212 6 00 00 00 00',
    bio: 'Tour guide and Marrakech enthusiast.',
    role: user?.role || 'tourist'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    { id: 'account', label: 'Account Info', icon: <FaUser /> },
    { id: 'gallery', label: 'Gallery & Media', icon: <FaCamera />, hideForTourist: true },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-title-section">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
           {user?.role !== 'tourist' ? 'My Public Profile' : 'Settings & Profile'}
        </motion.h1>
        <p style={{ color: 'var(--dash-text-muted)' }}>
           {user?.role !== 'tourist' ? 'Manage how your business appears to tourists.' : 'Manage your account settings and preferences.'}
        </p>
      </div>

      {/* Horizontal Navigation Tabs */}
      <div className="horizontal-tabs">
        {tabs.filter(t => !(t.hideForTourist && user?.role === 'tourist')).map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`horizontal-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div 
        className="card-glass" 
        style={{ 
          background: 'white', 
          border: '1px solid var(--glass-border)', 
          padding: '3rem', 
          borderRadius: '32px',
          boxShadow: 'var(--shadow-md)',
          width: '100%'
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'account' && (
            <motion.div 
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {user?.role !== 'tourist' ? (
                <ProviderProfile isDashboard={true} isEditMode={true} />
              ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                       <div style={{ position: 'relative' }}>
                          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--dash-accent), #855d28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', border: '4px solid var(--glass-border)' }}>
                            {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--dash-accent)', color: '#fff', border: '2px solid #fff', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer' }}>
                             <FaCamera size={14} />
                          </button>
                       </div>
                       <div>
                          <h2 style={{ margin: 0 }}>{formData.name}</h2>
                          <p style={{ margin: '0.25rem 0', color: 'var(--dash-text-muted)', textTransform: 'capitalize' }}>{formData.role} Account</p>
                       </div>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                       <div className="form-group" style={{ gridColumn: 'span 1' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)', fontSize: '0.9rem' }}>Full Name</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '1rem', borderRadius: '12px', outline: 'none' }}
                          />
                       </div>
                       <div className="form-group">
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            style={{ width: '100%', background: '#F1F1F1', border: '1px solid var(--glass-border)', color: 'var(--dash-text-muted)', padding: '1rem', borderRadius: '12px', cursor: 'not-allowed' }}
                            disabled
                          />
                       </div>
                       <div className="form-group">
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)', fontSize: '0.9rem' }}>Phone Number</label>
                          <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '1rem', borderRadius: '12px', outline: 'none' }}
                          />
                       </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)', fontSize: '0.9rem' }}>Bio</label>
                          <textarea 
                            rows="4"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '1rem', borderRadius: '12px', outline: 'none', resize: 'none' }}
                            placeholder="Tell us about yourself..."
                          />
                       </div>

                       <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                          <button 
                            type="submit"
                            style={{ 
                              background: 'var(--dash-accent)', 
                              color: '#fff', 
                              border: 'none', 
                              padding: '1.25rem 3rem', 
                              borderRadius: '16px', 
                              fontWeight: '700', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              boxShadow: '0 8px 30px var(--dash-gold-glow)'
                            }}
                          >
                             {isSaved ? <><FaCheckCircle /> Saved!</> : <><FaSave /> Save Profile</>}
                          </button>
                       </div>
                    </form>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div 
                key="gallery"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                   <h2>Business Gallery</h2>
                   <button style={{ background: 'var(--dash-accent)', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaCamera /> Upload Photos
                   </button>
                </div>
                <p style={{ color: 'var(--dash-text-muted)', marginBottom: '2rem' }}>
                   Add high-quality photos of your place, services, or products to attract more tourists.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                   {/* Upload Area Box */}
                   <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', color: 'var(--dash-text-muted)', cursor: 'pointer', background: '#fcfcfc', transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor='var(--dash-accent)'} onMouseLeave={(e) => e.currentTarget.style.borderColor='var(--glass-border)'}>
                      <FaCamera size={30} style={{ marginBottom: '1rem', color: 'var(--dash-accent)' }} />
                      <span style={{ fontWeight: '600' }}>Click to Browse</span>
                   </div>

                   {/* Mock Images */}
                   {[1, 2, 3].map(i => (
                     <div key={i} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '180px', background: '#EEE' }}>
                        <img src={`https://images.unsplash.com/photo-1542314831-c6a4d14b9868?w=300&h=300&fit=crop`} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.8)', border: 'none', width: '30px', height: '30px', borderRadius: '50%', color: 'red', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                           <FaTrash size={12} />
                        </button>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 style={{ marginBottom: '2rem' }}>Update Password</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
                   <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)', fontSize: '0.9rem' }}>Current Password</label>
                      <input type="password" style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '1rem', borderRadius: '12px' }} />
                   </div>
                   <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)', fontSize: '0.9rem' }}>New Password</label>
                      <input type="password" style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '1rem', borderRadius: '12px' }} />
                   </div>
                   <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)', fontSize: '0.9rem' }}>Confirm New Password</label>
                      <input type="password" style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '1rem', borderRadius: '12px' }} />
                   </div>
                   <button style={{ background: 'var(--dash-accent)', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '16px', fontWeight: '700', marginTop: '1rem', cursor: 'pointer' }}>
                      Update Credentials
                   </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 style={{ marginBottom: '2rem' }}>Notification Preferences</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                   {[
                     { title: 'Email Notifications', desc: 'Receive updates about your bookings via email.' },
                     { title: 'New Message Alerts', desc: 'Notifications when tourists or providers message you.' },
                     { title: 'Promotional Offers', desc: 'Tips and discounts for your Marrakech trip.' }
                   ].map((notif, i) => (
                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <div>
                           <h4 style={{ margin: 0 }}>{notif.title}</h4>
                           <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--dash-text-muted)' }}>{notif.desc}</p>
                        </div>
                        <div style={{ width: '50px', height: '26px', background: i === 0 ? 'var(--dash-accent)' : '#444', borderRadius: '50px', position: 'relative', cursor: 'pointer' }}>
                           <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: i === 0 ? '27px' : '3px', transition: '0.3s' }} />
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      
    </DashboardLayout>
  );
};

export default Profile;
