'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { WeatherForecast } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherChartProps {
  weatherForecast: WeatherForecast[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ weatherForecast }) => {
  if (!weatherForecast || weatherForecast.length === 0) return null;

  // Format dates for display
  const labels = weatherForecast.map(day => {
    const date = typeof day.date === 'string' ? new Date(day.date) : new Date(parseInt(day.date));
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  // Prepare chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: weatherForecast.map(day => day.temperature_max),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: false,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Min Temperature (°C)',
        data: weatherForecast.map(day => day.temperature_min),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: false,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Precipitation Chance (%)',
        data: weatherForecast.map(day => day.precipitation * 100), // Convert to percentage
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 1,
        type: 'line' as const,
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
      }
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '7-Day Weather Forecast',
        font: {
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Precipitation')) {
                label += context.parsed.y.toFixed(0) + '%';
              } else {
                label += context.parsed.y.toFixed(1) + '°C';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Temperature (°C)',
          font: {
            size: 12,
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Precipitation (%)',
          font: {
            size: 12,
          }
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12,
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default WeatherChart;