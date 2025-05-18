import { useQuery, gql } from '@apollo/client';

const ACTIVITY_RANKING_QUERY = gql`
  query GetActivityRanking($city: String!) {
    activityRanking(city: $city) {
      city {
        name
        country_code
        latitude
        longitude
        current_weather {
          temperature
          precipitation
          windSpeed
          visibility
          cloudCover
          snowDepth
          waveHeight
          date
        }
      }
      days {
        date
        activities {
          outdoor_sightseeing {
            score
            recommendation
          }
          indoor_sightseeing {
            score
            recommendation
          }
          skiing {
            score
            recommendation
          }
          surfing {
            score
            recommendation
          }
        }
      }
      weatherForecast {
        date
        temperature_min
        temperature_max
        temperature_avg
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

export function useActivityQuery(cityName: string) {
  const { loading, error, data } = useQuery(ACTIVITY_RANKING_QUERY, {
    variables: { city: decodeURIComponent(cityName) },
    skip: !cityName,
  });

  return {
    loading,
    error,
    data,
  };
}