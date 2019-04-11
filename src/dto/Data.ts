interface Map<T> {
    [key: string]: T;
}

export class RangeData {
    time: string;
    data: Data;
}

export class Data {
    referers: Map<RefererData>;
    uris: Map<UriData>;
}

export class RefererData {
    visits: number;
    hits: number;
}

export class UriData {
    visits: number;
    bytes: number;
    statuses: Map<StatusData>;
}

export class StatusData {
    hits: number;
}
