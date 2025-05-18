'use client';

import React from 'react';
import { ActivityRankingDay, WeatherForecast } from '../types';
import Image from 'next/image';

// Function to convert score to star rating (0-5 stars)
const getStarRating = (score: number): number => {
  // Convert score (0-100) to a 0-5 scale and round to nearest 0.5
  return Math.round((score / 100) * 5 * 2) / 2;
};

// Function to render star rating (0-5 stars)
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`star-full-${i}`} className="text-yellow-400">★</span>
      ))}
      {hasHalfStar && <span className="text-yellow-400">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`star-empty-${i}`} className="text-gray-300">★</span>
      ))}
    </div>
  );
};

// Function to get weather icon based on cloud cover and precipitation
const getWeatherIcon = (cloudCover: number, precipitation: number): string => {
  if (precipitation > 0.5) return "/weather/rainy.svg";
  if (cloudCover > 70) return "/weather/cloudy.svg";
  if (cloudCover > 30) return "/weather/partly-cloudy.svg";
  return "/weather/sunny.svg";
};

interface ActivityRankingCardProps {
  day: ActivityRankingDay;
  weather: WeatherForecast;
}

const ActivityRankingCard: React.FC<ActivityRankingCardProps> = ({ day, weather }) => {
  // Format date string from timestamp if needed
  const dateObj = typeof weather.date === 'string' ? new Date(weather.date) : new Date(parseInt(weather.date));
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const weatherIcon = getWeatherIcon(weather.cloudCover, weather.precipitation);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with date and weather overview */}
      <div className="bg-blue-600 text-white p-4">
        <h3 className="text-lg font-bold">{formattedDate}</h3>
      </div>
      
      {/* Weather summary */}
      <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 relative">
            <Image 
              src={weatherIcon}
              alt="Weather condition" 
              width={48}
              height={48}
            />
          </div>
          <div>
            <div className="font-bold text-2xl">{Math.round(weather.temperature_max)}°C</div>
            <div className="text-sm text-gray-600">{Math.round(weather.temperature_min)}°C</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm">
            <span className="font-semibold">Wind:</span> {Math.round(weather.windSpeed)} km/h
          </div>
          <div className="text-sm">
            <span className="font-semibold">Precipitation:</span> {Math.round(weather.precipitation * 100)}%
          </div>
        </div>
      </div>
      
      {/* Activities section */}
      <div className="p-4 space-y-3">
        <h4 className="font-bold text-md mb-2 text-gray-700">Activity Ratings</h4>
        
        {/* Skiing */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-medium">Skiing</span>
          <StarRating rating={getStarRating(day.activities.skiing.score)} />
        </div>
        
        {/* Surfing */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-medium">Surfing</span>
          <StarRating rating={getStarRating(day.activities.surfing.score)} />
        </div>
        
        {/* Outdoor Sightseeing */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-medium">Outdoor Sightseeing</span>
          <StarRating rating={getStarRating(day.activities.outdoor_sightseeing.score)} />
        </div>
        
        {/* Indoor Sightseeing */}
        <div className="flex justify-between items-center py-2">
          <span className="font-medium">Indoor Sightseeing</span>
          <StarRating rating={getStarRating(day.activities.indoor_sightseeing.score)} />
        </div>
      </div>
    </div>
  );
};

export default ActivityRankingCard;