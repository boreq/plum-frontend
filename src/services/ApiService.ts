import { DateTime } from 'luxon';
import { TimePeriod } from '@/dto/TimePeriod';
import { RangeData } from '@/dto/Data';
import axios, { AxiosResponse } from 'axios'; // do not add { }, some webshit bs?

export class ApiService {

    getTimeRange(timePeriod: TimePeriod): Promise<AxiosResponse<RangeData[]>> {
        const end = DateTime.utc();
        const start = end.minus(this.toLuxonRange(timePeriod));

        switch (timePeriod) {
            case TimePeriod.Day:
                return this.getHourly(start, end);
            case TimePeriod.Week:
                return this.getDaily(start, end);
            case TimePeriod.Month:
                return this.getDaily(start, end);
            case TimePeriod.Year:
                return this.getMonthly(start, end);
            default:
                throw new Error('not implemented');
        }
    }

    getTimePoint(timePeriod: TimePeriod): Promise<AxiosResponse<RangeData>> {
        const now = DateTime.utc();

        switch (timePeriod) {
            case TimePeriod.Day:
                return this.getHour(now);
            case TimePeriod.Week:
                return this.getDay(now);
            case TimePeriod.Month:
                return this.getDay(now);
            case TimePeriod.Year:
                return this.getMonth(now);
            default:
                throw new Error('not implemented');
        }
    }

    private getHour(t: DateTime): Promise<AxiosResponse<RangeData>> {
        const url = `hour/${t.year}/${t.month}/${t.day}/${t.hour}.json`;
        return axios.get<RangeData>(process.env.VUE_APP_API_PREFIX + url);
    }

    private getDay(t: DateTime): Promise<AxiosResponse<RangeData>> {
        const url = `day/${t.year}/${t.month}/${t.day}.json`;
        return axios.get<RangeData>(process.env.VUE_APP_API_PREFIX + url);
    }

    private getMonth(t: DateTime): Promise<AxiosResponse<RangeData>> {
        const url = `month/${t.year}/${t.month}.json`;
        return axios.get<RangeData>(process.env.VUE_APP_API_PREFIX + url);
    }

    private getHourly(from: DateTime, to: DateTime): Promise<AxiosResponse<RangeData[]>> {
        const url = `range/hourly/` +
            `${from.year}/${from.month}/${from.day}/${from.hour}/` +
            `${to.year}/${to.month}/${to.day}/${to.hour}.json`;
        return axios.get<RangeData[]>(process.env.VUE_APP_API_PREFIX + url);
    }

    private getDaily(from: DateTime, to: DateTime): Promise<AxiosResponse<RangeData[]>> {
        const url = `range/daily/` +
            `${from.year}/${from.month}/${from.day}/` +
            `${to.year}/${to.month}/${to.day}.json`;
        return axios.get<RangeData[]>(process.env.VUE_APP_API_PREFIX + url);
    }

    private getMonthly(from: DateTime, to: DateTime): Promise<AxiosResponse<RangeData[]>> {
        const url = `range/monthly/` +
            `${from.year}/${from.month}/` +
            `${to.year}/${to.month}.json`;
        return axios.get<RangeData[]>(process.env.VUE_APP_API_PREFIX + url);
    }

    private toLuxonRange(timePeriod: TimePeriod): any {
        switch (timePeriod) {
            case TimePeriod.Day:
                return {days: 1};
            case TimePeriod.Week:
                return {days: 6};
            case TimePeriod.Month:
                return {months: 1};
            case TimePeriod.Year:
                return {years: 1};
            default:
                return null;
        }
    }

}
