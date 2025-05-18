
import { ActivityType } from '@/modules/activity/domain/ActivityRankingCriteria';

export interface ActivityRankingDay {
    date: string;
    activities: {
        [key in ActivityType]: {
            score: number;
            recommendation: string;
        };
    };
}

export default ActivityRankingDay;