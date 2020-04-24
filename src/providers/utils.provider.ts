import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

export class UtilsService {
    /**
     * convert entity to dto class instance
     * @param {{new(entity: E, options: any): T}} model
     * @param {E[] | E} entity
     * @param options
     * @returns {T[] | T}
     */
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E,
        options?: any,
    ): T;
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E[],
        options?: any,
    ): T[];
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E | E[],
        options?: any,
    ): T | T[] {
        if (_.isArray(entity)) {
            return entity.map((u) => new model(u, options));
        }

        return new model(entity, options);
    }

    /**
     * generate hash from password or string
     * @param {string} password
     * @returns {string}
     */
    static generateHash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * validate text with hash
     * @param {string} password
     * @param {string} hash
     * @returns {Promise<boolean>}
     */
    static validateHash(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash || '');
    }

    /**
     * generate random integer
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    static generateRandomInteger(min: number, max: number): number {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }

    /**
     * generate random string
     * @param {number} length
     * @returns {string}
     */
    static generateRandomString(length: number): string {
        return Math.random()
            .toString(36)
            .replace(/[^a-zA-Z0-9]+/g, '')
            .toUpperCase()
            .substr(0, length);
    }

    /**
     * comparison which number is greater
     * @param {number | string} firstNumber
     * @param {number | string} secondNumber
     * @returns {number | string}
     */
    static compareNumbers(
        firstNumber: number | string,
        secondNumber: number | string,
    ): number | string | any {
        if (firstNumber > secondNumber) {
            return firstNumber;
        }
        return secondNumber;
    }
}
