export class UriService {

    private readonly staticResourceExtensions: string[] = [
        '.css',
        '.js',

        '.ico',
        '.png',
        '.jpg',
        '.jpeg',

        '.webm',

        '.xml',
        '.rss',
        '.txt',
        '.abe',
    ];

    isStaticResource(uri: string): boolean {
        for (const staticResourceExtension of this.staticResourceExtensions) {
            if (uri.endsWith(staticResourceExtension)) {
                return true;
            }
        }
        return false;
    }

}
