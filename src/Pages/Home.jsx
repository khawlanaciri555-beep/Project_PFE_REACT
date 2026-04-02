import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Layout from '../Components/Layout';
import '../Components/home.css';

// Counter Component for Statistics
const Counter = ({ value, label, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      if (isNaN(parseInt(value))) {
        setCount(value);
        return;
      }
      
      const target = parseInt(value.replace(/[^0-9]/g, ''));
      let startTime = null;
      const duration = 1000; // 1 second - subtle and fast

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        // Ease-out quad for smoother finish
        const easeOutPercentage = 1 - (1 - percentage) * (1 - percentage);
        
        setCount(Math.floor(easeOutPercentage * target));

        if (percentage < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  const suffix = value.replace(/[0-9]/g, '');

  return (
    <motion.div 
      ref={ref}
      className={`stat-item ${label === 'CULTURAL HERITAGE' ? 'unesco' : ''}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <span className="stat-number">
        {isNaN(parseInt(value)) ? value : `${count}${suffix}`}
      </span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
};

const Home = () => {
  const sliderRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax / Smooth scroll effect for hero
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -100]);
  const videoScale = useTransform(scrollY, [0, 400], [1, 1.1]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        // Adjusted for 7 cards
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' }); // shifted scroll amount for more cards
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div style={{ scale: videoScale }} className="hero-video-container">
          <video autoPlay loop muted playsInline className="hero-video">
            <source src="/background/backHome.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
        </motion.div>
        
        <motion.div 
          className="hero-content"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
              lineHeight: '1.1',
              marginBottom: '1.5rem'
            }}
          >
            <span style={{ color: 'rgba(226, 218, 215, 1)' }}>Discover<br/>Marrakech:<br/>A Journey</span> <br/>
            <span style={{ 
              background: 'linear-gradient(90deg, #EAD3B1, #C58A3A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>Through Time and Color</span>
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ color: '#f7f0e7ff', opacity: 1 }}
          >
            Step into the heart of the Red City, where ancient palaces whisper tales<br/>
            of dynasties and vibrant souks offer a sensory feast unlike anywhere an<br/>
            earth.
          </motion.p>
        </motion.div>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">POPULAR DESTINATIONS</span>
            <h2 className="section-title">Explorer Marrakech</h2>
          </div>
        </div>

        <div className="destinations-grid slider-container" ref={sliderRef}>
          <div className="destination-card new-card">
            <div className="new-card-image-wrap">
              <img src="https://images.unsplash.com/photo-1587974928442-7bd927f1fbff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mosquée Koutoubia" />
              <div className="image-overlay">
                <span className="new-card-tag">Monument</span>
                <h3 className="new-card-title">Mosquée Koutoubia</h3>
              </div>
            </div>
            <div className="new-card-content">
              <p>Le monument le plus emblématique de Marrakech, visible depuis toute la ville.</p>
              <Link to="#" className="new-btn-detail">Voir détail &rarr;</Link>
            </div>
          </div>

          <div className="destination-card new-card">
            <div className="new-card-image-wrap">
              <img src="https://images.unsplash.com/photo-1549429141-8f553f1f7ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Palais de la Bahia" />
              <div className="image-overlay">
                <span className="new-card-tag">Palais</span>
                <h3 className="new-card-title">Palais de la Bahia</h3>
              </div>
            </div>
            <div className="new-card-content">
              <p>Un splendide palais du XIXe siècle, chef-d'œuvre de l'art marocain.</p>
              <Link to="#" className="new-btn-detail">Voir détail &rarr;</Link>
            </div>
          </div>

          <div className="destination-card new-card">
            <div className="new-card-image-wrap">
              <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Les Souks" />
              <div className="image-overlay">
                <span className="new-card-tag">Marché</span>
                <h3 className="new-card-title">Les Souks</h3>
              </div>
            </div>
            <div className="new-card-content">
              <p>Un labyrinthe coloré de marchés traditionnels remplis d'artisanat local.</p>
              <Link to="#" className="new-btn-detail">Voir détail &rarr;</Link>
            </div>
          </div>
          
          <div className="destination-card new-card">
            <div className="new-card-image-wrap">
              <img src="https://images.unsplash.com/photo-1590089849504-20412e106da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Jardin Majorelle" />
              <div className="image-overlay">
                <span className="new-card-tag">Jardin</span>
                <h3 className="new-card-title">Jardin Majorelle</h3>
              </div>
            </div>
            <div className="new-card-content">
              <p>Un jardin exotique enchanteur créé par Jacques Majorelle avec un bleu vibrant.</p>
              <Link to="#" className="new-btn-detail">Voir détail &rarr;</Link>
            </div>
          </div>

          {/* New Card 5 */}
          <div className="destination-card new-card">
            <div className="new-card-image-wrap">
              <img src="https://images.unsplash.com/photo-1548013146-72479768bbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Place Jemaa el-Fna" />
              <div className="image-overlay">
                <span className="new-card-tag">Atmosphere</span>
                <h3 className="new-card-title">Place Jemaa el-Fna</h3>
              </div>
            </div>
            <div className="new-card-content">
              <p>Le cœur battant de la ville, une place immense aux mille spectacles.</p>
              <Link to="#" className="new-btn-detail">Voir détail &rarr;</Link>
            </div>
          </div>

          {/* New Card 6 */}
          <div className="destination-card new-card">
            <div className="new-card-image-wrap">
              <img src="https://images.unsplash.com/photo-1598967069123-5e744a569a7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Désert d'Agafay" />
              <div className="image-overlay">
                <span className="new-card-tag">Adventure</span>
                <h3 className="new-card-title">Désert d'Agafay</h3>
              </div>
            </div>
            <div className="new-card-content">
              <p>Une évasion désertique à quelques minutes de la ville ocre.</p>
              <Link to="#" className="new-btn-detail">Voir détail &rarr;</Link>
            </div>
          </div>

          {/* New Card 7 */}
          <div className="destination-card new-card">
            <div className="new-card-image-wrap">
              <img src="https://images.unsplash.com/photo-1597212618440-806262de4f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Musée de Marrakech" />
              <div className="image-overlay">
                <span className="new-card-tag">Culture</span>
                <h3 className="new-card-title">Musée de Marrakech</h3>
              </div>
            </div>
            <div className="new-card-content">
              <p>Un palais transformé en musée, abritant des trésors de l'artisanat marocain.</p>
              <Link to="#" className="new-btn-detail">Voir détail &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
          <Counter value="1062" label="FOUNDED" index={0} />
          <Counter value="800+" label="MONUMENTS" index={1} />
          <Counter value="10M+" label="TOURISTS YEARLY" index={2} />
          <Counter value="UNESCO" label="CULTURAL HERITAGE" index={3} />
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header-center">
            <span className="section-eyebrow">GUEST STORIES</span>
            <h2 className="section-title">Echoes of the Courtyard</h2>
        </div>

        <div className="testimonials-masonry">
           <div className="test-card large user-elara">
               <div className="user-info">
                   <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="avatar"/>
                   <div>
                       <h4>Elara Rossi</h4>
                       <div className="stars">★★★★★</div>
                   </div>
               </div>
               <p className="quote">
                 "Staying in a traditional Riad was a dream. The service was impeccable, and waking up to the sound of birds in the orange trees was the highlight of my year."
               </p>
           </div>

           <div className="test-card small right-col-1 user-mark">
              <div className="user-info">
                   <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="avatar"/>
                   <div>
                       <h4>Mark Jenkins</h4>
                       <div className="stars">★★★★★</div>
                   </div>
               </div>
               <p className="quote">
                 "The photography tours were mind-blowing. Our guide knew every hidden alley in the Medina!"
               </p>
           </div>

           <div className="test-card small block-bottom-left user-aisha">
              <div className="user-info">
                   <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="avatar"/>
                   <div>
                       <h4>Aisha Mansour</h4>
                       <div className="stars">★★★★★</div>
                   </div>
               </div>
               <p className="quote">
                 "Authentic, luxurious, and soul-stirring. AL-RIAD is the perfect gateway to Marrakech culture."
               </p>
           </div>

           <div className="test-card medium block-bottom-right user-david">
              <div className="user-info">
                   <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="User" className="avatar"/>
                   <div>
                       <h4>David Chen</h4>
                       <div className="stars">★★★★★</div>
                   </div>
               </div>
               <div className="split-content">
                 <p className="quote">
                   "The hospitality here is not just a service, it's an art form. From the tea ceremonies to the rooftop dinners, everything was magical."
                 </p>
                 <img src="https://images.unsplash.com/photo-1574751336422-790159fd4fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Mint Tea" className="tea-pic"/>
               </div>
           </div>
        </div>
      </section>

      </div>
    </Layout>
  );
};

export default Home;
