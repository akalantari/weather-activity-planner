'use client';

import React from 'react';
import Image from 'next/image';

interface CityCardProps {
  name: string;
  country_code: string;
  temperature?: number;
  cloudCover?: number;
  windSpeed?: number;
  onClick: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ 
  name, 
  country_code, 
  temperature, 
  cloudCover, 
  windSpeed,
  onClick 
}) => {
  // Weather icon based on cloud cover
  const getWeatherIcon = () => {
    if (cloudCover === undefined) return '/weather/partly-cloudy.svg';
    
    if (cloudCover < 20) return '/weather/sunny.svg';
    if (cloudCover < 50) return '/weather/partly-cloudy.svg';
    return '/weather/cloudy.svg';
  };

  return (
    <button 
      onClick={onClick}
      className="city-card"
      aria-label={`Select ${name}, ${country_code}`}
    >
      <div className="city-card-content">
        <div className="city-info">
          <h3 className="city-name">{name}</h3>
          <p className="country-code">{country_code}</p>
        </div>
        
        <div className="weather-info">
          {temperature !== undefined && (
            <p className="temperature">{Math.round(temperature)}°C</p>
          )}
          <div className="weather-icon">
            <Image 
              src={getWeatherIcon()} 
              alt="Weather condition" 
              width={40} 
              height={40}
              priority
            />
          </div>
          {windSpeed !== undefined && (
            <p className="wind-speed">{Math.round(windSpeed)} km/h</p>
          )}
        </div>
      </div>
    </button>
  );
};

export default CityCard;