import { DateTime } from 'luxon';
import { TimePeriod } from './TimePeriod';
import { TimePoint } from './TimePoint';
import { RangeData } from './Data';
import axios from 'axios'; // do not add { }, some webshit bs?
import { AxiosResponse } from 'axios';

export class ApiResource {

    private toTimePoint(dateTime: DateTime): TimePoint {
        return {
            year: dateTime.year,
            month: dateTime.month,
            day: dateTime.day,
            hour: dateTime.hour,
        }
    }

    private toLuxonRange(timePeriod: TimePeriod): any {
        switch (timePeriod) {
            case TimePeriod.Day:
                return { days: 1};
            case TimePeriod.Week:
                return { weeks: 1};
            case TimePeriod.Month:
                return { months: 1};
            case TimePeriod.Year:
                return { years: 1};
            default:
                return null;
        }
    }

    getTimeRange(timePeriod: TimePeriod): Promise<AxiosResponse<RangeData[]>> {
        const dateEnd = DateTime.local().setZone('UTC');
        const dateStart = dateEnd.minus(this.toLuxonRange(timePeriod));

        const end = this.toTimePoint(dateEnd);
        const start = this.toTimePoint(dateStart);
        //start.year = 2019;
        //start.month = 2;
        //start.day = 2;
        //start.hour = 19;
        //end.year = 2019;
        //end.month = 2;
        //end.day = 3;
        //end.hour = 19;


        console.log(end, start);

        const url = `range/${start.year}/${start.month}/${start.day}/${start.hour}/${end.year}/${end.month}/${end.day}/${end.hour}.json`;
        return axios.get<RangeData[]>(process.env.VUE_APP_API_PREFIX + url);
    }

}
