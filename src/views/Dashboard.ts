import { Component, Vue } from 'vue-property-decorator';
import { TimePeriod } from '@/services/TimePeriod';
import { ApiService } from '@/services/ApiService';
import { RangeData } from '@/services/Data';
import HitsAndVisits from '@/components/HitsAndVisits.vue';
import Summary from '@/components/Summary.vue';
import Pages from '@/components/Pages.vue';

@Component({
    components: {
        HitsAndVisits,
        Summary,
        Pages,
    },
})
export default class Dashboard extends Vue {

    TimePeriod = TimePeriod;

    selectedTimePeriod: TimePeriod = TimePeriod.Day;
    data: RangeData[] = [];
    updating: boolean = false;

    private apiService = new ApiService();

    created(): void {
        this.reloadData();
    }

    selectTimePeriod(timePeriod: TimePeriod): void {
        this.selectedTimePeriod = timePeriod;
        this.reloadData();
    }

    private reloadData(): void {
        this.updating = true;
        this.apiService.getTimeRange(this.selectedTimePeriod)
            .then(response => {
                this.updating = false;
                this.data = response.data;
            });
    }

}
