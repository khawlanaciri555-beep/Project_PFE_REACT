import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Components/home.css';

const Home = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        // Si on arrive à la fin du slider, on revient au début
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' }); // scroll vers la gauche
        }
      }
    }, 2500); // 2.5 secondes par defaut

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Navbar Section */}
      <nav className="home-navbar">
        <div className="nav-logo">AL-RIAD</div>
        <div className="nav-links">
          <Link to="#" className="active">Explore</Link>
          <Link to="#">About</Link>
          <Link to="#">Services</Link>
        </div>
        <div className="nav-buttons">
          <Link to="#" className="btn-logout">Logout</Link>
          <Link to="#" className="btn-login">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/background/backHome.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Discover<br/>Marrakech:<br/>A Journey Through<br/>Time and Color
          </h1>
          <p className="hero-subtitle">
            Step into the heart of the Red City, where ancient palaces whisper tales<br/>
            of dynasties and vibrant souks offer a sensory feast unlike anywhere an<br/>
            earth.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Start Exploring</button>
            <button className="btn-secondary">Watch the Film</button>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explorer Marrakech</h2>
          </div>
          <div className="slider-nav">
             <button aria-label="Previous" onClick={() => sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' })}>&lt;</button>
             <button aria-label="Next" onClick={() => sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' })}>&gt;</button>
          </div>
        </div>

        <div className="destinations-grid slider-container" ref={sliderRef}>
          {/* Card 1 */}
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

          {/* Card 2 */}
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

          {/* Card 3 */}
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
          
           {/* Card 4 (pour l'effet de slide) */}
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
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stat-item">
          <span className="stat-number">1062</span>
          <span className="stat-label">FOUNDED</span>
        </div>
         <div className="stat-item">
          <span className="stat-number">800+</span>
          <span className="stat-label">MONUMENTS</span>
        </div>
         <div className="stat-item">
          <span className="stat-number">10M+</span>
          <span className="stat-label">TOURISTS YEARLY</span>
        </div>
         <div className="stat-item unesco">
          <span className="stat-number">UNESCO</span>
          <span className="stat-label">CULTURAL HERITAGE</span>
        </div>
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
                 {/* Replace this with Local Image later */}
                 <img src="https://images.unsplash.com/photo-1574751336422-790159fd4fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Mint Tea" className="tea-pic"/>
               </div>
           </div>
        </div>
      </section>

      {/* Footer Element */}
      <footer className="home-footer">
          <div className="footer-top">
              <div className="footer-col brand-col">
                  <h3>AL-RIAD</h3>
                  <p>Dedicated to curating the most authentic and luxury experiences in the heart of Morocco's Red City.</p>
                  <div className="social-icons">
                      <span>🌍</span>
                      <span>🔗</span>
                      <span>✉️</span>
                  </div>
              </div>
              <div className="footer-col">
                  <h4>Contact Details</h4>
                  <ul>
                      <li>✉ contact@alriad.com</li>
                      <li>📞 +212 524 430000</li>
                      <li>📍 Medina Quarter, Marrakech 44000</li>
                  </ul>
              </div>
              <div className="footer-col">
                  <h4>Useful Links</h4>
                  <ul>
                      <li>Terms of Service</li>
                      <li>Privacy Policy</li>
                      <li>Destination Guides</li>
                      <li>Booking FAQ</li>
                  </ul>
              </div>
          </div>
          <div className="footer-bottom">
              <div>© 2024 AL-RIAD Marrakech. All rights reserved.</div>
              <div className="footer-bottom-links">
                  <span>Majorelle Foundation Partner</span>
                  <span>ISO 9001 Certified</span>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Home;
