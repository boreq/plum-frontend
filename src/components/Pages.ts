import { Component, Prop, Vue } from 'vue-property-decorator';
import { RangeData } from '@/services/Data';
import { TableHeader, TableRow, Align } from '@/services/Table';
import { UriService } from '@/services/UriService';
import Table from '@/components/Table.vue';

class UriData {
    uri: string;
    visits: number;
    hits: number;
}

@Component({
    components: {
        Table,
    },
})
export default class Pages extends Vue {

    @Prop()
    private data: RangeData[];

    private uriService = new UriService();

    get header(): TableHeader {
        return {
            columns: [
                {
                    label: 'Page',
                    width: null,
                    align: Align.Left,
                },
                {
                    label: 'Hits',
                    width: '60px',
                    align: Align.Right,
                },
                {
                    label: 'Visits',
                    width: '60px',
                    align: Align.Right,
                },
            ],
        };
    }

    get rows(): TableRow[] {
        if (!this.data) {
            return [];
        }
        const rows: UriData[] = [];
        for (const element of this.data) {
            if (element.data.uris) {
                for (const uriData of element.data.uris) {
                    const uri = this.uriService.normalize(uriData.uri);
                    let row = rows.find(v => v.uri === uri);
                    if (!row) {
                        row = {
                            uri: uri,
                            visits: 0,
                            hits: 0,
                        };
                        rows.push(row);
                    }
                    row.visits += uriData.visits;
                }
            }
        }
        return this.toTableRows(rows);
    }

    private toTableRows(uriData: UriData[]): TableRow[] {
        const total: number = uriData.reduce((acc, v) => acc + v.visits, 0);
        return uriData
            .sort((a, b) => a.visits < b.visits ? 1 : -1)
            .filter(v => !this.uriService.isStaticResource(v.uri))
            .map(v => {
                return {
                    data: [
                        v.uri,
                        v.hits.toString(),
                        v.visits.toString(),
                    ],
                    fraction: v.visits / total,
                };
            });
    }

}
