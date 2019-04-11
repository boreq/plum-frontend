import { Component, Vue } from 'vue-property-decorator';
import { TimePeriod } from '@/dto/TimePeriod';
import { RangeData } from '@/dto/Data';
import { ApiService } from '@/services/ApiService';
import HitsAndVisits from '@/components/HitsAndVisits.vue';
import Summary from '@/components/Summary.vue';
import Pages from '@/components/Pages.vue';
import Referers from '@/components/Referers.vue';
import BytesSent from '@/components/BytesSent.vue';
import BytesSentChart from '@/components/BytesSentChart.vue';

@Component({
    components: {
        HitsAndVisits,
        Summary,
        Pages,
        Referers,
        BytesSent,
        BytesSentChart,
    },
})
export default class Dashboard extends Vue {

    TimePeriod = TimePeriod;

    selectedTimePeriod: TimePeriod = TimePeriod.Day;
    data: RangeData[] = [];
    updating: boolean = false;
    updatingLatest: boolean = false;

    private apiService = new ApiService();
    private timeoutID: number;

    created(): void {
        this.reloadData();
    }

    beforeDestroy(): void {
        this.cancelReload();
    }

    selectTimePeriod(timePeriod: TimePeriod): void {
        this.selectedTimePeriod = timePeriod;
        if (!this.updating) {
            this.reloadData();
        }
    }

    private reloadData(): void {
        this.updating = true;
        const timePeriod = this.selectedTimePeriod;
        this.apiService.getTimeRange(timePeriod)
            .then(response => {
                this.updating = false;
                this.data = response.data;
                this.scheduleReload(timePeriod);
            });
    }

    private scheduleReload(timePeriod: TimePeriod): void {
        this.cancelReload();
        this.timeoutID = setTimeout(() => this.reloadLatestData(timePeriod), 5000);
    }

    private cancelReload(): void {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
    }

    private reloadLatestData(timePeriod: TimePeriod): void {
        this.updatingLatest = true;
        this.apiService.getTimePoint(timePeriod)
            .then(response => {
                this.updatingLatest = false;
                if (timePeriod === this.selectedTimePeriod) {
                    this.updateLatestData(response.data);
                    this.scheduleReload(timePeriod);
                }
            })
            .catch(error => {
                this.updatingLatest = false;
                this.scheduleReload(timePeriod);
            });
    }

    private updateLatestData(rangeData: RangeData): void {
        if (this.data.length > 0) {
            const data = Array.from(this.data);
            const lastIndex = data.length - 1;
            if (rangeData.time === data[lastIndex].time) {
                data[lastIndex] = rangeData;
            } else {
                data.push(rangeData);
                data.shift();
            }
            this.data = data;
        }
    }

}
