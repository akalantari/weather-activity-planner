'use client';

import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import CityCard from './CityCard';
import { GET_CITY, CityWeatherData } from '../hooks/useCityQuery';

// List of popular cities to suggest
const POPULAR_CITIES = [
  'London',
  'Istanbul',
  'New York',
  'Tokyo',
  'Paris',
  'Sydney',
  'Rio de Janeiro',
  'Prague',
];

interface SuggestedCitiesProps {
  onCitySelect: (cityName: string) => void;
}

const SuggestedCities: React.FC<SuggestedCitiesProps> = ({ onCitySelect }) => {
  const [cities, setCities] = useState<Array<CityWeatherData['city'] | null>>(
    Array(POPULAR_CITIES.length).fill(null)
  );
  
  const [getCity] = useLazyQuery<CityWeatherData>(GET_CITY);
  
  useEffect(() => {
    // Fetch data for each popular city
    const fetchCities = async () => {
      const cityPromises = POPULAR_CITIES.map(cityName => 
        getCity({ variables: { city: cityName } })
      );
      
      const results = await Promise.all(cityPromises);
      const cityData = results
        .map(result => result.data?.city || null);
      
      setCities(cityData);
    };
    
    fetchCities();
  }, [getCity]);
  
  return (
    <div className="suggested-cities">
      <h2 className="section-title">Popular Destinations</h2>
      <div className="cities-grid">
        {cities.map((city, index) => (
          city ? (
            <CityCard
              key={`${city.name}-${index}`}
              name={city.name}
              country_code={city.country_code}
              temperature={city.current_weather?.temperature}
              cloudCover={city.current_weather?.cloudCover}
              windSpeed={city.current_weather?.windSpeed}
              onClick={() => onCitySelect(city.name)}
            />
          ) : (
            <div key={`loading-${index}`} className="city-card-skeleton">
              <div className="skeleton-animation" />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default SuggestedCities;