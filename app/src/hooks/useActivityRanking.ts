'use client';

import { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { ActivityRankingData, ChartData } from '../types';

// GraphQL query for activity rankings
export const GET_ACTIVITY_RANKINGS = gql`
  query GetActivityRankings($city: String!) {
    activityRanking(city: $city) {
      city {
        name
        country_code
        latitude
        longitude
      }
      days {
        date
        activities {
          skiing {
            score
            recommendation
          }
          surfing {
            score
            recommendation
          }
          outdoor_sightseeing {
            score
            recommendation
          }
          indoor_sightseeing {
            score
            recommendation
          }
        }
      }
    }
  }
`;

export const useActivityRanking = () => {
  const [cityInput, setCityInput] = useState<string>('');
  const [getActivityRankings, { loading, error, data }] = useLazyQuery<ActivityRankingData>(
    GET_ACTIVITY_RANKINGS
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      getActivityRankings({ variables: { city: cityInput } });
    }
  };

  // Extract chart data from results
  const getChartData = (): ChartData | null => {
    if (!data || !data.activityRanking || !data.activityRanking.days) return null;

    const days = data.activityRanking.days;
    const labels = days.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });

    // Dataset for each activity
    return {
      labels,
      datasets: [
        {
          label: 'Skiing',
          data: days.map(day => day.activities.skiing.score),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: 'Surfing',
          data: days.map(day => day.activities.surfing.score),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
        },
        {
          label: 'Outdoor Sightseeing',
          data: days.map(day => day.activities.outdoor_sightseeing.score),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
        },
        {
          label: 'Indoor Sightseeing',
          data: days.map(day => day.activities.indoor_sightseeing.score),
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
        },
      ],
    };
  };

  return {
    cityInput,
    setCityInput,
    handleSearch,
    loading,
    error,
    data,
    getChartData,
  };
};