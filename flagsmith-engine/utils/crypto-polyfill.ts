/**
 * Isomorphic crypto utilities for browser and Node.js environments
 * Replaces node:crypto with browser-compatible alternatives
 */

import { MD5 } from 'crypto-js';

/**
 * Generate a random UUID v4
 * Works in both browser and Node.js environments
 */
export function randomUUID(): string {
    // Check if native crypto.randomUUID is available (Node 16.7+, modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback: Manual UUID v4 generation using Math.random()
    // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Create a hash object compatible with node:crypto createHash
 * Uses crypto-js for MD5 hashing
 */
export function createHash(algorithm: string) {
    if (algorithm !== 'md5') {
        throw new Error(`Unsupported hash algorithm: ${algorithm}. Only MD5 is supported.`);
    }

    let data = '';

    return {
        update(input: string | Buffer): any {
            data += input.toString();
            return this;
        },
        digest(encoding: string): string {
            if (encoding !== 'hex') {
                throw new Error(`Unsupported encoding: ${encoding}. Only 'hex' is supported.`);
            }
            return MD5(data).toString();
        },
    };
}

/**
 * Type alias for compatibility with node:crypto BinaryLike
 */
export type BinaryLike = string | Buffer;
