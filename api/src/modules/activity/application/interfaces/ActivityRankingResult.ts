import ActivityRankingDay from './ActivityRankingDay';

export interface ActivityRankingResult {
    city: {
        name: string;
        latitude: number;
        longitude: number;
        country_code: string;
    };
    days: ActivityRankingDay[];
}

export default ActivityRankingResult;