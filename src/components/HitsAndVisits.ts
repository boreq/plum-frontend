import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { RangeData } from '@/dto/Data';
import { ChartColors } from '@/dto/ChartColors';
import { DataService } from '@/services/DataService';
import { DateTime } from 'luxon';
import Chart from 'chart.js';

class ChartData {
    label: string;
    hits: number;
    visits: number;
}

@Component
export default class HitsAndVisits extends Vue {

    @Prop()
    private data: RangeData[];

    private chart: Chart;

    @Watch('data')
    onRangeDataChanged(value: RangeData[], oldValue: RangeData[]) {
        this.redraw();
    }

    mounted(): void {
        this.redraw();
    }

    private redraw(): void {
        if (!this.data) {
            return;
        }

        const dataService = new DataService();

        const chartData: ChartData[] = [];
        for (const rangeData of this.data) {
            chartData.push({
                label: this.formatDate(rangeData.time),
                hits: dataService.getHits(rangeData.data),
                visits: dataService.getVisits(rangeData.data),
            });
        }

        this.drawChart(chartData);
    }

    private formatDate(date: string): string {
        return DateTime.fromISO(date).toFormat('yyyy-LL-dd HH:mm ZZ');
    }

    private drawChart(chartData: ChartData[]): void {
        const visits: number[] = chartData.map(v => v.visits);
        const hits: number[] = chartData.map(v => v.hits);
        const labels: string[] = chartData.map(v => v.label);

        if (!this.chart) {
            this.chart = this.createChart();
        }

        this.chart.data.labels.length = 0;
        for (const label of labels) {
            this.chart.data.labels.push(label);
        }

        this.chart.data.datasets[0].data.length = 0;
        for (const visit of visits) {
            this.chart.data.datasets[0].data.push(visit);
        }

        this.chart.data.datasets[1].data.length = 0;
        for (const hit of hits) {
            this.chart.data.datasets[1].data.push(hit);
        }

        this.chart.update({duration: 0});
    }

    private createChart(): Chart {
        return new Chart('chart', {
            type: 'bar',
            data: {
                labels: ['a'],
                datasets: [
                    this.createDataset('Visits', ChartColors.Primary, [1]),
                    this.createDataset('Hits', ChartColors.Secondary, [2]),
                ],
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false,
                        },
                        gridLines: {
                            display: false,
                        },
                        stacked: true,
                        barPercentage: 1,
                        categoryPercentage: 0.9,
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            maxTicksLimit: 5,
                            callback: (value, index, values) => {
                                if (value >= 10000) {
                                    return value / 1000 + 'k';
                                }
                                return value;
                            },
                        },
                        stacked: false,
                    }],
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    mode: 'index',
                },
                onClick: evt => {
                    const element = this.chart.getElementAtEvent(evt) as any[];
                    const index = element && element.length > 0 ? element[0]._index : null;
                    this.$emit('select-data', index);
                },
            },
        });
    }

    private createDataset(label: string, color: string, data: number[]) {
        return {
            label: label,
            data: data,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
        };
    }
}
