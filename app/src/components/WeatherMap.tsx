'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as maptilerweather from '@maptiler/weather';
import '@maptiler/sdk/dist/maptiler-sdk.css';

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  apiKey: string;
  cityName?: string;
}

// Define the available weather layers
type WeatherLayerType = 'temperature' | 'precipitation' | 'radar' | 'wind' | 'pressure';

// Layer info for better UX
const layerInfo = {
  temperature: {
    name: 'Temperature',
    icon: '🌡️',
    layer: (): maptilerweather.TileLayer => new maptilerweather.TemperatureLayer({
      id: 'temperature-layer',
      opacity: 0.6,
      colorramp: maptilerweather.ColorRamp.builtin.TEMPERATURE_3,
    }),
  },
  precipitation: {
    name: 'Precipitation',
    icon: '🌧️',
    layer: (): maptilerweather.TileLayer => new maptilerweather.PrecipitationLayer({
      id: 'precipitation-layer',
      opacity: 0.6,
    })
  },
  radar: {
    name: 'Radar',
    icon: '🌧️',
    layer: (): maptilerweather.TileLayer => new maptilerweather.RadarLayer({
      id: 'radar-layer',
      opacity: 0.6,
    })
  },
  wind: {
    name: 'Wind',
    icon: '💨',
    layer: (): maptilerweather.TileLayer => new maptilerweather.WindLayer({
      id: 'wind-layer',
      opacity: 0.6,
    })
  },
  pressure: {
    name: 'Pressure',
    icon: '📊',
    layer: (): maptilerweather.TileLayer => new maptilerweather.PressureLayer({
      id: 'pressure-layer',
      opacity: 0.6,
    })
  }
};

