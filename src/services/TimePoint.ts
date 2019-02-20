export class MonthPoint {
    year: number;
    month: number;
}

export class DayPoint extends MonthPoint {
    day: number;
}

export class HourPoint extends DayPoint {
    hour: number;
}

export function hourPointAsString(hourPoint: HourPoint): string {
    const month = padWithZero(hourPoint.month);
    const day = padWithZero(hourPoint.day);
    const hour = padWithZero(hourPoint.hour);
    return `${hourPoint.year}-${month}-${day} ${hour}:00`
}

export function padWithZero(num: number): string {
    let s = num + "";
    if (s.length < 2) {
        s = "0" + s;
    }
    return s;
}

