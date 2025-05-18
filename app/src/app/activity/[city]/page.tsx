'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useActivityQuery } from '../../../hooks/useActivityQuery';
import Link from 'next/link';
import ActivityRankingCard from '../../../components/ActivityRankingCard';
import WeatherChart from '../../../components/ActivityRankingChart';
import WeatherMap from '../../../components/WeatherMap';

export default function ActivityPage() {
  const params = useParams();
  const cityName = typeof params.city === 'string' ? params.city : '';
  
  const { loading, error, data } = useActivityQuery(cityName);

  if (loading) return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Search
        </Link>
      </div>
      <div className="text-center py-8">
        <p className="text-xl">Loading activity data for {decodeURIComponent(cityName)}...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Search
        </Link>
      </div>
      <div className="text-center py-8">
        <p className="text-xl text-red-500">Error: {error.message}</p>
        <p className="mt-2">Unable to fetch activity data for {decodeURIComponent(cityName)}</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Search
        </Link>
      </div>
      <div className="text-center py-8">
        <p className="text-xl">No activity data found for {decodeURIComponent(cityName)}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Search
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">
        {data.activityRanking.city.name} - Activity Forecast
      </h1>
      
      {/* Weather Map Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Interactive Weather Map</h2>
        <WeatherMap 
          latitude={data.activityRanking.city.latitude}
          longitude={data.activityRanking.city.longitude}
          apiKey={process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ''}
          cityName={data.activityRanking.city.name}
        />
      </div>
      
      {/* Weather Chart Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7-Day Weather Forecast</h2>
        <WeatherChart weatherForecast={data.activityRanking.weatherForecast} />
      </div>
      
      {/* Daily Forecast Cards */}
      <h2 className="text-2xl font-semibold mb-4">Daily Activity Ratings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {data.activityRanking.days.map((day, index) => (
          <ActivityRankingCard 
            key={day.date} 
            day={day} 
            weather={data.activityRanking.weatherForecast[index]}
          />
        ))}
      </div>
      
      {/* Current Conditions Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Current Conditions in {data.activityRanking.city.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-lg mb-2">
              <span className="font-medium">Temperature:</span> {data.activityRanking.city.current_weather.temperature}°C
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium">Wind Speed:</span> {data.activityRanking.city.current_weather.windSpeed} km/h
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium">Cloud Cover:</span> {data.activityRanking.city.current_weather.cloudCover}%
            </p>
          </div>
          <div>
            <p className="text-lg mb-2">
              <span className="font-medium">Precipitation:</span> {data.activityRanking.city.current_weather.precipitation}%
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium">Visibility:</span> {data.activityRanking.city.current_weather.visibility} m
            </p>
            {data.activityRanking.city.current_weather.snowDepth > 0 && (
              <p className="text-lg mb-2">
                <span className="font-medium">Snow Depth:</span> {data.activityRanking.city.current_weather.snowDepth} cm
              </p>
            )}
            {data.activityRanking.city.current_weather.waveHeight && (
              <p className="text-lg mb-2">
                <span className="font-medium">Wave Height:</span> {data.activityRanking.city.current_weather.waveHeight} m
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Activity Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Activity Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Skiing</h3>
            <p className="text-gray-700">
              Skiing conditions depend on snow depth, temperature, and visibility. The best skiing days 
              have fresh snow, cold temperatures, and good visibility.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Surfing</h3>
            <p className="text-gray-700">
              Ideal surfing conditions include moderate wind speeds, good wave heights, and clear visibility. 
              Surfing is best on days with consistent waves and minimal cross-shore winds.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Outdoor Sightseeing</h3>
            <p className="text-gray-700">
              Outdoor sightseeing is most enjoyable in clear, mild weather with low precipitation and 
              moderate temperatures. The best days feature sunny skies and comfortable conditions.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Indoor Sightseeing</h3>
            <p className="text-gray-700">
              Indoor activities are recommended during days with poor outdoor conditions like 
              heavy precipitation, extreme temperatures, or high winds. Museums, galleries, and cultural 
              sites offer excellent alternatives to outdoor activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}