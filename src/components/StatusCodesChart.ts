import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Dictionary, RangeData } from '@/dto/Data';
import { ChartColors } from '@/dto/ChartColors';
import { DataService } from '@/services/DataService';
import { TextService } from '@/services/TextService';
import Chart from 'chart.js';
import { GroupingType } from '../dto/GroupingType';

class ChartData {
    label: string;
    statuses: Dictionary<Dictionary<number>>;
}

@Component
export default class StatusCodesChart extends Vue {

    @Prop()
    private data: RangeData[];

    @Prop()
    private groupingType: GroupingType;

    private chart: Chart;

    private dataService = new DataService();
    private textService = new TextService();

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

        const chartData: ChartData[] = this.data.map(rangeData => {
            return {
                label: this.textService.formatDate(rangeData.time, this.groupingType),
                statuses: this.dataService.getStatusMapping(rangeData.data),
            };
        });
        this.drawChart(chartData);
    }

    private drawChart(chartData: ChartData[]): void {
        const statuses = chartData.map(v => this.groupByStatusType(v));
        const labels: string[] = chartData.map(v => v.label);

        if (!this.chart) {
            this.chart = this.createChart();
        }

        this.chart.data.labels.length = 0;
        for (const label of labels) {
            this.chart.data.labels.push(label);
        }

        for (let i = 0; i < this.chart.data.datasets.length; i++) {
            this.chart.data.datasets[i].data.length = 0;
            for (const statusData of statuses) {
                const total = statusData.reduce((acc, [status, hits]) => {
                    return acc + hits;
                }, 0);
                const statusString = this.toStatusString((i + 1).toString());
                const element = statusData.find(v => v[0] === statusString);
                if (element) {
                    this.chart.data.datasets[i].data.push(element[1] / total);
                } else {
                    this.chart.data.datasets[i].data.push(0);
                }
            }
        }

        this.chart.update({duration: 0});
    }

    private groupByStatusType(chartData: ChartData): Array<[string, number]> {
        return Object.entries(chartData.statuses)
            .reduce((acc, [status, uriMap]) => {
                let element = acc.find(([statusString, hits]) => {
                    return this.toStatusString(status) === statusString;
                });
                if (!element) {
                    element = [this.toStatusString(status), 0];
                    acc.push(element);
                }
                element[1] += this.getTotal(uriMap);
                return acc.sort((a, b) => a[0] < b[0] ? -1 : 1);
            }, []);
    }

    private getTotal(uriMap: Dictionary<number>): number {
        return Object.entries(uriMap)
            .reduce((acc, [uri, hits]) => {
                return acc + hits;
            }, 0);
    }

    private toStatusString(status: string): string {
        return status[0] + 'xx';
    }

    private createChart(): Chart {
        return new Chart('status-codes-chart', {
            type: 'bar',
            data: {
                labels: ['a'],
                datasets: [
                    this.createDataset('1xx', ChartColors.Blue, [1]),
                    this.createDataset('2xx', ChartColors.Green, [2]),
                    this.createDataset('3xx', ChartColors.Violet, [3]),
                    this.createDataset('4xx', ChartColors.Orange, [4]),
                    this.createDataset('5xx', ChartColors.Red, [5]),
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
                            min: 0,
                            max: 1,
                            maxTicksLimit: 5,
                            callback: (value, index, values) => {
                                return Math.round(parseFloat(value) * 100) + '%';
                            },
                        },
                        stacked: true,
                    }],
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    mode: 'index',
                    callbacks: {
                        label: (tooltipItem, data) => {
                            const label = data.datasets[tooltipItem.datasetIndex].label;
                            const percent = Math.round(parseFloat(tooltipItem.yLabel) * 100);
                            return `${label}: ${percent}%`;
                        },
                    },
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
            pointBackgroundColor: color,
            borderColor: color,
            borderWidth: 2,
        };
    }
}
