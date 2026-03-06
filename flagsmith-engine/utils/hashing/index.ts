import { BinaryLike, createHash } from '../crypto-polyfill.js';

const md5 = (data: BinaryLike) => createHash('md5').update(data).digest('hex');

const makeRepeated = (arr: Array<any>, repeats: number) =>
    Array.from({ length: repeats }, () => arr).flat();

// https://stackoverflow.com/questions/12532871/how-to-convert-a-very-large-hex-number-to-decimal-in-javascript
/**
 * Given a list of object ids, get a floating point number between 0 and 1 based on
 * the hash of those ids. This should give the same value every time for any list of ids.
 *
 * @param  {Array<any>} objectIds list of object ids to calculate the has for
 * @param  {} iterations=1 num times to include each id in the generated string to hash
 * @returns number number between 0 (inclusive) and 100 (exclusive)
 */
export function getHashedPercentageForObjIds(objectIds: Array<any>, iterations = 1): number {
    let toHash = makeRepeated(objectIds, iterations).join(',');
    const hashedValue = md5(toHash);

    // Convert hex hash to number without BigInt (ES5 compatible)
    // Take first 13 hex chars (52 bits) to stay within safe integer range
    const hexSubstring = hashedValue.substring(0, 13);
    const hashedInt = parseInt(hexSubstring, 16);
    const value = ((hashedInt % 9999) / 9998.0) * 100;

    // we ignore this for it's nearly impossible use case to catch
    /* istanbul ignore next */
    if (value === 100) {
        /* istanbul ignore next */
        return getHashedPercentageForObjIds(objectIds, iterations + 1);
    }

    return value;
}
