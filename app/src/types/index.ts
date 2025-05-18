export interface City {
  name: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

export interface ActivityScore {
  score: number;
  recommendation: string;
}

export interface DailyActivities {
  skiing: ActivityScore;
  surfing: ActivityScore;
  outdoor_sightseeing: ActivityScore;
  indoor_sightseeing: ActivityScore;
}

export interface ActivityRankingDay {
  date: string;
  activities: DailyActivities;
}

export interface WeatherForecast {
  date: string;
  temperature_min: number;
  temperature_max: number;
  temperature_avg: number;
  precipitation: number;
  snowDepth: number;
  windSpeed: number;
  cloudCover: number;
  visibility: number;
  waveHeight: number | null;
}

export interface ActivityRanking {
  city: City;
  days: ActivityRankingDay[];
  weatherForecast: WeatherForecast[];
}

export interface ActivityRankingData {
  activityRanking: ActivityRanking;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}