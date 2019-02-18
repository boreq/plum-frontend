export class TimePoint {
    year: number;
    month: number;
    day: number;
    hour: number;
}

export function timePointAsString(timePoint: TimePoint): string {
    const month = padWithZero(timePoint.month);
    const day = padWithZero(timePoint.day);
    const hour = padWithZero(timePoint.hour);
    return `${timePoint.year}-${month}-${day} ${hour}:00`
}

function padWithZero(num: number): string {
    let s = num + "";
    if (s.length < 2) {
        s = "0" + s;
    }
    return s;
}

