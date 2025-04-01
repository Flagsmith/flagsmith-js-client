export function ensureTrailingSlash(str: string): string {
    return str.endsWith('/') ? str : str + '/';
}