const WeatherMap: React.FC<WeatherMapProps> = ({ latitude, longitude, apiKey, cityName = 'Selected Location' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const weatherLayerRef = useRef<maptilerweather.TileLayer | null>(null);
  const markerRef = useRef<maptilersdk.Marker | null>(null);
  const popupRef = useRef<maptilersdk.Popup | null>(null);
  
  const [activeLayer, setActiveLayer] = useState<WeatherLayerType>('temperature');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [timeSliderValue, setTimeSliderValue] = useState<number>(0);
  const [sliderMin, setSliderMin] = useState<number>(0);
  const [sliderMax, setSliderMax] = useState<number>(11);
  const [pointerValue, setPointerValue] = useState<string>('');

  // Format the date and time for display
  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Initialize the map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Set MapTiler API key
    maptilersdk.config.apiKey = apiKey;

    // Initialize map with a weather-appropriate style
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.BACKDROP,  // Using a more minimal style for weather visualization
      center: [longitude, latitude],
      zoom: 8
    });

    // Add controls
    map.current.addControl(new maptilersdk.NavigationControl());
    map.current.addControl(new maptilersdk.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    map.current.addControl(new maptilersdk.FullscreenControl());
    map.current.addControl(new maptilersdk.ScaleControl());

    // Create a popup
    popupRef.current = new maptilersdk.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup'
    })
    .setHTML(`<h3 class="font-bold">${cityName}</h3><p>Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}</p>`)
    .setMaxWidth('300px');

    // Create a marker at the city location
    markerRef.current = new maptilersdk.Marker({
      color: '#3b82f6',  // Blue color matching our theme
    })
    .setLngLat([longitude, latitude])
    .setPopup(popupRef.current)
    .addTo(map.current);

    // Show popup by default
    markerRef.current?.togglePopup();

    // Add mouse events for pointer data
    map.current.on('mousemove', (e) => {
      updatePointerValue(e.lngLat);
    });

    map.current.on('mouseout', (e) => {
      if (!e.originalEvent.relatedTarget) {
        setPointerValue("");
      }
    });

    // Wait for map to load
    map.current.on('load', () => {
      if (!map.current) return;

      // Initialize weather layer
      weatherLayerRef.current = layerInfo[activeLayer].layer();
      
      // Add weather layer to map
      map.current.addLayer(weatherLayerRef.current);
      
      // Enable animation
      weatherLayerRef.current?.animateByFactor(3600); // 1 second = 1 hour
      
      // Update current date display on each tick
      weatherLayerRef.current?.on('tick', () => {
        // refreshTime();
      });

      // Called when the time is manually set
      weatherLayerRef.current?.on('animationTimeSet', async () => {
        await (weatherLayerRef.current as unknown as { onSourceReadyAsync: () => Promise<void> }).onSourceReadyAsync();
        refreshTime();
      });

      // Event called when all the datasource for the next days are added and ready
      weatherLayerRef.current?.on('sourceReady', async () => {
        if (weatherLayerRef.current) {

          // wait until the tilesource is fully loaded
          await (weatherLayerRef.current as unknown as { onSourceReadyAsync: () => Promise<void> }).onSourceReadyAsync();
          const startDate = weatherLayerRef.current.getAnimationStartDate();
          const endDate = weatherLayerRef.current.getAnimationEndDate();
          
          if (startDate && endDate) {
            setSliderMin(startDate.getTime());
            setSliderMax(endDate.getTime());
            setTimeSliderValue(weatherLayerRef.current.getAnimationTimeDate().getTime());
          }
        }
      });
      
      setIsMapInitialized(true);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, apiKey, cityName]);

  // Handle layer switching
  useEffect(() => {
    if (!isMapInitialized || !weatherLayerRef.current || !map.current) return;

    // Reset current layers
    map.current.removeLayer(weatherLayerRef.current.id);

    // // Add the selected layer
    const layer = layerInfo[activeLayer].layer();

    weatherLayerRef.current = layer;

    // Add weather layer to map
    map.current.addLayer(layer);

  }, [activeLayer, isMapInitialized]);

  // Handle layer button click
  const handleLayerClick = (layerType: WeatherLayerType) => {
    setActiveLayer(layerType);
  };

  // Handle time slider change
  const handleTimeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setTimeSliderValue(value);

    setCurrentDate(formatDateTime(new Date(value)));
    
    if (weatherLayerRef.current) {
      // Set animation time in seconds (divide by 1000 to convert from milliseconds)
      weatherLayerRef.current.setAnimationTime(parseInt(value.toString()) / 1000);
    }
  };

  // Update the date time display
  const refreshTime = () => {
    if (weatherLayerRef.current) {
      const date = weatherLayerRef.current.getAnimationTimeDate();
      if (date) {
        setCurrentDate(formatDateTime(date));
        setTimeSliderValue(date.getTime());
      }
    }
  };
  
  // Update the pointer value display
  const updatePointerValue = (lngLat: { lng: number; lat: number } | null) => {
    if (!lngLat) return;
    
    if (weatherLayerRef.current) {
      const value = weatherLayerRef.current.pick(lngLat.lng, lngLat.lat);
      if (!value) {
        setPointerValue("");
        return;
      }
      
      let displayValue = "";
      let unit = "";
      
      switch (activeLayer) {
        case 'temperature':
          displayValue = value[0]?.toFixed(1) || "";
          unit = "°";
          break;
        case 'precipitation':
          displayValue = value[0]?.toFixed(1) || "";
          unit = " mm";
          break;
        case 'wind':
          displayValue = value[0]?.toFixed(1) || "";
          unit = " m/s";
          break;
        case 'pressure':
          displayValue = value[0]?.toFixed(1) || "";
          unit = " hPa";
          break;
        case 'radar':
          displayValue = value[0]?.toFixed(1) || "";
          unit = " dBZ";
          break;
      }
      
      setPointerValue(`${displayValue}${unit}`);
    }
  };

  // Get button style based on active state
  const getButtonClass = (layerType: WeatherLayerType) => {
    const baseClass = 'px-4 py-2 rounded text-sm font-medium transition-colors flex items-center';
    return activeLayer === layerType
      ? `${baseClass} bg-blue-600 text-white`
      : `${baseClass} bg-white text-gray-700 hover:bg-gray-100`;
  };

  // Check if API key is available
  if (!apiKey || apiKey === '') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-8">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">MapTiler API Key Missing</h3>
          <p className="text-gray-600 text-center mb-6">
            To display the interactive weather map, you need to provide a valid MapTiler API key in your .env.local file.
          </p>
          <div className="bg-gray-100 p-4 rounded-md text-sm font-mono mb-4 w-full max-w-md">
            NEXT_PUBLIC_MAPTILER_API_KEY=your_api_key_here
          </div>
          <a 
            href="https://cloud.maptiler.com/account/keys/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Get a free MapTiler API key
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      {/* Variable name display */}
      <div id="variable-name" className="absolute top-2 left-4 z-10 text-lg font-medium text-white text-shadow">
        {layerInfo[activeLayer].name}
      </div>
      
      {/* Pointer data display */}
      <div id="pointer-data" className="absolute top-10 left-4 z-10 text-xl font-bold text-white text-shadow">
        {pointerValue}
      </div>
      
      {/* Layer selector panel */}
      <div id="buttons" className="absolute top-24 left-4 z-10 bg-white rounded-md shadow-md p-3">
        <div className="text-center font-semibold mb-3 text-gray-700 border-b pb-2">Weather Layers</div>
        <div className="flex flex-col space-y-2">
          {Object.entries(layerInfo).map(([key, info]) => (
            <button 
              id={key}
              key={key}
              className={getButtonClass(key as WeatherLayerType)}
              onClick={() => handleLayerClick(key as WeatherLayerType)}
              title={info.name}
            >
              <span className="mr-2">{info.icon}</span>
              {info.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Time controls */}
      <div id="time-info" className="absolute bottom-4 left-0 right-0 z-10 bg-white bg-opacity-90 rounded-md shadow-md p-3 mx-auto w-4/5 text-center">
        <div className="flex justify-between items-center mb-2">
          <div id="time-text" className="font-medium text-sm">{currentDate || 'Loading forecast...'}</div>
        </div>
        <input
          id="time-slider"
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={timeSliderValue}
          onChange={handleTimeSliderChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Now</span>
          <span>+24h</span>
          <span>+48h</span>
          <span>+72h</span>
        </div>
      </div>
      
      {/* Map container */}
      <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default WeatherMap;