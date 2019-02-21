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

    normalize(uri: string): string {
        uri = uri.split('?')[0];
        // Do not remove the slash if the uri is simply equal to '/'.
        if (uri.length > 1) {
            return this.trimRight(uri, '/');
        }
        return uri;
    }

    // This is what happens when a language doesn't have a standard library.
    private trimRight(s: string, cutset: string): string {
        while (s && cutset.indexOf(s[s.length - 1]) >= 0) {
            s = s.substring(0, s.length - 1);
        }
        return s;
    }

}
