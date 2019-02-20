import { Component, Prop, Vue } from 'vue-property-decorator';
import { RangeData } from '@/services/Data';
import { DataService } from '@/services/DataService';

@Component
export default class Summary extends Vue {

    @Prop()
    private data: RangeData[];

    private dataService = new DataService();

    get hits(): string {
        let sum = 0;
        for (const rangeData of this.data) {
            sum += this.dataService.getHits(rangeData.data);
        }
        return this.shortenIfNeeded(sum);
    }

    get visits(): string {
        let sum = 0;
        for (const rangeData of this.data) {
            sum += this.dataService.getVisits(rangeData.data);
        }
        return this.shortenIfNeeded(sum);
    }

    private shortenIfNeeded(n: number): string {
        if (n >= 10000) {
            return Math.round(n / 1000) + 'k';
        }
        return n.toString();
    }


}
