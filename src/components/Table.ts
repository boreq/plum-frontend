import { Component, Prop, Vue } from 'vue-property-decorator';
import { TableHeader, TableRow } from '@/dto/Table';

@Component
export default class Table extends Vue {

    @Prop()
    header: TableHeader;

    @Prop()
    rows: TableRow[];

    @Prop({ default: 10 })
    limit: number;

    get dataPresent(): boolean {
        return this.rows && this.rows.length > 0;
    }

    get limitedRows(): TableRow[] {
        return this.rows.slice(0, this.limit);
    }

    getColumnStyle(columnIndex: number): string {
        const column = this.header.columns[columnIndex];
        const styles: string[] = [];

        if (column.width) {
            styles.push(`width: ${column.width}`);
        } else {
            styles.push('flex: 1');
        }

        if (column.align) {
            styles.push(`text-align: ${column.align}`);
        }

        return styles.join(';');
    }

    getBackgroundStyle(rowIndex: number): string {
        const row = this.rows[rowIndex];
        if (row.fraction) {
            const percentage = Math.round(row.fraction * 100);
            return `width: ${percentage}%;`;
        }
        return 'display: none;';
    }

}
