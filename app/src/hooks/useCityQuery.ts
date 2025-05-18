'use client';

import { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';

// GraphQL query for city with weather data
export const GET_CITY = gql`
  query City($city: String!) {
    city(city: $city) {
      name
      latitude
      longitude
      country_code
      current_weather {
        date
        temperature
        precipitation
        snowDepth
        windSpeed
        cloudCover
        visibility
        waveHeight
      }
    }
  }
`;

export interface CityWeatherData {
  city: {
    name: string;
    latitude: number;
    longitude: number;
    country_code: string;
    current_weather: {
      date: string;
      temperature: number;
      precipitation: number;
      snowDepth: number;
      windSpeed: number;
      cloudCover: number;
      visibility: number;
      waveHeight: number;
    }
  }
}

export const useCityQuery = () => {
  const [cityInput, setCityInput] = useState<string>('');
  const [getCity, { loading, error, data }] = useLazyQuery<CityWeatherData>(GET_CITY);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      getCity({ variables: { city: cityInput } });
    }
  };

  const searchCity = (cityName: string) => {
    setCityInput(cityName);
    getCity({ variables: { city: cityName } });
  };

  return {
    cityInput,
    setCityInput,
    handleSearch,
    searchCity,
    loading,
    error,
    data
  };
};