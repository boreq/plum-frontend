<template>
  <div>
      <canvas id="chart"></canvas>
  </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
    import { TimePeriod } from '@/services/TimePeriod';
    import { timePointAsString } from '@/services/TimePoint';
    import { ApiResource } from '@/services/ApiResource';
    import { RangeData } from '@/services/Data';
    import { DataService } from '@/services/DataService';
    import { ChartColors } from '@/services/ChartColors';
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
            const dataService = new DataService();

            const chartData: ChartData[] = [];
            for (const rangeData of this.data) {
                chartData.push({
                    label: timePointAsString(rangeData.time),
                    hits: dataService.getHits(rangeData.data),
                    visits: dataService.getVisits(rangeData.data),
                });
            }

            this.drawChart(chartData);
        }

        private drawChart(chartData: ChartData[]): void {
            const visits: number[] = chartData.map(v => v.visits);
            const hits: number[] = chartData.map(v => v.hits);
            const labels: string[] = chartData.map(v => v.label);

            if (!this.chart) {
                this.chart = this.createChart();
            }

            this.chart.data.labels.length = 0
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

            this.chart.update();
        }

        private createChart(): Chart {
            return new Chart("chart", {
                type: 'bar',
                data: {
                    labels: ['a'],
                    datasets: [
                        this.createDataset('Visits', ChartColors.Primary, [1]),
                        this.createDataset('Hits', ChartColors.Secondary, [2]),
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            ticks: {
                                display: false
                            },
                            gridLines: {
                                display: false
                            },
                            stacked: true
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
                                }
                            },
                            stacked: false
                        }]
                    },
                    legend: {
                        display: false,
                    },
                    tooltips : {
                        mode : 'index'
                    },
                }
            });
        }

        private createDataset(label: string, color: string, data: number[]) {
            return {
                label: label,
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            }
        }
    }
</script>

<style scoped lang="scss">
    #chart {
        height: 200px;
    }
</style>
