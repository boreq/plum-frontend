import filesize from 'filesize';
import HttpStatusCodes from 'http-status-codes';

export class TextService {

    humanizeNumber(n: number): string {
        if (n >= 100000) {
            return (n / 1000).toFixed(0) + 'k';
        }
        if (n >= 10000) {
            return (n / 1000).toFixed(1) + 'k';
        }
        return n.toString();
    }

    humanizeBytes(n: number, round = 2): string {
        const options = {
            base: 10,
            round: round,
        };
        return filesize(n, options);
    }

    getHttpStatusText(status: string): string {
        try {
            const statusText = HttpStatusCodes.getStatusText(Number(status));
            return `${status} ${statusText}`;
        } catch (e) {
            return status;
        }
    }

}
