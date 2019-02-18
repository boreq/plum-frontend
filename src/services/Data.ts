import { TimePoint } from './TimePoint'

export class RangeData {
    time: TimePoint;
    data: Data;
}

export class Data {
    by_referer: { [key: string]: ByRefererData };
    by_uri: { [key: string]: ByUriData };
}

export class ByRefererData {
    visits: number;
    hits: number;
}

export class ByUriData {
    visits: number;
    by_method: { [key: string]: ByMethodData };
}

export class ByMethodData {
    by_status:{ [key: string]: number };
}
