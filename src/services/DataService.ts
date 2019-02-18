import { Data } from './Data';

export class DataService {

    getHits(data: Data): number {
        let sum = 0;
        for (let uri in data.by_uri) {
            let byUriData = data.by_uri[uri];
            for (let status in byUriData.by_status) {
                let hits = byUriData.by_status[status];
                sum += hits;
            }
        }
        return sum;
    }

    getVisits(data: Data): number {
        let sum = 0;
        for (let uri in data.by_uri) {
            let byUriData = data.by_uri[uri];
            sum += byUriData.visits;
        }
        return sum;
    }

}

