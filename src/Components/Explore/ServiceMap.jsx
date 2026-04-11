import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix for default Leaflet icon issue in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Terracotta themed pin for a more premium look
const terracottaIcon = new L.DivIcon({
  html: `<div style="background-color: #BC4931; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>`,
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const ServiceMap = ({ items }) => {
  const defaultCenter = [31.6295, -7.9811]; // Medina, Marrakech

  return (
    <div className="premium-map-wrapper" style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          className="premium-tiles"
        />
        
        {items.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.lat || 31.63, item.lng || -7.98]} 
            icon={terracottaIcon}
          >
            <Popup className="signature-popup">
              <div className="premium-popup-content">
                <div className="popup-img-wrap">
                  <img 
                    src={item.image || '/logo picter/placeholder.jpg'} 
                    alt={item.title} 
                  />
                  <div className="popup-badge">Premium</div>
                </div>
                <div className="popup-info">
                   <h4>{item.title}</h4>
                   <div className="popup-meta">
                      <span className="p-price">{item.price} MAD</span>
                      <Link to={`/place/${item.id}`} className="p-link">
                        Détails &rarr;
                      </Link>
                   </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Decorative Gradient Overlay */}
      <div className="map-edge-overlay" />
    </div>
  );
};

export default ServiceMap;
