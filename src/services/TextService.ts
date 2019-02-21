export class TextService {

    humanizeNumber(n: number): string {
        if (n >= 10000) {
            return (n / 1000).toFixed(1) + 'k';
        }
        return n.toString();
    }
}
