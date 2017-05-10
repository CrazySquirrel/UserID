/**
 * Import interface
 */
import IMurmurHash3 from "../interfaces/IMurmurHash3";
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
    static x64Add(m: any, n: any): number[];
    /**
     * Given two 64bit int (as an array of two 32bit int) returns the two
     * multiplied together as a 64bit int (as an array of two 32bit int).
     * @param m
     * @param n
     * @return {number[]}
     */
    static x64Multiply(m: any, n: any): number[];
    /**
     * Given a 64bit int (as an array of two 32bit int) and an int
     * representing a number of bit positions, returns the 64bit int (as an
     * array of two 32bit int) rotated left by that number of positions.
     * @param m
     * @param n
     * @return {Array<number>}
     */
    static x64Rotated(m: any, n: any): number[];
    /**
     * Given a 64bit int (as an array of two 32bit int) and an int
     * representing a number of bit positions, returns the 64bit int (as an
     * array of two 32bit int) shifted left by that number of positions.
     * @param m
     * @param n
     * @return {Array<number>}
     */
    static x64LeftShift(m: any, n: any): number[];
    /**
     * Given two 64bit int (as an array of two 32bit int) returns the two
     * xor together as a 64bit int (as an array of two 32bit int).
     * @param m
     * @param n
     * @return {Array<number>}
     */
    static x64Xor(m: any, n: any): number[];
    /**
     * Given a block, returns murmurHash3's final x64 mix of that block.
     * (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
     * only place where we need to right shift 64bit int.)
     * @param h
     * @return {Array<number>}
     */
    static x64mix(h: any): number[];
    /**
     * Given a string and an optional seed as an int, returns a 128 bit
     * hash using the x64 flavor of MurmurHash3, as an unsigned hex.
     * @param key
     * @param seed
     * @return {string}
     */
    static x64hash128(key: any, seed: any): string;
    /**
     * MurmurHash3 constructor
     */
    constructor();
}
