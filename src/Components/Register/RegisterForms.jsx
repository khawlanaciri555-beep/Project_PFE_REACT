import React from 'react';
import { FloatingInput, CustomSelect, FileUpload } from './UIComponents';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaTruck, FaFileAlt, FaImage } from 'react-icons/fa';

export const TouristForm = ({ data, onChange }) => (
  <>
    <FloatingInput
      icon={FaUser}
      label="Full Name"
      name="name"
      value={data.name}
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
      icon={FaLock}
      label="Confirm Password"
      type="password"
      name="password_confirmation"
      value={data.password_confirmation}
      onChange={onChange}
      required
    />
  </>
);

export const HotelForm = ({ data, onChange, onFileChange, places }) => (
  <>
    <CustomSelect
      icon={FaBuilding}
      label="Type d'hébergement"
      name="accommodationType"
      value={data.accommodationType || 'hotel'}
      onChange={onChange}
      options={[
        { value: 'hotel', label: 'Hôtel' },
        { value: 'riad', label: 'Riad' }
      ]}
      required
    />
    <FloatingInput
      icon={FaBuilding}
      label="Nom de l'hébergement"
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
      icon={FaLock}
      label="Confirm Password"
      type="password"
      name="password_confirmation"
      value={data.password_confirmation}
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
      label="Place"
      name="place_id"
      value={data.place_id}
      onChange={onChange}
      options={places}
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

export const TransporteurForm = ({ data, onChange, onFileChange, places }) => (
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
      icon={FaLock}
      label="Confirm Password"
      type="password"
      name="password_confirmation"
      value={data.password_confirmation}
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
    <CustomSelect
      icon={FaMapMarkerAlt}
      label="Place"
      name="place_id"
      value={data.place_id}
      onChange={onChange}
      options={places}
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

export const CooperativeForm = ({ data, onChange, onFileChange, places }) => (
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
      icon={FaLock}
      label="Confirm Password"
      type="password"
      name="password_confirmation"
      value={data.password_confirmation}
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
      icon={FaMapMarkerAlt}
      label="Place"
      name="place_id"
      value={data.place_id}
      onChange={onChange}
      options={places}
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
