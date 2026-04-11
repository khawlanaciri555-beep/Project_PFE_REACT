import React from 'react';
import { FloatingInput, CustomSelect, FileUpload } from './UIComponents';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaTruck, FaFileAlt, FaImage } from 'react-icons/fa';

export const TouristForm = ({ data, onChange }) => (
  <>
    <FloatingInput
      icon={FaEnvelope}
      label="Email Address"
      type="email"
      name="email"
      value={data.email}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaLock}
      label="Password"
      type="password"
      name="password"
      value={data.password}
      onChange={onChange}
      required
    />
  </>
);

export const HotelForm = ({ data, onChange, onFileChange }) => (
  <>
    <FloatingInput
      icon={FaBuilding}
      label="Hotel Name"
      name="hotelName"
      value={data.hotelName}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaEnvelope}
      label="Email Address"
      type="email"
      name="email"
      value={data.email}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaLock}
      label="Password"
      type="password"
      name="password"
      value={data.password}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaPhone}
      label="Phone Number"
      type="tel"
      name="phone"
      value={data.phone}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaMapMarkerAlt}
      label="Address"
      name="address"
      value={data.address}
      onChange={onChange}
      required
    />
    <CustomSelect
      icon={FaMapMarkerAlt}
      label="Region"
      name="region"
      value={data.region}
      onChange={onChange}
      options={[
        { value: 'marrakech-safi', label: 'Marrakech-Safi' },
        { value: 'tanger-tetouan-alhoceima', label: 'Tanger-Tetouan-Al Hoceima' },
        { value: 'oriental', label: 'L\'Oriental' },
        { value: 'fes-meknes', label: 'Fès-Meknès' },
        { value: 'rabat-sale-kenitra', label: 'Rabat-Salé-Kénitra' },
        { value: 'beni-mellal-khenifra', label: 'Béni Mellal-Khénifra' },
        { value: 'casablanca-settat', label: 'Casablanca-Settat' },
        { value: 'draa-tafilalet', label: 'Drâa-Tafilalet' },
        { value: 'souss-massa', label: 'Souss-Massa' },
        { value: 'guelmim-oued-noun', label: 'Guelmim-Oued Noun' },
        { value: 'laayoune-sakia-elhamra', label: 'Laâyoune-Sakia El Hamra' },
        { value: 'dakhla-oued-eddahab', label: 'Dakhla-Oued Ed-Dahab' }
      ]}
      required
    />
    <FileUpload
      label="Hotel Images"
      description="Upload multiple images of your hotel"
      onChange={(e) => onFileChange(e, 'images')}
      multiple
    />
    <FloatingInput
      icon={FaFileAlt}
      label="Description"
      name="description"
      value={data.description}
      onChange={onChange}
    />
  </>
);

export const TransporteurForm = ({ data, onChange, onFileChange }) => (
  <>
    <FloatingInput
      icon={FaUser}
      label="Name/Company"
      name="company"
      value={data.company}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaEnvelope}
      label="Email Address"
      type="email"
      name="email"
      value={data.email}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaLock}
      label="Password"
      type="password"
      name="password"
      value={data.password}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaPhone}
      label="Phone Number"
      type="tel"
      name="phone"
      value={data.phone}
      onChange={onChange}
      required
    />
    <CustomSelect
      icon={FaTruck}
      label="Vehicle Type"
      name="vehicleType"
      value={data.vehicleType}
      onChange={onChange}
      options={[
        { value: 'taxi', label: 'Taxi' },
        { value: 'bus', label: 'Bus' },
        { value: 'van', label: 'Van (8+1)' },
        { value: 'luxury', label: 'Luxury Car' }
      ]}
      required
    />
    <FloatingInput
      icon={FaFileAlt}
      label="License Number"
      name="licenseNumber"
      value={data.licenseNumber}
      onChange={onChange}
      required
    />
    <FileUpload
      label="License Document"
      onChange={(e) => onFileChange(e, 'licenseDoc')}
    />
  </>
);

export const CooperativeForm = ({ data, onChange, onFileChange }) => (
  <>
    <FloatingInput
      icon={FaBuilding}
      label="Cooperative Name"
      name="cooperativeName"
      value={data.cooperativeName}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaEnvelope}
      label="Email Address"
      type="email"
      name="email"
      value={data.email}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaLock}
      label="Password"
      type="password"
      name="password"
      value={data.password}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaPhone}
      label="Phone Number"
      type="tel"
      name="phone"
      value={data.phone}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaMapMarkerAlt}
      label="Address"
      name="address"
      value={data.address}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaBriefcase}
      label="Activity Type"
      name="activityType"
      value={data.activityType}
      onChange={onChange}
      required
    />
    <FloatingInput
      icon={FaFileAlt}
      label="Description"
      name="description"
      value={data.description}
      onChange={onChange}
    />
    <FileUpload
      label="Cooperative Certificate"
      onChange={(e) => onFileChange(e, 'certificate')}
    />
  </>
);
