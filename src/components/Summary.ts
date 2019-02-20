import { Component, Prop, Vue } from 'vue-property-decorator';
import { RangeData } from '@/services/Data';
import { DataService } from '@/services/DataService';
import Chart from 'chart.js';

@Component
export default class Summary extends Vue {

    @Prop()
    private data: RangeData[];

    private dataService = new DataService();

    get hits(): number {
        let sum = 0;
        for (const rangeData of this.data) {
            sum += this.dataService.getHits(rangeData.data);
        }
        return this.shortenIfNeeded(sum);
    }

    get visits(): number {
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
        return n;
    }


}
