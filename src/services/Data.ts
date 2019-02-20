export class RangeData {
    time: Date;
    data: Data;
}

export class Data {
    referers: ByRefererData[];
    uris: ByUriData[];
}

export class ByRefererData {
    referer: string;
    visits: number;
    hits: number;
}

export class ByUriData {
    uri: string;
    visits: number;
    statuses: ByStatusData[];
}

export class ByStatusData {
    status: string;
    hits: number;
}
