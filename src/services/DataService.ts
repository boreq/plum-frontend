import { Data } from './Data';

export class DataService {

    getHits(data: Data): number {
        let sum = 0;
        for (let uri in data.by_uri) {
            let byUriData = data.by_uri[uri];
            for (let method in byUriData.by_method) {
                let byMethodData = byUriData.by_method[method];
                for (let status in byMethodData.by_status) {
                    let hits = byMethodData.by_status[status];
                    sum += hits;
                }
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

