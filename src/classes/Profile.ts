import Api from './Api';
import { ErrorType, ProfileResponse } from '../types';
import ErrorHandler from './ErrorHandler';

export const getProfile = async (): Promise<ProfileResponse | ErrorType> => {
    try {
        const data = await Api.get("/profile");

        return data;
    } catch (error) {
        window.theFittingRoom.renderErrorModal();
        return ErrorHandler.NOT_FOUND;
    }
}
