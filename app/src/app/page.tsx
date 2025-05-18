'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SuggestedCities from '../components/SuggestedCities';
import { useCityQuery } from '../hooks/useCityQuery';

export default function Home() {
  const router = useRouter();
  const { cityInput, setCityInput } = useCityQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      router.push(`/activity/${encodeURIComponent(cityInput.toLowerCase())}`);
    }
  };

  const handleCitySelect = (cityName: string) => {
    router.push(`/activity/${encodeURIComponent(cityName.toLowerCase())}`);
  };

  return (
    <main className="min-h-screen">
      <div className="hero-section">
        <h1 className="hero-title">Activity Planner</h1>
        <p className="hero-subtitle">
          Find the perfect activities based on weather conditions anywhere in the world
        </p>
        
        <form className="search-container" onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="search-input"
            placeholder="Enter a city name..." 
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            aria-label="Search for a city"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
      
      <SuggestedCities onCitySelect={handleCitySelect} />
    </main>
  );
}