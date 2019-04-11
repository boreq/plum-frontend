import { Data } from '@/dto/Data';

export class DataService {

    getHits(data: Data): number {
        let sum = 0;
        if (data.uris) {
            Object.entries(data.uris).forEach(([uri, uriData]) => {
                if (uriData.statuses) {
                    Object.entries(uriData.statuses).forEach(([ status, statusData ]) => {
                        sum += statusData.hits;
                    });
                }
            });
        }
        return sum;
    }

    getVisits(data: Data): number {
        let sum = 0;
        if (data.uris) {
            Object.entries(data.uris).forEach(([uri, uriData]) => {
                sum += uriData.visits;
            });
        }
        return sum;
    }

    getBytesSent(data: Data): number {
        let sum = 0;
        if (data.uris) {
            Object.entries(data.uris).forEach(([uri, uriData]) => {
                sum += uriData.bytes;
            });
        }
        return sum;
    }

}

