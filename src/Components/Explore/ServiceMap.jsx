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
    <div style={{ height: '70vh', width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '1px solid rgba(188, 73, 49, 0.1)' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Using a slightly more muted tile set for a boutique feel
          className="map-tiles"
        />
        
        {items.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.lat || 31.63 + (Math.random() - 0.5) * 0.05, item.lng || -7.98 + (Math.random() - 0.5) * 0.05]} 
            icon={terracottaIcon}
          >
            <Popup className="premium-popup">
              <div style={{ padding: '0.5rem', minWidth: '180px' }}>
                <img 
                  src={item.image || '/logo picter/placeholder.jpg'} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} 
                />
                <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>{item.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.price}</span>
                  <Link to={`/place/${item.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.8rem' }}>
                    Voir détail &rarr;
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ServiceMap;
