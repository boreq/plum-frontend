import { Component, Prop, Vue } from 'vue-property-decorator';
import { RangeData } from '@/dto/Data';
import { TableHeader, TableRow, Align } from '@/dto/Table';
import { TextService } from '@/services/TextService';
import Table from '@/components/Table.vue';

class BytesSentData {
    uri: string;
    bytes: number;
}

@Component({
    components: {
        Table,
    },
})
export default class BytesSent extends Vue {

    @Prop()
    private data: RangeData[];

    private textService = new TextService();

    get header(): TableHeader {
        return {
            columns: [
                {
                    label: 'Resource',
                    width: null,
                    align: Align.Left,
                },
                {
                    label: 'Bytes sent',
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
        const rows: BytesSentData[] = [];
        for (const rangeData of this.data) {
            if (rangeData.data.uris) {
                Object.entries(rangeData.data.uris).forEach(([uri, uriData]) => {
                    let row = rows.find(v => v.uri === uri);
                    if (!row) {
                        row = {
                            uri: uri,
                            bytes: 0,
                        };
                        rows.push(row);
                    }
                    row.bytes += uriData.bytes;
                });
            }
        }
        return this.toTableRows(rows);
    }

    private toTableRows(bytesSentData: BytesSentData[]): TableRow[] {
        const total: number = bytesSentData.reduce((acc, v) => acc + v.bytes, 0);
        return bytesSentData
            .sort((a, b) => a.bytes < b.bytes ? 1 : -1)
            .map(v => {
                return {
                    data: [
                        v.uri,
                        this.textService.humanizeBytes(v.bytes),
                    ],
                    fraction: v.bytes / total,
                };
            });
    }

}
