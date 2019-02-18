import { Component, Vue } from 'vue-property-decorator';
import { TimePeriod } from '@/services/TimePeriod';
import { ApiService } from '@/services/ApiService';
import { RangeData } from '@/services/Data';
import HitsAndVisits from '@/components/HitsAndVisits.vue';

@Component({
  components: {
      HitsAndVisits,
  },
})
export default class Dashboard extends Vue {

    TimePeriod = TimePeriod;

    selectedTimePeriod: TimePeriod = TimePeriod.Day;
    data: RangeData[] = [];

    created(): void {
        this.reloadData();
    }

    selectTimePeriod(timePeriod: TimePeriod): void {
        this.selectedTimePeriod = timePeriod;
        this.reloadData();
    }

    private reloadData(): void {
        const apiService = new ApiService();
        apiService.getTimeRange(this.selectedTimePeriod)
            .then(response => {
                console.log(response);
                this.data = response.data;
            });
    }
}
