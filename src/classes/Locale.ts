import ErrorHandler from './ErrorHandler';
import { ErrorType } from '../types';
export class Locale {
    static strings = {};

    static async setLocale(locale: string): Promise<void | ErrorType> {
        fetch(`http://localhost:8080/lang/${locale}.json`)
        .then((response) => response.json())
        .then((data) => {
            this.strings = data;
        })
        .catch(() => {
            return ErrorHandler.NOT_FOUND;
        });
    };

    static getLocale() {
        return this.strings;
    }
}