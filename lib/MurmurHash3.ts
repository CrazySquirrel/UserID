"use strict";
/**
 * Import interface
 */
import IMurmurHash3 from "../interfaces/IMurmurHash3";

let Utils = require("Utils");
/**
 * MurmurHash3
 */
export default class MurmurHash3 implements IMurmurHash3 {
    /**
     * MurmurHash3 related functions
     *
     * Given two 64bit int (as an array of two 32bit int) returns the two
     * added together as a 64bit int (as an array of two 32bit int).
     * @param m
     * @param n
     * @return {number[]}
     */
    public static x64Add(m, n) {
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        let o = [0, 0, 0, 0];
        o[3] += m[3] + n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] + n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] + n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += m[0] + n[0];
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }

    /**
     * Given two 64bit int (as an array of two 32bit int) returns the two
     * multiplied together as a 64bit int (as an array of two 32bit int).
     * @param m
     * @param n
     * @return {number[]}
     */
    public static x64Multiply(m, n) {
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        let o = [0, 0, 0, 0];
        o[3] += m[3] * n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] * n[3];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[2] += m[3] * n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] * n[3];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[2] * n[2];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[3] * n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }

    /**
     * Given a 64bit int (as an array of two 32bit int) and an int
     * representing a number of bit positions, returns the 64bit int (as an
     * array of two 32bit int) rotated left by that number of positions.
     * @param m
     * @param n
     * @return {Array<number>}
     */
    public static x64Rotated(m, n): Array<number> {
        n %= 64;
        if (n === 32) {
            return [m[1], m[0]];
        } else if (n < 32) {
            return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
        } else {
            n -= 32;
            return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
        }
    }

    /**
     * Given a 64bit int (as an array of two 32bit int) and an int
     * representing a number of bit positions, returns the 64bit int (as an
     * array of two 32bit int) shifted left by that number of positions.
     * @param m
     * @param n
     * @return {Array<number>}
     */
    public static x64LeftShift(m, n): Array<number> {
        n %= 64;
        if (n === 0) {
            return m;
        } else if (n < 32) {
            return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
        } else {
            return [m[1] << (n - 32), 0];
        }
    }

    /**
     * Given two 64bit int (as an array of two 32bit int) returns the two
     * xor together as a 64bit int (as an array of two 32bit int).
     * @param m
     * @param n
     * @return {Array<number>}
     */
    public static x64Xor(m, n): Array<number> {
        return [m[0] ^ n[0], m[1] ^ n[1]];
    }

    /**
     * Given a block, returns murmurHash3's final x64 mix of that block.
     * (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
     * only place where we need to right shift 64bit int.)
     * @param h
     * @return {Array<number>}
     */
    public static x64mix(h): Array<number> {
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
        h = this.x64Xor(h, [0, h[0] >>> 1]);
        return h;
    }

    /**
     * Given a string and an optional seed as an int, returns a 128 bit
     * hash using the x64 flavor of MurmurHash3, as an unsigned hex.
     * @param key
     * @param seed
     * @return {string}
     */
    public static x64hash128(key, seed) {
        key = key || "";
        seed = seed || 0;

        let i;
        let remainder = key.length % 16;
        let bytes = key.length - remainder;
        let h1 = [0, seed];
        let h2 = [0, seed];
        let k1 = [0, 0];
        let k2 = [0, 0];
        let c1 = [0x87c37b91, 0x114253d5];
        let c2 = [0x4cf5ad43, 0x2745937f];

        for (i = 0; i < bytes; i = i + 16) {
            k1 = [
                ((key.charCodeAt(i + 4) & 0xff)) |
                ((key.charCodeAt(i + 5) & 0xff) << 8) |
                ((key.charCodeAt(i + 6) & 0xff) << 16) |
                ((key.charCodeAt(i + 7) & 0xff) << 24),

                ((key.charCodeAt(i) & 0xff)) |
                ((key.charCodeAt(i + 1) & 0xff) << 8) |
                ((key.charCodeAt(i + 2) & 0xff) << 16) |
                ((key.charCodeAt(i + 3) & 0xff) << 24),
            ];
            k2 = [
                ((key.charCodeAt(i + 12) & 0xff)) |
                ((key.charCodeAt(i + 13) & 0xff) << 8) |
                ((key.charCodeAt(i + 14) & 0xff) << 16) |
                ((key.charCodeAt(i + 15) & 0xff) << 24),

                ((key.charCodeAt(i + 8) & 0xff)) |
                ((key.charCodeAt(i + 9) & 0xff) << 8) |
                ((key.charCodeAt(i + 10) & 0xff) << 16) |
                ((key.charCodeAt(i + 11) & 0xff) << 24),
            ];
            k1 = this.x64Multiply(k1, c1);
            k1 = this.x64Rotated(k1, 31);
            k1 = this.x64Multiply(k1, c2);
            h1 = this.x64Xor(h1, k1);
            h1 = this.x64Rotated(h1, 27);
            h1 = this.x64Add(h1, h2);
            h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
            k2 = this.x64Multiply(k2, c2);
            k2 = this.x64Rotated(k2, 33);
            k2 = this.x64Multiply(k2, c1);
            h2 = this.x64Xor(h2, k2);
            h2 = this.x64Rotated(h2, 31);
            h2 = this.x64Add(h2, h1);
            h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
        }

        k1 = [0, 0];
        k2 = [0, 0];
        switch (remainder) {
            case 15:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
                break;
            case 14:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
                break;
            case 13:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
                break;
            case 12:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
                break;
            case 11:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
                break;
            case 10:
                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
                break;
            case 9:
                k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
                k2 = this.x64Multiply(k2, c2);
                k2 = this.x64Rotated(k2, 33);
                k2 = this.x64Multiply(k2, c1);
                h2 = this.x64Xor(h2, k2);
                break;
            case 8:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
                break;
            case 7:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
                break;
            case 6:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
                break;
            case 5:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
                break;
            case 4:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
                break;
            case 3:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
                break;
            case 2:
                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
                break;
            case 1:
                k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
                k1 = this.x64Multiply(k1, c1);
                k1 = this.x64Rotated(k1, 31);
                k1 = this.x64Multiply(k1, c2);
                h1 = this.x64Xor(h1, k1);
                break;
            default:
        }
        h1 = this.x64Xor(h1, [0, key.length]);
        h2 = this.x64Xor(h2, [0, key.length]);
        h1 = this.x64Add(h1, h2);
        h2 = this.x64Add(h2, h1);
        h1 = this.x64mix(h1);
        h2 = this.x64mix(h2);
        h1 = this.x64Add(h1, h2);
        h2 = this.x64Add(h2, h1);

        let n1: number = (h1[0] >>> 0);
        let n2: number = (h1[1] >>> 0);
        let n3: number = (h2[0] >>> 0);
        let n4: number = (h2[1] >>> 0);

        let s1: string = ("00000000" + n1.toString(16)).slice(-8);
        let s2: string = ("00000000" + n2.toString(16)).slice(-8);
        let s3: string = ("00000000" + n3.toString(16)).slice(-8);
        let s4: string = ("00000000" + n4.toString(16)).slice(-8);

        return (s1 + s2 + s3 + s4);
    }

    /**
     * MurmurHash3 constructor
     */
    constructor() {
        Utils.implementationStaticMethods(this);
    }
}
