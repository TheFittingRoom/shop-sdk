import Api from './Api';
import { ErrorType, ProfileResponse } from '../types';
import ErrorHandler from './ErrorHandler';

export const checkAvatar = async (): Promise<ProfileResponse | ErrorType> => {
    try {
        const data = await Api.get("/profile");

        return data;
    } catch (error) {
        return ErrorHandler.NOT_FOUND;
    }
}
