import Api from './Api';
import { ErrorType, ProfileResponse } from '../types';
import ErrorHandler from './ErrorHandler';
import { Locale } from './Locale';

const { Strings } = Locale.getLocale();
const { getProfileErrorText } = Strings;

export const getProfile = async (): Promise<ProfileResponse | ErrorType> => {
    try {
        const data = await Api.get("/profile");

        return data;
    } catch (error) {
        window.theFittingRoom.renderErrorModal({errorText: getProfileErrorText});
        return ErrorHandler.getError(error?.code);
    }
}
