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
import StatusCodesChart from '@/components/StatusCodesChart.vue';
import StatusCodes from '@/components/StatusCodes.vue';


@Component({
    components: {
        HitsAndVisits,
        Summary,
        Pages,
        Referers,
        BytesSent,
        BytesSentChart,
        StatusCodesChart,
        StatusCodes,
    },
})
export default class Dashboard extends Vue {

    TimePeriod = TimePeriod;

    selectedTimePeriod: TimePeriod = TimePeriod.Day;
    updating: boolean = false;
    updatingLatest: boolean = false;

    data: RangeData[] = [];
    rangeData: RangeData[] = [];
    selectedRangeData: RangeData;

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

    onSelectData(index: number): void {
        if (index && index >= 0 && index < this.rangeData.length) {
            this.selectedRangeData = this.rangeData[index];
        } else {
            this.selectedRangeData = null;
        }
        this.updateSelectedData();
    }

    private reloadData(): void {
        this.updating = true;
        const timePeriod = this.selectedTimePeriod;
        this.apiService.getTimeRange(timePeriod)
            .then(response => {
                this.updating = false;
                this.rangeData = response.data;
                this.updateSelectedData();
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
        if (this.rangeData.length > 0) {
            const data = Array.from(this.rangeData);
            const lastIndex = data.length - 1;
            if (rangeData.time === data[lastIndex].time) {
                data[lastIndex] = rangeData;
            } else {
                data.push(rangeData);
                data.shift();
            }
            this.rangeData = data;
            this.updateSelectedData();
        }
    }

    private updateSelectedData(): void {
        if (this.selectedRangeData) {
            this.data = [this.selectedRangeData];
        } else {
            this.data = this.rangeData;
        }
    }

}
