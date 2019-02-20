import { Data } from './Data';

export class DataService {

    getHits(data: Data): number {
        let sum = 0;
        if (data.uris) {
            for (const uriData of data.uris) {
                if (uriData.statuses) {
                    for (const statusData of uriData.statuses) {
                        sum += statusData.hits;
                    }
                }
            }
        }
        return sum;
    }

    getVisits(data: Data): number {
        let sum = 0;
        if (data.uris) {
            for (const uriData of data.uris) {
                sum += uriData.visits;
            }
        }
        return sum;
    }

}

