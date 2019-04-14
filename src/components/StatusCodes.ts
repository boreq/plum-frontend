import { Component, Prop, Vue } from 'vue-property-decorator';
import { Dictionary, RangeData } from '@/dto/Data';
import { Align, TableHeader, TableRow } from '@/dto/Table';
import { DataService } from '@/services/DataService';
import Table from '@/components/Table.vue';

class StatusCodesData {
    status: string;
    uris: Dictionary<number>;
}

@Component({
    components: {
        Table,
    },
})
export default class StatusCodes extends Vue {

    @Prop()
    private data: RangeData[];

    private dataService = new DataService();

    get header(): TableHeader {
        return {
            columns: [
                {
                    label: 'Status',
                    width: null,
                    align: Align.Left,
                },
                {
                    label: 'Hits',
                    width: '100px',
                    align: Align.Right,
                },
            ],
        };
    }

    get rows(): TableRow[] {
        if (!this.data) {
            return [];
        }
        const rows: StatusCodesData[] = [];
        for (const rangeData of this.data) {
            if (rangeData.data) {
                Object.entries(this.dataService.getStatusMapping(rangeData.data))
                    .forEach(([status, uriMap]) => {
                        let row = rows.find(v => v.status === status);
                        if (!row) {
                            row = {
                                status: status,
                                uris: {},
                            };
                            rows.push(row);
                        }
                        Object.entries(uriMap).forEach(([uri, hits]) => {
                            row.uris[uri] = (row.uris[uri] || 0) + hits;
                        });
                    });
            }
        }
        return this.toTableRows(rows);
    }

    private toTableRows(statusCodesData: StatusCodesData[]): TableRow[] {
        const total: number = statusCodesData.reduce((acc, v) => acc + this.getTotal(v), 0);
        return statusCodesData
            .sort((a, b) => a.status > b.status ? 1 : -1)
            .reduce((acc, v) => {
                const statusTotal = this.getTotal(v);
                acc.push({
                    data: [
                        v.status,
                        statusTotal.toString(),
                    ],
                    fraction: statusTotal / total,
                    children: this.getChildren(v).splice(0, 10),
                });
                return acc;
            }, []);
    }

    private getTotal(statusCodesData: StatusCodesData): number {
        return Object.entries(statusCodesData.uris)
            .reduce((acc, [uri, hits]) => {
                return acc + hits;
            }, 0);
    }

    private getChildren(v: StatusCodesData): TableRow[] {
        return Object.entries(v.uris)
            .map(([uri, hits]) => {
                return {
                    data: [
                        uri,
                        hits.toString(),
                    ],
                    fraction: null,
                };
            })
            .sort((a, b) => Number(a.data[1]) < Number(b.data[1]) ? 1 : -1);
    }

}
