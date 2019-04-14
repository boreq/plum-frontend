import { Component, Prop, Vue } from 'vue-property-decorator';
import { TableHeader, TableRow } from '@/dto/Table';

@Component
export default class Table extends Vue {

    @Prop()
    header: TableHeader;

    @Prop()
    rows: TableRow[];

    @Prop({default: 10})
    perPage: number;

    page = 0;

    private focusedRow: TableRow = null;

    get dataPresent(): boolean {
        return this.rows && this.rows.length > 0;
    }

    get limitedRows(): TableRow[] {
        if (this.page > this.allPages) {
            this.page = 0;
        }
        const start = this.page * this.perPage;
        if (this.focusedRow) {
            return this.focusedRowWithChildren.slice(0, this.perPage);
        } else {
            return this.rows.slice(start, start + this.perPage);
        }
    }

    get focusedRowWithChildren(): TableRow[] {
        const acc = [this.focusedRow];
        if (this.focusedRow.children) {
            this.focusedRow.children.forEach(childRow => acc.push(childRow));
        }
        return acc;
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
        const row = this.limitedRows[rowIndex];
        if (row.fraction) {
            const percentage = Math.round(row.fraction * 100);
            return `width: ${percentage}%;`;
        }
        return 'display: none;';
    }

    getRowStyle(rowIndex: number): string {
        const row = this.limitedRows[rowIndex];
        if (row.children && row.children.length > 0) {
            return 'cursor: pointer';
        }
        return '';
    }


    prevPage(): void {
        if (this.hasPrevPage) {
            this.page -= 1;
        }
    }

    nextPage(): void {
        if (this.hasNextPage) {
            this.page += 1;
        }
    }

    toggleRow(row: TableRow): void {
        if (this.focusedRow) {
            this.focusedRow = null;
        } else {
            this.focusedRow = row;
        }
    }

    get hasNextPage() {
        return !this.focusedRow && this.page < this.allPages;
    }

    get hasPrevPage() {
        return !this.focusedRow && this.page > 0;
    }

    get allPages(): number {
        if (!this.focusedRow && this.rows) {
            return Math.floor(this.rows.length / this.perPage);
        }
        return 0;
    }

}
