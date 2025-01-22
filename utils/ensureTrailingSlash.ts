export function ensureTrailingSlash(str: string): string {
    return str.replace(/\/+$/, '') + '/';
}
