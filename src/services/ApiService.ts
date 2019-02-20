import { DateTime } from 'luxon';
import { TimePeriod } from './TimePeriod';
import { HourPoint } from './TimePoint';
import { RangeData } from './Data';
import axios, { AxiosResponse } from 'axios'; // do not add { }, some webshit bs?

export class ApiService {

    private toLuxonRange(timePeriod: TimePeriod): any {
        switch (timePeriod) {
            case TimePeriod.Day:
                return {days: 1};
            case TimePeriod.Week:
                return {weeks: 1};
            case TimePeriod.Month:
                return {months: 1};
            case TimePeriod.Year:
                return {years: 1};
            default:
                return null;
        }
    }

    private toGroupBy(timePeriod: TimePeriod): any {
        switch (timePeriod) {
            case TimePeriod.Day:
                return "hourly";
            case TimePeriod.Week:
                return "daily";
            case TimePeriod.Month:
                return "daily";
            case TimePeriod.Year:
                return "monthly";
            default:
                return null;
        }
    }

    getTimeRange(timePeriod: TimePeriod): Promise<AxiosResponse<RangeData[]>> {
        const dateEnd = DateTime.utc();
        const dateStart = dateEnd.minus(this.toLuxonRange(timePeriod));
        const start = Math.round(dateStart.toSeconds());
        const end = Math.round(dateEnd.toSeconds());

        const groupBy = this.toGroupBy(timePeriod);

        const url = `from/${start}/to/${end}/${groupBy}.json`;
        return axios.get<RangeData[]>(process.env.VUE_APP_API_PREFIX + url);
    }

}
